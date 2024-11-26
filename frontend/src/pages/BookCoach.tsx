import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { getAvailability, createBooking, AvailabilitySlot, Available } from '../services/api'
import UserSelector from '../components/UserSelector';
import { useNavigate } from "react-router-dom"

export default function BookCoach() {
  const today = new Date();
  const [selectedDate, changeDate] = useState(new Date())
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [coachId, setCoachId] = useState<string>()
  const [studentId, setStudentId] = useState<string>()
  const navigate = useNavigate()
  
  useEffect(() => {
    if(!coachId) return;

    getAvailability(coachId, selectedDate).then(
      (newAvailability) => setAvailability(newAvailability)
    )
  }, [selectedDate, coachId])

  const bookSlot = (slot: AvailabilitySlot) => {
    if(!coachId) return;
    if(!studentId) {
      alert('You must select a Student to book a coach')
      return;
    };

    createBooking(slot.availabilityId, studentId)
      .then(() => {
        alert(`You are all set an booked for ${selectedDate}`)
        navigate(`/bookings/students/${studentId}`)
      })
      .catch((error) => {
        alert(error)
        getAvailability(coachId, selectedDate).then(
          (newAvailability) => setAvailability(newAvailability)
        )
      })
  }

  function buildActionButton(slot) {
    if(slot.available == Available.Available) {
      return (<button onClick={() => bookSlot(slot)}>book</button>)
    }
    else {
      return null;
    }
  }
  
  return (
    <>
      <div className="user-selector">
        <div>
          <span>Coach</span>
          <UserSelector onSelect={(value: string) => { setCoachId(value) }} userType={'coaches'}/>
        </div>
        <div>
          <span>Student</span>
          <UserSelector onSelect={(value: string) => { setStudentId(value) }} userType={'student'}/>
        </div>
      </div>
      <h1>Book Coach</h1>
      <div>
        <Calendar 
          value={selectedDate}
          onChange={(value) => changeDate(value as Date)}
          minDate={today}
          // tileContent={({date}) => {
          //   return date.getDate() % 2 == 0 ? <span>*</span> : null
          // }}
        />
        <ul>
          {availability.map((slot) => 
            <li key={`${slot.time.getHours()}:${slot.time.getMinutes()}`}>
              <div className={`time-selector ${Available[slot.available]}`}>
                <span>{slot.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: "short" })} ({Available[slot.available]})</span>
                {buildActionButton(slot)}
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  )
}
