package com.thefilmproject;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;
    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;
    private static final Logger logger = LoggerFactory.getLogger(OAuth2SuccessHandler.class);

    public OAuth2SuccessHandler(UserRepository userRepo, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        logger.info("OAuth2 success for principal, email={}", email);
        if (email == null) {
            logger.warn("OAuth2 principal had no email, redirecting to frontend login with error");
            response.sendRedirect(frontendUrl + "/login?error=oauth_no_email");
            return;
        }
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        // Find or create user
        User user = userRepo.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(name);
            newUser.setPassword(UUID.randomUUID().toString()); // random password
            newUser.setProfilePhotoUrl(picture);
            // Generate unique username from email
            String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
            String username = baseUsername;
            int i = 1;
            while (userRepo.findByUsername(username).isPresent()) {
                username = baseUsername + i++;
            }
            newUser.setUsername(username);
            return userRepo.save(newUser);
        });

        // Update profile photo if changed
        if (picture != null && !picture.equals(user.getProfilePhotoUrl())) {
            user.setProfilePhotoUrl(picture);
            userRepo.save(user);
        }

        org.springframework.security.core.userdetails.UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername(user.getEmail()).password(user.getPassword()).authorities("USER").build();
        String token = jwtUtil.generateToken(userDetails);
        String redirectUrl = frontendUrl + "/oauth2/callback" +
            "?token=" + token +
            "&username=" + user.getUsername() +
            "&fullName=" + java.net.URLEncoder.encode(user.getFullName(), "UTF-8") +
            "&userId=" + user.getId() +
            "&photo=" + (picture != null ? java.net.URLEncoder.encode(picture, "UTF-8") : "");
        logger.info("Redirecting OAuth2 user {} -> {}", user.getEmail(), redirectUrl);
        response.sendRedirect(redirectUrl);
    }
}
