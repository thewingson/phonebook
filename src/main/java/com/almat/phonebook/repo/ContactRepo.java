package com.almat.phonebook.repo;

import com.almat.phonebook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Almat on 02.04.2020
 */

@Repository
public interface ContactRepo extends JpaRepository<Contact, Long> {
}
