import config from "../config/config";

const nodemailer = require("nodemailer");
type TAcceptNodeMailer = {
  to: string,
  subject: string,
  text: string,
  html: string,
}

const transporter = nodemailer.createTransport({
  host: config.host_email,
  port: 587,
  secure: false,
  auth: {
    user: config.app_email,
    pass: config.app_pass,
  },
});


export const sendEmail = async ({ to, subject, text, html }: TAcceptNodeMailer) => {
  try {
    const info = await transporter.sendMail({
      from: `"SAWDIA ELECTRONICS AND HARDWARE" <${config.app_email}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (error: any) {
    console.error("❌ Email failed to send:", error?.message || error);
    
    if (error?.responseCode === 550) {
      console.warn("🚫 The recipient email address is invalid or doesn't exist.");
    }
  }
};
