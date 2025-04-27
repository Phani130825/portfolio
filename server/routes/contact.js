const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP Configuration Error:', error);
    } else {
        console.log('SMTP Server is ready to take our messages');
    }
});

// Handle contact form submission
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Log the request
        console.log('Received contact form submission:', { name, email });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'phanidattakandukuri1308@gmail.com',
            subject: `Portfolio Contact Form: ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Message: ${message}
            `,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Log email configuration
        console.log('Attempting to send email with configuration:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Detailed error sending email:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });

        // Send more specific error message to client
        let errorMessage = 'Error sending message';
        if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please check your email configuration.';
        } else if (error.code === 'ESOCKET') {
            errorMessage = 'Network error while sending email. Please try again later.';
        }

        res.status(500).json({ 
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router; 