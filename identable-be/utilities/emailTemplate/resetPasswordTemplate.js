const RESET_PASSWORD_TEMPLATE = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Identable</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin: 0; background-color: #ebd7ff">
    <div style="padding: 40px 0">
      <table
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="width: 100%; border-spacing: 0; border-collapse: collapse"
      >
        <tbody>
          <tr>
            <td style="padding: 0" align="center">
              <table
                border="0"
                cellspacing="0"
                cellpadding="0"
                style="
                  width: 400pt;
                  border-spacing: 0;
                  border-collapse: collapse;
                "
              >
                <tbody>
                  <tr>
                    <td
                      style="
                        padding: 12pt 16pt;
                        border-bottom: 1px solid #1e1e1e;
                        background-color: #fff;
                      "
                      align="left"
                    >
                      <img src="https://identable-prod.s3.me-south-1.amazonaws.com/general/logo.png" alt="" width="160" />
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 12pt 16pt; background-color: #f6f5ff"
                      align="left"
                    >
                      <div style="height: 100px"></div>
                      <div
                        style="
                          font-weight: 600;
                          font-size: 32px;
                          line-height: 38px;
                          color: #1e1e1e;
                          font-family: Helvetica, sans-serif;
                        "
                      >
                        Hi, {{name}}
                      </div>
                      <div
                        style="
                          font-weight: 400;
                          font-size: 16px;
                          line-height: 24px;
                          color: #1e1e1e;
                          font-family: Helvetica, sans-serif;
                        "
                      >
                        It seems like you’ve requested a password reset. No
                        worries — we’re here to help you get back on track ,To
                        reset your password, simply click the button below.
                      </div>
                      <div style="height: 30px"></div>
                      <a
                        style="
                          width: 100%;
                          padding: 12px 16px;
                          background: #f53d00;
                          border: none;
                          border-radius: 4px;
                          font-weight: 600;
                          font-size: 16px;
                          line-height: 20px;
                          text-transform: capitalize;
                          color: #ffffff;
                        "
                        href="{{verificationLink}}"
                      >
                        Reset your password
                    </a>
                      <div style="height: 30px"></div>
                      <div
                        style="
                          font-weight: 500;
                          font-size: 14px;
                          line-height: 19px;
                          color: #4e4e4e;
                          font-family: Helvetica, sans-serif;
                        "
                      >
                        For security reasons, this link will expire in 24 hours.
                        If you didn’t request a password reset, you can safely
                        ignore this email.
                      </div>
                      <div style="height: 50px"></div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        background: linear-gradient(
                          90deg,
                          #ff5329 0%,
                          #9168c0 100%
                        );
                        padding: 12pt 16pt;
                      "
                      align="left"
                    >
                      <img src="https://identable-prod.s3.me-south-1.amazonaws.com/general/logo-white.png" alt="" width="160" />
                      <div style="height: 20px"></div>
                      <div
                        style="
                          font-weight: 500;
                          font-size: 10px;
                          line-height: 12px;
                          color: #fff;
                          font-family: Helvetica, sans-serif;
                        "
                      >
                        Our support team is always available to help you out.
                        Let us know what you need By sending email to
                        team@ideantable.club & we will get in touch right away.
                      </div>
                      <div style="height: 20px"></div>
                      <div style="display: inline-block; width: 100%">
                        <a href="#">
                          <img src="https://identable-prod.s3.me-south-1.amazonaws.com/general/social-1.png" alt="social" width="24" />
                        </a>
                        <a href="#">
                          <img src="https://identable-prod.s3.me-south-1.amazonaws.com/general/social-2.png" alt="social" width="24" />
                        </a>
                        <a href="#">
                          <img src="https://identable-prod.s3.me-south-1.amazonaws.com/general/social-3.png" alt="social" width="24" />
                        </a>
                      </div>
                      <div style="height: 20px"></div>
                      <div
                        style="
                          font-weight: 500;
                          font-size: 10px;
                          line-height: 12px;
                          color: #fff;
                          font-family: Helvetica, sans-serif;
                        "
                      >
                        © 2024 Identable.
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>`;

module.exports = {
  RESET_PASSWORD_TEMPLATE,
};
