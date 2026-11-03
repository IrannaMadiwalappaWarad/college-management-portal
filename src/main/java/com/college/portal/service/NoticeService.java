package com.college.portal.service;

import dto.NoticeRequestDTO;
import dto.NoticeResponseDTO;
import com.college.portal.model.Notice;
import com.college.portal.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeResponseDTO createNotice(NoticeRequestDTO requestDTO) {
        Notice notice = new Notice();
        BeanUtils.copyProperties(requestDTO, notice);
        
        Notice savedNotice = noticeRepository.save(notice);
        return mapToResponseDTO(savedNotice);
    }

    public List<NoticeResponseDTO> getAllNotices() {
        return noticeRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<NoticeResponseDTO> getActiveNotices() {
        // Fetch notices that are ACTIVE and haven't expired yet
        return noticeRepository.findByStatusAndExpiryDateAfterOrderByPublishDateDesc("ACTIVE", LocalDateTime.now())
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public NoticeResponseDTO getNoticeById(String id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found with ID: " + id));
        return mapToResponseDTO(notice);
    }

    public NoticeResponseDTO updateNotice(String id, NoticeRequestDTO requestDTO) {
        Notice existingNotice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found with ID: " + id));

        BeanUtils.copyProperties(requestDTO, existingNotice);
        Notice updatedNotice = noticeRepository.save(existingNotice);
        return mapToResponseDTO(updatedNotice);
    }

    public void deleteNotice(String id) {
        if (!noticeRepository.existsById(id)) {
            throw new RuntimeException("Notice not found with ID: " + id);
        }
        noticeRepository.deleteById(id);
    }

    public List<NoticeResponseDTO> filterNotices(String category, String audience) {
        return noticeRepository.findByCategoryAndAudience(category, audience)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private NoticeResponseDTO mapToResponseDTO(Notice notice) {
        NoticeResponseDTO dto = new NoticeResponseDTO();
        BeanUtils.copyProperties(notice, dto);
        return dto;
    }
}