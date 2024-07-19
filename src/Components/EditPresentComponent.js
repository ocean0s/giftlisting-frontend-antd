import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { backendURL } from "../Globals"
import { Descriptions, Row, Col, Button, Card, Input, Typography, Alert } from "antd"
const { Text } = Typography

let EditPresentComponent = (props) => {

    let {id} = useParams()
    let {createNotification} = props
    let [message, setMessage] = useState("")
    let [item, setItem] = useState({})
    let [itemOriginal, setItemOriginal] = useState({})
    let navigate = useNavigate()
    let [disabled, setDisabled] = useState(true)
    let [error, setError] = useState({})

    useEffect(() => {
        getItem()
        setDisabled(true)
    }, [])

    let getItem = async () => {
        let response = await fetch(backendURL+"/presents/" + id + "?apiKey=" + localStorage.getItem("apiKey"))
        if (response.ok) {
            let jsonData = await response.json()
            setItem(jsonData.present[0])
            setItemOriginal(jsonData.present[0])
        } else {
            setMessage("Error")
            setItem({})
        }
    }

    useEffect( () => {
        checkErrors()
    }, [item])

    let checkErrors = () => {
        let newError = {}
        if (item.url != undefined && item.url == "")
            newError.url = "URL cannot be empty"
        if (item.description != undefined && item.description == "")
            newError.description = "Description cannot be empty"
        if (item.name != undefined && item.name == "")
            newError.name = "Name cannot be empty"
        if (item.listName != undefined && item.listName == "")
            newError.listName = "List name cannot be empty"
        if ((item.price != undefined && isNaN(item.price)) || (!isNaN(item.price) && parseFloat(item.price) <= 0))
            newError.price = "Price has to be a positive number"
        setError(newError)
        if ((newError.url != undefined || newError.description != undefined || newError.name != undefined || newError.price != undefined || newError.listName != undefined)
             || item.url == undefined || item.description == undefined || item.name == undefined || item.price == undefined || item.listName == undefined)
            setDisabled(true)
        else
            setDisabled(false)
    }

    let clickEdit = async () => {
        let response = await fetch(backendURL+"/presents/" + id + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "PUT",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({
                url: item.url,
                name: item.name,
                description: item.description,
                price: parseFloat(item.price),
                listName: item.listName
            })
        })

        if (response.ok) {
            createNotification("Present edited successfully")
            navigate("/presents")
        } else {
            let jsonData = await response.json()
            if (Array.isArray(jsonData.error)){
                let error = ""
                jsonData.error.forEach(element => {
                    {error += element.error + "\n"}
                });
                createNotification(error)
            } else 
                createNotification(jsonData.error)
        }
    }

    let changeProperty = (propertyName, e) => {
        let itemNew = {...item, [propertyName] : e.currentTarget.value}
        setItem(itemNew)
    }

    return (
        <>
            {message != "" && <Alert type="error" message={message}/>}
            <Descriptions title={"Original item description: " + itemOriginal.name} bordered layout="vertical">
                <Descriptions.Item label="Description" span={3}>{itemOriginal.description}</Descriptions.Item>
                <Descriptions.Item span={1} label="Price">{itemOriginal.price}</Descriptions.Item>
                <Descriptions.Item span={2} label="URL">{itemOriginal.url}</Descriptions.Item>
                <Descriptions.Item label="Chosen by" span={2}>{itemOriginal.chosenBy == null ? "No one yet" : itemOriginal.chosenBy}</Descriptions.Item>
                <Descriptions.Item label="List" span={1}>{itemOriginal.listName}</Descriptions.Item>
            </Descriptions>
            <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
                <Col>
                    <Card size="default" title="Edit present" style={{ minWidth: "300px", maxWidth: "500px"}}>
                        <Input value={item.name} onChange={(e) => changeProperty("name",e)} size="large" type="text" placeholder="Name..." style={{marginBottom: "8px"}}></Input>
                        {error.name !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.name}</Text>}
                        <Input value={item.description} onChange={(e) => changeProperty("description",e)} size="large" type="text" placeholder="Description..." style={{marginBottom: "8px"}}></Input>
                        {error.description !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.description}</Text>}
                        <Input value={item.url} addonBefore="http://" onChange={(e) => changeProperty("url",e)} size="large" type="text" placeholder="URL..." style={{marginBottom: "8px"}}></Input>
                        {error.url !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.url}</Text>}
                        <Input value={item.price} onChange={(e) => changeProperty("price",e)} size="large" type="number" placeholder="Price..." style={{marginBottom: "8px"}}></Input>
                        {error.price !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.price}</Text>}
                        <Input value={item.listName} onChange={(e) => changeProperty("listName",e)} size="large" type="text" placeholder="List..." style={{marginBottom: "8px"}}></Input>
                        {error.listName !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.listName}</Text>}
                        <Button disabled={disabled} block type="primary" onClick={clickEdit}>Edit present</Button>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default EditPresentComponent