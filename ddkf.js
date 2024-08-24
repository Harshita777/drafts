import React, { Suspense, useEffect, useState } from 'react';
import SnackbarWrapper from '../utils/SnackbarWrapper';
import { useNavigate, useParams } from 'react-router-dom';
// import { UserModel } from '../models/User'; TODO
import { infoStore } from '../redux/store/infoStore';
import { Roles } from '../constants/Roles.enum';

const Login = React.lazy(() => import('authMFE/Login'));

export const LoginPage: React.FC = () => {
    const [showSnackMessage, setShowSnackMessage] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const navigate = useNavigate();

    const onLoginHandler = (data: any) => {       
        if (!data) {
            setError(true);
            // TODO display error or approprite UX
        }

        if (data.user) {           
            infoStore.saveAccessToken('jwtToken', data.user.jwtToken);
            infoStore.saveUserSessionInfo(data.user.userId, data.user.subscriptionId, data.user.role)
            const url = data.user.role === Roles.ADMINISTRATOR ? '/entitlement' : '/dashboard';            
            navigate(url);
        }
    }

    useEffect(() => {
        const urlParams = window.location.search;
        const params = new URLSearchParams(urlParams);
        const logout = params.get('logout');

        if (logout === "success") {
            setShowSnackMessage(true);
            window.history.replaceState({}, document.title, window.location.pathname)
        } else {
            setShowSnackMessage(false);
        }
    }, []);

    return (<Suspense fallback="Loading...">
        <SnackbarWrapper open={showSnackMessage} onClose={setShowSnackMessage} />
        <Login onLoginHandler={onLoginHandler} />
    </Suspense>)
}
