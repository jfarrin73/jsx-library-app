package com.jfarrin.reactuiapp.controller;

import com.jfarrin.reactuiapp.dto.EntryListDto;
import com.jfarrin.reactuiapp.dto.UserDataDto;
import com.jfarrin.reactuiapp.dto.UserEntryDto;
import com.jfarrin.reactuiapp.model.*;
import com.jfarrin.reactuiapp.repository.EntryRepository;
import com.jfarrin.reactuiapp.repository.VoteRepository;
import com.jfarrin.reactuiapp.service.UserService;
import com.jfarrin.reactuiapp.utility.JwtTokenProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.jfarrin.reactuiapp.constant.SecurityConstant.TOKEN_PREFIX;

@RestController
@RequestMapping( "/entries/public")
public class EntryController {

    private final Sort defaultSort = Sort.by(Sort.Direction.DESC, "created");

    private final EntryRepository repository;
    private final UserService userService;
    private final VoteRepository voteRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public EntryController(EntryRepository repository, UserService userService, VoteRepository voteRepository, JwtTokenProvider jwtTokenProvider) {
        this.repository = repository;
        this.userService = userService;
        this.voteRepository = voteRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping
    public EntryListDto getAllEntries(@RequestParam int pageNumber, @RequestParam(required = true,defaultValue = "10") int itemsPerPage){
        Page<Entry> page = this.repository.findAll(PageRequest.of(pageNumber,itemsPerPage,defaultSort));
        return new EntryListDto(page.getTotalPages(),page.getContent());
    }

    @GetMapping("/user")
    public EntryListDto getAllUserEntries(@RequestHeader String authorization,
                                          @RequestParam int pageNumber,
                                          @RequestParam(defaultValue = "10") int itemsPerPage){
        Page<Entry> page = this.repository.findAllByCreatedBy(getCurrentUserName(authorization), PageRequest.of(pageNumber,itemsPerPage, defaultSort));
        return new EntryListDto(page.getTotalPages(),page.getContent());
    }

    @GetMapping("/favorites")
    public Iterable<Entry> getAllUserFavorites(@RequestHeader String authorization){
        System.out.println("favorites length: " + userService.findUserByUsername(getCurrentUserName(authorization)).getFavorites().size());
        return userService.findUserByUsername(getCurrentUserName(authorization)).getFavorites();
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<Entry> createEntry(@RequestHeader String authorization, @RequestBody Entry entry){
        entry.setCreatedBy(getCurrentUserName(authorization));
        entry.setCreated(LocalDateTime.now());
        return new ResponseEntity<>(this.repository.save(entry),HttpStatus.CREATED);
    }

    @PatchMapping("/find/{id}")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<Entry> updateEntryById(@RequestHeader String authorization, @PathVariable Long id, @RequestBody Entry newEntry){
        if (getCurrentUserName(authorization).equals(newEntry.getCreatedBy())) {
            Optional<Entry> optional = this.repository.findById(id);
            if (optional.isPresent()) {
                this.repository.save(optional.get().UpdateEntry(newEntry));
                return new ResponseEntity<>(optional.get(), HttpStatus.OK);
            }
        }
        // User is somehow trying to patch an entry not created by them
        return new ResponseEntity<>(null,HttpStatus.OK);
    }

    @PatchMapping("/favorite/{id}")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<Boolean> FavoriteEntryById(@RequestHeader String authorization, @PathVariable Long id){
        User user = userService.findUserByUsername(getCurrentUserName(authorization));
        Entry entry = repository.findById(id).orElse(null);
        if (entry != null){
            Optional<Entry> favorite = user.getFavorites().stream().filter(x -> x.getId().equals(id)).findFirst();
            if (favorite.isPresent()){
                user.getFavorites().remove(favorite.get());
            }else{
                user.getFavorites().add(entry);
            }
            userService.updateUserData(new UserDataDto(user.getUsername(), new ArrayList<>(), new ArrayList<>(), user.getFavorites()));
            return new ResponseEntity<>(favorite.isEmpty(),HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @PatchMapping("/like/{id}")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<UserEntryDto> likeEntryById(@RequestHeader String authorization, @PathVariable Long id){
        User user = userService.findUserByUsername(getCurrentUserName(authorization));
        if (user != null){
            Entry entry = repository.findById(id).orElse(null);
            Vote vote = voteRepository.findByUserAndEntry(user,entry).stream().findFirst().orElse(null);
            if (vote == null){
                vote = new Vote(user,entry);
            }
            switch (Objects.requireNonNull(vote).getValue()){
                case LIKE -> {
                    vote.setValue(VoteOption.NONE);
                }
                case DISLIKE, NONE -> {
                    vote.setValue(VoteOption.LIKE);
                }
            }
            return getUserEntryDtoResponseEntity(entry, vote);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @PatchMapping("/dislike/{id}")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<UserEntryDto> dislikeEntryById(@RequestHeader String authorization, @PathVariable Long id){
        User user = userService.findUserByUsername(getCurrentUserName(authorization));
        if (user != null){
            Entry entry = repository.findById(id).orElse(null);
            Vote vote = voteRepository.findByUserAndEntry(user,entry).stream().findFirst().orElse(null);
            if (vote == null){
                vote = new Vote(user,entry);
            }
            switch (Objects.requireNonNull(vote).getValue()){
                case DISLIKE -> {
                    vote.setValue(VoteOption.NONE);
                }
                case LIKE, NONE -> {
                    vote.setValue(VoteOption.DISLIKE);
                }
            }
            return getUserEntryDtoResponseEntity(entry, vote);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    private ResponseEntity<UserEntryDto> getUserEntryDtoResponseEntity(Entry entry, Vote vote) {
        voteRepository.save(vote);

        List<Vote> entryVotes = voteRepository.findByEntry(entry);

        entry.setTotalLikes(entryVotes.stream().filter(x -> x.getValue().equals(VoteOption.LIKE)).count());
        entry.setTotalDislikes(entryVotes.stream().filter(x -> x.getValue().equals(VoteOption.DISLIKE)).count());
        repository.save(entry);

        return new ResponseEntity<>(new UserEntryDto(vote.getValue().equals(VoteOption.LIKE), vote.getValue().equals(VoteOption.DISLIKE), entry.getTotalLikes(),entry.getTotalDislikes()), HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<String> deleteEntryById(@RequestHeader String authorization, @PathVariable Long id){
        if (getCurrentUserName(authorization).equals(this.repository.findById(id).get().getCreatedBy())){
            this.repository.deleteById(id);
            return new ResponseEntity<>("Id: " + id + " has been deleted",HttpStatus.OK);
        }

        return new ResponseEntity<>("Unauthorized", HttpStatus.OK);
    }

    private String getCurrentUserName(String authorization){
        return jwtTokenProvider.getSubject(authorization.substring(TOKEN_PREFIX.length()));
    }
}
