import csv
import html
import re
import unicodedata
import yaml

def process_dataset(file_path):
    # Dictionary to store dialogue pairs
    conversations = []
    first_line = None

    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter='\t')
        i = 0
        
        for row in reader:
            
            if i==20000: 
                break

            #Skip non movies 
            if row['titleType']!= 'movie': 
                continue

            #Extract relevant fields 
            type_title= clean_line(row['titleType'])
            primary_title= clean_line(row['primaryTitle'])
            original_title = clean_line(row['originalTitle'])
            start_year = row ['startYear']
            genres= row['genres'].split(',') if row['genres']!= '\\N' else []

            #Skip entries with missing or invalid data 
            if primary_title=='\\N' or start_year=='\\N': 
                continue

            #Create dialogue pairs 
            conversations.append([f"What is {primary_title} about ?", 
                                 f"{primary_title} is a {type_title} published in {start_year}. His genres are {', '.join(genres)}."
                                 ])
            
            i+=1

            
    return conversations

def clean_line(line) : 
    if line =='\\N': 
        return ''
    
    line = html.unescape(line) # Fix HTML entities
    line = unicodedata.normalize('NFKD', line).encode('ascii', 'ignore').decode('utf-8') # Normalize unicode characters
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
            


input_file = 'chatbot/data/imdb/raw_data.tsv'
output_file = 'chatbot/data/imdb/processed_data.yml'


conversations = process_dataset(input_file)
save_processed_data(conversations, output_file)