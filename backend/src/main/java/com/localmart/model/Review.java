package com.localmart.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Reviews")
public class Review {
    @Id
    private String id;

    private String userId;

    private String shopId;

    private int rating;

    private String review;

    private String createdAt;
}
