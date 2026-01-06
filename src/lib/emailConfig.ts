import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const resend = new Resend(process.env.RESEND_API_KEY);
