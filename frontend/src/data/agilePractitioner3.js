// Original Practitioner Paper 3 — Lumen Arts Trust.
// Official 80-line booklet layout. Not copied from any APMG sample.

const scenario = {
  title: 'Project Scenario — Lumen Arts Trust',
  sections: [
    {
      heading: 'The organisation',
      body: 'Lumen Arts Trust is a registered charity that runs a riverside arts centre and an annual summer festival. Tickets are still sold from a 14-year-old box-office product; memberships and gift-aid declarations sit in a separate database plus paper forms at the door. Gift-aid claims have failed two external audits. Most front-of-house shifts are staffed by volunteers who are rarely free in weekday office hours. The Board has accepted that one platform must replace both systems before the festival opens.',
    },
    {
      heading: 'The project',
      body: 'Project name: HouseLight. Outcome required: a live box-office and membership service on one platform, with an auditable gift-aid trail and public screens that meet WCAG 2.2 AA. The first increment must be in service before first night on 4 July so festival audiences are not sold from the legacy till. Total cost is fixed at the £620k Arts Council grant. Calendar time is fixed by the festival opening. Accessibility and gift-aid evidence are treated as fixed quality. Features will be prioritised with MoSCoW.\n\nOne Scrum delivery team (Lantern) will work in two-week Sprints on box-office and membership. A second vendor team (Tidal) will deliver the payment gateway under PCI DSS. A shared Solution Architect owns technical integrity across both Product Backlogs. The Trust has not run an AgilePM project with an external delivery team before.',
    },
    {
      heading: 'Named roles',
      body: 'Business Sponsor: Elena Varga, Chair of Trustees — funds the project and chairs the steering group.\nBusiness Visionary: Malik Shore, Artistic Director — owns the business vision and Must Have outcome.\nProject Manager: Chris Adeyemi — enables delivery, planning and control across Lantern and Tidal.\nSolution Architect: Priya Nair.\nProduct Owner (HouseLight product): Hannah Bell, volunteer coordinator.\nBusiness Ambassador: Owen Grant, front-of-house lead, scheduled with Lantern.\nBusiness Advisor: Iona Kerr, Head of Finance (gift-aid and card-scheme wording).\nWorkshop Facilitator: used when Chris is not the right independent chair.\nScrum Masters: one for Lantern; Tidal supplies its own.',
    },
    {
      heading: 'Constraints and known issues',
      body: 'Volunteers, including most ushers who know the foyer flow, cannot attend weekday daytime workshops. Tidal will only offer a PCI assessment window in a named June fortnight. Several trustees want an 80-page specification signed before any Sprint starts and have attached that document as a grant-condition appendix. Elena will not move first night on 4 July or increase the £620k envelope. Iona has said no live card data may leave the Trust until the gateway slice has a recorded PCI evidence pack.',
    },
    {
      heading: 'Outline delivery',
      body: 'Increment 1 (to 4 July): live festival book / pay / collect, plus membership join with a gift-aid declaration and audit trail. WCAG 2.2 AA on public screens is Must Have quality. Season-pass renewals are Should Have. A volunteer shift-swap board is Could Have.\nIncrement 2: membership renewals and a donor portal.\nIncrement 3: festival-year analytics and a trustee report pack.\nA high-level Delivery Plan exists. Fine detail is left for Sprint Planning. Foundations lasted three weeks and produced a Prioritised Requirements List, Solution Architecture Definition, and a Project Approach Questionnaire that flagged first-time vendor-team working and volunteer daytime unavailability.',
    },
  ],
}

const extraIncrement1 = {
  title: 'Additional information — mid Increment 1',
  body: 'Week 6 of Increment 1. Lantern has finished 3 of 5 Must Have stories (book, pay, collect, join, audit-trail): book, collect and join run on a rehearsal foyer kiosk; pay and the gift-aid audit trail are unfinished. Tidal has not started the PCI-scoped payment slice because Hannah is waiting for a “full commercial policy” from the monthly finance committee. Two trustees have asked Chris to extend Increment 1 by five weeks so a printed souvenir programme shop can join the same go-live. Priya has found that the PCI assessment window is only available in the fortnight beginning 9 June — inside the last Sprint of Increment 1. Owen is being pulled back to the box-office three mornings a week.',
}

const extraPaq = {
  title: 'Additional information — Project Approach Questionnaire extracts',
  body: 'PAQ statements the team marked Amber or Red in Foundations:\n1. Business roles can be made available at the level the project needs — Amber (Owen and most volunteers can only offer evenings and weekends).\n2. The solution can be delivered incrementally — Green.\n3. Requirements can be prioritised and the Must Have set kept to a genuine Minimum Usable Subset — Amber (several trustees still call every souvenir idea a Must).\n4. The wider organisation understands that detailed specifications will emerge — Red (the Board issued an 80-page specification as a grant-condition appendix).\n5. Empowered teams can make day-to-day decisions — Amber (PCI wording and gift-aid clauses currently sit on Iona’s monthly finance committee).',
}

