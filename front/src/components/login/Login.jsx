import React, { useState } from 'react';
import './Login.css';
import google from '../../assets/google.svg';

export default function Login() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:3002/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const json = await response.json();

            if (json.token) {
                localStorage.setItem('token', json.token);
                window.location.href = '/';
            }
        } catch (error) {
            alert('Ocurrió un error al iniciar sesión');
        }
        
    };

    return (
        <section className="sectionForm">
            <form action="" className="loginForm" onSubmit={handleSubmit}>
                <div>
                    <img src={google} alt="" id="logoGoogle" />
                </div>

                <fieldset>
                    <legend>ingresa tu contraseña</legend>
                    <input
                        type="password"
                        placeholder="ingresa tu contraseña"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </fieldset>

                <fieldset>
                    <legend>ingresa tu correo electronico</legend>
                    <input
                        type="email"
                        placeholder="ingresa tu correo electronico"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </fieldset>

                <button type="submit">Siguiente</button>
            </form>
        </section>
    );
}