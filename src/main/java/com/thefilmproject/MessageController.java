package com.thefilmproject;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository messageRepo;
    private final UserRepository userRepo;
    private final ConnectionRepository connectionRepo;

    public MessageController(MessageRepository messageRepo, UserRepository userRepo, ConnectionRepository connectionRepo) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.connectionRepo = connectionRepo;
    }

    @PostMapping("/send/{receiverId}")
    public ResponseEntity<?> sendMessage(@PathVariable Long receiverId,
                                          @RequestBody MessageRequest request,
                                          Authentication auth) {
        User sender = userRepo.findByEmail(auth.getName()).orElseThrow();
        User receiver = userRepo.findById(receiverId).orElseThrow();

        boolean connected = connectionRepo.findAll().stream()
            .anyMatch(c ->
                c.getStatus().name().equals("ACCEPTED") &&
                ((c.getSender().getId().equals(sender.getId()) && c.getReceiver().getId().equals(receiver.getId())) ||
                 (c.getSender().getId().equals(receiver.getId()) && c.getReceiver().getId().equals(sender.getId())))
            );

        if (!connected) {
            return ResponseEntity.badRequest().body("You can only message your connections");
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.content());

        return ResponseEntity.ok(messageRepo.save(message));
    }

    @GetMapping("/conversation/{userId}")
    public List<Message> getConversation(@PathVariable Long userId, Authentication auth) {
        User me = userRepo.findByEmail(auth.getName()).orElseThrow();
        List<Message> messages = messageRepo.findConversation(me.getId(), userId);
        messages.stream()
            .filter(m -> m.getReceiver().getId().equals(me.getId()) && !m.isRead())
            .forEach(m -> { m.setRead(true); messageRepo.save(m); });
        return messages;
    }

    @GetMapping("/inbox")
    public List<Message> getInbox(Authentication auth) {
        User me = userRepo.findByEmail(auth.getName()).orElseThrow();
        List<Message> allMessages = messageRepo.findAllByUser(me.getId());
        
        // Get latest message per conversation
        Map<Long, Message> latestPerConversation = new LinkedHashMap<>();
        for (Message m : allMessages) {
            Long otherId = m.getSender().getId().equals(me.getId()) 
                ? m.getReceiver().getId() 
                : m.getSender().getId();
            latestPerConversation.putIfAbsent(otherId, m);
        }
        return new ArrayList<>(latestPerConversation.values());
    }

    @GetMapping("/unread")
    public long getUnreadCount(Authentication auth) {
        User me = userRepo.findByEmail(auth.getName()).orElseThrow();
        return messageRepo.countByReceiverIdAndIsReadFalse(me.getId());
    }

    record MessageRequest(String content) {}
}
