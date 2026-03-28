# TheFilmProject

**India's social network for film and content creators.**

Connect with directors, editors, musicians, cinematographers, actors, writers, VFX artists, and producers — build your portfolio, find collaborators, and grow your network in the Indian film industry.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.2, React Router v6, Axios |
| Backend | Spring Boot 3.4, Java 21, Spring Security, JPA/Hibernate |
| Database | PostgreSQL |
| Auth | JWT + Google OAuth2 |
| Testing | Playwright (E2E integration tests) |
| Deployment | Docker + Railway |

---

## Features

### Authentication
- Email + password registration (3-step form: credentials → personal info → roles)
- Google OAuth2 login
- JWT-based session (24-hour tokens, stored in localStorage)
- **Forgot password** — email reset link with 1-hour expiry token
- **Email verification** — verification link sent on signup, 24-hour expiry
- Rate limiting on auth endpoints (20 requests/min per IP via Bucket4j)

### User Profiles
- Profile photo upload (Base64)
- Bio, city, country, roles, languages
- Skills with proficiency levels (Beginner / Intermediate / Expert)
- "Available for work" toggle
- **Profile completion bar** — shows % complete with nudge to fill missing info
- Public profile pages at `/profile/:username`

### Creator Roles
`DIRECTOR` · `EDITOR` · `MUSICIAN` · `ACTOR` · `CINEMATOGRAPHER` · `VFX_ARTIST` · `WRITER` · `PRODUCER`

### Feed & Posts
- Create text posts
- **Project posts** — color-coded by category (Film, Music, Writing, Photography, Theatre, Digital) with "Looking for collaborators" tag
- **Post image attachment** — paste an image URL to attach to a post
- Like / unlike posts
- Character counter (max 3000 characters)
- Delete own posts

### Comments & Replies
- Nested comments (2 levels: comments + replies)
- Read/unread tracking for post authors
- Candidate status marking (CONSIDERABLE / NOT_INTERESTED)
- Attach portfolio item in a comment with portfolio notification

### Portfolio
- Add portfolio items (title, description, category, YouTube URL, image)
- YouTube thumbnails with inline player
- Category-based organisation
- Delete own portfolio items

### Networking
- Send, accept, decline, and block connection requests
- Network page with pending requests + accepted connections
- "People also viewed" widget on profiles
- 3-column creator discovery grid

### Creator Discovery
- Discover page with filters: role, city, skill name, availability
- Search by name or username in the navbar

### Direct Messages
- Send direct messages to connections
- Conversation list with most recent message
- Unread message count badge
- Polling-based real-time feel

### Notifications
- Types: **Like**, **Comment**, **Reply**, **Connection Request**, **Connection Accepted**, **Portfolio Comment**
- Unread count badge in navbar
- Mark individual or all notifications as read

### Company & Studio Pages
- Company profiles with types: Studio, Production House, OTT, Agency, Independent
- Follow / unfollow companies
- Verification and official badges
- Slug-based URLs (`/company/:slug`)

### UI & Theme
- Dark / light theme toggle (CSS custom properties)
- Theme persistence via localStorage
- DM Sans + DM Serif Display typography
- Responsive layout

### Legal & Trust
- **Terms of Service** at `/terms` — governed by Indian law (Mumbai jurisdiction)
- **Privacy Policy** at `/privacy` — includes DPDP Act 2023 section
- T&C links on login and register pages

### SEO
- Dynamic page titles and meta descriptions per route via `usePageMeta` hook
- Profiles show creator name and role in the title

### Error Handling
- **404 page** — "Scene not found" catch-all for unknown routes
- Backend `GlobalExceptionHandler` — returns clean JSON for validation errors and not-found exceptions
- Input validation with character counters (posts: 3000, bio: 500)

---

## Getting Started

### Prerequisites
- Node.js 18+
- Java 21
- PostgreSQL 15+
- Maven 3.9+

### Backend

```bash
# From the project root
mvn clean package -DskipTests
java -jar target/*.jar
# Runs on http://localhost:8080
```

**Environment variables (optional, defaults shown):**
```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## Running Tests

```bash
cd frontend

# All integration tests (22 tests)
npx playwright test tests/integration.spec.js

