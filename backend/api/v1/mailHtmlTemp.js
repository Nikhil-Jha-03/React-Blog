export default function htmlTemp({ name, type, otp }) {
  let headerText = "";
  let bodyContent = "";

  if (type === "welcome") {
    headerText = `Welcome to React-Blog, ${name}!`;
    bodyContent = `
      <p>Hi ${name},</p>
      <p>Thank you for joining <strong>React-Blog</strong>. We're thrilled to have you onboard!</p>
      <p>Here, you can read, write, and share amazing content with a vibrant community of developers and enthusiasts.</p>
      <a href="https://your-website.com" class="button">Get Started</a>
    `;
  } else if (type === "otp") {
    headerText = `Verify your account, ${name}`;
    bodyContent = `
      <p>Hi ${name},</p>
      <p>Your One-Time Password (OTP) is:</p>
      <h2 style="color:#4CAF50; text-align:center;">${otp}</h2>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
    `;
  }

  return (`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${type === "welcome" ? "Welcome Email" : "OTP Verification"}</title>
  <style>
    body {
      font-family: 'Helvetica', Arial, sans-serif;
      background-color: #f4f4f7;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background-color: #4CAF50;
      color: white;
      text-align: center;
      padding: 30px 20px;
      font-size: 24px;
      font-weight: bold;
    }
    .body {
      padding: 30px 20px;
      line-height: 1.6;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 5px;
      margin-top: 20px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #999;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${headerText}
    </div>
    <div class="body">
      ${bodyContent}
    </div>
    <div class="footer">
      © 2025 React-Blog. All rights reserved.
    </div>
  </div>
</body>
</html>`);
}
