const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            users: [],
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
                    console.log(data);

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
                        return true;
                    } else {
                        // Si hay un error, lógica para manejarlo (p. ej., mostrar un mensaje de error)
                        return false;
                    }

                } catch (error) {
                    console.log("Error signing in:", error);
                    return false;
                }
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
                    console.log("User profile:", data);
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
                    return updatedUser;
                } catch (error) {
                    console.error("Error updating user profile:", error);
                    return null;
                }
            },
        },
    };
};

export default getState;
