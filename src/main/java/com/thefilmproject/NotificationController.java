package com.thefilmproject;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepo;
    private final UserRepository userRepo;

    public NotificationController(NotificationRepository notificationRepo, UserRepository userRepo) {
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
    }

    @GetMapping
    public Page<Notification> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        return notificationRepo.findByRecipientIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(page, 20));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(Authentication auth) {
        if (auth == null) return ResponseEntity.ok(Map.of("count", 0));
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        long count = notificationRepo.countByRecipientIdAndIsReadFalse(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllRead(Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        notificationRepo.markAllReadByUserId(user.getId());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id, Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        notificationRepo.markReadById(id);
        return ResponseEntity.ok().build();
    }
}
