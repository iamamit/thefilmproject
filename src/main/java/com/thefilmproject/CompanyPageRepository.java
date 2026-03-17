package com.thefilmproject;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CompanyPageRepository extends JpaRepository<CompanyPage, Long> {
    Optional<CompanyPage> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<CompanyPage> findByIsOfficialTrue();
    @Query("SELECT c FROM CompanyPage c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<CompanyPage> search(@Param("q") String q, Pageable pageable);
    List<CompanyPage> findByCreatedById(Long userId);
}
