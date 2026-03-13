package com.thefilmproject;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true)
    private String username;

    @Column(columnDefinition = "TEXT")
    private String profilePhotoUrl;
    @Column(columnDefinition = "TEXT")
    private String bio;
    private String city;
    private String country;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    private List<CreatorRole> roles = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_languages", joinColumns = @JoinColumn(name = "user_id"))
    private List<String> languages = new ArrayList<>();

    private boolean availableForWork = true;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getFullName() { return fullName; }
    public String getUsername() { return username; }
    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public String getBio() { return bio; }
    public String getCity() { return city; }
    public String getCountry() { return country; }
    public List<CreatorRole> getRoles() { return roles; }
    public List<String> getLanguages() { return languages; }
    public boolean isAvailableForWork() { return availableForWork; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setUsername(String username) { this.username = username; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }
    public void setBio(String bio) { this.bio = bio; }
    public void setCity(String city) { this.city = city; }
    public void setCountry(String country) { this.country = country; }
    public void setRoles(List<CreatorRole> roles) { this.roles = roles; }
    public void setLanguages(List<String> languages) { this.languages = languages; }
    public void setAvailableForWork(boolean availableForWork) { this.availableForWork = availableForWork; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final User user = new User();
        public Builder email(String email) { user.email = email; return this; }
        public Builder password(String password) { user.password = password; return this; }
        public Builder fullName(String fullName) { user.fullName = fullName; return this; }
        public Builder username(String username) { user.username = username; return this; }
        public Builder city(String city) { user.city = city; return this; }
        public Builder country(String country) { user.country = country; return this; }
        public Builder roles(List<CreatorRole> roles) { user.roles = roles; return this; }
        public User build() { return user; }
    }

    public enum CreatorRole {
        MUSICIAN, EDITOR, DIRECTOR, PRODUCER,
        ACTOR, CINEMATOGRAPHER, VFX_ARTIST, WRITER
    }
}
