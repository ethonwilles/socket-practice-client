import React from "react";
import openSocket from "socket.io-client";

import "./main.scss";

function App() {
  const [msg, setMessage] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [serverMessage, setServerMessage] = React.useState([]);
  const [rawMessage, setRawMessage] = React.useState("");
  const [socket, setSocket] = React.useState("");

  React.useEffect(() => {
    setSocket(openSocket("http://localhost:5000"));
  }, []);

  const sendMessage = e => {
    e.preventDefault();
    setServerMessage([...serverMessage, { msg: rawMessage, id: "recv" }]);

    console.log(msg);
  };
  const send = () => {
    socket.emit("private_chat", {
      message: rawMessage,
      username: username,
      to: "test2"
    });
    socket.on("private_chat", data => {
      setServerMessage([...serverMessage, data.messageRecv, data.messageBack]);
    });
    socket.on("private_message", data => {
      setServerMessage([...serverMessage, data.message]);
    });
  };
  const setChats = () => {
    return serverMessage.map(elem => {
      if (elem.id === "recv") {
        return <p className="userMsg">{elem.msg}</p>;
      } else if (elem.id === "res") {
        return <p className="recvMsg">{elem.msg}</p>;
      }
    });
  };
  return (
    <div className="App">
      <div className="output" id="output">
        {setChats()}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="enter Username"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="enter message"
          onChange={e => setRawMessage(e.target.value)}
        />
        <button type="submit" onClick={send}>
          Test
        </button>
      </form>
    </div>
  );
}

export default App;
