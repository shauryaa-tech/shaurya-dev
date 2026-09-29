const SECRET = "PASTE_MAIL_SECRET_FROM_ENV";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (!SECRET || data.secret !== SECRET) {
      return json_({ ok: false });
    }
    GmailApp.sendEmail(data.to, data.subject, data.text || "", {
      htmlBody: data.html,
      replyTo: data.replyTo,
      name: "Shaurya.dev",
    });
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function json_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
