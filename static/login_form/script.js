function register(){
    let registerLink = document.querySelector(".register__link");
    registerLink.addEventListener("click", function(event) {
        let form = document.querySelector(".form");
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set("section", "register");
        window.location.search = searchParams.toString();
        form.innerHTML = `
        <h1>Регистрация</h1>
        <div class="input-box">
            <input type="text" name="login" placeholder="Логин">
            <img class="input-box__images" src="static/login_form/images/user.svg">
        </div>
        <div class="input-box">
            <input type="email" name="email" placeholder="E-mail">
            <img class="input-box__images" src="static/login_form/images/email.svg">
        </div>
        <div class="input-box">
            <input type="password" name="password" placeholder="Пароль">
            <img class="input-box__images" src="static/login_form/images/lock.svg">
        </div>
        <button type="submit" class="btn">Зарегистрироваться</button>
        <div class="login">
            <p>Нет учетной записи? <a class="login__link">Войти</a></p>
        </div>
        `;
        event.preventDefault();
        login();
    });
}

function login(){
    let loginLink = document.querySelector(".login__link");
    loginLink.addEventListener("click", function(event){
        let form = document.querySelector(".form");
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set("section", "login");
        window.location.search = searchParams.toString();
        form.innerHTML = `
        <h1>Авторизация</h1>
        <div class="input-box">
            <input type="text" name="login" placeholder="Логин">
            <img class="input-box__images" src="static/login_form/images/user.svg">
        </div>
        <div class="input-box">
            <input type="password" name="password" placeholder="Пароль">
            <img class="input-box__images" src="static/login_form/images/lock.svg">
        </div>
        <div class="remember-forgot">
            <label><input type="checkbox">Запомнить меня</label>
            <a>Забыли пароль?</a>
        </div>
        <button type="submit" class="btn">Войти</button>
        <div class="register">
            <p>Нет учетной записи? <a class="register__link">Зарегистрироваться</a></p>
        </div>
        `;
        event.preventDefault();
        register();
    })
}