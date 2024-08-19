import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { FETCH_DASHBOARD_REQUEST, FETCH_PENDING_REQUEST, FETCH_TRANSACTION_REQUEST } from '../../Redux/Actions/DashboardActions';
import {
  Box, Text, Card, Tag, Button, IconButton, Div, Flex, Tabs, Tab, Alert, Link
} from "@enbdleap/react-ui";
import { Grid, GridTable } from '@enbdleap/react-ui';
import { useNavigate } from 'react-router-dom'
import { ChevronRightSmall } from '@enbdleap/react-icons'
import { ChevronDownSmall } from '@enbdleap/react-icons'
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const dashboardState = useSelector((state: any) => state.dashboardReducer);
  const pendingState = useSelector((state: any) => state.pendingReducer);
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  //   useEffect(() => {
  //     dispatch({ type: FETCH_DASHBOARD_REQUEST });
  //     dispatch({ type: FETCH_PENDING_REQUEST });
  //   }, [dispatch]);

  //   const handleRefresh = () => {
  //     dispatch({ type: FETCH_DASHBOARD_REQUEST });
  //   };

  const handleCellClick = (params: any) => {
    console.log("params", params);
    if (params.row && params.row.status && params.row.status.label) {
      const status = params.row.status?.label
      if (status === "Pending") {
        navigate(`/transaction?trid=${params.row.transactionId}`)
      }
    }

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
    "Pending": { label: "Pending", type: "pending" },
    "Sent to Bank": { label: "Sent to Bank", type: "completed" },
    "Rejected by Bank": { label: "Rejected by Bank", type: "error" },
    "Parsing Failed": { label: "Parsing Failed", type: "error" },
    "Ready for Verification": { label: "Ready for Verification", type: "pending" },
    "Approved": { label: "Approved", type: "completed" },
    "Conversion Failed": { label: "Conversion Failed", type: "error" },
  }
  const rows = dashboardState.data ?
    dashboardState.data.map((item: any, index: number) => ({
      id: index + 1,
      type: item.TransactionType,
      date: item.initiateDate,
      amount: item.paymentAmount,
      status: statusTags[item.status],
      transactionId: item.transactionId
    })) : []

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
    paginationModel: {
      pageSize: 10,
      page: 0
    },
    hideFooterRowCount: false
  };
  const handleHover =() => {
    return (
        <Alert severity='info' action={<Button color='secondary' size='medium'> Dismiss </Button>}>
        <Text variant='h6'>
            Your available current daily limit is 50,000.00 AED  
        </Text>
    </Alert>
    )
}
  return (
    <>
      <Grid container className="w-full h-auto shadow-bottom" margin={0}>
        <Card className='bg-blue-50 w-full flex justify-between'>
          <Box sx={{}}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" scrollButtons>
              <Tab label="All" />
              <Tab label="Single" />
              <Tab label="File Upload" />


            </Tabs>
          </Box>

          <Button size='medium' onMouseEnter={handleHover} className='px-6 mt-1 mr-5' >Initiate Payment  <ChevronDownSmall/></Button>


         
        </Card>

       

      </Grid>
      <Grid container spacing={2} className='p-9'>
        <Grid item xs={12}>
          <Card className='shadow-none p-2 h-auto border rounded-1xl' elevation={3}>


            <Box className='flex p-3 gap-5'>
              {pendingState?.data?.map((item: any, index: any) => {
                const category = Object.keys(item)[0];
                const details = item[category][0];
                const categoryTitles: any = {
                  'pending-all': 'All',
                  'telegraphics': 'Telegraphic',
                  'withinbank': 'Within Bank'
                };
                return (
                  <Card key={index} className="shadow border mt-2 w-2/5 p-3 rounded-lg">
                    <Box className='flex justify-between'>
                      <Text variant='h5' className="font-normal">{categoryTitles[category]}</Text>
                      <IconButton className="text-gray-500 -m-3"><ChevronRightSmall /></IconButton>
                    </Box>

                    <Text variant='label3' className="text-gray-500">
                      {details.count} Individual Transactions
                    </Text>
                    <Div className='flex justify-between'>
                      <Text variant='label3' className="text-gray-500">
                        {details.files} Files
                      </Text>
                      <Text variant='label3' className="text-md font-semibold text-gray-600">
                        {details.amount}
                      </Text>
                    </Div>
                  </Card>
                );
              })}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card className='shadow-none mt-5 p-2 h-auto border rounded-1xl' elevation={3} >
            <Box className='flex justify-between'>
              <Text variant='h4' className='mt-4  font-normal'>Transactions Summary</Text>


            </Box>
            <Text variant="label1" className=' text-gray-400'>Showing 1 - 10 out of 16</Text>

            {rows.length > 0 && (
              <GridTable
                className='mt-4 border-none cursor-pointer'
                {...GridTableProps}

              />
            )

            }
          </Card>

        </Grid>
      </Grid>
    </>

  );
};

export default Dashboard;
