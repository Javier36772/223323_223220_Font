import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './InviteBar.css';

const InviteBar = () => {
    const { id: documentId } = useParams();
    const [email, setEmail] = useState('');

    const inviteUser = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3002/documents/notifications/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({documentId, email})
        });

        const data = await response.json();

        if (data.success) {
            setEmail('');
            document.getElementById('userEmail').value = '';
            alert('Usuario invitado correctamente');
        }

        if (!data.success) {
            alert(data.message);
        }
        console.log(data);
    }

    const handleInputChange = (event) => {
        setEmail(event.target.value);
        console.log(email);
    };

    return (
        <div className="invite-bar">
            <div className="invite-form">
                <input id='userEmail' type="email" placeholder="Correo de Usuario:" onChange={handleInputChange} />
                <button className='button-invite' onClick={inviteUser}>Invitar a Colaborar</button>
            </div>
        </div>
    );
}

export default InviteBar;