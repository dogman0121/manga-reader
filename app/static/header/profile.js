class ProfileMenu extends Component {
    html() {
        return `
            <div class="dropdown-menu profile-menu">
                <a href="/profile/${DATA.user.id}" class="profile-menu__option">
                    <img style="width:18px" src="/static/base/images/profile.svg" class="profile-menu__icon">
                    Профиль
                </a>
                <a href="/profile/${DATA.user.id}/edit" class="profile-menu__option">
                    <img style="width:19px" src="/static/base/images/settings.svg" class="profile-menu__icon">
                    Настройки
                </a>
                <a href="/manga/add" class="profile-menu__option">
                    <img src="/static/header/images/plus.svg" class="profile-menu__icon">
                    Добавить тайтл
                </a>
                <div class="profile-menu__theme">
                    <div class="profile-menu__option">
                        <svg class="profile-menu__icon" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Environment / Sun">
                                <path id="Vector" d="M12 4V2M12 20V22M6.41421 6.41421L5 5M17.728 17.728L19.1422 19.1422M4 12H2M20 12H22M17.7285 6.41421L19.1427 5M6.4147 17.728L5.00049 19.1422M12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17Z" stroke="#A9A9A9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                        </svg>
                        Тема
                    </div>
                    <div class="theme-switcher">
                        <input ${localStorage.getItem("color-scheme") === "light" ? "checked " : ""} type="checkbox" id="hide-checkbox">
                        <label for="hide-checkbox" class="toggle">
                            <span class="toggle-button">
                                <span class="crater crater-1"></span>
                                <span class="crater crater-2"></span>
                                <span class="crater crater-3"></span>
                                <span class="crater crater-4"></span>
                                <span class="crater crater-5"></span>
                                <span class="crater crater-6"></span>
                                <span class="crater crater-7"></span>
                            </span>
                            <span class="star star-1"></span>
                            <span class="star star-2"></span>
                            <span class="star star-3"></span>
                            <span class="star star-4"></span>
                            <span class="star star-5"></span>
                            <span class="star star-6"></span>
                            <span class="star star-7"></span>
                            <span class="star star-8"></span>
                        </label>
                    </div>
                </div>
                <a href="/auth/logout" class="profile-menu__option">
                    <img src="/static/base/images/exit.svg" class="profile-menu__icon">
                    Выйти
                </a>
            </div>
        `
    }

    events(element) {
        console.log(element.querySelector(".theme-switcher > input"));
        element.querySelector(".theme-switcher > input").addEventListener("input", function (event){
            console.log(1234);
        if (event.target.checked)
            setColorScheme("light");
        else
            setColorScheme("dark");
    })

    }
}

document.querySelector(".dropdown-button").addEventListener("click", function () {
    new Dropdown(document.querySelector(".dropdown-button"), new ProfileMenu()).show();
})