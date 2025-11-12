import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../api/api'
import { actualizarPlan } from '../../features/usuario.slice'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const LIMIT_PLUS = 10

const Plan = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [premiumPlanId, setPremiumPlanId] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const { t } = useTranslation()

    const peliculas = useSelector(state => state.pelicula?.peliculas ?? [])
    const series = useSelector(state => state.serie?.series ?? [])
    const token = useSelector(state => state.auth?.token)

    const peliculasCount = peliculas.length
    const seriesCount = series.length

    useEffect(() => {
        let mounted = true
        api.get('v1/planes')
            .then(response => {
                const planes = Array.isArray(response.data) ? response.data : []
                let premium = planes.find(p => String(p.nombre || '').toLowerCase().includes('premium'))
                if (!premium && planes.length > 1) premium = planes[1]
                const id = premium?.id || premium?._id
                if (mounted) setPremiumPlanId(id || null)
            })
            .catch(err => console.error('Error al obtener planes:', err))
            .finally(() => mounted && setLoading(false))

        return () => { mounted = false }
    }, [])

    useEffect(() => {
        let mounted = true
        const fetchUser = async () => {
            if (!token) return
            try {
                const res = await api.get('v1/usuarios/')
                const user = res.data
                if (!mounted) return
                setCurrentUser(user)
                dispatch(actualizarPlan(user))
            } catch (error) {
                console.error('Error al obtener usuario actual:', error)
                if (error.response?.status === 401) {
                    toast.error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
                }
            }
        }

        fetchUser()

        return () => { mounted = false }

    }, [token, dispatch])

    const isPremium = Boolean(premiumPlanId && (currentUser?.plan === premiumPlanId || String(currentUser?.plan) === String(premiumPlanId)))

    const porcentajepelis = Math.min(100, Math.round((peliculasCount / LIMIT_PLUS) * 100))
    const porcentajeseries = Math.min(100, Math.round((seriesCount / LIMIT_PLUS) * 100))

    const onUpgrade = async () => {
        if (!currentUser?.id && !currentUser?._id) {
            toast.error('No se pudo identificar el usuario. Vuelve a iniciar sesión.')
            return
        }

        if (!premiumPlanId) {
            toast.error('No se pudo obtener el ID del plan Premium. Intenta más tarde.')
            return
        }

        try {
            setLoading(true)
            const response = await api.patch('v1/usuarios/', { plan: premiumPlanId })
            const updatedUser = response.data?.user || response.data

            if (!updatedUser) throw new Error('No se recibieron datos del usuario actualizado')

            const updatedUserData = {...currentUser, ...updatedUser, id: currentUser.id || currentUser._id, _id: currentUser._id || currentUser.id, plan: premiumPlanId}

            setCurrentUser(updatedUserData)
            dispatch(actualizarPlan(updatedUserData))

            toast.success('¡Plan actualizado exitosamente a Premium!')
        } catch (error) {
            console.error('Error actualizando plan:', error)
            toast.error('No se pudo actualizar el plan. Por favor intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="plan-info">
            <h3 className="section-title">{t("planActual")}</h3>

            {loading ? (
                <p>{t("cargandoPlan")}</p>
            ) : !isPremium ? (
                <>
                    <div className="plan-section">
                        <h4 className="plan-name">{t("planPlusPeliculas")}</h4>
                        <div className="usage-bar">
                            <div className="usage-fill plus" style={{ width: `${porcentajepelis}%` }} />
                        </div>
                        <p className="usage-text">
                            {peliculasCount}/{LIMIT_PLUS} {t("documentos")}
                            {peliculasCount >= LIMIT_PLUS && <span className="limit-warning"> {t("limiteAlcanzado")}</span>}
                        </p>
                    </div>

                    <div className="plan-section">
                        <h4 className="plan-name">{t("planPlusSeries")}</h4>
                        <div className="usage-bar">
                            <div className="usage-fill plus" style={{ width: `${porcentajeseries}%` }} />
                        </div>
                        <p className="usage-text">
                            {seriesCount}/{LIMIT_PLUS} {t("documentos")}
                            {seriesCount >= LIMIT_PLUS && <span className="limit-warning"> {t("limiteAlcanzado")}</span>}
                        </p>
                    </div>

                    <div className="plan-actions">
                        <button className="btn-upgrade" onClick={onUpgrade} disabled={loading}>
                            {loading ? t("actualizandoPlan") : t("actualizarAPremium")}
                        </button>
                    </div>
                </>
            ) : (
                <div className="plan-section premium-active">
                    <h4 className="plan-name">{t("planPremiumActivo")}</h4>
                    <div className="usage-bar">
                        <div className="usage-fill premium" style={{ width: '100%' }} />
                    </div>
                    <p className="usage-text">
                        {t("peliculas")}: {peliculasCount} · {t("series")}: {seriesCount}
                        <br />
                        <span className="premium-badge">{t("sinLimiteDocumentos")}</span>
                    </p>
                </div>
            )}
        </div>
    )
}

export default Plan