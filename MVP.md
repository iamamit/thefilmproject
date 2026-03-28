# CollabNow — MVP Tracker

**Vision:** LinkedIn + Virtual Studio for Indian film/content creators.
**Stack:** Spring Boot 3.4 (Java 21) + React (TypeScript) + PostgreSQL
**Last updated:** Mar 28 2026

---

## 📊 Summary

| Status | Count |
|---|---|
| ✅ Built | 26 |
| 🔄 In progress | 1 |
| 📋 Remaining | 29 |
| **Total** | **56** |

---

## 🚀 Phase 1 — Launch Blockers
*Must be done before going live.*

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | Database migration strategy | 📋 | Replace `ddl-auto=update` with Flyway — push never affects existing data |
| 2 | Railway deploy | 📋 | Set MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD, MAIL_PORT, FRONTEND_URL |
| 3 | CI/CD pipeline | 📋 | Auto-run Playwright on push (GitHub Actions) |
| 4 | Git branch protection | ✅ | main + develop protected on GitHub — direct pushes blocked, must come via PR |

---

## 🔥 Phase 2 — First User Push
*Users will notice these immediately after launch.*

| # | Feature | Status | Notes |
|---|---|---|---|
| 5 | Landing page | 📋 | Marketing — for ads, SEO, onboarding |
| 6 | WebSocket real-time messaging | 📋 | Replace current polling |
| 7 | Post image upload | 📋 | Actual file upload, not just URL |
| 8 | Search improvements | 📋 | Filter by role, city, skill in Discover |
| 9 | Suggested connections widget | 📋 | Real data (currently placeholder) |
| 10 | Company search improvements | 📋 | Search + filter on Discover companies tab |
| 11 | Settings page | 🔄 | UI started on `feature/themes` branch |
| 12 | Doodle theme (3rd theme) | 📋 | UI/UX |

---

## 📈 Phase 3 — Retention & Growth
*Important once you have users.*

| # | Feature | Status | Notes |
|---|---|---|---|
| 13 | Email notifications | 📋 | Email on new message / connection (not just verification) |
| 14 | Unit tests (JUnit + Jest) | 📋 | TDD from v1.1.0 |
| 15 | Seed production DB | 📋 | DataLoader for Railway deploy |
| 16 | Docker containerization | 📋 | Full docker-compose setup |
| 17 | Elasticsearch | 📋 | Better full-text search |
| 18 | RSS + AI agent | 📋 | Google Alerts → Claude API → auto-posts |
| 19 | Project collaboration board | 📋 | Kanban board per project post |
| 20 | Instagram + Google ads setup | 📋 | Marketing |
| 21 | Custom domain (collabnow.in) | 📋 | Infrastructure |

---

## 💰 Phase 4 — Monetization
*After traction, not before.*

| # | Feature | Status | Notes |
|---|---|---|---|
| 22 | Google AdSense integration | 📋 | Revenue |
| 23 | Razorpay payment integration | 📋 | Payments |
| 24 | Casting agencies pay to post | 📋 | Paid opportunity listings |
| 25 | Premium profiles for production houses | 📋 | Subscription tier |
| 26 | Equipment marketplace | 📋 | Buy / sell / rent gear |

---

## 🌐 Phase 5 — Scale & Community
*Needs critical mass of users first.*

| # | Feature | Status | Notes |
|---|---|---|---|
| 27 | Film challenges | 📋 | Monthly themes, community votes |
| 28 | Mentorship system | 📋 | Senior professionals mentor juniors |
| 29 | "My First Film" tag | 📋 | Beginner-friendly discovery |
| 30 | Skill level badges | 📋 | Student / Emerging / Professional |
| 31 | Free equipment sharing | 📋 | Borrow/lend gear within community |
| 32 | Chrome extension | 📋 | One-click share from Instagram / Facebook |

---

## ✅ Already Built (26)

### Core Social
| # | Feature | Status | Notes |
|---|---|---|---|
| 33 | Register / Login (JWT) | ✅ | 3-step onboarding with role selection |
| 34 | Google OAuth2 login | ✅ | Redirect via Spring Security OAuth2 |
| 35 | Profile page | ✅ | Cover, avatar, bio, skills, languages, roles |
| 36 | Profile photo upload | ✅ | Base64 stored in DB |
| 37 | Edit profile | ✅ | Bio, city, country, roles, languages, skills |
| 38 | Profile completion bar | ✅ | % progress shown on Edit Profile page |
| 39 | Discover creators page | ✅ | Filter by role, city, language, availability |
| 40 | Connection system | ✅ | Send / accept / reject |
| 41 | Network page | ✅ | Pending requests + connections list |
| 42 | Messaging (polling) | ✅ | DMs between connected users, unread count |
| 43 | Home feed | ✅ | Posts from connections + all users |
| 44 | Create posts | ✅ | Text posts + project posts with color-coded banners |
| 45 | Like posts | ✅ | Toggle like/unlike |
| 46 | Nested comments | ✅ | 2 levels deep |
| 47 | Portfolio section | ✅ | YouTube embed, category banners, inline player |
| 48 | Portfolio attachment in comments | ✅ | Attach portfolio to a comment/application |
| 49 | Candidate review system | ✅ | Mark applicants as Considerable / Not Interested |
| 50 | Notifications | ✅ | Likes, comments, replies, connections — bell with unread count |
| 51 | Company pages | ✅ | Full company profile with follow system |
| 52 | CollabNow official page | ✅ | Verified company page |
| 53 | Dark / Light mode | ✅ | Theme toggle, persisted via ThemeContext |
| 54 | Login error handling | ✅ | Friendly error messages, no crash |
| 55 | Verified profiles | ✅ | `isVerified` flag on users and companies |

### Pre-Launch / Auth
| # | Feature | Status | Notes |
|---|---|---|---|
| 56 | Forgot password | ✅ | Email with 1-hour reset token |
| 57 | Email verification | ✅ | 24-hour token, resend option |
| 58 | Rate limiting | ✅ | Bucket4j — 20 req/min on /login, /register, /forgot-password |
| 59 | 404 page | ✅ | "Scene not found" catch-all |
| 60 | Terms of Service | ✅ | India / Mumbai law |
| 61 | Privacy Policy | ✅ | DPDP Act 2023 |
| 62 | SEO meta tags | ✅ | Per-page title + description via usePageMeta |

### Security
| # | Feature | Status | Notes |
|---|---|---|---|
| 63 | CORS locked to FRONTEND_URL | ✅ | No more wildcard `*` |
| 64 | OAuth failureUrl uses env var | ✅ | Won't break in production |
| 65 | Delete user requires auth | ✅ | Users can only delete own account |
| 66 | Comment null/blank validation | ✅ | 400 on empty content |
| 67 | Public profiles without login | ✅ | /profile/:username is now public |

### Tech
| # | Feature | Status | Notes |
|---|---|---|---|
| 68 | TypeScript + Atomic Design | ✅ | atoms / molecules / organisms / templates / pages |
| 69 | Playwright test suite | ✅ | 69/70 passing across 4 test files |
| 70 | Git branching strategy | ✅ | feature → develop → main (RULES.md) |
| 71 | DB seed script | ✅ | 200–2000 users with full data |
| 72 | SMTP timeouts | ✅ | 3s connection timeout for local dev |
| 73 | Dockerfile | ✅ | Railway-ready Maven layer caching |
