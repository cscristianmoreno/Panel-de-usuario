const express = require("express");
const app = express();
const mercadopago = require("mercadopago");
const cors = require("cors");
const { Router } = require("express");

const axios = require("axios");

const connection = require("./db/db.js");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const token = "APP_USR-912986321659877-090214-8e80de9fbe138212601f5eb28d01c0a9-817656270";

mercadopago.configure({
    access_token: token
  });

app.post("/checkout", (req, res, next) => {
  let preference = {
    items: [
      {
        title: req.body.product_name,
        description: "Compras Zombie Plague",
        unit_price: parseInt(req.body.product_cost),
        category_id: "donations",
        quantity: 1,
        currency_id: "ARS"
      }
    ],
    back_urls: 
    {
      success: "http://localhost:4000/panel",
      failure: "http://localhost:4000/panel",
      pending: "http://localhost:4000/panel",
    },
    payment_methods: {
      installments: 1
    },
    external_reference: `${req.session.index}`
  };
  
  mercadopago.preferences.create(preference)
  .then(function(response){
   //res.redirect("/");
   //window.location(response.body.init_point);
   res.send(response.body.init_point);
    //console.log(response.body);
  }).catch(function(error){
    console.log(error);
  });
})

app.post("/check_payment", async (req, res, next) => {
    const payment = Object.entries(req.query);

    const response = await axios({
        method: "GET",
        url: `https://api.mercadopago.com/v1/payments/${payment[0][1]}`,
        headers: {
          "Authorization": "Bearer APP_USR-912986321659877-090214-8e80de9fbe138212601f5eb28d01c0a9-817656270"
        }
    })

    console.log(response);

    if (response.data.status === "approved") {

        var sql;
        sql = "SELECT * FROM web_users WHERE id = ?";
        
        connection.query(sql, [parseInt(response.data.external_reference)], (error, result, field) => {
          if (error) {
              console.log(`Error /check_payment ${error}`);
              return;
          }

          console.log(result[0].id);

          var id, name, surname, email;
          id = result[0].id;
          name = result[0].name;
          surname = result[0].surname;
          email = result[0].email;

          sql = 
          "INSERT INTO web_users_money_send \
          (user_id_send, user_name_send, user_surname_send, user_email_send, \
          user_id_received, user_name_received, user_surname_received, user_email_received, \
          amount, date, date_unixtime, confirm_unixtime, type) VALUES \
          (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), ?)";

          connection.query(sql, [
            payment[0][1],
            "Mercado",
            "Pago",
            "-",
            id,
            name,
            surname,
            email,
            response.data.transaction_amount,
            "BUY"
          ], (error, result, field) => {
              if (error) {
                  console.log(`Ocurrió un error en /check_payment ${error}`);
                  return;
             }
          })

          sql = "UPDATE web_users SET money = money + ?, money_total = money_total + ? WHERE id = ?";
              
          connection.query(sql, [
            response.data.transaction_amount, 
            response.data.transaction_amount, 
            id
          ], (error, result, field) => {
            if (error) {
              console.log(`Ocurrió un error en /check_payment ${error}`);
              return;
            }

            updateNotification({
                "user_id": id,
                "user_name": name,
                "user_surname": surname,
                "notification_title": response.data.description,
                "notification_description": `Compraste $${response.data.transaction_amount} de dinero virtual`
            });

              res.end();
          })
      })
    }
});

const updateNotification = (array) => {
  const sql = "INSERT INTO web_users_notifications \
  (user_id, user_name, user_surname, notification_title, notification_description, \
  notification_unixtime) VALUES (?, ?, ?, ?, ?, UNIX_TIMESTAMP())";

  connection.query(sql, [
          array.user_id,
          array.user_name, 
          array.user_surname, 
          array.notification_title,
          array.notification_description
      ], 
      (error, result, field) => {
      if (error) {
          console.log(`Ocurrió un error en updateNotification ${error}`);
          return;
      }
  });
}

module.exports = app;