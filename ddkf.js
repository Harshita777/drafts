import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, Text, Div, Tag, DataGrid } from '@enbdleap/react-ui';
import { useNavigate } from 'react-router-dom';
import { FETCH_TRANSACTION_SUMMARY_REQUEST } from '../../../redux/actions/DashboardActions';
import { statusTags, transactionSummaryColumns } from '../../../config/config';
import { infoStore } from '../../../services/infoStore';

// Define the interface for the component props
interface PendingActivitiesProps {
  transferType: string;
}

// Main component definition
const PendingActivities: React.FC<PendingActivitiesProps> = ({ transferType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Accessing the transaction summary state from the Redux store
  const transactionSummaryState = useSelector((state: any) => state.transactionSummaryReducer);

  // Getting userId from a custom info store service
  const userId = infoStore.getSubscriberId();

  // Fetch transaction summary data when the component mounts or when the userId changes
  useEffect(() => {
    if (userId) {
      dispatch({ type: FETCH_TRANSACTION_SUMMARY_REQUEST, payload: { userId } });
    }
  }, [dispatch, userId]);

  // Handle row click based on the status and transaction type
  const handleCellClick = (params: any) => {
    if (params.row && params.row.status && params.row.status.label) {
      const status = params.row.status?.label;
      const type = params.row.fileType;
      const typeUrl = type.toString().toLowerCase().split(' ').join('-');
      const rfid = params.row.referenceId;

      // Redirecting based on the transaction type and status
      if (status === 'Ready for Verification' && type === "File Upload") {
        navigate(`/dashboard/payments/file-verify`, { state: rfid });
      } else if (status === 'Pending Authorization' && (type === "Telegraphic Transfer" || type === "Within Bank Transfer")) {
        navigate(`/dashboard/payments/${typeUrl}?rfId=${rfid}`);
      }
    }
  };

  // Filter the data based on the transfer type
  const filteredData = transactionSummaryState.data || [];
  const allTransactions = filteredData.filter((item: any) =>
    (item.transactionType.name.includes("Telegraphic Transfer") ||
      item.transactionType.name.includes("Within Bank Transfer") ||
      item.transactionType.name.includes("File Upload")) &&
    (item.transactionStatus.status === 'Pending Authorization' ||
      item.transactionStatus.status === 'Ready for Verification')
  );

  // Further filter rows based on the selected transfer type
  const filteredRows = allTransactions.filter((item: any) => {
    if (transferType === 'All') {
      return true;
    } else if (transferType === 'Within Bank Transfer') {
      return item.transactionType.name.includes("File Upload") ||
             item.transactionType.name.includes("Within Bank Transfer");
    } else if (transferType === 'Telegraphic Transfer') {
      return item.transactionType.name.includes("Telegraphic Transfer");
    }
    return false;
  }).map((item: any, index: number) => ({
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

  // Utility function to count rows by status
  const countByStatus = (status: string) => 
    filteredRows.filter((item: any) => item.status.label === status).length;

  // DataGrid props configuration
  const GridTableProps = {
    rows: filteredRows,
    columns: [
      ...transactionSummaryColumns,
      {
        field: 'status',
        width: 190,
        headerName: 'Status',
        renderCell: (params: any) => (
          <div>
            <Tag sx={{ maxWidth: '160px' }} size='medium' type={params?.value?.type} label={params?.value?.label} />
          </div>
        ),
      },
    ],
    hidePagination: false,
    checkboxSelection: false,
    autoPageSize: false,
    disableColumnMenu: true,
    autoHeight: true,
    onRowClick: handleCellClick,
    disableColumnFilter: false,
    hideFooterRowCount: false,
  };

  return (
    <>
      {/* Summary header section */}
      <Grid container className='w-full h-auto shadow-bottom' margin={0}>
        <Card className='bg-blue-50 w-full flex justify-between'></Card>
      </Grid>

      {/* Main content grid layout */}
      <Grid container spacing={2} className='px-7 mt-28'>
        <Grid item xs={12}>
          {/* Transaction Summary Cards */}
          <Card className='flex shadow-none p-2 h-auto border rounded-1xl'>
            <Box className='flex flex-1 p-3 gap-5'>
              {/* Card 1: Total Transactions */}
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

            {/* Card 2: Single Transactions */}
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

            {/* Card 3: File Transactions */}
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

        {/* Data Grid Section */}
        <Grid item xs={12} className='mb-4'>
          <Card className='shadow-none p-4 h-auto border rounded-1xl' elevation={3}>
            <Box className='flex justify-between'>
              <Text variant='h4' className='mt-4 font-medium'>
                Transactions Summary
              </Text>
            </Box>
            <Text variant='label1' className='text-gray-400'>
              Showing 1 - 10 out of {filteredRows.length}
            </Text>

            {/* Display the data grid if there are rows to show */}
            {filteredRows.length > 0 && (
              <DataGrid
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                className='mt-4 text-gray-600 border-none  z-0 cursor-pointer '
                {...GridTableProps}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PendingActivities;
