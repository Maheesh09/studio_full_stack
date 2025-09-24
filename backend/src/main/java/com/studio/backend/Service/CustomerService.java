package com.studio.backend.Service;
import com.studio.backend.dto.CustomerLoginRequest;
import com.studio.backend.dto.CustomerLoginResponse;
import com.studio.backend.dto.CustomerRegistrationRequest;
import com.studio.backend.exception.EmailAlreadyUsedException;
import com.studio.backend.exception.InvalidCredentialException;
import com.studio.backend.model.Customer;
import com.studio.backend.repository.CustomerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService {
    private final CustomerRepository repo;
    private final PasswordEncoder encoder;

    public CustomerService(CustomerRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Transactional
    public Integer register(CustomerRegistrationRequest req){
        if(repo.existsByEmail(req.email())){
            throw new EmailAlreadyUsedException();
        }
        Customer c = new Customer();
        c.setCustomer_name(req.name());
        c.setCustomer_phone(req.phone());
        c.setCustomer_email(req.email());
        c.setCustomer_password(encoder.encode(req.password()));
        return  repo.save(c).getCustomer_id();
    }
    public CustomerLoginResponse login(CustomerLoginRequest req){
        Customer c = repo.findByEmail(req.email())
                .orElseThrow(InvalidCredentialException::new);

        if(!encoder.matches(req.password(),c.getCustomer_password())){
            throw new InvalidCredentialException();
        }
        return new CustomerLoginResponse("ok",c.getCustomer_id(),c.getCustomer_name(),c.getCustomer_email());
    }
}

