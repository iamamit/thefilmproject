package com.thefilmproject;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    @Query("SELECT c FROM Connection c WHERE (c.sender = :user1 AND c.receiver = :user2) OR (c.sender = :user2 AND c.receiver = :user1)")
    Optional<Connection> findConnectionBetween(@Param("user1") User user1, @Param("user2") User user2);

    List<Connection> findByReceiverAndStatus(User receiver, Connection.ConnectionStatus status);

    List<Connection> findBySenderAndStatus(User sender, Connection.ConnectionStatus status);

    @Query("SELECT c FROM Connection c WHERE (c.sender = :user OR c.receiver = :user) AND c.status = 'ACCEPTED'")
    List<Connection> findAcceptedConnections(@Param("user") User user);
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM Connection c WHERE c.sender.id = :userId OR c.receiver.id = :userId")
    void deleteByRequestorIdOrReceiverId(@Param("userId") Long userId1, @Param("userId") Long userId2);
}
