package com.jfarrin.reactuiapp.dto;

import com.jfarrin.reactuiapp.model.Entry;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class EntryListDto {
    private int totalPages;
    private Iterable<Entry> entries;
}
