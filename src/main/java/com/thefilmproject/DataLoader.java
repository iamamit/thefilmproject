package com.thefilmproject;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PostRepository postRepo;
    private final UserSkillRepository skillRepo;
    private final PortfolioRepository portfolioRepo;
    private final CommentRepository commentRepo;
    private final ConnectionRepository connectionRepo;
    private final MessageRepository messageRepo;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepo, PostRepository postRepo,
                      UserSkillRepository skillRepo, PortfolioRepository portfolioRepo,
                      CommentRepository commentRepo, ConnectionRepository connectionRepo,
                      MessageRepository messageRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.postRepo = postRepo;
        this.skillRepo = skillRepo;
        this.portfolioRepo = portfolioRepo;
        this.commentRepo = commentRepo;
        this.connectionRepo = connectionRepo;
        this.messageRepo = messageRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // ─── DATA POOLS ───────────────────────────────────────────────────────────
    private static final String[] FIRST_NAMES = {
        "Amit", "Raj", "Priya", "Neha", "Arjun", "Kavya", "Vikram", "Ananya",
        "Rohan", "Deepika", "Karan", "Shruti", "Aditya", "Pooja", "Siddharth",
        "Meera", "Rahul", "Isha", "Vivek", "Nisha", "Tarun", "Riya", "Akash",
        "Simran", "Nikhil", "Anjali", "Harsh", "Divya", "Kunal", "Swati",
        "Manish", "Preeti", "Gaurav", "Ritika", "Sandeep", "Pallavi", "Aarav",
        "Kritika", "Varun", "Tanvi", "Ishaan", "Sneha", "Yash", "Komal",
        "Pranav", "Sakshi", "Dhruv", "Megha", "Aniket", "Sonal"
    };

    private static final String[] LAST_NAMES = {
        "Kumar", "Sharma", "Singh", "Patel", "Verma", "Gupta", "Joshi", "Mehta",
        "Malhotra", "Kapoor", "Chopra", "Bose", "Reddy", "Nair", "Iyer",
        "Chatterjee", "Mukherjee", "Das", "Roy", "Shah", "Desai", "Kulkarni",
        "Jain", "Agarwal", "Mishra", "Tiwari", "Pandey", "Yadav", "Sinha",
        "Trivedi", "Shukla", "Dubey", "Chauhan", "Rathore"
    };

    private static final String[] CITIES = {
        "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
        "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi",
        "Goa", "Indore", "Nagpur"
    };

    private static final User.CreatorRole[] ROLES = User.CreatorRole.values();

    private static final String[] LANGUAGES = {
        "Hindi", "English", "Tamil", "Telugu", "Malayalam", "Kannada",
        "Marathi", "Bengali", "Punjabi", "Gujarati"
    };

    private static final String[] BIOS = {
        "Passionate filmmaker with %d+ years of experience in %s's vibrant film scene.",
        "Award-winning creative professional who loves telling stories that matter. Based in %s.",
        "Independent filmmaker blending commercial appeal with artistic vision. %s based.",
        "Collaborated with top Bollywood productions. Always looking for new creative challenges.",
        "From short films to feature films — I've done it all. Let's create something amazing!",
        "Trained at FTII Pune. Currently working on my debut feature film.",
        "Music composer with a passion for experimental sounds and traditional Indian music.",
        "Visual storyteller with expertise in documentary and narrative filmmaking.",
        "Editor with an eye for detail. Have worked on 50+ projects across OTT platforms.",
        "Producer with a knack for bringing creative visions to life on budget."
    };

    private static final String[][] SKILLS_BY_ROLE = {
        {"Direction", "Screenplay Writing", "Shot Listing", "Casting", "Production Management"},
        {"Adobe Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "Color Grading", "Sound Design"},
        {"Music Composition", "Sound Design", "Pro Tools", "Logic Pro", "Ableton Live"},
        {"Production Management", "Budgeting", "Scheduling", "Script Development", "Distribution"},
        {"Method Acting", "Dialogue Delivery", "Improvisation", "Dance", "Stage Acting"},
        {"Cinematography", "Lighting Design", "Camera Operation", "DaVinci Resolve", "Drone Filming"},
        {"Adobe After Effects", "Nuke", "Maya", "Compositing", "3D Modeling", "Motion Tracking"},
        {"Screenplay Writing", "Dialogue Writing", "Story Development", "Research", "Script Coverage"}
    };

    private static final String[] SKILL_LEVELS = {"BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"};

    private static final String[] POST_CONTENTS = {
        "Just wrapped up shooting my latest short film in %s! Incredible experience. 🎬",
        "Looking for a talented collaborator for my upcoming project. DM if interested! #Collaboration",
        "Excited to announce my short film has been selected for a film festival! Dreams come true. 🏆",
        "Behind the scenes from today's shoot. The magic of filmmaking never gets old! ✨",
        "Just finished editing a documentary. Sleep deprived but absolutely worth it! 💪",
        "Collaboration opportunity: Looking for writers for a web series set in %s. Reach out!",
        "Grateful for all the connections on CollabNow! This community is incredible. 🙏",
        "New equipment day! Time to create magic! 📸",
        "Reminder: Great storytelling is about emotion, not just technique. #FilmTips",
        "Working on a passion project about street musicians of %s. Stay tuned! 🎸",
        "Just attended a masterclass by a legendary director. Mind blown. #LearningNeverStops",
        "Casting call for my short film! Looking for diverse talent. DM for details.",
        "The grind is real but so is the passion. Day 15 of back-to-back shoots! 🎥",
        "Throwback to my first ever short film. We've come a long way! #Growth",
        "New reel is out! Check my portfolio and let's collaborate. 🎬",
    };

    private static final String[] PROJECT_TYPES = {
        "FILM", "MUSIC", "WRITING", "PHOTOGRAPHY", "THEATRE", "DIGITAL"
    };

    private static final String[][] PORTFOLIO_DATA = {
        {"Ek Pal — Short Film", "A Mumbai taxi driver finds an old letter that changes his life. Shot in 47 locations over 12 days.", "Short Film", "https://www.youtube.com/watch?v=aqz-KE-bpKQ"},
        {"Zindagi — Music Video", "Official music video for rising Bollywood singer. Shot in Rajasthan over 3 days. 5M+ views.", "Music Video", "https://www.youtube.com/watch?v=9bZkp7q19f0"},
        {"The Last Train — Documentary", "A documentary about the last generation of railway vendors in Mumbai. Won Best Documentary at MIFF.", "Documentary", "https://www.youtube.com/watch?v=aqz-KE-bpKQ"},
        {"Bombay Dreams — Ad Film", "A 90-second brand film for a luxury real estate company. 2M+ views on social media.", "Ad Film", "https://www.youtube.com/watch?v=9bZkp7q19f0"},
        {"Behind the Lens — Reel", "Behind-the-scenes from my last 3 projects. Shows my directing process and crew management.", "Reel", "https://www.youtube.com/watch?v=aqz-KE-bpKQ"},
        {"Silent Streets — Photography", "A photo series documenting Mumbai's nightlife through a cinematic lens.", "Photography", "https://www.youtube.com/watch?v=9bZkp7q19f0"},
        {"Rising Stars — Theatre", "Directed a 3-act play about young dreamers in Mumbai. Performed at NCPA.", "Theatre", "https://www.youtube.com/watch?v=aqz-KE-bpKQ"},
        {"Digital Nomad — Web Series", "Created and directed a 5-episode web series about remote workers in India.", "Digital", "https://www.youtube.com/watch?v=9bZkp7q19f0"},
    };

    private static final String[] COMMENT_TEXTS = {
        "This is absolutely incredible work! 🔥",
        "Loved this! The storytelling is on another level.",
        "Congratulations! Well deserved. 👏",
        "Would love to collaborate on something like this!",
        "The cinematography here is breathtaking.",
        "This inspired me to start my own project. Thank you!",
        "Following for more content like this! 🙌",
        "This is exactly what Indian independent cinema needs!",
        "Amazing work! How long did this take to produce?",
        "The editing is so smooth. Brilliant work!",
    };

    private static final String[] MESSAGE_TEXTS = {
        "Hey! Loved your work. Would love to connect and possibly collaborate.",
        "Hi! I came across your profile and think we'd make a great team.",
        "Hello! I'm working on a project that might interest you. Can we chat?",
        "Your portfolio is amazing! I have a project that needs your skills.",
        "Great work on your recent post! Would love to discuss a collaboration.",
    };

    private final Random random = new Random(42);

    @Override
    public void run(String... args) {
        long existingUsers = userRepo.count();
        if (existingUsers >= 100) {
            System.out.println("✅ Data already seeded (" + existingUsers + " users). Skipping.");
            return;
        }

        System.out.println("🎬 Starting data seed...");
        long startTime = System.currentTimeMillis();

        // Create 200 users (change to 2000 for full seed)
        int TOTAL = 200;
        List<User> users = new ArrayList<>();

        // Phase 1: Create users
        System.out.println("📝 Phase 1: Creating " + TOTAL + " users...");
        for (int i = 1; i <= TOTAL; i++) {
            try {
                User user = createUser(i);
                users.add(user);
                if (i % 50 == 0) System.out.println("  ✅ Created " + i + "/" + TOTAL + " users");
            } catch (Exception e) {
                System.out.println("  ⚠️ Failed to create user " + i + ": " + e.getMessage());
            }
        }

        // Phase 2: Add skills
        System.out.println("📝 Phase 2: Adding skills...");
        for (User user : users) {
            try { addSkills(user); } catch (Exception e) {}
        }

        // Phase 3: Create posts
        System.out.println("📝 Phase 3: Creating posts...");
        List<Post> allPosts = new ArrayList<>();
        for (User user : users) {
            try {
                List<Post> posts = createPosts(user);
                allPosts.addAll(posts);
            } catch (Exception e) {}
        }

        // Phase 4: Add portfolio items
        System.out.println("📝 Phase 4: Adding portfolio items...");
        for (User user : users) {
            if (random.nextDouble() > 0.3) {
                try { addPortfolio(user); } catch (Exception e) {}
            }
        }

        // Phase 5: Add likes
        System.out.println("📝 Phase 5: Adding likes...");
        for (User user : users) {
            try { addLikes(user, allPosts); } catch (Exception e) {}
        }

        // Phase 6: Add comments
        System.out.println("📝 Phase 6: Adding comments...");
        for (User user : users) {
            try { addComments(user, allPosts); } catch (Exception e) {}
        }

        // Phase 7: Add connections
        System.out.println("📝 Phase 7: Adding connections...");
        for (int i = 0; i < users.size(); i++) {
            try { addConnections(users.get(i), users, i); } catch (Exception e) {}
        }

        // Phase 8: Add messages
        System.out.println("📝 Phase 8: Adding messages...");
        for (int i = 0; i < Math.min(users.size(), 50); i++) {
            try { addMessages(users.get(i), users, i); } catch (Exception e) {}
        }

        long elapsed = (System.currentTimeMillis() - startTime) / 1000;
        System.out.println("🎉 Seeding complete! " + users.size() + " users, " + allPosts.size() + " posts in " + elapsed + "s");
    }

    private User createUser(int i) {
        String firstName = FIRST_NAMES[random.nextInt(FIRST_NAMES.length)];
        String lastName = LAST_NAMES[random.nextInt(LAST_NAMES.length)];
        String city = CITIES[random.nextInt(CITIES.length)];
        String username = (firstName + lastName + i).toLowerCase().replaceAll("[^a-z0-9]", "");
        if (username.length() > 20) username = username.substring(0, 20);

        // Pick 1-3 random roles
        List<User.CreatorRole> roles = new ArrayList<>();
        int roleCount = random.nextInt(3) + 1;
        List<User.CreatorRole> allRoles = new ArrayList<>(Arrays.asList(ROLES));
        Collections.shuffle(allRoles, random);
        for (int j = 0; j < Math.min(roleCount, allRoles.size()); j++) {
            roles.add(allRoles.get(j));
        }

        // Pick 1-4 languages
        List<String> langs = new ArrayList<>(Arrays.asList(LANGUAGES));
        Collections.shuffle(langs, random);
        List<String> userLangs = langs.subList(0, random.nextInt(4) + 1);

        // Bio
        String bioTemplate = BIOS[random.nextInt(BIOS.length)];
        String bio;
        if (bioTemplate.contains("%d")) {
            bio = String.format(bioTemplate, random.nextInt(10) + 2, city);
        } else if (bioTemplate.contains("%s")) {
            bio = String.format(bioTemplate, city);
        } else {
            bio = bioTemplate;
        }

        User user = new User();
        user.setEmail("creator" + i + "@tfp.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setFullName(firstName + " " + lastName);
        user.setUsername(username);
        user.setCity(city);
        user.setCountry("India");
        user.setBio(bio);
        user.setAvailableForWork(random.nextBoolean());
        user.setRoles(new HashSet<>(roles));
        user.setLanguages(new ArrayList<>(userLangs));
        user.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(365)));

        return userRepo.save(user);
    }

    private void addSkills(User user) {
        int roleIndex = random.nextInt(SKILLS_BY_ROLE.length);
        String[] skillPool = SKILLS_BY_ROLE[roleIndex];
        int count = random.nextInt(4) + 2;
        for (int i = 0; i < Math.min(count, skillPool.length); i++) {
            UserSkill skill = new UserSkill();
            skill.setUser(user);
            skill.setName(skillPool[i]);
            skill.setCategory(user.getRoles().iterator().next().name());
            skill.setLevel(SKILL_LEVELS[random.nextInt(SKILL_LEVELS.length)]);
            skillRepo.save(skill);
        }
    }

    private List<Post> createPosts(User user) {
        List<Post> posts = new ArrayList<>();
        int count = random.nextInt(4) + 1;
        for (int i = 0; i < count; i++) {
            String template = POST_CONTENTS[random.nextInt(POST_CONTENTS.length)];
            String content = template.contains("%s") ? String.format(template, user.getCity()) : template;
            boolean isProject = random.nextDouble() > 0.6;

            Post post = new Post();
            post.setAuthor(user);
            post.setContent(content);
            post.setProject(isProject);
            if (isProject) post.setProjectType(PROJECT_TYPES[random.nextInt(PROJECT_TYPES.length)]);
            post.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(30)));
            post.setLikedByUserIds(new HashSet<>());

            posts.add(postRepo.save(post));
        }
        return posts;
    }

    private void addPortfolio(User user) {
        int count = random.nextInt(3) + 1;
        for (int i = 0; i < count; i++) {
            String[] data = PORTFOLIO_DATA[random.nextInt(PORTFOLIO_DATA.length)];
            PortfolioItem item = new PortfolioItem();
            item.setUser(user);
            item.setTitle(data[0]);
            item.setDescription(data[1]);
            item.setCategory(data[2]);
            item.setVideoUrl(data[3]);
            item.setImageUrl("");
            item.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(90)));
            portfolioRepo.save(item);
        }
    }

    private void addLikes(User user, List<Post> allPosts) {
        int count = Math.min(random.nextInt(15) + 3, allPosts.size());
        List<Post> shuffled = new ArrayList<>(allPosts);
        Collections.shuffle(shuffled, random);
        for (int i = 0; i < count; i++) {
            Post post = shuffled.get(i);
            if (!post.getLikedByUserIds().contains(user.getId())) {
                post.getLikedByUserIds().add(user.getId());
                postRepo.save(post);
            }
        }
    }

    private void addComments(User user, List<Post> allPosts) {
        int count = Math.min(random.nextInt(5) + 1, allPosts.size());
        List<Post> shuffled = new ArrayList<>(allPosts);
        Collections.shuffle(shuffled, random);
        for (int i = 0; i < count; i++) {
            Comment comment = new Comment();
            comment.setPost(shuffled.get(i));
            comment.setAuthor(user);
            comment.setContent(COMMENT_TEXTS[random.nextInt(COMMENT_TEXTS.length)]);
            comment.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(20)));
            commentRepo.save(comment);
        }
    }

    private void addConnections(User user, List<User> allUsers, int userIndex) {
        int count = random.nextInt(8) + 2;
        for (int i = 0; i < count; i++) {
            int targetIndex = random.nextInt(allUsers.size());
            if (targetIndex == userIndex) continue;
            User target = allUsers.get(targetIndex);

            boolean alreadyExists = connectionRepo.findAll().stream()
                .anyMatch(c -> (c.getSender().getId().equals(user.getId()) && c.getReceiver().getId().equals(target.getId())) ||
                               (c.getSender().getId().equals(target.getId()) && c.getReceiver().getId().equals(user.getId())));
            if (alreadyExists) continue;

            Connection conn = new Connection();
            conn.setSender(user);
            conn.setReceiver(target);
            conn.setStatus(random.nextDouble() > 0.3 ? Connection.ConnectionStatus.ACCEPTED : Connection.ConnectionStatus.PENDING);
            conn.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(60)));
            connectionRepo.save(conn);
        }
    }

    private void addMessages(User user, List<User> allUsers, int userIndex) {
        int count = random.nextInt(3) + 1;
        for (int i = 0; i < count; i++) {
            int targetIndex = random.nextInt(allUsers.size());
            if (targetIndex == userIndex) continue;
            User target = allUsers.get(targetIndex);

            Message msg = new Message();
            msg.setSender(user);
            msg.setReceiver(target);
            msg.setContent(MESSAGE_TEXTS[random.nextInt(MESSAGE_TEXTS.length)]);
            msg.setRead(random.nextBoolean());
            msg.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(30)));
            messageRepo.save(msg);
        }
    }
}
