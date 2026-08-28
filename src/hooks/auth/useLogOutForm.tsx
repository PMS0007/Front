'use client'

import AuthService from '@/services/AuthService'
import { useRouter } from 'next/navigation';

export const useLogOutForm = () => {
    const router = useRouter();
    const handleSubmit = async () => {
        try {
            const res = await AuthService.LogOut() 
            router.push("/")
            
            return res?.data || res
        } catch (err) {
            console.error('Logout error:', err)
            throw err
        }
    }


    return { handleSubmit }
}

export default useLogOutForm