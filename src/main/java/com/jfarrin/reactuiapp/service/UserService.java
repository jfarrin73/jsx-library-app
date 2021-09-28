package com.jfarrin.reactuiapp.service;

import com.jfarrin.reactuiapp.model.User;
import com.jfarrin.reactuiapp.exceptions.EmailExistException;
import com.jfarrin.reactuiapp.exceptions.EmailNotFoundException;
import com.jfarrin.reactuiapp.exceptions.UserNotFoundException;
import com.jfarrin.reactuiapp.exceptions.UsernameExistException;

import java.util.List;

public interface UserService {

    String register (String firstName, String lastName, String username, String email) throws EmailExistException, UsernameExistException, UserNotFoundException;

    List<User> getUsers();

    User findUserByUsername(String username);

    User findUserByEmail(String email);

    User addNewUser(String firstName, String lastName, String username, String email, String role, boolean isNotLocked, boolean isActive) throws UserNotFoundException, EmailExistException, UsernameExistException;

    User updateUser(String currentUsername, String newFirstName, String newLastName, String newUsername, String newEmail, String role, boolean isNotLocked, boolean isActive) throws UserNotFoundException, EmailExistException, UsernameExistException;

    void deleteUser(Long id);

    void resetPassword(String email) throws EmailNotFoundException;
}
