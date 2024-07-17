import { Layout, Menu } from "antd";
import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import CreateUserComponent from "./Components/CreateUserComponent";
import LoginUserComponent from "./Components/LoginUserComponent";
import { notification as antNotif } from "antd"
import { backendURL } from "./Globals";

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

  // useEffect( () => {
  //   setLogin(localStorage.getItem("apiKey") != null) // improve later TODO
  // }, [])

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
              <p>Present list</p>
            }></Route>
            <Route path="/presents/create" element={
              <p>Present creation</p>
            }></Route>
            <Route path="/present/edit/:id" element={
              <p>Register</p>
            }></Route>
            <Route path="/friends" element={
              <p>Register</p>
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
