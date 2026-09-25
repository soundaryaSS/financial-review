import os
import uvicorn

if __name__ == "__main__":
    # Render and other cloud hosts provide the PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, app_dir="backend")
