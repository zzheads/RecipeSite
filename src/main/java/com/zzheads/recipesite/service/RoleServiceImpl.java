package com.zzheads.recipesite.service;

import com.zzheads.recipesite.dao.RoleDao;
import com.zzheads.recipesite.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

/**
 * Created by alexeypapin on 06.09.16.
 */
@Service
public class RoleServiceImpl implements RoleService {
    private final RoleDao roleDao;

    @Autowired
    public RoleServiceImpl(RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    @Override
    public Role findById(Long id) {
        return roleDao.findOne(id);
    }

    @Override
    public Role findByName(String name) {
        for (Role role : roleDao.findAll()) {
            if (role.getName()!=null && role.getName().equals(name))
                return role;
        }
        return null;
    }

    @Override
    public List<Role> findAll() {
        return (List<Role>) roleDao.findAll();
    }

    @Override
    public void save(Role role) {
        roleDao.save(role);
    }

    @Override
    public void delete(Role role) {
        roleDao.delete(role);
    }
}
