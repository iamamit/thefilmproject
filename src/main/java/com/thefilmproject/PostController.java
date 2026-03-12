package com.thefilmproject;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepo;
    private final UserRepository userRepo;

    public PostController(PostRepository postRepo, UserRepository userRepo) {
        this.postRepo = postRepo;
        this.userRepo = userRepo;
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostRequest request, Authentication auth) {
        User author = userRepo.findByEmail(auth.getName()).orElseThrow();
        Post post = new Post();
        post.setAuthor(author);
        post.setContent(request.content());
        return ResponseEntity.ok(postRepo.save(post));
    }

    @GetMapping("/feed")
    public Page<Post> getFeed(@RequestParam(defaultValue = "0") int page) {
        return postRepo.findAllByOrderByCreatedAtDesc(PageRequest.of(page, 10));
    }

    @GetMapping("/user/{userId}")
    public Page<Post> getUserPosts(@PathVariable Long userId,
                                    @RequestParam(defaultValue = "0") int page) {
        return postRepo.findByAuthorId(userId, PageRequest.of(page, 10));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Post> toggleLike(@PathVariable Long postId, Authentication auth) {
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        Post post = postRepo.findById(postId).orElseThrow();
        if (post.getLikedByUserIds().contains(user.getId())) {
            post.getLikedByUserIds().remove(user.getId());
        } else {
            post.getLikedByUserIds().add(user.getId());
        }
        return ResponseEntity.ok(postRepo.save(post));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId, Authentication auth) {
        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        Post post = postRepo.findById(postId).orElseThrow();
        if (!post.getAuthor().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not authorized");
        }
        postRepo.delete(post);
        return ResponseEntity.ok().build();
    }

    record PostRequest(String content) {}
}
