package com.thefilmproject;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies")
public class CompanyPageController {

    private final CompanyPageRepository companyRepo;
    private final CompanyFollowRepository followRepo;
    private final UserRepository userRepo;

    public CompanyPageController(CompanyPageRepository companyRepo,
                                  CompanyFollowRepository followRepo,
                                  UserRepository userRepo) {
        this.companyRepo = companyRepo;
        this.followRepo = followRepo;
        this.userRepo = userRepo;
    }

    // Get all companies / search
    @GetMapping
    public ResponseEntity<?> getCompanies(@RequestParam(required = false) String q,
                                           @RequestParam(defaultValue = "0") int page) {
        if (q != null && !q.isBlank()) {
            return ResponseEntity.ok(companyRepo.search(q, PageRequest.of(page, 20)));
        }
        return ResponseEntity.ok(companyRepo.findAll(PageRequest.of(page, 20)));
    }

    // Get company by slug
    @GetMapping("/{slug}")
    public ResponseEntity<CompanyPage> getCompany(@PathVariable String slug) {
        return companyRepo.findBySlug(slug)
            .map(ResponseEntity::ok)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    // Create company page
    @PostMapping
    public ResponseEntity<CompanyPage> createCompany(@RequestBody Map<String, Object> body,
                                                      Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();

        String name = (String) body.get("name");
        String slug = ((String) body.getOrDefault("slug", name))
            .toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");

        if (companyRepo.existsBySlug(slug)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug already taken");
        }

        CompanyPage company = new CompanyPage();
        company.setName(name);
        company.setSlug(slug);
        company.setBio((String) body.get("bio"));
        company.setLogoUrl((String) body.get("logoUrl"));
        company.setCoverUrl((String) body.get("coverUrl"));
        company.setWebsite((String) body.get("website"));
        company.setCity((String) body.get("city"));
        company.setType((String) body.get("type"));
        company.setCreatedBy(user);

        return ResponseEntity.ok(companyRepo.save(company));
    }

    // Update company page
    @PutMapping("/{slug}")
    public ResponseEntity<CompanyPage> updateCompany(@PathVariable String slug,
                                                      @RequestBody Map<String, Object> body,
                                                      Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        CompanyPage company = companyRepo.findBySlug(slug)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!company.getCreatedBy().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (body.containsKey("name")) company.setName((String) body.get("name"));
        if (body.containsKey("bio")) company.setBio((String) body.get("bio"));
        if (body.containsKey("logoUrl")) company.setLogoUrl((String) body.get("logoUrl"));
        if (body.containsKey("coverUrl")) company.setCoverUrl((String) body.get("coverUrl"));
        if (body.containsKey("website")) company.setWebsite((String) body.get("website"));
        if (body.containsKey("city")) company.setCity((String) body.get("city"));
        if (body.containsKey("type")) company.setType((String) body.get("type"));

        return ResponseEntity.ok(companyRepo.save(company));
    }

    // Follow / Unfollow company
    @PostMapping("/{slug}/follow")
    public ResponseEntity<?> toggleFollow(@PathVariable String slug, Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        CompanyPage company = companyRepo.findBySlug(slug)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (followRepo.existsByUserIdAndCompanyId(user.getId(), company.getId())) {
            followRepo.deleteByUserIdAndCompanyId(user.getId(), company.getId());
            company.setFollowerCount(Math.max(0, company.getFollowerCount() - 1));
            companyRepo.save(company);
            return ResponseEntity.ok(Map.of("following", false, "followers", company.getFollowerCount()));
        } else {
            CompanyFollow follow = new CompanyFollow();
            follow.setUser(user);
            follow.setCompany(company);
            followRepo.save(follow);
            company.setFollowerCount(company.getFollowerCount() + 1);
            companyRepo.save(company);
            return ResponseEntity.ok(Map.of("following", true, "followers", company.getFollowerCount()));
        }
    }

    // Check if following
    @GetMapping("/{slug}/follow")
    public ResponseEntity<?> isFollowing(@PathVariable String slug, Authentication auth) {
        if (auth == null) return ResponseEntity.ok(Map.of("following", false));
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        CompanyPage company = companyRepo.findBySlug(slug)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        boolean following = followRepo.existsByUserIdAndCompanyId(user.getId(), company.getId());
        return ResponseEntity.ok(Map.of("following", following, "followers", company.getFollowerCount()));
    }

    // Get companies followed by user
    @GetMapping("/following")
    public ResponseEntity<?> getFollowing(Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        List<CompanyFollow> follows = followRepo.findByUserId(user.getId());
        List<CompanyPage> companies = follows.stream().map(CompanyFollow::getCompany).toList();
        return ResponseEntity.ok(companies);
    }

    // Get official pages
    @GetMapping("/official")
    public ResponseEntity<?> getOfficialPages() {
        return ResponseEntity.ok(companyRepo.findByIsOfficialTrue());
    }
}
