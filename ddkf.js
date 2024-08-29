import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_DASHBOARD_REQUEST } from '../../redux/actions/DashboardActions';
import { Box, Text, Card, Tag, Button, IconButton, Flex, DataGrid, Div } from "@enbdleap/react-ui";
import { Grid } from '@enbdleap/react-ui';
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

    const filterTableData = (category: string) => {
        const data = dashboardState.data;
        let filtered = [];

        if (category === 'pending-all') {
            filtered = data;
        } else if (category === 'telegraphics') {
            filtered = data?.filter((item: any) => item.transactionType?.name === 'Telegraphic Transfer');
        } else if (category === 'withinbank') {
            filtered = data?.filter((item: any) => item.transactionType?.name === 'Within Bank Transfer');
        }

        setFilteredData(filtered);
    };

    // Mock function to convert AED to other currencies
    const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
        // This is a mock conversion logic. Replace this with actual conversion logic or API call.
        const conversionRates: Record<string, number> = {
            USD: 0.27,
            EUR: 0.24,
            INR: 20.0,
            AED: 1,
        };
        const convertedAmount = amount * (conversionRates[toCurrency] / conversionRates[fromCurrency]);
        return convertedAmount;
    };

    const formatCurrency = (amount: number, currency: string = 'AED') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const columns = [
        ...recentTransactionsColumns,
        {
            field: 'status',
            flex: 1,
            headerName: 'Status',
            renderCell: (params: any) => (
                <Flex width={170}>
                    <Tag sx={{ maxWidth: '200px' }} size='medium' type={params.value?.type ? params.value.type : ""} label={params.value?.label} />
                </Flex>
            ),
        },
        {
            field: 'reference',
            flex: 1,
            headerName: 'Reference ID',
        },
    ];

    const rows = filteredData?.map((item: any, index: number) => {
        const paymentCurrency = item.paymentCurrency || 'AED'; // Default to AED if no currency provided
        const paymentAmount = item.paymentAmount || 0;

        // Convert AED to the currency provided in the response
        const convertedAmount = convertCurrency(paymentAmount, 'AED', paymentCurrency);

        return {
            id: index + 1,
            type: item.transactionType?.name,
            date: item.initiateDate,
            amount: formatCurrency(convertedAmount, paymentCurrency),
            status: statusTags[item.transactionStatus.status],
            transactionId: item.transactionId,
            reference: item.referenceId,
        };
    }) || [];

    const GridTableProps = {
        rows: rows.reverse(),
        columns: columns,
        hidePagination: false,
        checkboxSelection: false,
        autoPageSize: false,
        disableColumnMenu: false,
        autoHeight: true,
        disableColumnFilter: false,
        hideFooterRowCount: true,
    };

    const hasDashboardData = dashboardState.data && dashboardState.data.length > 0;

    const getCardDetails = (category: string) => {
        switch (category) {
            case 'pending-all':
                return {
                    count: dashboardState?.allTransaction,
                    files: dashboardState?.filesTransaction
                };

            case 'telegraphics':
                return {
                    count: dashboardState?.individualTransaction,
                    files: dashboardState?.filesTransaction
                };
            case 'withinbank':
                return {
                    count: dashboardState?.individualTransaction,
                    files: dashboardState?.filesTransaction
                };
            default:
                return { count: 0, amount: 0 };
        }
    };

    const handleCellClick = (params: any) => {
        if (params.row && params.row.status && params.row.status.label) {
            const status = params.row.status?.label;
            const type = params.row.fileType;
            const typeUrl = type.toString().toLowerCase().split(' ').join('-');
            const rfid = params.row.referenceId;

            if (((status === 'Ready for Verification')) && type === "File Upload") {
                navigate(`/dashboard/payments/file-verify`, { state: rfid });
            } else if (status === 'Pending Authorization' && (type === "Telegraphic Transfer" || type === "Within Bank Transfer")) {
                navigate(`/dashboard/payments/${typeUrl}?rfId=${rfid}`);
            } else if (status === 'Pending Authorization' && type === "File Upload") {
                navigate(`/dashboard/payments/within-bank-transfer?rfId=${rfid}&type=${typeUrl}`);
            }
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card className='h-auto' elevation={0} sx={{ p: 2 }}>
                    <Flex direction="row" justifyContent="space-between">
                        <Text variant='h4' className='font-semibold'>Pending Activities</Text>
                        <Button type="button" onClick={handleRefresh} variant='text'>Refresh</Button>
                    </Flex>

                    <Box className='flex gap-5'>
                        {['pending-all', 'telegraphics', 'withinbank'].map((category, index) => {
                            const details = getCardDetails(category);
                            const categoryTitles: Record<string, string> = {
                                'pending-all': 'All',
                                'telegraphics': 'Telegraphic',
                                'withinbank': 'Within Bank',
                            };

                            return (
                                <Card
                                    key={index}
                                    className={`shadow-none border-solid border w-2/5 p-3 cursor-pointer rounded-lg ${selectedCategory === category ? 'bg-blue-50' : ''}`}
                                    onClick={() => handleCardClick(category)}                                   
                                >
                                    <Box className='flex mb-1 justify-between items-center'>
                                        <Text variant='h4' className="font-semibold">{categoryTitles[category]}</Text>
                                        <Div className='block mt-2'>
                                            <Text variant='body2' className="text-gray-500 font-medium">
                                                <Text variant='label2' className='text-gray-800  font-semibold'>
                                                    {details.count}
                                                </Text> Single Transactions
                                            </Text>
                                            <Text variant='body2' className="text-gray-500 font-medium">
                                                <Text variant='label2' className='text-gray-800 font-semibold'>
                                                    {details.files}
                                                </Text> Files
                                            </Text>
                                        </Div>
                                        <IconButton className="text-gray-500 -m-3"><ChevronRightSmall /></IconButton>
                                    </Box>
                                </Card>
                            );
                        })}
                    </Box>
                </Card>
            </Grid>

            {hasDashboardData && (
                <Grid item xs={12}>
                    <Card className='shadow-none h-auto border rounded-1xl' elevation={0} sx={{ p: 2 }}>
                        <Box className='flex justify-between'>
                            <Text variant='h4' className='font-semibold'>Recent Transactions</Text>
                            <Button type='button' onClick={handleRefresh} variant='text'>Refresh</Button>
                        </Box>

                        {rows.length > 0 && (
                            <DataGrid
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: 10 }
                                    },
                                }}
                                className='mt-2 border-none'
                                {...GridTableProps}
                            />
                        )}
                    </Card>
                </Grid>
            )}
        </Grid>
    );
};

export default Dashboard;
