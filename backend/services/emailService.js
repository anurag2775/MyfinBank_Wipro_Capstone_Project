const nodemailer = require("nodemailer");

const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

exports.sendZeroBalanceEmail = async (user) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Send to Admin
      subject: "Bank Alert - Zero Balance",
      text: `Customer Alert!\n\nCustomer ${user.name} (Email: ${user.email}) has reached a zero balance.\n\nPlease review the account.\n\nRegards,\nMyFinBank System`,
    };

    await getTransporter().sendMail(mailOptions);
    console.log(`Zero balance alert sent to ${process.env.ADMIN_EMAIL} for user ${user.email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

exports.sendTransferNotificationEmail = async (sender, receiver, amount) => {
  try {
    // Email to Sender
    await getTransporter().sendMail({
      from: process.env.EMAIL_USER,
      to: sender.email,
      subject: "Transaction Successful: Money Sent",
      html: `<p>Hello ${sender.name},</p><p>You have successfully sent <b>₹${amount}</b> to ${receiver.name} (${receiver.email}).</p>`,
    });

    // Email to Receiver
    await getTransporter().sendMail({
      from: process.env.EMAIL_USER,
      to: receiver.email,
      subject: "Transaction Successful: Money Received",
      html: `<p>Hello ${receiver.name},</p><p>You have received <b>₹${amount}</b> from ${sender.name} (${sender.email}).</p>`,
    });

    console.log(`Transfer emails sent for transaction of ₹${amount}`);
  } catch (error) {
    console.error("Error sending transfer emails:", error);
  }
};
