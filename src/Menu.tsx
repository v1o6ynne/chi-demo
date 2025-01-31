// src/Menu.js
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Array of menu options
const options = [
  'Simulation',
  'Evaluation',
  'Handbook',
  'Account',
  'About'
];

// Maximum height of the menu
const ITEM_HEIGHT = 48;

export default function LongMenu() {
  // State to control the menu's visibility
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Function to open the menu
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Icon button to trigger the menu */}
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon sx={{ color: 'white' }} />
      </IconButton>
      
      {/* Menu component */}
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5, // Set maximum height
              width: '20ch', // Set width of the menu
            },
          },
        }}
      >
        {/* Menu items rendered dynamically from the `options` array */}
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === 'Pyxis'} // Optional: Mark 'Pyxis' as selected
            onClick={handleClose} // Close the menu on selection
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
