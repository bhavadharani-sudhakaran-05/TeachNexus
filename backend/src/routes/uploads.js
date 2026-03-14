const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary').v2

const router = express.Router()

// configure cloudinary with env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const upload = multer({ dest: path.join(__dirname, '../../tmp') })

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const filePath = req.file.path
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'teachnexus'
    const result = await cloudinary.uploader.upload(filePath, { folder })
    // remove temp file
    fs.unlink(filePath, () => {})

    res.json({ url: result.secure_url, filename: req.file.originalname, mimeType: req.file.mimetype, providerId: result.public_id })
  } catch (err) {
    console.error('upload error', err)
    res.status(500).json({ message: 'Upload failed' })
  }
})

module.exports = router
