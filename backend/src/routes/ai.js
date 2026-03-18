const express = require('express')
const axios = require('axios')
const { isValidGrade, isValidSubject, sanitizeString } = require('../utils/validators')

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

    // Validation
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ message: 'topic is required' })
    }
    
    const sanitizedTopic = sanitizeString(topic);
    const sanitizedGrade = sanitizeString(grade);
    const durationNum = Math.min(Math.max(parseInt(duration) || 30, 5), 240); // 5-240 minutes

    const OPENAI_KEY = process.env.OPENAI_API_KEY
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

    if (!OPENAI_KEY) {
      // fallback local generator
      const plan = localGenerate({ topic: sanitizedTopic, grade: sanitizedGrade, duration: durationNum, extra })
      return res.json({ source: 'local', plan })
    }

    // ask model to return JSON-only response with a structured lesson plan
    const system = `You are an assistant that generates concise, curriculum-aligned lesson plans as JSON. Return ONLY a valid JSON object with keys: title, objectives (array of strings), activities (array of {title,durationMinutes,description}), grade, subject. Do not include extra commentary.`
    const user = `Generate a lesson plan for topic: "${sanitizedTopic}", grade: "${sanitizedGrade}", duration: ${durationNum} minutes. Include brief objectives and 2-4 activities with durations that sum to about the duration.`

    const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      max_tokens: 800,
      temperature: 0.6,
      timeout: 30000
    }, {
      headers: { Authorization: `Bearer ${OPENAI_KEY}` },
      timeout: 30000
    })

    const text = resp.data?.choices?.[0]?.message?.content || ''
    let parsed = null
    try { 
      parsed = JSON.parse(text) 
    } catch (e) {
      // if parsing fails, use fallback
      return res.json({ source: 'fallback', plan: localGenerate({ topic: sanitizedTopic, grade: sanitizedGrade, duration: durationNum, extra }) })
    }

    return res.json({ source: 'openai', plan: parsed })
  } catch (err) {
    console.error('ai generate error', err?.response?.data || err.message || err)
    
    // Return fallback on API error
    const { topic, grade, duration = 30 } = req.body;
    if (topic) {
      const plan = localGenerate({ 
        topic: sanitizeString(topic), 
        grade: sanitizeString(grade), 
        duration: Math.min(Math.max(parseInt(duration) || 30, 5), 240)
      })
      return res.json({ source: 'fallback-error', plan, warning: 'Using local generator due to API error' })
    }
    
    res.status(500).json({ message: 'AI generation failed' })
  }
})

module.exports = router
