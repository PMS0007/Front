import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/AuthService';
import Link from 'next/link';

export function useLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);



    try {
      const res = await AuthService.userLogin({ email, password });
      if (res.user?.is_hotel_staff){
        router.push("/staff")
        
      }
      else {
      router.push("/dashboard")


      }
    

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    error,
    loading,
    handleSubmit,
  };
}