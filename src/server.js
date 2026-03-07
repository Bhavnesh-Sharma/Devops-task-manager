import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import taskRoutes from './routes/taskRoutes.js'

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from project root
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/tasks', taskRoutes)

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'public')))

// Healthcheck endpoint
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  })
})

// Environment variables
const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI

// Ensure Mongo URI exists
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env file')
  process.exit(1)
}

// Start server
async function start () {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`)
    })
  } catch (err) {
    console.error('❌ Failed to start server', err)
    process.exit(1)
  }
}

start()
