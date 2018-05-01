This is the example blog app from my [May 2018 talk](https://www.meetup.com/djangoboston/events/249614046/) at Django Boston on Django on **Django APIs + React**.

Slides are available online at [https://tinyurl.com/drf-react](https://tinyurl.com/drf-react).

## Local setup

```
$ cd ~Desktop
$ git clone https://github.com/wsvincent/djangoboston-drf-react.git
$ cd djangoboston-drf-react/
$ cd backend
$ pipenv install
$ pipenv shell
(env) $ python manage.py runserver
```

Navigate to [http://127.0.0.1:8000/api/v1/](http://127.0.0.1:8000/api/v1/) to see DRF's browsable API.

In a *second* command-line console:

```
$ cd ~Desktop/djangoboston-drf-react
$ cd frontend
$ npm start
```

Navigate to [http://localhost:3000/](http://localhost:3000/).

---

## Instructions to build app from scratch

### Setup

```
$ mkdir code
$ mkdir backend && cd backend
$ pipenv install django
$ pipenv shell
$ django-admin startproject blog_project .
$ python manage.py startapp posts
```

### Posts app
Add `posts` app to `blog_project/settings.py` file.

```python
# blog_project/settings.py
INSTALLED_APPS = [
    ...
    'posts',
]
```

Create the new database.

```
$ python manage.py migrate
```

Create our database model.

```python
# posts/models.py
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=50)
    body = models.TextField()

def __str__(self):
        return self.title
```

Then create a new migrations file and migrate the database again with our changes.

```
$ python manage.py makemigrations posts
$ python manage.py migrate
```

Update `posts/admin.py` so the `posts` app is visible in the admin.

```python
# posts/admin.py
from django.contrib import admin

from .models import Post

admin.site.register(Post)
```

Create a superuser account so we can log in to the admin.

```
$ python manage.py createsuperuser
```

In a web browser open the Django admin panel [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) with superuser account and add blog posts.

### Django Rest Framework

Install Django Rest Framework:

```
$ pipenv install djangorestframework
```

Set permissions to `AllowAny` and add app.

```python
# blog_project/settings.py
INSTALLED_APPS = [
    ...
    'rest_framework',
    'posts',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}
```

Update project-level URLs.

```python
# blog_project/urls.py
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('posts.urls')),
```

Update app-level URLs.

```python
# posts/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.PostList.as_view(), name='post_list'),
    path('<int:pk>/', views.PostDetail.as_view(), name='post_detail'),
]
```

Update `posts/views.py`.

```python
# posts/views.py
from rest_framework import generics
from . import models
from . import serializers

class PostList(generics.ListAPIView):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
```

Add `posts/serializers.py` file.

```python
# posts/serializers.py
from rest_framework import serializers
from . import models

class PostSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ('id', 'title', 'body',)
        model = models.Post
```

We're done! Now use DRF's browsable API.

```
(env) $ python manage.py runserver
```

Here are our endpoints:

```
(GET) http://127.0.0.1:8000/api/v1/		
-> List of all blog posts (a “collection”)

(POST) http://127.0.0.1:8000/api/v1/
	-> Create a new blog post

(GET) http://127.0.0.1:8000/api/v1/<id>
	-> Get single blog post with <id>

(DELETE) http://127.0.0.1:8000/api/v1/<id>
	-> Delete single blog post with <id>

(PUT) http://127.0.0.1:8000/api/v1/<id>
	-> Update single blog post with <id>
```

### Add CORS

We need to add CORS so that our React frontend can access the API.

```
(env) $ pipenv install django-cors-headers
```

```python
# blog_project/settings.py
INSTALLED_APPS = [
    ...
    'rest_framework',
    'corsheaders', # new
    'posts',
]

MIDDLEWARE = [
    # make sure these 2 are at the top!
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

CORS_ORIGIN_WHITELIST = (
    'localhost:3000/'
)
```

Make sure the local Django server is running on port 8000.

## React

Open a *new* command line console so there are two open. Navigate to base directory `blog_project/`, `manage.py`. Install React if needed.

```
$ npx create-react-app frontend
$ cd frontend
$ npm start
```

Go to [http://localhost:3000/](http://localhost:3000/) to see the React Welcome page.

Overall structure now is:

```
frontend
    ├── public
    ├── src
        ├── App.js
backend
    ├── backend_project
        ├── settings.py
        ├── urls.py
    ├── posts
        ├── models.py
        ├── serializers.py
        ├── views.py
        ├── urls.py
```

We only need to update the `src/App.js` file so that it *fetches* our API and then uses `map()` to display all blog posts.

```javascript
// src/App.js
import React, { Component } from 'react';

class App extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/');
      const posts = await res.json();
      this.setState({
        posts
      });
    } catch (e) {
      console.log(e);
    }
  }
  render() {
      return (
        <div>
          {this.state.posts.map(post => (
            <div key={post.id}>
              <h1>{post.title}</h1>
              <span>{post.body}</span>
            </div>
          ))}
        </div>
      );
    }
  }
}

export default App;
```

And we're done. We now can add/edit/delete blog posts via the browsable API and will see the output change in our React app in real-time.
