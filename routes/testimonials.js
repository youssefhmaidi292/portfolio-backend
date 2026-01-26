const express = require('express');
const { Resend } = require('resend');
const sanitize = require('sanitize-html');
const router = express.Router();

const resend = new Resend(process.env.RESEND_KEY);

router.post('/', async (req, res) => {
  const { name, role, rating, message } = req.body;

  if (!name || !role || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Sanitize inputs
  const safeName = sanitize(name);
  const safeRole = sanitize(role);
  const safeMessage = sanitize(message);
  const safeRating = Number(rating) || 5;

  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'youssef.hmaidi29@gmail.com',
      subject: `New Testimonial from ${safeName}`,
      text: `
Name: ${safeName}
Role/Job: ${safeRole}
Rating: ${safeRating} ⭐

Message:
${safeMessage}
      `
    });

    res.json({ message: 'Testimonial sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send testimonial' });
  }
});

module.exports = router;
