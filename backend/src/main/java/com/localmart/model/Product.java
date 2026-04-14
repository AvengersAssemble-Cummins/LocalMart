package com.localmart.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Product")
public class Product {
    @Id
    private String id;

    private String name;

    private double price;

    private String category;

    private String expiryDate;

    private String imageUrl;

    private String shopId;

    private String shopName;
}
