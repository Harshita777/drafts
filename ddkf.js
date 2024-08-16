import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_DASHBOARD_REQUEST, FETCH_PENDING_REQUEST, FETCH_TRANSACTION_REQUEST } from '../../Redux/Actions/DashboardActions';
import {
  Box, Text, Card, Tag, Button, IconButton, Div
} from "@enbdleap/react-ui";
import { Grid, GridTable } from '@enbdleap/react-ui';
import { useNavigate } from 'react-router-dom'
import { ChevronRightSmall } from '@enbdleap/react-icons'

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const dashboardState = useSelector((state: any) => state.dashboardReducer);
  const pendingState = useSelector((state: any) => state.pendingReducer);
  useEffect(() => {
    dispatch({ type: FETCH_DASHBOARD_REQUEST });
    dispatch({ type: FETCH_PENDING_REQUEST });
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch({ type: FETCH_DASHBOARD_REQUEST });
  };
 
  
  console.log("pendingState",pendingState);
  
  console.log("currentTransactions",dashboardState);
  const handleCellClick = (transaction:any) => {
    // if(status=== "Pending Authorisation"){
      navigate('/transaction')
    
  
  }
  const columns = [

    {
      field: "type",
      flex: 1,
      headerName: 'Type',
      

    }
    ,
    {
      field: 'date',
      flex: 1,
      headerName: 'Initiate Date',
      
    },
    {
      field: 'amount',
      flex: 1,
      headerName: 'Amount',
      
    },
    {
      field: 'status',
      flex: 1,
      headerName: 'Status',
      renderCell: (params: any) => (<div>
        <Tag size='medium' type={params.value.type} label={params.value.label} />
      </div>
      )
    }
  ]
  const statusTags: any = {
    "Pending Authorisation": { label: "Pending Authorisation", type: "pending" },
    "Sent to Bank": { label: "Sent to Bank", type: "completed" },
    "Rejected by Bank": { label: "Rejected by Bank", type: "error" },
    "Parsing Failed": { label: "Parsing Failed", type: "error" },
    "Ready for Verification": { label: "Ready for Verification", type: "pending" },
    "Approved": { label: "Approved", type: "completed" },
    "Conversion Failed": { label: "Conversion Failed", type: "error" },
  }



  const rows = dashboardState.data && 
    dashboardState.data.map((item: any, index: number) => ({
      id: index + 1,
      type: item.type,
      date: item.date,
      amount: item.amount,
      status: statusTags[item.status]
    }))
  

  const GridTableProps = {
    rows: rows,
    columns: columns,
    hidePagination: false,
    checkboxSelection: false,
    autoPageSize: false,
    disableColumnMenu: false,
    autoHeight: true,
    onCellClick: handleCellClick,
    disableColumnFilter: false,
    paginationModel: {
      pageSize: 10,
      page:0
    },
    hideFooterRowCount: false
  };
  return (

    <Grid container className='bg-blue-50' spacing={2} sx={{
      p: 3,
    }}>
      {/* <Grid item xs={12}>
        <Card className='shadow-none p-2 h-auto border rounded-1xl' elevation={3}
        >
          <Box className='flex justify-between'>
            <Text variant='h4' className='mt-4 ml-2 font-normal'> Pendings Activities </Text>
            <Button onClick={handleRefresh} variant='tertiary'>Refresh</Button>
          </Box>

          <Box className='flex p-3 gap-5 '>
            <Card className="shadow border mt-2 w-2/5 p-3 rounded-lg">
              <Box className='flex justify-between'>
                <Text variant='h5' className="font-normal">All</Text>
                <IconButton className="text-gray-500"><ChevronRightSmall /></IconButton>
              </Box>

              <Text variant='label3' className="text-gray-500">{dashboardState?.pendingActivities?.pendingAll.count} Individual Transactions</Text>
              <Div className='flex justify-between'>
                <Text variant='label3' className="text-gray-500">{dashboardState?.pendingActivities?.pendingAll.files} Files</Text>
                <Text variant='label3' className="text-md font-semibold text-gray-600">{dashboardState?.pendingActivities?.pendingAll.amount}</Text>
              </Div>

            </Card>


            <Card className="shadow mt-2 border w-2/5 p-3 rounded-lg">
              <Box className='flex justify-between'>
                <Text variant="h5" className="font-normal">Telegraphic</Text>
                <IconButton className="text-gray-500"><ChevronRightSmall /></IconButton>
              </Box>

              <Text variant='label3' className="text-gray-500">{dashboardState?.pendingActivities?.telegraphics.count} Individual Transactions</Text>
              <Div className='flex justify-between'>
                <Text variant='label3' className="text-gray-500">{dashboardState?.pendingActivities?.telegraphics.files} Files</Text>
                <Text variant='label3' className="text-md font-semibold text-gray-600">{dashboardState?.pendingActivities?.telegraphics.amount}</Text>
              </Div>
            </Card>
            <Card className="shadow mt-2 border w-2/5 p-3 rounded-lg">
              <Box className='flex justify-between'>
                <Text variant="h5" className="font-normal">Within Bank</Text>
                <IconButton className="text-gray-500"><ChevronRightSmall /></IconButton>
              </Box>

              <Text variant='label3' className="text-gray-500">{dashboardState?.pendingActivities?.withinBank.count} Individual Transactions</Text>
              <Div className='flex justify-between'>
                <Text variant='label3' className="text-gray-500">{dashboardState?.pendingActivities?.withinBank.files} Files</Text>
                <Text variant='label3' className="text-md font-semibold text-gray-600">{dashboardState?.pendingActivities?.withinBank.amount}</Text>
              </Div>
            </Card>
          </Box>
        </Card>
      </Grid> */}
      <Grid item xs={12}>
        <Card className='shadow-none mt-5 p-2 h-auto border rounded-1xl' elevation={3} >
          <Box className='flex justify-between'>
            <Text variant='h4' className='mt-4  font-normal'> Recent Transactions </Text>

            <Button onClick={handleRefresh} variant='tertiary'>Refresh</Button>
          </Box>
          <Text variant="label1" className=' text-gray-400'>Showing 1 - 10 out of 16</Text>

          <GridTable
            className='mt-4 border-none cursor-pointer'
            {...GridTableProps}

          />
        </Card>

      </Grid>
    </Grid>
  );
};

