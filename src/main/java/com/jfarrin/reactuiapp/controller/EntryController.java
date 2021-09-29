package com.jfarrin.reactuiapp.controller;

import com.jfarrin.reactuiapp.model.Entry;
import com.jfarrin.reactuiapp.repository.EntryRepository;
import com.jfarrin.reactuiapp.utility.JwtTokenProvider;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.jfarrin.reactuiapp.constant.SecurityConstant.TOKEN_PREFIX;

@RestController
@RequestMapping( "/entries/public")
public class EntryController {

    private final Sort defaultSort = Sort.by(Sort.Direction.DESC, "created");

    private final EntryRepository repository;
    private final JwtTokenProvider jwtTokenProvider;

    public EntryController(EntryRepository repository, JwtTokenProvider jwtTokenProvider) {
        this.repository = repository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping
    public Iterable<Entry> getAllEntries(@RequestParam(defaultValue = "",required = false) String category){
        return category.equals(StringUtils.EMPTY)
                ? this.repository.findAll(defaultSort)
                : this.repository.findAllByCategory(category, defaultSort);
    }

    @GetMapping("/user")
    public Iterable<Entry> getAllUserEntries(@RequestHeader String authorization){
        return this.repository.findAllByCreatedBy(getCurrentUserName(authorization), defaultSort);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entry> getEntryById(@PathVariable Long id){
        Optional<Entry> optional = this.repository.findById(id);
        return new ResponseEntity<>(optional.orElse(null),HttpStatus.OK);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<Entry> createEntry(@RequestHeader String authorization, @RequestBody Entry entry){
        entry.setCreatedBy(getCurrentUserName(authorization));
        entry.setCreated(LocalDateTime.now());
        return new ResponseEntity<>(this.repository.save(entry),HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('user:delete')")
    public ResponseEntity<String> deleteEntryById(@PathVariable Long id){
        this.repository.deleteById(id);
        return new ResponseEntity<>("Id: " + id + " has been deleted",HttpStatus.OK);
    }

    private String getCurrentUserName(String authorization){
        return jwtTokenProvider.getSubject(authorization.substring(TOKEN_PREFIX.length()));
    }
}
