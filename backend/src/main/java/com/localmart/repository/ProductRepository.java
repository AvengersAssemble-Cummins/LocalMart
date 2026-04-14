package com.localmart.repository;

import com.localmart.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByShopId(String shopId);
    List<Product> findByCategory(String category);
    List<Product> findByNameContainingIgnoreCase(String name);
}
