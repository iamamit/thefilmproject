import requests
import random
import time
import json

BASE = "http://localhost:8080"

# ─── DATA POOLS ───────────────────────────────────────────────────────────────
FIRST_NAMES = ["Amit", "Raj", "Priya", "Neha", "Arjun", "Kavya", "Vikram", "Ananya", 
               "Rohan", "Deepika", "Karan", "Shruti", "Aditya", "Pooja", "Siddharth",
               "Meera", "Rahul", "Isha", "Vivek", "Nisha", "Tarun", "Riya", "Akash",
               "Simran", "Nikhil", "Anjali", "Harsh", "Divya", "Kunal", "Swati",
               "Manish", "Preeti", "Gaurav", "Ritika", "Sandeep", "Pallavi", "Aarav",
               "Kritika", "Varun", "Tanvi", "Ishaan", "Sneha", "Yash", "Komal",
               "Pranav", "Sakshi", "Dhruv", "Megha", "Aniket", "Sonal"]

LAST_NAMES = ["Kumar", "Sharma", "Singh", "Patel", "Verma", "Gupta", "Joshi", "Mehta",
              "Malhotra", "Kapoor", "Chopra", "Bose", "Reddy", "Nair", "Iyer",
              "Chatterjee", "Mukherjee", "Banerjee", "Das", "Roy", "Shah", "Desai",
              "Kulkarni", "Jain", "Agarwal", "Mishra", "Tiwari", "Pandey", "Yadav",
              "Sinha", "Trivedi", "Shukla", "Dubey", "Chauhan", "Rathore"]

CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune",
          "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi", "Goa", "Indore",
          "Bhopal", "Nagpur", "Surat", "Vadodara", "Patna", "Ranchi"]

ROLES = ["DIRECTOR", "EDITOR", "MUSICIAN", "PRODUCER", "ACTOR", "CINEMATOGRAPHER", 
         "VFX_ARTIST", "WRITER"]

LANGUAGES = ["Hindi", "English", "Tamil", "Telugu", "Malayalam", "Kannada", 
             "Marathi", "Bengali", "Punjabi", "Gujarati"]

BIOS = [
    "Passionate filmmaker with {n}+ years of experience in {city}'s vibrant film scene.",
    "Award-winning {role} who loves telling stories that matter. Based in {city}.",
    "Independent filmmaker blending commercial appeal with artistic vision. {city} based.",
    "Collaborated with top Bollywood productions. Always looking for new creative challenges.",
    "From short films to feature films — I've done it all. Let's create something amazing!",
    "Trained at FTII Pune. Currently working on my debut feature film.",
    "Music composer with a passion for experimental sounds and traditional Indian music.",
    "Visual storyteller with expertise in documentary and narrative filmmaking.",
    "Editor with an eye for detail. Have worked on 50+ projects across OTT platforms.",
    "Producer with a knack for bringing creative visions to life on budget.",
    "Actor trained in method acting. Available for film and web series projects.",
    "Cinematographer specializing in natural light and guerrilla filmmaking.",
    "VFX artist with experience in Hollywood and Bollywood productions.",
    "Screenwriter with multiple produced credits in Hindi and regional cinema.",
]

SKILL_SETS = {
    "DIRECTOR": ["Direction", "Screenplay Writing", "Shot listing", "Casting", "Production Management", "Color Grading", "Final Cut Pro", "Adobe Premiere"],
    "EDITOR": ["Adobe Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "After Effects", "Color Grading", "Sound Design", "Motion Graphics"],
    "MUSICIAN": ["Music Composition", "Sound Design", "Pro Tools", "Logic Pro", "Ableton Live", "Background Score", "Sound Mixing"],
    "PRODUCER": ["Production Management", "Budgeting", "Scheduling", "Script Development", "Distribution", "Marketing", "Fundraising"],
    "ACTOR": ["Method Acting", "Dialogue Delivery", "Action Sequences", "Improvisation", "Dance", "Stage Acting", "Dubbing"],
    "CINEMATOGRAPHER": ["Cinematography", "Lighting Design", "Camera Operation", "DaVinci Resolve", "Lens Selection", "Drone Filming"],
    "VFX_ARTIST": ["Adobe After Effects", "Nuke", "Maya", "Houdini", "Compositing", "3D Modeling", "Motion Tracking"],
    "WRITER": ["Screenplay Writing", "Dialogue Writing", "Story Development", "Research", "Script Coverage", "Novel Writing"],
}

SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]

