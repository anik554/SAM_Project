import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SuccessfullLogo from '../assets/image/paymentLogo-2.png'

interface IpSendData{
  ipAddress:string;
  desc:string;
}

const VisitStart: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [currentField, setCurrentField] = useState(0);
  const [buttons, setButtons] = useState<number[]>([1]);
  const [showMessage, setShowMessage] = useState(false);
  const [dataSend, setDataSend]= useState<IpSendData>({ipAddress:'', desc:''})

  const handleClick = async () => {
    try {
      const accessToken =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGllbiIsImF1dGhvcml0aWVzIjoiQURNSU5fUFJJVklMRUdFLFNVUEVSX0FETUlOIiwiaWF0IjoxNzA2OTU2MjgzLCJleHAiOjE3MDcwNDI2ODN9.Ld_B9WroDwktp9KWzdoCO2nJ-1YmUWQToFrvg65MnoU";
  
      const res = await fetch("https://192.168.1.19:9000/api/field-visits/65b73a5ca479f91b2a673e98/update-visit-actvity", {
        method: "PUT",
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ipAddress: dataSend.ipAddress,
          desc: dataSend.desc,
        }),
      });
  
      if (res.status === 200) {
        const responseData = await res.json();
        setDataSend(responseData);
        console.log(responseData);
      } else {
        console.error("Error:", "Data not sent");
      }
    } catch (error) {
      console.error("Error:", error instanceof Error ? error.message : error);
    }
  
    setButtons([...buttons, buttons.length + 1]);
    setCurrentField((prev) => prev + 1);
  
    if (currentField === Textfields.length - 1) {
      setShowMessage(true);
    }
  };
  
  

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataSend((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const Textfields = [
    { title: "Have you left home?" },
    { title: "Have you reached the destination?" },
    { title: "Have you any where else?" },
    { title: "Are you done?" },
  ];

  const getIp = () => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((responseIP) => {
        setDataSend((prev) => ({ ...prev, ipAddress: responseIP.ip }));
        console.log(responseIP.ip);
      })
      .catch((error) => {
        console.error("Error fetching IP:", error);
      });
  };
  
  useEffect(() => {
    getIp();
  }, [dataSend.ipAddress]);

  return (
    <Box
      component={Paper}
      width={isMobile ? "100%" : "35%"}
      sx={{
        m: " 0 auto",
        boxShadow: 16,
        mt: 15,
        height: "40vh",
      }}
    >
      <Box mt={10} sx={{ mt: 3, backgroundColor: "ButtonHighlight" }}>
        <Typography textAlign={"center"} fontWeight={"bold"} variant="h6">
          Visit Start
        </Typography>
      </Box>
      <br />
      <br />
      <br />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={11} lg={10}>
          {Textfields.map((textField, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {index === currentField && (
                <TextField
                  required
                  fullWidth
                  label={textField.title}
                  size="small"
                  name="desc"
                  value={dataSend.desc}
                  onChange={handleChange}
                />
              )}
              {index === currentField && (
                <Button
                  onClick={handleClick}
                  variant="contained"
                  sx={{ ml: 3 }}
                  disabled={Textfields.length === 0}
                >
                  {index === Textfields.length - 1 ? "Done" : "Next"}
                </Button>
              )}
            </div>
          ))}
          {showMessage && (
            <>
            <img src={SuccessfullLogo} className="paymentlogo" />
            <Typography textAlign={"center"} variant="h6" >
              Thank You
            </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default VisitStart;
