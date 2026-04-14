package com.localmart.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Shops")
public class Shop {
    @Id
    private String id;

    private String name;

    private String ownerName;

    private String email;

    private String phone;

    private Address address;

    private double rating;

    private boolean verified;

    private String category;

    @org.springframework.data.annotation.Transient
    private int reviewCount;
}
