import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface FieldVisit {
  visitLocation: string;
  visitPurpose: string;
  visitDate: string;
  startTime: string;
  endTime: string;
}

interface Organization {
  id: string;
  name: string;
  division: string;
  district: string;
  upazila: string;
  code: string | null;
  data: string | null;
  email: string;
}

const LocationTrack: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [fieldVisit, setFieldVisit] = useState<FieldVisit>({
    visitLocation: "",
    visitPurpose: "",
    visitDate: "",
    startTime: "",
    endTime: "",
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldVisit((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const convertTimeFormat = (inputTime: string): string => {
    const [hours, minutes] = inputTime.split(":");
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    const formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

    return formattedTime;
  };

  const formatDate = (inputDate: string): string => {
    const date = new Date(inputDate);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;

    return formattedDate;
  };

  const handleVisitLocationChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    setFieldVisit((prevFieldVisit) => ({
      ...prevFieldVisit,
      visitLocation: newValue || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const visitData = {
      visitLocation: fieldVisit.visitLocation,
      visitPurpose: fieldVisit.visitPurpose,
      visitDate: formatDate(fieldVisit.visitDate),
      startTime: convertTimeFormat(fieldVisit.startTime),
      endTime: convertTimeFormat(fieldVisit.endTime),
    };

    try {
      const tokens =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGllbiIsImF1dGhvcml0aWVzIjoiQURNSU5fUFJJVklMRUdFLFNVUEVSX0FETUlOIiwiaWF0IjoxNzA2Njk2MTg5LCJleHAiOjE3MDY3ODI1ODl9.W3RrMKB30jMQAntTEMM3GEKhUCyKe7RpKBfws7otCh4";

      const res = await fetch(
        "https://192.168.1.19:9000/api/field-visits/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens}`,
          },
          body: JSON.stringify(visitData),
        }
      );
      if (res.status === 200) {
        setFieldVisit(visitData);
        toast.success('Data has been send successfully')
        console.log(visitData);
      }
      else {
        toast.error('Some thing wrong')
        console.error(`Request failed with status: ${res.status}`);
      }
    } catch (error) {
      toast.error('Some thing wrong')
      console.error("Error while sending the request:", error);
    }
  };

  const getLocation = () => {
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGllbiIsImF1dGhvcml0aWVzIjoiQURNSU5fUFJJVklMRUdFLFNVUEVSX0FETUlOIiwiaWF0IjoxNzA2Njk2MTg5LCJleHAiOjE3MDY3ODI1ODl9.W3RrMKB30jMQAntTEMM3GEKhUCyKe7RpKBfws7otCh4";

    fetch("https://192.168.1.19:9000/api/organizations", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const organizationsData = data.content || [];
        setOrganizations(organizationsData);
        console.log(organizationsData);
      });
  };

  useEffect(() => {
    getLocation();
  }, []);



  return (
    <Box
        component={Paper}
        width={isMobile ? "100%" : "60%"}
        sx={{
          m: " 0 auto",
          boxShadow: 16,
          mt: 15,
        }}
      >
        <Typography
          textAlign={"center"}
          fontWeight={"bold"}
          mt={-5}
          variant="h6"
        >
          Visit Request
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={1}
            p={5}
            m={"auto"}
            columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 5 }}
            rowSpacing={2}
          >
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                size="small"
                onChange={handleChange}
                value={fieldVisit.visitDate}
                name="visitDate"
                InputLabelProps={{ shrink: true }}
                color="secondary"
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={organizations.map((org) => org.name)}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                id="visitLocation"
                value={fieldVisit.visitLocation}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={handleChange}
                    label="Search Location"
                    variant="outlined"
                    size="small"
                    inputProps={{ ...params.inputProps, name: "visitLocation" }}
                  />
                )}
                freeSolo
                onChange={handleVisitLocationChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="text"
                label="Purpose"
                size="small"
                onChange={handleChange}
                value={fieldVisit.visitPurpose}
                name="visitPurpose"
                color="secondary"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="Start Time"
                size="small"
                onChange={handleChange}
                value={fieldVisit.startTime}
                name="startTime"
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                color="secondary"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="End Time"
                size="small"
                onChange={handleChange}
                value={fieldVisit.endTime}
                name="endTime"
                InputLabelProps={{ shrink: true }}
                color="secondary"
                inputProps={{ step: 300 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" sx={{ float: "right" }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
  );
};

export default LocationTrack;
