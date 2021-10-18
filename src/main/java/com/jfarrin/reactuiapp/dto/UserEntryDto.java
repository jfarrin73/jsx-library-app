package com.jfarrin.reactuiapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEntryDto {
    private boolean isLike;
    private boolean isDislike;
    private long totalLikes;
    private long totalDislikes;
}
