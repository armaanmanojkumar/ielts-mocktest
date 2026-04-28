import json
from http.server import BaseHTTPRequestHandler
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "questions.json"


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        with DATA_FILE.open("r", encoding="utf-8") as file:
            payload = json.load(file)

        body = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
