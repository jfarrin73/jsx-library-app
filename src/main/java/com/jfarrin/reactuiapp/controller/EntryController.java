package com.jfarrin.reactuiapp.controller;

import com.jfarrin.reactuiapp.model.Entry;
import com.jfarrin.reactuiapp.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping( "/entries/public")
public class EntryController {

    private final EntryRepository repository;

    public EntryController(EntryRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Iterable<Entry> getAllEntries(){
        return this.repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entry> getEntryById(@PathVariable Long id){
        Optional<Entry> optional = this.repository.findById(id);
        return new ResponseEntity<>(optional.orElse(null),HttpStatus.OK);
    }

    @PostMapping("/create")
//    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<Entry> createEntry(@RequestBody Entry entry){
        return new ResponseEntity<>(this.repository.save(entry),HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasAnyAuthority('user:delete')")
    public ResponseEntity<String> deleteEntryById(@PathVariable Long id){
        this.repository.deleteById(id);
        return new ResponseEntity<>("Id: " + id + " has been deleted",HttpStatus.OK);
    }
}
