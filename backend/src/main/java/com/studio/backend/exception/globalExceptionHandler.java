package com.studio.backend.exception;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.*;

    @RestControllerAdvice
    public class globalExceptionHandler {
        @ExceptionHandler(EmailAlreadyUsedException.class)
        public ResponseEntity<Map<String, Object>> emailUsed() {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "email_already_used"));
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, Object>> badRequest(MethodArgumentNotValidException ex) {
            Map<String, String> fieldErrors = new HashMap<>();
            ex.getBindingResult().getFieldErrors()
                    .forEach(e -> fieldErrors.put(e.getField(), e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(Map.of("error", "validation_error", "fields", fieldErrors));
        }
    }

