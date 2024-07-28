package com.levantis.clinicManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Builder
@Data
public class ErrorDTO {
    public ErrorDTO(String unauthorizedPath) {

    }
}
