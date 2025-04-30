import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap-config.js"

export const sendVerificationEmail = async (email, verificationToken, alias) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Email Verification",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}, {username}", verificationToken, alias),
            category: "Email Verification"
        });

        console.log("Email sent successfully: ", response)
    } catch (error) {
        console.error("Email sending failed: ", error)
        throw new Error(`Email sending failed: ${error}`)
    }
};

export const sendWelcomeEmail = async (email, alias) => {
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to our platform",
            html: WELCOME_EMAIL_TEMPLATE.replace("{userName}", alias),
            category: "Welcome Email"
        });

        console.log("Welcome email sent successfully: ", response)
    } catch (error) {
        console.error("Welcome email sending failed: ", error)
        throw new Error(`Welcome email sending failed: ${error}`)
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        });
        console.log("Password reset email sent successfully: ", response)
    } catch (error) {
        console.error("Error sending password reset email ", error);
        throw new Error(`Error sending password reset email: ${error}`)
    }
}

export const sendResetSuccessEmail = async (email, alias) => {
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{username}", alias),
            category: "Password Reset"
        });

        console.log("Password reset success email sent successfully: ", response)
    } catch (error) {
        console.error("Error sending password reset success email ", error);
        throw new Error(`Error sending password reset success email: ${error}`)
    }
}