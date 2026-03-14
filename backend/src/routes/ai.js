const express = require('express')
const axios = require('axios')

const router = express.Router()

function localGenerate({ topic, grade, duration, extra }){
  const title = `${topic} — ${grade} (${duration} min)`
  const objectives = [
    `Understand core concepts of ${topic}`,
    `Practice key skills related to ${topic}`
  ]
  const activities = [
    { title: 'Starter', durationMinutes: Math.max(5, Math.floor(duration*0.15)), description: `Quick warm-up on ${topic}` },
    { title: 'Main activity', durationMinutes: Math.max(10, Math.floor(duration*0.6)), description: `Guided practice and group work: ${topic}` },
    { title: 'Assessment', durationMinutes: Math.max(5, Math.floor(duration*0.2)), description: `Short assessment and reflection` }
  ]
  if (extra) activities.push({ title: 'Extension', durationMinutes: 5, description: extra })
  return { title, objectives, activities, grade, subject: topic }
}

router.post('/lesson', async (req, res) => {
  try {
    const { topic, grade, duration = 30, extra } = req.body

    const OPENAI_KEY = process.env.OPENAI_API_KEY
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

    if (!topic) return res.status(400).json({ message: 'Missing topic' })

    if (!OPENAI_KEY) {
      // fallback local generator
      const plan = localGenerate({ topic, grade, duration, extra })
      return res.json({ source: 'local', plan })
    }

    // ask model to return JSON-only response with a structured lesson plan
    const system = `You are an assistant that generates concise, curriculum-aligned lesson plans as JSON. Return ONLY a valid JSON object with keys: title, objectives (array of strings), activities (array of {title,durationMinutes,description}), grade, subject. Do not include extra commentary.`
    const user = `Generate a lesson plan for topic: "${topic}", grade: "${grade}", duration: ${duration} minutes. Include brief objectives and 2-4 activities with durations that sum to about the duration. Include any short extension activity if helpful.`

    const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      max_tokens: 800,
      temperature: 0.6
    }, {
      headers: { Authorization: `Bearer ${OPENAI_KEY}` }
    })

    const text = resp.data?.choices?.[0]?.message?.content || ''
    // try parse JSON from model output
    let parsed = null
    try { parsed = JSON.parse(text) } catch (e) {
      // if parsing fails, return the raw text as fallback
      return res.json({ source: 'model-raw', text })
    }

    return res.json({ source: 'model', plan: parsed })
  } catch (err) {
    console.error('ai generate error', err?.response?.data || err.message || err)
    res.status(500).json({ message: 'AI generation failed' })
  }
})

module.exports = router
