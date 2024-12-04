# Coaching Conundrum

## The Problem

We have hundreds of 1-on-1 coaching calls between our students and coaches, and we need you to build a website to manage their scheduling.

Your website should satisfy the following user stories:
- Coaches can add slots of availability to their calendars. These slots are always 2 hours long and each slot can be booked by exactly 1 student.
- Coaches can view their own upcoming slots.
- Students can book upcoming, available slots for any coach.
- When a slot is booked, both the student and coach can view each other’s phone-number.
- After they complete a call with a student, coaches will record the student’s satisfaction (an integer 1-5) and write some free-form notes.
- Coaches should be able to review their past scores and notes for all of their calls.

## Installation

**Back-End**
- You need PostgreSQL and a database created for the purpose.
- cd into /backend
- Edit the .env file with the appropriate values for the port to listen to in and the db connection
- execute npm install
- execute npm run init_db
- execute npm start

**Front-End**
- cd into /frontend
- Edit the .env file with the appropriate url for the backend
- execute npm install
- execute npm run dev
- open a web browser pointing to the url shown

## Assumptions
- Availability has a fixed set of 5 options from 9am to 7pm.

## Documentation
- There's an ERD in the /docs directory

## Missing Features
- Saving score and notes for coaches

## Final notes
I had fun working on this!
Hope it is not too painful for you to review it and looking forward to having your feedback.

