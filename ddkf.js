import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, Text, Div, Flex, IconButton, DataGrid, Tag } from '@enbdleap/react-ui';
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
    total: "-",
    rejection: "-"
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
      title: 'File Transactions',
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
         {/* Header and category cards */}
        <Grid item xs={12}>
          <Box className='flex gap-5'>
            {paymentSummaryDetails.map((detail, index) => (
              <Card
                key={index}
                className={`shadow-none border-solid w-full border mt-2 p-3 cursor-pointer rounded-lg`}
                onClick={() => filterTableData(detail.category)}
              >
                <Div className='flex justify-between'>
                  <Div>
                  <Text variant='label2' className='text-gray-500 font-medium'>
                  {detail.title}
                </Text>
                <Div className='flex justify-between'>
                  <Text variant='label2' className='text-md mt-2  '>
                    {detail.amount} AED
                  </Text>
                </Div>
                  </Div>
                
                <Box className='flex justify-between items-center'>
                  <Text variant='h3' className='font-semibold font-xl'>
                    {detail.count}
                  </Text>
                </Box>
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
