import { Resend } from "resend";
import { BUSINESS, SITE_NAME } from "@/lib/constants";

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? `${SITE_NAME} <orders@royaleyecandy.com>`;

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

/**
 * Sends transactional email via Resend when RESEND_API_KEY is configured.
 * Without a key (e.g. local dev before the account is set up), this logs
 * the email instead of throwing, so forms and checkout still work end to end.
 */
export async function sendEmail({ to, subject, html, replyTo }: SendEmailArgs) {
  if (!resendClient) {
    console.log(`[email:skipped — no RESEND_API_KEY] to=${to} subject="${subject}"`);
    return { skipped: true };
  }

  try {
    return await resendClient.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
      replyTo,
    });
  } catch (err) {
    console.error("Failed to send email via Resend:", err);
    return { skipped: true, error: true };
  }
}

export function orderConfirmationEmailHtml(opts: {
  orderId: string;
  customerName: string;
  itemsHtml: string;
  total: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h1 style="color: #0057B8;">Thanks for your order, ${opts.customerName}!</h1>
      <p>Your order <strong>#${opts.orderId}</strong> has been received and is being prepared for print.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        ${opts.itemsHtml}
      </table>
      <p><strong>Total: ${opts.total}</strong></p>
      <p>Questions? Call us at ${BUSINESS.phone} or reply to this email.</p>
      <p style="color: #888; font-size: 12px;">${BUSINESS.name} — ${BUSINESS.addressLine}</p>
    </div>
  `;
}
