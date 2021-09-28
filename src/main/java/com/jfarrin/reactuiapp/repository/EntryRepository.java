package com.jfarrin.reactuiapp.repository;

import com.jfarrin.reactuiapp.model.Entry;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntryRepository extends CrudRepository<Entry, Long> {
}
