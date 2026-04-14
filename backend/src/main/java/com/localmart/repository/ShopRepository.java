package com.localmart.repository;

import com.localmart.model.Shop;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ShopRepository extends MongoRepository<Shop, String> {
    List<Shop> findByNameContainingIgnoreCase(String name);
    List<Shop> findByCategory(String category);
    List<Shop> findByVerified(boolean verified);
    List<Shop> findByRatingGreaterThanEqual(double rating);
}
