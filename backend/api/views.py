from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.cache import cache
from .utils import get_godpeople_verse

@api_view(['GET'])
def daily_verse(request):
    cached_verse = cache.get('daily_verse')

    if cached_verse:
        return Response(cached_verse)
    
    verse_data = get_godpeople_verse()

    cache.set('daily_verse', verse_data, 60 * 60 * 12)

    return Response(verse_data)