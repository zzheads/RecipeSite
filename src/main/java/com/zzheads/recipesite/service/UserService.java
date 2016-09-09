package com.zzheads.recipesite.service;

import com.zzheads.recipesite.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    User findByUsername(String username);
    Long save(User user);
    List<User> findAll();
    User findById(Long id);
    void delete(User user);
}