export default Dashboard;















Uncaught runtime errors:
×
ERROR
Cannot read properties of undefined (reading 'length')
TypeError: Cannot read properties of undefined (reading 'length')
    at IM (webpack://dashboard/./node_modules/@enbdleap/react-ui/lib/index.js?:242:129364)
    at FA (webpack://dashboard/./node_modules/@enbdleap/react-ui/lib/index.js?:242:314832)
    at OI (webpack://dashboard/./node_modules/@enbdleap/react-ui/lib/index.js?:242:273567)
    at PL (webpack://dashboard/./node_modules/@enbdleap/react-ui/lib/index.js?:242:355845)
    at eval (webpack://dashboard/./node_modules/@enbdleap/react-ui/lib/index.js?:242:399278)
    at renderWithHooks (webpack://dashboard/./node_modules/react-dom/cjs/react-dom.development.js?:15486:18)
    at updateForwardRef (webpack://dashboard/./node_modules/react-dom/cjs/react-dom.development.js?:19240:20)
    at beginWork (webpack://dashboard/./node_modules/react-dom/cjs/react-dom.development.js?:21670:16)
    at HTMLUnknownElement.callCallback (webpack://dashboard/./node_modules/react-dom/cjs/react-dom.development.js?:4164:14)
    at Object.invokeGuardedCallbackDev (webpack://dashboard/./node_modules/react-dom/cjs/react-dom.development.js?:4213:16)
ERROR
Cannot read properties of undefined (reading 'length')
TypeError: Cannot read properties of undefined (reading 'length')
    at IM (webpack://dashboard/./node_modules/@enbdleap/react-ui/lib/index.js?:242:129364)
    at FA (webpack://dashboard/./node_modules/@enbdleap/react-ui/lib/index.js?:242:314832)
    at OI (webpack://dashboard/./node_modules/@enbdleap/react-ui/lib/index.js?:242:273567)
    at PL (webpack://dashboard/./node_modules/@enbdleap/react-ui/lib/index.js?:242:355845)
    at eval (webpack://dashboard/./node_modules/@enbdleap/react-ui/lib/index.js?:242:399278)
    at renderWithHooks (webpack://dashboard/./node_modules/react-dom/cjs/react-dom.development.js?:15486:18)
    at updateForwardRef (webpack://dashboard/./node_modules/react-dom/cjs/react-dom.development.js?:19240:20)
    at beginWork (webpack://dashboard/./node_modules/react-dom/cjs/react-dom.development.js?:21670:16)
    at beginWork$1 (webpack://dashboard/./node_modules/react-dom/cjs/react-dom.development.js?:27460:14)
    at performUnitOfWork (webpack://dashboard/./node_modules/react-dom/cjs/react-dom.development.js?:26594:12)



{
  "data": [
    {
      "transactionId": "TXN001",
      "paymentAmount": 1000,
      "debitedAmount": 1000,
      "status": "Sent to Bank",
      "TransactionType": "Telegraphic Transfer",
      "currency": "USD",
      "initiateDate": "2024-08-01T00:00:00.000Z"
    },
    {
      "transactionId": "TXN002",
      "paymentAmount": 5000,
      "debitedAmount": 5000,
      "status": "Approved",
      "TransactionType": "Within Bank Transfer",
      "currency": "AED",
      "initiateDate": "2024-08-02T00:00:00.000Z"
    },
    {
      "transactionId": "TXN003",
      "paymentAmount": 1500,
      "debitedAmount": 1500,
      "status": "Pending",
      "TransactionType": "Telegraphic Transfer",
      "currency": "USD",
      "initiateDate": "2024-08-03T00:00:00.000Z"
    },
    {
      "transactionId": "TXN004",
      "paymentAmount": 2000,
      "debitedAmount": 2000,
      "status": "Approved",
      "TransactionType": "FileUpload",
      "currency": "GBP",
      "initiateDate": "2024-08-04T00:00:00.000Z"
    },
    {
      "transactionId": "TXN005",
      "paymentAmount": 2500,
      "debitedAmount": 2500,
      "status": "Approved",
      "TransactionType": "Within Bank Transfer",
      "currency": "USD",
      "initiateDate": "2024-08-05T00:00:00.000Z"
    },
    {
      "transactionId": "TXN006",
      "paymentAmount": 3000,
      "debitedAmount": 3000,
      "status": "Pending",
      "TransactionType": "TT",
      "currency": "EUR",
      "initiateDate": "2024-08-06T00:00:00.000Z"
    }
  ]
}
