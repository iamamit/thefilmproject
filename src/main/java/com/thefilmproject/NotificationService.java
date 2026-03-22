package com.thefilmproject;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepo;

    public NotificationService(NotificationRepository notificationRepo) {
        this.notificationRepo = notificationRepo;
    }

    public void send(User recipient, User sender, String type, String message, Long referenceId, String referenceType) {
        if (recipient.getId().equals(sender.getId())) return; // don't notify yourself
        Notification n = new Notification();
        n.setRecipient(recipient);
        n.setSender(sender);
        n.setType(type);
        n.setMessage(message);
        n.setReferenceId(referenceId);
        n.setReferenceType(referenceType);
        notificationRepo.save(n);
    }

    public void notifyLike(User postAuthor, User liker, Long postId) {
        send(postAuthor, liker, "LIKE",
            liker.getFullName() + " liked your post",
            postId, "POST");
    }

    public void notifyComment(User postAuthor, User commenter, Long postId) {
        send(postAuthor, commenter, "COMMENT",
            commenter.getFullName() + " commented on your post",
            postId, "POST");
    }

    public void notifyReply(User commentAuthor, User replier, Long postId) {
        send(commentAuthor, replier, "REPLY",
            replier.getFullName() + " replied to your comment",
            postId, "POST");
    }

    public void notifyConnectionRequest(User receiver, User sender) {
        send(receiver, sender, "CONNECTION_REQUEST",
            sender.getFullName() + " sent you a connection request",
            sender.getId(), "USER");
    }

    public void notifyConnectionAccepted(User requester, User accepter) {
        send(requester, accepter, "CONNECTION_ACCEPTED",
            accepter.getFullName() + " accepted your connection request",
            accepter.getId(), "USER");
    }

    public void notifyPortfolioComment(User postAuthor, User commenter, Long postId) {
        send(postAuthor, commenter, "PORTFOLIO_COMMENT",
            commenter.getFullName() + " attached their portfolio to your project post",
            postId, "POST");
    }
}
