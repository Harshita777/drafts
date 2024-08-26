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
import { infoStore } from '../../redux/store/infoStore'
import Unauthorized from '../../layout/Unauthorized'
import { checkItemsStatus } from '../app.config'

type SecureRoute = {
    allowedPages?: string[];
}

const SecureRoute = (props) => {
    const { element, allowedRoles, redirectPath } = props;

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

        return <Navigate to={redirectPath} replace />

    }

    return element;
};

const entitlementJSON = infoStore.getEntitlement();
const entitlementData = entitlementJSON && JSON.parse(infoStore.getEntitlement()) || [];
const entitlements: any = checkItemsStatus(entitlementData, [
    'Pending Authorization',
    'Transaction Summary',
    'Dashboard',
    'Services Portal',
    'File Upload',
    'Within Bank Transfer',
    'Telegraphic Transfer'
]);

/** Application Routes */
export const routes = createBrowserRouter(
    [
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
            element: <SecureRoute element={<Layout />}
                allowedRoles={['Maker', 'Authorizer']}
                redirectPath="/entitlement" />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: 'dashboard',
                    element: <DashboardPage />
                },
                {
                    path: 'dashboard/payments',
                    element: <PaymentsPage entitlements={entitlements} />,
                },
                {
                    path: 'dashboard/payments/within-bank-transfer',
                    element: <WithinBankTransferPage  />
                },
                {
                    path: 'dashboard/payments/telegraphic-transfer',
                    element: <TelegraphicTransferPage />
                },
                {
                    path: 'dashboard/activities',
                    element: <PendingActivitiesPage />,
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
            element: <SecureRoute element={<Layout />} allowedRoles={['Administrator']} redirectPath="/dashboard" />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: 'entitlement',
                    element: <EntitlementPage />
                },
            ]
        },
        {
            path: "/unauthorized",
            element: <Unauthorized />
        },
        {
            path: "*",
            element: <ErrorPage />
        }
    ]
)

export default routes
