FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI app
COPY . .

RUN chown -R 1000:1000 /app && \
    useradd --no-create-home --uid 1000 appuser
USER appuser

# FastAPI default port
EXPOSE 8000

# Healthcheck using the root endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/') || exit 1"

# Run with Uvicorn inside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
