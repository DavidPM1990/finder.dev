import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { MDBBtn } from 'mdb-react-ui-kit';
import Modal from '@mui/material/Modal';
import { Select, MenuItem, FormControl, InputLabel, Typography, TextField } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Context } from "../store/appContext";

// Configuración para el ícono del marcador, ya que los íconos predeterminados no funcionan con Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const getCoordinates = async (city) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`);
    const data = await response.json();
    if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } else {
        throw new Error('No se encontraron coordenadas para la ciudad especificada.');
    }
};

const UpdateMapView = ({ coordinates }) => {
    const map = useMap();

    useEffect(() => {
        map.setView([coordinates.lat, coordinates.lng], map.getZoom(), {
            animate: true
        });
    }, [coordinates, map]);

    return null;
};

const FilterModal = ({ open, onClose }) => {
    const [language, setLanguage] = useState('');
    const [city, setCity] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 }); // Coordenadas iniciales
    const [initialCoordinates] = useState({ lat: 51.505, lng: -0.09 }); // Coordenadas iniciales fijas
    const [users, setUsers] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]); // Nueva variable de estado para usuarios filtrados
    const { actions, store } = useContext(Context);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleApplyClick = async () => {
        try {
            const newCoordinates = await getCoordinates(city);
            setCoordinates(newCoordinates);
        } catch (error) {
            console.error("Error al obtener coordenadas:", error);
        }
    };

    const handleClose = () => {
        setCity('');
        onClose();
    };

    const filterUsers = () => {
        if (!language || !coordinates || !users.length) return;
        const tolerance = 0.0001;
        const filteredUsers = users.filter(user =>
            user.programming_language.toLowerCase() === language.toLowerCase() &&
            Math.abs(user.location.lat - coordinates.lat) < tolerance &&
            Math.abs(user.location.lng - coordinates.lng) < tolerance
        );

        setFilteredUsers(filteredUsers);
        handleClose();

    };



    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersToFilter = await actions.getAllUsers();
                setUsers(usersToFilter);
            } catch (error) {
                console.error("Error al obtener usuarios seguidos:", error);
            }
        }
        fetchUsers();
    }, []);

    // console.log(users);
    // console.log(coordinates)
    // console.log(language)
    console.log(filteredUsers)

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
                    Filter your Search
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="language-select-label">Programming Language</InputLabel>
                    <Select
                        labelId="language-select-label"
                        id="language-select"
                        value={language}
                        label="Programming Language"
                        onChange={handleLanguageChange}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                        <MenuItem value="rubi">Ruby</MenuItem>
                        <MenuItem value="c++">C++</MenuItem>
                        <MenuItem value="php">PHP</MenuItem>
                        {/* Añade más opciones según sea necesario */}
                    </Select>
                </FormControl>
                <Typography id="location-title" variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
                    Select Location
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                    <TextField
                        id="city-input"
                        label="City"
                        variant="outlined"
                        fullWidth
                        value={city}
                        onChange={handleCityChange}
                    />
                    <MDBBtn outline color="dark" rounded size="sm" className="mx-1" onClick={handleApplyClick}>
                        Apply
                    </MDBBtn>
                </Box>
                <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={12} style={{ height: '200px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[coordinates.lat, coordinates.lng]} />
                    <UpdateMapView coordinates={coordinates} />
                </MapContainer>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <MDBBtn outline color="dark" rounded size="m" onClick={handleClose}>Close</MDBBtn>
                    <MDBBtn outline color="dark" rounded size="m" onClick={filterUsers}>Search</MDBBtn>
                </Box>
            </Box>
        </Modal>
    );
}

export default FilterModal;
