package com.thefilmproject;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface CompanyFollowRepository extends JpaRepository<CompanyFollow, Long> {
    Optional<CompanyFollow> findByUserIdAndCompanyId(Long userId, Long companyId);
    boolean existsByUserIdAndCompanyId(Long userId, Long companyId);
    List<CompanyFollow> findByUserId(Long userId);
    long countByCompanyId(Long companyId);
    @Transactional
    void deleteByUserIdAndCompanyId(Long userId, Long companyId);
}
