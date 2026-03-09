package com.thefilmproject;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    @Query("SELECT u FROM User u")
    Page<User> discoverUsers(
        @Param("role") User.CreatorRole role,
        @Param("city") String city,
        @Param("language") String language,
        @Param("availableOnly") boolean availableOnly,
        @Param("search") String search,
        Pageable pageable
    );
}
