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
    private final NotificationService notificationService;

    public ConnectionController(ConnectionRepository connectionRepository,
                                 UserRepository userRepository,
                                 NotificationService notificationService) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<Connection> sendRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long receiverId) {
        User sender = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();
        if (sender.getId().equals(receiverId)) throw new RuntimeException("Cannot connect with yourself");
        connectionRepository.findConnectionBetween(sender, receiver).ifPresent(c -> {
            throw new RuntimeException("Connection already exists: " + c.getStatus());
        });
        Connection connection = new Connection();
        connection.setSender(sender);
        connection.setReceiver(receiver);
        connection.setStatus(Connection.ConnectionStatus.PENDING);
        Connection saved = connectionRepository.save(connection);
        notificationService.notifyConnectionRequest(receiver, sender);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{connectionId}/respond")
    public ResponseEntity<Connection> respond(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long connectionId,
            @RequestParam boolean accept) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Connection connection = connectionRepository.findById(connectionId).orElseThrow();
        if (!connection.getReceiver().getId().equals(currentUser.getId())) throw new RuntimeException("Not authorized");
        connection.setStatus(accept ? Connection.ConnectionStatus.ACCEPTED : Connection.ConnectionStatus.DECLINED);
        connection.setRespondedAt(LocalDateTime.now());
        Connection saved = connectionRepository.save(connection);
        if (accept) {
            notificationService.notifyConnectionAccepted(connection.getSender(), currentUser);
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Connection>> getPending(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(connectionRepository.findByReceiverAndStatus(currentUser, Connection.ConnectionStatus.PENDING));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<Connection>> getSent(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(connectionRepository.findBySenderAndStatus(currentUser, Connection.ConnectionStatus.PENDING));
    }

    @GetMapping
    public ResponseEntity<List<Connection>> getConnections(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(connectionRepository.findAcceptedConnections(currentUser));
    }
}
