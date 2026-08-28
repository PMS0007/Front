import AuthService from '@/services/AuthService';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const useSignInForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const handleSubmit = async(e : React.FormEvent) => {
        e.preventDefault()
        try{
            const res = await AuthService.userSignIn({email, password})
            router.push("/dashboard")
            return res.data
        }
        catch (err) {
            console.log(err)
            setLoading(false)
        }

    }
    return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    loading,
    handleSubmit,
    togglePasswordVisibility
  };
}

export default useSignInForm
