package com.thefilmproject;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    private final CommentRepository commentRepo;
    private final PostRepository postRepo;
    private final UserRepository userRepo;

    public CommentController(CommentRepository commentRepo, PostRepository postRepo, UserRepository userRepo) {
        this.commentRepo = commentRepo;
        this.postRepo = postRepo;
        this.userRepo = userRepo;
    }

    @GetMapping
    public List<Comment> getComments(@PathVariable Long postId) {
        return commentRepo.findByPostIdOrderByCreatedAtAsc(postId);
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@PathVariable Long postId,
                                               @RequestBody CommentRequest request,
                                               Authentication auth) {
        User author = userRepo.findByEmail(auth.getName()).orElseThrow();
        Post post = postRepo.findById(postId).orElseThrow();
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setAuthor(author);
        comment.setContent(request.content());
        Comment saved = commentRepo.save(comment);
        // Notify post author about comment
        if (comment.getParentComment() == null) {
            notificationService.notifyComment(post.getAuthor(), user, postId);
        } else {
            // Notify parent comment author about reply
            notificationService.notifyReply(comment.getParentComment().getAuthor(), user, postId);
        }
        // Notify post author about portfolio attachment
        if (Boolean.TRUE.equals(comment.getSharePortfolio())) {
            notificationService.notifyPortfolioComment(post.getAuthor(), user, postId);
        }
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long postId,
                                            @PathVariable Long commentId,
                                            Authentication auth) {
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        Comment comment = commentRepo.findById(commentId).orElseThrow();
        if (!comment.getAuthor().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not authorized");
        }
        commentRepo.delete(comment);
        return ResponseEntity.ok().build();
    }

    record CommentRequest(String content) {}
}
