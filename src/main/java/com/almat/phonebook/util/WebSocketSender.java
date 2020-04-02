package com.almat.phonebook.util;

import com.almat.phonebook.dto.WebSocketEventDto;
import com.almat.phonebook.enums.EventType;
import com.almat.phonebook.enums.ObjectType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.function.BiConsumer;

/**
 * @author Almat on 02.04.2020
 */

@Component
public class WebSocketSender {

    private final SimpMessagingTemplate template;
    private final ObjectMapper mapper;

    @Autowired
    public WebSocketSender(SimpMessagingTemplate template, ObjectMapper mapper) {
        this.template = template;
        this.mapper = mapper;
    }

    public <T> BiConsumer<EventType, T> getSender(ObjectType objectType) {
        ObjectWriter writer = mapper
                .setConfig(mapper.getSerializationConfig())
                .writer();

        return (EventType eventType, T payload) -> {
            String value = null;

            try {
                value = writer.writeValueAsString(payload);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }

            template.convertAndSend(
                    "/topic/contact",
                    new WebSocketEventDto(objectType, eventType, value)
            );
        };
    }

}
