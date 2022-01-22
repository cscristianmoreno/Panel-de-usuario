/* === GLOBAL VARS ===*/
"use strict";

import { elementFade } from "./effect_fade.js";

window.addEventListener("load", () => {
    imageSelect();
    userMenuIcon();
    userMoney();
    userMoneyTransfer();
    userMoneyRecharge();
    userEvents();
    userMessages();
    userReports();
    userNotification();
    userChangePassword();
    adminNewUser();
    adminGallery();
    adminDeleteImage();
    adminUserList();

    changeImage();
})

const userImage = () => {
    const id_panel_image = document.querySelector("#id_panel_image");
    const id_panel_image_icon = document.querySelector("#id_panel_image_icon");

    
    id_panel_image.addEventListener("mouseover", () => {

        const id_image_loader = document.querySelector("#id_image_loader");
        
        if (!id_image_loader.classList.contains("class_loader_display")) {
            id_panel_image_icon.classList.add("panel_image_container_display");
        }
    })
    
    id_panel_image.addEventListener("mouseout", () => {
        id_panel_image_icon.classList.remove("panel_image_container_display");
    })
}

const changeImage = () => {
    const id_panel_change_image = document.querySelector("#id_panel_change_image");

    id_panel_change_image.addEventListener("click", async () => {
        const id_panel_image = document.querySelector("#id_panel_image");

        const id_image_change = document.querySelector("#id_image_change");
        const src = id_image_change.getAttribute("src");
        const file = src.split("images/").pop();

        const response = await axios({
            method: "POST",
            url: "/panel",
            data: {
                img: file
            }
        });
        
        let array;

        if (response.data.success === true) {
            await elementFade(
                array = {
                    "message": "Tu avatar fue cambiado con éxito",
                    "message_type": "TYPE_SUCCESS",
                    "message_icon": "fa-check",
                    "message_background_color": "#1c9e38",
                    "effect": "FADE_OUT"
                }
            );
                
            id_panel_image.setAttribute("src", `/images/${file}`);
        }
        else {
            elementFade(
                array = {
                    "message": "Ocurrió un error al cambiar tu avatar",
                    "message_type": "TYPE_ERROR",
                    "message_errors_descriptions": [
                        "No se seleccionó ninguna imagen"
                    ],
                    "message_icon": "fa-times",
                    "message_background_color": "#e67171",
                    "effect": "FADE_OUT",
                    "button_title": "Aceptar"
                }
            );
        }
    })
}

const imageSelect = () => {
    const gallery = document.querySelectorAll("img.panel_image_gallery");

    const id_image_change = document.querySelector("#id_image_change");

    gallery.forEach((img) => {
        
        img.classList.remove("panel_image_gallery_select");

        img.addEventListener("click", (ev) => {
            gallery.forEach((img) => {
                img.classList.remove("panel_image_gallery_select");
            })

            ev.currentTarget.classList.add("panel_image_gallery_select");
            id_image_change.setAttribute("src", ev.currentTarget.src);
        })
    })
}

const checkFile = () => {
    const id_file = document.querySelector("#id_file");
    const file = id_file.value.split("\\").pop();
    const id_file_error = document.querySelector("#id_file_error");

    if ((file.search(".jpg") === -1) && (file.search(".jpeg") === -1) && (file.search(".png") === -1)) {
        id_file_error.classList.add("panel_image_upload_error_display");

        return;
    }

    if (id_file_error.classList.contains("panel_image_upload_error_display")) {
        id_file_error.classList.remove("panel_image_upload_error_display");
    }

    const id_file_message = document.querySelector("#id_file_message");
    id_file_message.textContent = `${file}`;

    const id_panel_button_upload_file = document.querySelector("#id_panel_button_upload_file");
    id_panel_button_upload_file.removeAttribute("disabled");
}

