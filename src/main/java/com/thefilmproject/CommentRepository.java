package com.thefilmproject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Get top-level comments only (no replies)
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.parentComment IS NULL ORDER BY c.createdAt ASC")
    List<Comment> findTopLevelByPostId(@Param("postId") Long postId);

    // Get replies for a comment
    List<Comment> findByParentCommentIdOrderByCreatedAtAsc(Long parentCommentId);

    // Count all comments for a post
    long countByPostId(Long postId);

    // Mark comment as read
    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.isRead = true WHERE c.id = :id")
    void markAsRead(@Param("id") Long id);

    // Mark all comments on a post as read
    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.isRead = true WHERE c.post.id = :postId")
    void markAllReadByPostId(@Param("postId") Long postId);

    // Get unread count for post author
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId AND c.isRead = false AND c.author.id != :authorId")
    long countUnreadByPostId(@Param("postId") Long postId, @Param("authorId") Long authorId);

    @Transactional
    void deleteByAuthorId(Long authorId);
}
