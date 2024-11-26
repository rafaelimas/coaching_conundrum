import { useEffect, useState } from 'react'
import { getBookings } from '../services/api'
import UserSelector from '../components/UserSelector';

export default function CoachBookings() {
  const [coachId, setCoachId] = useState<string>()
  const [bookings, setBookings] = useState([])
  
  useEffect(() => {
    if(!coachId) return;

    getBookings("coaches", coachId).then(
      (bookings) => setBookings(bookings)
    )  
  }, [coachId])

  return (
    <>
      <div className="user-selector">
        <div>
          <span>Coaches</span>
          <UserSelector onSelect={(value: string) => { setCoachId(value) }} userType="coaches"/>
        </div>
      </div>
      <h1>Bookings</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Student</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {
            bookings ?
              bookings.map((booking) => 
                <tr key={`${booking.availabilityId}`}>
                  <td>{new Date(booking.time).toLocaleString('en-US')}</td>
                  <td>{booking.studentName}</td>
                  <td>{booking.studentPhone}</td>
                </tr>
              )
            : null
          }
        </tbody>
      </table>
    </>
  )
}
