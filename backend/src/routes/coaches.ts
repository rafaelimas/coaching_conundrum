import { Router, Request, Response } from 'express'
import pg from 'pg'

const router = Router()

async function queryAvailability(coachId: string, date: string, db) {
  // The way I'm using the date here isn't safe. Need to figure out how to do this with pg or check that the date is safe.
  const results = await db.query(`
    SELECT availability.availability_id, coach_id, d, student.student_id, student.name
      FROM
        (SELECT generate_series(
                  '${date}'::timestamptz + interval '9 hour',
                  '${date}'::timestamptz + interval '19 hour',
                  interval '2 hour'
                )) AS dseries(d)
        LEFT OUTER JOIN availability
            ON d = availability.starts_at AND coach_id = $1
        LEFT OUTER JOIN booking
            ON availability.availability_id = booking.availability_id
        LEFT OUTER JOIN student
            ON booking.student_id = student.student_id
      ORDER BY d`
  , [coachId])

  const availability = results.rows.map((row) => {
    return {
      id: row.availability_id,
      time: row.d,
      studentId: row.student_id,
      studentName: row.student_name
    }
  })

  return availability
}

router.get("/:coachId/availability", async (req: Request, res: Response) => {
  const date = req.query.date

  const availability = await queryAvailability(req.params.coachId, date as string, req.db)
  
  res.json({ 
    availability
  })
})

router.put("/:coachId/availability", async (req: Request, res: Response) => {
  const coachId = req.params.coachId

  try {
    await req.db.query('BEGIN')
    
    for(const slot of req.body) {
      if(slot.available == 'Available') {
        await req.db.query(`
          INSERT INTO availability(coach_id, starts_at) VALUES($1, $2)
            ON CONFLICT(coach_id, starts_at) DO NOTHING
        `, [coachId, slot.time])  
      }
      else if(slot.available == 'Unavailable') {
        await req.db.query(`DELETE FROM availability WHERE coach_id = $1 AND starts_at = $2`, [coachId, slot.time])  
      }
    }

    await req.db.query('COMMIT');

    const availability = await queryAvailability(coachId, req.body[0].time, req.db)
    
    res.json({ 
      availability
    })
  } catch (e) {
    await req.db.query('ROLLBACK')

    res.status(500).json({
      status: "error"
    })
  }
})

router.get("/", async (req: Request, res: Response) => {
  const results = await req.db.query("SELECT coach_id, name FROM coach")
  const coaches = results.rows.map((row) => {
    return {
      id: row.coach_id,
      name: row.name,
    }
  })
  
  res.json({ 
    coaches
  })
})

router.get("/:coachId/bookings", async (req: Request, res: Response) => {
  const results = await req.db.query(`
    SELECT starts_at, student.name, student.phone, booking.student_id, booking.availability_id
        FROM booking
            JOIN availability ON booking.availability_id = availability.availability_id
            JOIN student ON booking.student_id = student.student_id
        WHERE availability.coach_id = $1
  `, [req.params.coachId])

  const bookings = results.rows.map((row) => {
    return {
      time: row.starts_at,
      studentName: row.name,
      studentId: row.student_id,
      studentPhone: row.phone,
      availabilityId: row.availability_id
    }
  })
  
  res.json({ 
    bookings
  })
})

router.post("/bookings", async (req: Request, res: Response) => {
  if(await isAvailabilityBooked(req.db, req.body.availabilityId)) {
    res.status(500).json({error: 'Slot is already booked'})
  }
  else {
    await req.db.query(`
      INSERT INTO booking(student_id, availability_id) VALUES($1, $2)
    `, [req.body.studentId, req.body.availabilityId])

    res.json({})
  }
})

async function isAvailabilityBooked(db: pg.Pool, availabilityId: string) : Promise<boolean> {
  const result = await db.query(`SELECT FROM booking WHERE availability_id = $1`, 
    [availabilityId])

  return result.rows.length > 0
}

export default router