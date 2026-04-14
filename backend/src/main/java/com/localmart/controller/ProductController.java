package com.localmart.controller;

import com.localmart.model.Product;
import com.localmart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String shopId) {

        List<Product> products;

        if (shopId != null && !shopId.isEmpty()) {
            products = productRepository.findByShopId(shopId);
        } else if (category != null && !category.isEmpty()) {
            products = productRepository.findByCategory(category);
        } else {
            products = productRepository.findAll();
        }

        return ResponseEntity.ok(products);
    }
}
