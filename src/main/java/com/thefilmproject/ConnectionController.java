package com.thefilmproject;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    public ConnectionController(ConnectionRepository connectionRepository,
                                 UserRepository userRepository) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
    }

    // Send connection request
    @PostMapping("/request/{receiverId}")
    public ResponseEntity<Connection> sendRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long receiverId) {

        User sender = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getId().equals(receiverId)) {
            throw new RuntimeException("Cannot connect with yourself");
        }

        connectionRepository.findConnectionBetween(sender, receiver).ifPresent(c -> {
            throw new RuntimeException("Connection already exists: " + c.getStatus());
        });

        Connection connection = new Connection();
        connection.setSender(sender);
        connection.setReceiver(receiver);
        connection.setStatus(Connection.ConnectionStatus.PENDING);

        return ResponseEntity.ok(connectionRepository.save(connection));
    }

    // Accept or decline
    @PatchMapping("/{connectionId}/respond")
    public ResponseEntity<Connection> respond(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long connectionId,
            @RequestParam boolean accept) {

        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        if (!connection.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized");
        }

        connection.setStatus(accept
                ? Connection.ConnectionStatus.ACCEPTED
                : Connection.ConnectionStatus.DECLINED);
        connection.setRespondedAt(LocalDateTime.now());

        return ResponseEntity.ok(connectionRepository.save(connection));
    }

    // Get pending requests
    @GetMapping("/pending")
    public ResponseEntity<List<Connection>> getPending(
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(
                connectionRepository.findByReceiverAndStatus(currentUser, Connection.ConnectionStatus.PENDING));
    }

    // Get all my connections
    @GetMapping
    public ResponseEntity<List<Connection>> getConnections(
            @AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(connectionRepository.findAcceptedConnections(currentUser));
    }
}
