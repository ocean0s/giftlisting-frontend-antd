
import { Button, Card, Input, Row, Col, Typography } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { backendURL } from "../Globals"
const {Text} = Typography

let LoginUserComponent = (props) => {

    let { createNotification, setLogin } = props

    let [email, setEmail] = useState()
    let [password, setPassword] = useState()
    let [disabled, setDisabled] = useState(false)
    let [error, setError] = useState({})

    let navigate = useNavigate()

    useEffect( () => {
        checkErrors()
    }, [email, password])

    let checkErrors = () => {
        let newError = {}
        if (email != undefined && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
            newError.email = "Invalid email"
        if (password != undefined && password.length < 5)
            newError.password = "Password too short"
        setError(newError)
        if (error.email != undefined || error.password != undefined)
            setDisabled(true)
        else
            setDisabled(false)
    }


    let changeEmail = (e) => { setEmail(e.currentTarget.value) }
    let changePassword = (e) => { setPassword(e.currentTarget.value) }

    let clickLogin= async () => {
        let response = await fetch(backendURL+"/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        let jsonData = await response.json()
        if (response.ok) {
            localStorage.setItem("apiKey", jsonData.apiKey)
            localStorage.setItem("id", jsonData.id)
            localStorage.setItem("email", jsonData.email)
            setLogin(true)
            navigate("/")
        } else {
            if (Array.isArray(jsonData.error)){
                let error = ""
                jsonData.error.forEach(element => {
                    {error += element + "\n"}
                });
                createNotification(error)
            } else 
                createNotification(jsonData.error)
        }
    }

    return (
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col>
                <Card size="default" title="Login" style={{ minWidth: "300px", maxWidth: "500px"}}>
                    <Input onChange={changeEmail} size="large" type="email" placeholder="Email..." style={{marginBottom: "8px"}}></Input>
                    {error.email !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.email}</Text>}
                    <Input onChange={changePassword} size="large" type="text" placeholder="Password..." style={{marginBottom: "8px"}}></Input>
                    {error.password !== undefined && <Text style={{marginBottom: "8px", display:"inline-block"}} type="danger">{error.password}</Text>}
                    <Button disabled={disabled} block type="primary" onClick={clickLogin}>Login</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default LoginUserComponent