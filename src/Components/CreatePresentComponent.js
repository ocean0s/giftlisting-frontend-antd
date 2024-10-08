import { Button, Card, Input, Row, Col, Typography } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { backendURL } from "../Globals"
const {Text} = Typography

let CreatePresentComponent = (props) => {

    let { createNotification } = props

    let [url, setUrl] = useState()
    let [name, setName] = useState()
    let [description, setDescription] = useState()
    let [price, setPrice] = useState()
    let [listName, setListName] = useState()

    let navigate = useNavigate()
    let [disabled, setDisabled] = useState(true)
    let [error, setError] = useState({})

    useEffect(() => {
        setDisabled(true)
    }, [])

    useEffect( () => {
        checkErrors()
    }, [name, url, description, price, listName])

    let checkErrors = () => {
        let newError = {}
        if (url != undefined && url == "")
            newError.url = "URL cannot be empty"
        if (description != undefined && description == "")
            newError.description = "Description cannot be empty"
        if (name != undefined && name == "")
            newError.name = "Name cannot be empty"
        if (listName != undefined && listName == "")
            newError.listName = "List name cannot be empty"
        if ((price != undefined && isNaN(price)) || (!isNaN(price) && parseFloat(price) <= 0))
            newError.price = "Price has to be a positive number"
        setError(newError)
        if ((newError.url != undefined || newError.description != undefined || newError.name != undefined || newError.price != undefined || newError.listName != undefined)
             || url == undefined || description == undefined || name == undefined || price == undefined || listName == undefined)
            setDisabled(true)
        else
            setDisabled(false)
    }

    let changeUrl = (e) => { setUrl(e.currentTarget.value) }
    let changeName = (e) => { setName(e.currentTarget.value) }
    let changeDescription = (e) => { setDescription(e.currentTarget.value) }
    let changePrice = (e) => { setPrice(e.currentTarget.value) }
    let changeListName = (e) => { setListName(e.currentTarget.value) }

    let clickCreate = async () => {
        let response = await fetch(backendURL+"/presents?apiKey=" + localStorage.getItem("apiKey"), {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({
                url: url,
                name: name,
                description: description,
                price: parseFloat(price),
                listName: listName
            })
        })

        if (response.ok) {
            createNotification("Present created successfully")
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

    return (
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col>
                <Card size="default" title="Create a present" style={{ minWidth: "300px", maxWidth: "500px"}}>
                    <Input onChange={changeName} size="large" type="text" placeholder="Name..." style={{marginBottom: "8px"}}></Input>
                    {error.name !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.name}</Text>}
                    <Input onChange={changeDescription} size="large" type="text" placeholder="Description..." style={{marginBottom: "8px"}}></Input>
                    {error.description !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.description}</Text>}
                    <Input addonBefore="http://" onChange={changeUrl} size="large" type="text" placeholder="URL..." style={{marginBottom: "8px"}}></Input>
                    {error.url !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.url}</Text>}
                    <Input onChange={changePrice} size="large" type="number" placeholder="Price..." style={{marginBottom: "8px"}}></Input>
                    {error.price !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.price}</Text>}
                    <Input onChange={changeListName} size="large" type="text" placeholder="List..." style={{marginBottom: "8px"}}></Input>
                    {error.listName !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.listName}</Text>}
                    <Button disabled={disabled} block type="primary" onClick={clickCreate}>Create present</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default CreatePresentComponent