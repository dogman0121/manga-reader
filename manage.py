from app import create_app
from config import TestConfig

app = create_app(TestConfig)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
