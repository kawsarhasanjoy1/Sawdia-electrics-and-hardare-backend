// src/utils/mailer.ts
import nodemailer from "nodemailer";
import config from "../config/config";

const SANDBOX = (process.env.MAIL_SANDBOX || "").toLowerCase(); 

type Transporter = nodemailer.Transporter;
let transporterPromise: Promise<Transporter> | null = null;

const mailTimeout = (ms: number) =>
  new Promise<never>((_, rej) => setTimeout(() => rej(new Error("MAIL_TIMEOUT")), ms));

async function buildTransporter(): Promise<Transporter> {
  if (SANDBOX === "ethereal") {
    const testAcc = await nodemailer.createTestAccount();
    const t = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAcc.user, pass: testAcc.pass },
      tls: { minVersion: "TLSv1.2" },
      connectionTimeout: 10_000,
      greetingTimeout: 7_000,
      socketTimeout: 15_000,
      pool: true,
      maxConnections: 2,
      maxMessages: 50,
    });
    await t.verify();
    console.log("📬 Ethereal SMTP OK");
    return t;
  }

  if (SANDBOX === "mailtrap") {
    const host = process.env.MAIL_HOST || "smtp.mailtrap.io";
    const port = Number(process.env.MAIL_PORT || 587);
    const user = process.env.MAIL_USER || "";
    const pass = process.env.MAIL_PASS || "";

    const t = nodemailer.createTransport({
      host,
      port,
      secure: false,              // 587 -> secure:false
      auth: { user, pass },
      requireTLS: true,
      tls: { minVersion: "TLSv1.2" },
      connectionTimeout: 10_000,
      greetingTimeout: 7_000,
      socketTimeout: 15_000,
      pool: true,
      maxConnections: 2,
      maxMessages: 50,
    });
    await t.verify();
    console.log("📬 Mailtrap SMTP OK");
    return t;
  }

  const PORT = Number(config.app_port);
  const USE_IMPLICIT_TLS = PORT === 465; 

  const t = nodemailer.createTransport({
    host: config.host_email,
    port: PORT,
    secure: USE_IMPLICIT_TLS,
    auth: {
      user: config.app_email,
      pass: config.app_pass,
    },
    requireTLS: !USE_IMPLICIT_TLS,      
    tls: { minVersion: "TLSv1.2" },

    connectionTimeout: 10_000,
    greetingTimeout: 7_000,
    socketTimeout: 15_000,
    pool: true,
    maxConnections: 2,
    maxMessages: 50,
  });


  await t.verify();
  console.log("📬 SMTP verify OK:", config.host_email, PORT);
  return t;
}

async function getTransporter(): Promise<Transporter> {
  if (!transporterPromise) {
    transporterPromise = buildTransporter().catch((e) => {
      transporterPromise = null;
      throw e;
    });
  }
  return transporterPromise;
}

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({ to, subject, html, text }: SendMailOptions) => {
  const transporter = await getTransporter();

  try {
    const info = await Promise.race([
      transporter.sendMail({
        from: `"SAWDIA ELECTRONICS AND HARDWARE" <${config.app_email}>`,
        to,
        subject,
        text,
        html,
      }),
      mailTimeout(12_000),
    ]);

    console.log("✅ Email sent:", (info as any).messageId);

    if (SANDBOX === "ethereal") {
      console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error: any) {
    if (error?.message === "MAIL_TIMEOUT") {
      console.error("⏳ Mail send timed out (client-side guard)");
      throw new Error("EMAIL_SEND_TIMEOUT");
    }
    console.error(
      "❌ Email sending failed:",
      error?.code || error?.name,
      error?.command || "",
      error?.message
    );
    throw error;
  }
};