POST_TEMPLATES = [
    "Just wrapped up shooting my latest {type} in {city}! Incredible experience working with such a talented crew. 🎬",
    "Looking for a talented {role} for my upcoming project. DM if interested! #FilmMaking #Collaboration",
    "Excited to announce that my short film has been selected for {festival}! Dreams do come true. 🏆",
    "Behind the scenes from today's shoot. The magic of filmmaking never gets old! ✨",
    "Sharing my latest work — a music video for an upcoming indie artist. What do you think? 🎵",
    "Just finished editing a 45-minute documentary. Sleep deprived but absolutely worth it! 💪",
    "Collaboration opportunity: Looking for writers for a web series set in {city}. Reach out!",
    "Grateful for 1000+ connections on TheFilmProject! This community is incredible. 🙏",
    "New equipment day! Just got my hands on a Sony FX3. Time to create magic! 📸",
    "Reminder: Great storytelling is about emotion, not just technique. #FilmTips",
    "Working on a passion project about street musicians of {city}. Stay tuned! 🎸",
    "Just attended a masterclass by a legendary director. Mind = blown. #LearningNeverStops",
    "Casting call for my short film! Looking for diverse talent in {city}. DM for details.",
    "The grind is real but so is the passion. Day 15 of back-to-back shoots! 🎥",
    "Throwback to my first ever short film. We've come a long way! #Growth #Filmmaking",
]

FESTIVALS = ["MIFF", "IFFI Goa", "Mumbai Film Festival", "Delhi Short Film Festival", 
             "Bangalore International Film Festival", "Kolkata Film Festival"]

PROJECT_TYPES = ["FILM", "MUSIC", "WRITING", "PHOTOGRAPHY", "THEATRE", "DIGITAL"]

PORTFOLIO_TITLES = [
    "{type} - {title}",
    "The {adj} {noun}",
    "{city} Chronicles",
    "Project {word}",
    "{emotion} in {city}",
]

ADJ = ["Last", "First", "Forgotten", "Silent", "Rising", "Burning", "Golden", "Dark"]
NOUNS = ["Journey", "Dream", "Story", "Voice", "Light", "Shadow", "Road", "River"]
EMOTIONS = ["Love", "Hope", "Fear", "Joy", "Grief", "Wonder", "Rage", "Peace"]
PORTFOLIO_DESCS = [
    "A {type} exploring themes of identity and belonging in modern India.",
    "Shot over {n} days with a crew of {m} in {city}. Personal and powerful.",
    "An experimental {type} that pushes boundaries of traditional storytelling.",
    "Commercial project for a major brand. Reached {views}M+ views on social media.",
    "Award-winning {type} screened at multiple international festivals.",
    "A passion project close to my heart. Made on zero budget with maximum heart.",
]

COMMENT_TEMPLATES = [
    "This is absolutely incredible work! 🔥",
    "Loved this! The storytelling is on another level.",
    "Congratulations! Well deserved. 👏",
    "Would love to collaborate on something like this!",
    "The cinematography here is breathtaking.",
    "This inspired me to start my own project. Thank you!",
    "Masterclass in {skill}. Bookmarking this!",
    "Following for more content like this! 🙌",
    "The editing is so smooth. Which software did you use?",
    "This is exactly what Indian independent cinema needs!",
]

MESSAGES = [
    "Hey! Loved your work. Would love to connect and possibly collaborate.",
    "Hi! I came across your profile and think we'd make a great team.",
    "Hello! I'm working on a project that might interest you. Can we chat?",
    "Your portfolio is amazing! I have a project in {city} that needs your skills.",
    "Great work on your recent post! I have some questions about your process.",
]

