package com.thefilmproject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {
    private final PortfolioRepository portfolioRepo;
    private final UserRepository userRepo;

    public PortfolioController(PortfolioRepository portfolioRepo, UserRepository userRepo) {
        this.portfolioRepo = portfolioRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/{username}")
    public List<PortfolioItem> getPortfolio(@PathVariable String username) {
        return portfolioRepo.findByUserUsernameOrderByCreatedAtDesc(username);
    }

    @PostMapping
    public ResponseEntity<PortfolioItem> addItem(@RequestBody Map<String, String> req, Authentication auth) {
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        PortfolioItem item = new PortfolioItem();
        item.setUser(user);
        item.setTitle(req.get("title"));
        item.setDescription(req.get("description"));
        item.setCategory(req.get("category"));
        item.setVideoUrl(req.get("videoUrl"));
        item.setImageUrl(req.get("imageUrl"));
        return ResponseEntity.ok(portfolioRepo.save(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id, Authentication auth) {
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        portfolioRepo.findById(id).ifPresent(item -> {
            if (item.getUser().getId().equals(user.getId())) portfolioRepo.delete(item);
        });
        return ResponseEntity.ok().build();
    }
}
