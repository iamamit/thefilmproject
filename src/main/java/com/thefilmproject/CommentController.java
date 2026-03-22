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
    private final NotificationService notificationService;

    public CommentController(CommentRepository commentRepo, PostRepository postRepo,
                             UserRepository userRepo, PortfolioRepository portfolioRepo,
                             NotificationService notificationService) {
        this.commentRepo = commentRepo;
        this.postRepo = postRepo;
        this.userRepo = userRepo;
        this.portfolioRepo = portfolioRepo;
        this.notificationService = notificationService;
    }

    @GetMapping("/{postId}/comments")
    public List<Comment> getComments(@PathVariable Long postId) {
        return commentRepo.findTopLevelByPostId(postId);
    }

    @GetMapping("/{postId}/comments/{commentId}/replies")
    public List<Comment> getReplies(@PathVariable Long postId, @PathVariable Long commentId) {
        return commentRepo.findByParentCommentIdOrderByCreatedAtAsc(commentId);
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long postId,
                                               @RequestBody Map<String, Object> body,
                                               Authentication auth) {
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        User author = userRepo.findByEmail(auth.getName()).orElseThrow();
        Post post = postRepo.findById(postId).orElseThrow();

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setAuthor(author);
        comment.setContent((String) body.get("content"));
        comment.setIsRead(false);

        Comment parentComment = null;
        Object parentIdObj = body.get("parentCommentId");
        if (parentIdObj != null) {
            Long parentId = Long.valueOf(parentIdObj.toString());
            parentComment = commentRepo.findById(parentId).orElse(null);
            if (parentComment != null && parentComment.getParentComment() == null) {
                comment.setParentComment(parentComment);
            } else {
                parentComment = null;
            }
        }

        Object sharePortfolio = body.get("sharePortfolio");
        if (Boolean.TRUE.equals(sharePortfolio)) {
            comment.setSharePortfolio(true);
        }

        Comment saved = commentRepo.save(comment);

        if (parentComment == null) {
            notificationService.notifyComment(post.getAuthor(), author, postId);
        } else {
            notificationService.notifyReply(parentComment.getAuthor(), author, postId);
        }
        if (Boolean.TRUE.equals(comment.getSharePortfolio())) {
            notificationService.notifyPortfolioComment(post.getAuthor(), author, postId);
        }

        return ResponseEntity.ok(saved);
    }

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
        comment.setCandidateStatus(body.get("status"));
        commentRepo.save(comment);
        return ResponseEntity.ok().build();
    }
}