export const PRACTITIONER_PAPER_3 = {
  id: 'pract3',
  title: 'Practitioner Paper 3',
  project: 'Lumen Arts Trust — HouseLight',
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
            'Answer the following questions about balancing Time, Cost, Quality and Features on HouseLight. Choose one option from A to D for each question.',
          extra: null,
          items: [
            {
              id: 'P3Q1A1',
              q: 'Elena has locked first night on 4 July and the £620k grant, and Malik has said WCAG 2.2 AA and the gift-aid audit trail will not be traded. Which variable should HouseLight treat as the primary contingency?',
              options: [
                'A. Time — open the festival a month late if the membership join screen is unfinished',
                'B. Cost — ask Arts Council for a top-up whenever a Should Have slips',
                'C. Quality — drop accessibility checks in the last Sprint so the souvenir shop fits',
                'D. Features — vary scope through MoSCoW so the Minimum Usable Subset still fits the box',
              ],
              correct:
                'D. Features — vary scope through MoSCoW so the Minimum Usable Subset still fits the box',
              explain:
                'AgilePM fixes time, cost and quality, and uses variable features (MoSCoW) as contingency for VUCA.',
            },
            {
              id: 'P3Q1A2',
              q: 'A trustee argues that “AA can slip to A for launch week” so the souvenir shop can join Increment 1. According to AgilePM, why is that the wrong contingency?',
              options: [
                'A. Quality is only discussed in Realisation',
                'B. Never Compromise Quality — agreed accessibility and audit standards stay fixed; scope flexes instead',
                'C. Only Tidal may reduce quality, and only after first night',
                'D. Quality may flex if the Chair initials a sticky note',
              ],
              correct:
                'B. Never Compromise Quality — agreed accessibility and audit standards stay fixed; scope flexes instead',
              explain:
                'Principle 4 keeps agreed quality fixed. Contingency sits in features, not in dropping WCAG or gift-aid evidence.',
            },
            {
              id: 'P3Q1A3',
              q: 'Which action best demonstrates Focus on the Business Need for HouseLight?',
              options: [
                'A. Lantern builds a 3D foyer fly-through because a supplier stand looked impressive',
                'B. Malik restates that a live, accessible festival box-office and gift-aid join by 4 July is the outcome that justifies the grant',
                'C. Tidal starts trustee analytics in Sprint 1 because dashboards are interesting',
                'D. Chris freezes every requirement so nothing can change after Foundations',
              ],
              correct:
                'B. Malik restates that a live, accessible festival box-office and gift-aid join by 4 July is the outcome that justifies the grant',
              explain:
                'Principle 1 keeps work aligned to the agreed business outcome, not to interesting extras.',
            },
            {
              id: 'P3Q1A4',
              q: 'HouseLight spent three weeks in Foundations and deliberately left foyer field rules for Sprint Planning. Which principle does that apply?',
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
              id: 'P3Q1A5',
              q: 'Chris is briefing new trustees on what AgilePM actually consists of. Which statement correctly names the four framework elements, plus what underpins them?',
              options: [
                'A. Process, People, Project Artifacts and Practices, underpinned by common sense and pragmatism',
                'B. Process and People only — artifacts are banned on charity projects',
                'C. Practices replace the need for any defined roles',
                'D. Project Artifacts are produced only after first night',
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
            'Each question contains options about HouseLight. Remember to select 2 answers to each question. Both must be correct to score the mark.',
          extra: null,
          items: [
            {
              id: 'P3Q1B1',
              q: 'Which 2 statements reflect an appropriate AgilePM response to Tidal’s June PCI assessment window?',
              options: [
                'A. Treat the window as a hard timebox and pull only Must Have gateway work into the Sprint that covers it',
                'B. Slip 4 July as soon as Tidal names a fortnight',
                'C. Collaborate with Priya and Tidal so the PCI slice is a visible backlog item with clear acceptance criteria',
                'D. Ignore the window until Deployment and hope the assessor appears',
                'E. Drop WCAG tests to make room for the gateway',
              ],
              correct: [
                'A. Treat the window as a hard timebox and pull only Must Have gateway work into the Sprint that covers it',
                'C. Collaborate with Priya and Tidal so the PCI slice is a visible backlog item with clear acceptance criteria',
              ],
              explain:
                'Deliver on Time and Collaborate. Do not move first night or trade quality to hide a known constraint.',
            },
            {
              id: 'P3Q1B2',
              q: 'Which 2 actions would put Principle 3 Collaborate into practice on HouseLight?',
              options: [
                'A. Owen remains scheduled with Lantern so foyer decisions are made inside the Sprint',
                'B. Chris writes every acceptance criterion alone so volunteers are not interrupted',
                'C. Malik and Priya join Sprint Reviews so value and integrity are inspected together',
                'D. Iona only sees the product after first night to “avoid slowing Tidal”',
                'E. Lantern is forbidden from talking to Tidal until Increment 3',
              ],
              correct: [
                'A. Owen remains scheduled with Lantern so foyer decisions are made inside the Sprint',
                'C. Malik and Priya join Sprint Reviews so value and integrity are inspected together',
              ],
              explain:
                'Collaboration needs empowered business and solution roles working together throughout, not after the fact.',
            },
            {
              id: 'P3Q1B3',
              q: 'Which 2 statements correctly describe contingency on a project that fixes time, cost and quality?',
              options: [
                'A. Should Have and Could Have features provide the buffer when estimates prove optimistic',
                'B. The Must Have set must still be a genuine Minimum Usable Subset',
                'C. Contingency is created by leaving WCAG undefined',
                'D. Contingency is created by hiding extra weeks in a secret plan',
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
              id: 'P3Q1B4',
              q: 'Which 2 statements about incremental delivery from firm foundations apply to HouseLight?',
              options: [
                'A. Festival book / pay / collect going live in Increment 1 can deliver value before the donor portal exists',
                'B. Foundations should have specified every donor-portal field to pixel level',
                'C. A shared understanding of problem, solution and risk was the point of the three-week Foundations',
                'D. Incremental delivery is only allowed if the whole £620k is spent in month one',
                'E. Once Delivery starts, Foundations decisions can never be revisited',
              ],
              correct: [
                'A. Festival book / pay / collect going live in Increment 1 can deliver value before the donor portal exists',
                'C. A shared understanding of problem, solution and risk was the point of the three-week Foundations',
              ],
              explain:
                'Early increments release value. Foundations stay high-level. They may be revisited between increments if the next slice needs a refreshed baseline.',
            },
            {
              id: 'P3Q1B5',
              q: 'Which 2 leadership behaviours would undermine AgilePM’s philosophy on HouseLight?',
              options: [
                'A. Elena withdraws empowerment and requires her sign-off on every Sprint story',
                'B. Malik clarifies the vision and then lets the teams inspect and adapt',
                'C. Chris replaces Sprint Reviews with a monthly slideshow so volunteers are not “bothered”',
                'D. Priya explains PCI constraints in planning so teams can make informed choices',
                'E. Owen spends his scheduled time with Lantern answering foyer questions as they arise',
              ],
              correct: [
                'A. Elena withdraws empowerment and requires her sign-off on every Sprint story',
                'C. Chris replaces Sprint Reviews with a monthly slideshow so volunteers are not “bothered”',
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
            'Column 1 lists actions proposed on HouseLight. For each action, select from Column 2 the AgilePM principle it best applies. Each selection from Column 2 can be used once, more than once or not at all.',
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
              id: 'P3Q1C1',
              q: 'Chris keeps a visible increment burndown and a short risk commentary for Elena’s steering group.',
              correct: 'E',
              explain: 'Demonstrate Control is about making progress and issues visible to those who need to govern the project.',
            },
            {
              id: 'P3Q1C2',
              q: 'Malik drops a pet souvenir-shop widget from Increment 1 because it does not help first night open safely.',
              correct: 'A',
              explain: 'Protecting the outcome that justified the grant is Focus on the Business Need.',
            },
            {
              id: 'P3Q1C3',
              q: 'The increment end-date stays 4 July even though trustees ask for the souvenir shop to be squeezed in.',
              correct: 'B',
              explain: 'Deliver on Time treats the timebox as immovable; scope changes instead.',
            },
            {
              id: 'P3Q1C4',
              q: 'WCAG 2.2 AA checks remain in the Definition of Done when Lantern is under pressure.',
              correct: 'C',
              explain: 'Never Compromise Quality keeps agreed standards inside Done.',
            },
            {
              id: 'P3Q1C5',
              q: 'Daily Scrum, a foyer whiteboard, and a two-page increment review pack replace a 40-page status report.',
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
              id: 'P3Q1D1',
              assertion:
                'Chris should refuse the five-week extension and keep the souvenir shop out of Increment 1.',
              reason:
                'AgilePM fixes time for the increment and uses feature priority, not elapsed time, as the main contingency.',
              correct: 'A',
              explain:
                'Both true, and the reason is why the assertion is right: do not blow the timebox to absorb extra scope.',
            },
            {
              id: 'P3Q1D2',
              assertion:
                'Hannah is right to block all Tidal payment work until the finance committee finishes a full commercial policy.',
              reason:
                'Should Have work may be de-scoped from the increment if it does not fit, but it should not be used to freeze empowered teams.',
              correct: 'D',
              explain:
                'Assertion false — pay is a Must Have and cannot wait for a committee novel. Reason true — lower-priority work can be dropped, but that is a priority decision, not a freeze.',
            },
            {
              id: 'P3Q1D3',
              assertion:
                'Owen being pulled back to the box-office three mornings a week is an approach risk the PAQ already hinted at.',
              reason:
                'If empowered business roles are not actually available, day-to-day decisions slow and the project starts to behave like a traditional hand-off model.',
              correct: 'A',
              explain:
                'Both true and linked: availability of business roles is a classic Project Approach issue.',
            },
            {
              id: 'P3Q1D4',
              assertion:
                'Priya should hide the 9 June PCI window from Elena until after first night.',
              reason:
                'Demonstrate Control requires risks that threaten the increment outcome to be made visible.',
              correct: 'D',
              explain:
                'Assertion false (hiding a critical constraint is the opposite of control). Reason true.',
            },
            {
              id: 'P3Q1D5',
              assertion:
                'Lantern having a working foyer kiosk on the rehearsal environment is the primary measure of progress for Increment 1.',
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
            'Answer the following questions about risk and the Project Approach on HouseLight. Choose one option from A to D.',
          extra: extraPaq,
          items: [
            {
              id: 'P3Q2A1',
              q: 'Using the PAQ extract, which statement is VUCA-derived risk rather than approach-derived risk?',
              options: [
                'A. The Board attached an 80-page specification to the grant conditions',
                'B. Owen and volunteers can only offer evenings and weekends',
                'C. A riverside flood could close the foyer on first night',
                'D. Trustees are labelling souvenir ideas as Must Haves',
              ],
              correct:
                'C. A riverside flood could close the foyer on first night',
              explain:
                'A flood is environmental VUCA. The other three are how the Trust is choosing to run the project (approach).',
            },
            {
              id: 'P3Q2A2',
              q: 'Which PAQ red item should Chris tackle first to protect agility?',
              options: [
                'A. Replace Scrum with a detailed Gantt so the Board feels comfortable',
                'B. Explain to the Board that the appendix is a starting backlog, not a frozen specification, and keep Musts as a Minimum Usable Subset',
                'C. Delete the PAQ because it is only a Foundations formality',
                'D. Make every line in the 80-page appendix a Must Have',
              ],
              correct:
                'B. Explain to the Board that the appendix is a starting backlog, not a frozen specification, and keep Musts as a Minimum Usable Subset',
              explain:
                'The red PAQ item is organisational misunderstanding of emergent detail. Fix the approach; do not abandon agility.',
            },
            {
              id: 'P3Q2A3',
              q: 'Why can a disciplined AgilePM approach reduce the need for a separate traditional risk process?',
              options: [
                'A. Charity projects have no risks',
                'B. Short increments, visible progress, empowered roles and the PAQ surface and mitigate risk inside everyday management',
                'C. Only the Arts Council may record risks, so the team should not try',
                'D. Risk is transferred entirely to Tidal',
              ],
              correct:
                'B. Short increments, visible progress, empowered roles and the PAQ surface and mitigate risk inside everyday management',
              explain:
                'AgilePM’s built-in controls deal with most risk when applied with discipline. A duplicate bureaucracy is usually unnecessary.',
            },
            {
              id: 'P3Q2A4',
              q: 'Iona’s monthly finance committee is the only path for PCI wording and gift-aid clauses. What is the most appropriate tailoring?',
              options: [
                'A. Remove finance from the project to go faster',
                'B. Keep the committee and accept that no payment decision can occur inside a Sprint',
                'C. Bring Iona (or a deputy with authority) into the team cadence so compliance decisions happen at Sprint pace',
                'D. Let Lantern invent lawful gift-aid wording without Finance',
              ],
              correct:
                'C. Bring Iona (or a deputy with authority) into the team cadence so compliance decisions happen at Sprint pace',
              explain:
                'Tailor the approach so the needed authority sits with the team, not a monthly queue that recreates waterfall gates.',
            },
            {
              id: 'P3Q2A5',
              q: 'Which response correctly uses the PAQ rather than treating it as a one-off scorecard?',
              options: [
                'A. Revisit Amber/Red items when increment plans change or new approach risks appear',
                'B. File the PAQ and never look at it again',
                'C. Change Green items to Red so the Board stays frightened',
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
              id: 'P3Q2B1',
              q: 'Which 2 actions would mitigate the Amber business-availability risk from volunteers?',
              options: [
                'A. Agree a named deputy Ambassador with decision rights when Owen is on the door',
                'B. Delay all foyer analysis until Increment 3 “when people are free” with no plan',
                'C. Timebox evening and weekend workshops in Foundations/early Delivery and protect those slots',
                'D. Require every usher to attend every Daily Scrum in person at 10:00',
                'E. Convert HouseLight to a waterfall workstream so they do not need an Ambassador',
              ],
              correct: [
                'A. Agree a named deputy Ambassador with decision rights when Owen is on the door',
                'C. Timebox evening and weekend workshops in Foundations/early Delivery and protect those slots',
              ],
              explain:
                'Make the role real: authority plus protected time that matches volunteer availability. Do not invent a second lifecycle or abandon the foyer.',
            },
            {
              id: 'P3Q2B2',
              q: 'Which 2 statements correctly distinguish VUCA-derived risk from approach-derived risk on HouseLight?',
              options: [
                'A. A card-scheme rule change at the gateway is largely environmental / VUCA',
                'B. Labelling every souvenir idea as a Must Have is approach-derived',
                'C. All risks on an agile project are approach-derived',
                'D. VUCA risks cannot be discussed in Foundations',
                'E. Approach risk is only recorded after first night',
              ],
              correct: [
                'A. A card-scheme rule change at the gateway is largely environmental / VUCA',
                'B. Labelling every souvenir idea as a Must Have is approach-derived',
              ],
              explain:
                'VUCA comes from the environment. Approach risk comes from how we choose to run the project.',
            },
            {
              id: 'P3Q2B3',
              q: 'Which 2 PAQ-related actions would Chris take if trustees keep inflating Must Haves?',
              options: [
                'A. Facilitate a MoSCoW challenge: “If this is missing, do we cancel HouseLight and the festival opening?”',
                'B. Ask Malik to own the Must Have set as the Minimum Usable Subset',
                'C. Accept every Must so nobody is upset',
                'D. Move 4 July to make room for every Must',
                'E. Delete Should Haves from the language of the project',
              ],
              correct: [
                'A. Facilitate a MoSCoW challenge: “If this is missing, do we cancel HouseLight and the festival opening?”',
                'B. Ask Malik to own the Must Have set as the Minimum Usable Subset',
              ],
              explain:
                'The Visionary owns the outcome. Musts that fail the cancel-the-project test are not Musts.',
            },
            {
              id: 'P3Q2B4',
              q: 'Which 2 statements describe appropriate use of AgilePM instead of adding a parallel RAID bureaucracy?',
              options: [
                'A. Increment Reviews and the Delivery Plan already expose threats to the outcome',
                'B. A short, living risk commentary can sit with the plan without a second process',
                'C. A 40-page risk register updated monthly replaces Sprint Reviews',
                'D. Risks may only be spoken in Board meetings, never in Daily Scrums',
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
              id: 'P3Q2B5',
              q: 'Which 2 tailoring choices would reduce first-time vendor-plus-internal approach risk?',
              options: [
                'A. A regular multi-team planning event so Lantern and Tidal sequence shared work',
                'B. Priya holds a single Solution Architecture Definition both teams respect',
                'C. Each team invents its own Definition of Done with no shared accessibility or PCI bar',
                'D. Ban the teams from talking to each other to reduce meetings',
                'E. Give Chris both Scrum Master roles so nobody else leads',
              ],
              correct: [
                'A. A regular multi-team planning event so Lantern and Tidal sequence shared work',
                'B. Priya holds a single Solution Architecture Definition both teams respect',
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
            'For each HouseLight observation in Column 1, select from Column 2 the best description. Each selection can be used once, more than once or not at all.',
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
              id: 'P3Q2C1',
              q: 'A city-wide power cut takes the riverside centre offline on first night.',
              correct: 'A',
              explain: 'External shock — VUCA, not a choice about how the project is run.',
            },
            {
              id: 'P3Q2C2',
              q: 'The Board treats the 80-page appendix as an unchangeable specification.',
              correct: 'B',
              explain: 'That is an organisational way-of-working choice: approach risk.',
            },
            {
              id: 'P3Q2C3',
              q: 'Chris and Malik walk the Amber/Red PAQ lines in the increment planning event and agree mitigations.',
              correct: 'C',
              explain: 'Using the PAQ to shape the approach is what it is for.',
            },
            {
              id: 'P3Q2C4',
              q: 'The clerk files the PAQ as a completed checklist and forbids anyone to change a rating.',
              correct: 'D',
              explain: 'A frozen scorecard is not how the questionnaire is meant to work.',
            },
            {
              id: 'P3Q2C5',
              q: 'Elena’s favourite kettle is out of order in the Board room.',
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
              id: 'P3Q2D1',
              assertion:
                'The Amber rating on “requirements can be prioritised” is an approach risk Chris should treat as active.',
              reason:
                'If Must Haves are not a genuine Minimum Usable Subset, the increment cannot use features as contingency.',
              correct: 'A',
              explain: 'Both true and connected — that is exactly why the PAQ line matters.',
            },
            {
              id: 'P3Q2D2',
              assertion:
                'A Green rating on incremental delivery means no increment plan is required.',
              reason:
                'A Green PAQ line means the principle is understood; it does not replace planning and control artifacts.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P3Q2D3',
              assertion:
                'Empowered day-to-day decisions cannot exist while PCI wording needs a monthly finance committee.',
              reason:
                'Authority that sits outside the team cadence recreates a gated approach even if the team is called agile.',
              correct: 'A',
              explain: 'Both true — the Amber empowerment line is describing this exact pattern.',
            },
            {
              id: 'P3Q2D4',
              assertion:
                'Chris should add a traditional stage-gate between every Sprint because the PAQ has Red items.',
              reason:
                'Red PAQ items are resolved by tailoring AgilePM, not by installing a second lifecycle.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P3Q2D5',
              assertion:
                'Volunteer evening-only availability should be recorded and mitigated rather than ignored because the overall PAQ looks “mostly Green”.',
              reason:
                'A single unmet PAQ line can still threaten an increment if that role is how foyer decisions get made.',
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
            'Answer the following questions about requirements, backlogs and estimating on HouseLight. Choose one option from A to D.',
          extra: null,
          items: [
            {
              id: 'P3Q3A1',
              q: 'Which hierarchy correctly describes how HouseLight work should be organised?',
              options: [
                'A. A project outcome and goals, a Solution/Product Backlog, increment slices, then Sprint Backlogs',
                'B. A single Sprint Backlog that lists every donor-portal field until September',
                'C. Only a Gantt chart — backlogs are not used with AgilePM',
                'D. A Benefits Assessment that replaces all backlogs after Foundations',
              ],
              correct:
                'A. A project outcome and goals, a Solution/Product Backlog, increment slices, then Sprint Backlogs',
              explain:
                'v3 organises work as goals / solution / increments / sprint-level items, with detail rising as the horizon nears.',
            },
            {
              id: 'P3Q3A2',
              q: 'When should Lantern write field-level validation rules for the Increment 2 donor portal?',
              options: [
                'A. In Pre-Project, before the grant is accepted',
                'B. In Foundations, for every future increment',
                'C. At the last responsible moment — typically the Sprint that will build that slice',
                'D. After first night, so donors can invent the rules live',
              ],
              correct:
                'C. At the last responsible moment — typically the Sprint that will build that slice',
              explain:
                'Detailed analysis is deferred until it is about to be used. The donor portal is Increment 2.',
            },
            {
              id: 'P3Q3A3',
              q: 'Which estimate style is appropriate in Foundations for HouseLight?',
              options: [
                'A. Hour-level estimates for every donor-portal field',
                'B. High-level estimates good enough to shape increments and test the £620k / 4 July box',
                'C. No estimates at all, because agile forbids numbers',
                'D. A fixed-price quote for festival analytics to two decimal places',
              ],
              correct:
                'B. High-level estimates good enough to shape increments and test the £620k / 4 July box',
              explain:
                'Estimating matches the lifecycle phase: coarse in Foundations, finer in Sprint Planning.',
            },
            {
              id: 'P3Q3A4',
              q: 'Season-pass renewals are Should Have for Increment 1. What does that mean if Lantern is running out of time?',
              options: [
                'A. Renewals must still ship or the increment has failed',
                'B. Renewals can be dropped from Increment 1 without failing the Minimum Usable Subset',
                'C. Renewals become a Must Have automatically in week 6',
                'D. Renewals cannot be started until Increment 3',
              ],
              correct:
                'B. Renewals can be dropped from Increment 1 without failing the Minimum Usable Subset',
              explain:
                'Should Haves are intended contingency. The increment still succeeds if Musts (safe book / pay / collect and gift-aid join) are done.',
            },
            {
              id: 'P3Q3A5',
              q: 'Who should confirm that a requirement labelled Must Have really is a Must for the project?',
              options: [
                'A. Any developer who likes the feature',
                'B. Tidal’s account manager',
                'C. The Business Visionary, using the “would we cancel without it?” test, with the team challenging false Musts',
                'D. The Workshop Facilitator acting alone',
              ],
              correct:
                'C. The Business Visionary, using the “would we cancel without it?” test, with the team challenging false Musts',
              explain:
                'Malik owns the outcome. The whole team should challenge inflated Musts. Facilitators do not own priority.',
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
              id: 'P3Q3B1',
              q: 'Which 2 statements correctly apply MoSCoW at increment level for HouseLight?',
              options: [
                'A. A requirement can be Should Have for Increment 1 and Must Have for the whole project',
                'B. The volunteer shift-swap board can be Could Have now even if it is wanted later',
                'C. Increment-level MoSCoW must copy project-level MoSCoW exactly',
                'D. Won’t Have this time is not a permitted priority',
                'E. Must Have at increment level means “nice to have if someone is free”',
              ],
              correct: [
                'A. A requirement can be Should Have for Increment 1 and Must Have for the whole project',
                'B. The volunteer shift-swap board can be Could Have now even if it is wanted later',
              ],
              explain:
                'Priorities are timeframe-specific. House-foundations logic: what is Must for the finished house may not be Must for increment one.',
            },
            {
              id: 'P3Q3B2',
              q: 'Which 2 estimating behaviours fit Sprint Planning for Lantern in Increment 1?',
              options: [
                'A. The people who will do the work forecast the Sprint Backlog',
                'B. Estimates get more precise because the stories are about to be built',
                'C. Chris issues hour targets the night before and forbids discussion',
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
              id: 'P3Q3B3',
              q: 'Using the additional information, which 2 backlog decisions are appropriate in week 6?',
              options: [
                'A. Keep festival Must Haves first — three of five done is not yet a usable subset',
                'B. Start souvenir-shop stories immediately because trustees asked',
                'C. Season-pass renewals can remain Should Have and be dropped if the PCI window consumes the last Sprint',
                'D. Re-label every unfinished item as Must Have so nobody can drop it',
                'E. Freeze the Product Backlog so Hannah cannot reorder anything',
              ],
              correct: [
                'A. Keep festival Must Haves first — three of five done is not yet a usable subset',
                'C. Season-pass renewals can remain Should Have and be dropped if the PCI window consumes the last Sprint',
              ],
              explain:
                'Protect the Minimum Usable Subset. Use Should Haves as the valve when a constraint appears.',
            },
            {
              id: 'P3Q3B4',
              q: 'Which 2 items belong in a Solution/Product Backlog rather than only in a personal notebook?',
              options: [
                'A. Book / pay / collect against festival shows',
                'B. Priya’s PCI assessment spike',
                'C. Chris’s private reminder to buy interval ice-cream',
                'D. Elena’s holiday dates with no project impact',
                'E. A rumour about a rival venue’s app',
              ],
              correct: [
                'A. Book / pay / collect against festival shows',
                'B. Priya’s PCI assessment spike',
              ],
              explain:
                'Backlogs hold the work of the project — outcomes, stories, spikes — not trivia.',
            },
            {
              id: 'P3Q3B5',
              q: 'Which 2 statements about the Minimum Usable Subset are correct for Increment 1?',
              options: [
                'A. If the foyer cannot book, pay and collect safely with a gift-aid join, the increment has not delivered its Musts',
                'B. Season-pass renewals are not required for the increment to succeed',
                'C. Festival-year analytics is part of the Increment 1 Minimum Usable Subset',
                'D. The Minimum Usable Subset is whatever remains on the last day',
                'E. Could Haves are included in the Minimum Usable Subset by definition',
              ],
              correct: [
                'A. If the foyer cannot book, pay and collect safely with a gift-aid join, the increment has not delivered its Musts',
                'B. Season-pass renewals are not required for the increment to succeed',
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
              id: 'P3Q3C1',
              q: 'A range of £580k–£650k and “about three increments before and after 4 July” used to accept the grant.',
              correct: 'A',
              explain: 'Coarse numbers to decide whether to start — Pre-Project.',
            },
            {
              id: 'P3Q3C2',
              q: 'Increment 1 = festival book/pay/collect and gift-aid join; Increment 2 = renewals and donor portal; Increment 3 = analytics.',
              correct: 'C',
              explain: 'Slicing outcomes across increments is increment planning.',
            },
            {
              id: 'P3Q3C3',
              q: 'Task-level forecast for the two join-and-audit stories Lantern will finish this Sprint.',
              correct: 'D',
              explain: 'Sprint Planning is where detailed estimates belong.',
            },
            {
              id: 'P3Q3C4',
              q: 'A high-level Solution Architecture Definition and a first-cut Prioritised Requirements List.',
              correct: 'B',
              explain: 'Those are Foundations work-products, still high-level.',
            },
            {
              id: 'P3Q3C5',
              q: 'Did gift-aid claim rejections fall in the tax year after the donor portal went live?',
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
              id: 'P3Q3D1',
              assertion:
                'Hannah should reorder the Increment 1 backlog so the remaining festival Musts beat season-pass renewals.',
              reason:
                'MoSCoW exists so lower-priority work yields when a timebox is under pressure.',
              correct: 'A',
              explain: 'Both true and linked — that is the point of Should Have renewals.',
            },
            {
              id: 'P3Q3D2',
              assertion:
                'Detailed donor-portal fields should now be specified because trustees asked in week 6.',
              reason:
                'Detailed analysis is done at the last responsible moment for the increment that will build that slice.',
              correct: 'D',
              explain: 'Assertion false (the donor portal is Increment 2). Reason true.',
            },
            {
              id: 'P3Q3D3',
              assertion:
                'The 9 June PCI window should be treated as Increment 1 work that may displace Should Haves.',
              reason:
                'A Must Have integration constraint inside the increment consumes the same timebox as other Increment 1 work.',
              correct: 'A',
              explain: 'Both true — the gateway is in the box; season-pass may lose.',
            },
            {
              id: 'P3Q3D4',
              assertion:
                'Tidal is right to have produced no Increment 1 increment while waiting for a commercial policy.',
              reason:
                'A Should Have may be deferred, but a team should still pursue any Must Have work in its backlog.',
              correct: 'D',
              explain:
                'Assertion over-states the freeze. Reason true — they should not idle if Musts remain.',
            },
            {
              id: 'P3Q3D5',
              assertion:
                'Three of five Must Have stories done means Increment 1 has already met its Minimum Usable Subset.',
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
            'Answer the following questions about planning, control and compliance on HouseLight. Choose one option from A to D.',
          extra: extraIncrement1,
          items: [
            {
              id: 'P3Q4A1',
              q: 'Which planning artefact should Chris keep current for Elena while Lantern and Tidal are in Sprints?',
              options: [
                'A. A high-level Delivery Plan plus increment goals, not a task-level Gantt through first night',
                'B. A daily 400-line plan that assigns every volunteer hour',
                'C. No plan — agile means improvisation only',
                'D. A Benefits Assessment that replaces the Delivery Plan in week 1',
              ],
              correct:
                'A. A high-level Delivery Plan plus increment goals, not a task-level Gantt through first night',
              explain:
                'Planning stays appropriate to horizon: increment-level for the project, Sprint Backlogs for the teams.',
            },
            {
              id: 'P3Q4A2',
              q: 'How should Lantern and Tidal handle a shared dependency on Priya’s PCI assessment window?',
              options: [
                'A. Never discuss it — each team “self-manages” in isolation',
                'B. Surface it in a multi-team planning event and sequence Sprint goals around the June fortnight',
                'C. Ask Elena to complete the PCI pack on Sundays',
                'D. Duplicate the gateway in both teams with no shared design',
              ],
              correct:
                'B. Surface it in a multi-team planning event and sequence Sprint goals around the June fortnight',
              explain:
                'v3 expects Scrum to be tailored with a project-level planning event for cross-team dependencies.',
            },
            {
              id: 'P3Q4A3',
              q: 'What is the most appropriate control if week-6 rehearsal shows 3 of 5 Musts done and the PCI slice untouched?',
              options: [
                'A. Declare Increment 1 failed and stop the project',
                'B. Inspect the increment goal, drop or defer season-pass renewals, and concentrate both teams on the remaining Musts and the gateway',
                'C. Extend the increment by five weeks as the trustees asked',
                'D. Replace Sprint Reviews with a written apology',
              ],
              correct:
                'B. Inspect the increment goal, drop or defer season-pass renewals, and concentrate both teams on the remaining Musts and the gateway',
              explain:
                'Control means respond to what the increment is telling you — inside the timebox, using priority.',
            },
            {
              id: 'P3Q4A4',
              q: 'How should the PCI evidence pack for the gateway be handled so agility and compliance both survive?',
              options: [
                'A. Ignore PCI because the project is agile',
                'B. Treat the evidence pack as a work-product with acceptance criteria and pull it into a Sprint before live card data is used',
                'C. Complete every conceivable finance document for Increments 2 and 3 in Foundations',
                'D. Wait until after first night and hope for retrospective approval',
              ],
              correct:
                'B. Treat the evidence pack as a work-product with acceptance criteria and pull it into a Sprint before live card data is used',
              explain:
                'Regulatory work is planned and done just in time, not skipped and not front-loaded for the whole programme.',
            },
            {
              id: 'P3Q4A5',
              q: 'How does financial governance on HouseLight differ from a traditional fixed-scope project?',
              options: [
                'A. Time and cost are fixed; scope is the variable that protects the business case',
                'B. Scope is fixed; time and cost expand until every trustee request is built',
                'C. There is no financial governance on agile charity projects',
                'D. Elena must approve every story’s cost to the nearest pound mid-Sprint',
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
              id: 'P3Q4B1',
              q: 'Which 2 events give Elena enough control without a weekly 40-page report?',
              options: [
                'A. Increment Reviews with a working foyer rehearsal',
                'B. A short, visible Delivery Plan and risk commentary',
                'C. Daily personal status emails from every developer to Elena',
                'D. Cancelling Sprint Reviews so nothing incomplete is seen',
                'E. A benefits audit in week 2 of Foundations',
              ],
              correct: [
                'A. Increment Reviews with a working foyer rehearsal',
                'B. A short, visible Delivery Plan and risk commentary',
              ],
              explain:
                'Demonstrate Control with working software and a thin, honest plan — not theatre or hidden work.',
            },
            {
              id: 'P3Q4B2',
              q: 'Which 2 tailoring actions help one internal Scrum team and one vendor team stay one AgilePM project?',
              options: [
                'A. Shared increment goals set with Malik and Priya',
                'B. A dependency board reviewed in the multi-team planning event',
                'C. Separate visions that contradict each other',
                'D. Different accessibility bars in each team’s Definition of Done',
                'E. No Product Owner because Chris will write every story',
              ],
              correct: [
                'A. Shared increment goals set with Malik and Priya',
                'B. A dependency board reviewed in the multi-team planning event',
              ],
              explain:
                'Multi-team control is shared goals plus explicit dependency management.',
            },
            {
              id: 'P3Q4B3',
              q: 'Which 2 statements about tracking in a Sprint timebox are appropriate?',
              options: [
                'A. Daily Scrum inspects whether the Sprint Goal is still in reach',
                'B. Unfinished Should Haves can leave the Sprint without failing Increment 1 if Musts remain on track',
                'C. Progress is reported only as percentage of documents signed',
                'D. Once a Sprint starts, no one may mention a new PCI date',
                'E. Tracking is the clerk’s job and teams should not look at the board',
              ],
              correct: [
                'A. Daily Scrum inspects whether the Sprint Goal is still in reach',
                'B. Unfinished Should Haves can leave the Sprint without failing Increment 1 if Musts remain on track',
              ],
              explain:
                'Inspect and adapt inside the Sprint; increment success is the Must Have set, not every Should.',
            },
            {
              id: 'P3Q4B4',
              q: 'Which 2 work-products support regulatory compliance without destroying agility?',
              options: [
                'A. A PCI evidence pack sized to the gateway slice, built inside a Sprint',
                'B. An auditable gift-aid history on membership joins (already a Must Have quality attribute)',
                'C. A 200-page compliance strategy covering features that will not exist for a year',
                'D. Verbal finance approval with no record',
                'E. Deleting card logs after each Sprint to “stay lightweight”',
              ],
              correct: [
                'A. A PCI evidence pack sized to the gateway slice, built inside a Sprint',
                'B. An auditable gift-aid history on membership joins (already a Must Have quality attribute)',
              ],
              explain:
                'Just-enough, just-in-time evidence. Quality attributes that are Musts stay in the solution.',
            },
            {
              id: 'P3Q4B5',
              q: 'Which 2 responses to the trustees’ five-week extension request demonstrate control?',
              options: [
                'A. Keep 4 July; offer the souvenir shop a place in a later increment with a visible date',
                'B. Explain that extra scope is paid for by dropping Should/Could, not by stretching time',
                'C. Agree the extension quietly so Elena is not worried',
                'D. Cancel Increment Reviews until the souvenir shop is also live',
                'E. Declare WCAG optional so everything fits',
              ],
              correct: [
                'A. Keep 4 July; offer the souvenir shop a place in a later increment with a visible date',
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
              id: 'P3Q4C1',
              q: 'Chris convenes a two-hour increment planning event so Lantern, Tidal and Priya sequence the June PCI window.',
              correct: 'C',
              explain: 'That is the multi-team planning tailoring v3 expects.',
            },
            {
              id: 'P3Q4C2',
              q: 'Elena is shown a working foyer rehearsal and a one-page increment forecast, not a 40-page pack.',
              correct: 'B',
              explain: 'Tracking by working solution plus a thin forecast is Demonstrate Control.',
            },
            {
              id: 'P3Q4C3',
              q: 'The Delivery Plan still shows three increments and a fixed 4 July Increment 1 date.',
              correct: 'A',
              explain: 'Horizon-appropriate planning, dates held.',
            },
            {
              id: 'P3Q4C4',
              q: 'Live card data cannot be used until the PCI evidence story meets its acceptance criteria.',
              correct: 'D',
              explain: 'Compliance integrated as real work, not a side process.',
            },
            {
              id: 'P3Q4C5',
              q: 'Chris agrees the five-week extension in a corridor so the souvenir shop can join Increment 1.',
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
              id: 'P3Q4D1',
              assertion:
                'Chris should keep the increment timebox and publish a revised feature forecast that drops or slips season-pass renewals.',
              reason:
                'In AgilePM, control is exercised by changing scope inside a fixed time and cost box.',
              correct: 'A',
              explain: 'Both true and the reason is why the assertion is the right control action.',
            },
            {
              id: 'P3Q4D2',
              assertion:
                'Tidal should stay idle until the finance committee finishes its commercial policy.',
              reason:
                'Teams demonstrate control by progressing Must Have work and making blockers visible.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P3Q4D3',
              assertion:
                'The 9 June PCI date should appear on the shared dependency board before the next multi-team planning event.',
              reason:
                'Cross-team dependencies are controlled by making them explicit in project-level planning, not inside one team’s private chat.',
              correct: 'A',
              explain: 'Both true and linked.',
            },
            {
              id: 'P3Q4D4',
              assertion:
                'Elena should receive the week-6 rehearsal as evidence of progress even though two Musts remain.',
              reason:
                'A working solution that is not yet complete is still a better control signal than a status report about documents.',
              correct: 'A',
              explain: 'Both true — incomplete working software is still the primary measure.',
            },
            {
              id: 'P3Q4D5',
              assertion:
                'Financial governance requires Chris to request another £80k so the souvenir shop can join Increment 1.',
              reason:
                'AgilePM financial governance holds the cost box and asks which features no longer fit.',
              correct: 'D',
              explain: 'Assertion false (do not bust the grant envelope for extra scope). Reason true.',
            },
          ],
        },
      ],
    },
  ],
}
