package com.studio.backend.controller;

import com.studio.backend.Service.BookingService;
import com.studio.backend.dto.BookingDtos.*;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingCreateRequest request,
            HttpSession session) {
        
        Integer customerId = (Integer) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        BookingResponse response = bookingService.createBooking(request, customerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<BookingListResponse> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session) {
        
        // Check if admin is logged in
        Integer adminId = (Integer) session.getAttribute("ADMIN_ID");
        if (adminId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        BookingListResponse response = bookingService.getAllBookings(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer")
    public ResponseEntity<BookingListResponse> getCustomerBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session) {
        
        Integer customerId = (Integer) session.getAttribute("customerId");
        if (customerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        BookingListResponse response = bookingService.getBookingsByCustomer(customerId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Integer bookingId,
            HttpSession session) {
        
        Integer customerId = (Integer) session.getAttribute("customerId");
        Integer adminId = (Integer) session.getAttribute("ADMIN_ID");
        
        if (customerId == null && adminId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        BookingResponse response = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> updateBooking(
            @PathVariable Integer bookingId,
            @Valid @RequestBody BookingUpdateRequest request,
            HttpSession session) {
        
        // Only admins can update bookings
        Integer adminId = (Integer) session.getAttribute("ADMIN_ID");
        if (adminId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        BookingResponse response = bookingService.updateBooking(bookingId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable Integer bookingId,
            HttpSession session) {
        
        // Only admins can delete bookings
        Integer adminId = (Integer) session.getAttribute("ADMIN_ID");
        if (adminId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        bookingService.deleteBooking(bookingId);
        return ResponseEntity.noContent().build();
    }
}
