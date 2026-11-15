package com.taskflow.service;

import com.taskflow.entity.RefreshToken;
import com.taskflow.entity.User;
import com.taskflow.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import com.taskflow.exception.UnauthorizedException;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public String createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));

        refreshTokenRepository.save(refreshToken);
        return token;
    }

    public boolean isValid(String token) {
        return refreshTokenRepository.findByToken(token)
                .map(rt -> !rt.isExpired())
                .orElse(false);
    }

    @Transactional
    public User rotate(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Refresh token is invalid or expired"));
        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token is invalid or expired");
        }
        User user = refreshToken.getUser();
        refreshTokenRepository.delete(refreshToken);
        return user;
    }

    @Transactional
    public void revoke(String token) {
        if (token != null && !token.isBlank()) refreshTokenRepository.deleteByToken(token);
    }
}
