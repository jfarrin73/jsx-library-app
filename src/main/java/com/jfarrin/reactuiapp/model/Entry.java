package com.jfarrin.reactuiapp.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Entry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @Lob
    private String code;
    private LocalDateTime created;
    private boolean isPrivate;
    private String createdBy;
    private String category;

    public Entry UpdateEntry(Entry newEntry){
        title = newEntry.title;
        description = newEntry.description;
        code = newEntry.code;
        isPrivate = newEntry.isPrivate;
        category = newEntry.category;
        return newEntry;
    }
}
