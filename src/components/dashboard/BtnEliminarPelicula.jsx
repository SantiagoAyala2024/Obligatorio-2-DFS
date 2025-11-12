import { useTranslation } from 'react-i18next';
import api from '../../api/api'
import { useDispatch } from 'react-redux'
import { eliminarPelicula } from '../../features/pelicula.slice';
import { toast } from 'react-toastify'

const BtnEliminarPelicula = ({ id }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const confirmarYEliminar = async () => {
        const response = await api.delete(`v1/peliculas/${id}`);
        dispatch(eliminarPelicula({ peliculaId: id }));
        return response;
    };

    const handleDelete = () => {
        if (!id) return;

        toast(
            <div>
                <p>{t('confirmarEliminarPelicula')}</p>
                <button onClick={() => {
                    toast.dismiss();
                    toast.promise(confirmarYEliminar(), {
                        pending: t('eliminando'),
                        success: t('pelicula Eliminada'),
                        error: t('eliminarErrorPelicula')
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

export default BtnEliminarPelicula