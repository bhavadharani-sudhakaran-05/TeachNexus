const express = require('express')
const Resource = require('../models/Resource')
const auth = require('../middleware/auth')

const router = express.Router()

function tokenize(text){
  if(!text) return new Set()
  return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean))
}

function jaccard(a,b){
  const A = tokenize(a)
  const B = tokenize(b)
  if (A.size===0 && B.size===0) return 1
  if (A.size===0 || B.size===0) return 0
  let inter = 0
  for (const x of A) if (B.has(x)) inter++
  const uni = new Set([...A, ...B]).size
  return inter / uni
}

// POST /api/verify  -> { resourceId } or { text }
// returns list of top matches by similarity
router.post('/', async (req, res) => {
  try{
    const { resourceId, text } = req.body
    let sourceText = text || ''
    if (resourceId){
      const r = await Resource.findById(resourceId)
      if (!r) return res.status(404).json({ message: 'Resource not found' })
      sourceText = (r.title || '') + ' ' + (r.description || '')
    }

    if (!sourceText) return res.status(400).json({ message: 'No text provided' })

    const all = await Resource.find({ _id: { $ne: resourceId } }).select('title description')
    const scored = all.map(r => {
      const combined = (r.title||'') + ' ' + (r.description||'')
      return { id: r._id, title: r.title, score: jaccard(sourceText, combined) }
    })
    scored.sort((a,b)=>b.score - a.score)
    res.json({ matches: scored.slice(0,10) })
  }catch(err){
    console.error('verify error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/verify/:id -> mark resource as verified (admin/principal)
router.put('/:id', auth, async (req, res) => {
  try{
    const user = req.user
    if (!['admin','principal'].includes(user.role)) return res.status(403).json({ message: 'Forbidden' })
    const { notes, verified } = req.body
    const r = await Resource.findById(req.params.id)
    if (!r) return res.status(404).json({ message: 'Resource not found' })
    r.verified = Boolean(verified)
    r.verificationNotes = notes || ''
    r.verifiedAt = verified ? new Date() : null
    r.verifiedBy = verified ? user._id : null
    await r.save()
    res.json({ ok: true, resource: r })
  }catch(err){
    console.error('verify put error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
