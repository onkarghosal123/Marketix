// Welcome Email Template
export const createWelcomeEmailTemplate = (name, frontendUrl) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to Marketix</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f1f5f9; font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 12px;">
            <tr>
                <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0"
                        style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden;">

                        <tr>
                            <td align="center" style="background:#2563eb; padding:30px 20px;">
                                <h1 style="margin:0; color:#ffffff; font-size:30px;">
                                    Marketix
                                </h1>
                                <p style="margin:10px 0 0; color:#dbeafe; font-size:15px;">
                                    Everything you need, all in one place.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:35px 30px; color:#334155;">
                                <h2 style="margin-top:0; color:#0f172a;">
                                    Welcome to Marketix, ${escapeHtml(name)}! 🎉
                                </h2>

                                <p style="font-size:16px; line-height:1.7;">
                                    Thank you for joining Marketix. Your account has
                                    been created successfully, and you're ready to
                                    explore our marketplace.
                                </p>

                                <p style="font-size:16px; line-height:1.7;">
                                    Discover products, compare prices, add your
                                    favorites to your cart, and enjoy a convenient
                                    shopping experience.
                                </p>

                                <table cellpadding="0" cellspacing="0" style="margin:28px auto;">
                                    <tr>
                                        <td align="center" style="background:#2563eb; border-radius:8px;">
                                            <a href="${escapeHtml(frontendUrl)}"
                                                style="display:inline-block; padding:14px 28px;
                                                color:#ffffff; text-decoration:none; font-weight:bold;">
                                                Start Shopping
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="font-size:14px; line-height:1.6; color:#64748b;">
                                    If you didn't create this account, please contact
                                    our support team.
                                </p>

                                <p style="margin-bottom:0; font-size:15px;">
                                    Happy Shopping!<br />
                                    <strong>Team Marketix</strong>
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="background:#f8fafc; padding:20px; color:#94a3b8; font-size:12px;">
                                &copy; ${new Date().getFullYear()} Marketix. All rights reserved.
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};


// OTP Email Template
export const otpEmailTemplate = (otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Marketix OTP Verification</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f1f5f9; font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 12px;">
            <tr>
                <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0"
                        style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden;">

                        <tr>
                            <td align="center" style="background:#2563eb; padding:30px 20px;">
                                <h1 style="margin:0; color:#ffffff; font-size:30px;">
                                    Marketix
                                </h1>
                                <p style="margin:10px 0 0; color:#dbeafe; font-size:15px;">
                                    Secure Account Verification
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:35px 30px; color:#334155;">
                                <h2 style="margin-top:0; color:#0f172a;">
                                    Verify Your Email
                                </h2>

                                <p style="font-size:16px; line-height:1.7;">
                                    Use the One-Time Password (OTP) below to verify
                                    your email address and continue with Marketix.
                                </p>

                                <table width="100%" cellpadding="0" cellspacing="0" style="margin:25px 0;">
                                    <tr>
                                        <td align="center"
                                            style="background:#eff6ff; border:1px dashed #93c5fd;
                                            border-radius:10px; padding:22px;">
                                            <span style="font-size:32px; font-weight:bold;
                                                letter-spacing:8px; color:#1d4ed8;">
                                                ${escapeHtml(otp)}
                                            </span>
                                        </td>
                                    </tr>
                                </table>

                                <p style="font-size:15px; line-height:1.7;">
                                    This OTP is valid for <strong>5 minutes</strong>.
                                    For your security, do not share it with anyone.
                                </p>

                                <p style="font-size:14px; line-height:1.6; color:#64748b;">
                                    If you did not request this code, you can safely
                                    ignore this email.
                                </p>

                                <p style="margin-bottom:0; font-size:15px;">
                                    Best regards,<br />
                                    <strong>Team Marketix</strong>
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="background:#f8fafc; padding:20px; color:#94a3b8; font-size:12px;">
                                &copy; ${new Date().getFullYear()} Marketix. All rights reserved.
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};


// Escape user-provided values before inserting them into HTML
const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
