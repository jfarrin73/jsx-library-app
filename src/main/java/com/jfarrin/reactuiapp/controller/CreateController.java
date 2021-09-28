package com.jfarrin.reactuiapp.controller;

import com.jfarrin.reactuiapp.model.Entry;
import com.jfarrin.reactuiapp.repository.EntryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/private")
public class CreateController {

    private final EntryRepository repository;

    public CreateController(EntryRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<Entry> createEntry(@RequestBody Entry entry){
        return new ResponseEntity<>(this.repository.save(entry), HttpStatus.CREATED);
    }

}
