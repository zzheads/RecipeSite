package com.zzheads.recipesite.service;

import com.zzheads.recipesite.dao.RecipeDao;
import com.zzheads.recipesite.dao.RoleDao;
import com.zzheads.recipesite.dao.UserDao;
import com.zzheads.recipesite.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserDao userDao;
    private final RoleDao roleDao;
    private final RecipeDao recipeDao;

    @Autowired
    public UserServiceImpl(UserDao userDao, RoleDao roleDao, RecipeDao recipeDao) {
        this.userDao = userDao;
        this.roleDao = roleDao;
        this.recipeDao = recipeDao;
    }

    @Override
    public User findByUsername(String username) {
        return userDao.findByUsername(username);
    }

    @Override
    public Long save(User user) {
        return userDao.save(user).getId();
    }

    @Override
    public List<User> findAll() {
        return (List<User>) userDao.findAll();
    }

    @Override
    public User findById(Long id) {
        return userDao.findOne(id);
    }

    @Override
    public void delete(User user) {
        userDao.delete(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Load user from the database (throw exception if not found)
        User user = userDao.findByUsername(username);
        if(user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        // Return user object
        return user;
    }
}
