// import { NextRequest, NextResponse } from 'next/server';
// import Email from 'email-templates';
// import path from 'path';
// import fs from 'fs';

// export async function POST(request: NextRequest) {
//     try {
//         const { to, otp } = await request.json();

//         console.log('=== Sending Reset Password Email ===');
//         console.log('To:', to);
//         console.log('OTP:', otp);

//         // Check if PUG template files exist
//         const templateDir = path.join(process.cwd(), 'emails', 'reset-password');
//         const htmlFile = path.join(templateDir, 'html.pug');

//         console.log('📁 Template directory:', templateDir);
//         console.log('✅ HTML file exists:', fs.existsSync(htmlFile));

//         // Configure email client WITHOUT preview
//         const emailClient = new Email({
//             message: {
//                 from: process.env.EMAIL_FROM || 'Maia Care <noreply@maiacare.com>',
//             },
//             views: {
//                 root: path.join(process.cwd(), 'emails'),
//                 options: {
//                     extension: 'pug',
//                 },
//             },
//             // DISABLE PREVIEW COMPLETELY
//             preview: false,
//             // Always send emails
//             send: true,
//             transport: {
//                 host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//                 port: parseInt(process.env.EMAIL_PORT || '587'),
//                 secure: process.env.EMAIL_SECURE === 'true',
//                 auth: {
//                     user: process.env.EMAIL_USER,
//                     pass: process.env.EMAIL_PASSWORD,
//                 },
//             },
//         });

//         // Extract name from email
//         const name = to.split('@')[0];
//         const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

//         console.log('📧 Sending email...');

//         // Send email
//         await emailClient.send({
//             template: 'reset-password',
//             message: {
//                 to: to,
//                 subject: 'Reset Your Password - Maia Care',
//             },
//             locals: {
//                 email: to,
//                 name: capitalizedName,
//                 otp: otp,
//                 appName: 'Maia Care',
//                 supportEmail: 'milkmitracare@gmail.com',
//                 supportPhone: '8878987987',
//                 year: new Date().getFullYear(),
//             },
//         });

//         console.log('✅ Email sent successfully!');

//         return NextResponse.json({
//             success: true,
//             message: 'Email sent successfully'
//         });

//     } catch (error: any) {
//         console.error('❌ Email sending error:', error.message);
//         console.error('Full error:', error);

