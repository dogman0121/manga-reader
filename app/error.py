from app.utils import render


def register_error_handlers(app):
    app.register_error_handler(404, error_404)
    app.register_error_handler(500, error_500)


def error_404(error):
    return render("error.html",
                  error_title="404 Not found",
                  error_number="404",
                  error_description="Данная страница не найдена")


def error_500(error):
    return render("error.html",
                  error_title="500 Internal error",
                  error_number="500",
                  error_description="Произошла ошибка на сервере.")
