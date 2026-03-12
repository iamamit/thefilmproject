import requests
import random
import time

BASE_URL = "http://localhost:8080/api"

ROLES = ['DIRECTOR', 'EDITOR', 'MUSICIAN', 'PRODUCER', 'ACTOR', 'CINEMATOGRAPHER', 'VFX_ARTIST', 'WRITER']
CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Kochi', 'Chandigarh', 'Bhopal', 'Indore', 'Nagpur']
LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Bengali', 'Punjabi', 'Gujarati']
SKILLS_BY_ROLE = {
    'DIRECTOR': ['Storytelling', 'Shot Composition', 'DaVinci Resolve', 'Storyboarding', 'Casting', 'Script Analysis'],
    'EDITOR': ['Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'After Effects', 'Color Grading', 'Sound Design'],
    'MUSICIAN': ['Logic Pro', 'Ableton', 'Pro Tools', 'Music Composition', 'Sound Design', 'Mixing'],
    'PRODUCER': ['Budget Management', 'Scheduling', 'Script Development', 'Distribution', 'Fundraising'],
    'ACTOR': ['Method Acting', 'Voice Training', 'Stage Combat', 'Improvisation', 'Dance', 'Dialect Coaching'],
    'CINEMATOGRAPHER': ['ARRI Alexa', 'RED Camera', 'Lighting Design', 'Lens Selection', 'Color Science'],
    'VFX_ARTIST': ['Nuke', 'Houdini', 'Maya', 'Blender', 'After Effects', 'Unreal Engine', 'ZBrush'],
    'WRITER': ['Screenplay Writing', 'Final Draft', 'Celtx', 'Story Structure', 'Dialogue Writing'],
}
LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT']

FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
               'Priya', 'Ananya', 'Diya', 'Meera', 'Kavya', 'Nisha', 'Pooja', 'Riya', 'Simran', 'Tanya',
               'Rahul', 'Vikram', 'Rajesh', 'Suresh', 'Amit', 'Rohit', 'Nikhil', 'Karan', 'Deepak', 'Sanjay',
               'Shreya', 'Pallavi', 'Swati', 'Neha', 'Divya', 'Anjali', 'Sunita', 'Rekha', 'Geeta', 'Seema',
               'Aryan', 'Dev', 'Jai', 'Kabir', 'Lakshya', 'Manav', 'Naveen', 'Om', 'Pranav', 'Rohan',
               'Aisha', 'Bhavna', 'Charu', 'Esha', 'Falak', 'Gargi', 'Hina', 'Isha', 'Jiya', 'Komal']

LAST_NAMES = ['Sharma', 'Verma', 'Patel', 'Shah', 'Singh', 'Kumar', 'Gupta', 'Joshi', 'Mehta', 'Chopra',
              'Kapoor', 'Malhotra', 'Khanna', 'Sinha', 'Rao', 'Nair', 'Iyer', 'Menon', 'Pillai', 'Reddy',
              'Naidu', 'Desai', 'Jain', 'Agarwal', 'Trivedi', 'Pandey', 'Mishra', 'Tiwari', 'Dubey', 'Yadav',
              'Roy', 'Das', 'Bose', 'Mukherjee', 'Banerjee', 'Ghosh', 'Chatterjee', 'Sen', 'Dutta', 'Chakraborty']

