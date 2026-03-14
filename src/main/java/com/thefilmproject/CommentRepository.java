package com.thefilmproject;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
    long countByPostId(Long postId);
    @Transactional
    void deleteByAuthorId(Long authorId);
}
