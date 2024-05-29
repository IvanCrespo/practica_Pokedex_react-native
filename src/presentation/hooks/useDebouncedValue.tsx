import {useEffect, useState} from 'react'

export const useDebouncedValue = (input: string = '', time: number = 500) => {
    const [debouncedValue, setdebouncedValue] = useState(input)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setdebouncedValue(input)
        }, time)

        return () => {
            // Para limpieza
            clearTimeout(timeout)
        }
    }, [input])

    return debouncedValue
}
