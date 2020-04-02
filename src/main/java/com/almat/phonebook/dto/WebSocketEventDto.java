package com.almat.phonebook.dto;

import com.almat.phonebook.enums.EventType;
import com.almat.phonebook.enums.ObjectType;
import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author Almat on 02.04.2020
 */

@Data
@AllArgsConstructor
public class WebSocketEventDto {
    private ObjectType objectType;
    private EventType eventType;
    @JsonRawValue
    private String content;
}
