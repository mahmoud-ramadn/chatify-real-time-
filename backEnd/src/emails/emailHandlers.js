import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to our platform",
    html: createWelcomeEmailTemplate(name, clientURL),
  });
  if (error) throw error;

  console.log("Email sent successfully!", data);
};
