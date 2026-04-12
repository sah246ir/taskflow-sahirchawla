import { ROUTES } from '@/config/routes'
import { AuthenticationContext } from '@/context/AuthenticationContext'
import { getMe } from '@/services/auth.service'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2Icon } from 'lucide-react'
import { Typeface } from '@/components/ui/typeface'

function AuthFullScreenLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-5 bg-background/95 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-10 py-12 shadow-lg">
        <Loader2Icon
          className="size-10 animate-spin text-primary"
          aria-hidden
        />
        <div className="flex flex-col items-center gap-1 text-center">
          <Typeface as="p" size="sm" variant="medium" color="primary">
            Verifying your session
          </Typeface>
          <Typeface as="p" size="xs" color="secondary">
            One moment…
          </Typeface>
        </div>
      </div>
      <span className="sr-only">Loading, please wait</span>
    </div>
  )
}

export const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isError, data } = useQuery({
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
  }, [isError, navigate])
  if (isLoading) return <AuthFullScreenLoader />
  return (
    <AuthenticationContext.Provider value={{ isAuthenticated: !isError, user: isError ? null : (data?.data ?? null), logout: () => {
      localStorage.removeItem('token')
      window.location.href = ROUTES.LOGIN
    } }}>
      {children}
    </AuthenticationContext.Provider>
  )
}