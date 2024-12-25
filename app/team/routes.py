from app.team import bp
from flask import  request, redirect, url_for
from flask_login import current_user
from app.team.forms import AddTeamForm
from app.models import Team, User
from app.utils import render


@bp.route("/<int:team_id>")
def get_team(team_id):
    team = Team.get(team_id)
    return render("team/team.html", user=current_user, team=team)


@bp.route("/add", methods=["GET", "POST"])
def add_team():
    form = AddTeamForm()
    if form.validate_on_submit():
        team = Team()
        team.name = form.name.data
        team.about = form.about.data
        team.leader_id = current_user.id
        team.vk_link = form.vk_link.data
        team.discord_link = form.discord_link.data
        team.telegram_link = form.telegram_link.data
        team.add()

        current_user.team_id = team.id
        current_user.update()

        if request.files["poster"].filename != '':
            request.files["poster"].save(f"app/static/media/teams/{team.id}.jpg")

        return redirect(url_for("team.get_team", team_id=team.id))

    return render("team/add_team.html", form=form, user=current_user, mode="add")


@bp.route("/<int:team_id>/edit", methods=["GET", "POST"])
def edit_team(team_id):
    form = AddTeamForm()
    team = Team.get(team_id)
    if form.validate_on_submit():
        team.name = form.name.data
        team.about = form.about.data
        team.vk_link = form.vk_link.data
        team.discord_link = form.discord_link.data
        team.telegram_link = form.telegram_link.data
        team.update()

        if request.files["poster"].filename != '':
            request.files["poster"].save(f"app/static/media/teams/{team.id}.jpg")

        return redirect(url_for("team.get_team", team_id=team.id))

    form.name.data = team.name
    form.about.data = team.about
    form.vk_link.data = team.vk_link
    form.discord_link.data = team.discord_link
    form.telegram_link.data = team.telegram_link

    return render("team/add_team.html", form=form, user=current_user, team=team, mode="edit")


@bp.route("<int:team_id>/leave")
def leave_team(team_id):
    team = Team.get(team_id)
    if team.leader_id == current_user.id:
        team.delete()
        return redirect(url_for("profile.get_profile", profile_id=current_user.id))
    return redirect(url_for("team.get_team", team_id=team_id))


@bp.route("add_member")
def add_member():
    member_id = int(request.args.get("member_id"))
    member = User.get_by_id(member_id)
    member.add_team(current_user.team_id)
    return redirect(url_for("profile.get_profile", profile_id=member_id))


@bp.route("remove_member")
def remove_member():
    member_id = int(request.args.get("member_id"))
    member = User.get_by_id(member_id)
    member.remove_team()
    return redirect(url_for("profile.get_profile", profile_id=member_id))
