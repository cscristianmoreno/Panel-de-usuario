const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post("/registrar_usuario", [
    body("name", "Ingrese un nombre, el nombre debe contener más de 5 carácteres")
    .exists()
    .isLength({ min: 5 }),
    body("password", "Ingrese una contraseña válida, ésta debe contener más de 5 carácteres")
    .exists()
    .isLength({ min: 5 })
], (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const form_errors = errors.array();
        
        res.render("registro.ejs", { errores: form_errors });
        console.log(errors);
    }
});

module.exports = app;