import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Visually hidden input for file selection
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

export default function InputFileUpload() {
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      console.log('Selected files:', files); // Handle the uploaded files here
    }
  };

  return (
    <Button
      component="label"
      variant="contained"
      color="primary"
      startIcon={<CloudUploadIcon />}
      sx={{
        backgroundColor: 'white',
        color: 'black',
        width:'90%',
        '&:hover': {
          backgroundColor: 'lightgray',
        },
        padding: 3, // Padding around the group
        backgroundColor: 'white', // Optional background styling
        borderRadius: '8px',
        margin: '0 auto', // Center horizontally
      }}
    >
      Upload Stimuli Files
      <VisuallyHiddenInput
        type="file"
        onChange={handleFileChange}
        multiple // Allow multiple file selection
      />
    </Button>
  );
}
