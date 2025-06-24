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
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); overflow: hidden;">
            
            <div style="background-color: #f42e2e; padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0;"><span style="color: #000000;">DRAGON YA</span></h1>
            </div>

            <div style="padding: 30px; text-align: center;">
                <p style="font-size: 18px; color: #333;">
                ¡Gracias por registrarte! Por favor confirma tu cuenta para comenzar a usar la plataforma.
                </p>

                <a href="${process.env.URL_FRONTEND}confirmar/${encodeURIComponent(token)}"
                style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #ff4400; color: black; text-decoration: none; font-weight: bold; border-radius: 5px;">
                ✅ Confirmar Cuenta
                </a>

                <p style="margin-top: 30px; font-size: 14px; color: #888;">
                Si no solicitaste esta cuenta, puedes ignorar este mensaje.
                </p>
            </div>

            <div style="background-color: #f1f1f1; padding: 20px; text-align: center; color: #555; font-size: 14px;">
                Bienvenido a <strong>DRAGONYA</strong> – Tu plataforma de compra y venta segura.
            </div>
            </div>
        </div>
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
