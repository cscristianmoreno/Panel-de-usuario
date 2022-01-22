const openMenu = () => {
    const menu_user = document.querySelector("#menu_user");
    menu_user.classList.toggle("menu_footer_user_display");
}

const userPanel = () => {

    const menu_user = document.querySelector("#menu_user");
    menu_user.classList.toggle("menu_footer_user_display");

    const class_modal = document.querySelector("#modal");
    class_modal.classList.add("class_modal_display");

    setTimeout(() => {
        location.replace("/panel");
    }, 2000);
}

const userLogout = async () => {
    const class_modal = document.querySelector("#modal");
    class_modal.classList.add("class_modal_display");

    const menu_user = document.querySelector("#menu_user");
    menu_user.classList.toggle("menu_footer_user_display");

    const response = await axios({
        method: "DELETE",
        url: "/session"
    })

    if (response) {
        class_modal.classList.remove("class_modal_display");
        location.replace("/panel");
    }
}