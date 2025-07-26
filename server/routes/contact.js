const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Contact form submission
router.post('/send-message', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
  body('phone').optional().trim().isMobilePhone().withMessage('Valid phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message, phone } = req.body;

    // Create email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <hr>
      <p><small>Sent from Mideyateller Fashion Store website</small></p>
    `;

    // Auto-reply content
    const autoReplyContent = `
      <h2>Thank you for contacting Mideyateller Fashion Store!</h2>
      <p>Dear ${name},</p>
      <p>We have received your message and will get back to you within 24 hours.</p>
      <p><strong>Your message:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <strong>Subject:</strong> ${subject}<br><br>
        ${message.replace(/\n/g, '<br>')}
      </div>
      <p>Best regards,<br>Mideyateller Fashion Store Team</p>
      <hr>
      <p>Follow us on social media:</p>
      <p>
        <a href="https://wa.me/${process.env.WHATSAPP_NUMBER}">WhatsApp</a> | 
        <a href="https://twitter.com/${process.env.TWITTER_HANDLE}">Twitter</a> | 
        <a href="https://instagram.com/${process.env.INSTAGRAM_HANDLE}">Instagram</a>
      </p>
    `;

    const transporter = createTransporter();

    // Send email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Contact Form: ${subject}`,
      html: emailContent,
      replyTo: email
    };

    // Send auto-reply to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Mideyateller Fashion Store',
      html: autoReplyContent
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    res.json({
      message: 'Message sent successfully! We will get back to you soon.',
      success: true
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      message: 'Failed to send message. Please try again later.',
      error: 'CONTACT_FORM_ERROR'
    });
  }
});

// Get social media links
router.get('/social-links', (req, res) => {
  try {
    const socialLinks = {
      whatsapp: {
        url: `https://wa.me/${process.env.WHATSAPP_NUMBER}`,
        number: process.env.WHATSAPP_NUMBER,
        display: `+${process.env.WHATSAPP_NUMBER}`
      },
      twitter: {
        url: `https://twitter.com/${process.env.TWITTER_HANDLE}`,
        handle: process.env.TWITTER_HANDLE,
        display: `@${process.env.TWITTER_HANDLE}`
      },
      instagram: {
        url: `https://instagram.com/${process.env.INSTAGRAM_HANDLE}`,
        handle: process.env.INSTAGRAM_HANDLE,
        display: `@${process.env.INSTAGRAM_HANDLE}`
      }
    };

    res.json({
      message: 'Social links retrieved successfully',
      socialLinks
    });

  } catch (error) {
    console.error('Get social links error:', error);
    res.status(500).json({
      message: 'Failed to retrieve social links',
      error: 'SOCIAL_LINKS_ERROR'
    });
  }
});

// Newsletter subscription
router.post('/newsletter', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, name } = req.body;

    // Send welcome email
    const welcomeContent = `
      <h2>Welcome to Mideyateller Fashion Store Newsletter!</h2>
      <p>Dear ${name || 'Fashion Lover'},</p>
      <p>Thank you for subscribing to our newsletter! You'll be the first to know about:</p>
      <ul>
        <li>New dress collections</li>
        <li>Exclusive discounts and offers</li>
        <li>Fashion tips and trends</li>
        <li>Custom dress showcases</li>
      </ul>
      <p>Stay stylish!</p>
      <p>Best regards,<br>Mideyateller Fashion Store Team</p>
      <hr>
      <p>Follow us on social media:</p>
      <p>
        <a href="https://wa.me/${process.env.WHATSAPP_NUMBER}">WhatsApp</a> | 
        <a href="https://twitter.com/${process.env.TWITTER_HANDLE}">Twitter</a> | 
        <a href="https://instagram.com/${process.env.INSTAGRAM_HANDLE}">Instagram</a>
      </p>
    `;

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Mideyateller Fashion Store Newsletter!',
      html: welcomeContent
    };

    await transporter.sendMail(mailOptions);

    // Here you would typically save the email to a newsletter database
    // For now, we'll just send a success response

    res.json({
      message: 'Successfully subscribed to newsletter!',
      success: true
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      message: 'Failed to subscribe to newsletter. Please try again later.',
      error: 'NEWSLETTER_ERROR'
    });
  }
});

// Get business hours and contact info
router.get('/info', (req, res) => {
  try {
    const contactInfo = {
      businessHours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed'
      },
      address: {
        street: '123 Fashion Street',
        city: 'Style City',
        state: 'Fashion State',
        zipCode: '12345',
        country: 'Fashion Country'
      },
      phone: process.env.WHATSAPP_NUMBER,
      email: process.env.EMAIL_USER,
      responseTime: '24 hours',
      languages: ['English', 'Spanish', 'French']
    };

    res.json({
      message: 'Contact information retrieved successfully',
      contactInfo
    });

  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({
      message: 'Failed to retrieve contact information',
      error: 'CONTACT_INFO_ERROR'
    });
  }
});

module.exports = router;
