# Build stage
FROM python:3.10-slim as BuildStage
WORKDIR /app
# Install poetry
RUN pip install poetry
# Copy the poetry files
COPY pyproject.toml poetry.lock ./
# Install the dependencies
RUN poetry install
# Copy the rest of the files
COPY backend/* backend/
COPY README.md .
# Build the backend
RUN poetry build
# Main image
FROM python:3.10-slim
WORKDIR /app
# Copy the built files
COPY --from=BuildStage /app/dist/*.whl ./
# Install the backend

RUN pip install --no-cache-dir *.whl
# Expose the port
EXPOSE 8081
# Run the backend
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8081"]
