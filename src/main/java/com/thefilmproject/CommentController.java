package com.thefilmproject;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class CommentController {

    private final CommentRepository commentRepo;
    private final PostRepository postRepo;
    private final UserRepository userRepo;
    private final PortfolioRepository portfolioRepo;

    public CommentController(CommentRepository commentRepo, PostRepository postRepo,
                             UserRepository userRepo, PortfolioRepository portfolioRepo) {
        this.commentRepo = commentRepo;
        this.postRepo = postRepo;
        this.userRepo = userRepo;
        this.portfolioRepo = portfolioRepo;
    }

    // Get top-level comments for a post
    @GetMapping("/{postId}/comments")
    public List<Comment> getComments(@PathVariable Long postId) {
        return commentRepo.findTopLevelByPostId(postId);
    }

    // Get replies for a comment
    @GetMapping("/{postId}/comments/{commentId}/replies")
    public List<Comment> getReplies(@PathVariable Long postId, @PathVariable Long commentId) {
        return commentRepo.findByParentCommentIdOrderByCreatedAtAsc(commentId);
    }

    // Add a comment or reply
    @PostMapping("/{postId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long postId,
                                               @RequestBody Map<String, Object> body,
                                               Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        Post post = postRepo.findById(postId).orElseThrow();

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setAuthor(user);
        comment.setContent((String) body.get("content"));
        comment.setIsRead(false);

        // Handle reply (nested comment)
        Object parentIdObj = body.get("parentCommentId");
        if (parentIdObj != null) {
            Long parentId = Long.valueOf(parentIdObj.toString());
            Comment parent = commentRepo.findById(parentId).orElseThrow();
            // Only allow 1 level of nesting
            if (parent.getParentComment() == null) {
                comment.setParentComment(parent);
            }
        }

        // Handle portfolio attachment - attach whole portfolio flag
        Object sharePortfolio = body.get("sharePortfolio");
        if (Boolean.TRUE.equals(sharePortfolio)) {
            comment.setSharePortfolio(true);
        }

        return ResponseEntity.ok(commentRepo.save(comment));
    }

    // Delete a comment
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long postId,
                                            @PathVariable Long commentId,
                                            Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        Comment comment = commentRepo.findById(commentId).orElseThrow();
        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        commentRepo.deleteById(commentId);
        return ResponseEntity.ok().build();
    }

    // Mark comment as read (post author only)
    @PatchMapping("/{postId}/comments/{commentId}/read")
    public ResponseEntity<?> markRead(@PathVariable Long postId,
                                       @PathVariable Long commentId,
                                       Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        Post post = postRepo.findById(postId).orElseThrow();
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        commentRepo.markAsRead(commentId);
        return ResponseEntity.ok().build();
    }

    // Mark all comments on post as read
    @PatchMapping("/{postId}/comments/read-all")
    public ResponseEntity<?> markAllRead(@PathVariable Long postId, Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        Post post = postRepo.findById(postId).orElseThrow();
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        commentRepo.markAllReadByPostId(postId);
        return ResponseEntity.ok().build();
    }

    // Update candidate status (post author only)
    @PatchMapping("/{postId}/comments/{commentId}/candidate")
    public ResponseEntity<?> updateCandidateStatus(@PathVariable Long postId,
                                                    @PathVariable Long commentId,
                                                    @RequestBody Map<String, String> body,
                                                    Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        Post post = postRepo.findById(postId).orElseThrow();
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        Comment comment = commentRepo.findById(commentId).orElseThrow();
        comment.setCandidateStatus(body.get("status")); // CONSIDERABLE, NOT_INTERESTED, null
        commentRepo.save(comment);
        return ResponseEntity.ok().build();
    }
}
