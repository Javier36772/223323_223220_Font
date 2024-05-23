import { useEffect, useState } from 'react';
import './NotificationsBox.css';

const NotificationsBox = () => {
    const [notifications, setNotifications] = useState([]);

    const getNotifications = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3002/documents/notifications/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });

        const data = await response.json();
        console.log(data);
        setNotifications(data.notifications);
    }

    useEffect(() => {
        getNotifications();
        const interval = setInterval(() => {
            getnNewNotifications();
        },3000)
        const getnNewNotifications = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3002/documents/notifications/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            });
    
            const data = await response.json();

            console.log(data);
    
            setNotifications(data.notifications);
        }

        return () => {
            clearInterval(interval);
        }
    }, []);

    const responseNotification = async (notificationId, response, documentId, invitedId) => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3002/documents/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({notificationId, response, documentId, invitedId})
        });

        const data = await res.json();
        console.log(data);
    }

    return (
        <div className="notifications-box">
            <div className="header">
                <h5>Notificaciones</h5>
            </div>

            <div className="notifications-list">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div key={notification.id} className='notification'>
                            <p>{notification.username} te ha invitado a colaborar en el documento <strong>{notification.title}</strong></p>
                            <div className="notification-buttons">
                                <button className='accept-button' onClick={() => responseNotification(notification.id, 'accept', notification.documentId, notification.invitedId)}>Aceptar</button>
                                <button className='reject-button' onClick={() => responseNotification(notification.id, 'reject')}>Rechazar</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No notifications found.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationsBox;