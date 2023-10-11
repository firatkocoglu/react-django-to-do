from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.TextField()
    due = models.DateField(blank=True, null=True, default=datetime.now().date)
    important = models.BooleanField(default=False)
    complete = models.BooleanField(default=False)