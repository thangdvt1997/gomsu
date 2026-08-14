import nodemailer from "nodemailer";
import { getSettings, SETTING_KEYS } from "@/lib/settings";

// Gmail via an App Password (SMTP_USER + SMTP_APP_PASSWORD env vars) -- no
// third-party email service account needed. Notifications are best-effort:
// a failure here must never block an order/lead from being created, so
// every call site wraps this in try/catch and only logs on failure.
export async function sendNotificationEmail(subject: string, bodyLines: string[]) {
  const settings = await getSettings();
  if (settings[SETTING_KEYS.NOTIFY_EMAIL_ENABLED] !== "true") return;

  const to = settings[SETTING_KEYS.NOTIFY_EMAIL];
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;
  if (!to || !user || !pass) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `Gốm Sứ Trung Mừng <${user}>`,
    to,
    subject,
    text: bodyLines.join("\n"),
  });
}
