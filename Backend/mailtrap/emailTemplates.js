export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Verify Your Email</title>
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        padding: 16px !important;
      }
      .header {
        flex-direction: column !important;
        gap: 12px !important;
        padding: 24px !important;
      }
      .logo {
        width: 36px !important;
        height: 36px !important;
      }
      .code {
        font-size: 24px !important;
      }
    }
  </style>
</head>

<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #0f0f0f; color: #e5e5e5;">

  <!-- Container -->
  <div style="max-width: 600px; margin: 40px auto; background-color: #1c1c1c; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">

    <!-- Header -->
    <div class="header" style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 32px; display: flex; align-items: center; justify-content: center; gap: 16px;">
      <img src="https://ch4tify.club/logo.png" alt="ch4tify Logo" width="40" height="40" class="logo" style="border-radius: 8px;">
      <h1 style="margin: 0; color: #fff; font-size: 24px; letter-spacing: 1px;">ch4tify</h1>
    </div>

    <!-- Content -->
    <div class="container" style="padding: 32px;">
      <p style="font-size: 16px; margin-bottom: 12px;">Hi <strong>{username}</strong>,</p>

      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
        Thank you for signing up to <strong>ch4tify</strong>! To verify your email address, please use the following verification code:
      </p>

      <div style="text-align: center; margin: 40px 0;">
        <span class="code" style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 6px; padding: 16px 24px; background: #0f0f0f; color: #10b981; border: 2px solid #10b981; border-radius: 8px;">
          {verificationCode}
        </span>
      </div>

      <p style="font-size: 14px; line-height: 1.5; color: #ccc;">
        This code is valid for <strong>15 minutes</strong>. If you did not create an account, please disregard this message.
      </p>

      <p style="margin-top: 32px; font-size: 14px;">
        Best regards,<br>
        <strong>ch4tify Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #111; padding: 20px; text-align: center; color: #777; font-size: 12px;">
      <p style="margin: 0;">This is an automated email. Please do not reply.</p>
    </div>

  </div>

</body>

</html>
`;


export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Password Reset Successful</title>
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        padding: 16px !important;
      }
      .header {
        flex-direction: column !important;
        gap: 12px !important;
        padding: 24px !important;
      }
      .logo {
        width: 36px !important;
        height: 36px !important;
      }
    }
  </style>
</head>

<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #0f0f0f; color: #e5e5e5;">

  <!-- Container -->
  <div style="max-width: 600px; margin: 40px auto; background-color: #1c1c1c; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">

    <!-- Header -->
    <div class="header" style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 32px; display: flex; align-items: center; justify-content: center; gap: 16px;">
      <img src="https://ch4tify.club/logo.png" alt="ch4tify Logo" width="40" height="40" class="logo" style="border-radius: 8px;">
      <h1 style="margin: 0; color: #fff; font-size: 24px; letter-spacing: 1px;">ch4tify</h1>
    </div>

    <!-- Content -->
    <div class="container" style="padding: 32px;">
      <p style="font-size: 16px; margin-bottom: 12px;">Hi <strong>{username}</strong>,</p>

      <p style="font-size: 15px; margin-bottom: 20px;">
        Your password has been <strong>successfully reset</strong> 🎉
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #10b981; color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; font-size: 28px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
          🔒
        </div>
      </div>

      <p style="font-size: 14px; color: #ccc; margin-bottom: 16px;">
        If you didn't make this change, please contact our support team immediately.
      </p>

      <p style="font-size: 14px; color: #ccc; margin-bottom: 8px;">
        In the meantime, here are a few quick security tips:
      </p>

      <ul style="color: #e5e5e5; padding-left: 20px; margin-bottom: 24px;">
        <li>Use a strong, unique password</li>
        <li>Enable two-factor authentication</li>
        <li>Keep your login credentials private</li>
      </ul>

      <div style="text-align: center; margin: 40px 0;">
        <a href="https://ch4tify.club/login" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Go to ch4tify</a>
      </div>

      <p style="font-size: 14px;">See you soon on the app! 👋</p>

      <p style="margin-top: 32px; font-size: 14px;">
        Best regards,<br />
        <strong>ch4tify Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #111; padding: 20px; text-align: center; color: #777; font-size: 12px;">
      <p style="margin: 0;">This is an automated message. Please do not reply.</p>
    </div>

  </div>

</body>

</html>
`;


