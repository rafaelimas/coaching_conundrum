CREATE TABLE coach (
  coach_id uuid NOT NULL DEFAULT gen_random_uuid(), 
  name varchar NOT NULL, 
  phone varchar NOT NULL, 
  PRIMARY KEY (coach_id)
);

CREATE TABLE student (
  student_id uuid NOT NULL DEFAULT gen_random_uuid(), 
  name varchar NOT NULL, 
  phone varchar NOT NULL, 
  PRIMARY KEY (student_id)
);

CREATE TABLE availability (
  availability_id uuid NOT NULL DEFAULT gen_random_uuid(), 
  coach_id uuid NOT NULL, 
  starts_at timestamp with time zone NOT NULL, 
  PRIMARY KEY (availability_id)
);
ALTER TABLE availability ADD CONSTRAINT FKAvailabilityCoach FOREIGN KEY (coach_id) REFERENCES coach (coach_id);
ALTER TABLE public.availability ADD CONSTRAINT availability_starts_at_uk UNIQUE (coach_id, starts_at);


CREATE TABLE booking (
  student_id uuid NOT NULL, 
  availability_id uuid NOT NULL, 
  notes text, 
  satisfaction_score int4, 
  PRIMARY KEY (availability_id)
);
ALTER TABLE booking ADD CONSTRAINT FKBookingStudent FOREIGN KEY (student_id) REFERENCES student (student_id);
ALTER TABLE booking ADD CONSTRAINT FKBookingAvailability FOREIGN KEY (availability_id) REFERENCES availability (availability_id);

INSERT INTO student(name, phone) VALUES('Rafa', '(303)212-9119');
INSERT INTO student(name, phone) VALUES('David', '(663)918-9119');
INSERT INTO student(name, phone) VALUES('Ana', '(718)412-9119');

INSERT INTO public.coach (coach_id, name, phone) VALUES (DEFAULT, 'David Smith', '(212)932-89374');
INSERT INTO public.coach (coach_id, name, phone) VALUES (DEFAULT, 'Alicia Robinson', '(306)128-9999');
INSERT INTO public.coach (coach_id, name, phone) VALUES (DEFAULT, 'Peter Williams', '(902)132-9911');
