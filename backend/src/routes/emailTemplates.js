const express = require('express')
const fs = require('fs')
const path = require('path')
const auth = require('../middleware/auth')

const router = express.Router()

function templatesDir(){
  return path.join(__dirname, '..', 'templates', 'emails')
}

// helper to list locales and template names
router.get('/list', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
    const dir = templatesDir()
    if (!fs.existsSync(dir)) return res.json({ locales: [] })
    const locales = fs.readdirSync(dir).filter(x => fs.statSync(path.join(dir, x)).isDirectory())
    const result = {}
    for (const loc of locales){
      const files = fs.readdirSync(path.join(dir, loc)).filter(f => f.endsWith('.html') || f.endsWith('.txt'))
      const names = new Set()
      for (const f of files) names.add(f.replace(/\.(html|txt)$/, ''))
      result[loc] = Array.from(names)
    }
    res.json({ locales: result })
  } catch (e) {
    console.error('list templates failed', e)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET a template content
router.get('/:locale/:name', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
    const { locale, name } = req.params
    const base = templatesDir()
    const htmlPath = path.join(base, locale, `${name}.html`)
    const txtPath = path.join(base, locale, `${name}.txt`)
    const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : null
    const text = fs.existsSync(txtPath) ? fs.readFileSync(txtPath, 'utf8') : null
    res.json({ html, text })
  } catch (e) {
    console.error('get template failed', e)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT save template content
router.put('/:locale/:name', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
    const { locale, name } = req.params
    const { html, text } = req.body
    const base = templatesDir()
    const dir = path.join(base, locale)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    if (typeof html === 'string') fs.writeFileSync(path.join(dir, `${name}.html`), html, 'utf8')
    if (typeof text === 'string') fs.writeFileSync(path.join(dir, `${name}.txt`), text, 'utf8')
    res.json({ ok: true })
  } catch (e) {
    console.error('save template failed', e)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
