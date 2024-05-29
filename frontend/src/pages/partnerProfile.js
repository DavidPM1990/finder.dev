import React, { useContext, useEffect, useState } from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBProgress,
    MDBProgressBar,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem
} from 'mdb-react-ui-kit';
import { Link, useParams } from 'react-router-dom';
import { Context } from "../store/appContext";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

export default function PartnerProfile() {

    const { actions } = useContext(Context);
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = await actions.getProfilePartner(userId);
            setUserProfile(profile);
            setLoading(false);

            if (profile && profile.location) {
                const { lat, lng } = profile.location;
                fetchCityName(lat, lng);
            }
        };

        fetchProfile();
    }, [actions, userId]);

    const fetchCityName = async (latitude, longitude) => {
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
    };


    let latitude = 0;
    let longitude = 0;

    if (userProfile && userProfile.location) {
        latitude = userProfile.location.lat;
        longitude = userProfile.location.lng;
    }


    return (
        <section style={{ backgroundColor: '#eee' }}>
            <MDBContainer className="py-5 mt-5">
                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: '150px' }}
                                    fluid
                                />
                                <p className="text-muted mb-1">Full Stack Developer</p>
                                <p className="text-muted mb-4">{city}</p>
                                <div className="d-flex justify-content-around mb-2">
                                    <MDBBtn outline color="dark" rounded size="sm">+ Follow</MDBBtn>
                                    <MDBBtn outline color="dark" rounded size="sm">Add to favorite</MDBBtn>

                                    <Link
                                        to={`/`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}

                                    >
                                        <MDBBtn outline color="dark" rounded size="sm">Back to Users</MDBBtn>
                                    </Link>

                                </div>
                            </MDBCardBody>
                        </MDBCard>

                        <MDBCard className="mb-4 mb-lg-0">
                            <MDBCardBody className="p-0">
                                <MDBListGroup flush className="rounded-3">
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                        <MDBIcon fas icon="globe fa-lg text-warning" />
                                        <MDBCardText>https://mdbootstrap.com</MDBCardText>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                        <MDBIcon fab icon="github fa-lg" style={{ color: '#333333' }} />
                                        <MDBCardText>mdbootstrap</MDBCardText>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                        <MDBIcon fab icon="twitter fa-lg" style={{ color: '#55acee' }} />
                                        <MDBCardText>@mdbootstrap</MDBCardText>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                        <MDBIcon fab icon="instagram fa-lg" style={{ color: '#ac2bac' }} />
                                        <MDBCardText>mdbootstrap</MDBCardText>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                        <MDBIcon fab icon="facebook fa-lg" style={{ color: '#3b5998' }} />
                                        <MDBCardText>mdbootstrap</MDBCardText>
                                    </MDBListGroupItem>
                                </MDBListGroup>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <>
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <label>User Name</label>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <div>
                                                <h5>{userProfile ? userProfile.username : 'nombre'}</h5>
                                            </div>
                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <label>Favorite Programming Language</label>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <div>
                                                <h5>{userProfile ? userProfile.programming_language : 'programming_language'}</h5>
                                            </div>
                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        {loading ? (
                                            <div className="text-center">
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-2">Loading location...</p>
                                            </div>
                                        ) : userProfile?.location ? (
                                            <MapContainer center={[latitude, longitude]} zoom={12} style={{ height: '200px', width: '100%' }}>
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <Marker position={[latitude, longitude]} />
                                            </MapContainer>
                                        ) : (
                                            <p className="text-center">Location not available</p>
                                        )}
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <label>Description</label>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <div>
                                                <p>{userProfile ? userProfile.description : 'sadfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasf'}</p>
                                            </div>
                                        </MDBCol>
                                    </MDBRow>
                                </>
                            </MDBCardBody>
                        </MDBCard>

                        <MDBRow>
                            <MDBCol md="6">
                                <MDBCard className="mb-4 mb-md-0">
                                    <MDBCardBody>
                                        <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">assigment</span> Project Status</MDBCardText>
                                        <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</MDBCardText>
                                        <MDBProgress className="rounded">
                                            <MDBProgressBar width={80} valuemin={0} valuemax={100} />
                                        </MDBProgress>

                                        <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</MDBCardText>
                                        <MDBProgress className="rounded">
                                            <MDBProgressBar width={72} valuemin={0} valuemax={100} />
                                        </MDBProgress>

                                        <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</MDBCardText>
                                        <MDBProgress className="rounded">
                                            <MDBProgressBar width={89} valuemin={0} valuemax={100} />
                                        </MDBProgress>

                                        <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</MDBCardText>
                                        <MDBProgress className="rounded">
                                            <MDBProgressBar width={55} valuemin={0} valuemax={100} />
                                        </MDBProgress>

                                        <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</MDBCardText>
                                        <MDBProgress className="rounded">
                                            <MDBProgressBar width={66} valuemin={0} valuemax={100} />
                                        </MDBProgress>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>

                            <MDBCol md="6">
                                <MDBCard className="mb-4 mb-md-0">
                                    <MDBCardBody>
                                        <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">assigment</span> Project Status</MDBCardText>
                                        <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</MDBCardText>
                                        <MDBProgress className="rounded">
                                            <MDBProgressBar width={80} valuemin={0} valuemax={100} />
                                        </MDBProgress>

                                        <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</MDBCardText>
                                        <MDBProgress className="rounded">
                                            <MDBProgressBar width={72} valuemin={0} valuemax={100} />
                                        </MDBProgress>

                                        <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</MDBCardText>
                                        <MDBProgress className="rounded">
                                            <MDBProgressBar width={89} valuemin={0} valuemax={100} />
                                        </MDBProgress>

                                        <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</MDBCardText>
                                        <MDBProgress className="rounded">
                                            <MDBProgressBar width={55} valuemin={0} valuemax={100} />
                                        </MDBProgress>

                                        <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</MDBCardText>
                                        <MDBProgress className="rounded">
                                            <MDBProgressBar width={66} valuemin={0} valuemax={100} />
                                        </MDBProgress>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}
