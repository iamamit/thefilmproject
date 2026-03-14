package com.thefilmproject;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final ConnectionRepository connectionRepository;

    public UserController(UserRepository userRepository, ConnectionRepository connectionRepository) {
        this.userRepository = userRepository;
        this.connectionRepository = connectionRepository;
    }

    // ─── PUBLIC: Discover creators ─────────────────────────────────
    @GetMapping("/discover")
    public ResponseEntity<Page<User>> discover(
            @RequestParam(required = false) User.CreatorRole role,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String language,
            @RequestParam(defaultValue = "false") boolean availableOnly,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(userRepository.discoverUsers(
                role, city, language, availableOnly, search,
                PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    // ─── PRIVATE: Get my profile ───────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // ─── PRIVATE: Get profile by username ─────────────────────────
    @GetMapping("/{username}")
    public ResponseEntity<User> getProfile(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    // ─── PRIVATE: Update my profile ───────────────────────────────
    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody User updated) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (updated.getFullName() != null) user.setFullName(updated.getFullName());
        if (updated.getBio() != null) user.setBio(updated.getBio());
        if (updated.getCity() != null) user.setCity(updated.getCity());
        if (updated.getCountry() != null) user.setCountry(updated.getCountry());
        if (updated.getRoles() != null) user.setRoles(updated.getRoles());
        if (updated.getLanguages() != null) user.setLanguages(updated.getLanguages());
        user.setAvailableForWork(updated.isAvailableForWork());

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/me/photo")
    public ResponseEntity<?> uploadPhoto(@RequestBody java.util.Map<String, String> body, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        String photo = body.get("photo");
        if (photo == null || photo.isEmpty()) return ResponseEntity.badRequest().body("No photo provided");
        user.setProfilePhotoUrl(photo);
        userRepository.save(user);
        return ResponseEntity.ok(java.util.Map.of("message", "Photo updated"));
    }
}