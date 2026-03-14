package com.thefilmproject;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final UserSkillRepository skillRepo;
    private final UserRepository userRepo;

    public SkillController(UserSkillRepository skillRepo, UserRepository userRepo) {
        this.skillRepo = skillRepo;
        this.userRepo = userRepo;
    }

    // Get my skills
    @GetMapping
    public List<UserSkill> getMySkills(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        User user = userRepo.findByEmail(auth.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + auth.getName()));
        return skillRepo.findByUserId(user.getId());
    }

    // Get skills by username (public)
    @GetMapping("/user/{username}")
    public List<UserSkill> getUserSkills(@PathVariable String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        return skillRepo.findByUserId(user.getId());
    }

    // Add a skill
    @PostMapping
    public ResponseEntity<UserSkill> addSkill(@RequestBody UserSkill skill, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        skill.setUser(user);
        return ResponseEntity.ok(skillRepo.save(skill));
    }

    // Delete a skill
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        skillRepo.deleteByIdAndUserId(id, user.getId());
        return ResponseEntity.ok().build();
    }
}
