// src/utils/mailer.ts
import nodemailer, { Transporter } from "nodemailer";
import config from "../config/config";

const isSandbox =
  config.mail_sandbox === "true" ||
  config.mail_sandbox === "1" ||
  config.mail_sandbox === "yes";

let transporter: Transporter;
let fromHeader = `"SAWDIA ELECTRONICS AND HARDWARE" <${config.app_email}>`;

async function createTransporter(): Promise<Transporter> {
  if (isSandbox) {
    const testAccount = await nodemailer.createTestAccount();
    fromHeader = `"SAWDIA ELECTRONICS AND HARDWARE" <${testAccount.user}>`;

    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      logger: true,
      debug: true,
    });
  }

  return nodemailer.createTransport({
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
}

let transporterReady: Promise<Transporter> | null = null;
const getTransporter = () => {
  if (!transporterReady) transporterReady = createTransporter();
  return transporterReady;
};

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({ to, subject, html, text }: SendMailOptions) => {
  if (!transporter) transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: fromHeader,
    to,
    subject,
    text,
    html,
  });

  console.log("✅ Email sent:", info.messageId);

  if (isSandbox) {
    const url = nodemailer.getTestMessageUrl(info);
    if (url) console.log("🔗 Preview URL:", url);
  }

  return info;
};


export const verifySmtp = async () => {
  if (!transporter) transporter = await getTransporter();
  await transporter.verify();
  console.log(`✅ SMTP verified (${isSandbox ? "sandbox" : "production"})`);
};
