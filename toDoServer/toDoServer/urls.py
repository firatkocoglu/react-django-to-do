"""toDoServer URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import posixpath
from pathlib import Path

from django.utils._os import safe_join
from django.views.static import serve as static_serve

from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def serve_react(request, path, document_root=None):
    path = posixpath.normpath(path).lstrip("/")
    fullpath = Path(safe_join(document_root, path))
    if fullpath.is_file():
        return static_serve(request, path, document_root)
    else:
        return static_serve(request, "index.html", document_root)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tasks.urls')),
    path('auth/', include('djoser.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),  
    re_path(
            r"^(?P<path>.*)$",
            serve_react,
            {"document_root": settings.REACT_APP_BUILD_PATH},
        ),
]
