import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_EMAIL_USER, 
    pass: process.env.NEXT_EMAIL_PASS,
  },
});

export default transporter;