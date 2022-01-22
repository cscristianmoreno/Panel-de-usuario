const { Router } = require("express");
const router = Router();

const connection = require("./db/db.js");

router.post("/check_name", async (req, res, next) => {
    const user = await req.body.name;
    
    const query = "SELECT * FROM `zp_cristian_table` WHERE name LIKE ?";

    connection.query(query, [user], (error, result, fields) => {
        if (error) {
            console.log("Ocurrió un error en la consulta");
            return;
        }

        if (!result[0]) {
            res.json([
                { check: 0 }
            ]);
        }
        else {
            res.json([
                { check: 1, id: result[0].id }
            ]);
        }
    })
})

module.exports = router;