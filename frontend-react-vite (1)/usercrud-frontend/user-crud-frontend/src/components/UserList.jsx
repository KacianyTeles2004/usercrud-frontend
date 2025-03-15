import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function UserList({ refresh }) {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users/list");
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuários", err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.post("/users/toggle?id=" + id);
      loadUsers();
    } catch (err) {
      console.error("Erro ao alternar usuário", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [refresh]);

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} - {u.email} - {u.active ? "Ativo" : "Inativo"}
            <button onClick={() => handleToggle(u.id)}>Ativar/Inativar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
