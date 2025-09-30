import nodemailer from "nodemailer";
import config from "../config/config";

const PORT = Number(config.app_port); 
const USE_IMPLICIT_TLS = PORT === 465; 

export const transporter = nodemailer.createTransport({
  host: config.host_email,          
  port: PORT,
  secure: USE_IMPLICIT_TLS,            
  auth: {
    user: config.app_email,
    pass: config.app_pass,
  },
  requireTLS: !USE_IMPLICIT_TLS,      
  tls: {
    minVersion: "TLSv1.2",            
  },

  connectionTimeout: 10_000,           
  greetingTimeout:   7_000,        
  socketTimeout:    15_000,         
  pool: true,
  maxConnections: 2,
  maxMessages: 50,
});


interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const mailTimeout = (ms: number) =>
  new Promise<never>((_, rej) => setTimeout(() => rej(new Error("MAIL_TIMEOUT")), ms));

export const sendEmail = async ({ to, subject, html, text }: SendMailOptions) => {
  try {
    const info = await Promise.race([
      transporter.sendMail({
        from: `"SAWDIA ELECTRONICS AND HARDWARE" <${config.app_email}>`,
        to, subject, text, html,
      }),
      mailTimeout(12_000),
    ]);

    console.log("✅ Email sent:", (info as any).messageId);
    return info;
  } catch (error: any) {
    if (error?.message === "MAIL_TIMEOUT") {
      console.error("⏳ Mail send timed out (client-side guard)");
      throw new Error("EMAIL_SEND_TIMEOUT");
    }
    console.error("❌ Email sending failed:", error?.code || error?.name, error?.message);
    throw error;
  }
};


transporter.verify()
  .then(() => console.log("📬 SMTP reachable & auth OK"))
  .catch((e) => console.error("🚫 SMTP verify failed:", e?.code, e?.command, e?.message));
