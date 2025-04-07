import React, { useEffect, useState } from "react";
import api from "../utils/api";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get("/usuarios");
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Status</th>
            <th>Grupo</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.ativo ? "Ativo" : "Inativo"}</td>
              <td>{user.grupo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;