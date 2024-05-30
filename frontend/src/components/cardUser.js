import React, { useState, useEffect, useContext } from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBTypography,
    MDBIcon,
    MDBBtn
} from 'mdb-react-ui-kit';
import "../styles/cardUser.css";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Context } from "../store/appContext";
import { Link } from 'react-router-dom';

export default function CardUser() {
    const { store, actions } = useContext(Context);
    const [currentCard, setCurrentCard] = useState(0);
    const [city, setCity] = useState('');
    const [loadingCity, setLoadingCity] = useState(false);
    const [randomUsers, setRandomUsers] = useState([]);
    const [followedUsers, setFollowedUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Obtener todos los usuarios
                await actions.getAllUsers();
                const userId = store.users.id;

                console.log("ID de usuario actual:", userId);

                // Obtener los usuarios seguidos por el usuario actual
                const followed = await actions.getFollowedUsers(userId);

                console.log("Usuarios seguidos por el usuario actual:", followed);

                // Generar una copia aleatoria de los usuarios
                const shuffledUsers = [...store.allUsers].sort(() => Math.random() - 0.5);

                // Almacenar la lista aleatoria de usuarios en el estado
                setRandomUsers(shuffledUsers);

                // Almacenar la lista de usuarios seguidos en el estado
                setFollowedUsers(Array.isArray(followed) ? followed.map(user => user.id) : []);
            } catch (error) {
                console.error("Error al obtener usuarios seguidos:", error);
            }
        };

        fetchUsers();
    }, []);



    useEffect(() => {
        if (randomUsers.length > 0) {
            const { location } = randomUsers[currentCard];
            if (location) {
                const { lat, lng } = location;
                fetchCityName(lat, lng);
            } else {
                setCity('Location not available');
            }
        }
    }, [currentCard, randomUsers]);

    const fetchCityName = async (latitude, longitude) => {
        setLoadingCity(true);
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const { address } = data;
            if (address) {
                const cityName = address.city || address.town || address.village || 'Unknown location';
                setCity(cityName);
            } else {
                setCity('Unknown location');
            }
        } catch (error) {
            console.error('Error fetching city name:', error);
            setCity('Error fetching location');
        }
        setLoadingCity(false);
    };

    const handleNext = () => {
        setCurrentCard((prevCard) => (prevCard + 1) % randomUsers.length);
    };

    const handleLike = async () => {
        const likedUserId = randomUsers[currentCard]?.id;
        if (likedUserId) {
            const success = await actions.likeUser(likedUserId);
            if (success) {
                setFollowedUsers([...followedUsers, likedUserId]);
            }
        }
    };

    const handleUnlike = async () => {
        const unlikedUserId = randomUsers[currentCard]?.id;
        if (unlikedUserId) {
            const success = await actions.dislikeUser(unlikedUserId);
            if (success) {
                setFollowedUsers(followedUsers.filter(id => id !== unlikedUserId));
            }
        }
    };

    const isFollowed = followedUsers.includes(randomUsers[currentCard]?.id);

    const userId = store.users.id

    // console.log(currentCard)
    console.log(userId)
    console.log(followedUsers)



    return (
        <section className="vh-100" style={{ backgroundColor: '#fcfcfc' }}>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="6" className="mb-4 mb-lg-0">
                        <TransitionGroup>
                            <CSSTransition
                                key={randomUsers[currentCard]?.id}
                                timeout={500}
                                classNames="card"
                            >
                                <MDBCard className="mb-3 card-hover" style={{ borderRadius: '.5rem' }}>
                                    <MDBRow className="g-0">
                                        <MDBCol md="4" className="mobile gradient-custom text-center text-white"
                                            style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                            {/* <MDBCardImage src={store.allUsers[currentCard]?.avatar_url} */}
                                            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                                alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                                            <MDBTypography tag="h5">{randomUsers[currentCard]?.username}</MDBTypography>
                                            <MDBCardText>Full Stack Developer</MDBCardText>
                                            <MDBIcon far icon="edit mb-5" />
                                        </MDBCol>
                                        <MDBCol md="8">
                                            <MDBCardBody className="p-4">
                                                <MDBTypography tag="h6">Information</MDBTypography>
                                                <hr className="mt-0 mb-4" />
                                                <MDBRow className="pt-1">
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6"><strong>Programming Language</strong></MDBTypography>
                                                        <MDBCardText className="text-muted">{randomUsers[currentCard]?.programming_language}</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6"><strong>Location</strong></MDBTypography>
                                                        <MDBCardText className="text-muted">
                                                            {loadingCity ? 'Loading...' : city}
                                                        </MDBCardText>
                                                    </MDBCol>
                                                </MDBRow>


                                                <div className="d-flex justify-content-start">
                                                    <a href="#!"><MDBIcon fab icon="facebook me-3" size="lg" /></a>
                                                    <a href="#!"><MDBIcon fab icon="twitter me-3" size="lg" /></a>
                                                    <a href="#!"><MDBIcon fab icon="instagram me-3" size="lg" /></a>
                                                </div>
                                                <div className='d-flex justify-content-around'>
                                                    {isFollowed ? (
                                                        <MDBBtn outline color="dark" rounded size="sm" onClick={handleUnlike}>- Unfollow</MDBBtn>
                                                    ) : (
                                                        <MDBBtn outline color="dark" rounded size="sm" onClick={handleLike}>+ Follow</MDBBtn>
                                                    )}
                                                    <Link
                                                        to={`/partner-profile/${randomUsers[currentCard]?.id}`}
                                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                                    >
                                                        <MDBBtn outline color="dark" rounded size="sm">See Profile</MDBBtn>
                                                    </Link>
                                                    <MDBBtn outline color="dark" rounded size="sm" className="mx-1" onClick={handleNext}>Next</MDBBtn>
                                                </div>
                                            </MDBCardBody>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBCard>
                            </CSSTransition>
                        </TransitionGroup>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}