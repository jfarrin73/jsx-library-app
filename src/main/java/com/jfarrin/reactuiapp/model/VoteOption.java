package com.jfarrin.reactuiapp.model;

public enum VoteOption {
    NONE (0),
    LIKE (1),
    DISLIKE(-1);

    public final int value;

    VoteOption(int value){
        this.value = value;
    }
}
