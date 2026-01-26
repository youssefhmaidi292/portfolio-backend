const express = require('express');
const { Resend } = require('resend');
const sanitize = require('sanitize-html');

const router = express.Router();
const resend = new Resend(process.env.RESEND_KEY);

router.post('/', async (req, res) => {
  const {
    name,
    email,
    phone,
    message,
    captcha,
    type = 'contact', // 👈 NEW (default contact)
    rating // 👈 NEW (for testimonials)
  } = req.body;

  console.log(req.body); // debug

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!captcha) {
    return res.status(400).json({ error: 'Please verify you are not a robot' });
  }

  // Sanitize inputs
  const safeName = sanitize(name);
  const safeEmail = sanitize(email);
  const safePhone = sanitize(phone || '');
  const safeMessage = sanitize(message);
  const safeRating = rating ? sanitize(String(rating)) : 'N/A';

  // Verify reCAPTCHA
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

  // Email content depends on type
  const isTestimonial = type === 'testimonial';

  const subject = isTestimonial
    ? `⭐ New Testimonial from ${safeName}`
    : `📩 New Contact Message from ${safeName}`;

  const text = isTestimonial
    ? `
TESTIMONIAL SUBMISSION
----------------------
Name: ${safeName}
Email: ${safeEmail}
Rating: ${safeRating} ⭐

Message:
${safeMessage}

⚠️ This testimonial is NOT public yet.
`
    : `
CONTACT MESSAGE
---------------
Name: ${safeName}
Email: ${safeEmail}
Phone: ${safePhone}

Message:
${safeMessage}
`;

  // Send email
  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'youssef.hmaidi29@gmail.com',
      subject,
      text
    });

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
