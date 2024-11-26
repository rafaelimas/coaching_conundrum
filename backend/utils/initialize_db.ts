import pg from "pg"
import * as fs from 'fs'
import dotenv from "dotenv"

dotenv.config();

const pgClient = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
})

async function initDb() {
  console.log('INITIALIZING DATABASE')
  await pgClient.connect()
  
  const sql = fs.readFileSync('./migrations/initial.sql')
  const statements = sql.toString().split(';')
  for(let s of statements) {
    console.log(s)
    await pgClient.query(s)
  }
  
  await pgClient.end()
  
  console.log('INITIALIZATION DONE')  
}

await initDb()