export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset Your Password</title>
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        padding: 16px !important;
      }
      .header {
        flex-direction: column !important;
        gap: 12px !important;
        padding: 24px !important;
      }
      .logo {
        width: 36px !important;
        height: 36px !important;
      }
      .btn {
        padding: 10px 16px !important;
        font-size: 14px !important;
      }
    }
  </style>
</head>

<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #0f0f0f; color: #e5e5e5;">

  <!-- Container -->
  <div style="max-width: 600px; margin: 40px auto; background-color: #1c1c1c; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">

    <!-- Header -->
    <div class="header" style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 32px; display: flex; align-items: center; justify-content: center; gap: 16px;">
      <img src="https://ch4tify.club/logo.png" alt="ch4tify Logo" width="40" height="40" class="logo" style="border-radius: 8px;">
      <h1 style="margin: 0; color: #fff; font-size: 24px;">ch4tify</h1>
    </div>

    <!-- Content -->
    <div class="container" style="padding: 32px;">
      <p style="font-size: 16px; margin-bottom: 12px;">Hi there,</p>

      <p style="font-size: 15px; margin-bottom: 16px;">
        We received a request to reset your password. If this was you, click the button below to reset it:
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="{resetURL}" class="btn" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>

      <p style="font-size: 14px; color: #ccc;">
        If you did not request a password reset, no action is needed — you can safely ignore this email.
      </p>

      <p style="font-size: 14px; color: #ccc;">
        For security reasons, this link will expire in 1 hour.
      </p>

      <p style="text-align: center; margin-top: 32px;">
        <a href="https://ch4tify.club/login" style="color: #10b981; text-decoration: underline; font-size: 14px;">Go to ch4tify</a>
      </p>

      <p style="font-size: 14px; margin-top: 24px;">Stay safe and chat on! 💬</p>

      <p style="margin-top: 32px; font-size: 14px;">
        Best regards,<br />
        <strong>ch4tify Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #111; padding: 20px; text-align: center; color: #777; font-size: 12px;">
      <p style="margin: 0;">This is an automated message. Please do not reply.</p>
    </div>

  </div>

</body>

</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to Your App</title>
  <style>
    @media only screen and (max-width: 480px) {
      .container {
        padding: 16px !important;
      }
      .header {
        padding: 16px !important;
        flex-direction: column !important;
        gap: 8px !important;
      }
      .header img {
        width: 32px !important;
        height: 32px !important;
      }
    }
  </style>
</head>

<body style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background: #0f0f0f; color: #e5e5e5; max-width: 600px; margin: 0 auto; padding: 0;">

  <!-- Header -->
  <div class="header" style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 24px; text-align: center; border-top-left-radius: 16px; border-top-right-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 12px;">
    <img src="https://ch4tify.club/logo.png" alt="App Icon" width="36" height="36" style="border-radius: 8px;">
    <h1 style="color: white; margin: 0; font-size: 1.75em;">ch4tify</h1>
  </div>

  <!-- Content -->
  <div class="container" style="background-color: #1c1c1c; padding: 24px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
    <h2 style="color: #10b981;">Welcome aboard!</h2>
    <p style="color: #e5e5e5;">Hello {userName},</p>
    <p style="color: #e5e5e5;">We're excited to have you join <strong>Your App</strong>! Start connecting and chatting with people in real time.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{appLink}" style="background-color: #10b981; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
    </div>

    <p style="color: #e5e5e5;">If you have any questions or need help, feel free to reach out to our support team.</p>
    <p style="color: #e5e5e5;">Happy chatting! 🚀</p>
    <p style="color: #e5e5e5;">Best regards,<br>ch4tify Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.75em; padding: 0 16px;">
    <p>This is an automated message, please do not reply.</p>
  </div>

</body>

</html>

`;