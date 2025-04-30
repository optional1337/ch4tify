export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Verify Your Email</title>
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
      .code {
        font-size: 24px !important;
      }
    }
  </style>
</head>

<body style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background: #0f0f0f; color: #e5e5e5; max-width: 600px; margin: 0 auto; padding: 0;">

  <!-- Header -->
  <div class="header" style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 24px; text-align: center; border-top-left-radius: 16px; border-top-right-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 12px;">
    <img src="https://yourappdomain.com/logo.png" alt="App Icon" width="36" height="36" style="border-radius: 8px;">
    <h1 style="color: white; margin: 0; font-size: 1.75em;">ch4tify</h1>
  </div>

  <!-- Content -->
  <div class="container" style="background-color: #1c1c1c; padding: 24px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
    <p style="color: #e5e5e5; margin-bottom: 12px;">Hello, {username}</p>
    <p style="color: #e5e5e5; margin-bottom: 20px;">Thank you for signing up! Your verification code is:</p>

    <div style="text-align: center; margin: 30px 0;">
      <span class="code" style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #10b981;">{verificationCode}</span>
    </div>

    <p style="color: #e5e5e5;">Enter this code on the verification page to complete your registration.</p>
    <p style="color: #e5e5e5;">This code will expire in 15 minutes for security reasons.</p>
    <p style="color: #e5e5e5;">If you didn't create an account with us, please ignore this email.</p>
    <p style="color: #e5e5e5;">Best regards,<br>Your App Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.75em; padding: 0 16px;">
    <p>This is an automated message, please do not reply.</p>
  </div>

</body>

</html>

`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Password Reset Successful</title>
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
    <img src="https://yourappdomain.com/logo.png" alt="App Icon" width="36" height="36" style="border-radius: 8px;">
    <h1 style="color: white; margin: 0; font-size: 1.75em;">ch4tify</h1>
  </div>

  <!-- Content -->
  <div class="container" style="background-color: #1c1c1c; padding: 24px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
    <p style="color: #e5e5e5; margin-bottom: 12px;">Hi {username},</p>
    <p style="color: #e5e5e5; margin-bottom: 12px;">Your password has been successfully reset 🎉</p>

    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #10b981; color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
        🔒
      </div>
    </div>

    <p style="color: #e5e5e5;">If you didn't make this change, please contact our support team immediately.</p>
    <p style="color: #e5e5e5;">In the meantime, here are a few quick security tips:</p>
    <ul style="color: #e5e5e5; padding-left: 20px;">
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication</li>
      <li>Keep your login credentials private</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://yourappdomain.com/login" style="background-color: #10b981; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Chat App</a>
    </div>

    <p style="color: #e5e5e5;">See you soon on the app! 👋</p>
    <p style="color: #e5e5e5;">Best regards,<br>Your Chat App Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.75em; padding: 0 16px;">
    <p>This is an automated message, please do not reply.</p>
  </div>

</body>

</html>

`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reset Your Password</title>
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
      .btn {
        padding: 10px 16px !important;
        font-size: 14px !important;
      }
    }
  </style>
</head>

<body style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background: #0f0f0f; color: #e5e5e5; max-width: 600px; margin: 0 auto; padding: 0;">

  <!-- Header -->
  <div class="header" style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 24px; text-align: center; border-top-left-radius: 16px; border-top-right-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 12px;">
    <img src="https://yourappdomain.com/logo.png" alt="App Icon" width="36" height="36" style="border-radius: 8px;">
    <h1 style="color: white; margin: 0; font-size: 1.75em;">ch4yify</h1>
  </div>

  <!-- Content -->
  <div class="container" style="background-color: #1c1c1c; padding: 24px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
    <p style="color: #e5e5e5; margin-bottom: 12px;">Hi there,</p>
    <p style="color: #e5e5e5; margin-bottom: 12px;">We received a request to reset your password. If this was you, click below to reset it:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" class="btn" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
    </div>

    <p style="color: #e5e5e5;">If you did not request a password reset, you can safely ignore this email.</p>
    <p style="color: #e5e5e5;">For security, this link will expire in 1 hour.</p>

    <p style="color: #e5e5e5; margin-top: 30px; text-align: center; font-size: 0.9em;">
      <a href="https://yourappdomain.com/login" style="color: #10b981; text-decoration: underline;">Go to Chat App</a>
    </p>

    <p style="color: #e5e5e5;">Stay safe and chat on! 💬</p>
    <p style="color: #e5e5e5;">Best regards,<br>Your Chat App Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.75em; padding: 0 16px;">
    <p>This is an automated message, please do not reply.</p>
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
    <img src="https://yourappdomain.com/logo.png" alt="App Icon" width="36" height="36" style="border-radius: 8px;">
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
    <p style="color: #e5e5e5;">Best regards,<br>Your App Team</p>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.75em; padding: 0 16px;">
    <p>This is an automated message, please do not reply.</p>
  </div>

</body>

</html>

`;