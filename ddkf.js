import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, GridTable, Text, Tag, Div } from '@enbdleap/react-ui';
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
    dispatch({
      type: FETCH_TRANSACTION_SUMMARY_REQUEST,
      payload: { userId: userId }
    });
  }, [dispatch]);

  const handleCellClick = (params: any) => {

    if (params.row && params.row.status && params.row.status.label) {

      const status = params.row.status?.label;
      const type = params.row.fileType;
      const trid = params.row.transactionId;
      const rfid = params.row.reference


      if (status === 'Pending Authorization' && type === "File Upload") {
        navigate(`/dashboard/payments/file-verify`, { state: trid, replace: true });
      } else if (status === 'Pending Authorization' && (type === "Telegraphic Transfer" || type === "Within Bank Transfer")) {
        navigate(`/dashboard/payments/transaction?rfid=${rfid}`, { replace: true });
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
        console.log('item', item)
        return {
          id: index + 1,
          date: item.paymentDetails.paymentDate,
          amount: item.debitAccount?.balance,
          account: item.beneficiary?.beneficiaryIBAN,
          name: item.beneficiary?.beneficiaryName,
          customer: item.additionalDetails.customerReference,
          fileType: item.transactionType.name,
          debit: item.debitAccount?.accountNumber,
          accountName: item.debitAccount?.accountName,
          local: item.debitAccount?.currencyCode,
          payment: item.paymentDetails.paymentAmount,
          currency: item.paymentDetails.paymentCurrency,
          type: item.debitAccount?.accountType,
          paymentDate: item.paymentDetails.paymentDate,
          reference: item.beneficiary?.beneficiaryReferenceId,
          status: statusTags[item.transactionStatus.status],
          transactionId: item.transactionId,
          referenceId: item.referenceId,
          total:"..",
          rejection:".."
        }
      })
    : [];

  const GridTableProps = {
    rows: rows,
    columns: [
      {
        field: 'date',
        width: 110,
        headerName: 'Initiate Date',
        renderCell: (params: any) => {
          if (params.value) {
            const dateObj = new Date(params.value);
            return dateObj.toLocaleDateString('en-US');
          }
          else {
            return '';
          }
        },
      },
      ...transactionSummaryColumns,
      {
        field: 'status',
        width: 150,
        headerName: 'Status',
        renderCell: (params: any) => (
          <div>
            <Tag size='medium' type={params?.value?.type} label={params?.value?.label} />
          </div>
        ),
      },
      {
        field: 'rejection',
        width: 150,
        headerName: 'Rejection Reason',
      }
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
          <Card className='flex shadow-none p-2 h-auto border rounded-1xl'>
            <Box className=' flex flex-1 p-3 gap-5'>
              <Card className='shadow-none border-solid  w-full border mt-2 p-3 rounded-lg'>
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
              <Card className='shadow-none border-solid  w-full border mt-2 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-normal'>
                    16
                  </Text>
                </Box>
                <Text variant='label3' className='text-gray-500'>
                  Single
                </Text>
                <Div className='flex justify-between'>
                  <Text variant='label3' className='text-md font-semibold text-gray-600'>
                    10,500,000 AED
                  </Text>
                </Div>
              </Card>
            </Box>
            <Box className='flex flex-1 p-3 gap-5'>
              <Card className='shadow-none border-solid  w-full border mt-2 p-3 rounded-lg'>
                <Box className='flex justify-between'>
                  <Text variant='h5' className='font-normal'>
                    16
                  </Text>
                </Box>
                <Text variant='label3' className='text-gray-500'>
                  Files
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
          <Card className='shadow-none mt-5 p-2 h-auto border rounded-1xl' elevation={1}>
            <Box className='flex justify-between'>
              <Text variant='h4' className='mt-4 font-normal'>
                Transactions Summary
              </Text>
            </Box>
            <Text variant='label1' className='text-gray-400'>
              Showing 1 - 10 out of 98
            </Text>
            <GridTable className='mt-4 text-gray-600' {...GridTableProps} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Payment;
