import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";

const Users = () => {

    const [userId, setUserId] = useState("");

    const { store } = useContext(Context);



    useEffect(() => {
        const getUserId = async () => {
            try {
                const userIdStore = await store.currentUser.id;

                setUserId(userIdStore);

            } catch (error) {
                console.error('Error getting user ID:', error);
            }
        };
        getUserId();
    }, [userId]);

    return (
        <div>
            <h1>Users</h1>
        </div>
    );
};

export default Users;