// Original Practitioner Paper 1 — Harbourline Clinics.
// Official 80-line booklet layout. Not copied from any APMG sample.

const scenario = {
  title: 'Project Scenario — Harbourline Clinics',
  sections: [
    {
      heading: 'The organisation',
      body: 'Harbourline Clinics Group runs three outpatient sites on the south coast: Quay, Hill and Shore. Each site still uses a different mix of paper diaries, a 12-year-old PAS and local spreadsheets. Missed appointments sit at 18%. The Group COO has approved a single outpatient booking and triage platform so clinicians share one queue, patients can rebook without phoning, and Information Governance can evidence who changed a slot.',
    },
    {
      heading: 'The project',
      body: 'Project name: OneQueue. Outcome required: a live, clinically safe booking service at all three sites, with an auditable trail and SMS reminders. The first increment must be in service at Quay before 1 December so winter clinics are not run on paper. Total cost is fixed at £1.4m. Calendar time is fixed at nine months. Clinical safety and NHS data standards are treated as fixed quality. Features will be prioritised with MoSCoW.\n\nTwo Scrum delivery teams will work in two-week Sprints: Atlas (patient booking and triage) and Beacon (clinic admin and reporting). A shared Solution Architect owns technical integrity across both Product Backlogs. The Group has not run a multi-team AgilePM project before.',
    },
    {
      heading: 'Named roles',
      body: 'Business Sponsor: Dana Okoye, Group COO — funds the project and chairs the steering group.\nBusiness Visionary: Dr Priya Seth, Medical Director — owns the business vision and Must Have outcome.\nProject Manager: Hana Reid — enables delivery, planning and control across both teams.\nSolution Architect: Omar Khalil.\nProduct Owner (booking product): Leon Marks.\nBusiness Ambassador: Sian Rowe, clinic operations lead, full-time with Atlas.\nBusiness Advisor: Ruth Adeyemi, Information Governance.\nWorkshop Facilitator: used when Hana is not the right independent chair.\nScrum Masters: one per delivery team.',
    },
    {
      heading: 'Constraints and known issues',
      body: 'Shore still books on paper. Several consultants want a complete specification signed before any Sprint starts. The PAS vendor will only offer a two-week integration window in October. Ruth has said any SMS product must complete a Data Protection Impact Assessment before patient data leaves the network. Dana will not move the 1 December Quay go-live or increase the £1.4m envelope.',
    },
    {
      heading: 'Outline delivery',
      body: 'Increment 1 (to 1 December): Quay live for book / change / cancel of existing clinic templates. SMS reminders are Should Have. Automated waitlist promotion is Could Have.\nIncrement 2: Hill and Shore cut over.\nIncrement 3: DNA analytics and a commissioner report pack.\nA high-level Delivery Plan exists. Fine detail is left for Sprint Planning. Foundations lasted three weeks and produced a Prioritised Requirements List, Solution Architecture Definition, and a Project Approach Questionnaire that flagged first-time multi-team working and uneven business availability at Shore.',
    },
  ],
}

const extraIncrement1 = {
  title: 'Additional information — mid Increment 1',
  body: 'Week 6 of Increment 1. Atlas has finished 4 of 6 Must Have booking stories and has a working Quay pilot on the rehearsal environment. Beacon has not started SMS because Leon is waiting for a “full communications strategy” from the corporate comms team. Two consultants have asked Hana to extend Increment 1 by four weeks so Shore paper diaries can be included in the same go-live. Omar has found that the PAS adapter will not be available until 20 October — inside the last Sprint of Increment 1. Sian is being pulled back to the ward three afternoons a week.',
}

const extraPaq = {
  title: 'Additional information — Project Approach Questionnaire extracts',
  body: 'PAQ statements the team marked Amber or Red in Foundations:\n1. Business roles can be made available at the level the project needs — Amber (Shore clinic manager can offer half a day a week).\n2. The solution can be delivered incrementally — Green.\n3. Requirements can be prioritised and the Must Have set kept to a genuine Minimum Usable Subset — Amber (several consultants still call every local preference a Must).\n4. The wider organisation understands that detailed specifications will emerge — Red (procurement issued a 90-page specification as a contract appendix).\n5. Empowered teams can make day-to-day decisions — Amber (IG sign-off currently sits on Ruth’s weekly committee).',
}

