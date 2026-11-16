import { DAY_MS, HOUR_MS, MINUTE_MS, startOfDay } from '@/lib/dates';
import {
  COORDINATOR,
  type Activity,
  type AttorneyId,
  type CloseReason,
  type Contact,
  type Status,
  type Store,
} from './contact-model';

type SeedEvent =
  | {
      type: 'call' | 'email' | 'note' | 'consultation' | 'conflict_check';
      daysAgo: number;
      body: string;
      actor?: string;
      flagged?: boolean;
    }
  | { type: 'status_change'; daysAgo: number; to: Status; closeReason?: CloseReason };

type SeedContact = Pick<
  Contact,
  | 'name'
  | 'email'
  | 'phone'
  | 'preferredChannel'
  | 'status'
  | 'matterType'
  | 'source'
  | 'conflictCheck'
  | 'summary'
> & {
  referredBy?: string;
  attorneyId?: AttorneyId;
  closeReason?: CloseReason;
  createdDaysAgo: number;
  followUpInDays?: number;
  events: SeedEvent[];
};

const seedContacts: SeedContact[] = [
  {
    name: 'Ayesha Siddiqui',
    email: 'ayesha.siddiqui@example.com',
    phone: '+92 321 4458190',
    preferredChannel: 'whatsapp',
    status: 'lead',
    matterType: 'Family',
    source: 'Referral',
    referredBy: 'Former client · N. Haider',
    attorneyId: 'lk',
    conflictCheck: 'pending',
    createdDaysAgo: 0.12,
    followUpInDays: 0,
    summary:
      'Wants to file for khula and secure custody of her two children (ages 6 and 9). Husband lives in Dubai and has stopped sending maintenance.',
    events: [
      {
        type: 'call',
        daysAgo: 0.08,
        body: 'Spoke for ten minutes. Prefers WhatsApp after 6 PM. Sent the family-law intake questionnaire.',
      },
    ],
  },
  {
    name: 'Bilal Ahmed',
    email: '',
    phone: '+92 300 8812044',
    preferredChannel: 'phone',
    status: 'lead',
    matterType: 'Employment',
    source: 'Phone call',
    conflictCheck: 'pending',
    createdDaysAgo: 0.1,
    followUpInDays: 0,
    summary:
      'Former bank employee owed his final settlement and gratuity after six years of service. HR has stopped replying to his emails.',
    events: [],
  },
  {
    name: 'Omar Farooq',
    email: 'omar.farooq@example.com',
    phone: '+92 333 5120987',
    preferredChannel: 'phone',
    status: 'lead',
    matterType: 'Criminal defence',
    source: 'Phone call',
    attorneyId: 'is',
    conflictCheck: 'flagged',
    createdDaysAgo: 0.2,
    followUpInDays: 0,
    summary:
      'A cybercrime complaint under PECA has been filed against him by a former business partner. Wants representation before the FIA hearing.',
    events: [
      {
        type: 'call',
        daysAgo: 0.18,
        body: 'Took initial details. Former partner is Rizwan Akhtar.',
      },
      {
        type: 'conflict_check',
        daysAgo: 0.15,
        body: 'Rizwan Akhtar is an existing client (INT-0987, Corporate). Hold intake until an attorney reviews.',
        actor: 'Noman Shah',
        flagged: true,
      },
    ],
  },
  {
    name: 'Mehwish Raza',
    email: 'mehwish.raza@example.com',
    phone: '+92 345 2209761',
    preferredChannel: 'email',
    status: 'lead',
    matterType: 'Property',
    source: 'Website form',
    conflictCheck: 'pending',
    createdDaysAgo: 1.2,
    followUpInDays: -1,
    summary:
      'Builder has delayed possession of her DHA Phase 8 apartment by 14 months. She has paid 70% of the instalments and wants to know her options.',
    events: [
      {
        type: 'email',
        daysAgo: 1.15,
        body: 'Acknowledged the web inquiry and shared office hours.',
      },
    ],
  },
  {
    name: 'Emily Carter',
    email: 'emily@carterbakes.example.com',
    phone: '+92 302 4417730',
    preferredChannel: 'email',
    status: 'lead',
    matterType: 'Corporate',
    source: 'Website form',
    attorneyId: 'dm',
    conflictCheck: 'cleared',
    createdDaysAgo: 2.5,
    followUpInDays: 1,
    summary:
      'Opening a second bakery branch and wants to register the brand name and logo as trademarks before launch.',
    events: [
      { type: 'email', daysAgo: 2.45, body: 'Sent the trademark search fee estimate.' },
      {
        type: 'conflict_check',
        daysAgo: 2.3,
        body: 'No matches against current or former clients.',
        actor: 'Noman Shah',
      },
    ],
  },
  {
    name: 'Grace Liu',
    email: 'grace.liu@example.com',
    phone: '+92 311 7083326',
    preferredChannel: 'phone',
    status: 'lead',
    matterType: 'Immigration',
    source: 'Directory listing',
    attorneyId: 'lk',
    conflictCheck: 'cleared',
    createdDaysAgo: 4,
    followUpInDays: -2,
    summary:
      'Spouse visa refused last week. Wants to appeal within the 28-day window and asked about fees for a full appeal bundle.',
    events: [
      { type: 'call', daysAgo: 3.95, body: 'No answer. Left a voicemail.' },
      { type: 'conflict_check', daysAgo: 3.5, body: 'No matches.', actor: 'Noman Shah' },
      {
        type: 'call',
        daysAgo: 2.5,
        body: 'No answer on second attempt. Will try again tomorrow morning.',
      },
    ],
  },
  {
    name: 'Saad Rafiq',
    email: 'saad.rafiq@example.com',
    phone: '+92 322 6650118',
    preferredChannel: 'email',
    status: 'lead',
    matterType: 'Employment',
    source: 'Directory listing',
    attorneyId: 'dm',
    conflictCheck: 'pending',
    createdDaysAgo: 8,
    followUpInDays: -4,
    summary:
      'Former employer is threatening to enforce a two-year non-compete clause after he joined a competitor.',
    events: [
      { type: 'call', daysAgo: 7.95, body: 'Intro call. He will send the employment contract.' },
      { type: 'email', daysAgo: 5, body: 'Reminder to share the contract.' },
    ],
  },
  {
    name: 'Hina Baig',
    email: 'hina.baig@example.com',
    phone: '+92 336 9021455',
    preferredChannel: 'whatsapp',
    status: 'lead',
    matterType: 'Family',
    source: 'Website form',
    conflictCheck: 'cleared',
    createdDaysAgo: 15,
    followUpInDays: -6,
    summary:
      'Wants advice on enforcing a 2024 maintenance order that her ex-husband has ignored for eight months.',
    events: [
      { type: 'call', daysAgo: 14.9, body: 'Intro call. She will send a copy of the court order.' },
      {
        type: 'call',
        daysAgo: 7,
        body: 'Reminder call. Said she would visit the office this week.',
      },
    ],
  },
  {
    name: 'Hamza Tariq',
    email: 'hamza.tariq@example.com',
    phone: '+92 300 4471209',
    preferredChannel: 'phone',
    status: 'active',
    matterType: 'Criminal defence',
    source: 'Phone call',
    attorneyId: 'is',
    conflictCheck: 'cleared',
    createdDaysAgo: 2,
    followUpInDays: 0,
    summary:
      'Calling on behalf of his brother, arrested on an FIR for a dishonoured cheque (s. 489-F). Bail hearing is set for next Tuesday.',
    events: [
      {
        type: 'call',
        daysAgo: 1.99,
        body: 'Urgent. Collected FIR number and police station details.',
      },
      {
        type: 'conflict_check',
        daysAgo: 1.95,
        body: 'Complainant is not a current or former client.',
        actor: 'Noman Shah',
      },
      {
        type: 'consultation',
        daysAgo: 1.85,
        body: 'Imran Sheikh to meet the family at the office, 4:30 PM.',
      },
      { type: 'status_change', daysAgo: 1.8, to: 'active' },
    ],
  },
  {
    name: 'Daniel Okoro',
    email: 'daniel.okoro@example.com',
    phone: '+92 304 1189023',
    preferredChannel: 'email',
    status: 'active',
    matterType: 'Employment',
    source: 'Website form',
    attorneyId: 'dm',
    conflictCheck: 'cleared',
    createdDaysAgo: 9,
    followUpInDays: 2,
    summary:
      'Dismissed two weeks after reporting a blocked fire exit to the factory manager. Has the email trail and a signed termination letter.',
    events: [
      {
        type: 'call',
        daysAgo: 8.97,
        body: 'Initial call. Confirmed employment from March 2021 to October 2026.',
      },
      {
        type: 'conflict_check',
        daysAgo: 8.5,
        body: 'No matches against clients or the employer.',
        actor: 'Noman Shah',
      },
      {
        type: 'consultation',
        daysAgo: 6.2,
        body: 'Consultation booked with David Mercer, in person.',
      },
      {
        type: 'note',
        daysAgo: 3,
        body: 'Consult went well. David wants payslips for the last six months before quoting a fee.',
        actor: 'David Mercer',
      },
      { type: 'email', daysAgo: 2.9, body: 'Requested payslips and the appointment letter.' },
      { type: 'status_change', daysAgo: 6, to: 'active' },
    ],
  },
  {
    name: 'Nadia Rehman',
    email: 'nadia.rehman@example.com',
    phone: '+92 321 7765340',
    preferredChannel: 'phone',
    status: 'active',
    matterType: 'Family',
    source: 'Referral',
    referredBy: 'Dr. S. Anwar',
    attorneyId: 'lk',
    conflictCheck: 'cleared',
    createdDaysAgo: 12,
    followUpInDays: 3,
    summary:
      "Applying for guardianship of her nephew after his parents' death. The school is asking for a guardianship certificate.",
    events: [
      { type: 'call', daysAgo: 11.97, body: 'Gathered death certificates and the school letter.' },
      { type: 'consultation', daysAgo: 8.2, body: 'Consultation with Laila Karim.' },
      { type: 'status_change', daysAgo: 8, to: 'active' },
    ],
  },
  {
    name: 'Fatima Noor',
    email: 'fatima.noor@example.com',
    phone: '+92 345 6609812',
    preferredChannel: 'whatsapp',
    status: 'active',
    matterType: 'Personal injury',
    source: 'Website form',
    attorneyId: 'is',
    conflictCheck: 'cleared',
    createdDaysAgo: 15,
    followUpInDays: 5,
    summary:
      "Rear-ended on Shahrah-e-Faisal in September. The other driver's insurer is disputing liability for PKR 640,000 in hospital bills.",
    events: [
      {
        type: 'call',
        daysAgo: 14.96,
        body: 'Collected the police report number and hospital name.',
      },
      { type: 'consultation', daysAgo: 11.2, body: 'Consultation held with Imran Sheikh.' },
      {
        type: 'note',
        daysAgo: 4,
        body: 'Waiting on the discharge summary before sending a demand notice.',
      },
      { type: 'status_change', daysAgo: 11, to: 'active' },
    ],
  },
  {
    name: 'Thomas Becker',
    email: 'thomas.becker@example.com',
    phone: '+92 42 35761190',
    preferredChannel: 'email',
    status: 'active',
    matterType: 'Immigration',
    source: 'Referral',
    referredBy: 'Lahore Chamber of Commerce',
    attorneyId: 'lk',
    conflictCheck: 'cleared',
    createdDaysAgo: 18,
    followUpInDays: 0,
    summary:
      'Textile exporter needs work-permit renewals for three German engineers before their visas expire in January.',
    events: [
      { type: 'call', daysAgo: 17.97, body: 'Collected passport copies for all three engineers.' },
      { type: 'consultation', daysAgo: 16.2, body: 'Consultation with Laila Karim.' },
      {
        type: 'note',
        daysAgo: 2,
        body: 'Two of three files submitted. The third needs a fresh employer letter.',
      },
      { type: 'status_change', daysAgo: 16, to: 'active' },
    ],
  },
  {
    name: 'Kamran Javed',
    email: 'kamran.javed@example.com',
    phone: '+92 301 2290874',
    preferredChannel: 'phone',
    status: 'active',
    matterType: 'Property',
    source: 'Referral',
    referredBy: 'Rana & Associates',
    attorneyId: 'is',
    conflictCheck: 'cleared',
    createdDaysAgo: 20,
    followUpInDays: 1,
    summary:
      'Inheritance dispute between four siblings over 12 acres of agricultural land near Sheikhupura. A mutation was entered without their consent.',
    events: [
      { type: 'call', daysAgo: 19.9, body: 'Long call. Three siblings aligned, one opposing.' },
      { type: 'consultation', daysAgo: 14.2, body: 'Consultation with Imran Sheikh.' },
      {
        type: 'note',
        daysAgo: 6,
        body: 'Requested fard and mutation records from the patwari office.',
        actor: 'Imran Sheikh',
      },
      { type: 'status_change', daysAgo: 14, to: 'active' },
    ],
  },
  {
    name: 'Asad Mirza',
    email: 'asad.mirza@example.com',
    phone: '+92 333 8801276',
    preferredChannel: 'phone',
    status: 'closed',
    matterType: 'Personal injury',
    source: 'Phone call',
    attorneyId: 'is',
    conflictCheck: 'cleared',
    closeReason: 'limitations',
    createdDaysAgo: 10,
    summary:
      'Slipped on a wet floor in a shopping mall in early 2023. Has hospital records but never sent a legal notice.',
    events: [
      {
        type: 'call',
        daysAgo: 9.98,
        body: 'Incident date looks outside the limitation period. Escalated to Imran.',
      },
      {
        type: 'note',
        daysAgo: 9.1,
        body: 'Confirmed time-barred. Explained the reason to the caller and suggested a consumer complaint instead.',
        actor: 'Imran Sheikh',
      },
      { type: 'status_change', daysAgo: 9, to: 'closed', closeReason: 'limitations' },
    ],
  },
  {
    name: 'Usman Chaudhry',
    email: 'usman@lumenlabs.example.com',
    phone: '+92 300 5512398',
    preferredChannel: 'email',
    status: 'closed',
    matterType: 'Corporate',
    source: 'Referral',
    referredBy: 'Habib & Sons Chartered Accountants',
    attorneyId: 'dm',
    conflictCheck: 'cleared',
    closeReason: 'retained',
    createdDaysAgo: 26,
    summary:
      "Two co-founders need a shareholders' agreement and a vesting schedule before closing a seed round.",
    events: [
      { type: 'call', daysAgo: 25.97, body: 'Intro call with both founders.' },
      { type: 'consultation', daysAgo: 22.2, body: 'Consultation with David Mercer.' },
      { type: 'email', daysAgo: 15, body: 'Engagement letter sent for e-signature.' },
      { type: 'status_change', daysAgo: 22, to: 'active' },
      { type: 'status_change', daysAgo: 12, to: 'closed', closeReason: 'retained' },
    ],
  },
  {
    name: 'Sara Qureshi',
    email: 'sara.qureshi@example.com',
    phone: '+92 321 4098812',
    preferredChannel: 'phone',
    status: 'closed',
    matterType: 'Property',
    source: 'Walk-in',
    attorneyId: 'is',
    conflictCheck: 'cleared',
    closeReason: 'retained',
    createdDaysAgo: 22,
    summary:
      'Tenant is refusing to vacate after the lease expired and has not paid rent for four months.',
    events: [
      { type: 'call', daysAgo: 21.98, body: 'Walk-in consultation request taken at reception.' },
      { type: 'consultation', daysAgo: 20.2, body: 'Consultation with Imran Sheikh.' },
      { type: 'email', daysAgo: 16.1, body: 'Engagement letter signed and returned.' },
      { type: 'status_change', daysAgo: 20, to: 'active' },
      { type: 'status_change', daysAgo: 16, to: 'closed', closeReason: 'retained' },
    ],
  },
  {
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    phone: '+92 302 7716654',
    preferredChannel: 'email',
    status: 'closed',
    matterType: 'Family',
    source: 'Website form',
    attorneyId: 'lk',
    conflictCheck: 'cleared',
    closeReason: 'hired_other',
    createdDaysAgo: 30,
    summary: 'Mutual divorce. Needs help dividing a jointly owned flat in Clifton.',
    events: [
      { type: 'call', daysAgo: 29.9, body: 'Intro call.' },
      { type: 'consultation', daysAgo: 27.2, body: 'Consultation with Laila Karim.' },
      {
        type: 'call',
        daysAgo: 20,
        body: 'Follow-up call. She is comparing quotes from two firms.',
      },
      { type: 'status_change', daysAgo: 27, to: 'active' },
      { type: 'status_change', daysAgo: 18, to: 'closed', closeReason: 'hired_other' },
    ],
  },
  {
    name: 'Zainab Hussain',
    email: 'zainab.hussain@example.com',
    phone: '+92 334 1187720',
    preferredChannel: 'phone',
    status: 'closed',
    matterType: 'Immigration',
    source: 'Walk-in',
    attorneyId: 'lk',
    conflictCheck: 'cleared',
    closeReason: 'unresponsive',
    createdDaysAgo: 40,
    summary: 'Asked about a Canadian study permit for her son and attestation of his degree.',
    events: [
      { type: 'call', daysAgo: 35, body: 'No answer.' },
      { type: 'call', daysAgo: 33, body: 'No answer on second attempt.' },
      { type: 'email', daysAgo: 31, body: 'Final follow-up email sent.' },
      { type: 'status_change', daysAgo: 28, to: 'closed', closeReason: 'unresponsive' },
    ],
  },
];

