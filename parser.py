import os
import re
from datetime import datetime

class NewsParser:
    def __init__(self):
        self.template = {
            'title': '# Заголовок новости',
            'date': '# Дата',
            'category': '# Категория',
            'content': '# Текст новости'
        }
    
    def parse_file(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Разделяем файл на секции
        sections = re.split(r'#\s+[^\n]+\n', content)
        
        # Удаляем пустые строки и получаем данные
        data = {
            'title': sections[1].strip(),
            'date': sections[2].strip(),
            'category': sections[3].strip(),
            'content': sections[4].strip()
        }
        
        return data
    
    def convert_to_html(self, data):
        # Обрабатываем маркдаун-подобный синтаксис
        content = data['content']
        
        # Преобразуем маркированные списки
        content = re.sub(r'^- (.*)$', r'<li>\1</li>', content, flags=re.MULTILINE)
        content = re.sub(r'(<li>.*</li>\n?)+', r'<ul>\g<0></ul>', content)
        
        # Преобразуем ссылки
        content = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2" style="color: #C0C0C0;">\1</a>', content)
        
        # Создаем HTML
        html = f"""
        <div class="news-item">
            <div class="news-title">{data['title']}</div>
            <div class="news-date">{data['date']}</div>
            <div class="news-category">{data['category']}</div>
            <div class="news-content">
                {content}
            </div>
        </div>
        """
        
        return html
    
    def process_directory(self, input_dir, output_dir):
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        for filename in os.listdir(input_dir):
            if filename.endswith('.txt'):
                input_path = os.path.join(input_dir, filename)
                output_path = os.path.join(output_dir, f"{os.path.splitext(filename)[0]}.html")
                
                try:
                    data = self.parse_file(input_path)
                    html = self.convert_to_html(data)
                    
                    with open(output_path, 'w', encoding='utf-8') as f:
                        f.write(html)
                    
                    print(f"ex: {filename}")
                except Exception as e:
                    print(f"ex {filename}: {str(e)}")

def main():
    parser = NewsParser()
    
    # Создаем директории для входных и выходных файлов
    input_dir = 'news_input'
    output_dir = 'news_output'
    
    if not os.path.exists(input_dir):
        os.makedirs(input_dir)
    
    parser.process_directory(input_dir, output_dir)

if __name__ == "__main__":
    main() 
