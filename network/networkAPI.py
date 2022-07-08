from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.http import JsonResponse
from .models import User,Post

import json

def user(request, user_id):

	u = User.objects.get(id=user_id)

	own_profile = True if u == request.user else False

	following_user = u.followers.filter(id__in=f'{request.user.id}')	

	following_user = True if following_user else False	

	return JsonResponse({'username' : u.username,
						 'user_id' : u.id,
    					 'followers': u.followers.count(),
    					 'following': u.following.count(),
    					 'own_profile' : own_profile,
    					 'following_user': following_user,
    					})

def post(request, post_id):

	p = Post.objects.get(id=post_id)	

	editable = True if p.user == request.user else False	

	liked = p.likes.filter(id__in=f'{request.user.id}')

	liked = True if liked else False	

	return JsonResponse({'created_at' : p.created_at.strftime("%c"),
						 'username' : p.user.username,
						 'user_id' : p.user.id,
						 'content' : p.content,
						 'likes' : p.likes.count(),
						 'editable': editable,
						 'liked' : liked,
						 })

def postsPage(request,page_num):

	num_posts = 10

	#GET parameters
	by_following = request.GET.get('following', False)
	by_user = request.GET.get('user_id', False)
	
	if by_user:
		posts_objets = Post.objects.filter(user=by_user)
	elif by_following:
		posts_objets = Post.objects.filter(user__in=
							request.user.following.all())
	else:
		posts_objets = Post.objects.all()


	paginator = Paginator(posts_objets.order_by('-created_at'), num_posts)
	posts = paginator.page(page_num)

	posts_ids = []

	for post in posts:
		posts_ids.append(post.id)	

	return JsonResponse({'num_posts': num_posts,
						 'num_pages': paginator.num_pages,
						 'posts_id' : posts_ids,
						 'by_following': by_following})

def postLike(request, post_id):

	post = Post.objects.get(id=post_id)

	liked = post.likes.filter(id__in=f'{request.user.id}')

	if liked:
		post.likes.remove(request.user)	
		return JsonResponse({'response' : f'Like has been removed at {post_id}'})	
	
	post.likes.add(request.user)
	return JsonResponse({'response' : f'Like has been added at {post_id}'})	


def postFollower(request, user_id):

	user = User.objects.get(id=user_id)

	following = user.followers.filter(id__in=f'{request.user.id}')

	if following:
		user.followers.remove(request.user)	
		return JsonResponse({'response' : f'Follower has been removed at {user_id}'})	
	
	user.followers.add(request.user)
	return JsonResponse({'response' : f'Follower has been added at {user_id}'})	

@csrf_exempt
def editPost(request):

	body_unicode = request.body.decode('utf-8')
	body = json.loads(body_unicode)

	p = Post.objects.get(id=body['post_id'])	

	if request.user != p.user:
		return JsonResponse({'response': 'You cannot edit this post!'})

	p.content = body['content']	
	p.save()		

	return JsonResponse({'response': 'Post has been edited'}) 

@csrf_exempt
def newPost(request):
	if not request.user.is_authenticated:
		return JsonResponse({'response': 'You cannot add a new post!'})

	body_unicode = request.body.decode('utf-8')
	body = json.loads(body_unicode)

	p = Post.objects.create(user = request.user,content=body['content'])

	p.save()		

	return JsonResponse({'response': 'Post has been added'}) 