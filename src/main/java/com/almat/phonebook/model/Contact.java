package com.almat.phonebook.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * @author Almat on 02.04.2020
 */

@Entity
@Table(name = "contact",
        uniqueConstraints = {
                @UniqueConstraint(name = "unique_phone_number", columnNames = "phone_number")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(generator = "contact_seq", strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(sequenceName = "contact_id_seq", name = "contact_seq", allocationSize = 1)
    private Long id;

    @Column(name = "person_name", nullable = false)
    private String personName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

}
