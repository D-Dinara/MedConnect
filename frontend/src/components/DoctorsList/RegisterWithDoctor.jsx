import axios from "axios";
import { useContext, useState } from "react";
import { UserSignedIn } from "../../App";
import { Button } from "@mui/material";
import BasicModal from "../GeneralComponents/BasicModal";
import ChangeDoctorModal from "../GeneralComponents/ChangeDoctorModal";

const RegisterWithDoctor = () => {
  const { userState, dispatch } = useContext(UserSignedIn);
  const [errorMessage, setErrorMessage] = useState('');
  const [changeDoctor, setChangeDoctor] = useState(false);
  const [doctorId, setDoctorId] = useState();
  const [requestSent, setRequestSent] = useState(false);
  const [modalTitle, setModalTitle] = useState("")

  const userInfo = userState.userInfo;

  const clinicInfo = userState.clinicInfo;
  
  const filteredDoctors = userState.doctors.filter(doctor => {
    // Only show the Clinic's doctors that are accepting patients
    return doctor.clinic_id === clinicInfo.clinic_id && doctor.number_of_patients
  })

  const handleRegister = (doctor_id) => {
    console.log(userInfo)
    setDoctorId(doctor_id);
    axios.get(`http://localhost:8080/patients/${userInfo.user_id}`)
      .then(response => {
        const patient = response.data;
        if (patient.doctor_id) {
          axios.get(`http://localhost:8080/requests/request/${patient.id}?request_type=change_doctor`)
          .then(response => {
            if (response.data) {
              setModalTitle("Error")
              setErrorMessage("You are already registered with a doctor. A request to change your doctor has already been sent. Please await approval or declination from the clinic.")
              dispatch({ type: "SET_MODAL", payload: true})
            } else {
              setChangeDoctor(true);
              setModalTitle("YOU ARE REGISTERED WITH A DOCTOR")
              setErrorMessage("CHANGING FAMILY DOCTORS MAY INCURR FILE TRANSFER FEES AS SET BY THE CLINIC. ARE YOU SURE YOU WANT TO REQUEST TO CHANGE FAMILY DOCTORS?");
              dispatch({ type: "SET_MODAL", payload: true})
            }
          })
        } else {
          axios.post(`http://localhost:8080/requests`, {
            request_type: "register",
            patient_id: patient.id,
            clinic_id: clinicInfo.clinic_id,
            doctor_id: doctor_id,
            appointment_id: null
          })
          .then(response => {
            if (response.data.message) {
              setModalTitle("Error")
              setErrorMessage(`${response.data.message}. Please await approval or declination from the clinic.`)
              dispatch({ type: "SET_MODAL", payload: true})
            } else {
              setRequestSent(true);
              setModalTitle("Thank you!")
              setErrorMessage("Your request to register with the doctor was sent successfully.")
              dispatch({ type: "SET_MODAL", payload: true})
            }
          })
        }
      })
      .catch(error => {
        console.error("Error registering with doctor:", error);
        setModalTitle("Error")
        setErrorMessage("An error occurred. Please try again later.");
        dispatch({ type: "SET_MODAL", payload: true})
      });
  }

  const handleCancel = () => {
    setChangeDoctor(false);
    setErrorMessage('');
    setModalTitle('');
    dispatch({ type: "SET_MODAL", payload: false})
  }

  const handleChangeDoctorRequest = (doctorId) => {
    axios.get(`http://localhost:8080/patients/${userInfo.user_id}`)
      .then(response => {
        const patient = response.data;
        axios.post(`http://localhost:8080/requests`, {
          request_type: "change_doctor",
          patient_id: patient.id,
          clinic_id: clinicInfo.clinic_id,
          doctor_id: doctorId,
          appointment_id: null
        })
        .then((response) => {
          if (response.data.message) {
            setErrorMessage(response.data.message)
            setModalTitle("Error")
            dispatch({ type: "SET_MODAL", payload: true})
          } else {
          setModalTitle("Thank you!")
          setErrorMessage("The request to change your doctor was sent");
          dispatch({ type: "SET_MODAL", payload: true})
          setChangeDoctor(false);
          }
        })
      })
      .catch(error => {
        console.error("Error requesting to change doctor:", error);
        setErrorMessage("An error occurred. Please try again later.");
        setModalTitle("Error")
      });
  }
  

  return (
    <div>
      {changeDoctor ? 
        <ChangeDoctorModal title={modalTitle} message={errorMessage} handleCancel={handleCancel} handleChangeDoctorRequest={handleChangeDoctorRequest} doctorId={doctorId}/> 
        : 
        <BasicModal title={modalTitle} message={errorMessage}/>
      }
      <h3>{clinicInfo.clinic_name}</h3>
      <p>{clinicInfo.clinic_address}</p>
      {filteredDoctors.map(doctor => {
        return (
          <div key={doctor.id}>
            <p>Accepting {doctor.number_of_patients} more patients</p>
            <p>{doctor.name}</p>
            <p>{doctor.qualifications}</p>
            <img src={`./assets/images/${doctor.photo_url}`} alt={doctor.name}/>
            <Button disabled={requestSent} onClick={() => handleRegister(doctor.id)}>Register</Button>
          </div>
        )
      })}
    </div>
  )
}

export default RegisterWithDoctor;