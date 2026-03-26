import React from 'react';
import { AuthProvider } from "@asgardeo/auth-react";

interface AsgardeoProviderProps {
    children: React.ReactNode;
}

const AsgardeoProvider: React.FC<AsgardeoProviderProps> = ({ children }) => {
    // Fallback to hardcoded public IDs to ensure GitHub Pages robustness
    const clientID = "Z2km1fq9TGTrTAfHMOZ1omh1C44a";
    const baseUrl = "https://api.asgardeo.io/t/victask";

    const isLocal = window.location.hostname === 'localhost';
    const redirectURL = isLocal 
        ? "http://localhost:5173/Victask/" 
        : "https://kravenfr.github.io/Victask/";

    return (
        <AuthProvider
            config={{
                clientID: clientID, 
                baseUrl: baseUrl,
                signInRedirectURL: redirectURL, 
                signOutRedirectURL: redirectURL,
                scope: ["openid", "profile", "email"]
            }}
        >
            {children}
        </AuthProvider>
    );
};

export default AsgardeoProvider;
