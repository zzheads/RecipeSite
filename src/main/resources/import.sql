-- Insert role
insert into role (name) values ('ROLE_USER');
insert into role (name) values ('ROLE_ADMIN');

-- Insert two users (passwords are both 'password', '1')
insert into user (username,enabled,password,role_id) values ('user',true,'$2a$08$wgwoMKfYl5AUE9QtP4OjheNkkSDoqDmFGjjPE2XTPLDe9xso/hy7u',1);
insert into user (username,enabled,password,role_id) values ('zheads',true,'$2a$10$7whH6x0Q1bRR.S.1tz5Fr.5PXTSyuhBzt0yecKFEUMiT8bt8wZ9O2',1);

-- Insert two users (passwords are both 'password', '1')
insert into user (username,enabled,password,role_id) values ('user',true,'$2a$08$wgwoMKfYl5AUE9QtP4OjheNkkSDoqDmFGjjPE2XTPLDe9xso/hy7u',1);
insert into user (username,enabled,password,role_id) values ('user2',true,'$2a$08$wgwoMKfYl5AUE9QtP4OjheNkkSDoqDmFGjjPE2XTPLDe9xso/hy7u',1);
insert into user (username,enabled,password,role_id) values ('1',true,'$2a$10$IqyWC3iIp7HibXwVuLVS8e/GC.9gBqQdqcLRXXexD1i90Oce1XrVi',1);

-- Insert recipes
insert into recipe (name, description, user_id) values ('Buterbrod', 'How to make buterbrod' ,1);
insert into recipe (name, description, user_id) values ('Pelmeni', 'How to make pelmeni' ,2);
insert into recipe (name, description, user_id) values ('Chicken pasta', 'Lets make chicken pasta' ,2);
insert into recipe (name, description, user_id) values ('Pomodoro salad', 'How to make pomodoro with mozzarella salad' ,2);

-- Insert categories
insert into category (name) values ('Desert');
insert into category (name) values ('Lunch');
insert into category (name) values ('Breakfast');
insert into category (name) values ('Dinner');
insert into category (name) values ('Unassigned');
