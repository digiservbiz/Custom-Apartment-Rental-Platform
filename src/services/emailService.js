// Mock Email Service

const sendEmail = async (to, subject, text) => {
  console.log(`Sending email to ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
  // In a real application, this would interact with an email service like SendGrid or Mailgun
  return { success: true };
};

module.exports = {
  sendEmail,
};
