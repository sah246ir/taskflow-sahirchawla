import { ROUTES } from '@/config/routes'
import { AuthenticationContext } from '@/context/AuthenticationContext'
import { getMe } from '@/services/auth.service'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom"
export const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isError,data }= useQuery({
    queryKey: ['me3'],
    queryFn: getMe,
    enabled: true,
    staleTime: 0,
    gcTime: 0,
  })
  const navigate = useNavigate()
  useEffect(() => {
    if (isError) {
      navigate(ROUTES.LOGIN)
    }
  }, [isError])
  if (isLoading) return <div>Loading...</div>
  return (
    <AuthenticationContext.Provider value={{ isAuthenticated: !isError, user: isError ? null : (data?.data ?? null), logout: () => {
      localStorage.removeItem('token')
      window.location.href = ROUTES.LOGIN
    } }}>
      {children}
    </AuthenticationContext.Provider>
  )
}