POST_CONTENTS = [
    "Just wrapped a 3-day shoot in the mountains. The golden hour light was absolutely magical! 🎬",
    "Looking for a talented editor for my upcoming short film. DM if interested! #FilmProject",
    "Excited to announce my first feature film is officially in pre-production! 🎉",
    "The best camera is the one you have with you. Shot this entire sequence on my phone.",
    "Color grading session day 3. The difference between raw and graded footage is night and day.",
    "Hiring: VFX artist for OTT project. 3+ years exp required. Mumbai preferred.",
    "Just got my ARRI Alexa certification. Years of hard work finally paying off!",
    "Indian cinema is evolving at a rapid pace. So proud to be part of this journey.",
    "Completed my first Bollywood background score. Surreal experience! 🎵",
    "Looking for a cinematographer for a 2-week documentary shoot in Rajasthan.",
    "Sound design is the unsung hero of filmmaking. Let's talk more about it.",
    "My short film just got selected for MAMI Film Festival! Dreams do come true 🏆",
    "Open for freelance editing work. Check my profile for showreel.",
    "The script is everything. Spend more time on it than anything else.",
    "Just finished a masterclass on practical lighting. Game changer for my work!",
    "Seeking co-producer for indie film. Strong story, modest budget. Serious inquiries only.",
    "3 years in the industry and I'm still learning something new every single day.",
    "Podcast episode dropping tomorrow on breaking into Bollywood as an outsider.",
    "Casting call: Looking for actors aged 25-35 for a web series. Mumbai/Delhi based.",
    "The hardest part of filmmaking? Finding the right team. The best part? When you do.",
    "Just discovered the power of natural sound design. Minimal score, maximum impact.",
    "DI suite finally done. The film looks absolutely stunning on the big screen.",
    "Grateful for every rejection. Each one taught me something invaluable.",
    "OTT platforms have democratized Indian cinema like never before. What a time to be alive!",
    "New reel up on my profile. 5 years of work condensed into 2 minutes.",
]

COMMENT_TEMPLATES = [
    "This is amazing work! 🔥",
    "Congratulations! Well deserved.",
    "Would love to collaborate on your next project!",
    "Indian cinema is lucky to have talent like yours",
    "Interested! Sending you a DM.",
    "This resonates so much with my experience.",
    "Keep inspiring us all! 🙌",
    "Absolutely brilliant. More power to you!",
    "The future of Indian cinema is in good hands.",
    "Just followed you. Great content!",
    "This is exactly what the industry needs to hear.",
    "Congratulations on this milestone! 🎉",
    "Would love to know more about your process.",
    "Sharing this with my network. Everyone needs to see this.",
    "Pure talent. Keep going! 💪",
]

def register_user(i):
    first = random.choice(FIRST_NAMES)
    last = random.choice(LAST_NAMES)
    full_name = f"{first} {last}"
    username = f"{first.lower()}{last.lower()}{i}"
    email = f"creator{i}@tfp.com"
    password = "password123"
    city = random.choice(CITIES)
    country = "India"
    # Random role combinations (1-3 roles)
    num_roles = random.randint(1, 3)
    roles = random.sample(ROLES, num_roles)
    # Random languages (1-4)
    num_langs = random.randint(1, 4)
    languages = random.sample(LANGUAGES, num_langs)
    available = random.random() > 0.3

    payload = {
        "fullName": full_name, "email": email, "password": password,
        "username": username, "city": city, "country": country,
        "roles": roles, "languages": languages, "availableForWork": available
    }
    try:
        res = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        if res.status_code == 200:
            return res.json().get('token'), res.json().get('id'), username, full_name
    except Exception as e:
        print(f"  Register error {i}: {e}")
    return None, None, None, None

def add_skills(token, roles):
    headers = {"Authorization": f"Bearer {token}"}
    for role in roles:
        skills = random.sample(SKILLS_BY_ROLE.get(role, ['Filmmaking']), random.randint(1, 3))
        for skill in skills:
            try:
                requests.post(f"{BASE_URL}/skills", json={
                    "name": skill, "category": role, "level": random.choice(LEVELS)
                }, headers=headers, timeout=5)
            except: pass

def create_posts(token, count=2):
    headers = {"Authorization": f"Bearer {token}"}
    post_ids = []
    contents = random.sample(POST_CONTENTS, min(count, len(POST_CONTENTS)))
    for content in contents:
        try:
            res = requests.post(f"{BASE_URL}/posts", json={"content": content}, headers=headers, timeout=5)
            if res.status_code == 200:
                post_ids.append(res.json().get('id'))
        except: pass
    return post_ids

def get_all_users(token):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = requests.get(f"{BASE_URL}/users/discover", headers=headers, timeout=10)
        if res.status_code == 200:
            return res.json()
    except: pass
    return []

def send_connection(token, user_id):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        requests.post(f"{BASE_URL}/connections/request/{user_id}", headers=headers, timeout=5)
    except: pass

