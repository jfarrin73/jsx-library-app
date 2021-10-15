package com.jfarrin.reactuiapp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jfarrin.reactuiapp.model.User;
import com.jfarrin.reactuiapp.repository.UserRepository;
import com.jfarrin.reactuiapp.utility.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;

import javax.transaction.Transactional;

import static com.jfarrin.reactuiapp.constant.SecurityConstant.JWT_TOKEN_HEADER;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTests {

    public static final String USERNAME = "NewTestUser";
    public static final String USERNAME1 = "NewTestUser1";
    public static final String EMAIL = "TestEmail@Test.com";
    public static final String EMAIL1 = "TestEmail1@Test.com";
    public static final String PASSWORD = "*&^%JHsdER";

    public static final ObjectMapper mapper = new ObjectMapper();
    public static final User user = new User();
    public static final String YOU_NEED_TO_LOG_IN_TO_ACCESS_THIS_PAGE = "You need to log in to access this page";

    @Autowired
    MockMvc mvc;
    @Autowired
    UserRepository repository;

    @BeforeEach
    void setup(){
        user.setUsername(USERNAME);
        user.setEmail(EMAIL);
        user.setPassword(PASSWORD);
    }

////////////////////////
///////REGISTER////////
//////////////////////

    @Transactional
    @Rollback
    @Test
    void testRegisterUser() throws Exception {
        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username", equalTo(USERNAME)))
                .andExpect(jsonPath("$.email", equalTo(EMAIL)));
    }

    @Transactional
    @Rollback
    @Test
    void testRegisterDuplicateUsernameThrowsException() throws Exception {
        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username", equalTo(USERNAME)))
                .andExpect(jsonPath("$.email", equalTo(EMAIL)));

        user.setEmail(EMAIL1);

        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", equalTo("USERNAME ALREADY EXISTS")));
    }

    @Transactional
    @Rollback
    @Test
    void testRegisterDuplicateEmailThrowsException() throws Exception {
        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username", equalTo(USERNAME)))
                .andExpect(jsonPath("$.email", equalTo(EMAIL)));

        user.setUsername(USERNAME1);

        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", equalTo("EMAIL ALREADY EXISTS")));
    }

/////////////////////
///////LOGIN////////
///////////////////

    @Transactional
    @Rollback
    @Test
    void testLoginUser() throws Exception {
        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username", equalTo(USERNAME)))
                .andExpect(jsonPath("$.email", equalTo(EMAIL)));

        System.out.println("User register complete");

        mvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(header().exists(JWT_TOKEN_HEADER))
                .andExpect(jsonPath("$.username", equalTo(USERNAME)))
                .andExpect(jsonPath("$.email", equalTo(EMAIL)));
    }

    @Transactional
    @Rollback
    @Test
    void testInvalidPasswordLogin() throws Exception {
        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username", equalTo(USERNAME)))
                .andExpect(jsonPath("$.email", equalTo(EMAIL)));

        System.out.println("User register complete");
        user.setPassword("WRONG PASSWORD");

        mvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(header().doesNotExist(JWT_TOKEN_HEADER))
                .andExpect(jsonPath("$.message", equalTo("INCORRECT USERNAME OR PASSWORD. PLEASE TRY AGAIN.")));
    }

    @Transactional
    @Rollback
    @Test
    void testInvalidUsernameLogin() throws Exception {
        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username", equalTo(USERNAME)))
                .andExpect(jsonPath("$.email", equalTo(EMAIL)));

        System.out.println("User register complete");
        user.setUsername("WRONG USERNAME");

        mvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(header().doesNotExist(JWT_TOKEN_HEADER))
                .andExpect(jsonPath("$.message", equalTo("INCORRECT USERNAME OR PASSWORD. PLEASE TRY AGAIN.")));
    }

    @Transactional
    @Rollback
    @Test
    void testEndpointAuthorization() throws Exception {
        mvc.perform(get("/user/list"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", equalTo(YOU_NEED_TO_LOG_IN_TO_ACCESS_THIS_PAGE)));
        mvc.perform(get("/user/current"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", equalTo(YOU_NEED_TO_LOG_IN_TO_ACCESS_THIS_PAGE)));
        mvc.perform(get("/user/delete/1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", equalTo(YOU_NEED_TO_LOG_IN_TO_ACCESS_THIS_PAGE)));
        mvc.perform(get("/user/resetPassword/asfsdf"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", equalTo(YOU_NEED_TO_LOG_IN_TO_ACCESS_THIS_PAGE)));
        mvc.perform(get("/user/someusername"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", equalTo(YOU_NEED_TO_LOG_IN_TO_ACCESS_THIS_PAGE)));
        mvc.perform(get("/user/update"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", equalTo(YOU_NEED_TO_LOG_IN_TO_ACCESS_THIS_PAGE)));
        mvc.perform(get("/user/add"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", equalTo(YOU_NEED_TO_LOG_IN_TO_ACCESS_THIS_PAGE)));
    }
}
