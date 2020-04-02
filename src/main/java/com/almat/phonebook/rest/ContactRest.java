package com.almat.phonebook.rest;

import com.almat.phonebook.enums.EventType;
import com.almat.phonebook.enums.ObjectType;
import com.almat.phonebook.model.Contact;
import com.almat.phonebook.repo.ContactRepo;
import com.almat.phonebook.util.WebSocketSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.function.BiConsumer;

/**
 * @author Almat on 02.04.2020
 */

@RestController
@RequestMapping("/contact")
public class ContactRest {

    private final ContactRepo contactRepo;
    private final BiConsumer<EventType, Contact> webSocketSender;

    @Autowired
    public ContactRest(ContactRepo contactRepo, WebSocketSender webSocketSender) {
        this.contactRepo = contactRepo;
        this.webSocketSender = webSocketSender.getSender(ObjectType.MESSAGE);
    }

    @GetMapping
    public List<Contact> getAll(@PageableDefault(sort = {"id"}, direction = Sort.Direction.DESC, page = 0, size = 3) Pageable pageable) {
        return contactRepo.findAll(pageable).getContent();
    }

    @GetMapping("{id}")
    public Optional<Contact> getOne(@PathVariable Long id) {
        return contactRepo.findById(id);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id) {
        contactRepo.deleteById(id);
        webSocketSender.accept(EventType.DELETE, new Contact(id, null, null));
    }

    @PostMapping
    public void create(@RequestBody Contact contact) {
        contactRepo.save(contact);
        webSocketSender.accept(EventType.CREATE, contact);
    }

    @PutMapping("{id}")
    public void update(@PathVariable Long id,
                       @RequestBody Contact contact) {
        Optional<Contact> contactFromDb = contactRepo.findById(id);

        contactFromDb.ifPresent(contactPresent -> {
            contactPresent.setId(id);
            contactPresent.setPersonName(contact.getPersonName());
            contactPresent.setPhoneNumber(contact.getPhoneNumber());

            Contact savedContact = contactRepo.save(contactPresent);
            webSocketSender.accept(EventType.UPDATE, savedContact);
        });

    }

    @GetMapping("/pagesize")
    public int getPageSize(@PageableDefault(sort = {"id"}, direction = Sort.Direction.DESC, size = 3) Pageable pageable) {
        int a = contactRepo.findAll(pageable).getTotalPages();
        System.out.println("pages: " + a);
        return a;
    }

}
