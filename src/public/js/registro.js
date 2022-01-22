"use strict";

import { elementFade } from "../js/effect_fade.js";

window.addEventListener("load", () => {
    loadYear();
    loadMonth();
    loadDay();

    checkForm();
});

const loadYear = () => {
    const register_year = document.querySelector("#birth_year");

    register_year.addEventListener("change", () => {
        loadDay();
    })

    for (let i = 1950; i <= new Date().getFullYear(); i++) {
        const element = document.createElement("option");
        
        element.setAttribute("value", `${i}`);
        element.textContent = `${i}`;
        register_year.appendChild(element);
        console.log(element);
    }
}

const loadMonth = () => {
    const register_month = document.querySelector("#birth_month");

    register_month.addEventListener("change", () => {
        loadDay();
    })

    const MONTHS = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];

    for (let i = 1; i <= MONTHS.length; i++) {
        const element = document.createElement("option");
        element.setAttribute("value", `${i}`);
        element.textContent = `${MONTHS[i - 1]}`;

        register_month.appendChild(element);
    }
}

const loadDay = () => {
    const register_day = document.querySelector("#birth_day");

    const month = document.querySelector("#birth_month");
    const year = document.querySelector("#birth_year");

    while (register_day.firstChild) {
        register_day.removeChild(register_day.firstChild);
    }

    const element = document.createElement("option");

    element.setAttribute("value", "0");
    element.setAttribute("disabled", "");
    element.setAttribute("selected", "true");

    element.textContent = "Día";

    register_day.appendChild(element);

    const days = new Date(year.value, month.value, 0).getDate();

    for (var i = 1; i <= days; i++) {
        const element = document.createElement("option");
        
        element.setAttribute("value", `${i}`);
        element.textContent = i;
        register_day.appendChild(element);
    }
}

const removeModalError = () => {
    const modal_error = document.querySelector("#modal_error");

    modal_error.classList.remove("class_modal_display");

    const button = document.querySelector("#button");
    button.removeAttribute("disabled");
}

const removeModalSuccess = () => {
    const modal_success = document.querySelector("#modal_success");

    modal_success.classList.remove("class_modal_display");

    const button = document.querySelector("#button");
    button.removeAttribute("disabled");
}

const checkForm = () => {
    const id_button_register = document.querySelector("#id_button_register");

    id_button_register.addEventListener("click", () => {
        let form = document.querySelector("#id_form_register");

        id_form_register.addEventListener("submit", async (event) => {
            event.preventDefault();

            let bodyFormData = new FormData(form);
            
            bodyFormData.append("gender", document.querySelector("#register_gender").value);
            bodyFormData.append("birth_day", document.querySelector("#birth_day").value);
            bodyFormData.append("birth_month", document.querySelector("#birth_month").value);
            bodyFormData.append("birth_year", document.querySelector("#birth_year").value);
            
            const response = await axios({
                method: "POST",
                url: "/registro",
                data: Object.fromEntries(bodyFormData.entries())
            });

            let array;
        
            if (response.data.success === true) {
                await elementFade(
                    array = {
                        "message": "Te has registrado correctamente",
                        "message_type": "TYPE_SUCCESS",
                        "message_icon": "fa-check",
                        "message_background_color": "#1c9e38",
                        "effect": "FADE_OUT"
                    }
                );

                window.location.replace("/login");
            }
            else {
                elementFade(
                    array = {
                        "message": "Los datos introducidos son incorrectos",
                        "message_type": "TYPE_ERROR",
                        "message_errors_descriptions": response.data.errors,
                        "message_icon": "fa-times",
                        "message_background_color": "#e67171",
                        "effect": "FADE_OUT",
                        "button_title": "Aceptar"
                    }
                );
            }
        })
    })
}