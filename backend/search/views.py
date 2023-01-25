import rest_framework.templatetags.rest_framework
from rest_framework import generics
from products.models import Product
from products.serializers import ProductSerializer
from . import client
from rest_framework.response import Response


class SearchListView(generics.GenericAPIView):
    def get(self, *args, **kwargs):
        user = None
        if self.request.user.is_authenticated:
            user= self.request.user.username
        query = self.request.GET.get('q')
        public = str(self.request.GET.get('public')) != '0'

        tag = self.request.GET.get('tag') or None
        if not query:
            return Response('', status=400)
        results = client.perform_search(query, tags=tag, user=user, public=public)
        return Response(results)


class SearchListOldView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)
        q = self.request.GET.get('q')
        results = Product.objects.none()
        if q is not None:
            user = None
            if self.request.user.is_authenticated:
                user = self.request.user
            results = qs.search(q, user=user)
        return results
