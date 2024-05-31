import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DirectChatPage from "../components/chat.js";


const ChatView = () => {




    return (
        <div style={{
            marginTop: "100px",
            position: 'relative', // Asegura que el posicionamiento absoluto del botón sea relativo a este contenedor
            height: '100vh', // Altura de la ventana completa
            backgroundImage: 'url("https://www.shutterstock.com/image-vector/vector-contact-us-pattern-seamless-600nw-2179791435.jpg")',
        }}
        >
            <DirectChatPage />
        </div>

    )
}

export default ChatView