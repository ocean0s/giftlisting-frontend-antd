import { useState, useEffect } from "react"
import { backendURL } from "../Globals"
import { Alert, Button, Table, Card, Input, Typography, Row, Col } from "antd"
import { SearchOutlined, GiftOutlined } from '@ant-design/icons';
const { Text } = Typography

let GiftPresentComponent = (props) => {

    let { createNotification } = props
    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")
    let [email, setEmail] = useState()
    let [errorEmail, setErrorEmail] = useState("")
    let [disabled, setDisabled] = useState(true)

    useEffect( () => {
        setDisabled(true)
    }, [])

    useEffect( () =>  {
        let error = ""
        if (email != undefined && email != "" && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
            error = "Invalid email"
        setErrorEmail(error) // prevent race condition
        if (error != "" || email == undefined || email == "")
            setDisabled(true)
        else
            setDisabled(false)
    }, [email])

    let getPresents = async () => {
        let response = await fetch(backendURL + "/presents?userEmail=" + email + "&apiKey=" + localStorage.getItem("apiKey"))
        let jsonData = await response.json()
        if (response.ok) {
            setPresents(jsonData.presents)
        } else {
            setMessage(jsonData.error)
        }
    }

    let clickGift = async (id) => {
        let response = await fetch(backendURL + "/presents/" + id + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "PUT"
        })
        if (response.ok) {
            createNotification("Present chosen successfully")
            setMessage("")
            getPresents()
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let changeEmail = (e) => { setEmail(e.currentTarget.value) }

    let columns = [
        { title: "Name", dataIndex: "name" },
        { title: "Description", dataIndex: "description" },
        { title: "URL", dataIndex: "url"},
        { title: "Price", dataIndex: "price", render: (p) => (p + " €") },
        { title: "Chosen by", dataIndex: "chosenBy", render: (c) => (c == null ? "No one yet" : c) },
        { title: "List", dataIndex: "listName" },
        { title: "Actions", dataIndex: "id",
            render: (id, present) => (
                <>
                    <Button disabled={present.chosenBy != null} icon={<GiftOutlined />} style={{margin: "4px"}} onClick={() => clickGift(id)}>Choose present</Button>
                </>)
         },
    ]

    return (
        <>
            {message != "" && <Alert type="error" message={message}/>}
            <Row justify="center" style={{ marginBottom: "16px", marginTop: "8px" }}>
                <Col>
                    <Card size="default" title="Search friend's gifts" style={{ maxWidth: "900px", minWidth: "500px", marginBottom: "16px" }}>
                        <Input value={email} onChange={changeEmail} size="large" type="email" placeholder="Email..." style={{marginBottom: "8px"}}></Input>
                        {errorEmail !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{errorEmail}</Text>}
                        <Button icon={<SearchOutlined />} disabled={disabled} block type="primary" onClick={getPresents}>Search gifts</Button>
                    </Card>
                </Col>
            </Row>
            <Table columns={columns} dataSource={presents} />
        </>
    )
}

export default GiftPresentComponent