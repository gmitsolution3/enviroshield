const logoUrl = process.env.EMAIL_LOGO_URL;

export function emailLayout({
  preview,
  children,
}: {
  preview: string;
  children: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>Enviroshield</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #0b0d12;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
  "
>
  <div
    style="
      display:none;
      max-height:0;
      overflow:hidden;
      opacity:0;
    "
  >
    ${preview}
  </div>

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color:#0b0d12;"
  >
    <tr>
      <td align="center" style="padding:48px 20px;">

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="max-width:600px;"
        >

          <!-- Logo -->
          <tr>
            <td
              align="center"
              style="padding-bottom:32px;"
            >
              ${
                logoUrl
                  ? `
                    <img
                      src="${logoUrl}"
                      alt="Enviroshield"
                      width="52"
                      height="52"
                      style="
                        display:block;
                        width:52px;
                        height:52px;
                        object-fit:contain;
                        border:0;
                      "
                    />
                  `
                  : `
                    <div
                      style="
                        font-size:22px;
                        font-weight:800;
                        letter-spacing:-0.5px;
                        color:#ffffff;
                      "
                    >
                      Enviro<span
                        style="color:rgba(255,255,255,0.45);"
                      >
                        shield
                      </span>
                    </div>
                  `
              }
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td
              style="
                background-color:#151820;
                border:1px solid rgba(255,255,255,0.10);
                border-radius:20px;
                padding:40px;
              "
            >
              ${children}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                padding-top:28px;
                color:rgba(255,255,255,0.35);
                font-size:12px;
                line-height:20px;
              "
            >
              <div>
                Enviroshield
              </div>

              <div style="margin-top:4px;">
                Environmental solutions for a better future.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
}
