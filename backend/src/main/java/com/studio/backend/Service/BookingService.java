package com.studio.backend.Service;

import com.studio.backend.dto.BookingDtos.*;
import com.studio.backend.exception.ResourceNotFoundException;
import com.studio.backend.model.Booking;
import com.studio.backend.model.Customer;
import com.studio.backend.model.ServiceItem;
import com.studio.backend.repository.BookingRepository;
import com.studio.backend.repository.CustomerRepository;
import com.studio.backend.repository.ServiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final ServiceRepository serviceRepository;

    public BookingService(BookingRepository bookingRepository, 
                         CustomerRepository customerRepository,
                         ServiceRepository serviceRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request, Integer customerId) {
        // Find customer
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        // Find service
        ServiceItem service = serviceRepository.findById(request.serviceId())
            .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + request.serviceId()));

        // Create booking
        Booking booking = new Booking();
        booking.setCustomerName(request.customerName());
        booking.setCustomer(customer);
        booking.setService(service);
        booking.setBookingDate(request.bookingDate());
        booking.setBookingDescription(request.bookingDescription());
        booking.setBookingStatus(Booking.BookingStatus.pending);

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    @Transactional(readOnly = true)
    public BookingListResponse getAllBookings(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookingPage = bookingRepository.findAll(pageable);
        
        List<BookingResponse> content = bookingPage.getContent().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());

        return new BookingListResponse(
            content,
            (int) bookingPage.getTotalElements(),
            bookingPage.getTotalPages(),
            bookingPage.getNumber(),
            bookingPage.getSize()
        );
    }

    @Transactional(readOnly = true)
    public BookingListResponse getBookingsByCustomer(Integer customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookingPage = bookingRepository.findByCustomerId(customerId, pageable);
        
        List<BookingResponse> content = bookingPage.getContent().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());

        return new BookingListResponse(
            content,
            (int) bookingPage.getTotalElements(),
            bookingPage.getTotalPages(),
            bookingPage.getNumber(),
            bookingPage.getSize()
        );
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse updateBooking(Integer bookingId, BookingUpdateRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (request.customerName() != null) {
            booking.setCustomerName(request.customerName());
        }
        if (request.bookingDate() != null) {
            booking.setBookingDate(request.bookingDate());
        }
        if (request.bookingDescription() != null) {
            booking.setBookingDescription(request.bookingDescription());
        }
        if (request.bookingStatus() != null) {
            booking.setBookingStatus(request.bookingStatus());
        }
        if (request.serviceId() != null) {
            ServiceItem service = serviceRepository.findById(request.serviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + request.serviceId()));
            booking.setService(service);
        }

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponse(updatedBooking);
    }

    @Transactional
    public void deleteBooking(Integer bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new ResourceNotFoundException("Booking not found with ID: " + bookingId);
        }
        bookingRepository.deleteById(bookingId);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return new BookingResponse(
            booking.getId(),
            booking.getCustomerName(),
            booking.getBookingStatus(),
            booking.getBookingDescription(),
            booking.getCustomer() != null ? booking.getCustomer().getCustomer_id() : null,
            booking.getService() != null ? booking.getService().getId() : null,
            booking.getService() != null ? booking.getService().getName() : null,
            booking.getBookingDate(),
            booking.getCreatedAt()
        );
    }
}
