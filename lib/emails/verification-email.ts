import { emailLayout } from "./email-layout";

export function verificationEmail({ url }: { url: string }) {
  const html = emailLayout({
    preview: "Verify your Enviroshield email address.",

    children: `
      <div
        style="
          color:#ffffff;
          font-size:28px;
          line-height:36px;
          font-weight:800;
          letter-spacing:-0.8px;
        "
      >
        Verify your email
      </div>

      <p
        style="
          margin:20px 0 0;
          color:rgba(255,255,255,0.60);
          font-size:16px;
          line-height:26px;
        "
      >
        Welcome to Enviroshield. Please verify your
        email address to activate your account and
        continue.
      </p>

      <table
        role="presentation"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="margin-top:30px;"
      >
        <tr>
          <td
            align="center"
            style="
              border-radius:999px;
              background-color:#ffffff;
            "
          >
            <a
              href="${url}"
              style="
                display:inline-block;
                padding:14px 26px;
                color:#0b0d12;
                font-size:14px;
                line-height:20px;
                font-weight:700;
                text-decoration:none;
              "
            >
              Verify email
            </a>
          </td>
        </tr>
      </table>

      <p
        style="
          margin:30px 0 0;
          color:rgba(255,255,255,0.38);
          font-size:13px;
          line-height:21px;
        "
      >
        This verification link will expire after
        1 hour.
      </p>

      <p
        style="
          margin:24px 0 0;
          padding-top:24px;
          border-top:1px solid rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.38);
          font-size:12px;
          line-height:20px;
          word-break:break-all;
        "
      >
        If the button doesn't work, copy and paste
        this link into your browser:
        <br />

        <a
          href="${url}"
          style="
            color:#7c83ff;
            text-decoration:none;
          "
        >
          ${url}
        </a>
      </p>
    `,
  });

  const text = `
Verify your Enviroshield email

Welcome to Enviroshield. Please verify your email
address to activate your account.

Verify your email:
${url}

This verification link will expire after 1 hour.

If you did not create this account, you can safely
ignore this email.
`;

  return {
    html,
    text,
  };
}
