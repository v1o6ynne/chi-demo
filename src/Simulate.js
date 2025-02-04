import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  LinearProgress,
  Button,
} from '@mui/material';

import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Settings from './settings_Simulate';
import Layout from './Layout';
import InputFileUpload from './InputFileUpload'; // Import the file uploader component

import Heatmap from './heatmap';
import BarChart from './barchart';

import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import * as d3 from 'd3';

import useHeatmapData from './useHeatmapData';
import useBarchartData from './useBarchartData';

const Simulate = () => {

  const [model, setModel] = useState('');
  const [dataset, setDataset] = useState('');
  const [region, setRegion] = useState('');
  const [voxelOption, setVoxelOption] = useState('');
  const [voxelNumber, setVoxelNumber] = useState('');
  const [paper, setPaper] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);


  // Load heatmap data from the local CSV file
  // useEffect(() => {
  //   d3.csv('/rdm_ffa.csv', (d) => ({
  //     x: d.x,
  //     y: d.y,
  //     value: +d.value, // Ensure numeric values
  //     cluster: +d.cluster, // Ensure numeric cluster labels
  //   })).then((data) => {
  //     setHeatmapData(data); // Set the data for the heatmap
  //     console.log('Loaded Heatmap Data:', data);
  //   }).catch((error) => {
  //     console.error('Error loading heatmap data:', error);
  //   });
  // }, []);

  const { heatmapData, originalFilenames, sortedFilenames } = useHeatmapData();

  const { barchartData } = useBarchartData();
  
  // useEffect(() => {
  //   d3.csv('/mean_sem_ffa.csv', (d) => ({
  //     filename: d.filename,
  //     mean: +d.mean,
  //     sem: +d.sem,
  //   })).then((data) => {
  //     setBarChartData(data); // Set the data for the heatmap
  //     console.log('Loaded BarChart Data:', data);
  //   }).catch((error) => {
  //     console.error('Error loading barChart data:', error);
  //   });
  // }, []);


  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const response = await fetch("http://localhost:8000/get-selections");
        const data = await response.json();
        if (data.model) setModel(data.model);
        if (data.dataset) setDataset(data.dataset);
        if (data.region) setRegion(data.region);
        if (data.voxelOption) setVoxelOption(data.voxelOption);
        if (data.voxelNumber) setVoxelNumber(data.voxelNumber);
      } catch (error) {
        console.error("Error fetching selections:", error);
      }
    };
    fetchSelections();
  }, []);

  
  const handleSaveSelections = async () => {
    // Validation: Check required fields
    if (!model || !dataset || !region || !voxelOption) {
      alert("Error: Please fill in all required fields (Model, Dataset, Region, Voxel Option).");
      return;
    }
  
    // Validation: Check voxelNumber conditions
    if (voxelOption === "random-voxels" && !voxelNumber) {
      alert("Error: Voxel number is required when selecting 'Random Voxels'.");
      return;
    }
    if ((voxelOption === "specify-a-participant") && !voxelNumber) {
      alert("Error: Participant name is required when selecting 'Specify a Participant'.");
      return;
    }
  
    // Proceed with saving selections
    const selections = {
      model,
      dataset,
      region,
      voxelOption,
      voxelNumber: voxelNumber.toString(),
    };
  
    try {
      const response = await fetch("http://localhost:8000/save-selections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selections),
      });
  
      const result = await response.json();
      console.log("Saved Selections and Images:", result.saved_images);
    } catch (error) {
      console.error("Error saving selections:", error);
    }
  };


  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const content = e.target.result;
  //       console.log('Uploaded File Content:', content);
  //       // Process the uploaded file content (e.g., update visualization data)
  //     };
  //     reader.readAsText(file);
  //   }
  // };

  // const handleRunSimulation = (settings) => {
  //   console.log('Running simulation with settings:', settings);
  //   // run simulation logic here
  // };
  

  return (
    <Layout title="🧠 Vision Lab">
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundImage: `url('/resources/alina-grubnyak-unsplash.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100vw',
            height: 'calc(100vh - 80px)',
            backgroundColor: 'rgba(255, 255, 255, 0.30)',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            overflow: 'auto',
            padding: '10px',
            marginTop: '40px',
          }}
        >
          {/* Left Section for Selections */}
          <Box
            sx={{
              flex: 1,
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxWidth: '500px',
            }}
          >
            
            {/* Step Title */}
            <Typography variant="body2" align="left" sx={{ color: 'white'}}>
              Step 1: Define Stimuli
            </Typography>
            
            {/* First Block for Stimuli */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: '10px',
                border: 'none', // No border as per your request
                borderRadius: '8px', // More consistent with second block
                backgroundColor: 'white',
                textAlign: 'center',
                width: { xs: '90%', sm: '90%', md: '90%' }, // Match the second block
                margin: '0 auto', // Center it
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Optional: Light shadow for better contrast
              }}
            >
              {/* File Upload */}
              <InputFileUpload />

              <Typography variant="body2" align="center" sx={{ color: 'black' }}>
                or
              </Typography>
              
              {/* Pre-set */}
              <Settings mode="paper" paper={paper} setPaper={setPaper} />
            </Box>


            {/* Second Block for Training Settings*/}

            <Typography variant="body2" align="left" sx={{ color: 'white' }}>
                Step 2: Define Mapping
            </Typography>

            <Settings
              model={model}
              setModel={setModel}
              dataset={dataset}
              setDataset={setDataset}
              region={region}
              setRegion={setRegion}
              voxelOption={voxelOption}
              setVoxelOption={setVoxelOption}
              voxelNumber={voxelNumber}
              setVoxelNumber={setVoxelNumber}
              sx={{ marginTop: '24px' }}
            />

            {/* Third Block for Simulation Button */}
            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
              <Button
                onClick={handleSaveSelections}
                sx={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '90%',
                  '&:hover': {
                    backgroundColor: '#D5D5D5',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  },
                  '&:active': {
                    backgroundColor: '#C0C0C0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(2px)',
                  },
                }}
              >
                Run Simulation
              </Button>
            </Box>
          </Box>


          {/* Right Section for Simulation Results */}
          <Box
            sx={{
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: '20px',
              gap: 2,
            }}
          >
            <LinearProgress
              variant="determinate"
              value={60}
              sx={{
                width: '100%',
                height: '4px',
                marginBottom: '16px',
              }}
            />

            <Accordion sx={{ marginBottom: 2, width: '100%' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  sx={{
                    fontSize: '1.2rem',
                  }}
                >
                  Univariate Analysis
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Mean Predicted Response of virtual FFA</Typography>
                <BarChart barChartData={barchartData} width={400} height={300} />
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ marginBottom: 2, width: '100%' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography
                  sx={{
                    fontSize: '1.2rem',
                  }}
                >
                  Multivariate Analysis
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'column',
                  paddingBottom: '20px', // Add extra padding for labels
                }}
              >
                <Typography>
                  Representational Dissimilarity Matrix (RDM) of virtual FFA
                </Typography>
                <Heatmap heatmapData={heatmapData} originalFilenames={originalFilenames} sortedFilenames={sortedFilenames} width={1000} height={1000} />
              </AccordionDetails>
            </Accordion>

            {/* Download Button */}
            <Button
              variant="contained"
              color="primary"
              sx={{
                position: 'absolute',
                bottom: '60px',
                right: '90px',
                backgroundColor: '#E0E0E0',
                color: '#333',
                padding: '10px 20px',
                borderRadius: '12px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#D5D5D5',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                },
                '&:active': {
                  backgroundColor: '#C0C0C0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(2px)',
                },
              }}
              onClick={() => {
                const data = JSON.stringify({ barchartData, heatmapData }, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = 'simulation_data.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download Simulation Data
            </Button>

            {/* Upload Button */}
            {/* <Button
              variant="contained"
              color="secondary"
              sx={{
                position: 'absolute',
                bottom: '60px',
                left: '90px',
                backgroundColor: '#E0E0E0',
                color: '#333',
                padding: '10px 20px',
                borderRadius: '12px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#D5D5D5',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                },
                '&:active': {
                  backgroundColor: '#C0C0C0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(2px)',
                },
              }}
              component="label"
            >
              Upload Historical Simulation Data
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleFileUpload}
              />
            </Button> */}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Simulate;
