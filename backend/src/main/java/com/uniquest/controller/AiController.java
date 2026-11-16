package com.uniquest.controller;

import com.uniquest.dto.AiRequest;
import com.uniquest.dto.AiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AiController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final WebClient webClient = WebClient.create();

    @PostMapping("/ask")
    public AiResponse askQuestion(@RequestBody AiRequest request) {
        try {
            // ✅ Sahi Tareeqa: API key ko URL mein ?key= ke zariye bhejna
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;

            String prompt = "You are a helpful campus navigation assistant for UniQuest AI. " +
                            "Answer the following student question briefly and politely in a friendly tone: " + 
                            request.getQuestion();

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(Map.of("text", prompt)))
                )
            );

            // API Call bhejna (Bina kisi extra header ke, sirf Content-Type)
            Map response = webClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            // Response se Answer nikalna
            if (response != null && response.containsKey("candidates")) {
                List candidates = (List) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.get(0);
                    Map content = (Map) firstCandidate.get("content");
                    List parts = (List) content.get("parts");
                    Map firstPart = (Map) parts.get(0);
                    
                    String answer = (String) firstPart.get("text");
                    return new AiResponse(answer);
                }
            }
            
            return new AiResponse("🤔 I couldn't understand that. Could you please rephrase your question?");

        } catch (WebClientResponseException e) {
            // Agar API Key galat hai ya koi aur API error hai
            System.err.println("API ERROR: " + e.getResponseBodyAsString());
            return new AiResponse("❌ AI Server Error (Code: " + e.getStatusCode().value() + "). Please check the API Key or try again later.");
        } catch (Exception e) {
            // Agar internet issue hai ya koi aur code error hai
            e.printStackTrace();
            return new AiResponse("❌ Sorry, I am unable to connect to the AI server right now. Error: " + e.getMessage());
        }
    }
}