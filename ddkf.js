import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, Text, Div, Tag, DataGrid } from '@enbdleap/react-ui';
import { useNavigate } from 'react-router-dom';
import { FETCH_TRANSACTION_SUMMARY_REQUEST } from '../../../redux/actions/DashboardActions';
import { statusTags, transactionSummaryColumns } from '../../../config/config';
import { infoStore } from '../../../services/infoStore';

interface PendingActivitiesProps {
  transferType: string;
}

const PendingActivities: React.FC<PendingActivitiesProps> = ({ transferType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactionSummaryState = useSelector((state: any) => state.transactionSummaryReducer);
  const userId = infoStore.getSubscriberId();

  useEffect(() => {
    if (userId) {
      dispatch({ type: FETCH_TRANSACTION_SUMMARY_REQUEST, payload: { userId } });
    }
  }, [dispatch, userId]);

  const handleCellClick = (params: any) => {
    if (params.row && params.row.status && params.row.status.label) {
      const status = params.row.status?.label;
      const type = params.row.fileType;
      const typeUrl = type.toString().toLowerCase().split(' ').join('-');
      const rfid = params.row.referenceId;

      if (status === 'Pending Authorization' && type === "File Upload") {
        navigate(`/dashboard/payments/file-verify`, { state: rfid });
      } else if (status === 'Pending Authorization' && (type === "Telegraphic Transfer" || type === "Within Bank Transfer")) {
        navigate(`/dashboard/payments/${typeUrl}?rfId=${rfid}`);
      }
    }
  };

  const filteredData = transactionSummaryState.data || [];

  const allTransactions = filteredData.filter((item: any) =>
    (item.transactionType.name.includes("Telegraphic Transfer") ||
      item.transactionType.name.includes("Within Bank Transfer") ||
      item.transactionType.name.includes("File Upload")) &&
    (item.transactionStatus.status === 'Pending Authorization' ||
      item.transactionStatus.status === 'Ready to Verify' ||
      item.transactionStatus.status === 'Ready to Approve')
  );

  const filteredRows = allTransactions.filter((item: any) => {
    if (transferType === 'All') {
      return true;
    } else if (transferType === 'Telegraphic Transfer') {
      return item.transactionType.name.includes("Telegraphic Transfer") ||
             item.transactionType.name.includes("Within Bank Transfer");
    } else if (transferType === 'File Upload') {
      return item.transactionType.name.includes("File Upload");
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

  const countByStatus = (status: string) => 
    filteredRows.filter((item: any) => item.status.label === status).length;

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
      <Grid container className='w-full h-auto shadow-bottom' margin={0}>
        <Card className='bg-blue-50 w-full flex justify-between'></Card>
      </Grid>

      <Grid container spacing={2} className='px-7 mt-28'>
        <Grid item xs={4}>
          <Card className='flex shadow-none p-2 h-auto border rounded-1xl'>
            <Box className='flex flex-1 p-3 gap-5'>
              <Card className='shadow-none border-solid w-full border mt-2 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-bold'>
                    {countByStatus('Pending Authorization')}
                  </Text>
                </Box>
                <Text variant='label3' className='text-gray-500 font-medium'>
                  Pending Authorization
                </Text>
                <Div className='flex justify-between'>
                  <Text variant='label3' className='text-md font-semibold text-gray-500'>
                    AED {filteredRows.reduce((sum: number, item: any) => 
                      item.status.label === 'Pending Authorization' 
                        ? sum + (item.amount || 0)
                        : sum, 0
                    )}
                  </Text>
                </Div>
              </Card>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className='flex shadow-none p-2 h-auto border rounded-1xl'>
            <Box className='flex flex-1 p-3 gap-5'>
              <Card className='shadow-none border-solid w-full border mt-2 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-bold'>
                    {countByStatus('Ready to Verify')}
                  </Text>
                </Box>
                <Text variant='label3' className='text-gray-500 font-medium'>
                  Ready to Verify
                </Text>
                <Div className='flex justify-between'>
                  <Text variant='label3' className='text-md font-semibold text-gray-500'>
                    AED {filteredRows.reduce((sum: number, item: any) => 
                      item.status.label === 'Ready to Verify' 
                        ? sum + (item.amount || 0)
                        : sum, 0
                    )}
                  </Text>
                </Div>
              </Card>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className='flex shadow-none p-2 h-auto border rounded-1xl'>
            <Box className='flex flex-1 p-3 gap-5'>
              <Card className='shadow-none border-solid w-full border mt-2 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-bold'>
                    {countByStatus('Ready to Approve')}
                  </Text>
                </Box>
                <Text variant='label3' className='text-gray-500 font-medium'>
                  Ready to Approve
                </Text>
                <Div className='flex justify-between'>
                  <Text variant='label3' className='text-md font-semibold text-gray-500'>
                    AED {filteredRows.reduce((sum: number, item: any) => 
                      item.status.label === 'Ready to Approve' 
                        ? sum + (item.amount || 0)
                        : sum, 0
                    )}
                  </Text>
                </Div>
              </Card>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} className='mb-4'>
          <Card className='shadow-none p-2 h-auto border rounded-1xl' elevation={3}>
            <Box className='flex justify-between'>
              <Text variant='h4' className='mt-4 font-medium'>
                Transactions Summary
              </Text>
            </Box>
            <Text variant='label1' className='text-gray-400'>
              Showing 1 - 10 out of {filteredRows.length}
            </Text>

            {filteredRows.length > 0 && (
              <DataGrid initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} className='mt-4 text-gray-600 z-0 cursor-pointer ' {...GridTableProps} />
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PendingActivities;
