import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./DocumentsBar.css";

const DocumentsBar = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {

        const getDocuments = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    "http://localhost:3002/documents/permissions/users",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    }
                );
                const data = await response.json();
    
                console.log(data);
    
                setDocuments(data.documents);
            } catch (error) {
                console.error("Error al obtener los documentos", error);
            }
        };
    
        const getNewDocuments = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    "http://localhost:3002/documents/new/permissions/users",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    }
                );
                const data = await response.json();
        
                console.log(data);
        
                setDocuments((prevDocuments) => {
                    const newDocument = data.document;
                    if (!prevDocuments.find(doc => doc.id === newDocument.id)) {
                        return [...prevDocuments, newDocument];
                    } else {
                        return prevDocuments;
                    }
                });
            } catch (error) {
                console.error(error);
            } finally {
                getNewDocuments();
                // setTimeout(getNewPosts, 30000);
            }
        };

        getDocuments();
        getNewDocuments();

        // return () => {
        //     clearTimeout(getNewDocuments);
        //   }
    }, []);

    return (
        <div className="documentsBar">
            <div className="header">
                <h5>Mis Documentos</h5>
            </div>

            <div className="documents-list">
                {documents.length > 0 ? (
                    documents.map((document) => (
                        <Link
                            to={`/documents/${document.id}`}
                            key={document.id}
                        >
                            <div className="document">
                                <p className="title">{document.title}</p>
                                <p className="last-update">
                                    {document.updatedAt}
                                </p>
                                <p className="owner">{document.username}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No documents found.</p>
                )}
            </div>
        </div>
    );
};

export default DocumentsBar;
