package com.college.portal.repository;

import com.college.portal.model.Notice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NoticeRepository extends MongoRepository<Notice, String> {
    List<Notice> findByStatusAndExpiryDateAfterOrderByPublishDateDesc(String status, LocalDateTime currentDate);
    List<Notice> findByCategoryAndAudience(String category, String audience);
}