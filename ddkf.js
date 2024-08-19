import React, { useState } from 'react';
import {
  Box, Button, Card, Text, Grid, Menu, MenuItem, IconButton
} from "@enbdleap/react-ui";
import { useNavigate } from 'react-router-dom';
import { ChevronDownSmall, ChevronRightSmall } from '@enbdleap/react-icons';

const Dashboard = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subAnchorEl, setSubAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubAnchorEl(null);
  };

  const handleSubMenuClick = (event: React.MouseEvent<HTMLLIElement>) => {
    setSubAnchorEl(event.currentTarget);
  };

  const handleSubMenuClose = () => {
    setSubAnchorEl(null);
  };

  return (
    <>
      <Grid container className="w-full h-auto shadow-bottom" margin={0}>
        <Card className='bg-blue-50 w-full flex justify-between'>
          <Box>
            <Button
              size='medium'
              className='px-6 mt-1 mr-5'
              onClick={handleClick}
            >
              Initiate Payment <ChevronDownSmall />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleSubMenuClick}>
                Single <ChevronRightSmall />
              </MenuItem>
              <Menu
                anchorEl={subAnchorEl}
                open={Boolean(subAnchorEl)}
                onClose={handleSubMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <MenuItem onClick={handleClose}>Telegraphic Transfer</MenuItem>
                <MenuItem onClick={handleClose}>Within Bank Transfer</MenuItem>
              </Menu>
              <MenuItem onClick={handleClose}>File Upload</MenuItem>
            </Menu>
          </Box>
        </Card>
      </Grid>

      <Grid container spacing={2} className='p-9'>
        {/* Your existing content for Grid and Card components */}
      </Grid>
    </>
  );
};

export default Dashboard;
