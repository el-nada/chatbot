from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer  

def train_chatbot():
    chatbot = ChatBot(
        'MovieBot',
        logic_adapters=[
            {
                "import_path": "chatterbot.logic.BestMatch",
                "default_response": "Please ask questions about our store.",
                "maximum_similarity_threshold": 0.60
            }
        ],
        database_uri="sqlite:///chatbot/data/database.sqlite3"
    )

    corpus_trainer = ChatterBotCorpusTrainer(chatbot)
    
    corpus_trainer.train(
        "chatterbot.corpus.english.greetings",
        "./chatbot/data/data.yml"
    )
    
    # Export training data 
    corpus_trainer.export_for_training("./chatbot/data/exported_data.json") 
    
    print("Training completed! Database saved.")

if __name__ == "__main__":
    train_chatbot()