# Pre-launch feature tests (18 tests)
npx playwright test tests/pre-launch.spec.js

# All tests
npx playwright test

# With UI
npx playwright test --ui
```

---

## Project Structure

```
thefilmproject/
├── src/main/java/com/thefilmproject/   # Spring Boot backend
│   ├── AuthController.java             # /api/auth/* endpoints
│   ├── AuthService.java                # Auth logic (register, login, password reset)
│   ├── EmailService.java               # SMTP email sending
│   ├── SecurityConfig.java             # JWT + OAuth2 security chains
│   ├── RateLimitFilter.java            # Bucket4j rate limiting
│   ├── GlobalExceptionHandler.java     # JSON error responses
│   ├── User.java                       # User entity
│   ├── Post.java                       # Post entity
│   ├── Comment.java                    # Comment + reply entity
│   ├── Connection.java                 # Connection request entity
│   ├── Message.java                    # Direct message entity
│   ├── Notification.java               # Notification entity
│   ├── PortfolioItem.java              # Portfolio item entity
│   ├── UserSkill.java                  # Skill entity
│   ├── CompanyPage.java                # Company/studio page entity
│   └── ...repositories, controllers
│
├── frontend/
│   ├── src/
│   │   ├── pages/                      # Route-level page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Home.js                 # Feed
│   │   │   ├── Profile.js
│   │   │   ├── EditProfile.js
│   │   │   ├── Discover.js
│   │   │   ├── Messages.js
│   │   │   ├── Connections.js
│   │   │   ├── Notifications.js
│   │   │   ├── Company.js
│   │   │   ├── ForgotPassword.js
│   │   │   ├── ResetPassword.js
│   │   │   ├── CheckEmail.js
│   │   │   ├── VerifyEmail.js
│   │   │   ├── TermsOfService.js
│   │   │   ├── PrivacyPolicy.js
│   │   │   └── NotFound.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── AvatarUpload.js
│   │   ├── hooks/
│   │   │   └── usePageMeta.js          # Dynamic title + meta description
│   │   ├── App.js                      # Router + route definitions
│   │   ├── api.js                      # Axios instance with JWT interceptor
│   │   ├── ThemeContext.js             # Dark/light theme context
│   │   └── index.css                  # CSS variables + global styles
│   └── tests/
│       ├── integration.spec.js         # 22 core integration tests
│       ├── pre-launch.spec.js          # 18 pre-launch feature tests
│       └── login-error.spec.js
│
├── Dockerfile                          # Multi-stage build for Railway
├── pom.xml
└── seed.py / seed_5000.py             # Database seeding scripts
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/auth/forgot-password` | No | Send password reset email |
| POST | `/api/auth/reset-password` | No | Reset password with token |
| GET | `/api/auth/verify-email` | No | Verify email with token |
| POST | `/api/auth/resend-verification` | No | Resend verification email |
| GET | `/api/users/discover` | No | List/filter creators |
| GET | `/api/users/me` | Yes | Current user profile |
| PATCH | `/api/users/:id/update` | Yes | Update profile |
| GET | `/api/posts/feed` | No | Get feed posts |
| POST | `/api/posts` | Yes | Create post |
| POST | `/api/posts/:id/like` | Yes | Toggle like |
| GET | `/api/posts/:postId/comments` | No | Get comments |
| POST | `/api/posts/:postId/comments` | Yes | Add comment/reply |
| POST | `/api/connections/request/:id` | Yes | Send connection request |
| PATCH | `/api/connections/:id/respond` | Yes | Accept/decline request |
| GET | `/api/messages/conversation/:userId` | Yes | Get conversation |
| POST | `/api/messages/send/:receiverId` | Yes | Send message |
| GET | `/api/notifications` | Yes | Get notifications |
| GET | `/api/portfolio/:username` | No | Get user portfolio |
| GET | `/api/companies` | No | List companies |
| POST | `/api/companies/:id/follow` | Yes | Follow company |

---

## Deployment

The backend is containerised and deployed on **Railway**.

```bash
# Build Docker image
docker build -t thefilmproject-backend .

# Run locally with Docker
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://... \
  -e JWT_SECRET=... \
  -e MAIL_USERNAME=... \
  -e MAIL_PASSWORD=... \
  thefilmproject-backend
```
