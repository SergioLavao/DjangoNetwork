from django.urls import path

from . import views, networkAPI

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("<int:user_id>", views.userpage, name="user"),
    path("api/user/<int:user_id>", networkAPI.user, name="API_user"),
    path("api/post/<int:post_id>", networkAPI.post, name="API_post"),
    path("api/page/<int:page_num>", networkAPI.postsPage, name="API_postsPage"),
    path("api/like/<int:post_id>", networkAPI.postLike, name="API_likePost"),
    path("api/follow/<int:user_id>", networkAPI.postFollower, name="API_followUser"),
    path("api/newPost", networkAPI.newPost, name="API_newPost"),
    path("api/edit", networkAPI.editPost, name="API_editPost"),
]
