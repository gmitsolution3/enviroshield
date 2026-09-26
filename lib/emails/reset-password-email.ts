import { emailLayout } from "./email-layout";

export function resetPasswordEmail({ url }: { url: string }) {
  const html = emailLayout({
    preview: "Reset your Enviroshield password.",

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
        ACCOUNT RECOVERY
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
        Reset your password
      </div>

      <p
        style="
          margin:18px 0 0;
          color:#18384a;
          font-size:15px;
          line-height:25px;
        "
      >
        We received a request to reset the password
        for your Enviroshield account.
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
              Reset password
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
        This password reset link will expire after
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

      <p
        style="
          margin:20px 0 0;
          color:#18384a;
          font-size:12px;
          line-height:20px;
        "
      >
        If you did not request a password reset,
        you can safely ignore this email.
      </p>
    `,
  });

  const text = `
Reset your Enviroshield password

We received a request to reset the password for
your Enviroshield account.

Reset your password:

${url}

This password reset link will expire after 1 hour.

If you did not request a password reset, you can
safely ignore this email.
`;

  return {
    html,
    text,
  };
}
