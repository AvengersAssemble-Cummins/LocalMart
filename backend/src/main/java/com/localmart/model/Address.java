package com.localmart.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    private String shopNo;
    private String flatNo;
    private String society;
    private String area;
    private String city;
    private String state;
    private String pincode;

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        if (shopNo != null && !shopNo.isEmpty()) sb.append("Shop ").append(shopNo).append(", ");
        if (flatNo != null && !flatNo.isEmpty()) sb.append(flatNo).append(", ");
        if (society != null && !society.isEmpty()) sb.append(society).append(", ");
        if (area != null && !area.isEmpty()) sb.append(area).append(", ");
        if (city != null && !city.isEmpty()) sb.append(city);
        return sb.toString();
    }
}
