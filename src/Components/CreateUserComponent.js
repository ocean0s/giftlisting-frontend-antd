import { Button, Card, Input, Row, Col, Typography } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { backendURL } from "../Globals"
const {Text} = Typography

let CreateUserComponent = (props) => {

    let { createNotification } = props

    let [email, setEmail] = useState()
    let [username, setUsername] = useState()
    let [password, setPassword] = useState()

    let navigate = useNavigate()
    let [disabled, setDisabled] = useState(true)
    let [error, setError] = useState({})

    useEffect(() => {
        setDisabled(true)
    }, []) // Sin esto, al volver despues de desconectar, el botón se mantiene activo aunque los campos esten vacios

    useEffect( () => {
        checkErrors()
    }, [username, email, password])

    let checkErrors = () => {
        let newError = {}
        if (email != undefined && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
            newError.email = "Invalid email"
        if (password != undefined && password.length < 5)
            newError.password = "Password too short"
        if (username != undefined && username == "")
            newError.username = "Username cannot be empty"
        setError(newError)
        if ((newError.email != undefined || newError.password != undefined || newError.username != undefined) || email == undefined || username == undefined || password == undefined)
            setDisabled(true)
        else
            setDisabled(false)
    }

    let changeEmail = (e) => { setEmail(e.currentTarget.value) }
    let changeUsername = (e) => { setUsername(e.currentTarget.value) }
    let changePassword = (e) => { setPassword(e.currentTarget.value) }

    let clickCreate = async () => {
        let response = await fetch(backendURL+"/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        })

        if (response.ok) {
            createNotification("User created successfully")
            navigate("/login")
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
                <Card size="default" title="Register" style={{ minWidth: "300px", maxWidth: "500px"}}>
                    <Input onChange={changeEmail} size="large" type="email" placeholder="Email..." style={{marginBottom: "8px"}}></Input>
                    {error.email !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.email}</Text>}
                    <Input onChange={changeUsername} size="large" type="text" placeholder="Username..." style={{marginBottom: "8px"}}></Input>
                    {error.username !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.username}</Text>}
                    <Input onChange={changePassword} size="large" type="text" placeholder="Password..." style={{marginBottom: "8px"}}></Input>
                    {error.password !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.password}</Text>}
                    <Button disabled={disabled} block type="primary" onClick={clickCreate}>Create account</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default CreateUserComponent