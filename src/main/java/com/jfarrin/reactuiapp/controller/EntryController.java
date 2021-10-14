package com.jfarrin.reactuiapp.controller;

import com.jfarrin.reactuiapp.model.Entry;
import com.jfarrin.reactuiapp.model.User;
import com.jfarrin.reactuiapp.model.UserData;
import com.jfarrin.reactuiapp.repository.EntryRepository;
import com.jfarrin.reactuiapp.repository.UserRepository;
import com.jfarrin.reactuiapp.service.UserService;
import com.jfarrin.reactuiapp.utility.JwtTokenProvider;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

import static com.jfarrin.reactuiapp.constant.SecurityConstant.TOKEN_PREFIX;

@RestController
@RequestMapping( "/entries/public")
public class EntryController {

    private final Sort defaultSort = Sort.by(Sort.Direction.DESC, "created");

    private final EntryRepository repository;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public EntryController(EntryRepository repository, UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.repository = repository;
        this.userService = userService;
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

    @PatchMapping("/find/{id}")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<Entry> updateEntryById(@RequestHeader String authorization, @PathVariable Long id, @RequestBody Entry newEntry){
        if (getCurrentUserName(authorization).equals(newEntry.getCreatedBy())) {
            Optional<Entry> optional = this.repository.findById(id);
            optional.ifPresent(entry -> this.repository.save(entry.UpdateEntry(newEntry)));
            return new ResponseEntity<>(optional.orElse(null),HttpStatus.OK);
        }
        // User is somehow trying to patch an entry not created by them
        return new ResponseEntity<>(null,HttpStatus.OK);
    }

    @PatchMapping("/favorite/{id}")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<Boolean> FavoriteEntryById(@RequestHeader String authorization, @PathVariable Long id){
        User user = userService.findUserByUsername(getCurrentUserName(authorization));
        if (user != null){
            List<Long> favorites = new ArrayList<>(Arrays.asList(user.getFavoriteIds() == null ? new Long[]{} : user.getFavoriteIds()));
            boolean isRemove = favorites.contains(id);
            if (isRemove){
                favorites.remove(id);
            } else {
                favorites.add(id);
            }
            userService.updateUserData(
                    new UserData(user.getUsername(), favorites.toArray(new Long[favorites.size()]), user.getLikesDislikes()));
            return new ResponseEntity<>(!isRemove,HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @PatchMapping("/like/{id}")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<Boolean> likeEntryById(@RequestHeader String authorization, @PathVariable Long id){
        User user = userService.findUserByUsername(getCurrentUserName(authorization));
        if (user != null){
            return new ResponseEntity<>(updateVote(user,id),HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @PatchMapping("/dislike/{id}")
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<Boolean> dislikeEntryById(@RequestHeader String authorization, @PathVariable Long id){
        System.out.println("id: " + id);
        System.out.println(getCurrentUserName(authorization));
        User user = userService.findUserByUsername(getCurrentUserName(authorization));
        System.out.println("user: " + user);
        if (user != null){
            return new ResponseEntity<>(updateVote(user,-id),HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    private boolean updateVote(User user,Long id){
        boolean isExists = true;
        List<Long> votes = new ArrayList<>(Arrays.asList(user.getLikesDislikes() == null ? new Long[]{} : user.getLikesDislikes()));
        System.out.println(votes);
        // id found, remove it
        if (votes.contains(id)) {
            votes.remove(id);
            isExists = false;
        }
        // Opposite id found, flip it
        else if (votes.contains(-id)) votes.set(votes.indexOf(-id),id);
            // No id found, add it
        else votes.add(id);

        System.out.println("here");

        userService.updateUserData(new UserData(user.getUsername(), user.getFavoriteIds(), votes.toArray(new Long[votes.size()])));
        return isExists;
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
