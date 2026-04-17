# PartyTracker

[![Deploy to Production](https://github.com/diranix/partytracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/diranix/partytracker/actions/workflows/deploy.yml)

A social web application for documenting and tracking your nights out. Built with a modern DevOps infrastructure featuring automated CI/CD, security scanning, and HTTPS.

🌐 **Live:** [partytracker.fun](https://partytracker.fun)

---

## Tech Stack

**Backend:** Python, FastAPI, PostgreSQL, SQLAlchemy  
**Frontend:** React, Vite  
**Infrastructure:** Docker, Nginx, Hetzner VPS  
**CI/CD:** GitHub Actions  
**Security:** Let's Encrypt SSL, Bandit, Safety, Flake8  

---

## Infrastructure Overview
GitHub → CI/CD Pipeline → Hetzner VPS
├── Nginx (reverse proxy, HTTPS)
├── React Frontend
├── FastAPI Backend
└── PostgreSQL Database

---

## CI/CD Pipeline

Every push to `dev` triggers an automated pipeline:

1. **Lint** — code style check (Flake8)
2. **SAST** — static security analysis (Bandit)
3. **SCA** — dependency vulnerability scan (Safety)
4. **Docker Compose** — validates compose config
5. **Deploy** — automatic deployment via SSH
6. **Smoke test** — verifies API is live after deploy

Pull requests to `dev` are blocked if any check fails.

---

## Security

- HTTPS with auto-renewing SSL (Let's Encrypt)
- Security headers: HSTS, X-Frame-Options, Referrer-Policy
- Rate limiting via Nginx
- Secrets managed via GitHub Secrets and `.env`
- SSH key authentication
- Firewall with minimal open ports
- PostgreSQL not exposed externally
- SAST and SCA scanning on every push

---

## Features

> 🚧 To be filled by Backend/Frontend team

## API Documentation

Live API docs: [partytracker.fun/api/docs](https://partytracker.fun/api/docs)

---

## Local Development

```bash
git clone https://github.com/diranix/partytracker.git
cd partytracker
cp .env.example .env
# Fill in .env values
docker compose up --build
```

---

## Team

- **Ivan** — DevOps / DevSecOps
- **Antonina** — Backend Developer
