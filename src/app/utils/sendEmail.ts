import nodemailer from "nodemailer";
import config from "../config/config";

const transporter = nodemailer.createTransport({
  host: config.host_email,
  port: Number(config.app_port),
  secure: Number(config.app_port) === 465,
  auth: {
    user: config.app_email,
    pass: config.app_pass,
  },
  logger: config.node_env !== "production",
  debug: config.node_env !== "production",
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: SendMailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"SAWDIA ELECTRONICS AND HARDWARE" <${config.app_email}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", (error as Error).message);
    throw error;
  }
};

export const verifySmtp = async () => {
  await transporter.verify();
  console.log("✅ SMTP verified & ready");
};
