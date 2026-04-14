package com.localmart.repository;

import com.localmart.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByShopId(String shopId);
    List<Review> findByUserId(String userId);
}
