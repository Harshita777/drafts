import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_DASHBOARD_REQUEST } from '../../redux/actions/DashboardActions';
import { Box, Text, Card, Tag, Button, IconButton, Flex, DataGrid, Div } from "@enbdleap/react-ui";
import { Grid } from '@enbdleap/react-ui';
import { ChevronRightSmall } from '@enbdleap/react-icons';
import { recentTransactionsColumns, statusTags } from '../../config/config';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    // Initialize hooks for Redux dispatch, navigation, and retrieving the state from the Redux store.
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dashboardState = useSelector((state: any) => state.dashboardReducer);

    // State to manage filtered data based on category selection.
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('pending-all');

    // Fetch dashboard data when the component is mounted or when the dispatch is updated.
    useEffect(() => {
        dispatch({ type: FETCH_DASHBOARD_REQUEST });
    }, [dispatch]);

    // Filter the table data whenever dashboard data or the selected category changes.
    useEffect(() => {
        if (dashboardState.data) {
            filterTableData(selectedCategory);
        }
    }, [dashboardState.data, selectedCategory]);

    // Function to refresh the dashboard data.
    const handleRefresh = () => {
        dispatch({ type: FETCH_DASHBOARD_REQUEST });
    };


    // Function to filter data based on the selected category.
    const filterTableData = (category: string) => {
        const data = dashboardState.data;
        let filtered = [];

        // Filter based on the selected category.
        if (category === 'pending-all') {
            filtered = data;
        } else if (category === 'telegraphics') {
            filtered = data?.filter((item: any) => item.transactionType?.name === 'Telegraphic Transfer');
        } else if (category === 'withinbank') {
            filtered = data?.filter((item: any) => item.transactionType?.name === 'Within Bank Transfer');
        }

        setFilteredData(filtered);
    };

    // Handle click events for category cards.
    const handleCardClick = (category: string) => {
        setSelectedCategory(category);
    };

    // Define table columns, including a custom rendering for the status column.
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

    // Prepare table rows based on the filtered data.
    const rows = filteredData?.map((item: any, index: number) => ({
        id: index + 1,
        type: item.transactionType?.name,
        date: item.initiateDate,
        amount: `${item.paymentAmount} ${item.paymentCurrency}`,
        status: statusTags[item.transactionStatus.status],
        transactionId: item.transactionId,        
		reference: item.referenceId,
    })) || [];

    // Configuration for the DataGrid component.
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

    // Check if there is data available for the dashboard.
    const hasDashboardData = dashboardState.data && dashboardState.data.length > 0;

    // Function to get details for each category card based on the category type.
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

    // Function to handle row clicks in the data grid
	const handleCellClick = (params: any) => {
		if (params.row && params.row.status && params.row.status.label) {
			const status = params.row.status?.label;
			const type = params.row.fileType;
			const typeUrl = type.toString().toLowerCase().split(' ').join('-');
			const rfid = params.row.referenceId

			// Conditional routing based on the transaction status and type
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
            {/* Header and category cards */}
            <Grid item xs={12}>
                <Card className='h-auto' elevation={0} sx={{ p: 2 }}>
                    <Flex direction="row" justifyContent="space-between">
                        <Text variant='h4' className='font-semibold'>Pending Activities</Text>
                        <Button type="button" onClick={handleRefresh} variant='text'>Refresh</Button>
                    </Flex>

                    {/* Category cards */}
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

            {/* Data grid for recent transactions */}
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
