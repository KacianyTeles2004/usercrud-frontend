import React, { useState } from "react";
import api from "../utils/api";
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/login", { email, password });
            onLogin(response.data); // Salva os dados do usuário logado
        } catch (err) {
            setError("Credenciais inválidas. Tente novamente.");
        }
    };

    return (
        <div className="login-container">
            <h1>MVP Locker</h1>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Senha:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Entrar</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;