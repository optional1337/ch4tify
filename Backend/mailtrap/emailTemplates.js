export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Verify Your Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f5f5f5;
      color: #1f2a44;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #6ee7b7, #3b82f6);
      padding: 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
      transform: rotate(45deg);
    }
    .logo {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      vertical-align: middle;
      margin-right: 8px;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.5px;
      display: inline-block;
      vertical-align: middle;
    }
    .content {
      padding: 40px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 24px;
      color: #4b5563;
    }
    .code {
      display: inline-block;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 8px;
      padding: 16px 32px;
      background: #f0fdf4;
      color: #15803d;
      border-radius: 12px;
      margin: 32px 0;
      border: 1px solid #d1fae5;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #3b82f6;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      margin: 16px 0;
      transition: background 0.3s ease;
    }
    .button:hover {
      background: #2563eb;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      border-top: 1px solid #e5e7eb;
    }
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px;
        border-radius: 16px;
      }
      .header {
        padding: 24px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 24px;
      }
      .code {
        font-size: 24px;
        letter-spacing: 4px;
        padding: 12px 24px;
      }
      .button {
        padding: 10px 20px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://ch4tify.club/logo.png" alt="ch4tify Logo" class="logo">
      <h1>ch4tify</h1>
    </div>
    <div class="content">
      <p>Hi <strong>{username}</strong>,</p>
      <p>Welcome to <strong>ch4tify</strong>! We're thrilled to have you on board. Please verify your email address using the code below:</p>
      <div class="code">{verificationCode}</div>
      <p>This code is valid for <strong>15 minutes</strong>. Alternatively, you can click the button below to verify directly:</p>
      <a href="https://ch4tify.club/verify-email" class="button">Verify Email Now</a>
      <p>If you didn’t sign up, feel free to ignore this email.</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply.</p>
      <p>&copy; 2025 ch4tify. All rights reserved.</p>
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
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f4f7fa;
      color: #1f2a44;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
    .header {
      background: linear-gradient(135deg, #5eead4, #3b82f6);
      padding: 48px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.25), transparent);
      transform: rotate(30deg);
    }
    .logo {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      vertical-align: middle;
      margin-right: 10px;
      transition: transform 0.3s ease;
    }
    .logo:hover {
      transform: scale(1.1);
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 0.5px;
      display: inline-block;
      vertical-align: middle;
    }
    .content {
      padding: 48px;
      text-align: center;
    }
    .content p {
      font-size: 17px;
      line-height: 1.7;
      margin: 0 0 28px;
      color: #4b5563;
    }
    .icon {
      background-color: #ecfdf5;
      color: #047857;
      width: 64px;
      height: 64px;
      line-height: 64px;
      border-radius: 50%;
      font-size: 32px;
      margin: 32px auto;
      border: 1px solid #a7f3d0;
      animation: scaleIn 0.5s ease;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      color: #ffffff;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 16px;
      margin: 16px 0;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
    .tips {
      text-align: left;
      font-size: 15px;
      color: #4b5563;
      margin: 0 0 28px;
      padding-left: 0;
      list-style: none;
    }
    .tips li {
      margin-bottom: 12px;
      position: relative;
      padding-left: 28px;
    }
    .tips li::before {
      content: '✔';
      color: #047857;
      position: absolute;
      left: 0;
      font-size: 16px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 28px;
      text-align: center;
      color: #6b7280;
      font-size: 13px;
      border-top: 1px solid #e5e7eb;
    }
    @keyframes scaleIn {
      from { transform: scale(0.5); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px;
        border-radius: 16px;
      }
      .header {
        padding: 28px;
      }
      .header h1 {
        font-size: 26px;
      }
      .content {
        padding: 28px;
      }
      .icon {
        width: 52px;
        height: 52px;
        line-height: 52px;
        font-size: 28px;
      }
      .button {
        padding: 12px 20px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://ch4tify.club/logo.png" alt="ch4tify Logo" class="logo">
      <h1>ch4tify</h1>
    </div>
    <div class="content">
      <p>Hi <strong>{username}</strong>,</p>
      <p>Your password has been <strong>successfully reset</strong> 🎉</p>
      <div class="icon">🔒</div>
      <p>If you didn’t make this change, please contact our support team immediately.</p>
      <p>Here are a few quick security tips:</p>
      <ul class="tips">
        <li>Use a strong, unique password</li>
        <li>Enable two-factor authentication</li>
        <li>Keep your login credentials private</li>
      </ul>
      <a href="https://ch4tify.club/login" class="button">Go to ch4tify</a>
      <p>See you soon on the app! 👋</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply.</p>
      <p>© 2025 ch4tify. All rights reserved.</p>
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
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f5f5f5;
      color: #1f2a44;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #6ee7b7, #3b82f6);
      padding: 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
      transform: rotate(45deg);
    }
    .logo {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      vertical-align: middle;
      margin-right: 8px;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.5px;
      display: inline-block;
      vertical-align: middle;
    }
    .content {
      padding: 40px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 24px;
      color: #4b5563;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #3b82f6;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      margin: 16px 0;
      transition: background 0.3s ease;
    }
    .button:hover {
      background: #2563eb;
    }
    .link {
      color: #3b82f6;
      text-decoration: underline;
      font-size: 16px;
    }
    .link:hover {
      color: #2563eb;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      border-top: 1px solid #e5e7eb;
    }
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px;
        border-radius: 16px;
      }
      .header {
        padding: 24px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 24px;
      }
      .button {
        padding: 10px 20px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://ch4tify.club/logo.png" alt="ch4tify Logo" class="logo">
      <h1>ch4tify</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>We received a request to reset your password. If this was you, click the button below to reset it:</p>
      <a href="{resetURL}" class="button">Reset Password</a>
      <p>For security reasons, this link will expire in 1 hour.</p>
      <p>If you didn’t request a password reset, no action is needed — you can safely ignore this email.</p>
      <p><a href="https://ch4tify.club/login" class="link">Go to ch4tify</a></p>
      <p>Stay safe and chat on! 💬</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply.</p>
      <p>© 2025 ch4tify. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Welcome to ch4tify</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f4f7fa;
      color: #1f2a44;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
    .header {
      background: linear-gradient(135deg, #5eead4, #3b82f6);
      padding: 48px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.25), transparent);
      transform: rotate(30deg);
    }
    .logo {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      vertical-align: middle;
      margin-right: 10px;
      transition: transform 0.3s ease;
    }
    .logo:hover {
      transform: scale(1.1);
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 0.5px;
      display: inline-block;
      vertical-align: middle;
    }
    .content {
      padding: 48px;
      text-align: center;
    }
    .content h2 {
      color: #047857;
      font-size: 26px;
      margin: 0 0 28px;
      font-weight: 600;
      animation: fadeIn 1s ease-in;
    }
    .content p {
      font-size: 17px;
      line-height: 1.7;
      margin: 0 0 28px;
      color: #4b5563;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      color: #ffffff;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 16px;
      margin: 16px 0;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
    .footer {
      background-color: #f9fafb;
      padding: 28px;
      text-align: center;
      color: #6b7280;
      font-size: 13px;
      border-top: 1px solid #e5e7eb;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media only screen and (max-width: 480px) {
      .container {
        margin: 20px;
        border-radius: 16px;
      }
      .header {
        padding: 28px;
      }
      .header h1 {
        font-size: 26px;
      }
      .content {
        padding: 28px;
      }
      .content h2 {
        font-size: 22px;
      }
      .button {
        padding: 12px 20px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://ch4tify.club/logo.png" alt="ch4tify Logo" class="logo">
      <h1>ch4tify</h1>
    </div>
    <div class="content">
      <h2>Welcome aboard!</h2>
      <p>Hello <strong>{userName}</strong>,</p>
      <p>We're thrilled to have you join <strong>ch4tify</strong>! Dive in and start chatting in real-time with your friends and groups.</p>
      <a href="https://ch4tify.club/home" class="button">Get Started</a>
      <p>Need help or have questions? Feel free to reach out to our support team anytime.</p>
      <p>Happy chatting! 🚀</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply.</p>
      <p>© 2025 ch4tify. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
