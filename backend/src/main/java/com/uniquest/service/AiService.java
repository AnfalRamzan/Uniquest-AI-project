package com.uniquest.service;
import org.springframework.stereotype.Service;
@Service
public class AiService {
    public String ask(String question) {
        // In real project, call OpenAI API here
        return "AI Answer: For '" + question + "', please check the campus map.";
    }
}