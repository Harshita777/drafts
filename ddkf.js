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
