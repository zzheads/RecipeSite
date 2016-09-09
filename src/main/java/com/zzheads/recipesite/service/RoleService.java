package com.zzheads.recipesite.service;

import com.zzheads.recipesite.model.Role;

import java.util.List;

/**
 * Created by alexeypapin on 06.09.16.
 */
public interface RoleService {
    Role findById(Long id);
    Role findByName(String name);
    List<Role> findAll();
    void save(Role role);
    void delete(Role role);
}
