from django.http import JsonResponse
import json


def api_home(request):
    body = request.body
    data = {}
    try:
        data = json.loads(body)
    except:
        pass
    data['headers'] = dict(request.headers)
    data['content_type'] = request.content_type
    data['params'] = dict(request.GET)
    return JsonResponse(data)