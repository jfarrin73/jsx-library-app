package com.jfarrin.reactuiapp.repository;

import com.jfarrin.reactuiapp.model.Entry;
import com.jfarrin.reactuiapp.model.User;
import com.jfarrin.reactuiapp.model.Vote;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface VoteRepository extends CrudRepository<Vote,Long> {
    List<Vote> findByUserAndEntry(User user, Entry entry);
    List<Vote> findByEntry(Entry entry);
    List<Vote> findByUser(User user);
}
