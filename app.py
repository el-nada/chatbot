from flask import Flask, render_template, request, jsonify
from chatterbot import ChatBot

app = Flask(__name__)

# Initialize chatbot (No training)
chatbot = ChatBot(
    'MovieBot',
    database_uri="sqlite:///database.sqlite3",  # Pre-trained database
    logic_adapters=[
        {
            "import_path": "chatterbot.logic.BestMatch",
            "default_response": "I'm not sure.",
            "maximum_similarity_threshold": 0.70
        }
    ]
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get_response", methods=["POST"])
def get_response():
    user_input = request.form["user_input"]
    response = chatbot.get_response(user_input)
    return jsonify({"response": str(response)})

if __name__ == "__main__":
    app.run(debug=True)