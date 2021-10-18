package com.jfarrin.reactuiapp.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private VoteOption value;

    @ManyToOne
    private User user;

    @ManyToOne
    private Entry entry;

    public Vote(User user, Entry entry){
        this.value = VoteOption.NONE;
        this.user = user;
        this.entry = entry;
    }
}

