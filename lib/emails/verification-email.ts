import { emailLayout } from "./email-layout";

export function verificationEmail({ url }: { url: string }) {
  const html = emailLayout({
    preview: "Verify your Enviroshield email address.",

    children: `
      <div
        style="
          margin-bottom:10px;
          color:#016edc;
          font-size:11px;
          line-height:16px;
          font-weight:800;
          letter-spacing:1.8px;
          text-transform:uppercase;
        "
      >
        WELCOME TO ENVIROSHIELD
      </div>

      <div
        style="
          color:#00334e;
          font-size:30px;
          line-height:36px;
          font-weight:800;
          letter-spacing:-0.8px;
        "
      >
        Verify your email
      </div>

      <p
        style="
          margin:18px 0 0;
          color:#18384a;
          font-size:15px;
          line-height:25px;
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
              background-color:#016edc;
            "
          >
            <a
              href="${url}"
              style="
                display:inline-block;
                padding:14px 27px;
                color:#ffffff;
                font-size:14px;
                line-height:20px;
                font-weight:800;
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
          margin:28px 0 0;
          color:#18384a;
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
          padding-top:22px;
          border-top:1px solid #dfe5e9;
          color:#18384a;
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
            color:#016edc;
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
