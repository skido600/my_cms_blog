export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

class SMTPservice {
  private static EMAIL_API_URL =
    "https://emailsender-theta.vercel.app/send-email";

  // private static resend = new Resend(process.env.RESEND_API_KEY);

  public static async sendEmail({
    to,
    subject,
    html,
    text,
  }: EmailOptions): Promise<void> {
    const response = await fetch(this.EMAIL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Email sending failed (${response.status}): ${errorText}`,
      );
    }
  }
}

export default SMTPservice;
