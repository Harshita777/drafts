import { CloseCircle } from '@enbdleap/react-icons';
import { Avatar, Box, Button, Flex, HeaderResponsive, IconButton, LeftPanel, Link, MenuItem, MenuList } from '@enbdleap/react-ui';
import React, { useState, useEffect } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import { useNavigate, useLocation } from 'react-router-dom';
import { enbdLogo } from '../assets/enbd_logo.svg';
import { infoStore } from '../redux/store/infoStore';

export const Header: React.FC = () => {
    const [activeLink, setActiveLink] = useState('');
    const [openLogout, setOpenLogout] = useState<boolean>(false);
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const location = useLocation(); // Get current route

    // Update active link based on the current route
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/home')) {
            setActiveLink('Home');
        } else if (path.includes('/payments')) {
            setActiveLink('Payments');
        } else if (path.includes('/pending-activities')) {
            setActiveLink('Pending Activities');
        } else if (path.includes('/account-services')) {
            setActiveLink('Account Services');
        }
    }, [location]);

    const handleTabClick = (link) => {
        setActiveLink(link);
    };

    const linkStyle = (link) => ({
        color: activeLink === link ? '#012970' : 'black',
        borderBottom: activeLink === link ? '2px solid #012970' : 'none',
        padding: '5px 10px',
        cursor: 'pointer'
    });

    const handleProfileClick = (event) => {
        setAnchorEl(openLogout ? null : event.currentTarget);
        setOpenLogout(!openLogout);
    };

    const handleConfirmLogout = async () => {
        try {
            const result = await fetch('http://localhost:8080/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${infoStore.getAccessToken('jwtToken')}`
                },
                body: JSON.stringify({ userId: 'userid' })
            });
            setOpenConfirmation(false);
            infoStore.deleteAccessToken('jwtToken');
            infoStore.deleteAccessToken('accessToken');
            navigate("/login?logout=success");
        } catch (e) {
            console.error(e || "Something Went Wrong");
        }
    };

    const handleCancelLogout = () => setOpenConfirmation(false);

    return (
        <>
            <HeaderResponsive
                root={{
                    elevation: 0,
                    position: 'relative',
                    sx: {
                        background: 'white',
                        boxShadow: '0 4px 2px -2px #00000020'
                    }
                }}
                slots={{
                    logo: (
                        <Box>
                            <img src={enbdLogo} alt="Emirates NBD Logo" style={{ height: 'auto', width: '150px' }} />
                        </Box>
                    ),
                    menu: (
                        <Flex direction='row' gap={1}>
                            <Link href='/home'>
                                <MenuItem style={linkStyle('Home')} onClick={() => handleTabClick('Home')}>Home</MenuItem>
                            </Link>
                            <Link href='/payments'>
                                <MenuItem style={linkStyle('Payments')} onClick={() => handleTabClick('Payments')}>Payments</MenuItem>
                            </Link>
                            <Link href='/pending-activities'>
                                <MenuItem style={linkStyle('Pending Activities')} onClick={() => handleTabClick('Pending Activities')}>Pending Activities</MenuItem>
                            </Link>
                            <Link href='/account-services'>
                                <MenuItem style={linkStyle('Account Services')} onClick={() => handleTabClick('Account Services')}>Account Services</MenuItem>
                            </Link>
                        </Flex>
                    ),
                    toolbar: (
                        <Avatar onClick={handleProfileClick} variant='rounded'>
                            {/* Insert your profile SVG or image here */}
