package com.jfarrin.reactuiapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

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

    @JsonIgnore
    @ManyToMany
    private List<User> favoritedBy;

    private long totalLikes;
    private long totalDislikes;

    public Entry UpdateEntry(Entry newEntry){
        this.title = newEntry.title;
        this.description = newEntry.description;
        this.code = newEntry.code;
        this.isPrivate = newEntry.isPrivate;
        this.createdBy = newEntry.createdBy;
        this.category = newEntry.category;
        this.favoritedBy = newEntry.favoritedBy;
        this.totalDislikes = newEntry.totalDislikes;
        this.totalLikes = newEntry.totalLikes;

        return newEntry;
    }
}
