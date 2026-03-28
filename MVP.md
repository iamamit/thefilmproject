# CollabNow — MVP Tracker

**Vision:** LinkedIn + Virtual Studio for Indian film/content creators.
**Stack:** Spring Boot 3.4 (Java 21) + React (TypeScript) + PostgreSQL
**Last updated:** Mar 28 2026

---

## 📊 Summary

| Status | Count |
|---|---|
| ✅ Built | 28 |
| 🔄 In progress | 1 |
| 📋 Remaining | 42 |
| **Total** | **71** |

---

## 🚀 Phase 1 — Launch Blockers
*Must be done before going live. A real user will hit these on day 1.*

### Infrastructure
| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | Database migration strategy | ✅ | Flyway with baseline-on-migrate — safe for existing Railway DB |
| 2 | Railway deploy | ✅ | Live at thefilmproject-production.up.railway.app — Google OAuth working |
| 3 | CI/CD pipeline | 📋 | Auto-run Playwright on push (GitHub Actions) |
| 4 | Git branch protection | ✅ | main + develop protected on GitHub — direct pushes blocked, must come via PR |
| 5 | Custom domain | 📋 | collabnow.in — users won't trust a railway.app URL |
| 6 | SMTP / email working in prod | 📋 | Gmail App Password not yet set in Railway — verification + reset emails not sending |

### Core UX gaps (user will be stuck without these)
| # | Feature | Status | Notes |
|---|---|---|---|
| 7 | Edit / delete own posts | 📋 | User posts a typo — no way to fix it. Basic expectation. |
| 8 | Edit / delete own comments | 📋 | Same as above for comments |
| 9 | Settings page | 🔄 | Change password, notification prefs, delete account — UI started on `feature/themes` |
| 10 | Change password | 📋 | No way to change password from UI currently |
| 11 | Delete account from UI | 📋 | API exists but no UI — DPDP Act requires this |
| 12 | Empty feed state | 📋 | New user with 0 connections sees a blank page — very discouraging. Show top posts or suggested creators. |
| 13 | Mobile responsiveness | 📋 | Must test and fix on iPhone / Android — most Indian users are mobile-first |
| 14 | Footer with ToS + Privacy links | 📋 | Pages exist but not linked anywhere visible. Legally required to be accessible. |

### Safety (can't launch without)
| # | Feature | Status | Notes |
|---|---|---|---|
| 15 | Report user / post | 📋 | No moderation tool. One troll can ruin early community. |
| 16 | Block user | 📋 | If someone harasses a user, they have no recourse |

---

## 🔥 Phase 2 — First User Push
*Users will notice these in the first week.*

### Profile & Identity
| # | Feature | Status | Notes |
|---|---|---|---|
| 17 | Profile headline / tagline | 📋 | LinkedIn shows "Director \| Mumbai" under name. Currently only bio + roles. Key for first impression. |
| 18 | "Open for Auditions" profile frame | 📋 | Visual ring on profile photo — actors show availability without opening their profile |
| 19 | "Casting Now" frame for directors | 📋 | Same concept — directors/producers signal they are actively hiring |
| 20 | Who viewed my profile | 📋 | Actors want to know when a casting director visited. Drives engagement. |
| 21 | Featured section on profile | 📋 | Pin showreel / best project at top of profile — more important than feed posts |
| 22 | Film credits / filmography section | 📋 | Structured: Title \| Your Role \| Year \| Type. Like IMDb but social. |

### Feed & Posts
| # | Feature | Status | Notes |
|---|---|---|---|
| 23 | Post image upload | 📋 | Actual file upload, not just URL — URL-based is confusing for regular users |
| 24 | Repost / share post | 📋 | LinkedIn's most viral mechanic. Content spreads through reposts. |
| 25 | Save / bookmark posts | 📋 | Users want to save casting calls to apply later |
| 26 | Post visibility (public / connections only) | 📋 | Some posts users want connections-only |

### Discovery & Networking
| # | Feature | Status | Notes |
|---|---|---|---|
| 27 | Search results page | 📋 | Search bar exists in navbar — where does it go? Needs a results page. |
| 28 | Search improvements | 📋 | Filter by role, city, skill in Discover |
| 29 | Suggested connections widget | 📋 | Real data (currently placeholder) |
| 30 | Company search improvements | 📋 | Search + filter on Discover companies tab |
| 31 | Casting calls board | 📋 | Structured job board: Role → Genre → Location → Paid/Unpaid → Apply. Separate from feed. |
| 32 | People you may know | 📋 | Suggestions based on shared connections / same city / same role |

### Messaging
| # | Feature | Status | Notes |
|---|---|---|---|
| 33 | WebSocket real-time messaging | 📋 | Replace current polling — feels laggy |
| 34 | Message request (non-connections) | 📋 | Currently only connected users can DM. Directors need to reach unknown actors. |

### Other
| # | Feature | Status | Notes |
|---|---|---|---|
| 35 | Doodle theme (3rd theme) | 📋 | UI/UX |
| 36 | Analytics for posts | 📋 | Show post author how many views/impressions their post got |

---

## 📈 Phase 3 — Retention & Growth
*Important once you have users.*

