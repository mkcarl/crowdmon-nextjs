import postgres from 'postgres'
import { configDotenv } from 'dotenv'

configDotenv()

const sql = postgres(process.env.POSTGRES_URL as string)

export default sql
