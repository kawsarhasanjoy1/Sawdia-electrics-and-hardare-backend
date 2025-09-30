import nodmailer from "nodemailer";
import config from "../config/config";

const transporter = nodmailer.createTransport({
  host: config.host_email,
  port: Number(config.app_port),
  secure: true,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: config.app_email,
    pass: config.app_pass,
  },
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

    console.log("✅ Email sent: %s", info.messageId);

    // Ethereal preview (testing purpose only)
    if (config.host_email === "smtp.ethereal.email") {
      console.log(
        "🔗 Preview URL: %s",
        require("nodemailer").getTestMessageUrl(info)
      );
    }

    return info;
  } catch (error) {
    console.error("❌ Email sending failed", error);
    throw error;
  }
};
