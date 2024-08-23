register();

function register(){
    let registerLink = document.querySelector(".register__link");
    registerLink.addEventListener("click", function(event) {
        let form = document.querySelector(".form");
        form.action = "login";
        form.innerHTML = `
        <h1>Регистрация</h1>
        <div class="input-box">
            <input type="text" placeholder="Логин">
            <img class="input-box__images" src="user.svg">
        </div>
        <div class="input-box">
            <input type="email" placeholder="E-mail">
            <img class="input-box__images" src="email.svg">
        </div>
        <div class="input-box">
            <input type="password" placeholder="Пароль">
            <img class="input-box__images" src="lock.svg">
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
        form.action = "register";
        form.innerHTML = `
        <h1>Авторизация</h1>
        <div class="input-box">
            <input type="text" placeholder="Логин">
            <img class="input-box__images" src="user.svg">
        </div>
        <div class="input-box">
            <input type="password" placeholder="Пароль">
            <img class="input-box__images" src="lock.svg">
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