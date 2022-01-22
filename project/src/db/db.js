const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "users"
})

connection.connect((error) => {
    if (error) {
        console.log("Ocurrió un error en la conexión");
    }
    else {
        console.log("Te has conectado con éxito");
    }
})

module.exports = connection;