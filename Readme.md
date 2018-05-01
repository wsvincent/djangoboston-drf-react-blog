This is the example blog app of Django Rest Framework + React accompanying a May 2018 talk at Django Boston.

Slides are [available online](https://docs.google.com/presentation/d/16IXgaqbjNLpwyrIPZU0FcIgm6e6DlilXyIQB2bXSsY4/edit?usp=sharing).

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

```
$ pipenv install django
$ pipenv shell
$ django-admin startproject blog_project .
$ python manage.py startapp posts
```

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

Then create the React frontend.

```
