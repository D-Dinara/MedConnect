import { useJsApiLoader } from "@react-google-maps/api";
import { useReducer, useEffect } from "react";



export default function useApplicationData() {

  const initialState = {
    userLoggedIn: false,
    userInfo: {},
    selectedClinicId: 0,
    events: [{ title: 'Event 1', start: new Date('2024-05-01T10:00:00') }],
    newUser: null,
    clinics: [],
    displayedClinics: [],
    doctors: [],
    clinicInfo: {},
    notifications: [""]
  }


  const [userState, dispatch] = useReducer((userState, action) => {
    switch (action.type) {
      case "USER_LOGIN":
        return { ...userState, userLoggedIn: action.payload }
      case "USER_INFO":
        return { ...userState, userInfo: action.payload }
      case "USER_INFO_LOGOUT":
        return { ...userState, userInfo: action.payload }
      case "USER_STATE_LOGOUT":
        return { ...userState, userLoggedIn: action.payload }
      case "USER_SELECTED_CLINIC":
        return { ...userState, selectedClinicId: action.payload }
      case "CLINIC_EVENTS":
        return { ...userState, events: action.payload }
      case "NEW_USER":
        return { ...userState, userInfo: action.payload, userLoggedIn: true }
      case "USER_SESSION":
        return { ...userState, userLoggedIn: action.payload }
      case "SET_CLINICS":
        return { ...userState, clinics: action.payload }
      case "SET_DOCTORS":
        return { ...userState, doctors: action.payload }
      case "SET_DISPLAYED_CLINICS":
        return { ...userState, displayedClinics: action.payload }
      case "SET_NOTIFICATIONS":
        return { ...userState, notifications: action.payload }
      case "SET_CLINIC_INFO":
        return { ...userState, clinicInfo: action.payload }
      case "ADD_DOCTOR":
        return { ...userState, doctors: [...userState.doctors, action.payload] }
      case "ADD_NOTIFICATION":
        return { ...userState, notifications: [...userState.notifications, action.payload] }
      case "EDIT_DOCTOR":
        return {
          ...userState, doctors: userState.doctors.map(doctor => {
            if (doctor.id === action.payload.id) {
              doctor = action.payload
            }
            return doctor;
          })
        }
      case "DELETE_DOCTOR":
        return { ...userState, doctors: userState.doctors.filter(doctor => doctor.id !== action.payload.id) }
      case "DELETE_NOTIFICATION":
        return { ...userState, notifications: userState.notifications.filter(notification => notification.id !== action.payload.id) }
      default:
        return userState;
    }
  }, { ...initialState });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/calendar/${userState.selectedClinicId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to get appointments');
        }

        const data = await response.json();

        const newEvents = data.map((event) => {

          return { title: event.patient_id, start: new Date(event.details) };

        })
        dispatch({ type: "CLINIC_EVENTS", payload: newEvents });

      } catch (error) {
        console.error('Error:', error);
        // Handle error
      }
    };

    if (userState.selectedClinicId) {
      fetchData(); // Call the asynchronous function only if selectedClinicId is truthy
    }

  }, [userState.selectedClinicId]);


  useEffect(() => {
    fetchClinics();
    fetchDoctors();
  }, []);


  const fetchClinics = async () => {
    try {
      const response = await fetch(`http://localhost:8080/clinics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get clinics');
      }

      const data = await response.json();

      dispatch({ type: "SET_CLINICS", payload: data });
      dispatch({ type: "SET_DISPLAYED_CLINICS", payload: data });

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`http://localhost:8080/doctors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get doctors');
      }

      const data = await response.json();

      dispatch({ type: "SET_DOCTORS", payload: data });

    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  }

  return { userState, dispatch }
}