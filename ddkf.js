import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_DASHBOARD_REQUEST, FETCH_PENDING_REQUEST } from '../../redux/actions/DashboardActions';

import {
    Box, Text, Card, Tag, Button, IconButton, Div, Flex, DataGrid
} from "@enbdleap/react-ui";
import { Grid } from '@enbdleap/react-ui';
import { ChevronRightSmall } from '@enbdleap/react-icons';
import { recentTransactionsColumns, statusTags } from '../../config/config';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dashboardState = useSelector((state: any) => state.dashboardReducer);
    const pendingState = useSelector((state: any) => state.pendingReducer);

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('pending-all');
    const [pendingCounts, setPendingCounts] = useState({
        all: 0,
        telegraphic: 0,
        withinBank: 0,
    });

    useEffect(() => {
        dispatch({ type: FETCH_DASHBOARD_REQUEST });
        dispatch({ type: FETCH_PENDING_REQUEST });
    }, [dispatch]);

    useEffect(() => {
        if (dashboardState.data) {
            const allCount = dashboardState.data.length;
            const telegraphicCount = dashboardState.data.filter(
                (item: any) => item.transactionType.name === 'Telegraphic Transfer'
            ).length;
            const withinBankCount = dashboardState.data.filter(
                (item: any) => item.transactionType.name === 'Within Bank Transfer'
            ).length;

            setPendingCounts({
                all: allCount,
                telegraphic: telegraphicCount,
                withinBank: withinBankCount,
            });

            filterTableData(selectedCategory);
        }
    }, [dashboardState.data, selectedCategory]);

    const handleRefresh = () => {
        dispatch({ type: FETCH_DASHBOARD_REQUEST });
    };

    const handleCellClick = (params: any) => {
        if (params.row && params.row.status && params.row.status.label) {
            const status = params.row.status?.label;
            if (status === "Pending Authorization") {
                navigate(`/dashboard/transaction?trid=${params.row.transactionId}`);
            }
        }
    };

    const categoryToTypeMap: Record<string, string> = {
        'pending-all': 'all',
        'telegraphics': 'Telegraphic Transfer',
        'withinbank': 'Within Bank Transfer',
    };

    const filterTableData = (category: string) => {
        const mappedType = categoryToTypeMap[category];
        const filtered = dashboardState.data?.filter((item: any) => {
            if (mappedType === 'all') return true;
            return item.transactionType.name === mappedType;
        });
        setFilteredData(filtered);
    };

    const handleCardClick = (category: string) => {
        setSelectedCategory(category);
    };

    const columns = [
        ...recentTransactionsColumns,
        {
            field: 'status',
            flex: 1,
            headerName: 'Status',
            renderCell: (params: any) => (
                <Flex width={170}>
                    <Tag sx={{maxWidth:'200px'}} size='medium' type={params.value?.type ? params.value.type : ""} label={params.value?.label} />
                </Flex>
            ),
        },
    ];

    const rows = filteredData?.map((item: any, index: number) => ({
        id: index + 1,
        type: item.transactionType?.name,
        date: item.initiateDate,
        amount: item.paymentAmount,
        status: statusTags[item.transactionStatus.status],
        transactionId: item.transactionId,
    })) || [];

    const GridTableProps = {
        rows: rows,
        columns: columns,
        hidePagination: false,
        checkboxSelection: false,
        autoPageSize: false,
        disableColumnMenu: false,
        autoHeight: true,
        onRowClick: handleCellClick,
        disableColumnFilter: false,
        hideFooterRowCount: true,
    };

    const hasDashboardData = dashboardState.data && dashboardState.data.length > 0;
    const hasPendingData = pendingState.data && pendingState.data.length > 0;

    return (
        <Grid container spacing={2}>
            {hasPendingData && (
                <Grid item xs={12}>
                    <Card className='h-auto' elevation={0}>
                        <Flex direction="row" justifyContent="space-between">
                            <Text variant='h4' className='mt-4 ml-2 font-semibold'>Pending Activities</Text>
                            <Button type="button" className='mr-3 mt-2' onClick={handleRefresh} variant='tertiary'>Refresh</Button>
                        </Flex>

                        <Box className='flex p-3 gap-5'>
                            <Card 
                                className={`shadow-none border-solid border mt-2 w-2/5 p-3 rounded-lg ${selectedCategory === 'pending-all' ? 'bg-blue-50' : ''}`}
                                onClick={() => handleCardClick('pending-all')}
                            >
                                <Box className='flex mt-1 mb-1 justify-between'>
                                    <Text variant='h5' className="font-semibold">All</Text>
                                    <IconButton className="text-gray-500 -m-3"><ChevronRightSmall /></IconButton>
                                </Box>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.all}</Text> Individual Transactions
                                </Text>
                            </Card>
                            <Card 
                                className={`shadow-none border-solid border mt-2 w-2/5 p-3 rounded-lg ${selectedCategory === 'telegraphics' ? 'bg-blue-50' : ''}`}
                                onClick={() => handleCardClick('telegraphics')}
                            >
                                <Box className='flex mt-1 mb-1 justify-between'>
                                    <Text variant='h5' className="font-semibold">Telegraphic</Text>
                                    <IconButton className="text-gray-500 -m-3"><ChevronRightSmall /></IconButton>
                                </Box>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.telegraphic}</Text> Individual Transactions
                                </Text>
                            </Card>
                            <Card 
                                className={`shadow-none border-solid border mt-2 w-2/5 p-3 rounded-lg ${selectedCategory === 'withinbank' ? 'bg-blue-50' : ''}`}
                                onClick={() => handleCardClick('withinbank')}
                            >
                                <Box className='flex mt-1 mb-1 justify-between'>
                                    <Text variant='h5' className="font-semibold">Within Bank</Text>
                                    <IconButton className="text-gray-500 -m-3"><ChevronRightSmall /></IconButton>
                                </Box>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.withinBank}</Text> Individual Transactions
                                </Text>
                            </Card>
                        </Box>
                    </Card>
                </Grid>
            )}

            {hasDashboardData && (
                <Grid item xs={12}>
                    <Card className='shadow-none p-2 h-auto border rounded-1xl' elevation={3}>
                        <Box className='flex justify-between'>
                            <Text variant='h4' className='mt-4 font-semibold'>Recent Transactions</Text>
                            <Button onClick={handleRefresh} variant='tertiary'>Refresh</Button>
                        </Box>
                        <Text variant="label1" className='text-gray-400'>Showing 1 - 10 out of {rows.length}</Text>

                        {rows.length > 0 && (
                            <DataGrid
                            initialState={{
                                pagination: {
                                  paginationModel: { pageSize: 10 }
                                },
                              }}
                                className='mt-4 border-none cursor-pointer'
                                {...GridTableProps}
                            />
                        )}
                    </Card>
                </Grid>
            )}

            {(!hasPendingData && !hasDashboardData) && (
                <Card className='flex justify-center w-full h-96 '>
                        <Text className="text-base font-normal  mt-48 text-slate-300">Contact your administrator to get your widgets defined.</Text>

                </Card>
                
            )}
        </Grid>
    );
};

