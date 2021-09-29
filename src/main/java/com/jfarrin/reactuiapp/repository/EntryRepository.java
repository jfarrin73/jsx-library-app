package com.jfarrin.reactuiapp.repository;

import com.jfarrin.reactuiapp.model.Entry;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntryRepository extends CrudRepository<Entry, Long> {
    Iterable<Entry> findAllByCategory(String category, Sort sort);
    Iterable<Entry> findAllByCreatedBy(String username, Sort sort);
    Iterable<Entry> findAll(Sort sort);
}
