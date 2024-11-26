import { useEffect, useState } from 'react'
import { getBookings } from '../services/api'
import UserSelector from '../components/UserSelector';
import { useParams } from "react-router-dom"

export default function StudentBookings() {
  const [studentId, setStudentId] = useState<string>()
  const [bookings, setBookings] = useState([])
  const params = useParams()

  useEffect(() => {
    if(params.studentId) {
      setStudentId(params.studentId)
    }
  }, [params.studentId])

  useEffect(() => {
    if(!studentId) return;

    getBookings("students", studentId).then(
      (bookings) => setBookings(bookings)
    )  
  }, [studentId])

  return (
    <>
      <div className="user-selector">
        <div>
          <span>Coaches</span>
          <UserSelector onSelect={(value: string) => { setStudentId(value) }} selectedOption={studentId} userType="students"/>
        </div>
      </div>
      <h1>Bookings</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Coach</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {
            bookings ?
              bookings.map((booking) => 
                <tr key={`${booking.availabilityId}`}>
                  <td>{new Date(booking.time).toLocaleString('en-US')}</td>
                  <td>{booking.coachName}</td>
                  <td>{booking.coachPhone}</td>
                </tr>
              )
            : null
          }
        </tbody>
      </table>
    </>
  )
}
