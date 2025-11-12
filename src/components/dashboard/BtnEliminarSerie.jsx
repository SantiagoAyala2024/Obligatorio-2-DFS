import { useTranslation } from 'react-i18next';
import api from '../../api/api'
import { useDispatch } from 'react-redux'
import { eliminarSerie } from '../../features/serie.slice';
import { toast } from 'react-toastify';

const BtnEliminarSerie = ({ id }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const confirmarYEliminar = async () => {
        const response = await api.delete(`v1/series/${id}`);
        dispatch(eliminarSerie({ serieId: id }));
        return response;
    };

    const handleDelete = () => {

        if (!id) return;

        toast(
            <div>
                <p>{t('confirmarEliminarSerie')}</p>
                <button onClick={() => {
                    toast.dismiss();
                    toast.promise(confirmarYEliminar(), {
                        pending: t('eliminando'),
                        success: t('serie Eliminada'),
                        error: t('eliminarErrorSerie')
                    });
                }}>
                    ✓ Sí
                </button>
                <button onClick={() => toast.dismiss()}>✗ No</button>
            </div>,
            { autoClose: false }
        );
        
    } 

    return (
        <button className="btn btn-danger" onClick={handleDelete}>{t('eliminar')}</button>
    )
}

export default BtnEliminarSerie



