import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalEditarSerie from './ModalEditarSerie';

const BtnEditarSerie = ({ serie }) => {
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
            
            <ModalEditarSerie 
                serie={serie}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default BtnEditarSerie;