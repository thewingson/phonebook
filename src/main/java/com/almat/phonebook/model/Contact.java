package com.almat.phonebook.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;

/**
 * @author Almat on 02.04.2020
 */

@Entity
@Table(name = "contact",
        uniqueConstraints = {
                @UniqueConstraint(name = "unique_number", columnNames = "number")
})
@Data
@AllArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(generator = "contact_seq", strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(sequenceName = "contact_id_seq", name = "contact_seq", allocationSize = 1)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "number", nullable = false)
    private String number;

}