function officeHoursTime(nowMs: number, daysAgo: number, seedIndex: number, eventIndex: number) {
  const exact = nowMs - daysAgo * DAY_MS;
  if (daysAgo < 0.25) return exact;

  // A fixed spread of minutes after 9 AM, so times look natural but stay the same on every reset
  const minutesAfterNine = (seedIndex * 53 + eventIndex * 97) % (8 * 60);
  const timeOfDay = (9 * 60 + minutesAfterNine) * MINUTE_MS;
  let day = startOfDay(new Date(exact)).getTime();
  if (day + timeOfDay > nowMs - 30 * MINUTE_MS) day -= DAY_MS;
  return day + timeOfDay;
}

function toIso(ms: number): string {
  return new Date(ms).toISOString();
}

export function buildSeed(now: Date): Store {
  const nowMs = now.getTime();
  const today = startOfDay(now).getTime();
  const contacts: Contact[] = [];
  const activities: Activity[] = [];

  seedContacts.forEach((seed, seedIndex) => {
    const id = `INT-${1041 + seedIndex}`;
    const events = [
      { type: 'created' as const, daysAgo: seed.createdDaysAgo },
      ...seed.events,
    ].sort((a, b) => b.daysAgo - a.daysAgo);

    let previousAt = -Infinity;
    let status: Status = 'lead';
    let createdAt = '';
    let statusChangedAt = '';
    let lastContactedAt: string | null = null;

    events.forEach((event, eventIndex) => {
      let atMs = officeHoursTime(nowMs, event.daysAgo, seedIndex, eventIndex);
      if (atMs <= previousAt) atMs = previousAt + (18 + ((eventIndex * 7) % 25)) * MINUTE_MS;
      atMs = Math.min(atMs, nowMs - MINUTE_MS);
      previousAt = atMs;
      const at = toIso(atMs);
      const base = { id: `act_${id}_${eventIndex}`, contactId: id, at, actor: COORDINATOR };

      if (event.type === 'created') {
        const actor = seed.source === 'Website form' ? 'Web intake' : COORDINATOR;
        activities.push({ ...base, actor, type: 'created', body: null });
        createdAt = at;
        statusChangedAt = at;
      } else if (event.type === 'status_change') {
        const closeReason = event.closeReason ?? null;
        activities.push({
          ...base,
          type: 'status_change',
          body: null,
          from: status,
          to: event.to,
          closeReason,
        });
        status = event.to;
        statusChangedAt = at;
      } else {
        activities.push({
          ...base,
          actor: event.actor ?? COORDINATOR,
          type: event.type,
          body: event.body,
          flagged: event.flagged,
        });
        if (event.type === 'call' || event.type === 'email') lastContactedAt = at;
      }
    });

    contacts.push({
      id,
      name: seed.name,
      email: seed.email,
      phone: seed.phone,
      preferredChannel: seed.preferredChannel,
      matterType: seed.matterType,
      summary: seed.summary,
      source: seed.source,
      referredBy: seed.referredBy ?? '',
      attorneyId: seed.attorneyId ?? null,
      conflictCheck: seed.conflictCheck,
      status: seed.status,
      closeReason: seed.closeReason ?? null,
      followUpAt:
        seed.followUpInDays === undefined
          ? null
          : toIso(today + seed.followUpInDays * DAY_MS + 10 * HOUR_MS),
      createdAt,
      statusChangedAt,
      lastContactedAt,
    });
  });

  return { version: 1, contacts, activities };
}
