import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { MDBBtn } from 'mdb-react-ui-kit';
import Modal from '@mui/material/Modal';
import { Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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

export default function FilterModal({ open, onClose }) {

    const [language, setLanguage] = useState('');
    const latitudeVariable = 51.505; // Coordenadas de ejemplo
    const longitudeVariable = -0.09; // Coordenadas de ejemplo

    const [user, setUser] = useState('');


    const { actions, store } = useContext(Context);


    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const usersToFilter = await actions.getAllUsers();

                setUser(usersToFilter)


            } catch (error) {
                console.error("Error al obtener usuarios seguidos:", error);
            }

        }
        fetchUsers();
    }, []);

    console.log(user)

    return (
        <Modal
            open={open}
            onClose={onClose}
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
                        {/* Añade más opciones según sea necesario */}
                    </Select>
                </FormControl>
                <Typography id="location-title" variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
                    Select Location
                </Typography>
                <MapContainer center={[latitudeVariable, longitudeVariable]} zoom={12} style={{ height: '200px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[latitudeVariable, longitudeVariable]} />
                </MapContainer>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <MDBBtn outline color="dark" rounded size="m" onClick={onClose}>Close</MDBBtn>
                    <MDBBtn outline color="dark" rounded size="m">Search</MDBBtn>
                </Box>
            </Box>
        </Modal>
    );
}
