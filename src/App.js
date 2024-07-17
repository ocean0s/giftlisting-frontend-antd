import { Layout, Menu } from "antd";
import { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";

function App() {

  let [login, setLogin] = useState(false)

  let { Header, Content, Footer } = Layout

  return (
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
            { key: "menuDisconnect", label: <Link to="#" /* onClick={disconnect} */>Disconnect</Link>},
          ]}>
          </Menu>
        )}
      </Header>
      <Content>
        <Routes>
          <Route path="/register" element={
            <p>Register</p>
          }></Route>
          <Route path="/login" element={
            <p>Login</p>
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
  );
}

export default App;
