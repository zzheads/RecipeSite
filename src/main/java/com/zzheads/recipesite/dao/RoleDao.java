package com.zzheads.recipesite.dao;

import com.zzheads.recipesite.model.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by alexeypapin on 06.09.16.
 */
@Repository
public interface RoleDao extends CrudRepository<Role, Long> {
}
