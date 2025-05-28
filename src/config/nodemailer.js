import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    port: parseInt(process.env.EMAIL_SERVICE_PORT),
    secure: true, // usa true para el puerto 465
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS,
    },
});

const sendMailToUser = (userMail, token) => {
    let mailOptions = {
        from: process.env.EMAIL_SERVICE_USER,
        to: userMail,
        subject: "Verifica tu cuenta",
        html: `
        <h1>Sistema de CompraVenta (DRAGONYA 🐲)</h1>
        <hr>
        <a href=${process.env.URL_FRONTEND}confirmar/${encodeURIComponent(
        token
        )}> Click aquí para confirmar tu cuenta.</a>
        <footer>Bienvenido a DRAGONYA!</footer>
        `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        console.log(error);
        } else {
        console.log("Correo enviado: " + info.response);
        }
    });
};

// send mail with defined transport object
const sendMailToRecoveryPassword = async (userMail, token) => {
    let info = await transporter.sendMail({
        from: "admin@dragonya.com",
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
        <h1>Sistema de CompraVenta (DRAGONYA 🐲)</h1>
        <hr>
        <a href=${process.env.URL_FRONTEND}comprobar-token/${token}>Clic para reestablecer tu contraseña</a>
        <hr>
        <footer>Bienvenido a DRAGONYA!</footer>
        `,
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
};

export { sendMailToUser, sendMailToRecoveryPassword };
