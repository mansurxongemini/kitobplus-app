from flask import Flask, request, jsonify
from google import genai
from google.genai import types
import hashlib
import os
import json

app = Flask(__name__)

# Инициализация клиента Google Generative AI
client = genai.Client(api_key="__KP_GEMINI_API_KEY__")

# Создаем папку для кеша если её нет
CACHE_DIR = 'cache'
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)

def get_cache_filename(query):
    """Генерирует имя файла кеша на основе SHA256 от query"""
    query_hash = hashlib.sha256(query.encode('utf-8')).hexdigest()
    return os.path.join(CACHE_DIR, f"{query_hash}.json")

def load_from_cache(query):
    """Загружает эмбеддинги из кеша если они существуют"""
    cache_file = get_cache_filename(query)
    if os.path.exists(cache_file):
        try:
            with open(cache_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return None
    return None

def save_to_cache(query, embeddings):
    """Сохраняет эмбеддинги в кеш"""
    cache_file = get_cache_filename(query)
    try:
        cache_data = {
            'query': query,
            'embeddings': embeddings
        }
        with open(cache_file, 'w', encoding='utf-8') as f:
            json.dump(cache_data, f, ensure_ascii=False)
        return True
    except Exception:
        return False

@app.route('/embeddings', methods=['POST'])
def get_embeddings():
    try:
        # Получаем JSON данные из запроса
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({'error': 'Missing query parameter'}), 400
        
        query = data['query']
        
        # Проверяем кеш
        cached_result = load_from_cache(query)
        if cached_result:
            return jsonify({
                'success': True,
                'query': cached_result['query'],
                'embeddings': cached_result['embeddings'],
                'from_cache': True
            })
        
        # Получаем эмбеддинги для query
        result = client.models.embed_content(
            model="gemini-embedding-exp-03-07",
            contents=query,
            config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
        )
        
        if result.embeddings:
            embeddings = result.embeddings[0].values
            
            # Сохраняем в кеш
            save_to_cache(query, embeddings)
            
            # Возвращаем JSON с query и embeddings
            return jsonify({
                'success': True,
                'query': query,
                'embeddings': embeddings,
                'from_cache': False
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Error while get embeddings from google ai',
            })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6002, debug=True)
