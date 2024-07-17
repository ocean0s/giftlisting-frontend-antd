import { Layout, Menu } from "antd";
import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import CreateUserComponent from "./Components/CreateUserComponent";
import LoginUserComponent from "./Components/LoginUserComponent";
import { notification as antNotif } from "antd"
import { backendURL } from "./Globals";
import ListPresentsComponent from "./Components/ListPresentsComponent";
import CreatePresentComponent from "./Components/CreatePresentComponent";
import EditPresentComponent from "./Components/EditPresentComponent";
import FriendsComponent from "./Components/FriendsComponent";

function App() {

  const [api, contextHolder] = antNotif.useNotification()
  let [login, setLogin] = useState(false)
  let navigate = useNavigate()
  let { Header, Content, Footer } = Layout

  let createNotification = (msg, description="", type = "info", placement = "top") => {
    api[type]({
      message: msg,
      description: description,
      placement
    })
  }

  useEffect( () => {
    checkLogin()
  }, [])

  let checkLogin = async () => {
    let apiKey = localStorage.getItem("apiKey")
    if (apiKey == null) {
      setLogin(false)
    } else {
      let response = await fetch(backendURL + "/friends?apiKey=" + apiKey)
      if (response.ok)
        setLogin(true)
      else{
        setLogin(false)
        localStorage.removeItem("apiKey")
        navigate("/login")
      }
    }
  }

  let disconnect = async () => {
    await fetch(backendURL + "/users/disconnect?apiKey=" + localStorage.getItem("apikey"),
      {method: "POST"})
    localStorage.removeItem("apiKey")
    setLogin(false)
    navigate("/login")
  }

  return (
    <>
      {contextHolder}
      <Layout style={{ minHeight: "100vh"}}>
        <Header>
          {!login ? (
            <Menu theme="dark" mode="horizontal" items={[
              { key: "menuRegister", label: <Link to="/register">Register</Link>},
              { key: "menuLogin", label: <Link to="/login">Login</Link>},
            ]}>
            </Menu>
          ) : (
            <Menu theme="dark" mode="horizontal" items={[
              { key: "menuIndex", label: <Link to="/">Index</Link>},
              { key: "menuPresents", label: <Link to="/presents">Presents</Link>},
              { key: "menuCreatePresent", label: <Link to="/presents/create">Create a present</Link>},
              { key: "menuFriends", label: <Link to="/friends">Friends</Link>},
              { key: "menuGift", label: <Link to="/presents/friends">Gift a friend</Link>},
              { key: "menuDisconnect", label: <Link to="#" onClick={disconnect} >Disconnect</Link>},
            ]}>
            </Menu>
          )}
        </Header>
        <Content style={{ padding: "20px 50px" }}>
          <Routes>
            <Route path="/register" element={
              <CreateUserComponent createNotification={createNotification}/>
            }></Route>
            <Route path="/login" element={
              <LoginUserComponent createNotification={createNotification} setLogin={setLogin}/>
            }></Route>
            <Route path="/" element={
              <p>Index</p>
            }></Route>
            <Route path="/presents" element={
              <ListPresentsComponent createNotification={createNotification}/>
            }></Route>
            <Route path="/presents/create" element={
              <CreatePresentComponent createNotification={createNotification}/>
            }></Route>
            <Route path="/presents/edit/:id" element={
              <EditPresentComponent createNotification={createNotification}/>
            }></Route>
            <Route path="/friends" element={
              <FriendsComponent createNotification={createNotification}/>
            }></Route>
            <Route path="/presents/friends" element={
              <p>Gift a friend</p>
            }></Route>
          </Routes>
        </Content>
        <Footer style={{textAlign:"center"}}>
            Presents App &copy;
        </Footer>
      </Layout>
    </>
  );
}

export default App;
