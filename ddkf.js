import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, GridTable, Text, Tag, Div, DataGrid, Flex } from '@enbdleap/react-ui';
import { useNavigate } from 'react-router-dom';
import { FETCH_TRANSACTION_SUMMARY_REQUEST } from '../../../redux/actions/DashboardActions';
import { statusTags, transactionSummaryColumns } from '../../../config/config';
import { infoStore } from '../../../services/infoStore';

interface PaymentProps {
  transferType: string;
}

const Payment: React.FC<PaymentProps> = ({ transferType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactionSummaryState = useSelector((state: any) => state.transactionSummaryReducer);
  const userId = infoStore.getSubscriberId()
  useEffect(() => {
    if(userId){
      dispatch({
        type: FETCH_TRANSACTION_SUMMARY_REQUEST,
        payload: { userId: userId }
      });
    }
    
  }, [dispatch,userId]);

  const handleCellClick = (params: any) => {

    if (params.row && params.row.status && params.row.status.label) {

      const status = params.row.status?.label;
      const type = params.row.fileType;
      const typeUrl = type.toString().toLowerCase().split(' ').join('-');
      const rfid = params.row.referenceId
      

      if (((status === 'Pending Authorization')||(status === 'Ready for Verification')) && type === "File Upload") {
        navigate(`/dashboard/payments/file-verify`, { state: rfid });
      } else if (status === 'Pending Authorization' && (type === "Telegraphic Transfer" || type === "Within Bank Transfer")) {
        navigate(`/dashboard/payments/${typeUrl}?rfId=${rfid}`);
      }
    }
  };




  const rows = transactionSummaryState.data
    ? transactionSummaryState.data
      .filter((item: any) => {
        if (transferType === "all") return true;
        if (transferType === "single") {
          return item.transactionType.name === "Telegraphic Transfer" ||
            item.transactionType.name === "Within Bank Transfer";
        }
        if (transferType === "file-upload") {
          return item.transactionType.name === "File Upload";
        }
        return false;
      })
      .map((item: any, index: number) => {
        
        return {
          id: index + 1,
          date: item.submittedAt,
          amount: item.debitAccount?.balance,
          customer: item.additionalDetails.customerReference,
          fileType: item.transactionType?.name,
          status: statusTags[item.transactionStatus.status],
          transactionId: item.transactionId,
          referenceId: item.referenceId,
          total: "..",
          rejection: ".."
        }
      })
    : [];

  const GridTableProps = {

    rows: rows,
    columns: [
      
      ...transactionSummaryColumns,
      {
        field: 'status',
        flex:1,
        headerName: 'Status',
        renderCell: (params: any) => (
          <Flex width={200}>
                    <Tag sx={{maxWidth:'160px'}} size='medium' type={params.value?.type ? params.value.type : ""} label={params.value?.label} />
                </Flex>
        ),
      },
      {
        field: 'rejection',
        flex:1,
        headerName: 'Rejection Reason',
      }
    ],
    hidePagination: true,
    checkboxSelection: false,
    autoPageSize: false,
    disableColumnMenu: true,
    autoHeight: true,
    onRowClick: handleCellClick,
    disableColumnFilter: true,
    hideFooterRowCount: false,
  };

  return (
    <>
      <Grid container className='w-full h-auto shadow-bottom' margin={0}>
        <Card className='bg-blue-50 w-full flex justify-between'></Card>
      </Grid>
      <Grid container spacing={2} className='px-7 mt-28'>
        <Grid item xs={12}>
        <Card className='flex shadow-none p-2 h-auto border rounded-1xl'>
            <Box className=' flex flex-1 p-3 gap-5'>
              <Card className='shadow-none border-solid  w-full border mt-2 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-bold'>
                  {transactionSummaryState.allTransaction}
                  </Text>
                </Box>
                <Text variant='label3' className='text-gray-500 font-medium'>
                  Total Transaction
                </Text>
                <Div className='flex justify-between'>

                  <Text variant='label3' className='text-md font-semibold text-gray-500'>
                  {transactionSummaryState.allAmount} AED
                  </Text>
                </Div>
              </Card>
            </Box>
            <Box className='flex flex-1 p-3 gap-5'>
              <Card className='shadow-none border-solid  w-full border mt-2 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-bold'>
                  {transactionSummaryState.individualTransaction}
                  </Text>
                </Box>
                <Text variant='label3' className='text-gray-500 font-medium'>
                Single Transaction
                </Text>
                <Div className='flex justify-between'>
                  <Text variant='label3' className='text-md font-semibold text-gray-500'>
                  {transactionSummaryState.individualAmount} AED
                  </Text>
                </Div>
              </Card>
            </Box>
            <Box className='flex flex-1 p-3 gap-5'>
<Card className='shadow-none border-solid  w-full border mt-2 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-bold'>
                  {transactionSummaryState.filesTransaction}
                  </Text>
                </Box>
                <Text variant='label3' className='text-gray-500 font-medium'>
                  Files Transaction
                </Text>
                <Div className='flex justify-between'>
                  <Text variant='label3' className='text-md font-semibold text-gray-500'>
                  {transactionSummaryState.fileAmount} AED
                  </Text>
                </Div>
              </Card>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} className='mb-4'>
          <Card className='shadow-none p-4 h-auto border rounded-1xl' elevation={1}>
            <Box className='flex justify-between'>
              <Text variant='h4' className='mt-4  font-medium'>
                Transactions Summary
              </Text>
            </Box>
            <Text variant='label1' className='text-gray-400'>
            Showing 1 - 10 out of {rows.length}
            </Text>
            <DataGrid initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }
              },
            }} className='mt-4 border-none  text-gray-600 cursor-pointer' {...GridTableProps} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Payment;




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

    // Handle click events for table rows, redirecting based on status.
    const handleCellClick = (params: any) => {
        if (params.row && params.row.status && params.row.status.label) {
            const status = params.row.status?.label;
            if (status === "Pending Authorization") {
                navigate(`/dashboard/transaction?trid=${params.row.transactionId}`);
            }
        }
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
    ];

    // Prepare table rows based on the filtered data.
    const rows = filteredData?.map((item: any, index: number) => ({
        id: index + 1,
        type: item.transactionType?.name,
        date: item.initiateDate,
        amount: `${item.paymentAmount} ${item.paymentCurrency}`,
        status: statusTags[item.transactionStatus.status],
        transactionId: item.transactionId,
    })) || [];

    // Configuration for the DataGrid component.
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

    // Check if there is data available for the dashboard.
    const hasDashboardData = dashboardState.data && dashboardState.data.length > 0;

    // Function to get details for each category card based on the category type.
    const getCardDetails = (category: string) => {
        switch (category) {
            case 'pending-all':
                return {
                    count: dashboardState?.allTransaction,
                    amount: dashboardState?.individualWithInBankAmount + dashboardState?.individualTelegraphicAmount + dashboardState?.fileAmount,
                    files: dashboardState?.filesTransaction
                };

            case 'telegraphics':
                return {
                    count: dashboardState?.individualTelegraphicTransaction,
                    amount: dashboardState?.individualTelegraphicAmount,
                    files: dashboardState?.filesTransaction
                };
            case 'withinbank':
                return {
                    count: dashboardState?.individualWithInBankTransaction,
                    amount: dashboardState?.individualWithInBankAmount,
                    files: dashboardState?.filesTransaction
                };
            default:
                return { count: 0, amount: 0 };
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
                                        <Text variant='h5' className="font-semibold">{categoryTitles[category]}</Text>
                                        <Div className='block'>
                                            <Text variant='body2' className="text-gray-500 font-medium">
                                                <Text variant='label2' className='text-gray-800 font-semibold'>
                                                    {details.count}
                                                    </Text> Individual Transactions
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
                                className='mt-2 border-none cursor-pointer'
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




import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, Text, Div, Flex, IconButton, DataGrid } from '@enbdleap/react-ui';
import { useNavigate } from 'react-router-dom';
import { FETCH_TRANSACTION_SUMMARY_REQUEST } from '../../../redux/actions/DashboardActions';
import { statusTags, transactionSummaryColumns } from '../../../config/config';
import { infoStore } from '../../../services/infoStore';
import { ChevronRightSmall } from '@enbdleap/react-icons';

interface PaymentProps {
  transferType: string;
}

const Payment: React.FC<PaymentProps> = ({ transferType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactionSummaryState = useSelector((state: any) => state.transactionSummaryReducer);
  const userId = infoStore.getSubscriberId();
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {
      dispatch({
        type: FETCH_TRANSACTION_SUMMARY_REQUEST,
        payload: { userId: userId }
      });
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (transactionSummaryState.data) {
      filterTableData(transferType);
    }
  }, [transactionSummaryState.data, transferType]);

  const handleCellClick = (params: any) => {
    if (params.row && params.row.status && params.row.status.label) {
      const status = params.row.status?.label;
      const type = params.row.fileType;
      const typeUrl = type.toString().toLowerCase().split(' ').join('-');
      const rfid = params.row.referenceId;

      if (((status === 'Pending Authorization') || (status === 'Ready for Verification')) && type === "File Upload") {
        navigate(`/dashboard/payments/file-verify`, { state: rfid });
      } else if (status === 'Pending Authorization' && (type === "Telegraphic Transfer" || type === "Within Bank Transfer")) {
        navigate(`/dashboard/payments/${typeUrl}?rfId=${rfid}`);
      }
    }
  };

  const filterTableData = (category: string) => {
    const data = transactionSummaryState.data || [];
    let filtered = [];

    if (category === 'all') {
      filtered = data;
    } else if (category === 'single') {
      filtered = data.filter((item: any) => 
        item.transactionType.name === "Telegraphic Transfer" ||
        item.transactionType.name === "Within Bank Transfer"
      );
    } else if (category === 'file-upload') {
      filtered = data.filter((item: any) => item.transactionType.name === "File Upload");
    }

    setFilteredData(filtered);
  };

  const rows = filteredData.map((item: any, index: number) => ({
    id: index + 1,
    date: item.submittedAt,
    amount: item.debitAccount?.balance,
    customer: item.additionalDetails.customerReference,
    fileType: item.transactionType?.name,
    status: statusTags[item.transactionStatus.status],
    transactionId: item.transactionId,
    referenceId: item.referenceId,
    total: "..",
    rejection: ".."
  }));

  const GridTableProps = {
    rows: rows,
    columns: [
      ...transactionSummaryColumns,
      {
        field: 'status',
        flex: 1,
        headerName: 'Status',
        renderCell: (params: any) => (
          <Flex width={200}>
            <Tag sx={{ maxWidth: '160px' }} size='medium' type={params.value?.type ? params.value.type : ""} label={params.value?.label} />
          </Flex>
        ),
      },
      {
        field: 'rejection',
        flex: 1,
        headerName: 'Rejection Reason',
      }
    ],
    hidePagination: true,
    checkboxSelection: false,
    autoPageSize: false,
    disableColumnMenu: true,
    autoHeight: true,
    onRowClick: handleCellClick,
    disableColumnFilter: true,
    hideFooterRowCount: false,
  };

  // Prepare the card details for the payment summary
  const paymentSummaryDetails = [
    {
      category: 'all',
      title: 'All Transactions',
      count: transactionSummaryState.allTransaction,
      amount: transactionSummaryState.allAmount,
    },
    {
      category: 'single',
      title: 'Single Transactions',
      count: transactionSummaryState.individualTransaction,
      amount: transactionSummaryState.individualAmount,
    },
    {
      category: 'file-upload',
      title: 'File Uploads',
      count: transactionSummaryState.filesTransaction,
      amount: transactionSummaryState.fileAmount,
    }
  ];

  return (
    <>
      <Grid container className='w-full h-auto shadow-bottom' margin={0}>
        <Card className='bg-blue-50 w-full flex justify-between'></Card>
      </Grid>
      <Grid container spacing={2} className='px-7 mt-28'>
        <Grid item xs={12}>
          <Box className='flex gap-5'>
            {paymentSummaryDetails.map((detail, index) => (
              <Card
                key={index}
                className={`shadow-none border-solid w-full border mt-2 p-3 cursor-pointer rounded-lg`}
                onClick={() => filterTableData(detail.category)}
              >
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-semibold'>
                    {detail.count}
                  </Text>
                  <IconButton className="text-gray-500 -m-3"><ChevronRightSmall /></IconButton>
                </Box>
                <Text variant='label3' className='text-gray-500 font-medium'>
                  {detail.title}
                </Text>
                <Div className='flex justify-between'>
                  <Text variant='label3' className='text-md font-semibold text-gray-500'>
                    {detail.amount} AED
                  </Text>
                </Div>
              </Card>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} className='mb-4'>
          <Card className='shadow-none p-4 h-auto border rounded-1xl' elevation={1}>
            <Box className='flex justify-between'>
              <Text variant='h4' className='mt-4 font-medium'>
                Transactions Summary
              </Text>
            </Box>
            <Text variant='label1' className='text-gray-400'>
              Showing 1 - {rows.length} out of {rows.length}
            </Text>
            <DataGrid initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }
              },
            }} className='mt-4 border-none text-gray-600 cursor-pointer' {...GridTableProps} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Payment;

