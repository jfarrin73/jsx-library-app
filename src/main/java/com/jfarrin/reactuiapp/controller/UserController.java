package com.jfarrin.reactuiapp.controller;

import com.jfarrin.reactuiapp.dto.UserDataDto;
import com.jfarrin.reactuiapp.model.*;
import com.jfarrin.reactuiapp.exceptions.*;
import com.jfarrin.reactuiapp.repository.VoteRepository;
import com.jfarrin.reactuiapp.service.UserService;
import com.jfarrin.reactuiapp.utility.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.jfarrin.reactuiapp.constant.SecurityConstant.JWT_TOKEN_HEADER;
import static com.jfarrin.reactuiapp.constant.SecurityConstant.TOKEN_PREFIX;
import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping(path = "/user")
public class UserController extends ExceptionHandling {
    public static final String AN_EMAIL_WITH_A_NEW_PASSWORD_WAS_SENT_TO = "An email with a new password was sent to :";
    public static final String USER_DELETED_SUCCESSFULLY = "User deleted successfully";
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final VoteRepository voteRepository;

    @Autowired
    public UserController(AuthenticationManager authenticationManager, UserService userService, JwtTokenProvider jwtTokenProvider, VoteRepository voteRepository) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.voteRepository = voteRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) throws UserNotFoundException, UsernameExistException, EmailExistException {
        return new ResponseEntity<>(userService.register(user.getUsername(), user.getEmail(), user.getPassword()),CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDataDto> login(@RequestBody User user) {
        authenticate(user.getUsername(), user.getPassword()); // If this fails, the rest of the method will not continue
        User loginUser = userService.findUserByUsername(user.getUsername());
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        HttpHeaders jwtHeader = getJwtHeader(userPrincipal);
        return new ResponseEntity<>(getUserDataDto(loginUser.getUsername()), jwtHeader, OK);
    }

    @PostMapping("/add")
    public ResponseEntity<User> addNewUser(@RequestParam("firstName") String firstName,
                                           @RequestParam("lastName") String lastName,
                                           @RequestParam("username") String username,
                                           @RequestParam("email") String email,
                                           @RequestParam("role") String role,
                                           @RequestParam("isActive") String isActive,
                                           @RequestParam("isNonLocked") String isNonLocked) throws UserNotFoundException, EmailExistException, UsernameExistException {
        User newUser = userService.addNewUser(firstName,lastName,username,email,role,Boolean.parseBoolean(isActive), Boolean.parseBoolean(isNonLocked));
        return new ResponseEntity<>(newUser,OK);
    }

    @PostMapping("/update")
    public ResponseEntity<User> updateNewUser(@RequestParam("currentUsername") String currentUsername,
                                              @RequestParam("firstName") String firstName,
                                              @RequestParam("lastName") String lastName,
                                              @RequestParam("username") String username,
                                              @RequestParam("email") String email,
                                              @RequestParam("role") String role,
                                              @RequestParam("isActive") String isActive,
                                              @RequestParam("isNonLocked") String isNonLocked) throws UserNotFoundException, EmailExistException, UsernameExistException {
        User updatedUser = userService.updateUser(currentUsername,firstName,lastName,username,email,role,Boolean.parseBoolean(isActive), Boolean.parseBoolean(isNonLocked));
        return new ResponseEntity<>(updatedUser,OK);
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUser(@PathVariable("username") String username){
        User user = userService.findUserByUsername(username);
        return new ResponseEntity<>(user,OK);
    }

    @GetMapping("/current")
    @PreAuthorize("hasAnyAuthority('user:read')")
    public ResponseEntity<UserDataDto> getCurrentUserData(@RequestHeader String authorization){
        String username = jwtTokenProvider.getSubject(authorization.substring(TOKEN_PREFIX.length()));
        return new ResponseEntity<>(getUserDataDto(username),OK);
    }

    @GetMapping("/list")
    public ResponseEntity<List<User>> getAllUser(){
        List<User> users = userService.getUsers();
        return new ResponseEntity<>(users,OK);
    }

    @GetMapping("/resetPassword/{email}")
    public ResponseEntity<HttpResponse> resetPassword(@PathVariable("email") String email) throws EmailNotFoundException {
        userService.resetPassword(email);
        return response(OK, AN_EMAIL_WITH_A_NEW_PASSWORD_WAS_SENT_TO + email);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyAuthority('user:delete')")
    public ResponseEntity<HttpResponse> deleteUser(@PathVariable("id") Long id){
        userService.deleteUser(id);
        return response(NO_CONTENT, USER_DELETED_SUCCESSFULLY);
    }

    private ResponseEntity<HttpResponse> response(HttpStatus status, String message){
        return new ResponseEntity<>(new HttpResponse(status.value(), status, status.getReasonPhrase().toUpperCase(),message), status);
    }

    private HttpHeaders getJwtHeader(UserPrincipal user) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJwtToken(user));
        return headers;
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }

    private UserDataDto getUserDataDto(String username){
        User user = userService.findUserByUsername(username);
        List<Vote> userVotes = voteRepository.findByUser(user);
        List<Long> likeIds = userVotes.stream().filter(x -> x.getValue().equals(VoteOption.LIKE)).map(v -> v.getEntry().getId()).collect(Collectors.toList());
        List<Long> dislikeIds = userVotes.stream().filter(x -> x.getValue().equals(VoteOption.DISLIKE)).map(v -> v.getEntry().getId()).collect(Collectors.toList());
        return new UserDataDto(username, likeIds, dislikeIds, user.getFavorites());
    }
}
