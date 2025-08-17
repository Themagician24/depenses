from django.contrib import admin
from django.urls import include, path

from django.views.generic import RedirectView



urlpatterns = [
    # Routes de l’API
    path("api/", include("api.urls"))
]
