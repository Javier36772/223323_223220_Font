import React from 'react'

import Navbar from '../navbar/Navbar';
import DocumentsBar from '../documentsBar/DocumentsBar';
import { useNavigate } from 'react-router-dom';
import '../../index.css';

import { v4 as uuidV4 } from "uuid"
import { useState, useEffect } from 'react'

import { io } from 'socket.io-client'

const Home = () => {
    const navigate = useNavigate()

    const [socket, setSocket] = useState();

    useEffect(() => {
        const s = io("http://localhost:3001", {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        setSocket(s);
        console.log(s)
        return () => {
            s.disconnect();
        }
    }, []);

    useEffect(() => {
        if (socket == null) return;

        const createDocumentHandler = async () => {
            // socket.emit('document:create', { title: 'Untitled Document' });
    
            // socket.once('document:create_success', document => {
            //     console.log(document);
            //     navigate(`/documents/${document.id}`);
            // });

            // socket.once('document:create_error', data => {
            //     console.log(data);
            // });

            const response = await fetch('http://localhost:3002/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    title: 'Untitled Document'
                })
            });

            const data = await response.json();

            if (data.success) {
                navigate(`/documents/${data.document.id}`);
            }
        }

        const handleClick = () => {
            createDocumentHandler();
        }

        const button = document.querySelector('.create-document-button');
        button.addEventListener('click', handleClick);

        return () => {
            button.removeEventListener('click', handleClick);
        }
    },[socket, navigate]);

    return (

        <div className=' bg-neutral-100'>
            <Navbar />
            <p className='text-center m-4 text-zinc-600'>Start a new document</p>

            <div className='flex justify-center gap-5 flex-wrap'>

                <div className='h-[250px] w-[180px] border border-zinc-200 bg-white 
                    cursor-pointer flex justify-center items-center hover:border-blue-400 create-document-button'>

                <img src="add.png" alt="" />

                </div>
            </div>

            <DocumentsBar />
        </div>
    )
}

export default Home;