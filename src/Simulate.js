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

const Simulate = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const [model, setModel] = useState('');
  const [dataset, setDataset] = useState('');
  const [region, setRegion] = useState('');
  const [voxelOption, setVoxelOption] = useState('');
  const [voxelNumber, setVoxelNumber] = useState('');
  const [paper, setPaper] = useState('');


  // Load heatmap data from the local CSV file
  useEffect(() => {
    d3.csv('/rdm_ffa.csv', (d) => ({
      x: d.x,
      y: d.y,
      value: +d.value, // Ensure numeric values
      cluster: +d.cluster, // Ensure numeric cluster labels
    })).then((data) => {
      setHeatmapData(data); // Set the data for the heatmap
      console.log('Loaded Heatmap Data:', data);
    }).catch((error) => {
      console.error('Error loading heatmap data:', error);
    });
  }, []);

  useEffect(() => {
    d3.csv('/mean_sem_ffa.csv', (d) => ({
      filename: d.filename,
      mean: +d.mean,
      sem: +d.sem,
    })).then((data) => {
      setBarChartData(data); // Set the data for the heatmap
      console.log('Loaded BarChart Data:', data);
    }).catch((error) => {
      console.error('Error loading barChart data:', error);
    });
  }, []);

  const handleStart = () => {
    console.log('Simulation started');
    console.log({ model, dataset, region, voxelOption, voxelNumber });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        console.log('Uploaded File Content:', content);
        // Process the uploaded file content (e.g., update visualization data)
      };
      reader.readAsText(file);
    }
  };

  const handleRunSimulation = (settings) => {
    console.log('Running simulation with settings:', settings);
    // run simulation logic here
  };
  

  return (
    <Layout title="Virtual Visual Cortex/Simulation">
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
            <InputFileUpload />

            <Typography variant="body2" align="center" sx={{ color: 'white'}}>
              or
            </Typography>

            <Box sx={{ marginBottom: '24px' }}>
              <Settings
                mode="paper"
                paper={paper}
                setPaper={setPaper}
              />
            </Box>

            {/* Settings Component */}
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


            {/* Run Simulation Button */}
            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
              <Button
                onClick={() => handleRunSimulation({
                  model,
                  dataset,
                  region,
                  voxelOption,
                  voxelNumber,
                })}
                sx={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '60%',
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
                <BarChart data={barChartData} width={400} height={300} />
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
                <Heatmap data={heatmapData} width={1000} height={1000} />
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
                const data = JSON.stringify({ barChartData, heatmapData }, null, 2);
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
            <Button
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
            </Button>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Simulate;
