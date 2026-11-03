package com.college.portal.controller;

import dto.NoticeRequestDTO;
import dto.NoticeResponseDTO;
import com.college.portal.service.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping
    public ResponseEntity<NoticeResponseDTO> createNotice(@Valid @RequestBody NoticeRequestDTO requestDTO) {
        return new ResponseEntity<>(noticeService.createNotice(requestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<NoticeResponseDTO>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    @GetMapping("/active")
    public ResponseEntity<List<NoticeResponseDTO>> getActiveNotices() {
        return ResponseEntity.ok(noticeService.getActiveNotices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeResponseDTO> getNoticeById(@PathVariable String id) {
        return ResponseEntity.ok(noticeService.getNoticeById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoticeResponseDTO> updateNotice(
            @PathVariable String id, 
            @Valid @RequestBody NoticeRequestDTO requestDTO) {
        return ResponseEntity.ok(noticeService.updateNotice(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable String id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<NoticeResponseDTO>> filterNotices(
            @RequestParam String category, 
            @RequestParam String audience) {
        return ResponseEntity.ok(noticeService.filterNotices(category, audience));
    }
}