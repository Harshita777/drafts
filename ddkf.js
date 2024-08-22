import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, Text, Div, Tag, DataGrid } from '@enbdleap/react-ui';
import { useNavigate } from 'react-router-dom';
import { FETCH_TRANSACTION_SUMMARY_REQUEST } from '../../../redux/actions/DashboardActions';
import { statusTags, transactionPendingColumns } from '../../../config/config';
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
      const trid = params.row.transactionId;
      const rfid = params.row.referenceId;

      if (status === 'Pending Authorization' && type === "File Upload") {
        navigate(`/dashboard/payments/file-verify`, { state: trid });
      } else if (status === 'Pending Authorization' && (type === "Telegraphic Transfer" || type === "Within Bank Transfer")) {
        navigate(`/dashboard/payments/transaction?rfid=${rfid}`);
      }
    }
  };

  const filteredData = transactionSummaryState.data || [];

  const allTransactions = filteredData.filter((item: any) =>
    (item.transactionType.name.includes("Telegraphic Transfer") || item.transactionType.name.includes("Within Bank Transfer") || item.transactionType.name.includes("File Upload")) &&
    (item.transactionStatus.status === 'Pending Authorization' || item.transactionStatus.status === 'Ready to Verify')
  );

  const singleTransactions = allTransactions.filter((item: any) =>
    item.transactionType.name.includes("Telegraphic Transfer") || item.transactionType.name.includes("Within Bank Transfer")
  );

  const fileTransactions = allTransactions.filter((item: any) =>
    item.transactionType.name.includes("File Upload")
  );

  const allTransactionCount = allTransactions.length;
  const singleTransactionCount = singleTransactions.length;
  const fileTransactionCount = fileTransactions.length;

  const allAmount = allTransactions.reduce((sum: number, item: any) => sum + (item.debitAccount?.balance || 0), 0);
  const singleAmount = singleTransactions.reduce((sum: number, item: any) => sum + (item.debitAccount?.balance || 0), 0);
  const fileAmount = fileTransactions.reduce((sum: number, item: any) => sum + (item.debitAccount?.balance || 0), 0);

  const filteredRows = allTransactions.map((item: any, index: number) => ({
    id: index + 1,
    date: item.paymentDetails?.paymentDate,
    amount: item.debitAccount?.balance,
    account: item.beneficiary?.beneficiaryIBAN,
    name: item.beneficiary?.beneficiaryName,
    customer: item.additionalDetails?.customerReference,
    fileType: item.transactionType?.name,
    debit: item.debitAccount?.accountNumber,
    accountName: item.debitAccount?.accountName,
    local: item.paymentDetails?.currency,
    payment: item.paymentDetails?.paymentCurrency,
    currency: item.paymentCurrency?.currency,
    type: item.debitAccount?.accountType,
    paymentDate: item.paymentDetails?.paymentDate,
    reference: item.beneficiary?.beneficiaryReferenceId,
    status: statusTags[item.transactionStatus.status],
    transactionId: item.transactionId,
    referenceId: item.referenceId,
  }));

  const GridTableProps = {
    rows: filteredRows,
    columns: [
      ...transactionPendingColumns,
      {
        field: 'status',
        width: 190,
        headerName: 'Status',
        renderCell: (params: any) => (
          <div>
            <Tag sx={{ maxWidth: '200px' }} size='medium' type={params?.value?.type} label={params?.value?.label} />
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

      <Grid container spacing={2} className='px-7 mt-28 '>
        <Grid item xs={12}>
          <Card className='flex shadow-none p-2 h-auto border rounded-1xl'>
            <Box className='flex flex-1 p-3 gap-5 '>
              <Card className='shadow-none border-solid w-full border mt-2 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-bold'>
                    {allTransactionCount}
                  </Text>
                </Box>
                <Text variant='label3' className='text-gray-500 font-medium'>
                  Total
                </Text>
                <Div className='flex justify-between'>
                  <Text variant='label3' className='text-md font-semibold text-gray-500'>
                    {allAmount} AED
                  </Text>
                </Div>
              </Card>
            </Box>
            <Box className='flex flex-1 p-3 gap-5'>
              <Card className='shadow-none border-solid w-full border mt-2 w-2/5 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-bold'>
                    {singleTransactionCount}
                  </Text>
                </Box>
                <Text variant='label3' className='text-gray-500 font-medium'>
                  Single
                </Text>
                <Div className='flex justify-between'>
                  <Text variant='label3' className='text-md font-semibold text-gray-500'>
                    {singleAmount} AED
                  </Text>
                </Div>
              </Card>
            </Box>
            <Box className='flex flex-1 p-3 gap-5'>
              <Card className='shadow-none border-solid w-full border mt-2 w-2/5 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-bold'>
                    {fileTransactionCount}
                  </Text>
                </Box>
                <Text variant='label3' className='text-gray-500 font-medium'>
                  Files
                </Text>
                <Div className='flex justify-between'>
                  <Text variant='label3' className='text-md font-semibold text-gray-500'>
                    {fileAmount} AED
                  </Text>
                </Div>
              </Card>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
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
              <DataGrid initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} className='mt-4 text-gray-600 z-0' {...GridTableProps} />
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PendingActivities;
