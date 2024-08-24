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



{
    "status": "success",
    "user": {
        "userId": "MK001",
        "subscriptionId": "SUB001",
        "role": "Maker",
        "isOtpVerified": true,
        "username": "Imran",
        "entitlements": "{\"products\":[{\"_id\":{},\"id\":5,\"name\":\"Master\",\"checked\":true,\"parentId\":0,\"transType\":[{\"_id\":{},\"id\":7,\"name\":\"Master\",\"checked\":true,\"parentId\":5,\"subProduct\":[{\"_id\":{},\"id\":8,\"name\":\"Entitlement Management\",\"checked\":true,\"parentId\":7}]}]},{\"_id\":{},\"id\":6,\"name\":\"Queue\",\"checked\":true,\"parentId\":0,\"transType\":[{\"_id\":{},\"id\":8,\"name\":\"Queue\",\"checked\":true,\"parentId\":6,\"subProduct\":[{\"_id\":{},\"id\":9,\"name\":\"Pending Authorization\",\"checked\":true,\"parentId\":8}]}]},{\"_id\":{},\"id\":2,\"name\":\"View\",\"checked\":true,\"parentId\":0,\"transType\":[{\"_id\":{},\"id\":4,\"name\":\"View\",\"checked\":true,\"parentId\":2,\"subProduct\":[{\"_id\":{},\"id\":3,\"name\":\"Transaction Summary\",\"checked\":true,\"parentId\":4}]}]},{\"_id\":{},\"id\":3,\"name\":\"Dashboard\",\"checked\":true,\"parentId\":0,\"transType\":[{\"_id\":{},\"id\":5,\"name\":\"Dashboard\",\"checked\":false,\"parentId\":3,\"subProduct\":[{\"_id\":{},\"id\":7,\"name\":\"Dashboards\",\"checked\":false,\"parentId\":5}]}]},{\"_id\":{},\"id\":4,\"name\":\"Single Sign-On\",\"checked\":true,\"parentId\":0,\"transType\":[{\"_id\":{},\"id\":6,\"name\":\"Portal Access\",\"checked\":true,\"parentId\":4,\"subProduct\":[{\"_id\":{},\"id\":10,\"name\":\"Services Portal\",\"checked\":true,\"parentId\":6}]}]},{\"_id\":{},\"id\":1,\"name\":\"Payments\",\"checked\":false,\"parentId\":0,\"transType\":[{\"_id\":{},\"id\":2,\"name\":\"Basket\",\"checked\":false,\"parentId\":1,\"subProduct\":[{\"_id\":{},\"id\":4,\"name\":\"Salary WPS\",\"checked\":false,\"parentId\":2}]},{\"_id\":{},\"id\":3,\"name\":\"File Upload\",\"checked\":false,\"parentId\":1,\"subProduct\":[{\"_id\":{},\"id\":5,\"name\":\"Within Bank Transfer\",\"checked\":false,\"parentId\":3},{\"_id\":{},\"id\":6,\"name\":\"Telegraphic Transfer\",\"checked\":false,\"parentId\":3}]},{\"_id\":{},\"id\":1,\"name\":\"Unitary\",\"checked\":false,\"parentId\":1,\"subProduct\":[{\"_id\":{},\"id\":1,\"name\":\"Within Bank Transfer\",\"checked\":false,\"parentId\":1},{\"_id\":{},\"id\":2,\"name\":\"Telegraphic Transfer\",\"checked\":false,\"parentId\":1}]}]}],\"dailyLimit\":\"0\",\"transactionLimit\":\"Not Applicable\"}",
        "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJNSzAwMSIsInJvbGUiOiJNYWtlciIsInN1YnNjcmlwdGlvbklkIjoiU1VCMDAxIiwiaWF0IjoxNzI0NTA1ODIzLCJleHAiOjE3MjQ1MDk0MjN9.FrwjWF0Rx757gEGOGH3auGaFOfWq-P2nTTAwYY_OgkI"
    },
    "errors": []
}
