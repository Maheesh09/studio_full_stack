package com.studio.backend.repository;

import com.studio.backend.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    
    // Find bookings by customer ID
    @Query("SELECT b FROM Booking b WHERE b.customer.customer_id = :customerId")
    List<Booking> findByCustomerId(@Param("customerId") Integer customerId);
    
    // Find bookings by service ID
    @Query("SELECT b FROM Booking b WHERE b.service.id = :serviceId")
    List<Booking> findByServiceId(@Param("serviceId") Integer serviceId);
    
    // Find bookings by status
    List<Booking> findByBookingStatus(Booking.BookingStatus status);
    
    // Find bookings by customer ID with pagination
    @Query("SELECT b FROM Booking b WHERE b.customer.customer_id = :customerId")
    Page<Booking> findByCustomerId(@Param("customerId") Integer customerId, Pageable pageable);
    
    // Find all bookings with pagination
    Page<Booking> findAll(Pageable pageable);
    
    // Find bookings by date range
    @Query("SELECT b FROM Booking b WHERE b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByBookingDateBetween(@Param("startDate") java.time.LocalDateTime startDate, 
                                          @Param("endDate") java.time.LocalDateTime endDate);
}
