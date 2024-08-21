import React, { useState } from 'react';
import { Tabs, Tab, Button, Menu, MenuItem, Box, Alert, Text, Div } from '@enbdleap/react-ui';
import { ChevronUpSmall, ChevronDownSmall } from '@enbdleap/react-icons';
import Payment from './Payment';
import { useNavigate } from 'react-router-dom';

const TabsComponent: React.FC = () => {
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hovering, setHovering] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (value: string) => {
    if (value === "telegraphic") {
      navigate("/dashboard/payments/telegraphic-bank-transfer");
    } else if (value === "file-upload") {
      navigate("/dashboard/payments/file-upload");
    } else if (value === "within-bank-transfer") {
      navigate("/dashboard/payments/within-bank-transfer");
    }
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const renderContent = () => {
    switch (value) {
      case 0:
        return <Payment transferType="all" />;
      case 1:
        return <Payment transferType="single" />;
      case 2:
        return <Payment transferType="file-upload" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Box className='flex justify-between w-full bg-blue-50'>
        <Tabs value={value} onChange={handleTabChange}>
          <Tab label="All" />
          <Tab label="Single" />
          <Tab label="File Upload" />
        </Tabs>
        <Div>
          <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            position="relative"
            display="inline-block"
            className='flex '
          >
            {hovering && (
              <Div className='h-10'>
                <Alert
                  severity="info"
                  className='h-10 flex align-center border rounded'
                  action={<Button color="secondary" size="small">Dismiss</Button>}
                >
                  <Text variant="h6">Your available current daily limit is 50,000.00 AED</Text>
                </Alert>
              </Div>
            )}
            <Button
              size="medium"
              onClick={handleButtonClick}
              className="px-6 mt-1 mr-5"
            >
              Initiate Payment <ChevronDownSmall />
            </Button>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={() => handleClick("single")}>
              Single <Div className='ml-20 mt-2'><ChevronUpSmall /></Div>
            </MenuItem>

            <Box sx={{ pl: 2 }}>
              <MenuItem onClick={() => handleClick("telegraphic")}>Telegraphic Transfer</MenuItem>
              <MenuItem onClick={() => handleClick("within-bank-transfer")}>Within Bank Transfer</MenuItem>
            </Box>

            <MenuItem onClick={() => handleClick("file-upload")}>File Upload</MenuItem>
          </Menu>
        </Div>
      </Box>
      <Box mt={2}>{renderContent()}</Box>
    </>
  );
};

export default TabsComponent;





import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, GridTable, Text, Tag, Div } from '@enbdleap/react-ui';
import { useNavigate } from 'react-router-dom';
import { FETCH_TRANSACTION_SUMMARY_REQUEST } from '../../../redux/actions/DashboardActions';
import { transactionSummaryColumns } from '../../../config/config';

interface PaymentProps {
  transferType: string;
}

const Payment: React.FC<PaymentProps> = ({ transferType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactionSummaryState = useSelector((state: any) => state.transactionSummaryReducer);

  useEffect(() => {
    dispatch({
      type: FETCH_TRANSACTION_SUMMARY_REQUEST,
      payload: { userId: "user001" }
    });
  }, [dispatch]);

  const handleCellClick = (params: any) => {
    if (params.row && params.row.status && params.row.status.label) {
      const status = params.row.status?.label;
      if (status === 'Pending') {
        navigate(`/dashboard/transaction?trid=1234`);
      }
    }
  };

  const statusTags: any = {
    'Pending': { label: 'Pending', type: 'pending' },
    'Sent to Bank': { label: 'Sent to Bank', type: 'completed' },
    'Rejected by Bank': { label: 'Rejected by Bank', type: 'error' },
    'Parsing Failed': { label: 'Parsing Failed', type: 'error' },
    'Ready for Verification': { label: 'Ready for Verification', type: 'pending' },
    'Approved': { label: 'Approved', type: 'completed' },
    'Conversion Failed': { label: 'Conversion Failed', type: 'error' },
  };

  const rows = transactionSummaryState.data
    ? transactionSummaryState.data
        .filter((item: any) => {
          if (transferType === "all") return true;
          return item.transactionType.TransactionType === transferType;
        })
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
          status: statusTags[item.transactionStatus.status]
        }))
    : [];

  const GridTableProps = {
    rows: rows,
    columns: [
      ...transactionSummaryColumns,
      {
        field: 'status',
        flex: 1,
        headerName: 'Status',
        renderCell: (params: any) => (
          <div>
            <Tag size='medium' type={params?.value?.type} label={params?.value?.label} />
          </div>
        ),
      },
      {
        field: 'rejection',
        flex: 1,
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
            <Box className='flex flex-1 p-3 gap-5'>
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
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className='shadow-none mt-5 p-2 h-auto border rounded-1xl' elevation={1}>
            <Box className='flex justify-between'>
              <Text variant='h5' className='font-normal'>Transaction Summary</Text>
            </Box>
            <GridTable {...GridTableProps} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Payment;
