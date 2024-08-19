import React, { useState } from 'react';
import {
  Box, Button, Card, Grid, Menu, MenuItem
} from "@enbdleap/react-ui";
import { ChevronDownSmall, ChevronRightSmall } from '@enbdleap/react-icons';

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
