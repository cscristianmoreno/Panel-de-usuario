const { Router } = require("express");
const router = Router();

const fs = require("fs");

const session = require("express-session");
const { body, validationResult } = require("express-validator");

const bcryptjs = require("bcryptjs");

router.use(session({
    secret: "abc3029",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000,
        path: "/"
    }
}))

const connection = require("./db/db.js");
const { serialize } = require("v8");

router.get("/login", (req, res, next) => {
    res.render("login.ejs");
})


router.post("/login", [
    body("password")
    .custom((value, { req, res, next }) => {
        
        return new Promise(async (resolve, reject) => {
            const sql = "SELECT password FROM web_users WHERE email LIKE ?";

            connection.query(sql, [req.body.email], async (error, result, field) => {
                if (error) {
                    reject(new Error("Error en el servidor"));
                    return;
                }
                
                // const pw = await bcryptjs.hash(req.body.password, 8);
                // console.log(pw);

                if (!result[0]) {
                    reject(new Error("Los datos ingresados son incorrectos"));
                    return;
                }

                const success = await bcryptjs.compare(req.body.password, result[0].password);

                if (success) {
                    resolve(true);
                    return;
                }

                reject(new Error("Los datos son incorrectos"));
            });
        })
    })
    ],
    async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const form_errors = errors.array();

        res.send({ success: false });
    }
    else {

        var sql;
        sql = "SELECT * FROM web_users WHERE email LIKE ?";

        connection.query(sql, [req.body.email], (error, result, field) => {
            if (error) {
                console.log("Error en el servidor");
                return;
            }

            req.session.index = result[0].id;
            req.session.name = result[0].name;
            req.session.surname = result[0].surname;
            req.session.email = result[0].email;
            req.session.avatar = result[0].avatar;
            req.session.date_register = result[0].date_register;

            req.session.birth_day = result[0].birth_day;
            req.session.birth_month = result[0].birth_month;
            req.session.birth_year = result[0].birth_year;
            req.session.vinculated_id = result[0].vinculated_id;
            req.session.gender = result[0].gender;
            req.session.vinculation_status = result[0].vinculation_status;
            req.session.vinculation_email = result[0].vinculation_email;
            req.session.vinculation_date = result[0].vinculation_date;
            req.session.admin = result[0].admin;

            sql = "UPDATE web_users SET last_date=? WHERE id=?";

            const date = new Date();
    
            connection.query(sql, [date, req.session.index], (error, result, field) => {
                if (error) {
                    console.log(`Error en el servidor ${error}`);
                    return;
                }
                
                req.session.last_date = date;

                res.send({ 
                    success: true,
                    user_name: req.session.name
                })
            });
        })
    }
})

module.exports = router;