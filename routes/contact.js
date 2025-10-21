const express = require('express');
const { Resend } = require('resend');
const sanitize = require('sanitize-html'); // ✅ add this
const router = express.Router();

const resend = new Resend(process.env.RESEND_KEY);

router.post('/', async (req, res) => {
  const { name, email, message, captcha } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields required' });
  }

  if (!captcha) {
    return res.status(400).json({ error: 'Please verify you are not a robot' });
  }

  // ✅ Sanitize user inputs to prevent HTML/script injection
  const safeName = sanitize(name);
  const safeEmail = sanitize(email);
  const safeMessage = sanitize(message);

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`;
    const googleRes = await fetch(verifyUrl, { method: 'POST' }); 
    const data = await googleRes.json();

    if (!data.success) {
      return res.status(400).json({ error: 'Captcha verification failed' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Captcha verification error' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'youssef.hmaidi29@gmail.com',
      subject: `New message from ${safeName}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${safeMessage}`
    });
    console.log(data); 
    res.json({ message: 'Message sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
