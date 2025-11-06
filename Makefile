.PHONY: init start test-backend lint build

init:
	@echo "Installing backend dependencies..."
	pip install -r backend/requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm ci

start:
	docker-compose up --build

test-backend:
	pytest backend/tests --asyncio-mode=auto --maxfail=1 --disable-warnings -q

lint:
	@echo "Running backend linters..."
	flake8 backend
	@echo "Running frontend linters..."
	cd frontend && npm run lint

build:
	docker-compose build
