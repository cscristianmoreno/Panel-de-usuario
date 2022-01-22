const { Router } = require("express");
const router = Router();

const fs = require("fs");

const { body, validationResult } = require("express-validator");

const bcryptjs = require("bcryptjs");

const connection = require("./db/db.js");

router.get("/registro", (req, res, next) => {
    res.render("registro.ejs");

})

router.post("/registro", [
        body("name")       
        .isLength({ min: 3 })
        .withMessage("El campo NOMBRE debe tener más de tres carácteres")
        .isAlpha("en-US", { ignore: "\s" }).withMessage("El campo NOMBRE no puede contener números"),
        body("surname")
        .isLength({ min: 3 }).withMessage("El campo APELLIDO debe tener más de tres carácteres")
        .isAlpha().withMessage("El campo APELLIDO no puede contener números"),
        body("password", "El campo CONTRASEÑA debe tener más de 5 carácteres")
        .isLength({ min: 5 }),
        body("repeat_password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("El campo CONFIRMAR CONTRASEÑA no coincide.")
            }

            return true;
        }),
        body("email")
        .isEmail().withMessage("El campo EMAIL debe tener un correo válido")
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                const sql = "SELECT id FROM web_users WHERE email = ?";

                connection.query(sql, [req.body.email], (error, result, field) => {
                    if (error) {
                        reject(new Error("Error en el servidor"));
                    }

                    if (result.length) {
                        reject(new Error("El campo EMAIL tiene un correo que ya está en uso"));
                    }
                    
                    resolve(true);
                })

            })
        }),
        body("gender")
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                if (value === "0") {
                    reject(new Error("El campo GÉNERO debe tener algúna opción"));
                }

                resolve(true);
            })
        }),
        body("birth_year")
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                if (value === "0") {
                    reject(new Error("El campo AÑO debe tener alguna opción"));
                }

                resolve(true);
            })
        }),
        body("birth_month")
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                if (value === "0") {
                    reject(new Error("El campo MES debe tener alguna opción"));
                }

                resolve(true);
            })
        }),
        body("birth_day")
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                if (value === "0") {
                    reject(new Error("El campo DÍA debe tener alguna opción"));
                }

                resolve(true);
            })
        })
    ], 
    async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const form_errors = errors.array();

        let arrayErrors = new Array();

        form_errors.forEach((str, num) => {
            arrayErrors.push(str.msg);
        })

        res.send({ success: false, errors: arrayErrors });
    }
    else {
        const user = req.body.name;
        const surname = req.body.surname;
        const password = await bcryptjs.hash(req.body.password, 8);
        const email = req.body.email;
        const gender = req.body.gender;
        const birth_day = req.body.birth_day;
        const birth_month = req.body.birth_month;
        const birth_year = req.body.birth_year;

        const files = fs.readdirSync(`src/public/images/avatar`);
        const avatar = `avatar/${files[0]}`;
        
        const sql = 
        "INSERT INTO \
            web_users \
        (name, surname, password, email, date_register, last_date, unixtime, gender, birth_day, birth_month, birth_year, avatar) \
        VALUES \
        (?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), UNIX_TIMESTAMP(), ?, ?, ?, ?, ?)";

        connection.query(sql, [
            user,
            surname,
            password,
            email,
            gender,
            birth_day,
            birth_month,
            birth_year,
            avatar

        ], (error, result, field) => {
            if (error) {
                console.log(`Ocurrió un error al registrarte ${error}`);
                return;
            }        

            res.send({ success: true });
        });
    }
})

module.exports = router;