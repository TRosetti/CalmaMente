package com.calmamente.backend.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

@Component
public class SupabaseAuthClient {

    private final RestClient restClient;

    public SupabaseAuthClient(@Value("${supabase.url}") String supabaseUrl,
                              @Value("${supabase.key.service-role}") String serviceRoleKey) {
        this.restClient = RestClient.builder()
                .baseUrl(supabaseUrl + "/auth/v1")
                .defaultHeader("Authorization", "Bearer " + serviceRoleKey)
                .defaultHeader("apikey", serviceRoleKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    // Agora aceita metadados para o Trigger já pegar o nome certo
    public UUID criarUsuario(String email, String password, String nome, String tipo) {
        
        // Dados que o Trigger handle_new_user espera
        Map<String, String> userMetadata = Map.of(
            "nome", nome,
            "tipo", tipo
        );

        Map<String, Object> body = Map.of(
            "email", email,
            "password", password,
            "email_confirm", true,
            "user_metadata", userMetadata // Enviando para o Supabase
        );

        try {
            Map response = restClient.post()
                    .uri("/admin/users")
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("id")) {
                return UUID.fromString((String) response.get("id"));
            }
            
            if (response != null && response.containsKey("user")) {
                Map userMap = (Map) response.get("user");
                return UUID.fromString((String) userMap.get("id"));
            }

            throw new RuntimeException("Erro ao criar usuário: Resposta inválida do Supabase");

        } catch (Exception e) {
            throw new RuntimeException("Erro na integração com Supabase Auth: " + e.getMessage());
        }
    }
}