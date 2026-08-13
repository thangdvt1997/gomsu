FROM python:3.12-alpine
WORKDIR /app
RUN pip install --no-cache-dir requests
COPY tests/smoke_test.py .
CMD ["python", "smoke_test.py"]
