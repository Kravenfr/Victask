import React from 'react';
import { AuthProvider } from "@asgardeo/auth-react";

interface AsgardeoProviderProps {
    children: React.ReactNode;
}

const AsgardeoProvider: React.FC<AsgardeoProviderProps> = ({ children }) => {
    const clientID = import.meta.env.VITE_ASGARDEO_CLIENT_ID;
    const baseUrl = import.meta.env.VITE_ASGARDEO_BASE_URL;

    const redirectURL = window.location.origin + import.meta.env.BASE_URL;

    return (
        <AuthProvider
            config={{
                clientID: clientID, 
                baseUrl: baseUrl,
                signInRedirectURL: redirectURL, 
                signOutRedirectURL: redirectURL,
                scope: ["openid", "profile"]
            }}
        >
            {children}
        </AuthProvider>
    );
};

export default AsgardeoProvider;
