-- DROP SEQUENCE CONTACT_ID_SEQ;
-- DROP TABLE CONTACT;
-- DROP TABLE "flyway_schema_history";


create sequence CONTACT_ID_SEQ start with 1 increment by  1;
create table CONTACT (
ID bigint,
PERSON_NAME varchar2(255) not null,
PHONE_NUMBER varchar2(12) not null,
primary key (ID)
);