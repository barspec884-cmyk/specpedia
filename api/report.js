import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { mode, name, checks, cashText, comment, denominations } = req.body;

  try {
    await resend.emails.send({
      from: "SPEC-OPS <onboarding@resend.dev>",
      to: ["bar-spec@uspot.jp"],
      subject: `【SPEC-OPS】${mode}報告：${name || "未記入"}`,
      text: `
${mode}報告

担当：${name}

チェック状況：
${checks}

金種：
${denominations}

集計：
${cashText}

コメント：
${comment || "なし"}
`
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Mail send failed" });
  }
}
