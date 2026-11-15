package com.taskflow.repository;

import com.taskflow.entity.User;
import com.taskflow.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {
    @Autowired UserRepository userRepository;

    @Test
    void findsUsersByEmailAndPagedNameOrEmailSearch() {
        User user = new User();
        user.setEmail("sam@example.com");
        user.setPassword("hash");
        user.setFullName("Sam Rivera");
        user.setRole(UserRole.PROJECT_MANAGER);
        userRepository.saveAndFlush(user);

        assertEquals(user.getId(), userRepository.findByEmail("sam@example.com").orElseThrow().getId());
        var result = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase("rivera", "rivera", PageRequest.of(0, 10));
        assertEquals(1, result.getTotalElements());
        assertEquals(UserRole.PROJECT_MANAGER, result.getContent().get(0).getRole());
    }
}
