import { config } from "../utils/config.js";
import { errorHandler } from "../utils/error.js";
import { findRoleByName } from "./role.service.js";
import { getAllSystemUsers } from "./user.service.js";
import nodemailer from "nodemailer";

const configuration = {
  port: 2525,
  host: "live.smtp.mailtrap.io",
  auth: {
    user: "api",
    pass: "dada6f4521e75793d15ed3662d4efbe0",
  },
};
const transporter = nodemailer.createTransport(configuration);

export const notifyAdmins = async (email) => {
  try {
    const role = await findRoleByName("admin");
    const users = await getAllSystemUsers({ isDeleted: false });
    const admins = users.map((admin) => admin.role === role._id);
    const adminEmails = admins.map((admin) => email);
    console.log(adminEmails);
    // const mailBody = {
    //   from: process.env.SMT_EMAIL,
    //   to: Array.isArray(adminEmails) ? adminEmails : [adminEmails],
    //   subject: email.subject,
    //   text: email.text,
    //   html: `<h2>New Registration s</h2>
    //   <br></br>
    //   <p>A new user has been created!</p>
    //   <br></br>
    //   <br></br>
    //   <p>Best Regards</p>
    //   `,
    // };
    // const msg = await transporter.sendMail(mailBody);
    // console.log("Email send", msg.messageId);
  } catch (error) {
    throw new Error("error: could  not notify admins");
  }
};

export const notifyUser = async (mailOptions) => {
  try {
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email sent:" + info.response);
      }
    });
  } catch (error) {
    throw new Error("could not notify user");
  }
};

export const sendResetEmail = async (toEmail, subject, body) => {
  try {
    const message = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: toEmail,
      subject,
      html: body,
    });
    console.log("Email sent", message.info);
  } catch (error) {
    throw errorHandler(400, error.message);
  }
};