export const PRACTITIONER_PAPER_1 = {
  id: 'pract1',
  title: 'Practitioner Paper 1',
  project: 'Harbourline Clinics — OneQueue',
  scenario,
  questions: [
    {
      id: 'Q1',
      code: 'AF',
      title: 'AgilePM Fundamentals',
      parts: [
        {
          id: 'A',
          type: 'classic',
          marks: 5,
          instruction:
            'Answer the following questions about balancing Time, Cost, Quality and Features on OneQueue. Choose one option from A to D for each question.',
          extra: null,
          items: [
            {
              id: 'P1Q1A1',
              q: 'Dana has fixed the 1 December Quay go-live and the £1.4m envelope, and has told the team clinical safety will not be traded. Which variable should OneQueue treat as the primary contingency?',
              options: [
                'A. Time — slip the winter go-live if booking screens are unfinished',
                'B. Cost — raise a supplementary budget whenever a Should Have is at risk',
                'C. Quality — drop clinical-safety checks in the last Sprint to protect scope',
                'D. Features — vary scope through MoSCoW so the Minimum Usable Subset still fits the box',
              ],
              correct:
                'D. Features — vary scope through MoSCoW so the Minimum Usable Subset still fits the box',
              explain:
                'AgilePM fixes time, cost and quality, and uses variable features (MoSCoW) as contingency for VUCA.',
            },
            {
              id: 'P1Q1A2',
              q: 'A consultant argues that “quality can flex a little” so Shore paper diaries can join Increment 1. According to AgilePM, why is that the wrong contingency?',
              options: [
                'A. Quality is never discussed after Foundations',
                'B. Never Compromise Quality — acceptance criteria and safety standards stay fixed; scope flexes instead',
                'C. Only the Solution Architect may reduce quality, and only in Deployment',
                'D. Quality may flex if the Business Sponsor signs a waiver',
              ],
              correct:
                'B. Never Compromise Quality — acceptance criteria and safety standards stay fixed; scope flexes instead',
              explain:
                'Principle 4 keeps agreed quality fixed. Contingency sits in features, not in dropping safety or acceptance criteria.',
            },
            {
              id: 'P1Q1A3',
              q: 'Which action best demonstrates Focus on the Business Need for OneQueue?',
              options: [
                'A. Atlas builds a custom animation pack because a vendor demo looked impressive',
                'B. Priya restates that a live, safe Quay booking service by 1 December is the outcome that justifies the project',
                'C. Beacon starts DNA analytics in Sprint 1 because reporting is interesting',
                'D. Hana freezes every requirement so nothing can change after Foundations',
              ],
              correct:
                'B. Priya restates that a live, safe Quay booking service by 1 December is the outcome that justifies the project',
              explain:
                'Principle 1 keeps work aligned to the agreed business outcome, not to interesting extras.',
            },
            {
              id: 'P1Q1A4',
              q: 'Foundations lasted three weeks and left Sprint-level detail for later. Which principle does that apply?',
              options: [
                'A. Communicate Continuously and Clearly — because no documents were written',
                'B. Build Incrementally from Firm Foundations — understand problem, solution and risk at a high level before major build',
                'C. Deliver on Time — Foundations must always last exactly three weeks',
                'D. Demonstrate Control — only Gantt baselines are permitted in Foundations',
              ],
              correct:
                'B. Build Incrementally from Firm Foundations — understand problem, solution and risk at a high level before major build',
              explain:
                'Principle 5 wants a shared high-level foundation, then incremental delivery. Fine detail waits for the last responsible moment.',
            },
            {
              id: 'P1Q1A5',
              q: 'Which statement correctly describes how AgilePM uses the four framework elements on OneQueue?',
              options: [
                'A. Process, People, Project Artifacts and Practices, underpinned by common sense and pragmatism',
                'B. Process and People only — artifacts are banned on agile projects',
                'C. Practices replace the need for any defined roles',
                'D. Project Artifacts are produced only after Deployment',
              ],
              correct:
                'A. Process, People, Project Artifacts and Practices, underpinned by common sense and pragmatism',
              explain:
                'Those four elements plus common sense and pragmatism are the AgilePM framework.',
            },
          ],
        },
        {
          id: 'B',
          type: 'mr',
          marks: 5,
          instruction:
            'Each question contains options about OneQueue. Remember to select 2 answers to each question. Both must be correct to score the mark.',
          extra: null,
          items: [
            {
              id: 'P1Q1B1',
              q: 'Which 2 statements reflect an appropriate AgilePM response to the PAS vendor’s two-week October window?',
              options: [
                'A. Treat the window as a hard timebox and pull only Must Have integration work into the Sprint that covers it',
                'B. Slip the 1 December go-live as soon as the vendor names a date',
                'C. Collaborate with Omar and the vendor so the adapter is a visible backlog item with clear acceptance criteria',
                'D. Ignore the constraint until Deployment and hope the adapter appears',
                'E. Drop clinical-safety testing to make room for the adapter',
              ],
              correct: [
                'A. Treat the window as a hard timebox and pull only Must Have integration work into the Sprint that covers it',
                'C. Collaborate with Omar and the vendor so the adapter is a visible backlog item with clear acceptance criteria',
              ],
              explain:
                'Deliver on Time and Collaborate. Do not move the increment end-date or trade quality to hide a known constraint.',
            },
            {
              id: 'P1Q1B2',
              q: 'Which 2 actions would put Principle 3 Collaborate into practice on OneQueue?',
              options: [
                'A. Sian remains full-time with Atlas so business decisions are made inside the Sprint',
                'B. Hana writes every acceptance criterion alone so clinicians are not interrupted',
                'C. Priya and Omar join Sprint Reviews so value and integrity are inspected together',
                'D. Ruth only sees the product after go-live to “avoid slowing the team”',
                'E. Beacon is forbidden from talking to Atlas until Increment 3',
              ],
              correct: [
                'A. Sian remains full-time with Atlas so business decisions are made inside the Sprint',
                'C. Priya and Omar join Sprint Reviews so value and integrity are inspected together',
              ],
              explain:
                'Collaboration needs empowered business and solution roles working together throughout, not after the fact.',
            },
            {
              id: 'P1Q1B3',
              q: 'Which 2 statements correctly describe contingency on a project that fixes time, cost and quality?',
              options: [
                'A. Should Have and Could Have features provide the buffer when estimates prove optimistic',
                'B. The Must Have set must still be a genuine Minimum Usable Subset',
                'C. Contingency is created by leaving quality undefined',
                'D. Contingency is created by hiding extra months in a secret plan',
                'E. All features must be Must Have so nothing can be dropped',
              ],
              correct: [
                'A. Should Have and Could Have features provide the buffer when estimates prove optimistic',
                'B. The Must Have set must still be a genuine Minimum Usable Subset',
              ],
              explain:
                'MoSCoW contingency only works if Musts are truly musts and lower priorities can be dropped without failing the business case.',
            },
            {
              id: 'P1Q1B4',
              q: 'Which 2 statements about incremental delivery from firm foundations apply to OneQueue?',
              options: [
                'A. Quay going live in Increment 1 can deliver value before Hill and Shore are ready',
                'B. Foundations should have specified every Shore screen to pixel level',
                'C. A shared understanding of problem, solution and risk was the point of the three-week Foundations',
                'D. Incremental delivery is only allowed if the whole £1.4m is spent in month one',
                'E. Once Delivery starts, Foundations decisions can never be revisited',
              ],
              correct: [
                'A. Quay going live in Increment 1 can deliver value before Hill and Shore are ready',
                'C. A shared understanding of problem, solution and risk was the point of the three-week Foundations',
              ],
              explain:
                'Early increments release value. Foundations stay high-level. They may be revisited between increments if the next slice needs a refreshed baseline.',
            },
            {
              id: 'P1Q1B5',
              q: 'Which 2 leadership behaviours would undermine AgilePM’s philosophy on OneQueue?',
              options: [
                'A. Dana withdraws empowerment and requires her sign-off on every Sprint story',
                'B. Priya clarifies the vision and then lets the teams inspect and adapt',
                'C. Hana replaces Sprint Reviews with a monthly slideshow so clinicians are not “bothered”',
                'D. Omar explains architectural constraints in planning so teams can make informed choices',
                'E. Sian spends her time with Atlas answering business questions as they arise',
              ],
              correct: [
                'A. Dana withdraws empowerment and requires her sign-off on every Sprint story',
                'C. Hana replaces Sprint Reviews with a monthly slideshow so clinicians are not “bothered”',
              ],
              explain:
                'The philosophy needs motivated, empowered people and frequent demonstration of a working solution — not command-and-control or hidden progress.',
            },
          ],
        },
        {
          id: 'C',
          type: 'matching',
          marks: 5,
          instruction:
            'Column 1 lists actions proposed on OneQueue. For each action, select from Column 2 the AgilePM principle it best applies. Each selection from Column 2 can be used once, more than once or not at all.',
          extra: null,
          column2: [
            { key: 'A', text: 'Focus on the Business Need' },
            { key: 'B', text: 'Deliver on Time' },
            { key: 'C', text: 'Never Compromise Quality' },
            { key: 'D', text: 'Communicate Continuously and Clearly' },
            { key: 'E', text: 'Demonstrate Control' },
          ],
          items: [
            {
              id: 'P1Q1C1',
              q: 'Hana keeps a visible increment burndown and a short risk commentary for Dana’s steering group.',
              correct: 'E',
              explain: 'Demonstrate Control is about making progress and issues visible to those who need to govern the project.',
            },
            {
              id: 'P1Q1C2',
              q: 'Priya drops a pet reporting widget from Increment 1 because it does not help Quay go live safely in winter.',
              correct: 'A',
              explain: 'Protecting the outcome that justified the project is Focus on the Business Need.',
            },
            {
              id: 'P1Q1C3',
              q: 'The increment end-date stays 1 December even though consultants ask for Shore to be squeezed in.',
              correct: 'B',
              explain: 'Deliver on Time treats the timebox as immovable; scope changes instead.',
            },
            {
              id: 'P1Q1C4',
              q: 'Clinical-safety acceptance tests remain in the Definition of Done when Atlas is under pressure.',
              correct: 'C',
              explain: 'Never Compromise Quality keeps agreed standards inside Done.',
            },
            {
              id: 'P1Q1C5',
              q: 'Daily Scrum, an information radiator on the ward corridor, and a two-page increment review pack replace a 40-page status report.',
              correct: 'D',
              explain: 'Communicate Continuously and Clearly prefers rich, frequent, low-ceremony channels.',
            },
          ],
        },
        {
          id: 'D',
          type: 'ar',
          marks: 5,
          instruction:
            'Using the additional information provided for this question, answer the assertion/reason questions. For each line identify the appropriate option from A to E. Each option can be used once, more than once or not at all.',
          extra: extraIncrement1,
          items: [
            {
              id: 'P1Q1D1',
              assertion:
                'Hana should refuse the four-week extension and keep Shore out of Increment 1.',
              reason:
                'AgilePM fixes time for the increment and uses feature priority, not elapsed time, as the main contingency.',
              correct: 'A',
              explain:
                'Both true, and the reason is why the assertion is right: do not blow the timebox to absorb extra scope.',
            },
            {
              id: 'P1Q1D2',
              assertion:
                'Leon is right to block all SMS work until corporate comms finish a full strategy.',
              reason:
                'Should Have work may be de-scoped from the increment if it does not fit, but it should not be used to freeze empowered teams.',
              correct: 'D',
              explain:
                'Assertion false — a Should Have can start without a corporate novel. Reason true — SMS can be dropped if the box is full, but that is a priority decision, not a freeze.',
            },
            {
              id: 'P1Q1D3',
              assertion:
                'Sian being pulled back to the ward three afternoons a week is an approach risk the PAQ already hinted at.',
              reason:
                'If empowered business roles are not actually available, day-to-day decisions slow and the project starts to behave like a traditional hand-off model.',
              correct: 'A',
              explain:
                'Both true and linked: availability of business roles is a classic Project Approach issue.',
            },
            {
              id: 'P1Q1D4',
              assertion:
                'Omar should hide the 20 October adapter date from Dana until after go-live.',
              reason:
                'Demonstrate Control requires risks that threaten the increment outcome to be made visible.',
              correct: 'D',
              explain:
                'Assertion false (hiding a critical constraint is the opposite of control). Reason true.',
            },
            {
              id: 'P1Q1D5',
              assertion:
                'Atlas having a working Quay pilot on the rehearsal environment is the primary measure of progress for Increment 1.',
              reason:
                'Working solutions, inspected frequently, are how AgilePM judges progress rather than by documents produced.',
              correct: 'A',
              explain:
                'Both true and the reason explains the assertion — a rehearsal-environment increment is a working solution.',
            },
          ],
        },
      ],
    },
    {
      id: 'Q2',
      code: 'RK',
      title: 'Risk Management and the Project Approach',
      parts: [
        {
          id: 'A',
          type: 'classic',
          marks: 5,
          instruction:
            'Answer the following questions about risk and the Project Approach on OneQueue. Choose one option from A to D.',
          extra: extraPaq,
          items: [
            {
              id: 'P1Q2A1',
              q: 'Using the PAQ extract, which statement is VUCA-derived risk rather than approach-derived risk?',
              options: [
                'A. Procurement attached a 90-page specification to the contract',
                'B. Shore can only offer half a day of business time a week',
                'C. A winter flu surge could double appointment demand after go-live',
                'D. Consultants are labelling local preferences as Must Haves',
              ],
              correct:
                'C. A winter flu surge could double appointment demand after go-live',
              explain:
                'Flu demand is environmental VUCA. The other three are how the organisation is choosing to run the project (approach).',
            },
            {
              id: 'P1Q2A2',
              q: 'Which PAQ red item should Hana tackle first to protect agility?',
              options: [
                'A. Replace Scrum with a detailed Gantt so procurement feels comfortable',
                'B. Explain to procurement that the appendix is a starting backlog, not a frozen specification, and keep Musts as a Minimum Usable Subset',
                'C. Delete the PAQ because it is only a Foundations formality',
                'D. Make every line in the 90-page appendix a Must Have',
              ],
              correct:
                'B. Explain to procurement that the appendix is a starting backlog, not a frozen specification, and keep Musts as a Minimum Usable Subset',
              explain:
                'The red PAQ item is organisational misunderstanding of emergent detail. Fix the approach; do not abandon agility.',
            },
            {
              id: 'P1Q2A3',
              q: 'Why can a disciplined AgilePM approach reduce the need for a separate traditional risk process?',
              options: [
                'A. Agile projects have no risks',
                'B. Short increments, visible progress, empowered roles and the PAQ surface and mitigate risk inside everyday management',
                'C. Only the PMO may record risks, so the team should not try',
                'D. Risk is transferred entirely to the PAS vendor',
              ],
              correct:
                'B. Short increments, visible progress, empowered roles and the PAQ surface and mitigate risk inside everyday management',
              explain:
                'AgilePM’s built-in controls deal with most risk when applied with discipline. A duplicate bureaucracy is usually unnecessary.',
            },
            {
              id: 'P1Q2A4',
              q: 'Ruth’s weekly IG committee is the only path for SMS decisions. What is the most appropriate tailoring?',
              options: [
                'A. Remove IG from the project to go faster',
                'B. Keep the committee and accept that no SMS decision can occur inside a Sprint',
                'C. Bring Ruth (or a deputy with authority) into the team cadence so compliance decisions happen at Sprint pace',
                'D. Let Atlas invent a lawful basis without IG',
              ],
              correct:
                'C. Bring Ruth (or a deputy with authority) into the team cadence so compliance decisions happen at Sprint pace',
              explain:
                'Tailor the approach so the needed authority sits with the team, not a weekly queue that recreates waterfall gates.',
            },
            {
              id: 'P1Q2A5',
              q: 'Which response correctly uses the PAQ rather than treating it as a one-off scorecard?',
              options: [
                'A. Revisit Amber/Red items when increment plans change or new approach risks appear',
                'B. File the PAQ and never look at it again',
                'C. Change Green items to Red so the steering group stays frightened',
                'D. Only the Business Sponsor may read the PAQ',
              ],
              correct:
                'A. Revisit Amber/Red items when increment plans change or new approach risks appear',
              explain:
                'The PAQ is a living conversation about whether the way of working still mitigates approach risk.',
            },
          ],
        },
        {
          id: 'B',
          type: 'mr',
          marks: 5,
          instruction:
            'Remember to select 2 answers to each question. Both must be correct to score the mark.',
          extra: extraPaq,
          items: [
            {
              id: 'P1Q2B1',
              q: 'Which 2 actions would mitigate the Amber business-availability risk at Shore?',
              options: [
                'A. Agree a named deputy Ambassador for Shore with decision rights in Sian’s absence',
                'B. Delay all Shore analysis until Increment 3 “when people are free” with no plan',
                'C. Timebox Shore workshops in Foundations/early Delivery and protect those slots',
                'D. Require every Shore clerk to attend every Daily Scrum in person',
                'E. Convert Shore to a waterfall workstream so they do not need an Ambassador',
              ],
              correct: [
                'A. Agree a named deputy Ambassador for Shore with decision rights in Sian’s absence',
                'C. Timebox Shore workshops in Foundations/early Delivery and protect those slots',
              ],
              explain:
                'Make the role real: authority plus protected time. Do not invent a second lifecycle or abandon the site.',
            },
            {
              id: 'P1Q2B2',
              q: 'Which 2 statements correctly distinguish VUCA-derived risk from approach-derived risk on OneQueue?',
              options: [
                'A. A cyber incident at the SMS gateway is largely environmental / VUCA',
                'B. Labelling every consultant preference as a Must Have is approach-derived',
                'C. All risks on an agile project are approach-derived',
                'D. VUCA risks cannot be discussed in Foundations',
                'E. Approach risk is only recorded after Deployment',
              ],
              correct: [
                'A. A cyber incident at the SMS gateway is largely environmental / VUCA',
                'B. Labelling every consultant preference as a Must Have is approach-derived',
              ],
              explain:
                'VUCA comes from the environment. Approach risk comes from how we choose to run the project.',
            },
            {
              id: 'P1Q2B3',
              q: 'Which 2 PAQ-related actions would Hana take if consultants keep inflating Must Haves?',
              options: [
                'A. Facilitate a MoSCoW challenge: “If this is missing, do we cancel OneQueue?”',
                'B. Ask Priya to own the Must Have set as the Minimum Usable Subset',
                'C. Accept every Must so nobody is upset',
                'D. Move the 1 December date to make room for every Must',
                'E. Delete Should Haves from the language of the project',
              ],
              correct: [
                'A. Facilitate a MoSCoW challenge: “If this is missing, do we cancel OneQueue?”',
                'B. Ask Priya to own the Must Have set as the Minimum Usable Subset',
              ],
              explain:
                'The Visionary owns the outcome. Musts that fail the cancel-the-project test are not Musts.',
            },
            {
              id: 'P1Q2B4',
              q: 'Which 2 statements describe appropriate use of AgilePM instead of adding a parallel RAID bureaucracy?',
              options: [
                'A. Increment Reviews and the Delivery Plan already expose threats to the outcome',
                'B. A short, living risk commentary can sit with the plan without a second process',
                'C. A 40-page risk register updated monthly replaces Sprint Reviews',
                'D. Risks may only be spoken in steering groups, never in Daily Scrums',
                'E. The PAQ is discarded once Delivery starts',
              ],
              correct: [
                'A. Increment Reviews and the Delivery Plan already expose threats to the outcome',
                'B. A short, living risk commentary can sit with the plan without a second process',
              ],
              explain:
                'Discipline inside AgilePM is the risk process. Extra theatre is optional, not required.',
            },
            {
              id: 'P1Q2B5',
              q: 'Which 2 tailoring choices would reduce first-time multi-team approach risk?',
              options: [
                'A. A regular multi-team planning event so Atlas and Beacon sequence shared work',
                'B. Omar holds a single Solution Architecture Definition both teams respect',
                'C. Each team invents its own Definition of Done with no shared safety bar',
                'D. Ban the teams from talking to each other to reduce meetings',
                'E. Give Hana both Scrum Master roles so nobody else leads',
              ],
              correct: [
                'A. A regular multi-team planning event so Atlas and Beacon sequence shared work',
                'B. Omar holds a single Solution Architecture Definition both teams respect',
              ],
              explain:
                'Multi-team risk is managed by shared architecture and an explicit planning event, not by isolation or role hoarding.',
            },
          ],
        },
        {
          id: 'C',
          type: 'matching',
          marks: 5,
          instruction:
            'For each OneQueue observation in Column 1, select from Column 2 the best description. Each selection can be used once, more than once or not at all.',
          extra: extraPaq,
          column2: [
            { key: 'A', text: 'VUCA-derived risk' },
            { key: 'B', text: 'Approach-derived risk' },
            { key: 'C', text: 'Appropriate application of the PAQ' },
            { key: 'D', text: 'Inappropriate application of the PAQ' },
            { key: 'E', text: 'Neither a project risk nor a PAQ use' },
          ],
          items: [
            {
              id: 'P1Q2C1',
              q: 'A regional power cut takes Quay offline on go-live morning.',
              correct: 'A',
              explain: 'External shock — VUCA, not a choice about how the project is run.',
            },
            {
              id: 'P1Q2C2',
              q: 'Procurement treats the 90-page appendix as an unchangeable specification.',
              correct: 'B',
              explain: 'That is an organisational way-of-working choice: approach risk.',
            },
            {
              id: 'P1Q2C3',
              q: 'Hana and Priya walk the Amber/Red PAQ lines in the increment planning event and agree mitigations.',
              correct: 'C',
              explain: 'Using the PAQ to shape the approach is what it is for.',
            },
            {
              id: 'P1Q2C4',
              q: 'The PMO files the PAQ as a completed checklist and forbids anyone to change a rating.',
              correct: 'D',
              explain: 'A frozen scorecard is not how the questionnaire is meant to work.',
            },
            {
              id: 'P1Q2C5',
              q: 'Dana’s favourite coffee machine is out of order in the steering-group room.',
              correct: 'E',
              explain: 'Irrelevant to project risk or the PAQ.',
            },
          ],
        },
        {
          id: 'D',
          type: 'ar',
          marks: 5,
          instruction:
            'Using the additional information provided for this question, identify the appropriate option from A to E for each line.',
          extra: extraPaq,
          items: [
            {
              id: 'P1Q2D1',
              assertion:
                'The Amber rating on “requirements can be prioritised” is an approach risk Hana should treat as active.',
              reason:
                'If Must Haves are not a genuine Minimum Usable Subset, the increment cannot use features as contingency.',
              correct: 'A',
              explain: 'Both true and connected — that is exactly why the PAQ line matters.',
            },
            {
              id: 'P1Q2D2',
              assertion:
                'A Green rating on incremental delivery means no increment plan is required.',
              reason:
                'A Green PAQ line means the principle is understood; it does not replace planning and control artifacts.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P1Q2D3',
              assertion:
                'Empowered day-to-day decisions cannot exist while SMS needs a weekly IG committee.',
              reason:
                'Authority that sits outside the team cadence recreates a gated approach even if the team is called agile.',
              correct: 'A',
              explain: 'Both true — the Amber empowerment line is describing this exact pattern.',
            },
            {
              id: 'P1Q2D4',
              assertion:
                'Hana should add a traditional stage-gate between every Sprint because the PAQ has Red items.',
              reason:
                'Red PAQ items are resolved by tailoring AgilePM, not by installing a second lifecycle.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P1Q2D5',
              assertion:
                'Shore’s half-day-a-week offer should be recorded and mitigated rather than ignored because the overall PAQ looks “mostly Green”.',
              reason:
                'A single unmet PAQ line can still threaten an increment if that site is in the next slice of scope.',
              correct: 'A',
              explain: 'Both true and the reason explains why Amber lines are not cosmetic.',
            },
          ],
        },
      ],
    },
    {
      id: 'Q3',
      code: 'DE',
      title: 'Defining and Estimating the Work',
      parts: [
        {
          id: 'A',
          type: 'classic',
          marks: 5,
          instruction:
            'Answer the following questions about requirements, backlogs and estimating on OneQueue. Choose one option from A to D.',
          extra: null,
          items: [
            {
              id: 'P1Q3A1',
              q: 'Which hierarchy correctly describes how OneQueue work should be organised?',
              options: [
                'A. A project outcome and goals, a Solution/Product Backlog, increment slices, then Sprint Backlogs',
                'B. A single Sprint Backlog that lists every Shore screen for nine months',
                'C. Only a Gantt chart — backlogs are not used with AgilePM',
                'D. A Benefits Assessment that replaces all backlogs after Foundations',
              ],
              correct:
                'A. A project outcome and goals, a Solution/Product Backlog, increment slices, then Sprint Backlogs',
              explain:
                'v3 organises work as goals / solution / increments / sprint-level items, with detail rising as the horizon nears.',
            },
            {
              id: 'P1Q3A2',
              q: 'When should Atlas write field-level validation rules for the Shore paper-diary cutover?',
              options: [
                'A. In Pre-Project, before funding is agreed',
                'B. In Foundations, for every future increment',
                'C. At the last responsible moment — typically the Sprint that will build that slice',
                'D. After Deployment, so users can invent the rules live',
              ],
              correct:
                'C. At the last responsible moment — typically the Sprint that will build that slice',
              explain:
                'Detailed analysis is deferred until it is about to be used. Shore is Increment 2.',
            },
            {
              id: 'P1Q3A3',
              q: 'Which estimate style is appropriate in Foundations for OneQueue?',
              options: [
                'A. Hour-level estimates for every Shore clerk screen',
                'B. High-level estimates good enough to shape increments and test the £1.4m / nine-month box',
                'C. No estimates at all, because agile forbids numbers',
                'D. A fixed-price quote for DNA analytics to two decimal places',
              ],
              correct:
                'B. High-level estimates good enough to shape increments and test the £1.4m / nine-month box',
              explain:
                'Estimating matches the lifecycle phase: coarse in Foundations, finer in Sprint Planning.',
            },
            {
              id: 'P1Q3A4',
              q: 'SMS reminders are Should Have for Increment 1. What does that mean if Atlas is running out of time?',
              options: [
                'A. SMS must still ship or the increment has failed',
                'B. SMS can be dropped from Increment 1 without failing the Minimum Usable Subset',
                'C. SMS becomes a Must Have automatically in week 6',
                'D. SMS cannot be started until Increment 3',
              ],
              correct:
                'B. SMS can be dropped from Increment 1 without failing the Minimum Usable Subset',
              explain:
                'Should Haves are intended contingency. The increment still succeeds if Musts (safe Quay book/change/cancel) are done.',
            },
            {
              id: 'P1Q3A5',
              q: 'Who should confirm that a requirement labelled Must Have really is a Must for the project?',
              options: [
                'A. Any developer who likes the feature',
                'B. The PAS vendor',
                'C. The Business Visionary, using the “would we cancel without it?” test, with the team challenging false Musts',
                'D. The Workshop Facilitator acting alone',
              ],
              correct:
                'C. The Business Visionary, using the “would we cancel without it?” test, with the team challenging false Musts',
              explain:
                'Priya owns the outcome. The whole team should challenge inflated Musts. Facilitators do not own priority.',
            },
          ],
        },
        {
          id: 'B',
          type: 'mr',
          marks: 5,
          instruction:
            'Remember to select 2 answers to each question. Both must be correct to score the mark.',
          extra: extraIncrement1,
          items: [
            {
              id: 'P1Q3B1',
              q: 'Which 2 statements correctly apply MoSCoW at increment level for OneQueue?',
              options: [
                'A. A requirement can be Should Have for Increment 1 and Must Have for the whole project',
                'B. Automated waitlist promotion can be Could Have now even if it is wanted later',
                'C. Increment-level MoSCoW must copy project-level MoSCoW exactly',
                'D. Won’t Have this time is not a permitted priority',
                'E. Must Have at increment level means “nice to have if someone is free”',
              ],
              correct: [
                'A. A requirement can be Should Have for Increment 1 and Must Have for the whole project',
                'B. Automated waitlist promotion can be Could Have now even if it is wanted later',
              ],
              explain:
                'Priorities are timeframe-specific. House-foundations logic: what is Must for the finished house may not be Must for increment one.',
            },
            {
              id: 'P1Q3B2',
              q: 'Which 2 estimating behaviours fit Sprint Planning for Atlas in Increment 1?',
              options: [
                'A. The people who will do the work forecast the Sprint Backlog',
                'B. Estimates get more precise because the stories are about to be built',
                'C. Hana issues hour targets the night before and forbids discussion',
                'D. Foundation-level ranges are reused as if they were task estimates',
                'E. Estimating is delayed until after the Sprint Review',
              ],
              correct: [
                'A. The people who will do the work forecast the Sprint Backlog',
                'B. Estimates get more precise because the stories are about to be built',
              ],
              explain:
                'Phase-appropriate estimating: the delivery team forecasts near-term work in more detail.',
            },
            {
              id: 'P1Q3B3',
              q: 'Using the additional information, which 2 backlog decisions are appropriate in week 6?',
              options: [
                'A. Keep Quay Must Haves first — four of six done is not yet a usable subset',
                'B. Start Shore paper-diary stories immediately because consultants asked',
                'C. SMS can remain Should Have and be dropped if the PAS adapter consumes the last Sprint',
                'D. Re-label every unfinished item as Must Have so nobody can drop it',
                'E. Freeze the Product Backlog so Leon cannot reorder anything',
              ],
              correct: [
                'A. Keep Quay Must Haves first — four of six done is not yet a usable subset',
                'C. SMS can remain Should Have and be dropped if the PAS adapter consumes the last Sprint',
              ],
              explain:
                'Protect the Minimum Usable Subset. Use Should Haves as the valve when a constraint appears.',
            },
            {
              id: 'P1Q3B4',
              q: 'Which 2 items belong in a Solution/Product Backlog rather than only in a personal notebook?',
              options: [
                'A. Book / change / cancel against Quay templates',
                'B. Omar’s PAS adapter spike',
                'C. Hana’s private reminder to buy biscuits',
                'D. Dana’s holiday dates with no project impact',
                'E. A rumour about a rival clinic’s app',
              ],
              correct: [
                'A. Book / change / cancel against Quay templates',
                'B. Omar’s PAS adapter spike',
              ],
              explain:
                'Backlogs hold the work of the project — outcomes, stories, spikes — not trivia.',
            },
            {
              id: 'P1Q3B5',
              q: 'Which 2 statements about the Minimum Usable Subset are correct for Increment 1?',
              options: [
                'A. If Quay cannot book, change and cancel safely, the increment has not delivered its Musts',
                'B. SMS reminders are not required for the increment to succeed',
                'C. DNA analytics is part of the Increment 1 Minimum Usable Subset',
                'D. The Minimum Usable Subset is whatever remains on the last day',
                'E. Could Haves are included in the Minimum Usable Subset by definition',
              ],
              correct: [
                'A. If Quay cannot book, change and cancel safely, the increment has not delivered its Musts',
                'B. SMS reminders are not required for the increment to succeed',
              ],
              explain:
                'MUS = Must Haves for that timeframe. Should/Could are above that line.',
            },
          ],
        },
        {
          id: 'C',
          type: 'matching',
          marks: 5,
          instruction:
            'For each estimate or work item in Column 1, select from Column 2 the lifecycle horizon it best belongs to. Each selection can be used once, more than once or not at all.',
          extra: null,
          column2: [
            { key: 'A', text: 'Pre-Project / business case horizon' },
            { key: 'B', text: 'Foundations (high-level)' },
            { key: 'C', text: 'Project Increment planning' },
            { key: 'D', text: 'Sprint Planning / last responsible moment' },
            { key: 'E', text: 'Post-project benefits measurement' },
          ],
          items: [
            {
              id: 'P1Q3C1',
              q: 'A range of £1.2m–£1.5m and “about three increments in nine months” used to approve funding.',
              correct: 'A',
              explain: 'Coarse numbers to decide whether to start — Pre-Project.',
            },
            {
              id: 'P1Q3C2',
              q: 'Increment 1 = Quay book/change/cancel; Increment 2 = Hill and Shore; Increment 3 = analytics.',
              correct: 'C',
              explain: 'Slicing outcomes across increments is increment planning.',
            },
            {
              id: 'P1Q3C3',
              q: 'Task-level forecast for the three booking stories Atlas will finish this Sprint.',
              correct: 'D',
              explain: 'Sprint Planning is where detailed estimates belong.',
            },
            {
              id: 'P1Q3C4',
              q: 'A high-level Solution Architecture Definition and a first-cut Prioritised Requirements List.',
              correct: 'B',
              explain: 'Those are Foundations work-products, still high-level.',
            },
            {
              id: 'P1Q3C5',
              q: 'Did missed appointments fall from 18% six months after all three sites were live?',
              correct: 'E',
              explain: 'Benefits are measured after the project, not estimated as Sprint tasks.',
            },
          ],
        },
        {
          id: 'D',
          type: 'ar',
          marks: 5,
          instruction:
            'Using the additional information provided for this question, identify the appropriate option from A to E for each line.',
          extra: extraIncrement1,
          items: [
            {
              id: 'P1Q3D1',
              assertion:
                'Leon should reorder the Increment 1 backlog so the remaining Quay Musts beat SMS.',
              reason:
                'MoSCoW exists so lower-priority work yields when a timebox is under pressure.',
              correct: 'A',
              explain: 'Both true and linked — that is the point of Should Have SMS.',
            },
            {
              id: 'P1Q3D2',
              assertion:
                'Detailed Shore diary fields should now be specified because consultants asked in week 6.',
              reason:
                'Detailed analysis is done at the last responsible moment for the increment that will build that slice.',
              correct: 'D',
              explain: 'Assertion false (Shore is Increment 2). Reason true.',
            },
            {
              id: 'P1Q3D3',
              assertion:
                'The PAS adapter appearing on 20 October should be treated as Increment 1 work that may displace Should Haves.',
              reason:
                'A Must Have integration constraint inside the increment consumes the same timebox as other Increment 1 work.',
              correct: 'A',
              explain: 'Both true — the adapter is in the box; SMS may lose.',
            },
            {
              id: 'P1Q3D4',
              assertion:
                'Beacon is right to have produced no Increment 1 increment while waiting for a communications strategy.',
              reason:
                'A Should Have may be deferred, but a team should still pursue any Must Have work in its backlog.',
              correct: 'D',
              explain:
                'Assertion over-states the freeze. Reason true — they should not idle if Musts remain.',
            },
            {
              id: 'P1Q3D5',
              assertion:
                'Four of six Must Have stories done means Increment 1 has already met its Minimum Usable Subset.',
              reason:
                'The Minimum Usable Subset is complete only when every Must Have for that timeframe is done.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
          ],
        },
      ],
    },
    {
      id: 'Q4',
      code: 'PG',
      title: 'Planning, Control, Governance and Products',
      parts: [
        {
          id: 'A',
          type: 'classic',
          marks: 5,
          instruction:
            'Answer the following questions about planning, control and compliance on OneQueue. Choose one option from A to D.',
          extra: extraIncrement1,
          items: [
            {
              id: 'P1Q4A1',
              q: 'Which planning artefact should Hana keep current for Dana while Atlas and Beacon are in Sprints?',
              options: [
                'A. A high-level Delivery Plan plus increment goals, not a task-level Gantt for all nine months',
                'B. A daily 400-line plan that assigns every clinician hour',
                'C. No plan — agile means improvisation only',
                'D. A Benefits Assessment that replaces the Delivery Plan in week 1',
              ],
              correct:
                'A. A high-level Delivery Plan plus increment goals, not a task-level Gantt for all nine months',
              explain:
                'Planning stays appropriate to horizon: increment-level for the project, Sprint Backlogs for the teams.',
            },
            {
              id: 'P1Q4A2',
              q: 'How should Atlas and Beacon handle a shared dependency on Omar’s PAS adapter?',
              options: [
                'A. Never discuss it — each team “self-manages” in isolation',
                'B. Surface it in a multi-team planning event and sequence Sprint goals around the October window',
                'C. Ask Dana to code the adapter on Sundays',
                'D. Duplicate the adapter in both teams with no shared design',
              ],
              correct:
                'B. Surface it in a multi-team planning event and sequence Sprint goals around the October window',
              explain:
                'v3 expects Scrum to be tailored with a project-level planning event for cross-team dependencies.',
            },
            {
              id: 'P1Q4A3',
              q: 'What is the most appropriate control if week-6 rehearsal shows 4 of 6 Musts done and SMS untouched?',
              options: [
                'A. Declare Increment 1 failed and stop the project',
                'B. Inspect the increment goal, drop or defer SMS, and concentrate both teams on the remaining Musts and the adapter',
                'C. Extend the increment by four weeks as the consultants asked',
                'D. Replace Sprint Reviews with a written apology',
              ],
              correct:
                'B. Inspect the increment goal, drop or defer SMS, and concentrate both teams on the remaining Musts and the adapter',
              explain:
                'Control means respond to what the increment is telling you — inside the timebox, using priority.',
            },
            {
              id: 'P1Q4A4',
              q: 'How should the DPIA for SMS be handled so agility and compliance both survive?',
              options: [
                'A. Ignore the DPIA because the project is agile',
                'B. Treat the DPIA as a work-product with acceptance criteria and pull it into a Sprint before SMS goes near live data',
                'C. Complete every conceivable IG document for Increments 2 and 3 in Foundations',
                'D. Wait until after Deployment and hope for retrospective approval',
              ],
              correct:
                'B. Treat the DPIA as a work-product with acceptance criteria and pull it into a Sprint before SMS goes near live data',
              explain:
                'Regulatory work is planned and done just in time, not skipped and not front-loaded for the whole programme.',
            },
            {
              id: 'P1Q4A5',
              q: 'How does financial governance on OneQueue differ from a traditional fixed-scope project?',
              options: [
                'A. Time and cost are fixed; scope is the variable that protects the business case',
                'B. Scope is fixed; time and cost expand until every consultant request is built',
                'C. There is no financial governance on agile projects',
                'D. Dana must approve every story’s cost to the nearest pound mid-Sprint',
              ],
              correct:
                'A. Time and cost are fixed; scope is the variable that protects the business case',
              explain:
                'AgilePM financial control is the opposite of traditional: the box is time and money; features flex.',
            },
          ],
        },
        {
          id: 'B',
          type: 'mr',
          marks: 5,
          instruction:
            'Remember to select 2 answers to each question. Both must be correct to score the mark.',
          extra: extraIncrement1,
          items: [
            {
              id: 'P1Q4B1',
              q: 'Which 2 events give Dana enough control without a weekly 40-page report?',
              options: [
                'A. Increment Reviews with a working Quay rehearsal',
                'B. A short, visible Delivery Plan and risk commentary',
                'C. Daily personal status emails from every developer to Dana',
                'D. Cancelling Sprint Reviews so nothing incomplete is seen',
                'E. A benefits audit in week 2 of Foundations',
              ],
              correct: [
                'A. Increment Reviews with a working Quay rehearsal',
                'B. A short, visible Delivery Plan and risk commentary',
              ],
              explain:
                'Demonstrate Control with working software and a thin, honest plan — not theatre or hidden work.',
            },
            {
              id: 'P1Q4B2',
              q: 'Which 2 tailoring actions help two Scrum teams stay one AgilePM project?',
              options: [
                'A. Shared increment goals set with Priya and Omar',
                'B. A dependency board reviewed in the multi-team planning event',
                'C. Separate visions that contradict each other',
                'D. Different clinical-safety bars in each team’s Definition of Done',
                'E. No Product Owner because Hana will write every story',
              ],
              correct: [
                'A. Shared increment goals set with Priya and Omar',
                'B. A dependency board reviewed in the multi-team planning event',
              ],
              explain:
                'Multi-team control is shared goals plus explicit dependency management.',
            },
            {
              id: 'P1Q4B3',
              q: 'Which 2 statements about tracking in a Sprint timebox are appropriate?',
              options: [
                'A. Daily Scrum inspects whether the Sprint Goal is still in reach',
                'B. Unfinished Should Haves can leave the Sprint without failing Increment 1 if Musts remain on track',
                'C. Progress is reported only as percentage of documents signed',
                'D. Once a Sprint starts, no one may mention a new PAS date',
                'E. Tracking is the PMO’s job and teams should not look at the board',
              ],
              correct: [
                'A. Daily Scrum inspects whether the Sprint Goal is still in reach',
                'B. Unfinished Should Haves can leave the Sprint without failing Increment 1 if Musts remain on track',
              ],
              explain:
                'Inspect and adapt inside the Sprint; increment success is the Must Have set, not every Should.',
            },
            {
              id: 'P1Q4B4',
              q: 'Which 2 work-products support regulatory compliance without destroying agility?',
              options: [
                'A. A DPIA sized to SMS, built inside a Sprint',
                'B. An auditable change history on booking records (already a Must Have quality attribute)',
                'C. A 200-page compliance strategy covering features that will not exist for a year',
                'D. Verbal IG approval with no record',
                'E. Deleting logs after each Sprint to “stay lightweight”',
              ],
              correct: [
                'A. A DPIA sized to SMS, built inside a Sprint',
                'B. An auditable change history on booking records (already a Must Have quality attribute)',
              ],
              explain:
                'Just-enough, just-in-time evidence. Quality attributes that are Musts stay in the solution.',
            },
            {
              id: 'P1Q4B5',
              q: 'Which 2 responses to the consultants’ four-week extension request demonstrate control?',
              options: [
                'A. Keep 1 December; offer Shore a place in Increment 2 with a visible date',
                'B. Explain that extra scope is paid for by dropping Should/Could, not by stretching time',
                'C. Agree the extension quietly so Dana is not worried',
                'D. Cancel Increment Reviews until Shore is also live',
                'E. Declare quality optional so everything fits',
              ],
              correct: [
                'A. Keep 1 December; offer Shore a place in Increment 2 with a visible date',
                'B. Explain that extra scope is paid for by dropping Should/Could, not by stretching time',
              ],
              explain:
                'Control is a visible plan and an honest trade-off, not a silent date slip or a quality cut.',
            },
          ],
        },
        {
          id: 'C',
          type: 'matching',
          marks: 5,
          instruction:
            'For each proposed control in Column 1, select from Column 2 the best evaluation. Each selection can be used once, more than once or not at all.',
          extra: extraIncrement1,
          column2: [
            { key: 'A', text: 'Appropriate AgilePM planning' },
            { key: 'B', text: 'Appropriate tracking / control' },
            { key: 'C', text: 'Appropriate multi-team tailoring of Scrum' },
            { key: 'D', text: 'Appropriate compliance / financial governance' },
            { key: 'E', text: 'Inappropriate in this scenario' },
          ],
          items: [
            {
              id: 'P1Q4C1',
              q: 'Hana convenes a two-hour increment planning event so Atlas, Beacon and Omar sequence the October adapter.',
              correct: 'C',
              explain: 'That is the multi-team planning tailoring v3 expects.',
            },
            {
              id: 'P1Q4C2',
              q: 'Dana is shown a working Quay rehearsal and a one-page increment forecast, not a 40-page pack.',
              correct: 'B',
              explain: 'Tracking by working solution plus a thin forecast is Demonstrate Control.',
            },
            {
              id: 'P1Q4C3',
              q: 'The Delivery Plan still shows three increments and a fixed 1 December Increment 1 date.',
              correct: 'A',
              explain: 'Horizon-appropriate planning, dates held.',
            },
            {
              id: 'P1Q4C4',
              q: 'SMS cannot use live numbers until the DPIA story meets its acceptance criteria.',
              correct: 'D',
              explain: 'Compliance integrated as real work, not a side process.',
            },
            {
              id: 'P1Q4C5',
              q: 'Hana agrees the four-week extension in a corridor so Shore can join Increment 1.',
              correct: 'E',
              explain: 'That breaks Deliver on Time and hides a plan change from governance.',
            },
          ],
        },
        {
          id: 'D',
          type: 'ar',
          marks: 5,
          instruction:
            'Using the additional information provided for this question, identify the appropriate option from A to E for each line.',
          extra: extraIncrement1,
          items: [
            {
              id: 'P1Q4D1',
              assertion:
                'Hana should keep the increment timebox and publish a revised feature forecast that drops or slips SMS.',
              reason:
                'In AgilePM, control is exercised by changing scope inside a fixed time and cost box.',
              correct: 'A',
              explain: 'Both true and the reason is why the assertion is the right control action.',
            },
            {
              id: 'P1Q4D2',
              assertion:
                'Beacon should stay idle until corporate comms finish their strategy.',
              reason:
                'Teams demonstrate control by progressing Must Have work and making blockers visible.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P1Q4D3',
              assertion:
                'The 20 October adapter date should appear on the shared dependency board before the next multi-team planning event.',
              reason:
                'Cross-team dependencies are controlled by making them explicit in project-level planning, not inside one team’s private chat.',
              correct: 'A',
              explain: 'Both true and linked.',
            },
            {
              id: 'P1Q4D4',
              assertion:
                'Dana should receive the week-6 rehearsal as evidence of progress even though two Musts remain.',
              reason:
                'A working solution that is not yet complete is still a better control signal than a status report about documents.',
              correct: 'A',
              explain: 'Both true — incomplete working software is still the primary measure.',
            },
            {
              id: 'P1Q4D5',
              assertion:
                'Financial governance requires Hana to request another £200k so Shore can join Increment 1.',
              reason:
                'AgilePM financial governance holds the cost box and asks which features no longer fit.',
              correct: 'D',
              explain: 'Assertion false (do not bust the envelope for extra scope). Reason true.',
            },
          ],
        },
      ],
    },
  ],
}
