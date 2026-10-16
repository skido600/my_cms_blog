import { escapeHtml } from "./email";

const subscriber = (verificationUrl: string) => {
  const safeUrl = escapeHtml(verificationUrl);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirm your subscription</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Confirm your email to receive new articles from our blog.
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:40px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 28px;background:#18181b;color:#ffffff;">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d4d4d8;">LEOWAVE</p>
              <h1 style="margin:0;font-size:27px;line-height:1.3;">One last step.</h1>
              <p style="margin:12px 0 0;color:#d4d4d8;font-size:15px;line-height:1.7;">Confirm your email address to join our community of readers.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.8;">Thanks for subscribing to Leowave's personal blog! We'll let you know when a new article is published.</p>
              <p style="margin:0 0 26px;font-size:15px;line-height:1.8;color:#52525b;">Click below to verify your email address and activate your subscription.</p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td bgcolor="#18181b" style="border-radius:8px;">
                    <a href="${safeUrl}" style="display:inline-block;padding:15px 24px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;">Confirm my email &rarr;</a>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 8px;font-size:13px;color:#71717a;line-height:1.7;">This link expires in 24 hours.</p>
              <p style="margin:0;font-size:13px;color:#71717a;line-height:1.7;">If the button doesn't work, copy and paste this URL into your browser:</p>
              <p style="overflow-wrap:anywhere;font-size:12px;line-height:1.7;"><a href="${safeUrl}" style="color:#52525b;">${safeUrl}</a></p>
              <hr style="border:0;border-top:1px solid #e4e4e7;margin:28px 0 20px;" />
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.7;">If you didn't request this subscription, you can safely ignore this email.</p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-size:11px;color:#a1a1aa;">You received this email because someone entered your address on our blog.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

const newPostEmail = (post: {
  title: string;
  description: string;
  postUrl: string;
  unsubscribeUrl: string;
  imageUrl?: string | null;
}) => {
  const title = escapeHtml(post.title);
  const description = escapeHtml(post.description.slice(0, 400));
  const safePostUrl = escapeHtml(post.postUrl);
  const safeUnsubscribeUrl = escapeHtml(post.unsubscribeUrl);

  const image = post.imageUrl
    ? `<img src="${escapeHtml(post.imageUrl)}" alt="${title}" width="100%" style="display:block;max-width:504px;height:auto;border-radius:10px;margin:0 0 24px;" />`
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:36px 12px;background:#f4f4f5;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:26px 28px;background:#18181b;color:#fff;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;color:#d4d4d8;">NEW ARTICLE</p>
          <h1 style="margin:0;font-size:24px;line-height:1.4;">Fresh from the blog.</h1>
        </td></tr>
        <tr><td style="padding:28px;">
          ${image}
          <h2 style="margin:0 0 14px;font-size:24px;line-height:1.4;">${title}</h2>
          <p style="margin:0 0 26px;font-size:15px;line-height:1.9;color:#52525b;">${description}</p>
          <a href="${safePostUrl}" style="display:inline-block;background:#18181b;color:#fff;text-decoration:none;padding:14px 22px;border-radius:8px;font-size:14px;font-weight:bold;">Read the full article &rarr;</a>
          <hr style="border:0;border-top:1px solid #e4e4e7;margin:30px 0 18px;" />
          <p style="margin:0;font-size:12px;line-height:1.8;color:#71717a;">You're receiving this because you confirmed your blog subscription.</p>
          <p style="margin:8px 0 0;font-size:12px;"><a href="${safeUnsubscribeUrl}" style="color:#52525b;text-decoration:underline;">Unsubscribe from new-post emails</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;
};

const monthlyReminderEmail = (opts: {
  month: string;
  unsubscribeUrl: string;
  contactUrl: string;
}) => {
  const month = escapeHtml(opts.month);
  const unsubscribeUrl = escapeHtml(opts.unsubscribeUrl);
  const contactUrl = escapeHtml(opts.contactUrl);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Happy new month from Leowave</title>
</head>
<body style="margin:0;padding:36px 12px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
    <tr>
      <td style="padding:30px 28px;background:#18181b;color:#fff;">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;color:#d4d4d8;">LEOWAVE</p>
        <h1 style="margin:0;font-size:26px;line-height:1.3;">Happy new month! 🎉</h1>
        <p style="margin:10px 0 0;font-size:15px;color:#d4d4d8;line-height:1.7;">Welcome to ${month}. Wishing you a month full of progress and good news.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#52525b;">Thank you for being part of the Leowave blog. We appreciate every one of you who reads and follows along.</p>

        <div style="margin:0 0 20px;padding:18px 20px;background:#f4f4f5;border-radius:12px;">
          <p style="margin:0 0 8px;font-size:15px;font-weight:bold;color:#18181b;">Got a project in mind?</p>
          <p style="margin:0;font-size:14px;line-height:1.8;color:#52525b;">Leowave builds all kinds of web apps, from landing pages to full platforms. We're also open to gigs and available to work remotely, so wherever you are, we'd be glad to help.</p>
        </div>

        <a href="${contactUrl}" style="display:inline-block;background:#18181b;color:#fff;text-decoration:none;padding:14px 22px;border-radius:8px;font-size:14px;font-weight:bold;">Let's work together &rarr;</a>

        <hr style="border:0;border-top:1px solid #e4e4e7;margin:30px 0 18px;" />

        <p style="margin:0;font-size:12px;line-height:1.8;color:#71717a;">You're receiving this email because you subscribed to Leowave's personal blog. If you'd rather stop getting these emails, you can opt out at any time:</p>
        <p style="margin:8px 0 0;font-size:12px;"><a href="${unsubscribeUrl}" style="color:#52525b;text-decoration:underline;">Unsubscribe</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

const unsubscribePage = (token: string, actionUrl: string) => {
  const safeToken = escapeHtml(token);
  const safeActionUrl = escapeHtml(actionUrl);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unsubscribe</title>
</head>
<body style="margin:0;padding:40px 16px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
  <main style="max-width:480px;margin:40px auto;background:#fff;border:1px solid #e4e4e7;border-radius:16px;padding:32px;">
    <p style="font-size:12px;letter-spacing:2px;color:#71717a;">NEWSLETTER PREFERENCES</p>
    <h1 style="font-size:26px;">Leaving us?</h1>
    <p style="font-size:15px;line-height:1.8;color:#52525b;">If you unsubscribe, you'll stop receiving emails when new articles are published.</p>
    <form method="POST" action="${safeActionUrl}">
      <input type="hidden" name="token" value="${safeToken}">
      <button type="submit" style="background:#18181b;color:#fff;border:0;border-radius:8px;padding:14px 20px;font-size:14px;cursor:pointer;">Yes, unsubscribe me</button>
    </form>
    <p style="margin-top:24px;font-size:12px;color:#71717a;">Changed your mind? Simply close this page.</p>
  </main>
</body>
</html>
`;
};

export { subscriber, newPostEmail, monthlyReminderEmail, unsubscribePage };
