import json
import sys
from http.server import BaseHTTPRequestHandler
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "questions.json"
sys.path.insert(0, str(ROOT))

from scoring import build_results  # noqa: E402


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            payload = self._read_json()
            result = build_results(payload, self._load_tests())
            self._send_json(result)
        except ValueError as error:
            self._send_json({"error": str(error)}, status=400)
        except Exception as error:
            self._send_json(
                {"error": "Internal server error", "details": str(error)},
                status=500,
            )

    def do_GET(self):
        self._send_json({"error": "Method not allowed"}, status=405)

    def _read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(length)
        if not raw_body:
            return {}
        return json.loads(raw_body.decode("utf-8"))

    def _load_tests(self):
        with DATA_FILE.open("r", encoding="utf-8") as file:
            return json.load(file)

    def _send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
