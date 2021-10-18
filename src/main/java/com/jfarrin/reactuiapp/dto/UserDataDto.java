package com.jfarrin.reactuiapp.dto;

import com.jfarrin.reactuiapp.model.Entry;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDataDto {
    private String username;
    private List<Long> likes;
    private List<Long> dislikes;
    private List<Entry> favorites;
}
