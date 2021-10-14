package com.jfarrin.reactuiapp.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false, updatable = false)
    private Long id;
    private String userId;
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String email;
    private LocalDate lastLoginDate;
    private LocalDate lastLoginDateDisplay;
    private LocalDate joinDate;
    private String roles; // ROLE_USER, ROLE_ADMIN
    private String[] authorities; // can make specific authorities and no matter what role they are, if they have a specific authority they can do that thing.
    private boolean isActive;
    private boolean isNotLocked;

    private Long[] favoriteIds;
    private Long[] likesDislikes;
}
