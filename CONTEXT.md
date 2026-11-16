# Law Firm Intake

A small CRM for a law firm's client-intake team: logging inquiries from prospective clients, following up, and moving each one to an outcome.

## People and records

**Contact**:
A person who got in touch with the firm about a legal matter. One record per person. Code uses `Contact`.
_Avoid_: Client (only true after they are retained), customer, prospect

**Inquiry**:
The user-facing word for a contact while intake is working on it. "Log an inquiry" creates a contact.
_Avoid_: Ticket, request, case

**Intake coordinator**:
The person using the app (Hira Malik in the sample data). Recorded as the actor on activities they create.

**Attorney**:
A lawyer at the firm who can be assigned to a contact. A contact can be unassigned.

## Status

**Status**:
Where a contact is in intake. Exactly one of Lead, Active, Closed.
_Avoid_: Stage, phase, state

**Lead**:
A new inquiry that has not had a consultation booked yet.

**Active**:
A consultation is booked or an engagement is in progress.

**Closed**:
Intake is finished. A closed contact always has a close reason.

**Close reason**:
Why a contact was closed: Retained, Hired another firm, Stopped responding, Conflict of interest, Outside practice areas, Limitation period passed, Referred out. Required when closing.

**Outcome**:
The group a close reason belongs to: won (Retained), lost (Hired another firm, Stopped responding), declined (the firm chose not to act).

**Reopen**:
Moving a closed contact back to Lead or Active. Schedules a follow-up for today.

**Time in status**:
Days since the contact's status last changed. Warning at 7 days, stalled at 14 days (open statuses only).

## Matter

**Matter type**:
The practice area the inquiry belongs to (Family, Employment, Property, Immigration, Criminal defence, Personal injury, Corporate).
_Avoid_: Case type, category

**Summary**:
A short description of what the contact needs help with, in their words.

**Source**:
How the contact found the firm (Referral, Website form, Phone call, Walk-in, Directory listing).

**Referrer**:
Who referred the contact. Required when the source is Referral.

**Conflict check**:
Whether the firm can act without a conflict of interest: Pending, Cleared, or Possible conflict.

## Follow-up and activity

**Follow-up**:
The next date someone must contact the person. Closed contacts have no follow-up.

**Due**:
A follow-up dated today or earlier on an open contact.

**Overdue**:
A follow-up dated before today on an open contact.

**Not contacted**:
An open contact with no logged call or email yet.

**Activity**:
One entry on a contact's timeline: call, email, note, consultation, conflict check, status change, or edit.
_Avoid_: Event, log entry, history item

**Timeline**:
All activities for one contact, newest first, grouped by day.

**Pipeline**:
The board view with one column per status.
