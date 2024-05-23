import React, { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import InviteBar from "../inviteBar/InviteBar";

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];

const TextEditor = () => {
    const { id: documentId } = useParams();
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const [docName, SetDocName] = useState();

    const wrapperRef = useCallback((wrapper) => {
        if (!wrapper) return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS },
        });
        q.disable();
        q.setText("Loading...");
        setQuill(q);
    }, []);

    useEffect(() => {
        if (socket == null || quill == null) return;

        // Variable para controlar si los cambios provienen del usuario local
        let isLocalChange = false;

        // Effect para manejar los cambios de texto y emitir los cambios al servidor
        const textChangeHandler = (content, oldDelta, source) => {
            if (source !== "user" || isLocalChange) return;
            socket.emit("server:receive_document_changes", content);
        };
        quill.on("text-change", textChangeHandler);

        // Effect para recibir los cambios del servidor y actualizar el editor
        const receiveChangesHandler = (content) => {
            isLocalChange = true;
            quill.updateContents(content);
            isLocalChange = false;
        };
        socket.on("server:send_document_changes", receiveChangesHandler);

        socket.on("server:send_changes_error", (data) => {
            console.log(data);
        });

        const interval = setInterval(() => {
            if (!isLocalChange) {
                socket.emit("document:set_content", {
                    content: quill.getContents().ops[0].insert,
                    documentId: documentId,
                });
            }
        }, 2000);

        socket.on("document:set_content_success", (data) => {
            console.log(data);
        });

        socket.on("document:set_content_error", (data) => {
            console.log(data);
        });

        // Effect para limpiar los event listeners
        return () => {
            quill.off("text-change", textChangeHandler);
            socket.off("server:send_document_changes", receiveChangesHandler);
            clearInterval(interval);
        };
    }, [socket, quill]);

    useEffect(() => {
        const s = io("http://localhost:3001", {
            auth: {
                token: localStorage.getItem("token"),
            },
        });

        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket == null || quill == null) return;

        socket.emit("document:get_content", documentId);

        socket.once("document:get_content_success", (document) => {
            const delta = quill.clipboard.convert(document.content);
            quill.setContents(delta, "api");
            quill.enable();
            SetDocName(document.title ? document.title : "Untitled Document");
        });

        socket.once("document:get_content_error", (data) => {
            console.log(data);
        });
    }, [socket, quill, documentId]);

    useEffect(() => {
        if (socket == null || quill == null) return;
        socket.emit("document:rename", {
            title: docName,
            documentId: documentId,
        });

        socket.once("document:rename_success", (data) => {
            console.log(data);
        });

        socket.once("document:rename_error", (data) => {
            console.log(data);
        });
    }, [docName, socket]);

    return (
        <>
            <div className="top-0 fixed z-10 w-full bg-[#f3f3f3] flex justify-center">
                <input
                    type="text"
                    placeholder="Untitled Document"
                    value={docName}
                    className="p-2 bg-transparent focus:outline-zinc-600"
                    onChange={(e) => SetDocName(e.target.value)}
                />
                
                <InviteBar />
            </div>

            <div className="container" ref={wrapperRef}></div>
        </>
    );
};

export default TextEditor;
