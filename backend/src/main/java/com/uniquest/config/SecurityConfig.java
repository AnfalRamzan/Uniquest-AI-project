package com.uniquest.config;

import com.uniquest.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(c -> c.configurationSource(corsSource()))
            .authorizeHttpRequests(auth -> auth
                // Auth endpoints (Login/Register) open hain
                .requestMatchers("/api/auth/**").permitAll()
                
                // Locations rules
                .requestMatchers(HttpMethod.GET, "/api/locations/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/locations/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/locations/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/locations/**").hasRole("ADMIN")
                
                // 👇 Naye Announcements rules (Yeh add kiye gaye hain) 👇
                .requestMatchers(HttpMethod.GET, "/api/announcements/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/announcements/**").hasRole("ADMIN")
                
                // Admin specific routes
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Baaki sab kuch authenticated hona chahiye
                .anyRequest().authenticated()
            )
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(List.of("*"));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }
}