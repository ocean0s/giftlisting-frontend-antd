import { useState, useEffect } from "react"
import { backendURL } from "../Globals"
import { Alert, Button, List, Card, Input, Typography, Row, Col } from "antd"
const { Text } = Typography

let FriendsComponent = (props) => {

    let { createNotification } = props
    let [friends, setFriends] = useState([])
    let [message, setMessage] = useState("")
    let [email, setEmail] = useState()
    let [errorEmail, setErrorEmail] = useState("")
    let [disabled, setDisabled] = useState(true)

    useEffect( () => {
        setDisabled(true)
        getFriends()
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

    let getFriends = async () => {
        let response = await fetch(backendURL + "/friends?apiKey=" + localStorage.getItem("apiKey"))
        let jsonData = await response.json()
        if (response.ok){
            setFriends(jsonData.friends)
        } else {
            setFriends({})
            setMessage(jsonData.error)
        }
    }

    let deleteFriend = async (email) => {
        let response = await fetch(backendURL + "/friends/" + email + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "DELETE"
        })
        if (response.ok) {
            createNotification("Friend deleted successfully")
            setFriends(friends.filter( f => f !== email ))
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let clickAdd = async () => {
        let response = await fetch(backendURL + "/friends/?apiKey=" + localStorage.getItem("apiKey"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emailFriend: email
            })
        })
        if (response.ok) {
            createNotification("Friend added successfully")
            setFriends([...friends, email])
            setEmail("")
            setDisabled(true)
            setMessage("")
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let changeEmail = (e) => { setEmail(e.currentTarget.value) }

    return (
        <>
            {message != "" && <Alert type="error" message={message}/>}
            <Row justify="center" style={{ height: "70vh", marginTop: "8px" }}>
                <Col>
                    <Card size="default" title="Add a friend" style={{ maxWidth: "900px", minWidth: "500px", marginBottom: "16px" }}>
                        <Input value={email} onChange={changeEmail} size="large" type="email" placeholder="Email..." style={{marginBottom: "8px"}}></Input>
                        {errorEmail !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{errorEmail}</Text>}
                        <Button disabled={disabled} block type="primary" onClick={clickAdd}>Add friend</Button>
                    </Card>
                    <List style={{ maxWidth: "900px", minWidth: "500px"}} bordered size="small" header={<h2 style={{ fontSize: "16px" }}>My friends' emails</h2>} dataSource={friends} renderItem={ f => 
                        <List.Item>
                            <Text>{f}</Text>
                            <Button onClick={() => deleteFriend(f)} danger style={{margin: "4px"}}>Delete</Button>
                        </List.Item>
                    }></List>
            </Col>
            </Row>
        </>
    )
}

export default FriendsComponent