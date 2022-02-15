const express = require("express");
const connection = require("./src/db/db.js");
const app = express();
const fs = require("fs");

const bcryptjs = require("bcryptjs");

const port = process.env.PORT || 4000;

// App Set
app.set("port", port);
app.set("json spaces", 5);
app.set("views", "./src/views");
app.set("view engine", "ejs");

// App Use
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("src/public"));

// Registro & Login
app.use(require("./src/registro.js"));
app.use(require("./src/login.js"));
app.use(require("./src/panel.js"));
app.use(require("./src/check_name.js"));
app.use(require("./src/checkout.js"));
app.use(require("./src/registrar_usuario.js"));

// App Listen
app.listen(app.get("port"), async (req, res) => {
    const sql = "SELECT * FROM web_users WHERE admin = 1";

    connection.query(sql, async (error, result, field) => {
        if (error) {
            res.end(`Ocurrió un error en ${error}`);
            return;
        }

        let files = fs.readdirSync(`src/public/images/avatar`);
        let avatar = `avatar/${files[0]}`;

        const password = await bcryptjs.hash("admin", 8);

        if (result.length === 0) {
            const sql = "INSERT INTO \
            web_users \
            (name, surname, password, email, date_register, last_date, unixtime, gender, birth_day, birth_month, birth_year, avatar, admin) \
            VALUES \
            (?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), UNIX_TIMESTAMP(), ?, ?, ?, ?, ?, ?)";

            connection.query(sql, [
                "Admin",
                "Control",
                password,
                "admin",
                "-",
                "0",
                "0",
                "0",
                avatar,
                "1"
            ], (error, result, field) => {
                if (error) {
                    console.log(`Ocurrió un error en ${error}`);
                    return;
                }
            })
        }

        const sql = "SELECT * FROM web_users";

        connection.query(sql, (error, result, field) => {
            if (error) {
                console.log(`Ocurrió un error ${error}`);
                return;
            }

            result.forEach((str) => {
                if (!fs.existsSync(`src/public/images/${decodeURI(str.avatar)}`)) {
                    const sql = "UPDATE web_users SET avatar = ? WHERE id = ?";

                    connection.query(sql, [avatar, str.id], (error, result, field) => {
                        if (error) {

                            console.log(`Ocurrió un error en ${error}`);
                            return;
                        }
                    });
                }
            })
        })
    })
})

app.delete("/session", (req, res, next) => {
    req.session.destroy();
    res.cookie("express.sid", "", { expires: new Date() });

    setTimeout(() => {
        res.end();
    }, 3000);
})