export default Dashboard;





import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_DASHBOARD_REQUEST, FETCH_PENDING_REQUEST } from '../../redux/actions/DashboardActions';

import {
    Box, Text, Card, Tag, Button, IconButton, Div, Flex, DataGrid
} from "@enbdleap/react-ui";
import { Grid } from '@enbdleap/react-ui';
import { ChevronRightSmall } from '@enbdleap/react-icons';
import { recentTransactionsColumns, statusTags } from '../../config/config';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dashboardState = useSelector((state: any) => state.dashboardReducer);
    const pendingState = useSelector((state: any) => state.pendingReducer);

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('pending-all');
    const [pendingCounts, setPendingCounts] = useState({
        all: { count: 0, amount: 0, files: 0 },
        telegraphic: { count: 0, amount: 0, files: 0 },
        withinBank: { count: 0, amount: 0, files: 0 },
    });

    useEffect(() => {
        dispatch({ type: FETCH_DASHBOARD_REQUEST });
        dispatch({ type: FETCH_PENDING_REQUEST });
    }, [dispatch]);

    useEffect(() => {
        if (dashboardState.data) {
            const allCount = dashboardState.data.length;
            const allAmount = dashboardState.data.reduce((sum: number, item: any) => sum + item.paymentAmount, 0);
            const allFiles = dashboardState.data.reduce((sum: number, item: any) => sum + (item.files?.length || 0), 0);

            const telegraphicData = dashboardState.data.filter(
                (item: any) => item.transactionType.name === 'Telegraphic Transfer'
            );
            const telegraphicCount = telegraphicData.length;
            const telegraphicAmount = telegraphicData.reduce((sum: number, item: any) => sum + item.paymentAmount, 0);
            const telegraphicFiles = telegraphicData.reduce((sum: number, item: any) => sum + (item.files?.length || 0), 0);

            const withinBankData = dashboardState.data.filter(
                (item: any) => item.transactionType.name === 'Within Bank Transfer'
            );
            const withinBankCount = withinBankData.length;
            const withinBankAmount = withinBankData.reduce((sum: number, item: any) => sum + item.paymentAmount, 0);
            const withinBankFiles = withinBankData.reduce((sum: number, item: any) => sum + (item.files?.length || 0), 0);

            setPendingCounts({
                all: { count: allCount, amount: allAmount, files: allFiles },
                telegraphic: { count: telegraphicCount, amount: telegraphicAmount, files: telegraphicFiles },
                withinBank: { count: withinBankCount, amount: withinBankAmount, files: withinBankFiles },
            });

            filterTableData(selectedCategory);
        }
    }, [dashboardState.data, selectedCategory]);

    const handleRefresh = () => {
        dispatch({ type: FETCH_DASHBOARD_REQUEST });
    };

    const handleCellClick = (params: any) => {
        if (params.row && params.row.status && params.row.status.label) {
            const status = params.row.status?.label;
            if (status === "Pending Authorization") {
                navigate(`/dashboard/transaction?trid=${params.row.transactionId}`);
            }
        }
    };

    const categoryToTypeMap: Record<string, string> = {
        'pending-all': 'all',
        'telegraphics': 'Telegraphic Transfer',
        'withinbank': 'Within Bank Transfer',
    };

    const filterTableData = (category: string) => {
        const mappedType = categoryToTypeMap[category];
        const filtered = dashboardState.data?.filter((item: any) => {
            if (mappedType === 'all') return true;
            return item.transactionType.name === mappedType;
        });
        setFilteredData(filtered);
    };

    const handleCardClick = (category: string) => {
        setSelectedCategory(category);
    };

    const columns = [
        ...recentTransactionsColumns,
        {
            field: 'status',
            flex: 1,
            headerName: 'Status',
            renderCell: (params: any) => (
                <Flex width={170}>
                    <Tag sx={{maxWidth:'200px'}} size='medium' type={params.value?.type ? params.value.type : ""} label={params.value?.label} />
                </Flex>
            ),
        },
    ];

    const rows = filteredData?.map((item: any, index: number) => ({
        id: index + 1,
        type: item.transactionType?.name,
        date: item.initiateDate,
        amount: item.paymentAmount,
        status: statusTags[item.transactionStatus.status],
        transactionId: item.transactionId,
    })) || [];

    const GridTableProps = {
        rows: rows,
        columns: columns,
        hidePagination: false,
        checkboxSelection: false,
        autoPageSize: false,
        disableColumnMenu: false,
        autoHeight: true,
        onRowClick: handleCellClick,
        disableColumnFilter: false,
        hideFooterRowCount: true,
    };

    const hasDashboardData = dashboardState.data && dashboardState.data.length > 0;
    const hasPendingData = pendingState.data && pendingState.data.length > 0;

    return (
        <Grid container spacing={2}>
            {hasPendingData && (
                <Grid item xs={12}>
                    <Card className='h-auto' elevation={0}>
                        <Flex direction="row" justifyContent="space-between">
                            <Text variant='h4' className='mt-4 ml-2 font-semibold'>Pending Activities</Text>
                            <Button type="button" className='mr-3 mt-2' onClick={handleRefresh} variant='tertiary'>Refresh</Button>
                        </Flex>

                        <Box className='flex p-3 gap-5'>
                            <Card 
                                className={`shadow-none border-solid border mt-2 w-2/5 p-3 rounded-lg ${selectedCategory === 'pending-all' ? 'bg-blue-50' : ''}`}
                                onClick={() => handleCardClick('pending-all')}
                            >
                                <Box className='flex mt-1 mb-1 justify-between'>
                                    <Text variant='h5' className="font-semibold">All</Text>
                                    <IconButton className="text-gray-500 -m-3"><ChevronRightSmall /></IconButton>
                                </Box>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.all.count}</Text> Individual Transactions
                                </Text>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.all.amount.toFixed(2)}</Text> Total Amount
                                </Text>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.all.files}</Text> Files
                                </Text>
                            </Card>
                            <Card 
                                className={`shadow-none border-solid border mt-2 w-2/5 p-3 rounded-lg ${selectedCategory === 'telegraphics' ? 'bg-blue-50' : ''}`}
                                onClick={() => handleCardClick('telegraphics')}
                            >
                                <Box className='flex mt-1 mb-1 justify-between'>
                                    <Text variant='h5' className="font-semibold">Telegraphic</Text>
                                    <IconButton className="text-gray-500 -m-3"><ChevronRightSmall /></IconButton>
                                </Box>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.telegraphic.count}</Text> Individual Transactions
                                </Text>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.telegraphic.amount.toFixed(2)}</Text> Total Amount
                                </Text>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.telegraphic.files}</Text> Files
                                </Text>
                            </Card>
                            <Card 
                                className={`shadow-none border-solid border mt-2 w-2/5 p-3 rounded-lg ${selectedCategory === 'withinbank' ? 'bg-blue-50' : ''}`}
                                onClick={() => handleCardClick('withinbank')}
                            >
                                <Box className='flex mt-1 mb-1 justify-between'>
                                    <Text variant='h5' className="font-semibold">Within Bank</Text>
                                    <IconButton className="text-gray-500 -m-3"><ChevronRightSmall /></IconButton>
                                </Box>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.withinBank.count}</Text> Individual Transactions
                                </Text>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.withinBank.amount.toFixed(2)}</Text> Total Amount
                                </Text>
                                <Text variant='label3' className="text-gray-500 font-medium">
                                    <Text variant='label3' className='text-gray-800 font-semibold'>{pendingCounts.withinBank.files}</Text> Files
                                </Text>
                            </Card>
                        </Box>
                    </Card>
                </Grid>
            )}

            {hasDashboardData && (
                <Grid item xs={12}>
                    <Div className='flex flex-col'>
                        <Text variant='h4' className='mb-3'>Recent Transactions</Text>
                        <DataGrid
                            data-test='dashboard-datagrid'
                            {...GridTableProps}
                        />
                    </Div>
                </Grid>
            )}
        </Grid>
    );
};

export default Dashboard;

