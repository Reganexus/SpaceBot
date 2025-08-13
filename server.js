import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing in .env")
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(
      `You are Astro, a friendly chatbot that ONLY answers questions about space and celestial bodies.\nUser: ${message}`
    )

    res.json({ reply: result.response.text() })
  } catch (err) {
    console.error("Server error:", err)
    res.status(500).json({ error: err.message || 'Something went wrong' })
  }
})

app.listen(3000, () => {
  console.log('SpaceBot backend running at http://localhost:3000')
})
