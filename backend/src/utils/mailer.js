const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

let transporter = null;

function initTransporter() {
  if (transporter) return transporter;
  
  const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;
  
  if (!hasEmailConfig) {
    console.warn('Email configuration incomplete. Email features will be disabled.');
    return null;
  }
  
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  return transporter;
}

const templateCache = {}

function renderTemplate(locale, name, vars){
  const keyHtml = `${locale}:${name}:html`
  const keyTxt = `${locale}:${name}:txt`
  if (!templateCache[keyHtml]){
    try{
      const p = path.join(__dirname, '..', 'templates', 'emails', locale, `${name}.html`)
      templateCache[keyHtml] = fs.readFileSync(p, 'utf8')
    } catch(e){ templateCache[keyHtml] = null }
  }
  if (!templateCache[keyTxt]){
    try{
      const p = path.join(__dirname, '..', 'templates', 'emails', locale, `${name}.txt`)
      templateCache[keyTxt] = fs.readFileSync(p, 'utf8')
    } catch(e){ templateCache[keyTxt] = null }
  }

  const htmlTemplate = templateCache[keyHtml]
  const txtTemplate = templateCache[keyTxt]
  function fill(t){
    if (!t) return null
    return t.replace(/{{\s*(\w+)\s*}}/g, (_, k) => (vars && vars[k]) ? vars[k] : '')
  }
  return { html: fill(htmlTemplate), text: fill(txtTemplate) }
}

async function sendBadgeEmail(to, subject, text, html, options = {}){
  if (!to) return false
  try {
    const emailTransporter = initTransporter();
    if (!emailTransporter) {
      console.warn('Email transporter not configured, skipping email send');
      return false;
    }
    
    // if locale provided, try to render templates
    let rendered = { html, text }
    if (options.locale){
      const tpl = renderTemplate(options.locale, options.templateName || 'badge', options.vars || {})
      rendered.html = rendered.html || tpl.html
      rendered.text = rendered.text || tpl.text
    }
    const from = process.env.EMAIL_FROM || 'no-reply@teachnexus.example'
    await emailTransporter.sendMail({
      from,
      to,
      subject,
      text: rendered.text || text,
      html: rendered.html || html
    })
    return true
  } catch (e) {
    console.error('sendBadgeEmail failed', e.message)
    return false
  }
}

async function sendNotificationEmail(to, subject, text, html) {
  return sendBadgeEmail(to, subject, text, html);
}

module.exports = { sendBadgeEmail, sendNotificationEmail, initTransporter }
