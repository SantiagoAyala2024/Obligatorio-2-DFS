import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalEditarPelicula from './ModalEditarPelicula';

const BtnEditarPelicula = ({ pelicula }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEdit = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button className="btn btn-edit" onClick={handleEdit}>
                <i className="fas fa-edit"></i> {t('editar')}
            </button>
            
            <ModalEditarPelicula 
                pelicula={pelicula}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default BtnEditarPelicula;