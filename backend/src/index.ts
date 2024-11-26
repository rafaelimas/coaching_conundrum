import express, { Request, Response } from "express"
import pg from "pg"
import morgan from "morgan"
import cors from "cors"
import studentsRouter from "./routes/students"
import coachesRouter from "./routes/coaches"
import dotenv from "dotenv"

declare global {
  namespace Express {
    interface Request {
      db: pg.Pool
    }
  }
}

const app = express()

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
})

app.use((req, res, next) => {
  req.db = pool
  next()
})

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/students', studentsRouter)
app.use('/coaches', coachesRouter)

app.listen(process.env.PORT, () => {
    console.log(`The server is running at http://localhost:${process.env.PORT}`)
})