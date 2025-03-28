## BoolBnB
# users table
- id: int no null AI PK unsigned unique
- name:  varchar(255) no null
- surname: varchar(255) no null
- user_name: varchar(255) no null
- password: varchar(255) no null
- email:    varchar(255) no null
- phone: varchar(255) no null
- type: varchar(255) no null

# properties table
- id: int no null AI PK unsigned unique
- id_user: int no null FK
- name: varchar(255) no null
- rooms: tinyint no null unsigned
- beds: tinyint no null unsigned
- bathrooms: tinyint no null unsigned
- mq: smallint no null unsigned
- address: varchar(255) no null
- email_owners: varchar(255) no null
- like: int no null unsigned
- image: varchar(255) null


# reviews table
- id: int no null AI PK unsigned unique
- id_property: int no null FK
- name: varchar(255) no null
- text_review: text(1000) no null
- date_review: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- nights: tinyint no null

# messages table
- id: int no null AI PK unsigned unique
- id_property: int no null FK
- email: varchar(255) no null
- text_message: text(1000) no null
- date_message: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

# properties_services table
- id_service: int no null FK
- id_property: int no null FK

# services table
- id: int no null AI PK unsigned unique
- name: varchar(255) no null FK