package com.jfarrin.reactuiapp.repository;

import com.jfarrin.reactuiapp.model.Entry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntryRepository extends PagingAndSortingRepository<Entry, Long> {
//    Iterable<Entry> findAllByCategory(String category, Sort sort);
    Page<Entry> findAllByCreatedBy(String username, Pageable page);
}
