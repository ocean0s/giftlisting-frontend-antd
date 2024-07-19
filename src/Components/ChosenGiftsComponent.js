import { useEffect, useState } from "react"
import { backendURL } from "../Globals"
import { Table, Alert } from "antd"

let ChosenGiftsComponent = (props) => {

    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")

    useEffect(() => {
        getPresents()
    }, [])

    let getPresents = async () => {
        let response = await fetch(backendURL + "/presents/gifting?apiKey=" + localStorage.getItem("apiKey"))
        let jsonData = await response.json()
        if (response.ok) {
            setPresents(jsonData.presents)
        } else {
            setMessage(jsonData.error)
        }
    }

    let columns = [
        { title: "Name", dataIndex: "name" },
        { title: "Description", dataIndex: "description" },
        { title: "URL", dataIndex: "url"},
        { title: "Price", dataIndex: "price", render: (p) => (p + " €") },
        { title: "List", dataIndex: "listName"},
        { title: "Email", dataIndex: "email"},
    ]

    return (
        <>
            <h2>My gifts to friends</h2>
            {message != "" && <Alert type="error" message={message}/>}
            <Table columns={columns} dataSource={presents} />
        </>
    )
}

export default ChosenGiftsComponent