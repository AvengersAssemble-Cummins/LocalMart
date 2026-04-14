package com.localmart.service;

import com.localmart.dto.AuthResponse;
import com.localmart.dto.LoginRequest;
import com.localmart.dto.SignUpRequest;
import com.localmart.model.User;
import com.localmart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse signup(SignUpRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setDob(request.getDob());
        user.setAddress(request.getAddress());

        User savedUser = userRepository.save(user);

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", savedUser.getId());
        userMap.put("name", savedUser.getName());
        userMap.put("email", savedUser.getEmail());

        return new AuthResponse("Account created successfully", null, userMap);
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (!userOpt.isPresent()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate a simple token (in production, use JWT)
        String token = UUID.randomUUID().toString();

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());

        return new AuthResponse("Login successful", token, userMap);
    }
}
