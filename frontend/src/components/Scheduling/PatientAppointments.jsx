import { useState, useEffect } from "react";
import AccordionWrapper from "../GeneralComponents/AccordionWrapper";
import AppointmentsList from "../AppointmentsList/AppointmentsList";
import { useGet } from "../../hooks/useAPI";

const PatientAppointments = (props) => {
  const { userProfile } = props;
  const [appointments, setAppointments] = useState([]);
  const [unbookedAppointments, setUnbookedAppointments] = useState([]);

  const {loadingAppointments, appointmentData} = useGet(
    'appointments/patients/',
    userProfile.id
  )

  const {loadingOpen, openAppointmentData} = useGet(
    'appointments/open/',
    userProfile.doctor_id
  )

  useEffect(() => {
    if (appointmentData){
      setAppointments(appointmentData);
    }
    if (openAppointmentData){
      setUnbookedAppointments(openAppointmentData)
    }
  }, [appointmentData, openAppointmentData]);

  return(
    <>
      <h2>Appointments</h2>
      <AccordionWrapper title="Request">
        {
          !unbookedAppointments.length 
          ? 
          <span>There are no appointments available to request</span>
          :
          <div className="appointments-open" >
            <AppointmentsList patient_id={null} appointments={unbookedAppointments} user_id={userProfile.id} />
          </div>
        }
      </AccordionWrapper>                
      {!appointments.length 
        ? 
        <span>You do not have any appointments booked</span>
        :
        <div className="appointments-booked">
          <AppointmentsList patient_id={userProfile.id} appointments={appointments}/>
        </div>
        }
    </>
  )
}

export default PatientAppointments;