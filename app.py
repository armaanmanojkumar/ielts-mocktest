import argparse
import json
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from scoring import build_results


ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "data" / "questions.json"

APP_ROUTES = {
    "/": "IELTS MockTest",
    "/instructions": "Test Instructions - IELTS MockTest",
    "/test/listening": "Listening Test - IELTS MockTest",
    "/test/reading": "Reading Test - IELTS MockTest",
    "/test/writing": "Writing Test - IELTS MockTest",
    "/results": "Your IELTS Results - IELTS MockTest",
}

SHELL = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Full IELTS Academic mock test with Python backend scoring, timers, and band score results.">
    <title>{title}</title>
    <link rel="stylesheet" href="/styles/globals.css">
    <script src="/static/app.js" defer></script>
  </head>
  <body>
    <main id="app"></main>
  </body>
</html>
"""


class IELTSRequestHandler(BaseHTTPRequestHandler):
    server_version = "IELTSPython/1.0"

    def do_GET(self):
        path = _clean_path(self.path)

        if path == "/api/questions":
            return self._send_json(load_tests())

        if path.startswith("/static/"):
            return self._serve_file(ROOT / path.lstrip("/"), ROOT / "static")

        if path == "/styles/globals.css":
            return self._serve_file(ROOT / "styles" / "globals.css", ROOT / "styles")

        if path == "/favicon.ico":
            return self._send_bytes(b"", "image/x-icon", status=204)

        if path in APP_ROUTES:
            body = SHELL.format(title=APP_ROUTES[path]).encode("utf-8")
            return self._send_bytes(body, "text/html; charset=utf-8")

        self._send_json({"error": "Not found"}, status=404)

    def do_POST(self):
        path = _clean_path(self.path)

        if path != "/api/submit":
            return self._send_json({"error": "Not found"}, status=404)

        try:
            payload = self._read_json()
            result = build_results(payload, load_tests())
        except ValueError as error:
            return self._send_json({"error": str(error)}, status=400)
        except Exception as error:
            return self._send_json(
                {"error": "Internal server error", "details": str(error)},
                status=500,
            )

        self._send_json(result)

    def log_message(self, format, *args):
        print(f"{self.address_string()} - {format % args}")

    def _read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(length)
        if not raw_body:
            return {}
        return json.loads(raw_body.decode("utf-8"))

    def _serve_file(self, target, base):
        base = base.resolve()
        target = target.resolve()

        try:
            target.relative_to(base)
        except ValueError:
            return self._send_json({"error": "Forbidden"}, status=403)

        if not target.exists() or not target.is_file():
            return self._send_json({"error": "Not found"}, status=404)

        content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        self._send_bytes(target.read_bytes(), content_type)

    def _send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self._send_bytes(body, "application/json; charset=utf-8", status=status)

    def _send_bytes(self, body, content_type, status=200):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if status != 204:
            self.wfile.write(body)


def load_tests():
    with DATA_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def _clean_path(raw_path):
    path = urlparse(raw_path).path.rstrip("/")
    return path or "/"


def main():
    parser = argparse.ArgumentParser(description="Run the Python IELTS mock test app.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8000, type=int)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), IELTSRequestHandler)
    print(f"IELTS MockTest running at http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
