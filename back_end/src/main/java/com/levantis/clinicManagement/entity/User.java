package com.levantis.clinicManagement.entity;

import jakarta.persistence.*;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer user_id;

    @Column(nullable = false, length = 150)
    private String user_name;

    @Column(nullable = false, length = 150)
    private String user_surname;

    @Column(nullable = false, length = 8)
    private String user_idNumber;

    @Column(nullable = false, length = 150)
    private String user_email;

    @Column(nullable = false, length = 60)
    private String user_password;

    @ManyToOne
    @JoinColumn(name = "user_role", referencedColumnName = "role_id", nullable = false)
    private Role role;

    /*
    *  https://stackoverflow.com/questions/13027214/what-is-the-meaning-of-the-cascadetype-all-for-a-manytoone-jpa-association
    * */
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Patient patient;

}
