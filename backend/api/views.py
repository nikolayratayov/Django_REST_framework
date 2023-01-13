from django.http import JsonResponse
import json
from products.models import Product
from products.serializers import ProductSerializer
from django.forms.models import model_to_dict
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET'])
def api_home(request):
    instance = Product.objects.all().order_by('?').first()
    data = {}
    if instance:
        # data = model_to_dict(instance, fields=['id', 'title', 'sale_price'])
        data = ProductSerializer(instance).data
    return Response(data)