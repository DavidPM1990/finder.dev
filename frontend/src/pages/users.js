import React, { useState } from 'react';
import CardUser from '../components/cardUser';
import FilterModal from '../components/filterModal';
import "../styles/users.css";
import { MDBBtn } from 'mdb-react-ui-kit';

const Users = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className='mt-5 pe-5'>
            <div className='d-flex justify-content-end'>
                <MDBBtn outline color="dark" rounded size="m" className='' onClick={handleOpenModal}>Filter</MDBBtn>
            </div>
            <div className=''>
                <CardUser />
            </div>
            <FilterModal open={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Users;
