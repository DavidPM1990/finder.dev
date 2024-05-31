import React, { useState } from 'react';
import { ChatEngine, getOrCreateChat } from 'react-chat-engine';
import { PrettyChatWindow } from 'react-chat-engine-pretty';


const DirectChatPage = ({ projectID, userName, userSecret }) => {
    const [username, setUsername] = useState('');

    function createDirectChat(creds) {
        getOrCreateChat(
            creds,
            { is_direct_chat: true, usernames: [username] },
            () => setUsername('')
        );
    }

    function renderChatForm(creds) {
        return (
            <div>
                <input
                    placeholder='Username'
                    // value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button onClick={() => createDirectChat(creds)}>
                    Create
                </button>
            </div>
        );
    }

    return (
        <PrettyChatWindow

            height='80vh'
            projectID={projectID}
            userName={userName}
            userSecret={userSecret}
            renderNewChatForm={(creds) => renderChatForm(creds)}
        />
    );
};

export default DirectChatPage;