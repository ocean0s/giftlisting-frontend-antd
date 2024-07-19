import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { Table, Button, Alert } from "antd"
import { useNavigate } from "react-router-dom"

let ListPresentsComponent = (props) => {

    let { createNotification } = props
    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")
    let navigate = useNavigate()

    useEffect(() => {
        getPresents()
    }, [])

    let getPresents = async () => {
        let response = await fetch(backendURL + "/presents?apiKey=" + localStorage.getItem("apiKey"))
        let jsonData = await response.json()
        if (response.ok) {
            setPresents(jsonData.presents)
        } else {
            setMessage(jsonData.error)
        }
    }

    let deletePresent = async (id) => {
        let response = await fetch(backendURL + "/presents/" + id + "?apiKey=" + localStorage.getItem("apiKey"), {
            method: "DELETE"
        })
        if (response.ok) {
            createNotification("Item deleted successfully")
            setPresents(presents.filter( p => p.id !== id ))
        } else {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let editPresent = async (id) => {
        navigate("/presents/edit/" + id)
    }

    let columns = [
        { title: "Name", dataIndex: "name" },
        { title: "Description", dataIndex: "description" },
        { title: "URL", dataIndex: "url"},
        { title: "Price", dataIndex: "price", render: (p) => (p + " €") },
        { title: "Chosen by", dataIndex: "chosenBy", render: (c) => (c == null ? "No one yet" : c) },
        { title: "List", dataIndex: "listName"},
        { title: "Actions", dataIndex: "id",
            render: (id) => (
                <>
                    <Button danger style={{margin: "4px"}} onClick={() => deletePresent(id)}>Delete</Button>
                    <Button style={{margin: "4px"}} onClick={() => editPresent(id)}>Edit</Button>
                </>)
        },
    ]

    return (
        <>
            <h2>My presents</h2>
            {message != "" && <Alert type="error" message={message}/>}
            <Table columns={columns} dataSource={presents} />
        </>
    )
}

export default ListPresentsComponent