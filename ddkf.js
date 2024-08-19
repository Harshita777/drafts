import React, { useState } from 'react';
import { Tabs, Tab, Button, Menu, MenuItem, Box, Alert, Text } from '@enbdleap/react-ui';
import { ChevronDownSmall, ChevronRightSmall } from '@enbdleap/react-icons';



const TabsComponent: React.FC = ({  }) => {
  const [value, setValue] = useState(0); // State to manage the selected tab
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [hovering, setHovering] = useState(false); // State to manage hover status

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setSubMenuOpen(false);
    
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuOpen(false);
  };

  const handleSingleClick = () => {
    setSubMenuOpen(!subMenuOpen);
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
        return <div>All Page Content</div>;
      case 1:
        return <div>Single Page Content</div>;
      case 2:
        return <div>File Upload Page Content</div>;
      default:
        return <div>All Page Content</div>;
    }
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleTabChange}
        aria-label="basic tabs example"
        scrollButtons
      >
        <Tab label="All" />
        <Tab label="Single" />
        <Tab label="File Upload" />
      </Tabs>
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        position="relative"
        display="inline-block"
      >
        <Button
          size="medium"
          onClick={handleButtonClick}
          className="px-6 mt-1 mr-5"
        >
          Initiate Payment <ChevronDownSmall />
        </Button>
        {hovering && (
          <Alert severity="info" action={<Button color="secondary" size="medium">Dismiss</Button>}
            sx={{ position: 'absolute', top: '100%', left: '0', mt: 1, zIndex: 10 }}
          >
            <Text variant="h6">Your available current daily limit is 50,000.00 AED</Text>
          </Alert>
        )}
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
        <MenuItem onClick={handleSingleClick}>
          Single {subMenuOpen ? <ChevronDownSmall /> : <ChevronRightSmall />}
        </MenuItem>
        {subMenuOpen && (
          <Box sx={{ pl: 2 }}>
            <MenuItem onClick={handleClose}>Telegraphic Transfer</MenuItem>
            <MenuItem onClick={handleClose}>Within Bank Transfer</MenuItem>
          </Box>
        )}
        <MenuItem onClick={handleClose}>File Upload</MenuItem>
      </Menu>
      {/* Render the content based on the selected tab */}
      <Box mt={2}>{renderContent()}</Box>
    </Box>
  );
};

export default TabsComponent;





import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, Grid, GridTable, Alert, Text, Tag, Button, IconButton, Div } from '@enbdleap/react-ui';
import { useNavigate } from 'react-router-dom';
import TabComponent from './TabComponent'; // Import the TabsComponent
import TabsComponent from './TabComponent';
import { ChevronRightSmall } from '@enbdleap/react-icons';

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dashboardState = useSelector((state: any) => state.dashboardReducer);
  const pendingState = useSelector((state: any) => state.pendingReducer);
  const [value, setValue] = React.useState(0);
  

 

  const handleCellClick = (params: any) => {
    if (params.row && params.row.status && params.row.status.label) {
      const status = params.row.status?.label;
      if (status === 'Pending') {
        navigate(`/transaction?trid=${params.row.transactionId}`);
      }
    }
  };

  const statusTags: any = {
    Pending: { label: 'Pending', type: 'pending' },
    'Sent to Bank': { label: 'Sent to Bank', type: 'completed' },
    'Rejected by Bank': { label: 'Rejected by Bank', type: 'error' },
    'Parsing Failed': { label: 'Parsing Failed', type: 'error' },
    'Ready for Verification': { label: 'Ready for Verification', type: 'pending' },
    Approved: { label: 'Approved', type: 'completed' },
    'Conversion Failed': { label: 'Conversion Failed', type: 'error' },
  };

  const rows = dashboardState.data
    ? dashboardState.data.map((item: any, index: number) => ({
        id: index + 1,
        type: item.TransactionType,
        date: item.initiateDate,
        amount: item.paymentAmount,
        status: statusTags[item.status],
        transactionId: item.transactionId,
      }))
    : [];

  const GridTableProps = {
    rows: rows,
    columns: [
      {
        field: 'type',
        flex: 1,
        headerName: 'Type',
      },
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
        renderCell: (params: any) => (
          <div>
            <Tag size='medium' type={params.value.type} label={params.value.label} />
          </div>
        ),
      },
    ],
    hidePagination: false,
    checkboxSelection: false,
    autoPageSize: false,
    disableColumnMenu: false,
    autoHeight: true,
    onRowClick: handleCellClick,
    disableColumnFilter: false,
    paginationModel: {
      pageSize: 10,
      page: 0,
    },
    hideFooterRowCount: false,
  };

  

  

  return (
    <>
      <Grid container className='w-full h-auto shadow-bottom' margin={0}>
        <Card className='bg-blue-50 w-full flex justify-between'>
          <TabsComponent/>
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
                  telegraphics: 'Telegraphic',
                  withinbank: 'Within Bank',
                };
                return (
                  <Card key={index} className='shadow border mt-2 w-2/5 p-3 rounded-lg'>
                    <Box className='flex justify-between'>
                      <Text variant='h5' className='font-normal'>
                        {categoryTitles[category]}
                      </Text>
                      <IconButton className='text-gray-500 -m-3'>
                        <ChevronRightSmall />
                      </IconButton>
                    </Box>
                    <Text variant='label3' className='text-gray-500'>
                      {details.count} Individual Transactions
                    </Text>
                    <Div className='flex justify-between'>
                      <Text variant='label3' className='text-gray-500'>
                        {details.files} Files
                      </Text>
                      <Text variant='label3' className='text-md font-semibold text-gray-600'>
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
          <Card className='shadow-none mt-5 p-2 h-auto border rounded-1xl' elevation={3}>
            <Box className='flex justify-between'>
              <Text variant='h4' className='mt-4 font-normal'>
                Transactions Summary
              </Text>
            </Box>
            <Text variant='label1' className='text-gray-400'>
              Showing 1 - 10 out of 16
            </Text>

            {rows.length > 0 && (
              <GridTable className='mt-4 border-none cursor-pointer' {...GridTableProps} />
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Payment;
