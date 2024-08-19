import React, { useState } from 'react';
import { Tabs, Tab, Button, Menu, MenuItem, Box } from '@enbdleap/react-ui';
import { ChevronDownSmall, ChevronRightSmall } from '@enbdleap/react-icons';

interface TabsComponentProps {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  handleHover: () => JSX.Element;
  handleDropdownClick: () => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({
  value,
  handleChange,
  handleHover,
  handleDropdownClick
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setSubMenuOpen(false); // Close the sub-menu if already open
    handleDropdownClick(); // Trigger any additional logic on button click
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuOpen(false);
  };

  const handleSingleClick = () => {
    setSubMenuOpen(!subMenuOpen); // Toggle the sub-menu open or close
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" scrollButtons>
        <Tab label="All" />
        <Tab label="Single" />
        <Tab label="File Upload" />
      </Tabs>
      <Button
        size='medium'
        onMouseEnter={handleHover}
        onClick={handleButtonClick}
        className='px-6 mt-1 mr-5'
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
  );
};

export default TabsComponent;
