package com.thefilmproject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnoreProperties({"author", "likedByUserIds", "comments"})
    private Post post;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User author;

    @Column(length = 1000)
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Feature 1: Nested comments (max 2 levels)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_comment_id", nullable = true)
    @JsonIgnoreProperties({"post", "replies", "parentComment"})
    private Comment parentComment;

    // Feature 2: Read/unread by post author
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    // Feature 3: Portfolio attachment
    @Column(name = "share_portfolio")
    private Boolean sharePortfolio = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "portfolio_item_id", nullable = true)
    @JsonIgnoreProperties({"user"})
    private PortfolioItem portfolioItem;

    // Feature 4: Candidate status (only visible to post author)
    @Column(name = "candidate_status")
    private String candidateStatus; // CONSIDERABLE, NOT_INTERESTED, null

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Post getPost() { return post; }
    public void setPost(Post post) { this.post = post; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Comment getParentComment() { return parentComment; }
    public void setParentComment(Comment parentComment) { this.parentComment = parentComment; }
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public Boolean getSharePortfolio() { return sharePortfolio; }
    public void setSharePortfolio(Boolean sharePortfolio) { this.sharePortfolio = sharePortfolio; }
    public PortfolioItem getPortfolioItem() { return portfolioItem; }
    public void setPortfolioItem(PortfolioItem portfolioItem) { this.portfolioItem = portfolioItem; }
    public String getCandidateStatus() { return candidateStatus; }
    public void setCandidateStatus(String candidateStatus) { this.candidateStatus = candidateStatus; }
}
