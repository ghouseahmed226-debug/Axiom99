# [Agent-88] Multi-stage Python API image -- minimal attack surface
FROM python:3.11-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY pyproject.toml .
RUN pip install --no-cache-dir -e .

FROM deps AS final
COPY src ./src
RUN useradd -m -u 1001 nexus && chown -R nexus:nexus /app
USER nexus
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
