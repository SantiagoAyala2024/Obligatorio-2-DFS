import React from 'react'
import { useTranslation } from 'react-i18next'

const NoEncontrado = () => {
    const { t } = useTranslation()
    
    return (
        <div>
            {t("noEncontrado")}
        </div>
    )
}

export default NoEncontrado