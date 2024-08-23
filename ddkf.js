import React, { useState, useEffect } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '../../page/LoginPage'
import { ErrorPage, Layout } from '../../layout'
import { DashboardPage } from '../../page/DashboardPage'
import { EntitlementPage } from '../../page/EntitlementPage'
import { WithinBankTransferPage } from '../../page/WithinBankTransferPage'
import { TelegraphicTransferPage } from '../../page/TelegraphicTransferPage'
import { PaymentsPage } from '../../page/PaymentsPage'
import { FileUploadPage } from '../../page/FileUploadPage'
import { FileVerifyPage } from '../../page/FileVerify'
import { PendingActivitiesPage } from '../../page/PendingActivitiesPage'
import { TransactionPage } from '../../page/TransactionPage'
import { infoStore } from '../../redux/store/infoStore'
// import jwtDecode, { JwtDecodeOptions, JwtHeader, JwtPayload } from 'jwt-decode';

const SecureRoute = ({ element, allowedRoles, redirectPath }) => {
    const token = infoStore.getAccessToken('jwtToken');
    const role = infoStore.getRole();
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (redirect) {
            const timer = setTimeout(() => {
                setRedirect(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [redirect]);

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        setRedirect(true);
        return (
            <div>
                You don't have access to this route
                {redirect && <Navigate to={redirectPath} />}
            </div>
        );
    }

    return element;
};

/** Application Routes */
export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" /> 
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/",
        element: <SecureRoute element={<Layout />} allowedRoles={['Maker', 'Auth']} redirectPath="/dashboard" />,
        errorElement: <ErrorPage />,
        children: [
            {
                path:'dashboard',
                element: <DashboardPage />
            },
            {
                path:'dashboard/payments',
                element: <PaymentsPage/>,
            },
            {
                path: 'dashboard/payments/within-bank-transfer',                
                element: <WithinBankTransferPage />
            },
            {
                path: 'dashboard/payments/telegraphic-bank-transfer',                
                element: <TelegraphicTransferPage />
            },
            {
                path:'dashboard/activities',
                element: <PendingActivitiesPage/>,
            },
            {
                path: 'dashboard/payments/file-upload',                
                element: <FileUploadPage />
            },
            {
                path: 'dashboard/payments/file-verify',                
                element: <FileVerifyPage />
            },
        ]
    },
    {
        path: "/",
        element: <SecureRoute element={<Layout />} allowedRoles={['Administrator']} redirectPath="/entitlement" />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'entitlement',
                element: <EntitlementPage />
            },
        ]
    },
    {
        path: "*",
        element: <ErrorPage />
    }
])

export default routes
