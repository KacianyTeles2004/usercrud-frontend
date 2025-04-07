import React, { useState } from "react";
import api from "../services/api";

export default function UserForm({ refreshUsers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/create", { name, email, password });
      alert("Usuário criado com sucesso!");
      setName("");
      setEmail("");
      setPassword("");
      refreshUsers();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar usuário");
    }
  };

  return (
    <form onSubmit={handleCreateUser}>
      <h2>Criar Usuário</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
