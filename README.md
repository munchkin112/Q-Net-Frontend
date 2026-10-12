# Q-Net-Frontend
Q-Net project frontend

## API configuration

Set `VITE_API_BASE_URL` in `.env` to the backend origin
(for local development, `http://127.0.0.1:8000`). Restart Vite after changing the value.

Google login requests an authorization URL from `GET /auth/google/authorize`, then
submits the returned OAuth `code` and `state` to `POST /auth/google`. The frontend
includes credentials so the backend can manage its HttpOnly state and refresh cookies.
