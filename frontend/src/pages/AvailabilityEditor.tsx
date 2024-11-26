import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { getAvailability, updateAvailability, AvailabilitySlot, Available } from '../services/api'
import UserSelector from '../components/UserSelector';

export default function AvailabilityEditor() {
  const today = new Date();
  const [selectedDate, changeDate] = useState(new Date())
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [coachId, setCoachId] = useState<string>()
  
  useEffect(() => {
    if(!coachId) return;

    getAvailability(coachId, selectedDate).then(
      (newAvailability) => setAvailability(newAvailability)
    )  
  }, [selectedDate, coachId])

  const changeAvailability = (slot: AvailabilitySlot) => {
    if(!coachId) return;

    slot.available = slot.available == Available.Unavailable ? Available.Available : Available.Unavailable
    updateAvailability(coachId, availability).then(() => getAvailability(coachId, selectedDate).then(
      (newAvailability) => setAvailability(newAvailability)
    ))
  }

  function buildActionButton(slot) {
    if(slot.available == Available.Available) {
      return (<button onClick={() => changeAvailability(slot)}>disable</button>)
    }
    else if (slot.available == Available.Unavailable) {
      return (<button onClick={() => changeAvailability(slot)}>enable</button>)
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
          <UserSelector onSelect={(value: string) => { setCoachId(value) }} userType='coaches'/>
        </div>
      </div>
      <h1>Availability Editor</h1>
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
