package com.localmart.controller;

import com.localmart.model.Product;
import com.localmart.model.Shop;
import com.localmart.repository.ProductRepository;
import com.localmart.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Shop>> getAllShops(
            @RequestParam(required = false) String search) {

        List<Shop> shops = shopService.getAllShops();

        if (search != null && !search.isEmpty()) {
            String q = search.toLowerCase();
            shops = shops.stream()
                .filter(s -> 
                    (s.getName() != null && s.getName().toLowerCase().contains(q)) || 
                    (s.getOwnerName() != null && s.getOwnerName().toLowerCase().contains(q))
                )
                .collect(java.util.stream.Collectors.toList());
        }

        return ResponseEntity.ok(shops);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(shopService.getAllShopCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getShopById(@PathVariable String id) {
        Optional<Shop> shop = shopService.getShopById(id);
        if (shop.isPresent()) {
            return ResponseEntity.ok(shop.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<Product>> getShopProducts(@PathVariable String id) {
        List<Product> products = productRepository.findByShopId(id);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Shop>> searchShops(@RequestParam String q) {
        List<Shop> shops = shopService.searchShops(q);
        return ResponseEntity.ok(shops);
    }
}
