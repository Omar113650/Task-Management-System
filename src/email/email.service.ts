import nodemailer from "nodemailer";

interface SendEmailProps {
  to: string;
  subject?: string;
  html?: string;
  otp?: string;
  title?: string;
  body?: string;
}

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_EMAIL_ADDRESS,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
      secure: true,
    });
  }

  async sendEmail({ to, subject, html }: SendEmailProps) {
    await this.transporter.sendMail({
      from: `"Task Management System" <${process.env.APP_EMAIL_ADDRESS}>`,
      to,
      subject,
      html,
    });
  }

  // otp-email
  async sendOtpEmail({ to, subject, otp }: SendEmailProps) {
    console.log(` Sending OTP email to: ${to}`);

    const htmlContent = `
      <div style="font-family: Arial; background:#0b0b14; padding:40px 0;">
        <div style="
          max-width:600px;
          margin:auto;
          background:#0e0e1a;
          padding:40px;
          border-radius:16px;
          border:1px solid #1e1e2e;
          box-shadow:0 24px 80px rgba(0,0,0,.5);
          text-align:center;
        ">

          <h1 style="
            background:linear-gradient(90deg,#f0c96b,#c9973a);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            font-size:28px;
            margin-bottom:10px;
          ">
             Task Management System Verification
          </h1>

          <p style="color:#8a8498;font-size:14px;">
            Use the OTP below to verify your account
          </p>

          <div style="
            margin:30px 0;
            font-size:34px;
            font-weight:bold;
            letter-spacing:10px;
            background:#08080f;
            color:#f0c96b;
            padding:18px;
            border-radius:12px;
            border:1px solid #c9973a44;
            font-family:monospace;
          ">
            ${otp}
          </div>

          <p style="color:#6b6478;font-size:12px;">
            This code expires in 10 minutes
          </p>

          <p style="color:#3a3650;font-size:11px;margin-top:20px;">
            © ${new Date().getFullYear()} Task Management System. All rights reserved.
          </p>

        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: subject || "Task Management System OTP Verification",
      html: htmlContent,
    });
  }

  //  success otp
  async sendOtpSuccessEmail({ to }: SendEmailProps) {
    console.log(` Sending OTP Success email to: ${to}`);

    const htmlContent = `
      <div style="font-family: Arial; background:#0b0b14; padding:40px 0;">
        <div style="
          max-width:600px;
          margin:auto;
          background:#0e0e1a;
          padding:40px;
          border-radius:16px;
          border:1px solid #1e1e2e;
          text-align:center;
        ">

          <h1 style="color:#f0c96b;font-size:26px;">
             Verified Successfully
          </h1>

          <p style="color:#8a8498;font-size:14px;">
            Your Task Management System account has been verified successfully.
          </p>

        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: "Task Management System - Verification Successful",
      html: htmlContent,
    });
  }

  //  welcome
  async sendWelcomeAfterLogin({ to, subject }: SendEmailProps) {
    console.log(` Sending Welcome email to: ${to}`);

    const htmlContent = `
      <div style="font-family: Arial; background:#0b0b14; padding:40px 0;">
        <div style="
          max-width:600px;
          margin:auto;
          background:#0e0e1a;
          padding:40px;
          border-radius:16px;
          border:1px solid #1e1e2e;
          text-align:center;
        ">

          <h1 style="
            background:linear-gradient(90deg,#f0c96b,#c9973a);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            font-size:28px;
          ">
             Welcome Back to Task Management System
          </h1>

          <p style="color:#8a8498;font-size:14px;">
            You have successfully logged in
          </p>

        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: subject || "Task Management System Login Notification",
      html: htmlContent,
    });
  }

  //  RESET PASSWORD
  async sendResetPasswordEmail(to: string, link: string) {
    console.log(`Sending Reset Password email to: ${to}`);

    const htmlContent = `
      <div style="font-family: Arial; background:#0b0b14; padding:40px 0;">
        <div style="
          max-width:600px;
          margin:auto;
          background:#0e0e1a;
          padding:40px;
          border-radius:16px;
          border:1px solid #1e1e2e;
          text-align:center;
        ">

          <h1 style="color:#f0c96b;font-size:26px;">
             Reset Password
          </h1>

          <p style="color:#8a8498;font-size:14px;">
            Click below to reset your password
          </p>

          <a href="${link}" style="
            display:inline-block;
            margin-top:20px;
            padding:14px 28px;
            background:linear-gradient(90deg,#f0c96b,#c9973a);
            color:#0b0b14;
            border-radius:10px;
            text-decoration:none;
            font-weight:bold;
          ">
            Reset Password
          </a>

          <p style="color:#3a3650;font-size:11px;margin-top:25px;">
            © ${new Date().getFullYear()} Task Management System
          </p>

        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: "Task Management System - Reset Password",
      html: htmlContent,
    });
  }
}

export { EmailService };
export default new EmailService();
