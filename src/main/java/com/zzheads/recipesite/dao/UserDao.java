package com.zzheads.recipesite.dao;

import com.zzheads.recipesite.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends CrudRepository<User,Long> {
    User findByUsername(String username);
    User save(User user);
}
