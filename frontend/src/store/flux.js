const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            users: [],
            allUsers: [],
            userPartner: [],
            followedUsers: []

        },
        actions: {
            createUser: async (username, email, password, programming_language, location) => {
                try {
                    const resp = await fetch("http://localhost:5000/api/create_user", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: username,
                            email: email,
                            password: password,
                            programming_language: programming_language,
                            location: location
                        }),
                    });
                    const data = await resp.json();


                    setStore({ users: data });

                    return data;
                } catch (error) {
                    console.log("Error signing up", error);
                }
            },
            signIn: async (username, password) => {
                try {
                    const resp = await fetch("http://localhost:5000/api/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: username,
                            password: password
                        }),
                    });
                    const data = await resp.json();

                    // Actualiza el estado global con la información del usuario si la autenticación es exitosa
                    if (resp.ok) {
                        // Almacena el token en localStorage
                        localStorage.setItem("jwt-token", data.access_token);
                        console.log("User signed in successfully!");


                        // setStore({ users: data })

                        setStore({ users: { id: data.user_id } })





                        return data;
                    } else {
                        // Si hay un error, lógica para manejarlo (p. ej., mostrar un mensaje de error)
                        return false;
                    }

                } catch (error) {
                    console.log("Error signing in:", error);
                    return false;
                }
            },
            logOut: () => {
                // Borra el objeto user del estado global
                console.log("Executing logOut method");
                setStore({ users: [] });

                // Borra el token del almacenamiento local
                localStorage.removeItem("jwt-token");

                // Muestra un mensaje de éxito
                // toast.success("Has cerrado sesión correctamente");
            },
            getProfile: async (userId) => {
                try {
                    const token = localStorage.getItem("jwt-token");
                    const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        console.error("Error getting user profile:", data.message);
                        return null;
                    }

                    const data = await response.json();

                    if (JSON.stringify(data) !== JSON.stringify(getStore().users)) {
                        setStore({ users: data });
                    }

                    return data;
                } catch (error) {
                    console.error("Error getting user profile:", error);
                    return null;
                }
            },
            getProfilePartner: async (userId) => {
                try {
                    const response = await fetch(`http://localhost:5000/api/profile-partner/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        console.error("Error getting user profile:", data.message);
                        return null;
                    }

                    const data = await response.json();

                    return data;
                } catch (error) {
                    console.error("Error getting user profile:", error);
                    return null;
                }
            },
            editProfile: async (userId, updatedData) => {
                try {
                    const token = localStorage.getItem("jwt-token");
                    const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            username: updatedData.username,
                            email: updatedData.email,
                            password: updatedData.password,
                            programming_language: updatedData.programming_language,
                            location: updatedData.location,
                            avatar_url: updatedData.avatar_url,
                            description: updatedData.description
                        })
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        console.error("Error updating user profile:", data.message);
                        return null;
                    }

                    const updatedUser = await response.json(); // Obtener el usuario actualizado del backend
                    console.log("User profile updated:", updatedUser);

                    setStore(prevStore => ({
                        ...prevStore,
                        users: prevStore.users.map(user => {
                            if (user.id === updatedUser.id) {
                                return updatedUser;
                            }
                            return user;
                        })
                    }));

                } catch (error) {
                    console.error("Error updating user profile:", error);
                    return null;
                }
            },
            getAllUsers: async () => {
                try {
                    const token = localStorage.getItem("jwt-token");
                    const response = await fetch("http://localhost:5000/api/users", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        console.error("Error getting all users:", data.error);
                        return null;
                    }

                    const data = await response.json();

                    // Actualiza el estado global con la lista de todos los usuarios
                    setStore({ allUsers: data.users });

                    return data.users;
                } catch (error) {
                    console.error("Error getting all users:", error);
                    return null;
                }
            },
            likeUser: async (likedUserId) => {
                try {
                    const token = localStorage.getItem("jwt-token");
                    const response = await fetch(`http://localhost:5000/api/like/${likedUserId}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        console.error("Error liking user:", data.message);
                        return false;
                    }

                    const data = await response.json();
                    console.log("User liked successfully:", data.message);

                    // Obtiene el estado actual antes de actualizarlo
                    const currentFollowedUsers = getStore().followedUsers;

                    // Actualiza el estado con la nueva lista de followedUsers
                    setStore({ followedUsers: currentFollowedUsers });

                    // Comprueba si el followedUsers ha cambiado
                    if (currentFollowedUsers !== data.users) {
                        console.log("Followed users updated:", data.users);
                    }

                    return true;
                } catch (error) {
                    console.error("Error liking user:", error);
                    return false;
                }
            },
            dislikeUser: async (likedUserId) => {
                try {
                    const token = localStorage.getItem("jwt-token");
                    const response = await fetch(`http://localhost:5000/api/dislike/${likedUserId}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        console.error("Error disliking user:", data.message);
                        return false;
                    }

                    const data = await response.json();
                    console.log("User disliked successfully:", data.message);


                    const currentFollowedUsers = getStore().followedUsers;

                    // Actualiza el estado con la nueva lista de followedUsers
                    setStore({ followedUsers: currentFollowedUsers });

                    // Comprueba si el followedUsers ha cambiado
                    if (currentFollowedUsers !== data.users) {
                        console.log("Followed users updated:", data.users);
                    }

                    return true;
                } catch (error) {
                    console.error("Error disliking user:", error);
                    return false;
                }
            },
            getFollowedUsers: async (userId) => {
                try {
                    const token = localStorage.getItem("jwt-token");
                    const resp = await fetch(`http://localhost:5000/api/followed-users/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`

                        }
                    });

                    if (resp.ok) {
                        const followedUsers = await resp.json();
                        setStore({ followedUsers: followedUsers });
                        return followedUsers;
                    } else {
                        console.error("Error fetching followed users");
                        return false;
                    }
                } catch (error) {
                    console.error("Error fetching followed users:", error);
                    return false;
                }
            },
        },
    };
};

export default getState;
