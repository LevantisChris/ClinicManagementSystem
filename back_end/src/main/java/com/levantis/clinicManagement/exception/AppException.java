package com.levantis.clinicManagement.exception;

import org.springframework.http.HttpStatus;

public class AppException extends RuntimeException {

    private final HttpStatus code;

    public AppException(String message, HttpStatus httpStatus) {
        super(message);
        this.code = httpStatus;
    }

    public HttpStatus getCode() {
        return code;
    }

}
