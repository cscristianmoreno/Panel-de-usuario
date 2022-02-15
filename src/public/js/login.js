"use strict";

import { elementFade } from "../js/effect_fade.js";

window.addEventListener("load", () => {
    checkLogin();
})

const checkLogin = () => {
    const id_form_login = document.querySelector("#id_form_login");

    id_form_login.addEventListener("submit", async (event) => {
        event.preventDefault();

        const form = new FormData(id_form_login);

        const response = await axios({
            method: "POST",
            url: "/login",
            data: Object.fromEntries(form.entries())
        })

        let array;
    
        if (response.data.success === true) {
            await elementFade(
                array = {
                    "message": "Has iniciado sesión con éxito",
                    "message_type": "TYPE_SUCCESS",
                    "message_icon": "fa-check",
                    "message_background_color": "#1c9e38",
                    "effect": "FADE_OUT"
                }
            );

            window.location.replace("/panel/inicio");
        }
        else {
            elementFade(
                array = {
                    "message": "Los datos introducidos son incorrectos",
                    "message_type": "TYPE_SUCCESS",
                    "message_icon": "fa-times",
                    "message_background_color": "#e67171",
                    "effect": "FADE_OUT",
                    "button_title": "Aceptar"
                }
            );
        }
    })
}