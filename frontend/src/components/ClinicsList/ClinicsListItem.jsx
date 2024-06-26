import { useContext, useState } from "react";
import DoctorsList from "../DoctorsList/DoctorsList";
import { useNavigate } from "react-router-dom";
import { Button, Card, Typography } from "@mui/material";
import axios from "axios";
import BoxWithScroll from "../GeneralComponents/BoxWithScroll";
import { Box } from "@mui/system";
import UserSignedIn from "../GeneralComponents/UserSignedIn";

const ClinicListItem = (props) => {
  const { name, address, id, distance, setErrorMessage } = props;
  const { userState, dispatch } = useContext(UserSignedIn);
  let navigate = useNavigate();

  const clinicInfo = {
    clinic_id: id,
    clinic_name: name,
    clinic_address: address,
  };

  const [alterDoctors, setAlterDoctors] = useState(0);
  const triggerDoctorStateUpdate = () => {
    setAlterDoctors(alterDoctors + 1);
  };

  const handleRequest = (info) => {
    if (userState.userInfo.id && !userState.userInfo.is_clinic) {
      dispatch({ type: "SET_CLINIC_INFO", payload: info });
      axios
        .get(`http://localhost:8080/patients/${userState.userInfo.user_id}`)
        .then((res) => {
          if (res.data) {
            navigate("/register");
            dispatch({ type: "SET_MODAL", payload: false });
          } else {
            setErrorMessage(
              "Please, submit the required information to register with a doctor"
            );
            navigate("/required_information");
            dispatch({ type: "SET_MODAL", payload: false });
          }
        })
        .catch((error) => {
          console.error("Error fetching patient:", error);
        });
    } else if (!userState.userInfo.id) {
      setErrorMessage("Please login or sign up to register with a doctor");
      dispatch({ type: "SET_MODAL", payload: true });
    } else {
      setErrorMessage(
        "You cannot register with a doctor. Please, login or sign up as a patient"
      );
      dispatch({ type: "SET_MODAL", payload: true });
    }
  };

  return (
    <>
      <Card
        sx={{
          margin: "12px 0",
          padding: "12px",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box className="pb-4 pt-2 pl-2 border-b-2 border-red-900">
          <Typography component="div" className="clinics-info">
            <strong>{name}</strong> <br />
            <small>
              {address} <br />
              {distance > 0 && `Distance: ${distance} km`}
            </small>
          </Typography>
        </Box>
        <BoxWithScroll height="45%">
          <DoctorsList clinic_id={id} changeDoctorState={triggerDoctorStateUpdate} />
        </BoxWithScroll>
        <Box textAlign="right">
          <Button variant="small" onClick={() => handleRequest(clinicInfo)}>
            Request to Register
          </Button>
        </Box>
      </Card>
    </>
  );
};

export default ClinicListItem;