# ─── HELPERS ──────────────────────────────────────────────────────────────────
def rand(*args):
    return random.choice(args[0] if len(args) == 1 else args)

def register_user(i):
    fn = rand(FIRST_NAMES)
    ln = rand(LAST_NAMES)
    city = rand(CITIES)
    roles = random.sample(ROLES, random.randint(1, 3))
    langs = random.sample(LANGUAGES, random.randint(1, 4))
    username = f"{fn.lower()}{ln.lower()}{i}"[:20]
    email = f"creator{i}@tfp.com"
    
    res = requests.post(f"{BASE}/api/auth/register", json={
        "fullName": f"{fn} {ln}",
        "email": email,
        "password": "password123",
        "username": username,
        "city": city,
        "country": "India",
        "roles": roles,
        "languages": langs,
    })
    if res.status_code != 200:
        return None
    
    data = res.json()
    return {
        "id": data["id"],
        "token": data["token"],
        "username": username,
        "email": email,
        "city": city,
        "roles": roles,
        "fullName": f"{fn} {ln}",
    }

def update_bio(user):
    role = rand(user["roles"])
    bio_template = rand(BIOS)
    bio = bio_template.format(
        n=random.randint(2, 15),
        city=user["city"],
        role=role.replace("_", " ").title()
    )
    requests.put(f"{BASE}/api/users/me",
        json={"bio": bio, "city": user["city"], "country": "India",
              "fullName": user["fullName"], "availableForWork": random.choice([True, False]),
              "roles": user["roles"], "languages": random.sample(LANGUAGES, random.randint(1, 4))},
        headers={"Authorization": f"Bearer {user['token']}"}
    )

def add_skills(user):
    role = rand(user["roles"])
    skills = random.sample(SKILL_SETS.get(role, SKILL_SETS["DIRECTOR"]), random.randint(2, 5))
    for skill in skills:
        requests.post(f"{BASE}/api/skills",
            json={"name": skill, "category": role, "level": rand(SKILL_LEVELS)},
            headers={"Authorization": f"Bearer {user['token']}"}
        )

def create_posts(user, count=2):
    post_ids = []
    for _ in range(count):
        template = rand(POST_TEMPLATES)
        content = template.format(
            type=rand(["short film", "music video", "documentary", "ad film"]),
            city=user["city"],
            role=rand(user["roles"]).replace("_", " ").title(),
            festival=rand(FESTIVALS)
        )
        is_project = random.random() > 0.6
        project_type = rand(PROJECT_TYPES) if is_project else None
        
        res = requests.post(f"{BASE}/api/posts",
            json={"content": content, "isProject": is_project, "projectType": project_type},
            headers={"Authorization": f"Bearer {user['token']}"}
        )
        if res.status_code == 200:
            post_ids.append(res.json()["id"])
    return post_ids

def add_portfolio(user):
    count = random.randint(1, 4)
    for _ in range(count):
        title = f"{rand(ADJ)} {rand(NOUNS)}"
        desc_template = rand(PORTFOLIO_DESCS)
        desc = desc_template.format(
            type=rand(["short film", "documentary", "music video", "ad film"]),
            n=random.randint(3, 30),
            m=random.randint(3, 20),
            city=user["city"],
            views=random.randint(1, 50)
        )
        category = rand(["Short Film", "Music Video", "Documentary", "Ad Film", "Reel", "Photography"])
        requests.post(f"{BASE}/api/portfolio",
            json={"title": title, "description": desc, "category": category, 
                  "videoUrl": "", "imageUrl": ""},
            headers={"Authorization": f"Bearer {user['token']}"}
        )

def like_posts(user, all_post_ids):
    posts_to_like = random.sample(all_post_ids, min(random.randint(3, 15), len(all_post_ids)))
    for post_id in posts_to_like:
        requests.post(f"{BASE}/api/posts/{post_id}/like",
            headers={"Authorization": f"Bearer {user['token']}"}
        )

