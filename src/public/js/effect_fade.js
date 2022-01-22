const removeElements = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

const removeAllModals = () => {
    const modal = document.getElementsByClassName("class_modal");

    for (var i = 0; i < modal.length; i++) {
        if (modal[i].classList.contains("class_modal_display")) {
            modal[i].classList.remove("class_modal_display");
        }
    }
}

const elementFade = (array) => {
    return new Promise(async (resolve, reject) => {
        removeAllModals();

        const id_modal_loader = document.querySelector("#id_modal_loader");
        id_modal_loader.classList.add("class_modal_display");

        const loader = new Promise((resolve, reject) => {
            setTimeout(() => {
                id_modal_loader.classList.remove("class_modal_display");
                resolve(true);
            }, 500);
        })

        await loader;

        const id_modal_message_success = document.querySelector("#id_modal_message_success");
        id_modal_message_success.classList.add("class_modal_display");

        const id_modal_message = document.querySelector("#id_modal_message");
        id_modal_message.setAttribute("class", "class_modal_head");
        removeElements(id_modal_message);

        if (array.button_exit === 1) {

            const exit_container = document.createElement("div");
            exit_container.classList.add("class_modal_exit");
            
            const exit = document.createElement("span");
            exit.innerHTML = "&times;";   
            
            exit.addEventListener("click", () => {
                removeAllModals();
            })
            
            exit_container.appendChild(exit);
            id_modal_message.appendChild(exit_container);
        }


        const element = document.createElement("span");
        element.classList.add("class_modal_title");
        element.style.fontSize = "16px";
        
        element.innerHTML = `${array.message}`;

        const icon = document.createElement("i");
        icon.classList.add("class_modal_icon");
        icon.classList.add("fas");

        switch(array.message_type) {
            case "TYPE_SUCCESS": {
                id_modal_message.style.backgroundColor = array.message_background_color;
                id_modal_message.style.color = "white";
                id_modal_message.style.fontWeigth = "bolder";

                icon.classList.add(array.message_icon);
                break;
            }
            case "TYPE_ANSWER": {
                id_modal_message.style.backgroundColor = array.message_background_color;
                id_modal_message.style.color = "white";
                id_modal_message.style.fontWeigth = "bolder";

                icon.classList.add(array.message_icon);
                break;
            }
            case "TYPE_ERROR": {
                id_modal_message.style.backgroundColor = array.message_background_color;
                id_modal_message.style.color = "white";
                id_modal_message.style.fontWeigth = "bolder";
                id_modal_message.style.height = "auto";

                icon.classList.add(array.message_icon);
                break;
            }
            case "TYPE_FORM": {
                id_modal_message.style.backgroundColor = array.message_background_color;
                id_modal_message.style.color = "black";
                id_modal_message.style.fontWeigth = "bolder";

                break;
            }
            case "TYPE_MESSAGE_READ": {
                id_modal_message.style.backgroundColor = array.message_background_color;
                id_modal_message.style.color = "black";
                id_modal_message.style.fontWeigth = "bolder";
                break;
            }
            case "TYPE_UPLOAD": {
                id_modal_message.style.backgroundColor = array.message_background_color;
                id_modal_message.style.color = "black";
                id_modal_message.style.fontWeigth = "bolder";
                break;
            }
            case "TYPE_DELETE_FILE": {
                id_modal_message.style.backgroundColor = array.message_background_color;
                id_modal_message.style.color = "black";
                id_modal_message.style.fontWeigth = "bolder";
                break;
            }
        }

        const color = window.getComputedStyle(id_modal_message).getPropertyValue("background-color");
        icon.style.color = color;
        
        id_modal_message.appendChild(icon);
        id_modal_message.appendChild(element);

        var opacity = window.getComputedStyle(id_modal_message_success).getPropertyValue("opacity");
        var opacity_default = opacity;

        const questions = new Promise((resolve, reject) => {
            switch(array.message_type) {
                case "TYPE_ANSWER": {
                    if (array.questions.length) {
                        const container = document.createElement("div");
                        container.classList.add("class_modal_answer");
                        
                        array.questions.forEach((res, num) => {
                            const question = document.createElement("span");
                            question.classList.add("class_modal_title");
                            question.setAttribute("id", res);
                            question.textContent = res;
                            
                            question.addEventListener("click", (ev) => {
                                const questionSelect = ev.currentTarget.getAttribute("id");
                                resolve(questionSelect);
                            })
                            
                            container.appendChild(question);
                        });
                        
                        id_modal_message.appendChild(container);
                    }

                    break;
                }
                case "TYPE_ERROR": {
                    if (typeof array.message_errors_descriptions !== "undefined") {
                        const br = document.createElement("br");

                        id_modal_message.appendChild(br);

                        let div;
                        div = document.createElement("div");
                        div.classList.add("panel_container_errors");

                        let span;
                        span = document.createElement("span");
                        span.classList.add("panel_error_title");

                        span.textContent = "Estos son algunos de los posibles errores";

                        div.appendChild(span);

                        id_modal_message.appendChild(div);

                        array.message_errors_descriptions.forEach((str) => {
                            div = document.createElement("div");
                            div.classList.add("panel_container_errors");
                            span = document.createElement("span");
                            span.textContent = str;

                            const icon = document.createElement("i");

                            icon.classList.add("panel_errors_icon");
                            icon.classList.add("fas");
                            icon.classList.add("fa-times");
                            
                            div.appendChild(icon);
                            div.appendChild(span);
                            
                            
                            id_modal_message.appendChild(div);
                        })

                        const button_container = document.createElement("div");
                        button_container.classList.add("form-group");

                        const button = document.createElement("button");
                        button.classList.add("btn");
                        button.classList.add("btn-warning");
                        button.textContent = array.button_title;

                        button.addEventListener("click", (event) => {
                            event.preventDefault();

                            resolve(true);
                        })

                        
                        button_container.appendChild(button);

                        id_modal_message.appendChild(br);
                        id_modal_message.appendChild(button_container);
                    }

                    break;
                }
                case "TYPE_FORM": {
                    if (array.form_max_field.length) {
                        const form = document.createElement("form");
                        form.classList.add("class_modal_type_form_container");
                        form.setAttribute("id", "id_array_type_form");

                        let field, i, j;

                        for (i = 0; i < parseInt(array.form_max_field); i++) {
                            const input_container = document.createElement("div");
                            input_container.classList.add("form-group");

                            const label = document.createElement("label");
                            label.textContent = array.form_field_title[i];

                            switch(array.form_field_type[i][0]) {
                                case "input": {
                                    field = document.createElement("input");
                                    field.classList.add("form-control");

                                    field.setAttribute("id", array.form_field_name[i]);
                                    field.setAttribute("name", array.form_field_name[i]);
                                    field.setAttribute("required", "true");

                                    switch(array.form_field_type[i][1]) {
                                        case "TYPE_TEXT": {

                                            field.setAttribute("type", "text");
                                            break;
                                        }
                                        case "TYPE_PASSWORD": {
                                            field.setAttribute("type", "password");
                                            break;
                                        }
                                        case "TYPE_EMAIL": {
                                            field.setAttribute("type", "email");
                                            break;
                                        }
                                        case "TYPE_FILE": {
                                            field.setAttribute("type", "file");
                                            field.setAttribute("multiple", "multiple");
                                            break;
                                        }
                                    }

                                    if (typeof array.form_field_type[i][2] !== "undefined" && array.form_field_type[i][2] !== "null") {
                                        field.setAttribute("value", array.form_field_type[i][2]);
                                    }

                                    break;
                                }
                                case "select": {
                                    field = document.createElement("select");
                                    field.classList.add("form-control");
                                    field.setAttribute("id", array.form_field_name[i]);
                                    field.setAttribute("name", array.form_field_name[i]);

                                    

                                    label.setAttribute("for", array.form_field_name[i]);

                                    switch(array.form_field_type[i][1]) {
                                        case "TYPE_SELECT_YEAR": {
                                            for (j = 1950; j <= new Date().getFullYear(); j++) {
                                                const option = document.createElement("option");
                                                
                                                option.setAttribute("value", `${j}`);
                                                option.textContent = `${j}`;
                                                field.appendChild(option);
                                            }

                                            field.addEventListener("change", () => {
                                                const years = document.querySelector("#birth_year");
                                                const month = document.querySelector("#birth_month");
                                                const days = document.querySelector("#birth_day");
                                                
                                                while (days.firstChild) {
                                                    days.removeChild(days.firstChild);
                                                }
                                                
                                                const max_days = new Date(years.value, month.value, 0).getDate();

                                                 for (j = 1; j <= max_days; j++) {
                                                    const option = document.createElement("option");
                                                    
                                                    option.setAttribute("value", `${j}`);
                                                    option.textContent = j;
                                                    days.appendChild(option);
                                                }
                                            })

                                            break;
                                        }
                                        case "TYPE_SELECT_MONTH": {
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
                                        
                                            for (j = 1; j <= MONTHS.length; j++) {
                                                const option = document.createElement("option");
                                                option.setAttribute("value", `${j}`);
                                                option.textContent = `${MONTHS[j - 1]}`;
                                        
                                                field.appendChild(option);
                                            }

                                            field.addEventListener("change", () => {
                                                const years = document.querySelector("#birth_year");
                                                const month = document.querySelector("#birth_month");
                                                const days = document.querySelector("#birth_day");
                                                
                                                while (days.firstChild) {
                                                    days.removeChild(days.firstChild);
                                                }
                                                
                                                const max_days = new Date(years.value, month.value, 0).getDate();

                                                 for (j = 1; j <= max_days; j++) {
                                                    const option = document.createElement("option");
                                                    
                                                    option.setAttribute("value", `${j}`);
                                                    option.textContent = j;
                                                    days.appendChild(option);
                                                }
                                            })

                                            break;
                                        }
                                        case "TYPE_SELECT_DAY": {
                                            //const days = new Date(year.value, month.value, 0).getDate();

                                            for (j = 1; j <= 31; j++) {
                                                const option = document.createElement("option");
                                                
                                                option.setAttribute("value", `${j}`);
                                                option.textContent = j;
                                                field.appendChild(option);
                                            }

                                            break;
                                        }
                                        default: {
                                            if (array.form_field_options.length > 0) {
                                                array.form_field_options[i].forEach((str) => {
                                                    const option = document.createElement("option");
                                                    option.setAttribute("value", str);
                                                    option.textContent = str;
                                                    
                                                    field.appendChild(option);
                                                })
                                            }

                                            break;
                                        }
                                    }

                                    /*if (array.form_field_options.length > 0) {
                                        array.form_field_options[i].forEach((str) => {
                                            const option = document.createElement("option");
                                            option.setAttribute("value", str);
                                            option.textContent = str;
                                            
                                            field.appendChild(option);
                                        })
                                    }*/

                                    break;
                                }
                                case "textarea": {
                                    field = document.createElement("textarea");
                                    field.classList.add("form-control");

                                    field.setAttribute("id", array.form_field_name[i]);
                                    field.setAttribute("name", array.form_field_name[i]);
                                    field.setAttribute("required", "true");

                                    switch(array.form_field_type[i][1]) {
                                        case "TYPE_TEXT": {

                                            field.setAttribute("type", "text");
                                            break;
                                        }
                                        case "TYPE_PASSWORD": {
                                            field.setAttribute("type", "password");
                                            break;
                                        }
                                    }

                                    if (typeof array.form_field_type[i][2] !== "undefined" && array.form_field_type[i][2] !== "null") {
                                        field.setAttribute("value", array.form_field_type[i][2]);
                                    }

                                    break;
                                }
                                case "select_image": {
                                    field = document.createElement("select");
                                    field.classList.add("form-control");
                                    field.setAttribute("id", array.form_field_name[i]);
                                    field.setAttribute("name", array.form_field_name[i]);

                                    label.setAttribute("for", array.form_field_name[i]);
                                    
                                    if (array.form_field_options.length > 0) {
                                        array.form_field_options[i].forEach((str) => {
                                            const option = document.createElement("option");
                                            option.style.backgroundImage = `/images/avatar/${str}`;
                                            
                                            field.appendChild(option);
                                        })
                                    }

                                    break;
                                }
                            }
                            
                            const br = document.createElement("br");
                            
                            input_container.appendChild(label);
                            input_container.appendChild(field);
                            input_container.appendChild(br);

                            form.appendChild(input_container);
                        }
                        
                        const button_container = document.createElement("div");
                        button_container.classList.add("form-group");

                        const button = document.createElement("button");
                        button.classList.add("btn");
                        button.classList.add("btn-primary");
                        button.textContent = array.button_title;

                        
                        button.addEventListener("click", (event) => {
                            event.preventDefault();
                            
                            const id_array_type_form = document.querySelector("#id_array_type_form");
                            resolve(id_array_type_form);
                        })
                        
                        button_container.appendChild(button);
                        
                        form.appendChild(button_container);
                        
                        id_modal_message.appendChild(form);
                    }

                    break;
                }
                case "TYPE_MESSAGE_READ": {
                    const div_container = document.createElement("div");
                    div_container.classList.add("panel_message_container");
                    
                    const img = document.createElement("img");
                    img.setAttribute("src", `/images/${array.message_data.message_avatar}`);

                    div_container.appendChild(img);

                    const div_user = document.createElement("div");
                    div_user.classList.add("panel_message_user_name");

                    const span = document.createElement("span");
                    span.textContent = array.message_data.message_user;

                    const email = document.createElement("span");
                    email.textContent = `<${array.message_data.message_email}>`;
                    email.style.color = "gray";

                    const date = document.createElement("span");
                    date.textContent = new Date(array.message_data.message_date).toLocaleString();
                    date.style.color = "gray";

                    div_user.appendChild(span);
                    div_user.appendChild(email);
                    div_user.appendChild(date);

                    const div_message = document.createElement("div");
                    div_message.classList.add("panel_message_description");

                    const message_body_title = document.createElement("span");
                    message_body_title.classList.add("panel_message_body_title");

                    message_body_title.innerHTML = "<i class='far fa-envelope'></i> MENSAJE<br><br>";

                    const message = document.createElement("span");
                    message.textContent = array.message_data.message_description;

                    div_message.appendChild(message_body_title);
                    div_message.appendChild(message);

                    div_container.appendChild(div_user);

                    id_modal_message.appendChild(div_container);
                    id_modal_message.appendChild(div_message);

                    break;
                }
                case "TYPE_DELETE_FILE": {
                    const div_container = document.createElement("div");
                    div_container.classList.add("panel_message_container");
                    div_container.classList.add("panel_table_container");

                    div_container.style.flexDirection = "column";

                    const files = array.message_files;

                    const table = document.createElement("table");
                    table.classList.add("table");

                    const thead = document.createElement("thead");

                    const tr = document.createElement("tr");

                    
                    const tables_titles = [
                        "",
                        "IMAGEN",
                        "NOMBRE",
                        "FECHA DE SUBIDA"
                    ];

                    tables_titles.forEach((str, num) => {

                        const th = document.createElement("th");
                        th.textContent = str;

                        if (num === 0) {
                            const div = document.createElement("div");
                            div.classList.add("form-check");

                            const input = document.createElement("input");
                            input.setAttribute("type", "checkbox");
                            input.classList.add("form-check-input");

                            input.addEventListener("click", (ev) => {
                                const id_check_images = document.querySelectorAll("input[id=id_check_images]");
                                let id_panel_files_selected = document.querySelector("#id_panel_files_selected");
                                
                                if (ev.currentTarget.checked === true) {
                                    id_check_images.forEach((str) => {
                                        str.checked = true;
                                    })

                                    id_panel_files_selected.textContent = `${id_check_images.length} archivo(s) seleccionado(s)`;
                                }
                                else {
                                    id_check_images.forEach((str) => {
                                        str.checked = false;
                                    })

                                    id_panel_files_selected.textContent = `0 archivo(s) seleccionado(s)`;
                                }
                            })

                            div.appendChild(input);

                            th.appendChild(div);
                        }
                        
                        tr.appendChild(th);
                    })
                    
                    thead.appendChild(tr);
                    table.appendChild(thead);

                    const tbody = document.createElement("tbody");

                    for (let i = 0; i < files.data.file_name.length; i++) {
                        const tr = document.createElement("tr");

                        const div = document.createElement("div");
                        div.classList.add("form-check");

                        const input = document.createElement("input");
                        input.setAttribute("id", "id_check_images");
                        input.setAttribute("name", files.data.file_name[i]);
                        input.setAttribute("type", "checkbox");
                        input.classList.add("form-check-input");

                        input.addEventListener("click", () => {
                            const id_check_images = document.querySelectorAll("input[id=id_check_images][type=checkbox]:checked");

                            const id_panel_files_selected = document.querySelector("#id_panel_files_selected");
                            id_panel_files_selected.textContent = `${id_check_images.length} archivo(s) seleccionado(s)`;
                        })

                        div.appendChild(input);


                        const td_input = document.createElement("td");

                        td_input.appendChild(div);

                        const img = document.createElement("img");
                        img.setAttribute("src", `/images/avatar/${files.data.file_name[i]}`);

                        const td_image = document.createElement("td");

                        td_image.appendChild(img);

                        const name = document.createElement("span");
                        name.textContent = files.data.file_name[i];

                        const td_name = document.createElement("td");
                        td_name.setAttribute("id", "panel_images_name");

                        td_name.appendChild(name);

                        const date = document.createElement("span");
                        date.textContent = files.data.file_date[i];

                        const td_date = document.createElement("td");
                        td_date.setAttribute("id", "panel_images_date");

                        td_date.appendChild(date);

                        tr.appendChild(td_input);
                        tr.appendChild(td_image);
                        tr.appendChild(td_name);
                        tr.appendChild(td_date);
                        tbody.appendChild(tr);
                    }

                    table.appendChild(tbody);
                    div_container.appendChild(table);

                    const button_container = document.createElement("div");
                    button_container.classList.add("form-group");

                    const button = document.createElement("button");
                    button.classList.add("btn");
                    button.classList.add("btn-danger");
                    button.textContent = array.button_title;

                    
                    button.addEventListener("click", (event) => {
                        event.preventDefault();
                        
                        //const id_array_type_form = document.querySelector("#id_array_type_form");
                        const id_check_images = document.querySelectorAll("input[id=id_check_images][type=checkbox]:checked");

                        const checkboxes = new Array();

                        id_check_images.forEach((str) => {
                            checkboxes.push(str.name);
                        })
                        
                        resolve(checkboxes);
                    })
                    
                    button_container.appendChild(button);

                    id_modal_message.appendChild(div_container);

                    const br = document.createElement("br");
                    
                    const span = document.createElement("span");
                    span.setAttribute("id", "id_panel_files_selected");
                        
                    id_modal_message.appendChild(br);
                    id_modal_message.appendChild(span);
                    id_modal_message.appendChild(button_container);
                    
                    break;
                }
                default: {
                    resolve(true);
                    break;
                }
            }
        })
        
        const checkQuestions = await questions;

        setTimeout(() => {
            switch(array.effect) {
                case "FADE_IN": {
                    const fadeout = setInterval(() => {
                        if (opacity >= 1) {
                            clearInterval(fadeout);
        
                            id_modal_message_success.style.opacity = opacity_default;
                            
                            if (id_modal_message_success.classList.contains("class_modal_display")) {
                                id_modal_message_success.classList.remove("class_modal_display");
                            }
                            
                            resolve(questions);
                            return;
                        }
                        
                        opacity += 0.02;
                        id_modal_message_success.style.opacity = opacity;
                    }, 5);
        
                    break;
                }
                case "FADE_OUT": {
                    const fadeout = setInterval(() => {
                        if (opacity <= 0.0) {
                            clearInterval(fadeout);
        
                            id_modal_message_success.style.opacity = opacity_default;
                            
                            if (id_modal_message_success.classList.contains("class_modal_display")) {
                                id_modal_message_success.classList.remove("class_modal_display");
                            }
                            
                            resolve(questions);
                            return;
                        }
                        
                        opacity -= 0.02;
                        id_modal_message_success.style.opacity = opacity;
                    }, 5);
        
                    break;
                }
            }
        }, 250);
    });
}

export { elementFade, removeAllModals, removeElements };