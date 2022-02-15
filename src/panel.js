const { Router  } = require("express");
const router = Router();
const ngrok = require("ngrok");
const axios = require("axios");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const connection = require("./db/db.js");
const bcryptjs = require("bcryptjs");

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.${file.originalname}`, true);
    },
    destination: (req, file, cb) => {
        cb(null, "src/public/images/avatar/");
    }
})

const files_uploaded = new Array();
const files_not_uploaded = new Array();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes("image") === false) {
            files_not_uploaded.push(file.originalname);
            req.files_not_uploaded = files_not_uploaded;
            return cb(null, false, file.originalname);
          }

          files_uploaded.push(file.originalname);
          req.files_uploaded = files_uploaded;
          cb(null, true);
    }
});

router.get("/panel/inicio", async (req, res, next) => {

    if (!req.session.index) {
        res.redirect("/login");
        return;
    }

    res.render("panel/index.ejs", { 
        id: req.session.index,
        name: req.session.name,
        surname: req.session.surname,
        email: req.session.email,
        avatar: req.session.avatar,
        date_register: req.session.date_register,
        last_date: req.session.last_date,
        birth_day: req.session.birth_day,
        birth_month: req.session.birth_month,
        birth_year: req.session.birth_year,
        vinculated_id: req.session.vinculated_id,
        gender: req.session.gender,
        path: "Inicio",
        admin: req.session.admin
    });
})

router.get("/panel/password", (req, res, next) => {
    if (!req.session.index) {
        res.redirect("/login");
        return;
    }

    res.render("panel/index.ejs", {
        name: req.session.name,
        surname: req.session.surname,
        avatar: req.session.avatar,
        path: "Cambiar Contraseña",
        admin: req.session.admin
    });
})

router.get("/panel/avatar", (req, res, next) => {
    if (!req.session.index) {
        res.redirect("/login");
        return;
    }

    const files = fs.readdirSync("src/public/images/avatar");

    res.render("panel/index.ejs", {
        name: req.session.name,
        surname: req.session.surname,
        avatar: req.session.avatar,
        path: "Cambiar Avatar",
        image_files: files,
        admin: req.session.admin
    });
})

router.get("/panel/vincular", (req, res, next) => {
    if (!req.session.index) {
        res.redirect("/login");
        return;
    }

    res.render("panel/index.ejs", {
        name: req.session.name,
        surname: req.session.surname,
        avatar: req.session.avatar,
        path: "Vincular Cuenta",
        vinculation_status: req.session.vinculation_status,
        vinculation_email: req.session.vinculation_email,
        vinculation_date: req.session.vinculation_date,
        admin: req.session.admin
    });
})

router.get("/panel/transferencias_enviadas", (req, res, next) => {
    if (!req.session.index) {
        res.redirect("/login");
        return;
    }

    res.render("panel/index.ejs", {
        name: req.session.name,
        surname: req.session.surname,
        avatar: req.session.avatar,
        path: "Transferencias Enviadas"
    });
})

router.get("/panel/transferencias_recibidas", (req, res, next) => {
    if (!req.session.index) {
        res.redirect("/login");
        return;
    }

    res.render("panel/index.ejs", {
        name: req.session.name,
        surname: req.session.surname,
        avatar: req.session.avatar,
        path: "Transferencias Recibidas"
    });
})

router.get("/panel/transferir", (req, res, next) => {
    if (!req.session.index) {
        res.redirect("/login");
        return;
    }

    res.render("panel/index.ejs", {
        name: req.session.name,
        surname: req.session.surname,
        avatar: req.session.avatar,
        path: "Transferir - recargar"
    });
})

router.get("/panel/compras", (req, res, next) => {
    if (!req.session.index) {
        res.redirect("/login");
        return;
    }

    res.render("panel/compras.ejs", {
        name: req.session.name,
        surname: req.session.surname,
        avatar: req.session.avatar,
        path: "Compras"
    });
})

router.get("/panel/admin", (req, res, next) => {
    if (!req.session.index) {
        res.redirect("/login");
        return;
    }

    if (!req.session.admin) {
        res.redirect("/panel/inicio");
        return;
    }

    const sql = "SELECT * FROM web_users WHERE admin IS NULL";

    connection.query(sql, (error, result, field) => {
        if (error) {
            console.log(`Ocurrió un error en /admin ${error}`);
            return;
        }

        const files = fs.readdirSync("src/public/images/avatar");
        
        res.render("panel/index.ejs", { 
            id: req.session.index,
            name: req.session.name,
            surname: req.session.surname,
            avatar: req.session.avatar,
            path: "Administrador",
            admin: req.session.admin,
            users: result,
            image_files: files
        });

        console.log(result.length);
    })  
})

router.post("/panel", (req, res, next) => {
    if (req.body.img.length === 0) {
        res.send({ sucess: false });
        return;
    }

    const sql = "UPDATE web_users SET avatar=? WHERE id=?";

    connection.query(sql, [req.body.img, req.session.index], (error, result, field) => {
        if (error) {
            console.log("Error en el servidor");
            res.end();
            return;
        }

        req.session.avatar = req.body.img;

        res.send({ success: true });
    });
})

router.post("/upload", upload.any("images_files"), (req, res, next) => {
    upload.any("images_files")(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            res.send({
                success: false,
                error: [
                    "Ocurrió un error al subir la imágen",
                    "La imágen es demasiado grande"
                ]
            });
        }
        else if (error) {
            res.send({
                success: false,
                error: [
                    "Error en el servidor"
                ]
            });
        }
        else {
            //console.log(req.files_not_uploaded)

            let not_uploaded = 0;
            let uploaded = 0;
            
            if (typeof req.files_uploaded !== "undefined") {
                uploaded = req.files_uploaded.length;

                while (files_uploaded.length > 0) {
                    files_uploaded.pop();
                }
            }
            
            if (typeof req.files_not_uploaded !== "undefined") {
                not_uploaded = req.files_not_uploaded.length;

                while (files_not_uploaded.length > 0) {
                    files_not_uploaded.pop();
                }
            }

            res.send({ 
                success: true,
                uploaded: uploaded,
                not_uploaded: not_uploaded,
             });
        }
    })      
})

router.delete("/delete", (req, res, next) => {
    const files = req.body;

    files.forEach((str) => {
        fs.unlink(`src/public/images/avatar/${str}`, (error) => {
            if (error) {
                throw new Error(`Error al borrar el archivo ${str}`);
                return;
            }
        });
    })

    res.send({ success: true });
})

router.post("/stats", (req, res, next) => {
    const sql = "SELECT * FROM zp_cristian_stats WHERE id=?";

    connection.query(sql, [req.session.index], (error, result, field) => {
        if (error) {
            console.log(`Error en la consulta /stats ${error}`);
            return;
        }
        
        res.send(result);
    })
})

router.post("/user_money", (req, res, next) => {
    const sql = "SELECT money FROM web_users WHERE id = ?";

    connection.query(sql, [req.session.index], (error, result, field) => {
        if (error) {
            console.log(`Error /user_money ${error}`);
            return;
        } 

        res.send(result);
    })
})

router.post("/search_user", (req, res, next) => {
    const sql = `SELECT * FROM web_users WHERE email LIKE ? AND id != ${req.session.index}`;

    connection.query(sql, [`%${req.body.search}%`], (error, result, field) => {
        if (error) {
            console.log(`Error en /search_user ${error}`);
            return;
        }

        res.send(result);
    });
})

router.post("/transfer", (req, res, next) => {
    let sql = "SELECT * FROM web_users WHERE email = ? AND id != ?";

    connection.query(sql, [req.body.email, req.session.index], async (error, result, field) => {
        if (error) {
            console.log(`Error en /transfer ${error}`);
            return;
        }

        if (result.length === 0) {
            res.send({ success: false });
            return;
        }

        sql = "SELECT money FROM web_users WHERE id = ?";

        const check = new Promise((resolve, reject) => {
            connection.query(sql, [req.session.index], (error, result, field) => {
                if (error) {
                    console.log(`error /transfer ${error}`);
                    return;
                }
                
                if (result[0].money < req.body.money) {
                    resolve(false);
                    return;
                }

                resolve(true);
            })
        })

        const checkMoney = await check;

        if (checkMoney === false) {
            res.send({ success: false });
            return;
        }

        let user_id = result[0].id;
        let user_name = result[0].name;
        let user_surname = result[0].surname;
        let user_email = result[0].email;
        
        sql = "UPDATE web_users SET money = money + ? WHERE email LIKE ?";
        
        connection.query(sql, [req.body.money, req.body.email], (error, result, field) => {
            if (error) {
                console.log(`Error en /transfer ${error}`);
                return;
            }

            sql = "UPDATE web_users SET money = money - ? WHERE id = ?";

            connection.query(sql, [req.body.money, req.session.index], (error, result, field) => {
                if (error) {
                    console.log(`Error en /transfer ${error}`);
                    return;
                }

                const sql = 
                "INSERT INTO web_users_money_send \
                (user_id_send, user_name_send, user_surname_send, user_email_send, \
                user_id_received, user_name_received, user_surname_received, user_email_received, \
                amount, date, date_unixtime, confirm_unixtime, type) VALUES \
                (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), ?)";

                connection.query(sql, [
                    req.session.index,
                    req.session.name,
                    req.session.surname,
                    req.session.email,
                    user_id,
                    user_name,
                    user_surname,
                    user_email,
                    req.body.money,
                    "TRANSFER"
                ], (error, result, field) => {
                    if (error) {
                        return;
                    }
                })

                res.send({ success: true });

                updateNotification({
                    "user_id": req.session.index,
                    "user_name": `${req.session.name} ${req.session.surname}`,
                    "notification_title": "TRANSFERENCIA ENVIADA",
                    "notification_description": `Le transferiste $${req.body.money} de dinero virtual a ${user_name} ${user_surname}`,
                    "notification_type": "TRANSFER_SEND"
                });

                updateNotification({
                    "user_id": user_id,
                    "user_name": `${user_name} ${user_surname}`,
                    "notification_title": "TRANSFERENCIA RECIBIDA",
                    "notification_description": `${req.session.name} ${req.session.surname} te transfirió $${req.body.money} de dinero virtual`,
                    "notification_type": "TRANSFER_RECEIVED"
                });
            })
        });
    })
})

router.post("/activity", (req, res, next) => {
    const sql = "SELECT * FROM web_users_money_send WHERE user_id_send = ? OR user_id_received = ?";

    connection.query(sql, [req.session.index, req.session.index], (error, result, field) => {
        if (error) {
            console.log(`Error en /activity ${error}`);
            return;
        }

        res.send(result);
    });
})

router.post("/vinculated", (req, res, next) => {

    const sql = "SELECT * FROM zp_cristian_table WHERE name = ? AND password = ?";
    
    connection.query(sql, [req.body.vinculated_nick, req.body.vinculated_password], (error, result, field) => {
        if (error) {
            console.log(`Error en /vinculated ${error}`);
            return;
        }

        var message;

        if (result.length === 0) {
            message = "No existe ningún usuario con este Nick";
        }
        else {
            message = "Has recibido una invitación de vinculación";
        }
        res.send(message);
    })
})

router.post("/report", (req, res, next) => {

    const sql = "INSERT INTO web_users_report \
    (user_id, user_name, user_surname, user_email, report_type, report_title, report_description, report_unixtime) \
    VALUES (?, ?, ?, ?, ?, ?, ?, UNIX_TIMESTAMP())";

    connection.query(sql, [
        req.session.index,
        req.session.name,
        req.session.surname,
        req.session.email,
        req.body.report_type,
        req.body.report_title,
        req.body.report_description
    ], (error, result, field) => {
        if (error) {
            console.log(`Ocurrió un error en /report ${error}`);
            return;
        }

        res.end();
    });
})

router.post("/user_reports", (req, res, next) => {
    const sql = "SELECT * FROM web_users_report WHERE user_id=?";

    connection.query(sql, [req.session.index], (error, result, field) => {
        if (error) {
            throw "Ocurrió un error";
        }

        setTimeout(() => {
            
            res.send(result);
        }, 2000 );
    })
})

router.post("/change_password", [
    body("password_old")
    .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT password, admin FROM web_users WHERE id = ?";
            
            connection.query(sql, [req.session.index], async (error, result, field) => {
                if (error) {
                    reject(new Error("Ocurrió un error en /change_password"));
                }

                if (!result[0]) {
                    reject(new error("Ocurrió un error inesperado en /change_password"));
                }

                if (result[0].admin === 1) {
                    reject(new Error("No podés cambiar la contraseña si sos administrador"));
                }

                const success = await bcryptjs.compare(req.body.password_old, result[0].password);
                
                if (!success) {
                    reject(new Error("Las contraseñas no coinciden"));
                }
                else {
                    resolve(true);

                    updateNotification({
                        "user_id": req.session.index,
                        "user_name": `${req.session.name} ${req.session.surname}`,
                        "notification_title": "CONTRASEÑA MODIFICADA",
                        "notification_description": `Actualización de contraseña`,
                        "notification_type": "UPDATE_PASSWORD"
                    });
                }
            })
        })
    }),
    body("password_new")
    .isLength({ min: 8 })
    .withMessage("La nueva contraseña debe tener más de 8 carácteres"),
    body("password_new_repeat")
    .custom((values, { req }) => {
        if (values !== req.body.password_new) {
            throw new Error("Las nuevas contraseñas no coinciden")
        }

        return true;
    })
    ],
    async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const form_errors = errors.array();

        console.log(form_errors);
        res.send({ success:  false, error: form_errors });
    }
    else {
        const hashPassword = await bcryptjs.hash(req.body.password_new, 8);
        const sql = "UPDATE web_users SET password = ? WHERE id = ?";

        connection.query(sql, [hashPassword, req.session.index], (error, result, field) => {
            if (error) {
                console.log(`Ocurrió un error al actualizar /change_password ${error}`);
                return;
            }

            res.send({ success: true });
        });
    }
})

router.post("/vinculation", [
        body("email")
        .isEmail()
        .withMessage("El email que has introducido es inválido"),
        body("email_repeat")
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                if (value !== req.body.email) {
                    reject(new Error("Los email's no coinciden"));
                }
                
                resolve(true);
            })
            
        })
    ],
    (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const form_errors = errors.array();
        console.log(form_errors);
        res.send({ success: false });
    }
    else {

        let sql;
        sql = 
        "UPDATE web_users SET \
            vinculation_status = '1', \
            vinculation_email = ? \
        WHERE id = ?"

        connection.query(sql, [req.body.email, req.session.index], (error, result, field) => {
            if (error) {
                console.log(`Ocurrió un error en /vinculated ${error}`);
                return;
            }

            sql = 
            "INSERT INTO web_users_vinculated SET \
                vinculated_id = ?, \
                vinculated_name = ?, \
                vinculated_surname = ?, \
                vinculated_already_email = ?, \
                vinculated_email = ?, \
                vinculated_systime = UNIX_TIMESTAMP() \
            ";

            connection.query(sql, [
                req.session.index, 
                req.session.name,
                req.session.surname,
                req.session.email,
                req.body.email
            ]), (error, result, field) => {
                if (error) {
                    console.log(`Error ${error}`);
                    return;
                }
            }

            updateNotification({
                "user_id": req.session.index,
                "user_name": `${req.session.name} ${req.session.surname}`,
                "notification_title": "VINCULACIÓN",
                "notification_description": `Tu cuenta fue vinculada`,
                "notification_type": "VINCULATION"
            });

            res.send({ success: true });
        });
    }
})

router.post("/notifications", (req, res, next) => {
    const sql = "SELECT *, \
    CASE \
        WHEN notification_type = 'UPDATE_PASSWORD' THEN 'fa-key' \
        WHEN notification_type = 'TRANSFER_SEND' THEN 'fa-share' \
        WHEN notification_type = 'TRANSFER_RECEIVED' THEN 'fa-reply' \
        WHEN notification_type = 'MESSAGE' THEN 'fa-envelope' \
    END AS notification_icon \
    FROM web_users_notifications WHERE user_id = ? ORDER BY notification_unixtime DESC";

    connection.query(sql, [req.session.index], (error, result, field) => {
        if (error) {
            console.log(`Ocurrió un error en /notifications ${error}`);
            return;
        }

        const sql = "UPDATE web_users_notifications SET notification_viewed = 1 \
        WHERE notification_viewed = 0 AND user_id = ?";

        connection.query(sql, [req.session.index], (error, result, field) => {
            if (error) {
                console.log(`Ocurrió un error en /notifications ${error}`);
                return;
            }

        });

        res.send(result);
    })
})

router.post("/notifications_amount", (req, res, next) => {
    const sql = "SELECT * FROM web_users_notifications WHERE user_id = ? AND notification_viewed = 0";

    connection.query(sql, [req.session.index], (error, result, field) => {
        if (error) {
            console.log(`Ocurrió un error en /notifications_amount ${error}`);
            return;
        }

        res.send(result);
    });
});

const updateNotification = (array) => {
    const sql = "INSERT INTO web_users_notifications \
    (user_id, user_name, notification_title, notification_description, \
    notification_type, notification_unixtime) VALUES (?, ?, ?, ?, ?, UNIX_TIMESTAMP())";

    connection.query(sql, [
            array.user_id,
            `${array.user_name} ${array.user_surname}`, 
            array.notification_title,
            array.notification_description,
            array.notification_type
        ], 
        (error, result, field) => {
        if (error) {
            console.log(`Ocurrió un error en updateNotification ${error}`);
            return;
        }
    });
}

router.post("/events", (req, res, next) => {
    const sql = "SELECT *, \
    CASE \
        WHEN notification_type = 'UPDATE_PASSWORD' THEN 'fa-key' \
        WHEN notification_type = 'TRANSFER_SEND' THEN 'fa-share' \
        WHEN notification_type = 'TRANSFER_RECEIVED' THEN 'fa-reply' \
        WHEN notification_type = 'MESSAGE' THEN 'fa-envelope' \
    END AS notification_icon \
    FROM web_users_notifications WHERE user_id = ? AND notification_delete_date IS NULL ORDER BY notification_unixtime";

    
    connection.query(sql, [req.session.index], (error, result, field) => {
        if (error) {
            console.log(`Ocurrió un error ${error}`);
            return;
        }
        
        res.send(result);
    });
})

router.delete("/events", (req, res, next) => {
    const sql = "UPDATE web_users_notifications SET notification_delete_date = CURRENT_TIMESTAMP() WHERE user_id = ? AND id = ?";

    connection.query(sql, [req.session.index, req.body.message_id], (error, result, field) => {
        if (error) {
            console.log(`Ocurrió un error en /events ${error}`);
        }

        res.send({ success: true });
    });

    
})

router.post("/messages", (req, res, next) => {
    const sql = 
    "SELECT msg.*, CONCAT(users.name, ' ', users.surname) AS message_user, \
    CASE \
        WHEN msg.message_viewed = 1 THEN 'fa-eye' ELSE 'fa-eye-slash' \
    END AS message_icon_viewed, \
    CASE \
        WHEN users.id = ? THEN 'fa-long-arrow-alt-right' ELSE 'fa-long-arrow-alt-left' \
    END AS message_icon_status, \
    users.avatar AS message_avatar, \
    users.email AS message_email, \
    users.id AS user_id \
    FROM web_users_messages AS msg \
    LEFT JOIN web_users AS users ON users.id = msg.user_id_send \
    WHERE msg.user_id_send = ? AND msg.message_send_delete_date IS NULL OR msg.user_id_received = ? AND msg.message_received_delete_date IS NULL \
    ORDER BY msg.message_unixtime DESC";    
    
    connection.query(sql, [
        req.session.index, 
        req.session.index,
        req.session.index,
        req.session.index
    ], (error, result, field) => {
        if (error) {
            console.log(`Error en /messages ${error}`);
            return;
        }

        if (result.length === 0) {
            res.end();
            return;
        }

        res.send(result);   
    })
})

router.delete("/messages", (req, res, next) => {
    let sql;

    sql = "SELECT * FROM web_users_messages WHERE user_id_send = ?"

    connection.query(sql, [req.session.index], (error, result, field) => {
        if (error) {
            console.log(`Ocurrió un error en /messages ${error}`);
            res.send({ success: false });
            return;
        }

        if (result.length > 0) {
            sql = "UPDATE web_users_messages SET message_send_delete_date = CURRENT_TIMESTAMP() WHERE id = ?";

            connection.query(sql, [req.body.message_id], (error, result, field) => {
                if (error) {
                    console.log(`Ocurrió un error en /messages ${error}`);
                    res.send({ success: false });
                    return;
                }
        
                res.send({ success: true });
            })
        }
        else {
            sql = "UPDATE web_users_messages SET message_received_delete_date = CURRENT_TIMESTAMP() WHERE id = ?";

            connection.query(sql, [req.body.message_id], (error, result, field) => {
                if (error) {
                    console.log(`Ocurrió un error en /messages ${error}`);
                    res.send({ success: false });
                    return;
                }
        
                res.send({ success: true });
            })
        }
    })
})

router.post("/messages_open", (req, res, next) => {
    const sql = "UPDATE web_users_messages SET message_viewed = 1 WHERE id = ? AND user_id_received = ?";

    console.log(req.body);

    connection.query(sql, [req.body.message_id, req.session.index], (error, result, field) => {
        if (error) {
            console.log(`Ocurrió un error en /messages_open ${error}`);
            return;
        }

        res.send(true);
    })
})

router.post("/messages_send", (req, res, next) => {

    if (req.body.message_title.length === 0 || req.body.message_description.length === 0) {
        res.send({ success: false });
        return;
    }

    let sql;
    
    sql = "SELECT * FROM web_users WHERE email = ? AND id != ?";

    connection.query(sql, [req.body.message_destination, req.session.index], (error, result, field) => {
        if (error) {
            console.log(`Ocurrió un error en /messages_send ${error}`);
            return;
        }

        if (result.length === 0) {
            res.send({ success: false });
            return;
        }

        let user_id_received, user_name_received, user_surname_received;

        user_id_received = result[0].id;
        user_name_received = `${result[0].name} ${result[0].surname}`

        sql = "INSERT INTO web_users_messages \
        (user_id_send, user_id_received, message_title, message_description, message_unixtime) \
            VALUES \
        (?, ?, ?, ?, UNIX_TIMESTAMP())";
            
        connection.query(sql, [
            req.session.index,
            user_id_received,
            req.body.message_title,
            req.body.message_description
        ], (error, result, field) => {
            if (error) {
                console.log(`Ocurrió un error en /messages_send ${error}`);
                return;
            }

            updateNotification({
                "user_id": req.session.index,
                "user_name": `${req.session.name} ${req.session.surname}`,
                "notification_title": "NUEVO MENSAJE",
                "notification_description": `Le enviaste un mensaje a ${user_name_received}`,
                "notification_type": "MESSAGE"
            });

            updateNotification({
                "user_id": user_id_received,
                "user_name": user_name_received,
                "notification_title": "NUEVO MENSAJE",
                "notification_description": `${req.session.name} ${req.session.surname} te envió un mensaje`,
                "notification_type": "MESSAGE"
            });

            res.send({ success: true });
        })
    });
})

router.get("/panel/logout", (req, res, next) => {
    req.session.destroy();
    res.redirect("/login");
})

router.post("/get_user", (req, res, next) => {

    console.log(req.body);
    const sql = "SELECT * FROM web_users WHERE id = ?";

    connection.query(sql, [req.body.id], (error, result, field) => {
        if (error) {
            console.log(`Ocurrió un error en ${users}`);
            return;
        }

        res.send(result);
    })
})

router.delete("/delete_user", (req, res, next) => {
    const sql = "UPDATE web_users SET delete_date = CURRENT_TIMESTAMP() WHERE id = ?";

    connection.query(sql, [req.body.delete_id], (error, result, field) => {
        if (error) {
            console.log(`Error ${error}`);
            return;
        }

        res.send({ success: true });
    })
})

router.put("/restore_user", (req, res, next) => {
    const sql = "UPDATE web_users SET delete_date = NULL WHERE id = ?";

    connection.query(sql, [req.body.restore_id], (error, result, field) => {
        if (error) {
            console.log(`Error ${error}`);
            return;
        }

        res.send({ success: true });
    })
})

router.post("/edit_user", [
        body("name")       
        .isLength({ min: 3 })
        .withMessage("El campo nombre debe tener más de tres carácteres")
        .isAlpha().withMessage("El campo nombre no puede contener números"),
        body("surname")
        .isLength({ min: 3 }).withMessage("El campo apellido debe tener más de tres carácteres")
        .isAlpha().withMessage("El campo apellido no puede contener números"),
        body("password", "El campo contraseña debe tener más de 5 carácteres")
        .isLength({ min: 5 }),
        body("email")
        .isEmail().withMessage("El campo email debe tener un correo válido")
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                const sql = "SELECT id FROM web_users WHERE email LIKE ? AND id != ?";

                connection.query(sql, [req.body.email, req.body.id], (error, result, field) => {
                    if (error) {
                        reject(new Error("Error en el servidor"));
                    }

                    if (result.length) {
                        reject(new Error("El campo email introducido ya está en uso"));
                    }
                    
                    resolve(true);
                })

            })
        }),
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
        const sql = "UPDATE web_users SET name = ?, surname = ?, email = ?, password = ? WHERE id = ?";

        let password;
        password = await bcryptjs.hash(req.body.password, 8);

        connection.query(sql, [
            req.body.name,
            req.body.surname,
            req.body.email,
            password,
            req.body.id,
        ], (error, result, field) => {
            if (error) {
                console.log(`Ocurrió un error en /edit_user ${error}`);
                return;
            }

            res.send({ success: true });
        });
    }
})

router.get("/images", (req, res, next) => {
    const files = fs.readdirSync("src/public/images/avatar");

    const file_name = new Array();
    const file_date = new Array();



    files.forEach((str) => {
        const file = fs.statSync(`src/public/images/avatar/${str}`);
        file_name.push(str);
        file_date.push(new Date(file.birthtime).toLocaleString());
    });

    let file = {
        file_name: file_name,
        file_date: file_date
    }

    console.log(file);

    res.send(file);
})

router.post("/user_list", (req, res, next) => {
    const sql = "SELECT *, CONCAT(name, ' ', surname) AS user_name FROM web_users WHERE admin IS NULL";

    connection.query(sql, (error, result, field) => {
        if (error) {
            console.log(`Error ${error}`);
            return;
        }

        res.send(result);
    })
})

module.exports = router;