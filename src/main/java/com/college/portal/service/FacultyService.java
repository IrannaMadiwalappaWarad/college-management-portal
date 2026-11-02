package com.college.portal.service;

import dto.FacultyRequestDTO;
import dto.FacultyResponseDTO;
import com.college.portal.model.Faculty;
import com.college.portal.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public FacultyResponseDTO addFaculty(FacultyRequestDTO requestDTO) {
        if (facultyRepository.existsByEmployeeId(requestDTO.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists: " + requestDTO.getEmployeeId());
        }

        Faculty faculty = new Faculty();
        BeanUtils.copyProperties(requestDTO, faculty);

        Faculty savedFaculty = facultyRepository.save(faculty);
        return mapToResponseDTO(savedFaculty);
    }

    public List<FacultyResponseDTO> getAllFaculty() {
        return facultyRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public FacultyResponseDTO getFacultyById(String id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found with ID: " + id));
        return mapToResponseDTO(faculty);
    }

    public FacultyResponseDTO updateFaculty(String id, FacultyRequestDTO requestDTO) {
        Faculty existingFaculty = facultyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found with ID: " + id));

        if (!existingFaculty.getEmployeeId().equals(requestDTO.getEmployeeId()) &&
            facultyRepository.existsByEmployeeId(requestDTO.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists: " + requestDTO.getEmployeeId());
        }

        BeanUtils.copyProperties(requestDTO, existingFaculty);
        Faculty updatedFaculty = facultyRepository.save(existingFaculty);
        return mapToResponseDTO(updatedFaculty);
    }

    public void deleteFaculty(String id) {
        if (!facultyRepository.existsById(id)) {
            throw new RuntimeException("Faculty not found with ID: " + id);
        }
        facultyRepository.deleteById(id);
    }

    public FacultyResponseDTO searchByEmployeeId(String employeeId) {
        Faculty faculty = facultyRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("Faculty not found with Employee ID: " + employeeId));
        return mapToResponseDTO(faculty);
    }

    public List<FacultyResponseDTO> filterByDepartment(String department) {
        return facultyRepository.findByDepartment(department)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private FacultyResponseDTO mapToResponseDTO(Faculty faculty) {
        FacultyResponseDTO dto = new FacultyResponseDTO();
        BeanUtils.copyProperties(faculty, dto);
        return dto;
    }
}