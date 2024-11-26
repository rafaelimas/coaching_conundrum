import { Router, Request, Response } from 'express'

const router = Router()

router.get("/", async (req: Request, res: Response) => {
  const results = await req.db.query("SELECT student_id, name FROM student")
  const students = results.rows.map((row) => {
    return {
      id: row.student_id,
      name: row.name,
    }
  })
  
  res.json({ 
    students
  })
})

router.get("/:studentId/bookings", async (req: Request, res: Response) => {
  const results = await req.db.query(`
    SELECT starts_at, coach.name, coach.phone, coach.coach_id, booking.availability_id
        FROM booking
            JOIN availability ON booking.availability_id = availability.availability_id
            JOIN coach ON availability.coach_id = coach.coach_id
        WHERE booking.student_id = $1
  `, [req.params.studentId])

  const bookings = results.rows.map((row) => {
    return {
      time: row.starts_at,
      coachName: row.name,
      coachId: row.coach_id,
      coachPhone: row.phone,
      availabilityId: row.availability_id
    }
  })
  
  res.json({ 
    bookings
  })
})

export default router