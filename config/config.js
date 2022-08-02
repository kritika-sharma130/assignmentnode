import dotenv from "dotenv";
dotenv.config();

export default {
    port: process.env.PORT,
    uri: process.env.DB_CONNECTION,
    tokenKey: process.env.TOKEN_KEY,
    senderEmail:process.env.SENDER_MAIL,
    senderPassword:process.env.SENDER_PASSWORD
};
