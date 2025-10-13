package com.studio.backend.dto;

import com.studio.backend.model.Booking;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import java.time.LocalDateTime;

public class BookingDtos {

    public record BookingCreateRequest(
        @NotBlank(message = "Customer name is required")
        String customerName,
        
        @NotNull(message = "Service ID is required")
        Integer serviceId,
        
        @NotNull(message = "Booking date is required")
        @Future(message = "Booking date must be in the future")
        LocalDateTime bookingDate,
        
        String bookingDescription
    ) {}

    public record BookingUpdateRequest(
        String customerName,
        Integer serviceId,
        LocalDateTime bookingDate,
        String bookingDescription,
        Booking.BookingStatus bookingStatus
    ) {}

    public record BookingResponse(
        Integer bookingId,
        String customerName,
        Booking.BookingStatus bookingStatus,
        String bookingDescription,
        Integer customerId,
        Integer serviceId,
        String serviceName,
        LocalDateTime bookingDate,
        LocalDateTime createdAt
    ) {}

    public record BookingListResponse(
        java.util.List<BookingResponse> content,
        int totalElements,
        int totalPages,
        int currentPage,
        int size
    ) {}
}
