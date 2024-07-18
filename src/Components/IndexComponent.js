import Typography from "antd/es/typography/Typography"
let {Text, Title} = Typography

let IndexComponent = (props) => {

    let { login } = props

    if (login)
        return (
            <>
                <Title>Welcome to the gift app dasboard!</Title>
                <Text>Please, select one of the options in the menu bar at the top of the page to start.</Text>
            </>
        )
    else 
        return (
            <>
                <Title>Welcome to the gifts app!</Title>
                <Text>Please, log in to your account to access the user dashboard.</Text>
            </>
        )

}

export default IndexComponent