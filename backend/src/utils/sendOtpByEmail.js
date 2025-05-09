import nodemailer from 'nodemailer';
import { ApiError } from './ApiError';

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    service:'gamil',
    auth:{
        user:'your-email@gmail.com',
        pass:'your-password'
    }
})

// Replace with your actual sender email
const info = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@example.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
}

transporter.sendMail(info, (err, result) => {
    if (err) {
        console.log(err);
        throw new ApiError(500, 'Failed to send email');
    }
    console.log(result);
})