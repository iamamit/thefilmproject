package com.thefilmproject;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUserId(Long userId);
    @Transactional
    void deleteByIdAndUserId(Long id, Long userId);
    @Transactional
    void deleteByUserId(Long userId);
}
