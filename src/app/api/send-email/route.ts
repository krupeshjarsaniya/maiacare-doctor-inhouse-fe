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
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Maia Care</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #000000;
            background-color: #ffffff;
            margin: 0;
            padding: 40px 20px;
        }
        
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
        }
        
        .greeting {
            font-size: 16px;
            color: #000000;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .message {
            font-size: 16px;
            color: #000000;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        
        .email-address {
            font-weight: 600;
        }
        
        .otp-container {
            margin: 40px 0;
        }
        
        .otp-label {
            font-size: 19px;
            color: #000000;
            margin-bottom: 25px;
            line-height: 1.5;
            font-weight: bolder;
        }
        
        .otp-code {
            font-size: 48px;
            font-weight: bold;
            color: #000000;
            letter-spacing: 8px;
            padding: 20px 0;
            margin: 25px 0;
            font-family: 'Courier New', monospace;
            text-align: center;
            display: block;
        }
        
        .validity-note {
            font-size: 15px;
            margin-top: 10px;
            text-align: left;
        }
        
        .security-note {
            font-size: 15px;
            color: #d32f2f;
            margin: 35px 0;
            line-height: 1.6;
            font-weight: 500;
        }
        
        .signature {
            margin-top: 20px;
        }
        
        .signature-line {
            font-size: 16px;
            color: #000000;
            margin-bottom: 8px;
            line-height: 1.6;
        }
        
        .thank-you {
            margin-bottom: 25px;
        }
        
        .sincerely {
            margin-top: 25px;
        }
        
        .team-name {
            font-weight: 600;
        }
        
        .support-section {
        padding: 40px;
            margin-top: 45px;
            padding-top: 30px;
            border-top: 1px solid #eeeeee;
        }
        
        .support-title {
            font-size: 16px;
            color: #3E4A57;
            margin-bottom: 3px;
            line-height: 1.5;
        }
        
        .support-info {
            font-size: 15px;
            color: #3E4A57;
            margin-bottom: 2px;
            line-height: 1.6;
        }
        
        .support-email, .support-phone {
            color: #3E4A57;
            text-decoration: none;
            font-weight: 500;
        }
        
        .divider {
            height: 1px;
            background-color: #eeeeee;
            margin: 40px 0;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #eeeeee;
            color: #666666;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .footer-logo {
            font-size: 18px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 10px;
        }

        .white {
            background-color: white;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
    <div class="white">
        <div class="logo"># maia</div>
        
        <div class="greeting">Hi ${capitalizedName},</div>
        
        <div class="message">
            You recently requested to reset your password for the account associated with 
            <span class="email-address">${to}</span>
        </div>
        
        <div class="otp-container">
            <div class="otp-label">To complete the password reset process, enter the following verification code:</div>
            <div class="otp-code">${otp}</div>
            <div class="validity-note">This code is valid for 30 minutes. For your security, please do not share this code with anyone.</div>
        </div>
        
        
        <div class="signature">
            <div class="signature-line thank-you">Thank you for choosing Maia Care!</div>
            <div class="signature-line sincerely">Sincerely,</div>
            <div class="signature-line">The Maia Care Team</div>
        </div>
        </div>
        <div class="support-section">
            <div class="support-title">If you have any questions or require assistance, please don't hesitate to contact our support team:</div>
            <div class="support-info">Email: <a class="support-email" href="mailto:milkmitracare@gmail.com">milkmitracare@gmail.com</a></div>
            <div class="support-info">Phone: <a class="support-phone" href="tel:9878987987">9878987987</a></div>
        </div>
        
        
        <div class="footer">
            <div class="footer-logo"><strong>maia</strong></div>
            <div>© ${new Date().getFullYear()} Maia Care. All rights reserved.</div>
        </div>
    </div>
</body>
</html>`;

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