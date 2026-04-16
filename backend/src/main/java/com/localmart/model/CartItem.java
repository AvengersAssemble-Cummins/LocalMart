package com.localmart.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Cart")
public class CartItem {
    @Id
    private String id;
    private String userId;
    private String productId;
    private String shopId;
    private String shopName;
    private String name;
    private double price;
    private int quantity;
}
