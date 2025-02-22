import html
import re
import unicodedata
import contractions 
import yaml

def process_dataset(file_path):
    # Dictionary to store dialogue pairs
    conversations = []
    first_line = None

    with open(file_path, 'r', encoding='latin-1') as file:
        counter = 1

        for line in file:
            line = line.strip()
            
            match counter:
                case 3:
                    first_line = process_line(line) 
                    counter+=1
                case 4:
                    conversations.append(list((first_line,process_line(line)))) 
                    counter+=1
                case 5:
                    counter =1
                case _:
                    counter+=1
    return conversations

def process_line(line): 
    parts = line.split(' ', 1)
    line_number, dialogue = parts
    return clean_line(dialogue)

def clean_line(line) : 
    line = html.unescape(line) # Fix HTML entities
    line = unicodedata.normalize('NFKD', line).encode('ascii', 'ignore').decode('utf-8') # Normalize unicode characters
    line = contractions.fix(line) # Fix contractions
    line = re.sub(r'[^a-zA-Z0-9\s\']', '', line) # Remove special characters and punctuation
    line = ' '.join(line.split()) # Remove extra whitespace
    line = line.lower() # Lowercase
    return line.strip()

def save_processed_data(conversations, output_file):
    data = {
        "categories": ["movies"], 
        "conversations": conversations
    }
    with open(output_file, 'w', encoding='utf-8') as file:
        yaml.dump(data, file, allow_unicode=True, default_flow_style=False)
            


input_file = 'chatbot/data/raw_data.txt'
output_file = 'chatbot/data/processed_data.yml'


conversations = process_dataset(input_file)
save_processed_data(conversations, output_file)
