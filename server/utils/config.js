export const config = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    PASS: process.env.SMTP_PASS,
  },
};
