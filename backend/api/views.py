from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def hello_api(request):
    return Response({"message": "서버와 연결되었습니다!"})