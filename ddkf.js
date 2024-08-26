import React, { useState, useEffect } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../../page/LoginPage';
import { ErrorPage, Layout } from '../../layout';
import { DashboardPage } from '../../page/DashboardPage';
import { EntitlementPage } from '../../page/EntitlementPage';
import { WithinBankTransferPage } from '../../page/WithinBankTransferPage';
import { TelegraphicTransferPage } from '../../page/TelegraphicTransferPage';
import { PaymentsPage } from '../../page/PaymentsPage';
import { FileUploadPage } from '../../page/FileUploadPage';
import { FileVerifyPage } from '../../page/FileVerify';
import { PendingActivitiesPage } from '../../page/PendingActivitiesPage';
import { infoStore } from '../../redux/store/infoStore';
import Unauthorized from '../../layout/Unauthorized';
import { checkItemsStatus } from '../app.config';

type SecureRouteProps = {
    element: React.ReactElement;
    allowedRoles?: string[];
    redirectPath: string;
    entitlementKey?: string; // New prop to specify entitlement key
};

const SecureRoute: React.FC<SecureRouteProps> = ({ element, allowedRoles, redirectPath, entitlementKey }) => {
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
        return <Navigate to={redirectPath} replace />;
    }

    // Check entitlement for specific route
    if (entitlementKey && !entitlements[entitlementKey]) {
        return <Navigate to="/unauthorized" replace />;
    }

    return element;
};

const entitlementJSON = infoStore.getEntitlement();
const entitlementData = (entitlementJSON && JSON.parse(entitlementJSON)) || [];
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
            element: <SecureRoute element={<Layout />} allowedRoles={['Maker', 'Authorizer']} redirectPath="/entitlement" />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: 'dashboard',
                    element: (
                        <SecureRoute
                            element={<DashboardPage />}
                            allowedRoles={['Maker', 'Authorizer']}
                            redirectPath="/unauthorized"
                            entitlementKey="Dashboard" // Check entitlement for Dashboard
                        />
                    )
                },
                {
                    path: 'dashboard/payments',
                    element: (
                        <SecureRoute
                            element={<PaymentsPage entitlements={entitlements} />}
                            allowedRoles={['Maker', 'Authorizer']}
                            redirectPath="/unauthorized"
                            entitlementKey="Transaction Summary" // Check entitlement for Payments
                        />
                    )
                },
                {
                    path: 'dashboard/payments/within-bank-transfer',
                    element: (
                        <SecureRoute
                            element={<WithinBankTransferPage />}
                            allowedRoles={['Maker', 'Authorizer']}
                            redirectPath="/unauthorized"
                            entitlementKey="Within Bank Transfer" // Check entitlement for Within Bank Transfer
                        />
                    )
                },
                {
                    path: 'dashboard/payments/telegraphic-transfer',
                    element: (
                        <SecureRoute
                            element={<TelegraphicTransferPage />}
                            allowedRoles={['Maker', 'Authorizer']}
                            redirectPath="/unauthorized"
                            entitlementKey="Telegraphic Transfer" // Check entitlement for Telegraphic Transfer
                        />
                    )
                },
                {
                    path: 'dashboard/activities',
                    element: (
                        <SecureRoute
                            element={<PendingActivitiesPage />}
                            allowedRoles={['Maker', 'Authorizer']}
                            redirectPath="/unauthorized"
                            entitlementKey="Pending Authorization" // Check entitlement for Pending Activities
                        />
                    )
                },
                {
                    path: 'dashboard/payments/file-upload',
                    element: (
                        <SecureRoute
                            element={<FileUploadPage />}
                            allowedRoles={['Maker', 'Authorizer']}
                            redirectPath="/unauthorized"
                            entitlementKey="File Upload" // Check entitlement for File Upload
                        />
                    )
                },
                {
                    path: 'dashboard/payments/file-verify',
                    element: (
                        <SecureRoute
                            element={<FileVerifyPage />}
                            allowedRoles={['Maker', 'Authorizer']}
                            redirectPath="/unauthorized"
                            entitlementKey="File Upload" // Check entitlement for File Verify
                        />
                    )
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
                    element: (
                        <SecureRoute
                            element={<EntitlementPage />}
                            allowedRoles={['Administrator']}
                            redirectPath="/unauthorized"
                            entitlementKey="Services Portal" // Check entitlement for Entitlement Page
                        />
                    )
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
);

export default routes;