| # | Feature | Status | Notes |
|---|---|---|---|
| 37 | Email notifications | 📋 | Email on new message / connection (not just verification) |
| 38 | Skills endorsements | 📋 | Connections endorse your skills — "5 people endorsed Amit for Cinematography" |
| 39 | Written recommendations | 📋 | LinkedIn's strongest trust feature. Testimonial from a director on your profile. |
| 40 | Events | 📋 | Film festivals, workshops, script readings, auditions — RSVP system |
| 41 | Groups / Communities | 📋 | Horror Filmmakers India, Documentary Makers, Bollywood Aspirants |
| 42 | Polls | 📋 | Quick community engagement in the feed |
| 43 | Unit tests (JUnit + Jest) | 📋 | TDD from v1.1.0 |
| 44 | Seed production DB | 📋 | DataLoader for Railway deploy |
| 45 | Docker containerization | 📋 | Full docker-compose setup |
| 46 | Elasticsearch | 📋 | Better full-text search |
| 47 | RSS + AI agent | 📋 | Google Alerts → Claude API → auto-posts |
| 48 | Project collaboration board | 📋 | Kanban board per project post |
| 49 | Instagram + Google ads setup | 📋 | Marketing |

---

## 💰 Phase 4 — Monetization
*After traction, not before.*

| # | Feature | Status | Notes |
|---|---|---|---|
| 50 | Google AdSense integration | 📋 | Revenue |
| 51 | Razorpay payment integration | 📋 | Payments |
| 52 | Casting agencies pay to post | 📋 | Paid opportunity listings |
| 53 | Premium profiles for production houses | 📋 | Subscription tier |
| 54 | Equipment marketplace | 📋 | Buy / sell / rent gear |

---

## 🌐 Phase 5 — Scale & Community
*Needs critical mass of users first.*

| # | Feature | Status | Notes |
|---|---|---|---|
| 55 | Film challenges | 📋 | Monthly themes, community votes |
| 56 | Mentorship system | 📋 | Senior professionals mentor juniors |
| 57 | "My First Film" tag | 📋 | Beginner-friendly discovery |
| 58 | Skill level badges | 📋 | Student / Emerging / Professional |
| 59 | Free equipment sharing | 📋 | Borrow/lend gear within community |
| 60 | Chrome extension | 📋 | One-click share from Instagram / Facebook |

---

## ✅ Already Built (28)

### Core Social
| # | Feature | Status | Notes |
|---|---|---|---|
| 61 | Register / Login (JWT) | ✅ | 3-step onboarding with role selection |
| 62 | Google OAuth2 login | ✅ | Redirect via Spring Security OAuth2 |
| 63 | Profile page | ✅ | Cover, avatar, bio, skills, languages, roles |
| 64 | Profile photo upload | ✅ | Base64 stored in DB |
| 65 | Edit profile | ✅ | Bio, city, country, roles, languages, skills |
| 66 | Profile completion bar | ✅ | % progress shown on Edit Profile page |
| 67 | Discover creators page | ✅ | Filter by role, city, language, availability |
| 68 | Connection system | ✅ | Send / accept / reject |
| 69 | Network page | ✅ | Pending requests + connections list |
| 70 | Messaging (polling) | ✅ | DMs between connected users, unread count |
| 71 | Home feed | ✅ | Posts from connections + all users |
| 72 | Create posts | ✅ | Text posts + project posts with color-coded banners |
| 73 | Like posts | ✅ | Toggle like/unlike |
| 74 | Nested comments | ✅ | 2 levels deep |
| 75 | Portfolio section | ✅ | YouTube embed, category banners, inline player |
| 76 | Portfolio attachment in comments | ✅ | Attach portfolio to a comment/application |
| 77 | Candidate review system | ✅ | Mark applicants as Considerable / Not Interested |
| 78 | Notifications | ✅ | Likes, comments, replies, connections — bell with unread count |
| 79 | Company pages | ✅ | Full company profile with follow system |
| 80 | CollabNow official page | ✅ | Verified company page |
| 81 | Dark / Light mode | ✅ | Theme toggle, persisted via ThemeContext |
| 82 | Login error handling | ✅ | Friendly error messages, no crash |
| 83 | Verified profiles | ✅ | `isVerified` flag on users and companies |

### Pre-Launch / Auth
| # | Feature | Status | Notes |
|---|---|---|---|
| 84 | Forgot password | ✅ | Email with 1-hour reset token |
| 85 | Email verification | ✅ | 24-hour token, resend option |
| 86 | Rate limiting | ✅ | Bucket4j — 20 req/min on /login, /register, /forgot-password |
| 87 | 404 page | ✅ | "Scene not found" catch-all |
| 88 | Terms of Service | ✅ | India / Mumbai law |
| 89 | Privacy Policy | ✅ | DPDP Act 2023 |
| 90 | SEO meta tags | ✅ | Per-page title + description via usePageMeta |

### Security
| # | Feature | Status | Notes |
|---|---|---|---|
| 91 | CORS locked to FRONTEND_URL | ✅ | No more wildcard `*` |
| 92 | OAuth failureUrl uses env var | ✅ | Won't break in production |
| 93 | Delete user requires auth | ✅ | Users can only delete own account |
| 94 | Comment null/blank validation | ✅ | 400 on empty content |
| 95 | Public profiles without login | ✅ | /profile/:username is now public |

### Tech
| # | Feature | Status | Notes |
|---|---|---|---|
| 96 | TypeScript + Atomic Design | ✅ | atoms / molecules / organisms / templates / pages |
| 97 | Playwright test suite | ✅ | 69/70 passing across 4 test files |
| 98 | Git branching strategy | ✅ | feature → develop → main (RULES.md) |
| 99 | DB seed script | ✅ | 200–2000 users with full data |
| 100 | SMTP timeouts | ✅ | 3s connection timeout for local dev |
| 101 | Dockerfile | ✅ | Railway-ready Maven layer caching |
