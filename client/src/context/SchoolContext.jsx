import React, { createContext, useContext, useState, useEffect } from "react";

import { api } from '../utils/api'

const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
    const [schoolInfo, setSchoolInfo] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSchoolInfo = async () => {
            try {
                const response = await api.get('api/school/info')
                if (response.ok) {
                    const data = await response.json()
                    setSchoolInfo(data)
                    localStorage.setItem('schoolInfo', JSON.stringify(data))
                }

            } catch (error) {
                console.log('Error fetching school info:', error)
            } finally {
                setLoading(false)
            }
        }
        const cachedInfo = localStorage.getItem('schoolInfo')
        if (cachedInfo) {
            setSchoolInfo(JSON.parse(cachedInfo))
            setLoading(false)
        }

            fetchSchoolInfo()
        
    }, [])


    return (
        <SchoolContext.Provider value={{ schoolInfo, loading }}>
            {children}
        </SchoolContext.Provider>
    )
}

export const useSchoolInfo = () => {
    return useContext(SchoolContext)
}