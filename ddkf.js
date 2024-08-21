import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, GridTable, Text, Div, Tag } from '@enbdleap/react-ui';
import { useNavigate } from 'react-router-dom';
import { FETCH_TRANSACTION_SUMMARY_REQUEST } from '../../../redux/actions/DashboardActions';
import { statusTags, transactionPendingColumns, transactionSummaryColumns } from '../../../config/config';

interface PendingActivitiesProps {
  transferType: string;
}

const PendingActivities: React.FC<PendingActivitiesProps> = ({ transferType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactionSummaryState = useSelector((state: any) => state.transactionSummaryReducer);

  useEffect(() => {
    dispatch({ type: FETCH_TRANSACTION_SUMMARY_REQUEST, payload: { userId: "user001" } });
  }, [dispatch]);

  const handleCellClick = (params: any) => {
    if (params.row && params.row.status && params.row.status.label) {
      const status = params.row.status.label;
      if (status === 'Pending') {
        navigate(`/dashboard/transaction?rfid=1234`);
      }
    }
  };

 

  const filteredRows = transactionSummaryState.data
    ? transactionSummaryState.data
        .filter((item: any) => 
          transferType === 'all' || item.transactionType.TransactionType.includes(transferType)
        )
        .map((item: any, index: number) => ({
          id: index + 1,
          date: item.beneficiaryId.createdAt,
          amount: item.debitAccountId.balance,
          account: item.beneficiaryId.beneficiaryIBAN,
          name: item.beneficiaryId.beneficiaryName,
          customer: item.additionalDetails.customerReference,
          fileType: item.transactionType.TransactionType,
          debit: item.debitAccountId.accountNumber,
          accountName: item.debitAccountId.accountName,
          local: item.paymentCurrency.currency,
          payment: item.paymentDetails.paymentAmount,
          currency: item.paymentCurrency.currency,
          type: item.debitAccountId.accountType,
          paymentDate: item.paymentDetails.paymentDate,
          reference: item.beneficiaryId.beneficiaryReferenceId,
          status: statusTags[item.transactionStatus.status.pending],
        }))
    : [];

  const GridTableProps = {
    rows: filteredRows,
    columns: [
      ...transactionPendingColumns
    ],
    hidePagination: false,
    checkboxSelection: false,
    autoPageSize: false,
    disableColumnMenu: true,
    autoHeight: true,
    onRowClick: handleCellClick,
    disableColumnFilter: true,
    paginationModel: {
      pageSize: 10,
      page: 0,
    },
    hideFooterRowCount: false,
  };

  return (
    <>
      <Grid container className='w-full h-auto shadow-bottom' margin={0}>
        <Card className='bg-blue-50 w-full flex justify-between'></Card>
      </Grid>
      
      <Grid container spacing={2} className='p-9'>
      <Grid item xs={12}>
          <Card className='flex shadow-none  p-2 h-auto border rounded-1xl' >
            <Box className='flex  flex-1 p-3 gap-5 '>


              <Card className='shadow w-full border mt-2 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-normal'>
                    16
                  </Text>

                </Box>
                <Text variant='label3' className='text-gray-500'>
                  Total
                </Text>
                <Div className='flex justify-between'>

                  <Text variant='label3' className='text-md font-semibold text-gray-600'>
                    10,500,000 AED
                  </Text>
                </Div>
              </Card>

            </Box>
            <Box className='flex  flex-1 p-3 gap-5'>


              <Card className='shadow w-full border mt-2 w-2/5 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-normal'>
                    16
                  </Text>

                </Box>
                <Text variant='label3' className='text-gray-500'>
                  Total
                </Text>
                <Div className='flex justify-between'>

                  <Text variant='label3' className='text-md font-semibold text-gray-600'>
                    10,500,000 AED
                  </Text>
                </Div>
              </Card>

            </Box>
            <Box className='flex flex-1 p-3 gap-5'>


              <Card className='shadow w-full border mt-2 w-2/5 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-normal'>
                    16
                  </Text>

                </Box>
                <Text variant='label3' className='text-gray-500'>
                  Total
                </Text>
                <Div className='flex justify-between'>

                  <Text variant='label3' className='text-md font-semibold text-gray-600'>
                    10,500,000 AED
                  </Text>
                </Div>
              </Card>

            </Box>
          </Card>

        </Grid>
        <Grid item xs={12}>
          <Card className='shadow-none mt-5 p-2 h-auto border rounded-1xl' elevation={3}>
            <Box className='flex justify-between'>
              <Text variant='h4' className='mt-4 font-normal'>
                Transactions Summary
              </Text>
            </Box>
            <Text variant='label1' className='text-gray-400'>
              Showing 1 - 10 out of {filteredRows.length}
            </Text>

            {filteredRows.length > 0 && (
              <GridTable className='mt-4 text-gray-600' {...GridTableProps} />
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PendingActivities;
