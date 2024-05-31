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
import { useParams } from 'react-router-dom';
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

export default function Profile() {
    const { actions, store } = useContext(Context);
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [city, setCity] = useState('');
    const [editing, setEditing] = useState(false);
    const [latitudeVariable, setLatitudeVariable] = useState(null);
    const [longitudeVariable, setLongitudeVariable] = useState(null);
    const [editingCity, setEditingCity] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [followers, setFollowers] = useState([]);


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await actions.getProfile(userId);

                const followed = await actions.getFollowedUsers(userId);

                setFollowers(followed);


                setUser(userData);

                // Obtener ciudad desde las coordenadas
                if (userData.location) {
                    const { lat, lng } = userData.location;

                    setLatitudeVariable(lat);
                    setLongitudeVariable(lng);
                    const cityData = await fetchCityFromCoordinates(lat, lng);
                    setCity(cityData);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserProfile();

        // Add the dependency array to ensure this effect only runs once after the initial render
    }, []);


    const fetchCityFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await response.json();
            const city = data.address?.city;
            return city || 'Ciudad no encontrada';
        } catch (error) {
            console.error('Error fetching city:', error);
            return 'Error obteniendo la ciudad';
        }
    };

    const fetchCoordinatesFromCity = async (city) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`);
            const data = await response.json();
            if (data.length > 0) {
                const { lat, lon } = data[0];
                return { lat: parseFloat(lat), lng: parseFloat(lon) };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            return null;
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = async () => {
        const updatedData = {
            username: user.username,
            email: user.email,
            password: newPassword ? newPassword : undefined, // Solo enviar la contraseña si se ha proporcionado una nueva
            programming_language: user.programming_language,
            location: {
                lat: latitudeVariable,
                lng: longitudeVariable
            },
            avatar_url: user.avatar_url,
            description: user.description
        };

        // Actualiza latitudeVariable y longitudeVariable antes de guardar
        const cityData = await fetchCityFromCoordinates(latitudeVariable, longitudeVariable);
        setCity(cityData);

        const updatedUser = await actions.editProfile(userId, updatedData);
        if (updatedUser) {
            setUser(updatedUser);
            setEditing(false);
        } else {
            console.error("Failed to update profile");
        }
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleCheck = async () => {
        const coordinates = await fetchCoordinatesFromCity(editingCity);
        if (coordinates) {
            setLatitudeVariable(coordinates.lat);
            setLongitudeVariable(coordinates.lng);
            setUser((prevUser) => ({
                ...prevUser,
                location: {
                    lat: coordinates.lat,
                    lng: coordinates.lng
                }
            }));
        } else {
            console.error('City not found');
        }
    };

    const likes_received = user ? user.likes_received.length : 0;


    console.log(likes_received)
    console.log(user)

    return (
        <section style={{ backgroundColor: '#000000' }}>
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
                                <div className="d-flex justify-content-around rounded-3 p-2 mb-2"
                                    style={{ backgroundColor: '#efefef' }}>
                                    <div>
                                        <p className="small text-muted mb-1">Projects</p>
                                        <p className="mb-0">0</p>
                                    </div>
                                    <div className="px-3">
                                        <p className="small text-muted mb-1">Followers</p>
                                        <p className="mb-0">{likes_received.length ? likes_received.length : 0}</p>
                                    </div>
                                    <div>
                                        <p className="small text-muted mb-1">Following</p>
                                        <p className="mb-0">{followers.length}</p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center mb-2">
                                    {!editing && <MDBBtn onClick={handleEdit}>Edit</MDBBtn>}
                                    {editing && <MDBBtn onClick={handleSave} outline className="ms-1">Save</MDBBtn>}
                                    {editing && <MDBBtn onClick={handleCancel} outline className="ms-1">Cancel</MDBBtn>}
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
                                {user && (
                                    <>
                                        <MDBRow>
                                            <MDBCol sm="3">
                                                <label><strong>User Name</strong></label>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <input
                                                    type="text"
                                                    value={user.username}
                                                    disabled={!editing}
                                                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                                                    className='w-100'

                                                />
                                            </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                            <MDBCol sm="3">
                                                <label><strong>Email</strong></label>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <input
                                                    type="email"
                                                    value={user.email}
                                                    disabled={!editing}
                                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                                    className='w-100'
                                                />
                                            </MDBCol>

                                        </MDBRow>
                                        <hr />
                                        {editing && <MDBRow>
                                            <MDBCol sm="3">
                                                <label><strong>Password</strong></label>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <input
                                                    type="password"
                                                    disabled={!editing}
                                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                                    className='mb-2 w-100'
                                                />
                                            </MDBCol>
                                            <hr />
                                        </MDBRow>}
                                        <MDBRow>
                                            <MDBCol sm="3">
                                                <label><strong>Programming Language</strong></label>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <select
                                                    className="form-select"
                                                    value={user.programming_language}
                                                    disabled={!editing}
                                                    onChange={(e) => setUser({ ...user, programming_language: e.target.value })}
                                                >
                                                    <option value="JavaScript">JavaScript</option>
                                                    <option value="Python">Python</option>
                                                    <option value="C++">C++</option>
                                                    <option value="Java">Java</option>
                                                    <option value="Ruby">Ruby</option>
                                                    <option value="PHP">PHP</option>
                                                </select>
                                            </MDBCol>
                                        </MDBRow>
                                        <hr />
                                        {editing && <MDBRow>
                                            <MDBCol sm="3">
                                                <label><strong>Location</strong></label>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                <input
                                                    type="text"
                                                    value={editingCity}
                                                    disabled={!editing}
                                                    onChange={(e) => setEditingCity(e.target.value)}
                                                    className='w-100'

                                                />
                                            </MDBCol>
                                            <MDBBtn outline className="m-2" onClick={handleCheck}>Check</MDBBtn>
                                            <hr />
                                        </MDBRow>}
                                        <MDBRow>
                                            {latitudeVariable && longitudeVariable ? (
                                                <MapContainer center={[latitudeVariable, longitudeVariable]} zoom={12} style={{ height: '200px', width: '100%' }}>
                                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                    <Marker position={[latitudeVariable, longitudeVariable]} />
                                                </MapContainer>
                                            ) : (
                                                <p>Loading map...</p>
                                            )}
                                        </MDBRow>
                                        <hr />
                                        <MDBRow>
                                            <MDBCol sm="3">
                                                <label><strong>Description</strong></label>
                                            </MDBCol>
                                            <MDBCol sm="9">
                                                {editing ? (
                                                    <textarea
                                                        value={user.description}
                                                        onChange={(e) => setUser({ ...user, description: e.target.value })}
                                                        className='w-100'
                                                    />
                                                ) : (
                                                    <p>{user.description}</p>
                                                )}
                                            </MDBCol>
                                        </MDBRow>
                                    </>
                                )}
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
