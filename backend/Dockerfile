# Ask Orchid API 
# A small, official Python image 
FROM python:3.13-slim

# Don't write .pyc files, and show logs straight away
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run as a normal user, not root, so a break-in can do less damage
RUN useradd --create-home appuser
USER appuser

EXPOSE 8080

# Cloud Run tells the app which port to use through $PORT.
# --proxy-headers lets the app see each visitor's real IP behind Cloud
# Run's proxy, which the rate limits and guest allowances depend on.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT} --proxy-headers --forwarded-allow-ips='*'"]