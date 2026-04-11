import type { User } from '@/services/auth.service';
import React from 'react'

interface AuthenticationContextType {
    isAuthenticated: boolean;
    user: User | null;
    logout: () => void;
}

export const AuthenticationContext = React.createContext<AuthenticationContextType>({  isAuthenticated: false,
    user: null,
    logout: () => {},
})