import { useEffect, useState } from 'react';
import { fetchDoctors } from '../../hooks/tempUseAPI';
import DoctorsList from '../DoctorsList/DoctorsList'
import NewDoctorForm from '../DoctorsList/NewDoctor';
import {
        Button,
        Tabs,
        Tab,
        Box,
      } from '@mui/material'

const ClinicProfile = (props) => {
  const {userProfile} = props;

  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [alterDoctors, setAlterDoctors] = useState(0);

  useEffect(() => {
    const fetchClinicsDoctors = async () => {
      const doctorData = await fetchDoctors();
      setDoctors(doctorData);
    }

    fetchClinicsDoctors();
  }, [alterDoctors]);

  const handleClick = () => {
    setShowForm(!showForm);
  }

  const triggerDoctorStateUpdate = () => {
    setAlterDoctors(alterDoctors + 1);
  }

  return(
    <div>
      <Box width="20vw" display={'inline-block'} borderRight={'1px solid lightgrey'}>
        <Tabs orientation='vertical'>
          <Tab label="Clinic Profile" />
          <Tab label="Scheduling" />
        </Tabs>
      </Box>
      <Box width="60vw" display={'inline-block'}>
        <article className="profile-main">
          <Box className="profile-left" width="30%" display={'inline-block'}>
            <div className='profile-information'>
              <h2>Information</h2>
              <div>
                <p>{userProfile.name}</p>
                <p>{userProfile.address && userProfile.address}</p>
              </div>
              {/* <Button>Edit</Button> */}
            </div>

            <div className='profile-notifications'>
              <h2>Notifications</h2>
              <ul>
                <li>Patient XYZ has requested an appointment</li>
                <li>Patient ABC wants to change doctors</li>
              </ul>
            </div>
          </Box>
          <Box className="profile-right" width="60%" display={'inline-block'}>
            <div>
              <h2>Doctors</h2>
              <Button onClick={handleClick}>New</Button>
                <NewDoctorForm 
                  clinic_id={userProfile.id}
                  addDoctor={triggerDoctorStateUpdate}
                />
            </div>
              {!doctors.length && <span>You do not have any doctors listed</span>}
              <DoctorsList clinic_id={userProfile.id} doctors={doctors} changeDoctorState={triggerDoctorStateUpdate} />
          </Box>
        </article>
      </Box>
    </div>
  )
}

export default ClinicProfile;