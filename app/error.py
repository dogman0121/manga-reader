from app.utils import render


def register_error_handlers(app):
    app.register_error_handler(404, error_404)
    app.register_error_handler(500, error_500)


def error_404(error):
    return render("errors/404.html")


def error_500(error):
    return "500"
