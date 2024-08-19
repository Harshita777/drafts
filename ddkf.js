import React, { useState } from 'react';
import { Tabs, Tab, Button, Menu, MenuItem, Box, Alert, Text } from '@enbdleap/react-ui';
import { ChevronDownSmall, ChevronRightSmall } from '@enbdleap/react-icons';

interface TabsComponentProps {
  handleDropdownClick: () => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({ handleDropdownClick }) => {
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
    handleDropdownClick();
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

  // Render content based on the selected tab
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
