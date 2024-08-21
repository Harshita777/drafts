import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_DASHBOARD_REQUEST, FETCH_PENDING_REQUEST } from '../../redux/actions/DashboardActions';

import {
    Box, Text, Card, Tag, Button, IconButton, Div, Flex
} from "@enbdleap/react-ui";
import { Grid, GridTable } from '@enbdleap/react-ui';
import { ChevronRightSmall } from '@enbdleap/react-icons';
import { recentTransactionsColumns, statusTags } from '../../config/config';
import { useNavigate } from 'react-router';

const Dashboard: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dashboardState = useSelector((state: any) => state.dashboardReducer);
    const pendingState = useSelector((state: any) => state.pendingReducer);

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        dispatch({ type: FETCH_DASHBOARD_REQUEST });
        dispatch({ type: FETCH_PENDING_REQUEST });
    }, [dispatch]);

    useEffect(() => {
        if (dashboardState.data) {
            filterTableData(selectedCategory);
        }
    }, [dashboardState.data, selectedCategory]);

    const handleRefresh = () => {
        dispatch({ type: FETCH_DASHBOARD_REQUEST });
    };

    const handleCellClick = (params: any) => {
        if (params.row && params.row.status && params.row.status.label) {
            const status = params.row.status?.label;
            if (status === "Pending") {
                navigate(`/transaction?trid=${params.row.transactionId}`);
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
            return item.TransactionType === mappedType;
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
                <Tag size='medium' type={params.value?.type ? params.value.type : ""} label={params.value?.label} />
            ),
        },
    ];

    const rows = filteredData?.map((item: any, index: number) => ({
        id: index + 1,
        type: item.TransactionType,
        date: item.initiateDate,
        amount: item.paymentAmount,
        status: statusTags[item.status],
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
        paginationModel: {
            pageSize: 10,
            page: 0,
        },
        hideFooterRowCount: false,
    };

    const hasDashboardData = dashboardState.data && dashboardState.data.length > 0;
    const hasPendingData = pendingState.data && pendingState.data.length > 0;

    return (
        <Grid container spacing={2}>
            {hasPendingData && (
                <Grid item xs={12}>
                    <Card className='h-auto' elevation={0}>
                        <Flex direction="row" justifyContent="space-between">
                            <Text variant='h4' className='mt-4 ml-2 font-normal'>Pending Activities</Text>
                            <Button type="button" onClick={handleRefresh} variant='tertiary'>Refresh</Button>
                        </Flex>

                        <Box className='flex p-3 gap-5'>
                            {pendingState?.data?.map((item: any, index: any) => {
                                const category = Object.keys(item)[0];
                                const details = item[category][0];
                                const categoryTitles: any = {
                                    'pending-all': 'All',
                                    'telegraphics': 'Telegraphic',
                                    'withinbank': 'Within Bank',
                                };
                                return (
                                    <Card 
                                        key={index} 
                                        className={`shadow border mt-2 w-2/5 p-3 rounded-lg ${selectedCategory === category ? 'bg-blue-100' : ''}`}
                                        onClick={() => handleCardClick(category)}
                                    >
                                        <Box className='flex justify-between'>
                                            <Text variant='h5' className="font-normal">{categoryTitles[category]}</Text>
                                            <IconButton className="text-gray-500 -m-3"><ChevronRightSmall /></IconButton>
                                        </Box>

                                        <Text variant='label3' className="text-gray-500">
                                            {details.count} Individual Transactions
                                        </Text>
                                        <Div className='flex justify-between'>
                                            <Text variant='label3' className="text-gray-500">
                                                {details.files} Files
                                            </Text>
                                            <Text variant='label3' className="text-md font-semibold text-gray-600">
                                                {details.amount}
                                            </Text>
                                        </Div>
                                    </Card>
                                );
                            })}
                        </Box>
                    </Card>
                </Grid>
            )}

            {hasDashboardData && (
                <Grid item xs={12}>
                    <Card className='shadow-none mt-5 p-2 h-auto border rounded-1xl' elevation={3}>
                        <Box className='flex justify-between'>
                            <Text variant='h4' className='mt-4 font-normal'>Recent Transactions</Text>
                            <Button onClick={handleRefresh} variant='tertiary'>Refresh</Button>
                        </Box>
                        <Text variant="label1" className='text-gray-400'>Showing 1 - 10 out of 16</Text>

                        {rows.length > 0 && (
                            <GridTable
                                className='mt-4 border-none cursor-pointer'
                                {...GridTableProps}
                            />
                        )}
                    </Card>
                </Grid>
            )}

            {(!hasPendingData && !hasDashboardData) && (
                <Flex justifyContent='center' alignItems="center" className="endb-dashboard">
                    <Flex
                        minHeight='60vh'
                        justifyContent='center'
                        alignItems="center"
                        width={"98%"}
                        height={"98%"}
                        m={2}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "16px"
                        }}
                    >
                        <Text className="text-base font-normal text-slate-300">Contact your administrator to get your widgets defined.</Text>
                    </Flex>
                </Flex>
            )}
        </Grid>
    );
};

export default Dashboard;
