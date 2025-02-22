from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

chatbot = ChatBot('MovieBot')

# Load your preprocessed data
conversation = [
    "Hi",
    "Hello!",
    "How are you?",
    "I'm good, thank you!",
    # Add more dialogue pairs here
]

trainer = ListTrainer(chatbot)
trainer.train(conversation)