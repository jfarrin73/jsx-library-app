package com.jfarrin.reactuiapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jfarrin.reactuiapp.model.Entry;
import com.jfarrin.reactuiapp.repository.EntryRepository;
import com.jfarrin.reactuiapp.utility.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc
public class EntryControllerTests {

    private static final String TITLE = "Sample Title";
    private static final String CATEGORY = "Element";
    private static final String DESCRIPTION = "Sample Description that is a little bit longer than the title and has a few 23$!#$%$%^WEGQEWRASDF#$%#$REf other characters.";

    private final Entry entry = new Entry();
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    MockMvc mvc;
    @Autowired
    EntryRepository repository;
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setup(){
        entry.setTitle(TITLE);
        entry.setDescription(DESCRIPTION);
        entry.setCategory(CATEGORY);
    }

    @Test
    void testGetEmptyEntries() throws Exception {

        List<Entry> expected = new ArrayList<>();

        this.mvc.perform(get("/entries/public"))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(expected)));
    }

    @Transactional
    @Rollback
    @Test
    void testGetMultipleEntries() throws Exception {
        Entry entry1 = this.repository.save(entry);
        Entry entry2 = this.repository.save(new Entry());
        Entry entry3 = this.repository.save(new Entry());

        List<Entry> expected = new ArrayList<>(Arrays.asList(entry1,entry2,entry3));

        this.mvc.perform(get("/entries/public"))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(expected)))
                .andExpect(jsonPath("$.[0].title", equalTo("Sample Title")))
                .andExpect(jsonPath("$.[0].category", equalTo(CATEGORY)))
                .andExpect(jsonPath("$.[0].description", equalTo(DESCRIPTION)));
    }

//    @Transactional
//    @Rollback
//    @Test
//    void testGetEntryById() throws Exception {
//        Entry expected = this.repository.save(entry);
//        this.mvc.perform(get("/entries/public/" + expected.getId()))
//                .andExpect(status().isOk())
//                .andExpect(content().json(mapper.writeValueAsString(expected)));
//    }
}
