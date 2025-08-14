import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY in environment variables' })
  }

  try {
    const { message } = req.body
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(
      `You are Astro, a friendly chatbot that ONLY answers questions about space and celestial bodies.\nUser: ${message}`
    )

    res.status(200).json({ reply: result.response.text() })
  } catch (err) {
    console.error("API error:", err)
    res.status(500).json({ error: err.message || 'Something went wrong' })
  }
}
