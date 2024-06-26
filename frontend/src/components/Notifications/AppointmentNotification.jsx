import { useContext, useEffect, useState } from "react";
import { useDelete, useGet, usePut } from "../../hooks/useAPI";
import UserSignedIn from '../GeneralComponents/UserSignedIn';
import {formatDateAndTime} from '../../helpers/formatDateAndTime';
import NotificationActions from "./NotificationActions";

const AppointmentNotification = (props) => {
  const {appointment_id, notification_id} = props;

  const {getData, get} = useGet();

  const {put} = usePut();
  const {deleteRecord} = useDelete();

  const {dispatch} = useContext(UserSignedIn);
  
  const [appointment, setAppointment] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    get(
      'appointments/single',
      appointment_id
    )
  }, []);

  useEffect(() => {
    if(getData){
      setAppointment(getData);
    } 
  }, [getData]);

  useEffect(() => {
    if (appointment){
      setStartTime(formatDateAndTime(getData.start_time_string));
      setEndTime(formatDateAndTime(getData.end_time_string));
    }
  }, [appointment])

  useEffect(() => {
    if (accepting){
      put(
        'appointments',
        appointment
      );
      deleteRecord(
        'requests',
        notification_id
      );
      dispatch({type: "DELETE_NOTIFICATION", payload: {id: notification_id}});
    }
  }, [accepting]);

  const handleAccept = () => {
    setAppointment(prev => ({
        ...prev,
        status: true
      }))
    setAccepting(true);
  }

  return(
    <>
      {appointment && 
        <div className="mt-4">
          <p>Book an appointment with {appointment.doctor_name} <br/> {startTime && startTime.date} from {startTime && startTime.time} - {endTime && endTime.time}.</p>
          <NotificationActions notification_id={notification_id} onAccept={handleAccept} />
        </div>
      }
    </>
  )
}

export default AppointmentNotification;