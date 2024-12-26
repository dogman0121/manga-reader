from flask import render_template
from flask_login import current_user
import json


def render(template_path, **kwargs):
    if "json" in kwargs:
        jsn = kwargs["json"]
    else:
        jsn = {}

    if current_user.is_authenticated:
        jsn["user"] = current_user.to_dict()
    else:
        jsn["user"] = {}

    kwargs["json"] = json.dumps(jsn, ensure_ascii=False)

    return render_template(template_path, **kwargs)