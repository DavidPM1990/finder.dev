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

    useEffect(() => {
        actions.getAllUsers();
    }, []);

    useEffect(() => {
        if (store.allUsers.length > 0) {
            const { location } = store.allUsers[currentCard];
            if (location) {
                const { lat, lng } = location;
                fetchCityName(lat, lng);
            } else {
                setCity('Location not available');
            }
        }
    }, [currentCard, store.allUsers]);

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
        setCurrentCard((prevCard) => (prevCard + 1) % store.allUsers.length);
    };

    return (
        <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="6" className="mb-4 mb-lg-0">
                        <TransitionGroup>
                            <CSSTransition
                                key={store.allUsers[currentCard]?.id}
                                timeout={500}
                                classNames="card"
                            >
                                <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                                    <MDBRow className="g-0">
                                        <MDBCol md="4" className="mobile gradient-custom text-center text-white"
                                            style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                            <MDBCardImage src={store.allUsers[currentCard]?.avatar_url}
                                                alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                                            <MDBTypography tag="h5">{store.allUsers[currentCard]?.username}</MDBTypography>
                                            <MDBCardText>Full Stack Developer</MDBCardText>
                                            <MDBIcon far icon="edit mb-5" />
                                        </MDBCol>
                                        <MDBCol md="8">
                                            <MDBCardBody className="p-4">
                                                <MDBTypography tag="h6">Information</MDBTypography>
                                                <hr className="mt-0 mb-4" />
                                                <MDBRow className="pt-1">
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6">Programming Language</MDBTypography>
                                                        <MDBCardText className="text-muted">{store.allUsers[currentCard]?.programming_language}</MDBCardText>
                                                    </MDBCol>
                                                    <MDBCol size="6" className="mb-3">
                                                        <MDBTypography tag="h6">Location</MDBTypography>
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
                                                <div>
                                                    <MDBBtn outline color="dark" rounded size="sm">+ Follow</MDBBtn>
                                                    <Link
                                                        to={`/partner-profile/${store.allUsers[currentCard]?.id}`}
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
