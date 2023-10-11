from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .serializers import TaskSerializer
from .models import Task
from django.shortcuts import get_object_or_404


# Create your views here.
class TaskViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        user_id = request.user.id
        task_list = Task.objects.filter(user_id = user_id)
        serialized_list = TaskSerializer(task_list, many=True)
        return Response(serialized_list.data, status=status.HTTP_200_OK)
    
    def create(self, request):
        data = {**request.data,  'user_id': request.user.id}
        serialized_task = TaskSerializer(data=data)
        serialized_task.is_valid(raise_exception=True)
        serialized_task.save()
        return Response(serialized_task.data, status=status.HTTP_201_CREATED)
    
    def partial_update(self, request, pk):
        task = get_object_or_404(Task, id=pk)
        serialized_task = TaskSerializer(task, request.data, partial=True)
        serialized_task.is_valid(raise_exception=True)
        self.perform_update(serialized_task)
        return Response(serialized_task.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, pk):
        task = get_object_or_404(Task, id=pk)
        self.perform_destroy(task)
        return Response('Task deleted', status=status.HTTP_200_OK)