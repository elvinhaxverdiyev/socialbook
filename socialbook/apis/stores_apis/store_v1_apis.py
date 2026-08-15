from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from socialbook.pagination import DefaultPagination
from stores.models.store_models import Store
from stores.serializers.store_serializers import StoreSerializer


class StoreListAPIView(APIView):
    """
    GET /api/v1/stores/ — `StoresPage`.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        stores = Store.objects.for_list()

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(stores, request, view=self)
        serializer = StoreSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class StoreDetailAPIView(APIView):
    """
    GET /api/v1/stores/<id>/ — `StoreDetailPage`.
    """

    permission_classes = [AllowAny]

    def get(self, request, store_id):
        store = get_object_or_404(Store.objects.for_list(), pk=store_id)
        return Response(StoreSerializer(store, context={'request': request}).data)


class StorePostsAPIView(APIView):
    """
    GET /api/v1/stores/<id>/posts/ — mağazanın elanları.
    """

    permission_classes = [AllowAny]

    def get(self, request, store_id):
        from users.models.user_posts import Post
        from users.serializers.user_post_serializers import PostSerializer

        get_object_or_404(Store, pk=store_id)
        posts = Post.objects.filter(store_id=store_id).for_feed(request.user)

        paginator = DefaultPagination()
        page = paginator.paginate_queryset(posts, request, view=self)
        serializer = PostSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
