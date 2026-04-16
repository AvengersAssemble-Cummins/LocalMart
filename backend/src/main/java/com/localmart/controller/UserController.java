package com.localmart.controller;

import com.localmart.model.User;
import com.localmart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public User getUserProfile(@PathVariable String userId) {
        return userRepository.findById(userId).orElse(null);
    }
}