//         return NextResponse.json(
//             {
//                 success: false,
//                 error: 'Failed to send email',
//                 details: error.message
//             },
//             { status: 500 }
//         );
//     }
// }

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const { to, otp } = await request.json();

        console.log('=== SENDING RESET PASSWORD EMAIL ===');
        console.log('To:', to);
        console.log('OTP:', otp);

        // Extract name from email
        const name = to.split('@')[0];
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            debug: true,
            logger: true,
        });

        // HTML template matching your screenshot EXACTLY
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset - Maia Care</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      color: #000000;
    }

    table {
      border-spacing: 0;
      border-collapse: collapse;
    }

    .container {
      max-width: 600px;
      background-color: #ffffff;
      border-radius: 6px;
    }

    .content {
      padding: 40px;
    }

    .logo {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 30px;
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 15px;
    }

    .greeting,
    .message {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .email-address {
      font-weight: 600;
    }

    .otp-label {
      font-size: 17px;
      font-weight: 600;
      margin-top: 30px;
    }

    .otp-code {
      font-size: 42px;
      font-weight: bold;
      letter-spacing: 6px;
      text-align: center;
      margin: 25px 0;
      font-family: 'Courier New', monospace;
    }

    .validity-note {
      font-size: 14px;
    }

    .signature {
      margin-top: 30px;
    }

    .support {
      padding: 30px 40px;
      border-top: 1px solid #eeeeee;
      font-size: 14px;
      color: #3E4A57;
    }

    .footer {
      text-align: center;
      padding: 25px;
      font-size: 13px;
      color: #666666;
      border-top: 1px solid #eeeeee;
    }
  </style>
</head>
<body>

<table width="100%" bgcolor="#f7f7f7">
  <tr>
    <td align="center" style="padding:40px 20px;">

    <div style="background-color: #f8f9fc;padding: 50px 25px;max-width:600px;">
        <table width="100%" bgcolor="#f8f9fc" style="max-width:600px;">
  <tr>
    <td style="padding-bottom:15px;">
      <img
        src="https://maiacare.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogodark.21a425dc.png&w=256&q=75"
        alt="Maia Care"
        width="150"
      />
    </td>
  </tr>
</table>

      <table width="600" align="center" bgcolor="#ffffff" style="max-width:600px;">
        
        <!-- MAIN CONTENT -->
        <tr>
          <td style="padding:40px;">

            <p>Hi ${capitalizedName},</p>

            <p>
              You recently requested to reset your password for the account associated with
              <strong>${to}</strong>
            </p>

            <p style="font-weight:600;">
              To complete the password reset process, enter the following verification code:
            </p>

            <div style="font-size:42px;font-weight:bold;letter-spacing:6px;text-align:center;margin:25px 0;font-family:Courier New, monospace;">
              ${otp}
            </div>

            <p style="font-size:14px;">
              This code is valid for 30 minutes. For your security, please do not share this code with anyone.
            </p>

            <p style="margin-top:30px;">
              Thank you for choosing Maia Care!<br/>
              Sincerely,<br/>
              <strong>The Maia Care Team</strong>
            </p>

          </td>
        </tr>

        

      </table>
       <table width="100%" align="center" bgcolor="#f8f9fc" style="max-width:600px;">
        <!-- SUPPORT -->
        <tr>
          <td style="padding:0px 40px;font-size:14px;color:#3E4A57;max-width:600px;color: #3E4A57;">
            <p>If you have any questions or require assistance, please don't hesitate to contact our support team:</p>
            <p>Email: <a href="mailto:milkmitracare@gmail.com" style="color:#3E4A57;text-decoration: none;">milkmitracare@gmail.com</a></p>
            <p>Phone: <a href="tel:9878987987" style="color:#3E4A57;text-decoration: none;">9878987987</a></p>
          </td>
        </tr>

        <!-- FOOTER -->
         <tr>
  <td style="padding:20px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <!-- LEFT: LOGO -->
        <td align="left" valign="middle">
          <img
            src="https://maiacare.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogodark.21a425dc.png&w=256&q=75"
            alt="Maia Care"
            width="70"
            style="display:block;border:0;outline:none;text-decoration:none;opacity: 0.3;"
          />
        </td>

        <!-- RIGHT: SOCIAL ICONS -->
        <td align="right" valign="middle">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-left:10px;">
                <a href="https://twitter.com">
                  <img
                    src="https://download.logo.wine/logo/Twitter/Twitter-Logo.wine.png"
                    width="30"
                    alt="Twitter"
                    style="display:block;border:0;opacity:0.25;"
                  />
                </a>
              </td>
              <td style="padding-left:10px;">
                <a href="https://facebook.com">
                  <img
                    src="https://cdn.prod.website-files.com/63c5640295a3b83ae7861a3c/645800e19178cb167e405da0_Facebook-logo.png"
                    width="30"
                    alt="Facebook"
                    style="display:block;border:0;opacity:0.25;"
                  />
                </a>
              </td>
              <td style="padding-left:10px;">
                <a href="https://linkedin.com">
                  <img
                    src="https://play-lh.googleusercontent.com/kMofEFLjobZy_bCuaiDogzBcUT-dz3BBbOrIEjJ-hqOabjK8ieuevGe6wlTD15QzOqw=s256-rw"
                    width="18"
                    alt="LinkedIn"
                    style="display:block;border:0;opacity:0.25;"
                  />
                </a>
              </td>
            </tr>
        </table>
    </div>
      
    </td>
  </tr>
</table>

</body>
</html>

`;

        // Plain text version matching your screenshot
        const textContent = `# maia

Hi ${capitalizedName},

You recently requested to reset your password for the account associated with ${to}

To complete the password reset process, enter the following verification code:

${otp}

This code is valid for 30 minutes. For your security, please do not share this code with anyone.

Thank you for choosing Maia Care!

Sincerely,

The Maia Care Team

If you have any questions or require assistance, please don't hesitate to contact our support team:
Email: milkmitracare@gmail.com
Phone: 9878987987

---

**maia**`;

        // Send email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'Maia Care <noreply@maiacare.com>',
            to: to,
            subject: 'Reset Your Password - Maia Care',
            html: htmlContent,
            text: textContent,
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId
        });

    } catch (error: any) {
        console.error('❌ EMAIL SENDING ERROR ===');
        console.error('Error:', error.message);
        console.error('Code:', error.code);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to send email',
                details: error.message
            },
            { status: 500 }
        );
    }
}