import { useState, useEffect } from "react"
import { backendURL } from "../Globals"
import { Alert, Button, List, Card, Input, Typography, Row, Col } from "antd"
const { Text } = Typography

let FriendsComponent = (props) => {

    let { createNotification } = props
    let [friends, setFriends] = useState([])
    let [message, setMessage] = useState("")
    let [email, setEmail] = useState()
    let [listName, setListName] = useState()
    let [errorEmail, setErrorEmail] = useState("")
    let [errorListName, setErrorListName] = useState("")
    let [disabled, setDisabled] = useState(true)

    useEffect( () => {
        setDisabled(true)
        getFriends()
    }, [])

    useEffect( () =>  {
        let errorEmail = ""
        let errorListName = ""
        if (email != undefined && email != "" && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            errorEmail = "Invalid email"
        }
        setErrorEmail(errorEmail) // prevent race condition
        if (listName != undefined && listName == ""){
            errorListName = "Invalid list name"
        }
        setErrorListName(errorListName)
        if (errorEmail != "" || email == undefined || email == "" || errorListName != "" || listName == undefined || listName == "")
            setDisabled(true)
        else
            setDisabled(false)
    }, [email, listName])

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

    let deleteFriend = async (email, listName) => {
        let response = await fetch(backendURL + "/friends/" + email + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                listName: listName
            })
        })
        if (response.ok) {
            createNotification("Friend deleted successfully")
            setFriends(friends.filter( f => (f.emailFriend !== email || f.listName !== listName ) ))
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
                emailFriend: email,
                listName: listName
            })
        })
        if (response.ok) {
            createNotification("Friend added successfully")
            setFriends([...friends, {emailFriend: email, listName: listName}])
            setEmail("")
            setListName("")
            setDisabled(true)
            setMessage("")
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let changeEmail = (e) => { setEmail(e.currentTarget.value) }
    let changeListName = (e) => { setListName(e.currentTarget.value) }

    return (
        <>
            {message != "" && <Alert type="error" message={message}/>}
            <Row justify="center" style={{ height: "70vh", marginTop: "8px" }}>
                <Col>
                    <Card size="default" title="Add a friend" style={{ width: "700px",  marginBottom: "16px" }}>
                        <Input value={email} onChange={changeEmail} size="large" type="email" placeholder="Email..." style={{marginBottom: "8px"}}></Input>
                        {errorEmail !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{errorEmail}</Text>}
                        <Input value={listName} onChange={changeListName} size="large" type="text" placeholder="List..." style={{marginBottom: "8px"}}></Input>
                        {errorListName !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{errorListName}</Text>}
                        <Button disabled={disabled} block type="primary" onClick={clickAdd}>Add friend to list</Button>
                    </Card>
                    <List style={{ width: "700px" }} bordered size="small" header={<h2 style={{ fontSize: "16px" }}>My friends' emails</h2>} dataSource={friends} renderItem={ f => 
                        <List.Item>
                            <Text>{f.emailFriend}</Text>
                            <Text>{"List: " + f.listName}</Text>
                            <Button onClick={() => deleteFriend(f.emailFriend, f.listName)} danger style={{margin: "4px"}}>Delete</Button>
                        </List.Item>
                    }></List>
            </Col>
            </Row>
        </>
    )
}

export default FriendsComponent