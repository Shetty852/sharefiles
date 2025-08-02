import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  const { email, fileUrl, code } = req.body;

  if (!email || !fileUrl || !code) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER, // Fixed: was using OUTLOOK_USER
      to: email,
      subject: "You've received a file from ShareFiles!",
      html: `
        <h3>File Shared with You via ShareFiles</h3>
        <p><strong>Download Code:</strong> ${code}</p>
        <p><a href="${fileUrl}" target="_blank">Click here to download</a></p>
        <p>This file will expire in 5 minutes for security.</p>
        <br>
        <p style="color: #666; font-size: 12px;">Sent via ShareFiles - Secure File Sharing</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("Error sending email:", error.message, error.response?.body || error);

    res.status(500).json({ message: "Email failed to send" });
  }
};
