import os
import re
from datetime import datetime

def read_template(template_file):
    with open(template_file, 'r', encoding='utf-8') as f:
        return f.read()

def get_news_items():
   
    news_items = []
    news_dir = 'news_output'
    
    if not os.path.exists(news_dir):
        return []
    
    files = []
    for filename in os.listdir(news_dir):
        if filename.endswith('.html'):
            with open(os.path.join(news_dir, filename), 'r', encoding='utf-8') as f:
                content = f.read()
                # Извлекаем дату из HTML
                date_match = re.search(r'<div class="news-date">(.*?)</div>', content)
                if date_match:
                    date_str = date_match.group(1)
                    try:
                        date = datetime.strptime(date_str, '%d.%m.%Y')
                        files.append((date, content))
                    except ValueError:
                        print(f"ex {filename}")
    
    files.sort(key=lambda x: x[0], reverse=True)
    
 
    for _, content in files[:5]:
        news_items.append(content)
    
    return news_items

def update_file(template_file, output_file):
    template = read_template(template_file)
    news_items = get_news_items()
    

    updated_content = template.replace('<!-- NEWS_PLACEHOLDER -->', '\n'.join(news_items))
    

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f"{output_file} is upd!")

def main():

    update_file('index_template.html', 'index.html')
   
    update_file('news.html', 'news.html')

if __name__ == "__main__":
    main() 
