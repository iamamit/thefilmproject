package com.thefilmproject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = dbUrl;
        // Convert Railway's postgresql:// to jdbc:postgresql://
        if (url.startsWith("postgresql://")) {
            url = "jdbc:postgresql://" + url.substring("postgresql://".length());
            // Extract credentials from URL if embedded
            try {
                java.net.URI uri = new java.net.URI(url.replace("jdbc:", ""));
                String userInfo = uri.getUserInfo();
                if (userInfo != null && !userInfo.isEmpty()) {
                    String[] parts = userInfo.split(":");
                    username = parts[0];
                    password = parts.length > 1 ? parts[1] : "";
                    url = "jdbc:postgresql://" + uri.getHost() + ":" + uri.getPort() + uri.getPath();
                }
            } catch (Exception e) {
                // use as-is
            }
        }
        return DataSourceBuilder.create()
            .url(url)
            .username(username)
            .password(password)
            .build();
    }
}
