import { useState, useEffect } from "react";
import AccordionWrapper from "../GeneralComponents/AccordionWrapper";
import AppointmentsList from "../AppointmentsList/AppointmentsList";

// Appointments that have been booked by a Patient
const DUMMY_APPOINTMENTS = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 1,
    details: '2024-05-12 09:00:00',
    clinic_id: 1,
    status: true
  },
  {
    id: 2,
    patient_id: 1,
    doctor_id: 1,
    details: '2024-05-16 09:00:00',
    clinic_id: 1,
    status: false
  },
  {
    id: 3,
    patient_id: 2,
    doctor_id: 2,
    details: '2024-05-20 09:00:00',
    clinic_id: 2,
    status: false
  },
  {
    id: 4,
    patient_id: 3,
    doctor_id: 3,
    details: '2024-05-01 09:00:00',
    clinic_id: 1,
    status: false
  }
];

// Appointments that have not been claimed
const DUMMY_OPEN_APPOINTMENTS = [
  {
    id: 1,
    patient_id: null,
    doctor_id: 1,
    details: '2024-05-10 09:00:00',
    clinic_id: 1,
    status: false
  },
  {
    id: 2,
    patient_id: null,
    doctor_id: 1,
    details: '2024-05-16 09:00:00',
    clinic_id: 1,
    status: false
  },
]

const PatientAppointments = (props) => {
  const [appointments, setAppointments] = useState(DUMMY_APPOINTMENTS);

  const mapOpenAppointments = DUMMY_OPEN_APPOINTMENTS.map(appointment => {
    return <li key={appointment.id}>{appointment.details}</li>
  });

  
  return(
    <>
      <AccordionWrapper title="Request">
        <ul>
          {mapOpenAppointments}
        </ul>
      </AccordionWrapper>                
      {!appointments.length && <span>You do not have any appointments booked</span>}
      <AppointmentsList patient_id={1} appointments={appointments}/>
    </>
  )
}

export default PatientAppointments;