def accept_all_pending(token):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        pending = requests.get(f"{BASE_URL}/connections/pending", headers=headers, timeout=5).json()
        for conn in pending:
            requests.patch(f"{BASE_URL}/connections/{conn['id']}/respond?accept=true", headers=headers, timeout=5)
    except: pass

def like_post(token, post_id):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        requests.post(f"{BASE_URL}/posts/{post_id}/like", headers=headers, timeout=5)
    except: pass

def comment_post(token, post_id):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        requests.post(f"{BASE_URL}/posts/{post_id}/comments",
            json={"content": random.choice(COMMENT_TEMPLATES)}, headers=headers, timeout=5)
    except: pass

def get_feed_posts(token, page=0):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = requests.get(f"{BASE_URL}/posts/feed?page={page}&size=50", headers=headers, timeout=10)
        if res.status_code == 200:
            return [p['id'] for p in res.json().get('content', [])]
    except: pass
    return []

# ── MAIN ──────────────────────────────────────────────────
print("🎬 TheFilmProject — Seeding 5000 users")
print("=" * 50)

TOTAL = 5000
BATCH = 50
tokens = []   # (token, id, username)

# Phase 1: Register all users
print(f"\n📝 Phase 1: Registering {TOTAL} users...")
for i in range(1, TOTAL + 1):
    token, uid, username, fullname = register_user(i)
    if token:
        tokens.append((token, uid, username))
    if i % BATCH == 0:
        print(f"  ✅ {i}/{TOTAL} registered")

print(f"\n✅ Registered {len(tokens)} users successfully")

# Phase 2: Add skills to all users
print(f"\n🛠️  Phase 2: Adding skills...")
for idx, (token, uid, username) in enumerate(tokens):
    # Infer roles from username isn't possible, pick random
    roles = random.sample(ROLES, random.randint(1, 2))
    add_skills(token, roles)
    if (idx + 1) % BATCH == 0:
        print(f"  ✅ {idx+1}/{len(tokens)} skills added")

# Phase 3: Create posts
print(f"\n📢 Phase 3: Creating posts...")
all_post_ids = []
for idx, (token, uid, username) in enumerate(tokens):
    count = random.randint(1, 4)
    post_ids = create_posts(token, count)
    all_post_ids.extend(post_ids)
    if (idx + 1) % BATCH == 0:
        print(f"  ✅ {idx+1}/{len(tokens)} users posted ({len(all_post_ids)} total posts)")

print(f"\n✅ Created {len(all_post_ids)} posts total")

# Phase 4: Connections (each user connects with 5-20 random users)
print(f"\n🤝 Phase 4: Creating connections...")
for idx, (token, uid, username) in enumerate(tokens):
    # Connect with random subset
    targets = random.sample(tokens, min(random.randint(5, 20), len(tokens)))
    for t_token, t_uid, t_username in targets:
        if t_uid != uid:
            send_connection(token, t_uid)
    # Accept pending
    accept_all_pending(token)
    if (idx + 1) % BATCH == 0:
        print(f"  ✅ {idx+1}/{len(tokens)} connection batches done")

# Phase 5: Likes & Comments on feed posts
print(f"\n❤️  Phase 5: Likes & comments...")
sample_tokens = random.sample(tokens, min(500, len(tokens)))
post_sample = all_post_ids[:200] if all_post_ids else []

for idx, (token, uid, username) in enumerate(sample_tokens):
    # Like random posts
    posts_to_like = random.sample(post_sample, min(random.randint(3, 15), len(post_sample)))
    for pid in posts_to_like:
        like_post(token, pid)
    # Comment on some
    posts_to_comment = random.sample(post_sample, min(random.randint(1, 5), len(post_sample)))
    for pid in posts_to_comment:
        if random.random() > 0.4:
            comment_post(token, pid)
    if (idx + 1) % 50 == 0:
        print(f"  ✅ {idx+1}/{len(sample_tokens)} like/comment batches done")

print("\n" + "=" * 50)
print("🎉 SEEDING COMPLETE!")
print(f"  👥 Users: {len(tokens)}")
print(f"  📢 Posts: {len(all_post_ids)}")
print(f"  🔑 Login any user: creator1@tfp.com / password123")
print("=" * 50)