def add_comments(user, all_post_ids):
    posts_to_comment = random.sample(all_post_ids, min(random.randint(1, 5), len(all_post_ids)))
    for post_id in posts_to_comment:
        template = rand(COMMENT_TEMPLATES)
        comment = template.format(skill=rand(["direction", "editing", "cinematography", "writing"]))
        requests.post(f"{BASE}/api/posts/{post_id}/comments",
            json={"content": comment},
            headers={"Authorization": f"Bearer {user['token']}"}
        )

def send_messages(user, other_users):
    targets = random.sample(other_users, min(random.randint(1, 3), len(other_users)))
    for target in targets:
        msg = rand(MESSAGES).format(city=user["city"])
        requests.post(f"{BASE}/api/messages",
            json={"receiverId": target["id"], "content": msg},
            headers={"Authorization": f"Bearer {user['token']}"}
        )

def connect_users(user, other_users):
    targets = random.sample(other_users, min(random.randint(2, 8), len(other_users)))
    for target in targets:
        requests.post(f"{BASE}/api/connections/request/{target['id']}",
            headers={"Authorization": f"Bearer {user['token']}"}
        )

# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    TOTAL = 200  # Change to 2000 for full seed
    BATCH = 50
    
    print(f"🎬 Seeding {TOTAL} users...")
    users = []
    all_post_ids = []

    # Phase 1: Register all users
    print("\n📝 Phase 1: Registering users...")
    for i in range(1, TOTAL + 1):
        user = register_user(i)
        if user:
            users.append(user)
            if i % 50 == 0:
                print(f"  ✅ Registered {i}/{TOTAL} users")
        else:
            print(f"  ⚠️  Failed to register user {i}")

    print(f"\n✅ Registered {len(users)} users")

    # Phase 2: Update bios + skills
    print("\n📝 Phase 2: Adding bios and skills...")
    for i, user in enumerate(users):
        update_bio(user)
        add_skills(user)
        if (i+1) % 50 == 0:
            print(f"  ✅ {i+1}/{len(users)} profiles updated")

    # Phase 3: Create posts
    print("\n📝 Phase 3: Creating posts...")
    for i, user in enumerate(users):
        post_ids = create_posts(user, count=random.randint(1, 4))
        all_post_ids.extend(post_ids)
        if (i+1) % 50 == 0:
            print(f"  ✅ {i+1}/{len(users)} users posted | Total posts: {len(all_post_ids)}")

    # Phase 4: Portfolio items
    print("\n📝 Phase 4: Adding portfolio items...")
    for i, user in enumerate(users):
        if random.random() > 0.3:  # 70% of users have portfolio
            add_portfolio(user)
        if (i+1) % 50 == 0:
            print(f"  ✅ {i+1}/{len(users)} portfolios done")

    # Phase 5: Likes
    print("\n📝 Phase 5: Adding likes...")
    for i, user in enumerate(users):
        like_posts(user, all_post_ids)
        if (i+1) % 50 == 0:
            print(f"  ✅ {i+1}/{len(users)} users liked posts")

    # Phase 6: Comments
    print("\n📝 Phase 6: Adding comments...")
    for i, user in enumerate(users):
        add_comments(user, all_post_ids)
        if (i+1) % 50 == 0:
            print(f"  ✅ {i+1}/{len(users)} users commented")

    # Phase 7: Connections
    print("\n📝 Phase 7: Adding connections...")
    for i, user in enumerate(users):
        other_users = [u for u in users if u["id"] != user["id"]]
        connect_users(user, other_users)
        if (i+1) % 50 == 0:
            print(f"  ✅ {i+1}/{len(users)} users connected")

    # Phase 8: Messages
    print("\n📝 Phase 8: Sending messages...")
    for i, user in enumerate(users):
        other_users = [u for u in users if u["id"] != user["id"]]
        send_messages(user, other_users)
        if (i+1) % 50 == 0:
            print(f"  ✅ {i+1}/{len(users)} users messaged")

    print(f"\n🎉 Seeding complete!")
    print(f"   Users: {len(users)}")
    print(f"   Posts: {len(all_post_ids)}")
    print(f"   Done! 🎬")

if __name__ == "__main__":
    main()
