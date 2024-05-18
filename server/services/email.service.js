import { config } from "../utils/config.js";
import { findRoleByName } from "./role.service.js";
import { getAllSystemUsers } from "./user.service.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport(config);

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

export const notifyUser = async (email) => {
  try {
    const msg = await transporter.sendMail(email);
    console.log("Email send", msg.messageId);
    return msg;
  } catch (error) {
    throw new Error("could not notify user");
  }
};
