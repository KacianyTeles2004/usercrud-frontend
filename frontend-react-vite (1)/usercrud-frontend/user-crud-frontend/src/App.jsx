import React, { useState } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

function App() {
  const [refresh, setRefresh] = useState(false);

  const refreshUsers = () => setRefresh(!refresh);

  return (
    <div className="App">
      <h1>Gerenciador de Usuários</h1>
      <UserForm refreshUsers={refreshUsers} />
      <UserList refresh={refresh} />
    </div>
  );
}

export default App;
