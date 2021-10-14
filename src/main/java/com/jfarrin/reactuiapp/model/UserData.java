package com.jfarrin.reactuiapp.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserData {
    private String username;
    private Long[] favoriteIds;
    private Long[] likeDislikes;
}
