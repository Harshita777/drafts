import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_DASHBOARD_REQUEST, FETCH_PENDING_REQUEST } from '../../redux/actions/DashboardActions';

import {
    Box, Text, Card, Tag, Button, IconButton, Div, Flex, DataGrid
} from "@enbdleap/react-ui";
import { Grid, GridTable } from '@enbdleap/react-ui';
import { ChevronRightSmall } from '@enbdleap/react-icons';
import { recentTransactionsColumns, statusTags } from '../../config/config';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dashboardState = useSelector((state: any) => state.dashboardReducer);

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('pending-all');

    useEffect(() => {
        dispatch({ type: FETCH_DASHBOARD_REQUEST });
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
    

    return (
        <Grid container spacing={2}>
           
                <Grid item xs={12}>
                    <Card className='h-auto' elevation={0}>
                        <Flex direction="row" justifyContent="space-between">
                            <Text variant='h4' className='mt-4 ml-2 font-semibold'>Pending Activities</Text>
                            <Button type="button" className='mr-3 mt-2' onClick={handleRefresh} variant='tertiary'>Refresh</Button>
                        </Flex>

                        <Box className='flex p-3 gap-5'>
                            {dashboardState?.data?.map((item: any, index: any) => {
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
                                        className={`shadow-none border-solid border mt-2 w-2/5 p-3 rounded-lg ${selectedCategory === category ? 'bg-blue-50' : ''}`}
                                        onClick={() => handleCardClick(category)}
                                    >
                                        <Box className='flex mt-1 mb-1 justify-between'>
                                            <Text variant='h5' className="font-semibold">{categoryTitles[category]}</Text>
                                            <IconButton className="text-gray-500 -m-3"><ChevronRightSmall /></IconButton>
                                        </Box>

                                        <Text variant='label3' className="text-gray-500 font-medium">
                                            <Text variant='label3' className='text-gray-800 font-semibold'>{details.count}</Text> Individual Transactions
                                        </Text>
                                        <Div className='flex justify-between'>
                                            <Text variant='label3' className="text-gray-500 font-medium">
                                               <Text variant='label3' className='text-gray-800 font-semibold'>{details.count}</Text> x Files
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

            {/* {(!hasPendingData && !hasDashboardData) && (
                <Card className='flex justify-center w-full h-96 '>
                        <Text className="text-base font-normal  mt-48 text-slate-300">Contact your administrator to get your widgets defined.</Text>

                </Card>
                
            )} */}
        </Grid>
    );
};

export default Dashboard;
