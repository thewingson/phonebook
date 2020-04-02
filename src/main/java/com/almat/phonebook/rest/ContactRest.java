package com.almat.phonebook.rest;

import com.almat.phonebook.model.Contact;
import com.almat.phonebook.repo.ContactRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * @author Almat on 02.04.2020
 */

@RestController
@RequestMapping("/contact")
public class ContactRest {

    private final ContactRepo contactRepo;

    @Autowired
    public ContactRest(ContactRepo contactRepo) {
        this.contactRepo = contactRepo;
    }

    @GetMapping
    public List<Contact> getAll() {
        return contactRepo.findAll();
    }

    @GetMapping("{id}")
    public Optional<Contact> getOne(@PathVariable Long id) {
        return contactRepo.findById(id);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id) {
        contactRepo.deleteById(id);
    }

    @PostMapping
    public void create(@RequestBody Contact contact) {
        contactRepo.save(contact);
    }

    @PutMapping("{id}")
    public void update(@PathVariable Long id,
                       @RequestBody Contact contact) {
        Optional<Contact> contactFromDb = contactRepo.findById(id);

        contactFromDb.ifPresent(contactPresent -> {
            contactPresent.setId(id);
            contactPresent.setName(contact.getName());
            contactPresent.setNumber(contact.getNumber());

            contactRepo.save(contactPresent);
        });

    }

}
