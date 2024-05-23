import React, { useState } from 'react';
import './Signup.css';
import google from '../../assets/google.svg';

export default function Signup() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            email: email,
            password: password,
            userName: userName
        };

        try {
            const response = await fetch('http://localhost:3002/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const json = await response.json();

            if (json.token) {
                alert('Usuario creado correctamente');
                localStorage.setItem('token', json.token);
                window.location.href = '/login';
            }
        } catch (error) {
            alert('Ocurrió un error al crear usuario');
        }
        
    };

    return (
        <section className="sectionForm">
            <form action="" className="loginForm" onSubmit={handleSubmit}>
                <div>
                    <img src={google} alt="" id="logoGoogle" />
                </div>

                <fieldset>
                    <legend>ingresa tu correo electronico</legend>
                    <input
                        type="email"
                        placeholder="ingresa tu correo electronico"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </fieldset>

                <fieldset>
                    <legend>ingresa tu username</legend>
                    <input
                        type="text"
                        placeholder="ingresa tu username"
                        value={userName}
                        onChange={handleUserNameChange}
                    />
                </fieldset>

                <fieldset>
                    <legend>ingresa tu contraseña</legend>
                    <input
                        type="password"
                        placeholder="ingresa tu contraseña"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </fieldset>

                <button type="submit">Siguiente</button>
            </form>
        </section>
    );
}