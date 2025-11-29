# OdontoAgent

> Dental image analysis and inference service (backend + frontend) for segmentation and detection.

## Quick overview
- **Backend**: Python FastAPI app in `backend/app` that hosts inference routes and auth.
- **Frontend**: React + Vite app in `frontend` for uploading images and viewing results.

## Quick start

Prerequisites:
- Python 3.9+ and `pip`
- Node.js 16+/npm or pnpm

Run backend (development):

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r req.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open API docs at: `http://localhost:8000/docs`

Run frontend (development):

```powershell
cd frontend
npm install
npm run dev
```

Build frontend for production:

```powershell
cd frontend
npm run build
```

## Project structure (important files)

- `backend/app/main.py` - FastAPI application entry.
- `backend/app/router/` - API routers (notably `auth.py` and `inference.py`).
- `backend/models/` - inference wrappers (`unet_infer.py`, `yolo_infer.py`).
- `backend/pipeline/` - ensemble and refinement logic.
- `backend/scripts/` - export utilities (ONNX / TensorRT).
- `backend/weights/` - model weights (gitignored, large files).
- `backend/req.txt` - Python dependencies for backend.
- `frontend/` - React app (Vite) that talks to backend API.

## Models & inference

Model inference code is under `backend/models` and orchestrated by `backend/pipeline`. Use the scripts in `backend/scripts/` to export models to ONNX or TensorRT formats when needed.

## Environment & configuration

- Keep secrets and credentials out of git. Use environment variables or a `.env` file loaded by the backend.
- Typical env vars: `DATABASE_URL`, `SECRET_KEY`, any cloud or storage credentials used by the app or supabase integration in `frontend`.

## API

The backend exposes routes in `backend/app/router/`. Start the backend and visit `http://localhost:8000/docs` for the interactive OpenAPI page and example requests.

## Contributing

1. Create an issue describing the change.
2. Create a branch: `git checkout -b feat/my-change`.
3. Make changes and add tests where appropriate.
4. Open a PR against `main`.

## Notes & next steps

- If you need to run heavy inference locally, consider using the provided export scripts and running with GPU-capable runtimes.
- For CI or production, containerize the backend and frontend and secure secrets via your deployment platform.

## License

This repository currently has no license file. Add a `LICENSE` to specify terms.
