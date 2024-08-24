import React, { createContext, useState, useContext } from 'react';

interface UserContextType {
    username: string;
    entitlements: string;
    otpVerified: boolean;
    setUsername: (username: string) => void;
    setEntitlements: (entitlements: string) => void;
    setOtpVerified: (otpVerified: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState<string>('');
    const [entitlements, setEntitlements] = useState<string>('');
    const [otpVerified, setOtpVerified] = useState<boolean>(false);

    return (
        <UserContext.Provider value={{ username, entitlements, otpVerified, setUsername, setEntitlements, setOtpVerified }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};





import React, { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SnackbarWrapper from '../utils/SnackbarWrapper';
import { useUser } from '../context/UserContext';
import { Roles } from '../constants/Roles.enum';

const Login = React.lazy(() => import('authMFE/Login'));

export const LoginPage: React.FC = () => {
    const [showSnackMessage, setShowSnackMessage] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();

    const { setUsername, setEntitlements, setOtpVerified } = useUser();
    const otpReducerState = useSelector((state: any) => state.otpReducer);

    const onLoginHandler = (data: any) => {
        if (!data) {
            setError(true);
            // TODO display error or appropriate UX
        }

        if (data.user) {
            // Store values from otpReducerState in the context
            setUsername(otpReducerState.userName);
            setEntitlements(otpReducerState.entitlements);
            setOtpVerified(otpReducerState.isOtpVerified);

            // Save token and session info
            infoStore.saveAccessToken('jwtToken', data.user.jwtToken);
            infoStore.saveUserSessionInfo(data.user.userId, data.user.subscriptionId, data.user.role);
            const url = data.user.role === Roles.ADMINISTRATOR ? '/entitlement' : '/dashboard';
            navigate(url);
        }
    };

    useEffect(() => {
        const urlParams = window.location.search;
        const params = new URLSearchParams(urlParams);
        const logout = params.get('logout');

        if (logout === 'success') {
            setShowSnackMessage(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            setShowSnackMessage(false);
        }
    }, []);

    return (
        <Suspense fallback="Loading...">
            <SnackbarWrapper open={showSnackMessage} onClose={setShowSnackMessage} />
            <Login onLoginHandler={onLoginHandler} />
        </Suspense>
    );
};
