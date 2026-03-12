import requests
import random

BASE = "http://localhost:8080/api"

ROLES = ["DIRECTOR", "EDITOR", "MUSICIAN", "PRODUCER", "ACTOR", "CINEMATOGRAPHER", "VFX_ARTIST", "WRITER"]
CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Lucknow"]
FIRST_NAMES = ["Aarav", "Arjun", "Rohan", "Vikram", "Siddharth", "Karan", "Rahul", "Priya", "Neha", "Pooja", "Anjali", "Deepa", "Sunita", "Meera", "Kavya", "Riya", "Suresh", "Rajesh", "Vijay", "Ankit", "Mohit", "Nikhil", "Sachin", "Aditya", "Shreya", "Divya", "Nisha", "Puja", "Sona", "Ravi"]
LAST_NAMES = ["Sharma", "Verma", "Singh", "Kumar", "Gupta", "Patel", "Shah", "Mehta", "Joshi", "Nair", "Menon", "Iyer", "Reddy", "Rao", "Pillai", "Das", "Bose", "Roy", "Sen", "Ghosh"]

POST_CONTENTS = [
    "Just wrapped up my latest short film! 3 months of hard work finally paying off 🎬",
    "Looking for a talented editor for my upcoming web series. DM me if interested!",
    "The magic of cinema is that it can transport you to another world in just 2 hours ✨",
    "Just got my first commercial project as a cinematographer. Dreams do come true! 📸",
    "Composing the background score for a thriller. The tension in the strings is everything 🎵",
    "Auditioned for a big production today. Fingers crossed! 🤞",
    "VFX breakdown of my latest project - 6 months of work in 60 seconds 🔥",
    "Writers block is real. Anyone else struggling with their screenplay today?",
    "Just attended IFFI 2024. So much inspiration from world cinema 🌍",
    "Looking for locations in Rajasthan for a period drama. Any suggestions?",
    "Proud to announce my short film has been selected for Mumbai Film Festival! 🏆",
    "The best camera is the one you have with you. Shot this on my phone today 📱",
    "Post production is 80% of filmmaking. Change my mind.",
    "Collaboration > Competition. Let's build each other up, film community! 🤝",
    "Just finished editing a 90 minute feature in 3 weeks. Sleep is overrated 😅",
    "Color grading transforms a film completely. Before vs after is mindblowing 🎨",
    "Casting is everything. Find the right actor and half your job is done.",
    "New reel out! Years of work compressed into 2 minutes 🎥",
    "Anyone else think Indian indie cinema is having its best moment right now?",
    "Sound design is the most underrated craft in filmmaking. Fight me.",
    "Just signed my first feature film as director. This is surreal! 🎬✨",
    "Hiring: VFX artist for OTT project. 3+ years exp required. Mumbai preferred.",
    "The difference between a good film and a great film is in the details.",
    "Raw footage vs final cut - the power of editing never ceases to amaze me ✂️",
    "Grateful for every rejection. It made me stronger and better at my craft 🙏",
    "Golden hour cinematography hits different every single time 🌅",
    "Just finished my screenplay after 6 months. 97 pages of pure heart ❤️",
    "Indian independent cinema is the most exciting thing happening right now.",
    "To every aspiring filmmaker: your story deserves to be told. Keep going! 💪",
    "Behind every great film is a team that believed in the vision. Grateful for mine 🙌",
]

COMMENT_TEMPLATES = [
    "Congratulations! Well deserved 🙌",
    "This is amazing! Keep it up!",
    "Totally agree with this!",
    "Great work! Would love to collaborate sometime",
    "Inspiring post! Thanks for sharing",
    "This is exactly what the industry needs to hear",
    "Wishing you all the best! 🎬",
    "So relatable 😂",
    "The film community needed this post 🙏",
    "Can't wait to see the final result!",
    "You're an inspiration to many of us",
    "DM sent! Would love to work together",
    "Indian cinema is lucky to have talent like yours",
    "This deserves way more likes! 🔥",
    "Sharing this with my whole team!",
    "Been waiting for someone to say this!",
    "Your dedication is inspiring 💯",
    "This is the content we need more of!",
]

print("🎬 Starting seed script...")
tokens = {}
user_ids = {}

# Login Amit
r = requests.post(f"{BASE}/auth/login", json={"email": "amit@test.com", "password": "password123"})
data = r.json()
tokens["amit@test.com"] = data["token"]
user_ids["amit@test.com"] = data["id"]
print(f"✅ Logged in as Amit (id: {data['id']})")

# Register 100 users
print("📝 Registering 100 users...")
success = 0
for i in range(100):
    first = random.choice(FIRST_NAMES)
    last = random.choice(LAST_NAMES)
    email = f"creator{i}@tfp.com"
    username = f"{first.lower()}{last.lower()}{i}"
    roles = random.sample(ROLES, random.randint(1, 2))
    try:
        r = requests.post(f"{BASE}/auth/register", json={
            "email": email, "password": "password123",
            "fullName": f"{first} {last}", "username": username,
            "roles": roles, "city": random.choice(CITIES), "country": "India"
        })
        if r.status_code == 200:
            data = r.json()
            tokens[email] = data["token"]
            user_ids[email] = data["id"]
            success += 1
    except: pass
    if i % 25 == 0: print(f"  {i}/100...")

print(f"✅ Registered {success} users")

all_emails = list(tokens.keys())
non_amit = [e for e in all_emails if e != "amit@test.com"]
amit_token = tokens["amit@test.com"]

# Connect Amit with first 30 users
print("🤝 Connecting Amit with 30 users...")
connected = 0
for email in non_amit[:30]:
    uid = user_ids[email]
    try:
        r = requests.post(f"{BASE}/connections/request/{uid}",
            headers={"Authorization": f"Bearer {amit_token}"})
        if r.status_code == 200:
            conn_id = r.json()["id"]
            r2 = requests.patch(f"{BASE}/connections/{conn_id}/respond?accept=true",
                headers={"Authorization": f"Bearer {tokens[email]}"})
            if r2.status_code == 200:
                connected += 1
    except: pass
print(f"✅ Connected Amit with {connected} users")

# Create posts
print("📝 Creating posts...")
post_ids = []
for email in all_emails:
    for _ in range(random.randint(1, 4)):
        try:
            r = requests.post(f"{BASE}/posts",
                headers={"Authorization": f"Bearer {tokens[email]}", "Content-Type": "application/json"},
                json={"content": random.choice(POST_CONTENTS)})
            if r.status_code == 200:
                post_ids.append(r.json()["id"])
        except: pass
print(f"✅ Created {len(post_ids)} posts")

# Likes
print("❤️ Adding likes...")
like_count = 0
sample_size = min(len(all_emails), 8)
for post_id in post_ids:
    for email in random.sample(all_emails, random.randint(1, sample_size)):
        try:
            requests.post(f"{BASE}/posts/{post_id}/like",
                headers={"Authorization": f"Bearer {tokens[email]}"})
            like_count += 1
        except: pass
print(f"✅ Added {like_count} likes")

# Comments
print("💬 Adding comments...")
comment_count = 0
for post_id in random.sample(post_ids, min(len(post_ids), int(len(post_ids)*0.7))):
    for email in random.sample(all_emails, random.randint(1, 5)):
        try:
            requests.post(f"{BASE}/posts/{post_id}/comments",
                headers={"Authorization": f"Bearer {tokens[email]}", "Content-Type": "application/json"},
                json={"content": random.choice(COMMENT_TEMPLATES)})
            comment_count += 1
        except: pass
print(f"✅ Added {comment_count} comments")

print("\n🎉 Done! Refresh your app to see the feed!")
