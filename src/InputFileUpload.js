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

  const handleFileChange = async (event) => {
    const files = event.target.files;  // Get all selected files
    if (!files.length) return;

    const formData = new FormData();
    
    // Append all selected files to FormData
    for (let file of files) {
      formData.append("files", file);
    }

    try {
      const response = await fetch("http://localhost:8000/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Uploaded Images:", result.uploaded_images);
      console.log("Rejected Images:", result.rejected_files);
    } catch (error) {
      console.error("Error uploading images:", error);
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
      Upload Images
      <VisuallyHiddenInput
        type="file"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/heic"
        multiple // Allow multiple file selection
      />
    </Button>
  );
}
