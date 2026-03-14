# TheFilmProject — MVP Status

## 🎬 About
LinkedIn + Virtual Studio for Indian film/content creators.
**Stack:** Spring Boot 3.4 (Java 21) + React + PostgreSQL

---

## ✅ Implemented Features

### Auth
- [x] Email/password registration (3-step flow)
- [x] JWT authentication
- [x] Google OAuth login
- [x] Auto-login if token exists
- [x] Logout (clears localStorage + session cookie)

### Profile
- [x] LinkedIn-style profile page (cover, avatar, bio, skills, languages)
- [x] Profile photo upload (Base64)
- [x] Edit profile (bio, city, country, roles, languages, skills)
- [x] Skills management (add, delete, levels: Beginner → Expert)
- [x] Available for work toggle
- [x] Public profile view (anyone can view)

### Portfolio
- [x] Add portfolio items (title, description, category, YouTube URL, image URL)
- [x] YouTube thumbnail with inline player on click
- [x] Color-coded category banners (Short Film, Music Video, Documentary, etc.)
- [x] Delete portfolio items
- [x] "Attach Portfolio" toggle in comments

### Posts & Feed
- [x] Create posts (text)
- [x] Project Posts with color-coded banners (Film, Music, Theatre, etc.)
- [x] "Looking for collaborators" tag on project posts
- [x] Like / unlike posts
- [x] Comments (add, delete own)
- [x] View comments count
- [x] Activity section on profile (user's posts)

### Network / Connections
- [x] Send connection requests
- [x] Accept / reject connections
- [x] Network page (pending requests + connections list)
- [x] "People also viewed" widget on profile
- [x] Discover creators page (3-column LinkedIn layout)

### Messaging
- [x] Direct messages between connected users
- [x] Conversation list
- [x] Real-time feel (polling)
- [x] Unread message count

### UI/UX
- [x] Dark / Light mode toggle
- [x] Responsive layout
- [x] Navbar with search
- [x] Creator search (by name/username)

### Testing & DevOps
- [x] Playwright integration test suite (8/8 passing)
  - Register, Login, Edit Profile, Create Post, Like, Comment, Portfolio, Cleanup
- [x] Git branching strategy (feature → dev → main)
- [x] Secrets removed from git history
- [x] DB seed script (200–2000 users with full data)

---

## 🚧 In Progress
- [ ] Google OAuth — profile completion after first login (city, roles missing)

---

## 📋 MVP Backlog (Remaining)

### High Priority
- [ ] **Notifications system** — likes, comments, connection requests, messages
- [ ] **Profile completion bar** — nudge users to fill missing info
- [ ] **Suggested connections widget** — based on role/city/skills (real data)
- [ ] **Search improvements** — filter by role, city, skill, availability

### Medium Priority
- [ ] **Post image upload** — attach images to posts
- [ ] **Project collaboration board** — Kanban-style board per project
- [ ] **Roles on posts** — tag which role you're looking for
- [ ] **Saved posts** — bookmark posts for later
- [ ] **Report/block user**

### Low Priority / Post-MVP
- [ ] **Equipment marketplace** — buy/sell/rent equipment
- [ ] **Personal dev dashboard** — Jira-style task board for solo devs
- [ ] **Web push notifications**
- [ ] **Mobile app (React Native)**

### DevOps / Production
- [ ] **Deploy to production** — Railway (backend) + Vercel/Netlify (frontend)
- [ ] **Custom domain** — thefilmproject.in
- [ ] **Environment variables** — move all secrets to env vars
- [ ] **CI/CD pipeline** — auto-run Playwright tests on push
- [ ] **Database backups**
- [ ] **Rate limiting** on APIs

---

## 🧪 Test Credentials (local)
- **Email:** amit@test.com | **Password:** password123 | **Username:** iamamit

---

## 🚀 Quick Start
```bash
# Backend
cd ~/Downloads/thefilmproject
mvn spring-boot:run

# Frontend
cd ~/Downloads/thefilmproject/frontend
npm start

# Run tests
npx playwright test

# Seed data
python3 scripts/seed_data.py
```
