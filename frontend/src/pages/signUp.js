import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";
import '../styles/signUp.css';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBIcon,
    MDBRow,
    MDBCol
} from 'mdb-react-ui-kit';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

// Configurar el ícono de marcador de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

function SignUp() {
    const { actions } = useContext(Context);
    const [city, setCity] = useState('');

    const [location, setLocation] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const navigate = useNavigate();



    const handleCheck = async () => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`);
            const data = await response.json();
            if (data.length > 0) {
                const { lat, lon } = data[0];
                console.log('Latitude:', lat);
                console.log('Longitude:', lon);
                setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                setCity(`${lat},${lon}`); // Mantén city como una cadena
            } else {
                console.log('City not found');
            }
        } catch (error) {
            console.error('Error fetching city:', error);
        }
    };

    const notify = () => toast("User has been created!", {
        onClose: () => navigate("/login")
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!email || !username || !password) {
                throw new Error("Name, email, and password are required");
            }

            // Llamar a la función signUp con los parámetros requeridos
            await actions.createUser(username, email, password, selectedLanguage, location);

            // Limpiar los campos después de registrarse
            setUsername('');
            setEmail('');
            setPassword('');
            setCity('');
            setSelectedLanguage('');

            // Mostrar el toast
            notify();

            // Navegar a la página de inicio de sesión después de un breve retraso
            setTimeout(() => {
                navigate("/login");
            }, 3000); // 3000 milisegundos = 3 segundos

        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    console.log(city)

    const LocationMarker = () => {
        const map = useMap();
        if (location) {
            map.setView([location.lat, location.lng], 12);
            return <Marker position={[location.lat, location.lng]} />;
        }
        return null;
    };

    return (
        <MDBContainer fluid className='my-5'>
            <MDBRow className='g-0 align-items-center'>
                <MDBCol col='6'>
                    <MDBCard className='my-5 cascading-right' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
                        <MDBCardBody className='p-5 shadow-5 text-center'>
                            <h2 className="fw-bold mb-5">Sign up now</h2>
                            <MDBRow>
                                <MDBCol col='6'>
                                    <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='text' name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </MDBCol>
                                <MDBCol col='6'>
                                    <select className="form-select mb-4" id="form2" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                                        <option value="" disabled>Select your programming language</option>
                                        <option value="JavaScript">JavaScript</option>
                                        <option value="Python">Python</option>
                                        <option value="C++">C++</option>
                                        <option value="Java">Java</option>
                                        <option value="Ruby">Ruby</option>
                                        <option value="PHP">PHP</option>
                                    </select>
                                </MDBCol>
                            </MDBRow>
                            <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email' value={email} name="email" onChange={(e) => setEmail(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' label='City' id='form5' type='text' value={city} onChange={(e) => setCity(e.target.value)} />
                            <MDBBtn className='w-100 mb-4' size='md' onClick={handleCheck}>Check</MDBBtn>
                            <div style={{ height: '200px', marginBottom: '20px' }}>
                                <MapContainer
                                    center={[40.7128, -74.0060]}
                                    zoom={12}
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <LocationMarker />
                                </MapContainer>
                            </div>
                            <MDBBtn className='w-100 mb-4' size='md' onClick={handleSubmit}>Sign up</MDBBtn>
                            <ToastContainer
                                position="top-left"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="light"
                            />
                            <div className="text-center">
                                <p>or sign up with:</p>
                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='facebook-f' size="sm" />
                                </MDBBtn>
                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='twitter' size="sm" />
                                </MDBBtn>
                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='google' size="sm" />
                                </MDBBtn>
                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='github' size="sm" />
                                </MDBBtn>
                            </div>
                            <div className="text-start">
                                <p className="mb-0">Already have account <Link to="/login">Sign in here</Link>.</p>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol col='6'>
                    <img src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg" className="w-100 rounded-4 shadow-4" alt="" fluid />
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default SignUp;
