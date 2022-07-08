from django.db.models import Max
from django.test import TestCase, Client

from .models import User, Post

# Create your tests here.
class PostTestCase(TestCase):

	def setUp(self):

		#Create users
		u1 = User.objects.create_user(
							username='User1', 
							email='user1@mail.com',
							password='dummy')	
		u2 = User.objects.create_user(
							username='User2', 
							email='user2@mail.com',
							password='dummy')	
		u1.following.add(u2)

		#Create posts
		p1 = Post.objects.create(
							user=u1, 
							content='AAA')	

		p2 = Post.objects.create(
							user=u2, 
							content='BBB')
		p2.likes.add(u1)	
		p2.likes.add(u2)	

	def test_valid_users(self):
		u1 = User.objects.get(id=1)
		self.assertEqual(u1.following.count(),1)
		self.assertEqual(u1.followers.count(),0)

		u2 = User.objects.get(id=2)
		self.assertEqual(u2.followers.count(),1)
		self.assertEqual(u2.following.count(),0)

		u2.followers.remove(u1)
		u2.following.add(u1)

		self.assertEqual(u2.followers.count(),0)
		self.assertEqual(u2.following.count(),1)		


	def test_valid_posts(self):
		p1 = Post.objects.get(id=1)
		self.assertEqual(p1.likes.count(),0)			

		p2 = Post.objects.get(id=2)
		self.assertEqual(p2.likes.count(),2)			

	def test_following_posts(self):
		u1 = User.objects.get(id=1)
		
		posts = Post.objects.filter(user__in=u1.following.all())
		self.assertEqual(posts.count(),1)

	def test_like(self):
		u1 = User.objects.get(id=1)
		p2 = Post.objects.get(id=2)
		self.assertEqual(p2.likes.count(),2)			

		liked = p2.likes.filter(id__in=f'{u1.id}')

		self.assertTrue(liked)					