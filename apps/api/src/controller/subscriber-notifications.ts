import { and, eq } from "drizzle-orm";
import { db } from "../database";
import { subscribers } from "../database/schema";
import SMTPservice from "../util/email";
import { env } from "../util/env";
import {
  monthlyReminderEmail,
  newPostEmail,
} from "../util/subscriber-templates";

const API_URL = env.API_URL;
const WEB_URL = env.WEB_URL;

const unsubscribeLink = (token: string) =>
  `${API_URL}/api/v1/subscribe/unsubscribe?token=${token}`;

const getActiveSubscribers = () =>
  db
    .select({
      email: subscribers.email,
      unsubscribeToken: subscribers.unsubscribeToken,
    })
    .from(subscribers)
    .where(
      and(eq(subscribers.isVerified, true), eq(subscribers.isActive, true)),
    );

// Sends in small batches so one bad address never blocks the rest.
async function sendInBatches<T>(
  items: T[],
  send: (item: T) => Promise<unknown>,
  size = 10,
) {
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < items.length; i += size) {
    const results = await Promise.allSettled(
      items.slice(i, i + size).map(send),
    );
    for (const r of results) {
      if (r.status === "fulfilled") sent++;
      else {
        failed++;
        console.error("Subscriber email failed:", r.reason);
      }
    }
  }

  return { sent, failed };
}

export async function notifySubscribersOfNewPost(post: {
  title: string;
  excerpt?: string | null;
  slug: string;
  header_Image_UrL?: string | null;
}) {
  const list = await getActiveSubscribers();
  const postUrl = `${WEB_URL}/blog/${encodeURIComponent(post.slug)}`;
  const description = post.excerpt ?? "";

  return sendInBatches(list, (s) => {
    const unsubscribeUrl = unsubscribeLink(s.unsubscribeToken);

    return SMTPservice.sendEmail({
      to: s.email,
      subject: `New post: ${post.title}`,
      text: [
        `New post: ${post.title}`,

        `Read it here: ${postUrl}`,
        "",
        `Unsubscribe: ${unsubscribeUrl}`,
      ].join("\n"),
      html: newPostEmail({
        title: post.title,
        description,
        postUrl,
        unsubscribeUrl,
        imageUrl: post.header_Image_UrL,
      }),
    });
  });
}

export async function sendMonthlyUnsubscribeReminder() {
  const list = await getActiveSubscribers();

  // Month name in Lagos time, so a 09:00 UTC send on the 1st is always the new month
  const month = new Date().toLocaleString("en-US", {
    month: "long",
    timeZone: "Africa/Lagos",
  });
  const contactUrl = `${WEB_URL}/contact`;

  return sendInBatches(list, (s) => {
    const unsubscribeUrl = unsubscribeLink(s.unsubscribeToken);

    return SMTPservice.sendEmail({
      to: s.email,
      subject: `Happy new month from Leowave `,
      text: [
        `Happy new month! Welcome to ${month}.`,
        "",
        "Thank you for being part of the Leowave blog.",
        "",
        "Got a project in mind? Leowave builds all kinds of web apps, and we're open to gigs and available to work remotely.",
        `Get in touch: ${contactUrl}`,
        "",
        "You're receiving this because you subscribed to Leowave's personal blog.",
        `Unsubscribe any time: ${unsubscribeUrl}`,
      ].join("\n"),
      html: monthlyReminderEmail({ month, unsubscribeUrl, contactUrl }),
    });
  });
}
