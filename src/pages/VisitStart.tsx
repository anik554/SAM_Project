import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";

const VisitStart: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleAddEntry = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  return (
    <Box
      component={Paper}
      width={isMobile ? "100%" : "35%"}
      sx={{
        m: " 0 auto",
        boxShadow: 16,
        mt: 15,
        height:'60vh'
      }}
    >
      <Typography textAlign={"center"} fontWeight={"bold"} mt={-5} variant="h6">
        Visit Start
      </Typography>
      <Grid container spacing={2} mt={'2rem'}>
        {currentStep <= 4 && (
          <Grid item xs={12} lg={12} display={'flex'} justifyContent={'center'}>
            <TextField
              label={`Question ${currentStep}`}
              size="small"
              color="secondary"
            />
            <Button
              variant="contained"
              size="small"
              sx={{ ml: 3 }}
              onClick={handleAddEntry}
            >
              {currentStep === 4 ? "Finish" : "Add Entry"}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default VisitStart;