const uploadImage = async () => {
    const id_file = document.querySelector("#id_file");
    
    const formData = new FormData();
    formData.append("file", id_file.files[0]);

    const response = await axios({
        method: "POST",
        url: "/upload",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

const userMenuIcon = async () => {
    const id_panel_menu_icon_open = document.querySelector("#id_panel_menu_icon_open");
    const id_panel_menu_icon_close = document.querySelector("#id_panel_menu_icon_close");

    id_panel_menu_icon_open.addEventListener("click", () => {
        const id_panel_menu = document.querySelector("#id_panel_menu");
        id_panel_menu.classList.toggle("panel_menu_container_display");
    })
    
    id_panel_menu_icon_close.addEventListener("click", () => {
        id_panel_menu.classList.toggle("panel_menu_container_display");
    })
}

const userMoney = async () => {
    const response = await axios({
        method: "POST",
        url: "/user_money"
    });

    
    const id_panel_user_money = document.querySelector("#id_panel_user_money");
    
    const element = await checkElement(id_panel_user_money);

    if (element === false) {
        return;
    }

    const value = parseInt(response.data[0].money);

    id_panel_user_money.textContent = new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(value);
}

const userMoneyRecharge = async () => {

    const id_button_recharge = document.querySelector("#id_button_recharge");

    const element = await checkElement(id_button_recharge);

    if (element === false) {
        return;
    }

    id_button_recharge.addEventListener("click", async () => {
        let array;
        const form = await elementFade(
            array = {
                "background": "white",
                "message": "Recargar dinero",
                "message_type": "TYPE_FORM",
                "message_background_color": "white",
                "effect": "FADE_OUT",
                "form_max_field": "2",
                "form_field_title": [
                    "Método de pago",
                    "Cantidad a recargar"
                ],
                "form_field_name": [
                    "payment_type",
                    "product_cost"
                ],
                "form_field_type": [
                    [ "select", "TYPE_TEXT" ],
                    [ "select", "TYPE_TEXT" ],
                ],
                "form_field_options": [
                    [ "Mercado Pago" ],
                    [ "50", "100", "250", "500", "750", "1000", "2500", "5000" ]
                ],
                "button_title": "Recargar",
                "button_exit": 1
            }
        );

        if (form.length) {
            const myForm = new FormData(form);

            myForm.append("product_name", "Comprar dinero virtual");

            axios({
                method: "POST",
                url: "/checkout",
                data: Object.fromEntries(myForm.entries())
            })
            .then((response) => {
                window.open(response.data, "_blank");
            })
        }
    })
}

const userEvents = async () => {
    
    const response = await axios({
        method: "POST",
        url: "/events"
    })

    let array;

    createTable(
        array = {
            "element_id": "id_panel_table_events",
            "table_max_rows": 15,
            "table_title": [
                "TIPO",
                "EVENTO",
                "DESCRIPCIÓN",
                "FECHA",
            ],
            "table_array": response.data,
            "table_items": [
                [ "notification_icon", "TYPE_ICON" ],
                [ "notification_title", "TYPE_TEXT" ],
                [ "notification_description", "TYPE_TEXT" ],
                [ "notification_date", "TYPE_DATE" ],
            ],
            "table_buttons_group": [
                [ "Eliminar", "btn-danger", "deleteEvent(array.table_array[event.currentTarget.id])" ]
            ],
            "table_page_default": 1
        }
    );
}

const deleteEvent = async (event) => {

    let array;

    const response = await elementFade(
        array = {
            "message": `¿Estás seguro de eliminar este evento?`,
            "message_type": "TYPE_ANSWER",
            "message_icon": "fa-times",
            "message_background_color": "#e67171",
            "effect": "FADE_OUT",
            "questions": [
                "Sí",
                "No"
            ]
        }
    );

    if (response === "Sí") {
        const response = await axios({
            method: "DELETE",
            url: "/events",
            data: {
                message_id: event.id 
            }
        })

        await elementFade(
            array = {
                "message": "El evento fue eliminado",
                "message_type": "TYPE_SUCCESS",
                "message_icon": "fa-check",
                "message_background_color": "#1c9e38",
                "effect": "FADE_OUT"
            }
        );

        location.reload(true);
    }
}

const userMessages = async () => {

    let array;

    const id_panel_new_message = document.querySelector("#id_panel_new_message");

    const element = await checkElement(id_panel_new_message);

    if (element === false) {
        return;
    }

    id_panel_new_message.addEventListener("click", async () => {
        const form = await elementFade(
            array = {
                "background": "white",
                "message": "Nuevo mensaje",
                "message_type": "TYPE_FORM",
                "message_background_color": "white",
                "effect": "FADE_OUT",
                "form_max_field": "3",
                "form_field_title": [
                    "Destinatario",
                    "Título del mensaje",
                    "Mensaje"
                ],
                "form_field_name": [
                    "message_destination",
                    "message_title",
                    "message_description"
                ],
                "form_field_type": [
                    [ "input", "TYPE_TEXT" ],
                    [ "input", "TYPE_TEXT" ],
                    [ "textarea", "TYPE_TEXT" ],
                ],
                "button_title": "Enviar",
                "button_exit": 1
            }
        );

        if (form.length) {
            const formData = new FormData(form);

            const response = await axios({
                method: "POST",
                url: "/messages_send",
                data: Object.fromEntries(formData.entries())
            })

            if (response.data.success === true) {
                elementFade(
                    array = {
                        "message": "El mensaje se ha enviado correctamente",
                        "message_type": "TYPE_SUCCESS",
                        "message_icon": "fa-check",
                        "message_background_color": "#1c9e38",
                        "effect": "FADE_OUT"
                    }
                );
            }
            else {
                elementFade(
                    array = {
                        "message": "El mensaje no se pudo enviar",
                        "message_type": "TYPE_ERROR",
                        "message_errors_descriptions": [
                            "El correo electrónico introducido no existe",
                            "Tú no puedes ser el destinatario",
                            "El título del mensaje está vacío",
                            "El cuerpo del mensaje está vacío"
                        ],
                        "message_icon": "fa-times",
                        "message_background_color": "#e67171",
                        "effect": "FADE_OUT",
                        "button_title": "Aceptar"
                    }
                );
            }
        }
    })

    let response;
    
    response = await axios({
        method: "POST",
        url: "/messages"
    })

    createTable(
        array = {
            "element_id": "id_panel_table_messages",
            "table_max_rows": 15,
            "table_title": [
                "AVATAR",
                "USUARIO",
                "TÍTULO",
                "FECHA",
                "ESTADO",
                "LEÍDO"
            ],
            "table_array": response.data,
            "table_items": [
                [ "message_avatar", "TYPE_IMAGE" ],
                [ "message_user", "TYPE_TEXT" ],
                [ "message_title", "TYPE_TEXT" ],
                [ "message_date", "TYPE_DATE" ],
                [ "message_icon_status", "TYPE_ICON" ],
                [ "message_icon_viewed", "TYPE_ICON" ]
            ],
            "table_buttons_group": [
                [ "Leer", "btn-primary", "openMessage(array.table_array[event.currentTarget.id])" ],
                [ "Eliminar", "btn-danger", "deleteMessage(array.table_array[event.currentTarget.id])" ]
            ],
            "table_page_default": 1
        }
    )
}

const deleteMessage = async (event) => {
    let array;

    const response = await elementFade(
        array = {
            "message": `¿Estás seguro de eliminar este mensaje?`,
            "message_type": "TYPE_ANSWER",
            "message_icon": "fa-times",
            "message_background_color": "#e67171",
            "effect": "FADE_OUT",
            "questions": [
                "Sí",
                "No"
            ]
        }
    );

    if (response === "Sí") {
        const response = await axios({
            method: "DELETE",
            url: "/messages",
            data: {
                message_id: event.id 
            }
        })

        await elementFade(
            array = {
                "message": "El mensaje fue eliminado",
                "message_type": "TYPE_SUCCESS",
                "message_icon": "fa-check",
                "message_background_color": "#1c9e38",
                "effect": "FADE_OUT"
            }
        );

        location.reload(true);
    }
}

const openMessage = async (array) => {
    await axios({
        method: "POST",
        url: "/messages_open",
        data: {
            message_id: array.id
        }
    })

    elementFade(
        array = {
            "background": "white", 
            "message": `Lectura de mensaje`,
            "message_type": "TYPE_MESSAGE_READ",
            "message_background_color": "white",
            "effect": "FADE_OUT",
            "message_data": {
                message_avatar: array.message_avatar,
                message_user: array.message_user,
                message_title: array.message_title,
                message_description: array.message_description,
                message_date: array.message_date,
                message_email: array.message_email
            },
            "button_exit": 1
        }
    )
}

const createTable = async (array) => {
    
    let element;
    element = document.querySelector(`#${array.element_id}`);
    
    const check = await checkElement(element);

    if (check === false) {
        return;
    }

    removeElements(eval(array.element_id));

    if (typeof array.table_main_title !== "undefined") {
        const span = document.createElement("span");
        span.textContent = array.table_main_title;
        span.classList.add("panel_table_main_title")

        element.appendChild(span);
    }

    const table = document.createElement("table");
    table.classList.add("table");
    
    const thead = document.createElement("thead");
    thead.classList.add("thead-dark");

    const tr = document.createElement("tr");

    const th = document.createElement("th");
    th.textContent = "#";
    th.setAttribute("scope", "col");
    tr.appendChild(th);

    array.table_title.forEach((str) => {
        const th = document.createElement("th");
        th.setAttribute("scope", "col");
        th.textContent = str;
        tr.appendChild(th);

    })

    if (typeof array.table_buttons_group !== "undefined") {
        const th = document.createElement("th");
        th.textContent = "ACCIÓN";
        tr.appendChild(th);
    }

    thead.appendChild(tr);

    const tbody = document.createElement("tbody");

    let value, element_type;
    
    const min = ((array.table_page_default - 1) * array.table_max_rows);
    const max = (min + array.table_max_rows);
    
    for (var i = min; i < max; i++) {
        if (i >= array.table_array.length) {
            break;
        }

        const tr = document.createElement("tr");

        const th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.textContent = i + 1;
        tr.appendChild(th);
        
        array.table_items.forEach((str, num) => {

            const td = document.createElement("td");

            const find =  Object.entries(array.table_array[0]).find((search) => search[0] === str[0]);

            if (find) {
                value = eval(`array.table_array[i].${str[0]}`);
            }
            else {
                value = str[0];
            }

            switch(str[1]) {
                case "TYPE_TEXT": {
                    element_type = document.createElement("span");
                    element_type.textContent = value;
                    break;
                }
                case "TYPE_IMAGE": {
                    console.log(value);

                    element_type = document.createElement("img");
                    element_type.setAttribute("src", `/images/${value}`);
                    break;
                }
                case "TYPE_DATE": {
                    element_type = document.createElement("span");

                    element_type.textContent = new Date(value).toLocaleString();
                    break;
                }
                case "TYPE_ICON": {
                    element_type = document.createElement("i");
                    element_type.classList.add("fas");
                    element_type.classList.add(value);
                    break;
                }
                default: {
                    break;
                }
            }

            td.appendChild(element_type);
            tr.appendChild(td);
        })

        if (typeof array.table_buttons_group !== "undefined") {

            /*if (typeof array.table_array[i].message_id !== "undefined") {
                console.log(`EL VALOR DE ESTO ES ${array.table_array[i].message_id}`);

            }*/

            if (array.table_buttons_group.length > 0) {
                const td = document.createElement("td");

                const div = document.createElement("div");
                div.classList.add("btn-group-sm");
                //div.classList.add("justify-content-between");
                
                if (typeof array.table_array[i].delete_date !== "undefined" && array.table_array[i].delete_date) {
                    const button = document.createElement("button");
                    button.classList.add("btn");
                    button.classList.add("btn-warning");
                    button.setAttribute("id", i);

                    button.textContent = "Restaurar usuario";

                    button.addEventListener("click", (event) => {
                        eval(adminRestoreUser(array.table_array[event.currentTarget.id]));
                    })

                    div.appendChild(button);
                }
                else {
                    array.table_buttons_group.forEach((str, num) => {
                        const button = document.createElement("button");

                        button.classList.add("btn");
                        button.classList.add(str[1]);
                        button.setAttribute("id", i);
                        button.textContent = str[0];
                        //console.log(`EL BOTÓN ES ${array.table_array[i].message_id}`);

                        button.addEventListener("click", (event) => {
                            eval(str[2]);
                        })

                        //console.log(`I = ${i}`);

                        div.appendChild(button);

                    })
                }

                td.appendChild(div);
                tr.appendChild(td);
            }
        } 

        tbody.appendChild(tr);
    }

    const select = document.createElement("select");
    select.classList.add("form-select");

    select.addEventListener("change", (event) => {
        array.table_page_default = parseInt(event.currentTarget.value);
        createTable(array);
    })

    let rows = (array.table_array.length / array.table_max_rows);
    
    if (!Number.isInteger(rows)) {
        rows += 1;
    }

    if (array.table_page_default > parseInt(rows)) {
        array.table_page_default = parseInt(rows);
    }

    for (let i = 1; i <= parseInt(rows); i++) {
        const option = document.createElement("option");

        if (array.table_page_default === i) {
            option.setAttribute("selected", true);
            option.setAttribute("disabled", true);
        }

        option.setAttribute("value", i);
        option.textContent = i;

        select.appendChild(option);
    }

    const br = document.createElement("br");


    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(br);

    element.appendChild(table);
    element.appendChild(select);
}

const reloadMoney = () => {
    const id_recharge_money_value = document.querySelector("#id_recharge_money_value");
    const id_payment_method = document.querySelector("#id_payment_method");
    const id_modal_payment_method_error = document.querySelector("#id_modal_payment_method_error");


    if (id_recharge_money_value.value == 0 || id_payment_method.value == 0) {
        elementFade(
            array = {
                "message": "Ocurrió un error al intentar recargar saldo",
                "message_type": "TYPE_ERROR",
                "message_errors_descriptions": [
                    "Error en el servidor"
                ],
                "message_icon": "fa-times",
                "message_background_color": "#e67171",
                "effect": "FADE_OUT",
                "button_title": "Aceptar"
            }
        );

        return;
    }

    axios({
        method: "POST",
        url: "/checkout",
        data: {
            product_name: "Comprar dinero virtual",
            product_cost: id_recharge_money_value.value
        }
    })
    .then((response) => {
        window.open(response.data, "_blank");
    })
    
}

const userMoneyTransfer = async () => {

    const id_button_transfer = document.querySelector("#id_button_transfer");

    const element = await checkElement(id_button_transfer);

    if (element === false) {
        return;
    }

    let array;

    id_button_transfer.addEventListener("click", async () => {
        const form = await elementFade(
            array = {
                "background": "white", 
                "message": "Transferir dinero",
                "message_type": "TYPE_FORM",
                "message_background_color": "white",
                "effect": "FADE_OUT",
                "form_max_field": "2",
                "form_field_title": [
                    "Correo electrónico",
                    "Cantidad a transferir"
                ],
                "form_field_name": [
                    "email",
                    "money"
                ],
                "form_field_type": [
                    [ "input", "TYPE_TEXT" ],
                    [ "select", "TYPE_TEXT" ],
                ],
                "form_field_options": [
                    [ ],
                    [ "100", "250", "500", "750", "1000", "2500", "5000", "10000" ]
                ],
                "button_title": "Enviar",
                "button_exit": 1
            }
        );
        
        
        if (form.length) {
            let response;
            
            response = await elementFade(
                array = {
                    "message": "¿Estás seguro de realizar esta transferencia?",
                    "message_type": "TYPE_ANSWER",
                    "message_icon": "fa-exclamation",
                    "message_background_color": "#6262f8",
                    "effect": "FADE_OUT",
                    "questions": [
                        "Sí",
                        "No"
                    ]
                }
            );

            if (response === "Sí") {
                const myForm = new FormData(form);

                response = await axios({
                    method: "POST",
                    url: "/transfer",
                    data: Object.fromEntries(myForm.entries())
                })

                if (response.data.success === true) {
                    elementFade(
                        array = {
                            "message": "La transferencia se realizó con éxito",
                            "message_type": "TYPE_SUCCESS",
                            "message_icon": "fa-check",
                            "message_background_color": "#1c9e38",
                            "effect": "FADE_OUT"
                        }
                    );
                }
                else {
                    elementFade(
                        array = {
                            "message": "Ocurrió un error al realizar la transferencia",
                            "message_type": "TYPE_ERROR",
                            "message_errors_descriptions": [
                                "La dirección de correo electrónico no existe",
                                "Tú no puedes ser el destinatario",
                                "No tienes suficiente saldo",
                            ],
                            "message_icon": "fa-times",
                            "message_background_color": "#e67171",
                            "effect": "FADE_OUT",
                            "button_title": "Aceptar"
                        }
                    );
                }
            }
        }
    });
}



const checkNumbers = (event) => {

    if (event.ctrlKey) {
        return false;
    }

    if (event.keyCode >= 48 && event.keyCode <= 57) {
        return true;
    }

    return false;
}

const transferMoneyValue = () => {
    const id_transfer_money_value = document.querySelector("#id_transfer_money_value");
    const id_money_transfer = document.querySelector("#id_money_transfer");

    const value = new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD" }).format(parseInt(id_transfer_money_value.value));
    id_money_transfer.textContent = value;
}

const removeAllModals = () => {
    const modal = document.getElementsByClassName("class_modal");

    for (var i = 0; i < modal.length; i++) {
        if (modal[i].classList.contains("class_modal_display")) {
            modal[i].classList.remove("class_modal_display");
        }
    }
}

const removeElements = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

const createElementsActivity = (date, result) => {
    const element_details_container = document.createElement("div");
    element_details_container.classList.add("panel_activity_details_elements");

    const element_details_date = document.createElement("span");
    element_details_date.classList.add("panel_activity_details");
    element_details_date.textContent = `${date}`;
    
    const element_details_result = document.createElement("span");
    element_details_result.textContent = `${result}`;
    element_details_result.classList.add("panel_activity_details");
    
    element_details_container.appendChild(element_details_date);
    element_details_container.appendChild(element_details_result);

    return element_details_container;
}


const showActivityDisplay = () => {
    const id_panel_activity_display = document.querySelector("#id_panel_activity_display");
    id_panel_activity_display.classList.toggle("panel_activity_display_view");

    const id_button_activity_display = document.querySelector("#id_button_activity_display");

    if (id_button_activity_display.textContent.includes("Mostrar")) {
        id_button_activity_display.textContent = "Ocultar";
     }
    else {
        id_button_activity_display.textContent = "Mostrar";
    }
}


const vinculatedAccount = async () => {
    const id_vinculated_nick = document.querySelector("#id_vinculated_nick");
    const id_vinculated_password = document.querySelector("#id_vinculated_password");

    const response = await axios({
        url: "/vinculated",
        method: "POST",
        data: {
            vinculated_nick: id_vinculated_nick.value,
            vinculated_password: id_vinculated_password.value
        }
    });

    alert(response.data);
}

const vinculatedAccountDisplay = () => {
    const id_modal_vinculated = document.querySelector("#id_modal_vinculated");
    id_modal_vinculated.classList.add("class_modal_display");
}

const showReport = () => {
    const id_modal_report = document.querySelector("#id_modal_report");
    id_modal_report.classList.add("class_modal_display");
}

const createReport = async () => {
    const id_report_type = document.querySelector("#id_report_type");
    const id_report_title = document.querySelector("#id_report_title");
    const id_report_description = document.querySelector("#id_report_description");
    
    var error = 0;

    if (id_report_type.value == 0) {
        error = 1;
    }

    if (id_report_title.length == 0) {
        error = 1;
    }

    if (id_report_description.length == 0) {
        error = 1;
    }

    if (error) {
        const id_report_error = document.querySelector("#id_report_error");
        id_report_error.classList.add("panel_report_message_error_display");
    }

    const response = await axios({
        url: "/report",
        method: "POST",
        data: {
            report_type: id_report_type.options[id_report_type.selectedIndex].text,
            report_title: id_report_title.value,
            report_description: id_report_description.value
        }
    });

    messageSuccess("Tu reporte se creó exitosamente", TYPE_SUCCESS);
}

const messageSuccess = (message, type) => {
    removeAllModals();

    const id_modal_loader = document.querySelector("#id_modal_loader");
    id_modal_loader.classList.add("class_modal_display");

    
    setTimeout(() => {
        id_modal_loader.classList.remove("class_modal_display");

        const id_modal_message_success = document.querySelector("#id_modal_message_success");
        id_modal_message_success.classList.add("class_modal_display");

        const id_modal_message = document.querySelector("#id_modal_message");

        removeElements(id_modal_message);

        const element = document.createElement("span");
        element.classList.add("class_modal_title");
        element.style.fontSize = "16px";
        
        element.textContent = `${message}`;

        const icon = document.createElement("i");
        icon.classList.add("fas");

        if (type === TYPE_SUCCESS) {
            icon.classList.add("fa-check-circle");
        }
        else {
            icon.classList.add("fa-times-circle");
        }
        
        id_modal_message.appendChild(icon);
        id_modal_message.appendChild(element);

        //elementFade(id_modal_message_success, FADE_OUT);
    }, 2000);
}

const userReports = async () => {

    const id_report_loader = document.querySelector("#id_report_loader");
    id_report_loader.classList.add("class_loader_display");

    const id_report_table = document.querySelector("#id_report_table");

    removeElements(id_report_table);

    const response = await axios({
        url: "/user_reports",
        method: "POST"
    });

    id_report_loader.classList.remove("class_loader_display");
}

const accountVinculated = async (event) => {
    event.preventDefault();

    const id_form_vinculation = document.querySelector("#id_form_vinculation");

    const form = new FormData(id_form_vinculation);

    const response = await axios({
        url: "/vinculation",
        method: "POST",
        data: Object.fromEntries(form.entries())
    })

    if (response.data.success === true) {
        elementFade(
        message = "Tu cuenta fue vinculada con éxito",
        message_type = TYPE_SUCCESS,
        effect = FADE_OUT
        );
    }
    else {
        elementFade(
            message = "Ocurrió un error al vincular tu cuenta",
            message_type = TYPE_ERROR,
            effect = FADE_OUT
        );
    }
}

const userNotification = () => {
    const id_notification_icon = document.querySelector("#id_notification_icon");
   
    checkNotificationsAmount();

    id_notification_icon.addEventListener("click", async () => {
        const response = await axios({
            method: "POST",
            url: "/notifications"
        });

        checkNotificationsAmount();

        const id_notification_menu = document.querySelector("#id_notification_menu");
        
        id_notification_menu.classList.toggle("panel_header_notification_menu_display");

        removeElements(id_notification_menu);

        let year, month, days, hours, minutes, seconds;

        for (let i = 0; i < response.data.length; i++) {
            

            const element_div_main = document.createElement("div");
            element_div_main.classList.add("panel_notification_container");
            
            const element_icon = document.createElement("i");
            element_icon.classList.add("fas");
            element_icon.classList.add(response.data[i].notification_icon);
            
            const element_div_title_container = document.createElement("div");
            element_div_title_container.classList.add("panel_notification_title_container");
            
            const element_div_title_main = document.createElement("div");
            element_div_title_main.classList.add("panel_notification_title_main");
            
            const element_span_title = document.createElement("span");
            element_span_title.classList.add("panel_notification_title");
            element_span_title.textContent = response.data[i].notification_title;
            
            const element_span_subtitle = document.createElement("span");
            element_span_subtitle.classList.add("panel_notification_subtitle");
            element_span_subtitle.textContent = response.data[i].notification_description;
            
            element_div_title_main.appendChild(element_span_title);
            element_div_title_main.appendChild(element_span_subtitle);
            element_div_title_container.appendChild(element_div_title_main);

            /*seconds = (Math.round(new Date().getTime() / 1000) - response.data[i].notification_unixtime);

            days = (seconds / 86400);
            hours = ((seconds / 3600) % 24);
            minutes = ((seconds / 60) % 60);

            console.log(`DÍAS: ${days}`);
            console.log(`hours: ${hours}`);
            console.log(`minutes: ${minutes}`);*/
            
            const element_span_date = document.createElement("span");
            element_span_date.classList.add("panel_notification_date");

            /*if (parseInt(days)) {
                element_span_date.textContent = `Hace ${days} día${(days === 1) ? "" : "s"}`;
            }
            else {
                if (parseInt(hours)) {
                    element_span_date.textContent = `Hace ${hours} día${(hours === 1) ? "" : "s"}`;
                }
                else if (parseInt(minutes)) {
                    element_span_date.textContent = `Hace ${minutes} día${(minutes === 1) ? "" : "s"}`;
                }
                else {
                    element_span_date.textContent = "Hace un instante";
                }
            }*/

            element_span_date.textContent = new Date(response.data[i].notification_date).toLocaleString();


            element_div_title_container.appendChild(element_span_date);
            
            element_div_main.appendChild(element_icon);
            element_div_main.appendChild(element_div_title_container);
            
            id_notification_menu.appendChild(element_div_main);
        }
    })
}

const checkNotificationsAmount = async () => {
    const response = await axios({
        method: "POST",
        url: "/notifications_amount"
    });

    let id_notification_num = document.querySelector("#id_notification_num");
    id_notification_num.textContent = response.data.length;
}

const checkElement = (element) => {
    return new Promise((resolve, reject) => {
        if (document.body.contains(element)) {
            resolve(true);
        }
        else {
            resolve(false);
        }
    })
}

const userChangePassword = async () => {
    const id_panel_change_password = document.querySelector("#id_panel_change_password");

    const element = await checkElement(id_panel_change_password);

    if (element === false) {
        return;
    }

    id_panel_change_password.addEventListener("click", async (event) => {
        event.preventDefault();

        const id_form_change_password = document.querySelector("#id_form_change_password");

        const form = new FormData(id_form_change_password);

        const response = await axios({
            method: "POST",
            url: "/change_password",
            data: Object.fromEntries(form.entries())
        })

        let array;

        if (response.data.success === true) {
            await elementFade(
                array = {
                    "message": "Tu contraseña fue cambiada con exito",
                    "message_type": "TYPE_SUCCESS",
                    "message_icon": "fa-check",
                    "message_background_color": "#1c9e38",
                    "effect": "FADE_OUT"
                }
            );
        }
        else {

            let error = [];
            
            response.data.error.forEach((str, num) => {
                error.push(str.msg);
            })


            elementFade(
                array = {
                    "message": "Ocurrió un error al cambiar tu contraseña",
                    "message_type": "TYPE_ERROR",
                    "message_errors_descriptions": error,
                    "message_icon": "fa-times",
                    "message_background_color": "#e67171",
                    "effect": "FADE_OUT",
                    "button_title": "Aceptar"
                }
            );
        }
    })
}

const adminEditUser = async (myArray) => {
    let array;

    const form = await elementFade(
        array = {
            "background": "white",
            "message": `Editar usuario ${myArray.name} ${myArray.surname} (#${myArray.id})`,
            "message_type": "TYPE_FORM",
            "message_background_color": "white",
            "effect": "FADE_OUT",
            "form_max_field": "4",
            "form_field_title": [
                `Nombre (${myArray.name})`,
                `Apellido (${myArray.surname})`,
                `Correo electrónico (${myArray.email})`,
                "Contraseña",
            ],
            "form_field_name": [
                "name",
                "surname",
                "email",
                "password",
            ],
            "form_field_type": [
                [ "input", "TYPE_TEXT", myArray.name ],
                [ "input", "TYPE_TEXT", myArray.surname ],
                [ "input", "TYPE_EMAIL", myArray.email ],
                [ "input", "TYPE_PASSWORD" ],
            ],
            "button_title": "Confirmar",
            "button_exit": 1
        }
    );

    if (form.length) {
        const formData = new FormData(form);

        formData.append("id", myArray.id);

        const response = await axios({
            method: "POST",
            url: "/edit_user",
            data: Object.fromEntries(formData.entries())
        })

        if (response.data.success === true) {
            elementFade(
                array = {
                    "message": "El usuario fue editado con éxito",
                    "message_type": "TYPE_SUCCESS",
                    "message_icon": "fa-check",
                    "message_background_color": "#1c9e38",
                    "effect": "FADE_OUT"
                }
            );
        }
        else {
            elementFade(
                array = {
                    "message": "Ocurrió un error al editar el usuario",
                    "message_type": "TYPE_ERROR",
                    "message_errors_descriptions": response.data.errors,
                    "message_icon": "fa-times",
                    "message_background_color": "#e67171",
                    "effect": "FADE_OUT",
                    "button_title": "Aceptar"
                }
            );
        }
    }
}

const adminNewUser = async () => {

    const id_panel_new_user = document.querySelector("#id_panel_new_user");

    const check = await checkElement(id_panel_new_user);

    if (check === false) {
        return;
    }

    id_panel_new_user.addEventListener("click", async () => {
        let year, month, day;
        year = new Array();
        month = new Array();
        day = new Array();

        for (var i = 1950; i <= new Date().getFullYear(); i++) {
            year.push(i);
        }

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
            "Novienbre",
            "Diciembre"
        ];
    
        for (i = 1; i <= MONTHS.length; i++) {
            month.push(MONTHS[i - 1]);
        }

        let array;

        const form = await elementFade(
            array = {
                "background": "white",
                "message": "Añadir un nuevo usuario",
                "message_type": "TYPE_FORM",
                "message_background_color": "white",
                "effect": "FADE_OUT",
                "form_max_field": "9",
                "form_field_title": [
                    `Nombre`,
                    `Apellido`,
                    `Correo electrónico`,
                    "Contraseña",
                    "Repetir contraseña",
                    "Sexo",
                    "Año",
                    "Mes",
                    "Día"
                ],
                "form_field_name": [
                    "name",
                    "surname",
                    "email",
                    "password",
                    "repeat_password",
                    "gender",
                    "birth_year",
                    "birth_month",
                    "birth_day"
                ],
                "form_field_type": [
                    [ "input", "TYPE_TEXT" ],
                    [ "input", "TYPE_TEXT" ],
                    [ "input", "TYPE_EMAIL" ],
                    [ "input", "TYPE_PASSWORD" ],
                    [ "input", "TYPE_PASSWORD" ],
                    [ "select", "TYPE_TEXT" ],
                    [ "select", "TYPE_SELECT_YEAR" ],
                    [ "select", "TYPE_SELECT_MONTH" ],
                    [ "select", "TYPE_SELECT_DAY" ]
                ],
                "form_field_options": [ 
                    [ "" ],
                    [ "" ],
                    [ "" ],
                    [ "" ],
                    [ "" ],
                    [ "Hombre", "Mujer" ],
                    [ "" ],
                    [ "" ],
                    [ "" ],
                ],
                "button_title": "Crear usuario",
                "button_exit": 1
            }
        );

        if (form.length) {
            const formData = new FormData(form);

            const response = await axios({
                method: "POST",
                url: "/registro",
                data: Object.fromEntries(formData.entries())
            })

            if (response.data.success === true) {
                await elementFade(
                    array = {
                        "message": "El usuario se ha creado con éxito",
                        "message_type": "TYPE_SUCCESS",
                        "message_icon": "fa-check",
                        "message_background_color": "#1c9e38",
                        "effect": "FADE_OUT"
                    }
                );

                location.reload(true);
            }
            else {
                elementFade(
                    array = {
                        "message": "Ocurrió un error al crear el usuario",
                        "message_type": "TYPE_ERROR",
                        "message_errors_descriptions": response.data.errors,
                        "message_icon": "fa-times",
                        "message_background_color": "#e67171",
                        "effect": "FADE_OUT",
                        "button_title": "Aceptar"
                    }
                );
            }
        }
    })
}

const adminGallery = async () => {
    const id_panel_new_image = document.querySelector("#id_panel_new_image");

    const check = await checkElement(id_panel_new_image);

    if (check === false) {
        return;
    }

    id_panel_new_image.addEventListener("click", async () => {
        let array;

        const form = await elementFade(
            array = {
                "background": "white",
                "message": "Subir archivo",
                "message_type": "TYPE_FORM",
                "message_background_color": "white",
                "effect": "FADE_OUT",
                "form_max_field": "1",
                "form_field_title": [
                    "Seleccionar archivo"
                ],
                "form_field_name": [
                    "image_file",
                ],
                "form_field_type": [
                    [ "input", "TYPE_FILE" ]
                ],
                "button_title": "Subir archivo",
                "button_exit": 1
            }
        );

        if (form.length) {

            
            const file = document.querySelector("#image_file");

            const formData = new FormData();

            for (let i = 0; i < file.files.length; i++) {
                formData.append("image_file", file.files[i]);
            }


            const response = await axios({
                method: "POST",
                url: "/upload",
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            let array;

            if (response.data.success === true) {
                await elementFade(
                    array = {
                        "message": `${response.data.uploaded} de ${response.data.uploaded + response.data.not_uploaded} archivos subidos correctamente`,
                        "message_type": "TYPE_SUCCESS",
                        "message_icon": "fa-check",
                        "message_background_color": "#1c9e38",
                        "effect": "FADE_OUT"
                    }
                );

                location.reload(true);
            }
            else {
                elementFade(
                    array = {
                        "message": "Ocurrió un error al subir los archivos",
                        "message_type": "TYPE_ERROR",
                        "message_errors_descriptions": [
                            "La imagen seleccionada no es una imagen",
                            "Error en el servidor",
                        ],
                        "message_icon": "fa-times",
                        "message_background_color": "#e67171",
                        "effect": "FADE_OUT",
                        "button_title": "Aceptar"
                    }
                );
            }
        }
    })
}

const adminDeleteImage = async () => {
    const id_panel_delete_image = document.querySelector("#id_panel_delete_image");
    
    const check = await checkElement(id_panel_delete_image);

    if (check === false) {
        return;
    }

    id_panel_delete_image.addEventListener("click", async () => {
        const files = await axios({
            method: "GET",
            url: "/images"
        });

        let array;

        const form = await elementFade(
            array = {
                "background": "white",
                "message": "Eliminar imágenes",
                "message_type": "TYPE_DELETE_FILE",
                "message_files": files,
                "message_background_color": "white",
                "effect": "FADE_OUT",
                "button_title": "Eliminar",
                "button_exit": 1
            }
        );

        if (form.length) {
            let array;

            const question = await elementFade(
                array = {
                    "message": `¿Estás seguro de elimnar estos ${form.length} archivo(s)?`,
                    "message_type": "TYPE_ANSWER",
                    "message_icon": "fa-times",
                    "message_background_color": "#e67171",
                    "effect": "FADE_OUT",
                    "questions": [
                        "Sí",
                        "No"
                    ]
                }
            );
            
            if (question === "Sí") {
                const response = await axios({
                    method: "DELETE",
                    url: "/delete",
                    data: form
                })

                if (response.data.success === true) {
                    await elementFade(
                        array = {
                            "message": "Los archivos seleccionados fueron eliminados con éxito",
                            "message_type": "TYPE_SUCCESS",
                            "message_icon": "fa-check",
                            "message_background_color": "#1c9e38",
                            "effect": "FADE_OUT"
                        }
                    );

                    location.reload(true);
                }
                else {
                    elementFade(
                        array = {
                            "message": "Ocurrió un error al eliminar el archivo",
                            "message_type": "TYPE_ERROR",
                            "message_errors_descriptions": [
                                "La imagen seleccionada no es una imagen",
                                "Error en el servidor",
                            ],
                            "message_icon": "fa-times",
                            "message_background_color": "#e67171",
                            "effect": "FADE_OUT",
                            "button_title": "Aceptar"
                        }
                    );
                }
            }
        }
    })
}

const adminDeleteUser = async (myArray) => {
    let array;

    const response = await elementFade(
        array = {
            "message": `¿Estás seguro de eliminar el usuario ${myArray.name} ${myArray.surname} (#${myArray.id})?`,
            "message_type": "TYPE_ANSWER",
            "message_icon": "fa-times",
            "message_background_color": "#e67171",
            "effect": "FADE_OUT",
            "questions": [
                "Sí",
                "No"
            ]
        }
    );

    if (response === "Sí") {
        const response = await axios({
            method: "DELETE",
            url: "/delete_user",
            data: {
                delete_id: myArray.id
            }
        })

        if (response.data.success === true) {
            await elementFade(
                array = {
                    "message": `El usuario ${myArray.name} ${myArray.surname} (#${myArray.id}) se eliminó correctamente`,
                    "message_type": "TYPE_SUCCESS",
                    "message_icon": "fa-check",
                    "message_background_color": "#1c9e38",
                    "effect": "FADE_OUT"
                }
            );

            location.reload(true);
        }
        else {
            elementFade(
                array = {
                    "message": `Ocurrió un error al eliminar el usuario #${myArray.id}`,
                    "message_errors_descriptions": [
                        "Error en el servidor"
                    ],
                    "message_type": "TYPE_ERROR",
                    "message_icon": "fa-check",
                    "message_background_color": "#1c9e38",
                    "effect": "FADE_OUT"
                }
            );
        }
    }
}

const adminRestoreUser = async (myArray) => {
    let array;

    const response = await elementFade(
        array = {
            "message": `¿Estás seguro de restaurar el usuario ${myArray.name} ${myArray.surname} #(${myArray.id})?`,
            "message_type": "TYPE_ANSWER",
            "message_icon": "fa-exclamation",
            "message_background_color": "#6262f8",
            "effect": "FADE_OUT",
            "questions": [
                "Sí",
                "No"
            ]
        }
    );

    if (response === "Sí") {
        const response = await axios({
            method: "PUT",
            url: "/restore_user",
            data: {
                restore_id: myArray.id
            }
        })

        if (response.data.success === true) {
            await elementFade(
                array = {
                    "message": `El usuario ${myArray.name} ${myArray.surname} #(${myArray.id}) se restauró correctamente`,
                    "message_type": "TYPE_SUCCESS",
                    "message_icon": "fa-check",
                    "message_background_color": "#1c9e38",
                    "effect": "FADE_OUT"
                }
            );

            location.reload(true);
        }
        else {
            elementFade(
                array = {
                    "message": `Ocurrió un error al restaurar el usuario ${myArray.name} ${myArray.surname} #(${myArray.id})`,
                    "message_errors_descriptions": [
                        "Error en el servidor"
                    ],
                    "message_type": "TYPE_ERROR",
                    "message_icon": "fa-check",
                    "message_background_color": "#1c9e38",
                    "effect": "FADE_OUT"
                }
            );
        }
    }
}

const adminUserList = async () => {
    const id_panel_table_users = document.querySelector("#id_panel_table_users");
    
    const check = await checkElement(id_panel_table_users);

    if (check === false) {
        return;
    }

    let array;

    const response = await axios({
        method: "POST",
        url: "/user_list"
    })

    console.log(response.data);

    createTable(
        array = {
            "element_id": "id_panel_table_users",
            "table_max_rows": 15,
            "table_title": [
                "AVATAR",
                "USUARIO",
                "EMAIL",
                "FECHA DE REGISTRO",
                "ÚLTIMO INGRESO"
            ],
            "table_array": response.data,
            "table_items": [
                [ "avatar", "TYPE_IMAGE" ],
                [ "user_name", "TYPE_TEXT" ],
                [ "email", "TYPE_TEXT" ],
                [ "date_register", "TYPE_DATE" ],
                [ "last_date", "TYPE_DATE" ]
            ],
            "table_buttons_group": [
                [ "Editar", "btn-primary", "adminEditUser(array.table_array[event.currentTarget.id])" ],
                [ "Eliminar", "btn-danger", "adminDeleteUser(array.table_array[event.currentTarget.id])" ]
            ],
            "table_page_default": 1
        }
    )
}