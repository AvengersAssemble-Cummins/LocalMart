package com.localmart.controller;

import com.localmart.model.CartItem;
import com.localmart.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    @Autowired
    private CartRepository cartRepository;

    @GetMapping
    public List<CartItem> getCart(@RequestParam String userId) {
        return cartRepository.findByUserId(userId);
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestParam String userId, @RequestBody CartItem item) {
        CartItem existing = cartRepository.findByUserIdAndProductId(userId, item.getProductId());
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + item.getQuantity());
            return cartRepository.save(existing);
        }
        item.setUserId(userId);
        return cartRepository.save(item);
    }

    @PutMapping("/update")
    public CartItem updateCart(@RequestParam String userId, @RequestParam String productId, @RequestParam int quantity) {
        CartItem item = cartRepository.findByUserIdAndProductId(userId, productId);
        if (item != null) {
            item.setQuantity(quantity);
            return cartRepository.save(item);
        }
        return null;
    }

    @DeleteMapping("/remove")
    public void removeFromCart(@RequestParam String userId, @RequestParam String productId) {
        CartItem item = cartRepository.findByUserIdAndProductId(userId, productId);
        if (item != null) {
            cartRepository.delete(item);
        }
    }
}
