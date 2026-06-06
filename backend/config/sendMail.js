import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

// Wrap in an async IIFE so we can use await.

const sendMail = async (to, otp) => {
  try{
      await transporter.sendMail({
    from: process.env.USER,
    to: to,
    subject: "OTP for forgot password",
    text: "Dear User", // plain‑text body
    html:
      "<p>this is your otp for forget password</p> <b>" +
      otp +
      "</b> <p>this is valid only 5 minutes<p/>", // HTML body
  });
  }catch(error){
    console.log(error);
  }
  

};

export default sendMail;
