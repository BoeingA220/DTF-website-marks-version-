import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { BUSINESS } from "@/lib/constants";

const schema = z.object({
  category: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  projectDetails: z.string().min(1),
  artworkFileId: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { category, name, email, phone, projectDetails, artworkFileId } = parsed.data;

  try {
    await prisma.quoteRequest.create({
      data: { category, name, email, phone, projectDetails, artworkFileId },
    });
  } catch (err) {
    console.error("Failed to save quote request (is the database configured?):", err);
    // Fall through to email so the lead isn't lost even if the DB is down.
  }

  await sendEmail({
    to: BUSINESS.email,
    replyTo: email,
    subject: `New quote request: ${category} — ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h1 style="color: #0057B8;">New Quote Request</h1>
        <p><strong>Category:</strong> ${escapeHtml(category)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p><strong>Project details:</strong></p>
        <p>${escapeHtml(projectDetails).replace(/\n/g, "<br />")}</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
