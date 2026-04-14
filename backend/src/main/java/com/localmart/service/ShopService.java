package com.localmart.service;

import com.localmart.model.Product;
import com.localmart.model.Shop;
import com.localmart.repository.ProductRepository;
import com.localmart.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ShopService {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private com.localmart.repository.ReviewRepository reviewRepository;

    public List<Shop> getAllShops() {
        List<Shop> shops = shopRepository.findAll();
        List<com.localmart.model.Review> reviews = reviewRepository.findAll();

        Map<String, Integer> reviewCountMap = new HashMap<>();
        for (com.localmart.model.Review review : reviews) {
            String shopId = review.getShopId();
            if (shopId != null) {
                reviewCountMap.put(shopId, reviewCountMap.getOrDefault(shopId, 0) + 1);
            }
        }

        for (Shop shop : shops) {
            shop.setReviewCount(reviewCountMap.getOrDefault(shop.getId(), 0));
        }

        return shops;
    }

    public Optional<Shop> getShopById(String id) {
        Optional<Shop> shopOpt = shopRepository.findById(id);
        if (shopOpt.isPresent()) {
            Shop shop = shopOpt.get();
            int count = reviewRepository.findByShopId(id).size();
            shop.setReviewCount(count);
        }
        return shopOpt;
    }

    public List<Shop> searchShops(String query) {
        return shopRepository.findByNameContainingIgnoreCase(query);
    }

    /**
     * Get all shops enriched with product categories.
     */
    public List<String> getAllShopCategories() {
        List<Shop> shops = shopRepository.findAll();
        return shops.stream()
            .map(Shop::getCategory)
            .filter(c -> c != null && !c.isEmpty())
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }
}
