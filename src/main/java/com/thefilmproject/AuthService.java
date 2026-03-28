package com.thefilmproject;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.Optional;
@Service
public class AuthService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       @Lazy AuthenticationManager authenticationManager,
                       EmailService emailService,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       EmailVerificationTokenRepository emailVerificationTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), new ArrayList<>());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username already taken");
        }
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .username(request.username().toLowerCase())
                .roles(request.roles() != null ? request.roles() : new ArrayList<>())
                .city(request.city())
                .country(request.country())
                .build();
        userRepository.save(user);

        // Send email verification
        String verificationToken = java.util.UUID.randomUUID().toString();
        emailVerificationTokenRepository.save(new EmailVerificationToken(verificationToken, user));
        emailService.sendVerification(user.getEmail(), verificationToken);

        UserDetails userDetails = loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(token, user.getEmail(), user.getUsername(), user.getFullName(), user.getId());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserDetails userDetails = loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(token, user.getEmail(), user.getUsername(), user.getFullName(), user.getId());
    }

    @Transactional
    public void forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return; // silently ignore - don't leak if email exists
        User user = userOpt.get();
        // Delete any existing tokens
        passwordResetTokenRepository.deleteByUser(user);
        String token = java.util.UUID.randomUUID().toString();
        passwordResetTokenRepository.save(new PasswordResetToken(token, user));
        emailService.sendPasswordReset(email, token);
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) return false;
        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(java.time.LocalDateTime.now())) return false;
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
        return true;
    }

    public boolean verifyEmail(String token) {
        Optional<EmailVerificationToken> tokenOpt = emailVerificationTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) return false;
        EmailVerificationToken verToken = tokenOpt.get();
        if (verToken.isUsed() || verToken.getExpiresAt().isBefore(java.time.LocalDateTime.now())) return false;
        User user = verToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        verToken.setUsed(true);
        emailVerificationTokenRepository.save(verToken);
        return true;
    }

    @Transactional
    public void resendVerification(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return;
        User user = userOpt.get();
        if (user.isEmailVerified()) return;
        emailVerificationTokenRepository.deleteByUser(user);
        String token = java.util.UUID.randomUUID().toString();
        emailVerificationTokenRepository.save(new EmailVerificationToken(token, user));
        emailService.sendVerification(email, token);
    }

    public record RegisterRequest(
        String email, String password, String fullName,
        String username, java.util.List<User.CreatorRole> roles,
        String city, String country) {}
    public record LoginRequest(String email, String password) {}
    public record AuthResponse(String token, String email, String username, String fullName, Long id) {}
}
