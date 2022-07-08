from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField(settings.AUTH_USER_MODEL, 
    	related_name = "followers")    

class Post(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")	
	created_at = models.DateTimeField(auto_now_add=True)	
	content = models.CharField(max_length=140)	
	likes = models.ManyToManyField(User, related_name="likes")
