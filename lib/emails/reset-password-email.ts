import { emailLayout } from "./email-layout";

export function resetPasswordEmail({
  url,
}: {
  url: string;
}) {
  const html = emailLayout({
    preview:
      "Reset your Enviroshield password.",

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
        Reset your password
      </div>

      <p
        style="
          margin:20px 0 0;
          color:rgba(255,255,255,0.60);
          font-size:16px;
          line-height:26px;
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
              Reset password
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
        This password reset link will expire after
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

      <p
        style="
          margin:20px 0 0;
          color:rgba(255,255,255,0.30);
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