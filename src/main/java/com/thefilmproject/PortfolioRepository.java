package com.thefilmproject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PortfolioRepository extends JpaRepository<PortfolioItem, Long> {
    List<PortfolioItem> findByUserUsernameOrderByCreatedAtDesc(String username);
    @org.springframework.transaction.annotation.Transactional
    void deleteByUserId(Long userId);
}
