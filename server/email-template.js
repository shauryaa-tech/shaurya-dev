function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function hexColor(value, fallback) {
  return /^#[0-9a-fA-F]{6}$/.test(String(value || "")) ? String(value) : fallback;
}

function rgb(hex) {
  const n = hex.slice(1);
  return `${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)}`;
}

export function contactMail({ name, email, subject, message, theme = {} }) {
  const light = theme.mode === "light";
  const cyan = hexColor(theme.cyan, "#00f0ff");
  const violet = hexColor(theme.violet, "#a855f7");
  const ink = light ? "#f4f7fb" : hexColor(theme.ink, "#030712");
  const panel = light ? "#ffffff" : hexColor(theme.panel, "#0b0f19");
  const heading = light ? "#0f172a" : "#ffffff";
  const muted = light ? "#64748b" : "#94a3b8";
  const body = light ? "#334155" : "#e2e8f0";
  const line = light ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.08)";
  const buttonText = light ? "#0f172a" : "#030712";
  const cyanRgb = rgb(cyan);
  const violetRgb = rgb(violet);
  const subjectLine = `Shaurya.dev · ${subject} — ${name}`;
  const sent = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);
  const replyHref = `mailto:${safeEmail}?subject=${encodeURIComponent(`Re: ${subject}`)}`;

  const text = [
    "SHAURYA.DEV",
    "A new message just landed.",
    "",
    `From: ${name}`,
    `Reply: ${email}`,
    `Topic: ${subject}`,
    "",
    message,
    "",
    "Shaurya Pratap Singh · AI/ML Engineer",
    sent,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${ink};">
  <div style="display:none;max-height:0;overflow:hidden;">New portfolio message from ${safeName} — ${safeSubject}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${ink};background-image:radial-gradient(rgba(${light ? "15,23,42" : "255,255,255"},0.07) 1px, transparent 1px), radial-gradient(circle at 8% 0%, rgba(${cyanRgb},0.22), transparent 32%), radial-gradient(circle at 100% 100%, rgba(${violetRgb},0.2), transparent 36%);background-size:22px 22px, auto, auto;padding:36px 14px;font-family:'Plus Jakarta Sans',Arial,sans-serif;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${panel};border:1px solid rgba(${cyanRgb},0.4);border-radius:28px;overflow:hidden;">
        <tr><td style="height:5px;background:linear-gradient(90deg,${cyan} 0%, ${violet} 100%);font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:34px 32px 0;">
          <p style="margin:0;font-family:'Syne',Arial,sans-serif;font-weight:800;font-size:15px;letter-spacing:0.18em;color:${heading};">SHAURYA<span style="color:${cyan};">.DEV</span></p>
          <p style="margin:22px 0 0;">
            <span style="display:inline-block;border:1px solid rgba(${cyanRgb},0.35);background:rgba(${cyanRgb},0.08);color:${body};font-family:'JetBrains Mono',Consolas,monospace;font-size:10px;letter-spacing:0.18em;padding:7px 12px;border-radius:999px;">● &nbsp;NEW MESSAGE</span>
          </p>
          <h1 style="margin:18px 0 0;font-family:'Syne',Arial,sans-serif;font-weight:800;font-size:52px;line-height:0.88;letter-spacing:-0.045em;color:${heading};">A NEW<br><span style="color:${cyan};">MESSAGE.</span></h1>
          <p style="margin:16px 0 0;font-size:15px;line-height:1.55;color:${muted};">Someone just wrote from the portfolio.</p>
        </td></tr>
        <tr><td style="padding:22px 32px 0;">
          <span style="display:inline-block;background:${cyan};color:${buttonText};font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;padding:8px 14px;border-radius:999px;">${safeSubject}</span>
        </td></tr>
        <tr><td style="padding:22px 32px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${line};">
            <tr>
              <td style="padding:18px 12px 0 0;vertical-align:top;width:50%;">
                <p style="margin:0 0 6px;font-family:'JetBrains Mono',Consolas,monospace;font-size:10px;letter-spacing:0.22em;color:${muted};">FROM</p>
                <p style="margin:0;font-family:'Syne',Arial,sans-serif;font-weight:700;font-size:20px;line-height:1.15;color:${heading};">${safeName}</p>
              </td>
              <td style="padding:18px 0 0 0;vertical-align:top;width:50%;">
                <p style="margin:0 0 6px;font-family:'JetBrains Mono',Consolas,monospace;font-size:10px;letter-spacing:0.22em;color:${muted};">REPLY</p>
                <p style="margin:0;font-size:15px;line-height:1.4;"><a href="mailto:${safeEmail}" style="color:${cyan};text-decoration:none;">${safeEmail}</a></p>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:18px 32px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${ink};border:1px solid ${line};border-radius:20px;">
            <tr><td style="padding:8px 18px 0;">
              <p style="margin:12px 0 0;font-family:'JetBrains Mono',Consolas,monospace;font-size:10px;letter-spacing:0.22em;color:${muted};">NOTE</p>
            </td></tr>
            <tr><td style="padding:8px 18px 18px;">
              <p style="margin:0;font-size:16px;line-height:1.7;color:${body};white-space:pre-wrap;">${safeMessage}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:26px 32px 32px;">
          <a href="${replyHref}" style="display:inline-block;background:${cyan};color:${buttonText};text-decoration:none;font-family:'JetBrains Mono',Consolas,monospace;font-weight:700;font-size:12px;letter-spacing:0.16em;padding:14px 22px;border-radius:999px;">REPLY</a>
          <p style="margin:22px 0 0;font-size:12px;line-height:1.6;color:${muted};">Shaurya Pratap Singh · AI/ML Engineer<br>${escapeHtml(sent)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject: subjectLine, text, html };
}
