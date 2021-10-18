package com.jfarrin.reactuiapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jfarrin.reactuiapp.model.Entry;
import com.jfarrin.reactuiapp.dto.EntryListDto;
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
import java.util.stream.Collectors;

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

        EntryListDto expected = new EntryListDto(0, new ArrayList<>());

        this.mvc.perform(get("/entries/public?pageNumber=0"))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(expected)));
//                .andExpect(content().json(mapper.writeValueAsString(expected)));
    }

    @Transactional
    @Rollback
    @Test
    void testGetMultipleEntries() throws Exception {
        Entry entry1 = this.repository.save(entry);
        Entry entry2 = this.repository.save(new Entry());
        Entry entry3 = this.repository.save(new Entry());

        List<Entry> entryList = new ArrayList<>(Arrays.asList(entry1,entry2,entry3));

        EntryListDto expected = new EntryListDto(1,entryList);

        this.mvc.perform(get("/entries/public?pageNumber=0"))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(expected)))
                .andExpect(jsonPath("$.entries[0].title", equalTo("Sample Title")))
                .andExpect(jsonPath("$.entries[0].category", equalTo(CATEGORY)))
                .andExpect(jsonPath("$.entries[0].description", equalTo(DESCRIPTION)));
    }

    @Transactional
    @Rollback
    @Test
    void testGetMultipleEntriesWithPagination() throws Exception {
        Entry entry1 = this.repository.save(entry);
        Entry entry2 = this.repository.save(new Entry());
        Entry entry3 = this.repository.save(new Entry());
        Entry entry4 = this.repository.save(new Entry());
        Entry entry5 = this.repository.save(new Entry());
        Entry entry6 = this.repository.save(new Entry());
        Entry entry7 = this.repository.save(new Entry());
        Entry entry8 = this.repository.save(new Entry());
        Entry entry9 = this.repository.save(new Entry());
        Entry entry10 = this.repository.save(new Entry());
        Entry entry11 = this.repository.save(new Entry());

        List<Entry> entryList1 = new ArrayList<>(Arrays.asList(entry1,entry2,entry3,entry4,entry5,entry6,entry7,entry8,entry9,entry10));
        List<Entry> entryList2 = new ArrayList<>(List.of(entry11));

        EntryListDto expected1 = new EntryListDto(2,entryList1);
        EntryListDto expected2 = new EntryListDto(2,entryList2);

        this.mvc.perform(get("/entries/public?pageNumber=0"))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(expected1)))
                .andExpect(jsonPath("$.entries[0].title", equalTo("Sample Title")))
                .andExpect(jsonPath("$.entries[0].category", equalTo(CATEGORY)))
                .andExpect(jsonPath("$.entries[0].description", equalTo(DESCRIPTION)));

        this.mvc.perform(get("/entries/public?pageNumber=1"))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(expected2)));
    }

    @Transactional
    @Rollback
    @Test
    void testGetMultipleEntriesWithPaginationAndCustomNumberOfItemsPerPage() throws Exception {
        Entry entry1 = this.repository.save(entry);
        Entry entry2 = this.repository.save(new Entry());
        Entry entry3 = this.repository.save(new Entry());
        Entry entry4 = this.repository.save(new Entry());
        Entry entry5 = this.repository.save(new Entry());
        Entry entry6 = this.repository.save(new Entry());

        List<Entry> entryList1 = new ArrayList<>(Arrays.asList(entry1,entry2,entry3));
        List<Entry> entryList2 = new ArrayList<>(Arrays.asList(entry4,entry5,entry6));

        EntryListDto expected1 = new EntryListDto(2,entryList1);
        EntryListDto expected2 = new EntryListDto(2,entryList2);

        this.mvc.perform(get("/entries/public?pageNumber=0&itemsPerPage=3"))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(expected1)))
                .andExpect(jsonPath("$.entries[0].title", equalTo("Sample Title")))
                .andExpect(jsonPath("$.entries[0].category", equalTo(CATEGORY)))
                .andExpect(jsonPath("$.entries[0].description", equalTo(DESCRIPTION)));

        this.mvc.perform(get("/entries/public?pageNumber=1&itemsPerPage=3"))
                .andExpect(status().isOk())
                .andExpect(content().json(mapper.writeValueAsString(expected2)));
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
