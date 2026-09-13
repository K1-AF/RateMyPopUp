// Original Practitioner Paper 4 — Solara Borough Council.
// Official 80-line booklet layout. Not copied from any APMG sample.

const scenario = {
  title: 'Project Scenario — Solara Borough Council',
  sections: [
    {
      heading: 'The organisation',
      body: 'Solara Borough Council is a coastal unitary authority. Environment and Highways still issue resident parking permits, skip licences and garden-waste subscriptions through CivicRecord, a 14-year-old CRM, plus email attachments and a contact-centre script. Officers cannot always show who granted a skip. Residents on the phone wait twenty minutes. The Public Sector Bodies Accessibility Regulations apply to any new public form. Information Governance must evidence retention and FOI handling. Cabinet has already committed to a statutory permit-and-waste return to the regulator on 31 March.',
    },
    {
      heading: 'The project',
      body: 'Project name: PermitPath. Outcome required: a live digital permit service that residents can complete without phoning, that officers can grant or refuse with an audit trail, and that can produce the 31 March statutory extract. The first increment must be in service before that date so the return is not assembled from CivicRecord spreadsheets. Total cost is fixed at £860k from the transformation fund. Calendar time to the statutory date is fixed. Accessibility (WCAG 2.2 AA) and an auditable decision history are treated as fixed quality. Features will be prioritised with MoSCoW.\n\nTwo Scrum delivery teams will work in two-week Sprints: Citizen (public apply / pay / evidence) and Officer (assessment, audit and statutory reporting). A shared Solution Architect owns technical integrity across both Product Backlogs. PermitPath is the Council’s first AgilePM project.',
    },
    {
      heading: 'Named roles',
      body: 'Business Sponsor: Kate Morel, Director of Environment — funds the project from the transformation envelope and chairs the programme board.\nBusiness Visionary: Ben Idris, Head of Highways — owns the business vision and Must Have outcome.\nProject Manager: Sofia Novak — enables delivery, planning and control across both teams.\nSolution Architect: Ravi Chand.\nProduct Owner: Lila Hart, service designer.\nBusiness Ambassador: Paul Okon, contact-centre lead, full-time with Citizen.\nBusiness Advisor: Nia Cole, Information Governance.\nWorkshop Facilitator: used when Sofia is not the right independent chair.\nScrum Masters: one per delivery team.',
    },
    {
      heading: 'Constraints and known issues',
      body: 'CivicRecord’s vendor will only open a two-week extract API window from 10 March. Several elected members want every permit type live on 31 March and have asked for a signed specification before any Sprint starts. Nia has said no live personal data may leave CivicRecord until retention and FOI rules for that slice are written down. Kate will not move the 31 March date or increase the £860k envelope.',
    },
    {
      heading: 'Outline delivery',
      body: 'Increment 1 (to 31 March): resident parking apply / renew / evidence, officer grant or refuse with audit, and the statutory parking extract. Skip licences are Should Have. Garden-waste subscriptions are Could Have.\nIncrement 2: skip licences and on-site inspection notes.\nIncrement 3: garden-waste subscriptions and a cabinet dashboard.\nA high-level Delivery Plan exists. Fine detail is left for Sprint Planning. Foundations lasted three weeks and produced a Prioritised Requirements List, Solution Architecture Definition, and a Project Approach Questionnaire that flagged first-time agile working, elected members’ preference for a single big-bang go-live, and FOI / retention decisions sitting on a monthly Information Governance board.',
    },
  ],
}

const extraIncrement1 = {
  title: 'Additional information — mid Increment 1',
  body: 'Week 6 of Increment 1. Citizen has finished 3 of 5 Must Have parking stories and has a working apply / renew / evidence pilot on the rehearsal environment. Officer has not started the statutory extract because Lila is waiting for a “full data-warehouse strategy” from corporate ICT. Two councillors have asked Sofia to extend Increment 1 by six weeks so skip licences can join the same go-live. Ravi has found that the CivicRecord extract API will not be available until 10 March — inside the last Sprint of Increment 1. Paul is being pulled back to the contact centre three mornings a week.',
}

const extraPaq = {
  title: 'Additional information — Project Approach Questionnaire extracts',
  body: 'PAQ statements the team marked Amber or Red in Foundations:\n1. Business roles can be made available at the level the project needs — Amber (Paul and the parking officers can offer three mornings after week 6).\n2. The solution can be delivered incrementally — Amber (several members still want all three permit types on 31 March).\n3. Requirements can be prioritised and the Must Have set kept to a genuine Minimum Usable Subset — Amber (skip and garden waste are still being called Must for March).\n4. The wider organisation understands that detailed specifications will emerge — Red (this is the Council’s first agile project; members issued a 70-page specification as a committee appendix).\n5. Empowered teams can make day-to-day decisions — Amber (FOI and retention sign-off currently sits on Nia’s monthly IG board).',
}

export const PRACTITIONER_PAPER_4 = {
  id: 'pract4',
  title: 'Practitioner Paper 4',
  project: 'Solara Borough Council — PermitPath',
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
            'Answer the following questions about balancing Time, Cost, Quality and Features on PermitPath. Choose one option from A to D for each question.',
          extra: null,
          items: [
            {
              id: 'P4Q1A1',
              q: 'Kate has locked the 31 March statutory date and the £860k transformation-fund envelope, and has told the teams that WCAG 2.2 AA and an auditable officer decision will not be traded. Which variable should PermitPath treat as the primary contingency?',
              options: [
                'A. Time — slip the statutory return if parking screens are unfinished',
                'B. Cost — raise a supplementary capital bid whenever a Should Have is at risk',
                'C. Quality — drop accessibility checks in the last Sprint to protect scope',
                'D. Features — vary scope through MoSCoW so the Minimum Usable Subset still fits the box',
              ],
              correct:
                'D. Features — vary scope through MoSCoW so the Minimum Usable Subset still fits the box',
              explain:
                'AgilePM fixes time, cost and quality, and uses variable features (MoSCoW) as contingency for VUCA.',
            },
            {
              id: 'P4Q1A2',
              q: 'Councillor Hale argues that “accessibility can flex a little” so skip licences can join the 31 March go-live. According to AgilePM, why is that the wrong contingency?',
              options: [
                'A. Quality is never discussed after Foundations',
                'B. Never Compromise Quality — agreed accessibility and audit standards stay fixed; scope flexes instead',
                'C. Only the Solution Architect may reduce quality, and only in Deployment',
                'D. Quality may flex if the Business Sponsor signs a waiver for elected members',
              ],
              correct:
                'B. Never Compromise Quality — agreed accessibility and audit standards stay fixed; scope flexes instead',
              explain:
                'Principle 4 keeps agreed quality fixed. Contingency sits in features, not in dropping WCAG or the audit trail.',
            },
            {
              id: 'P4Q1A3',
              q: 'Which action best demonstrates Focus on the Business Need for PermitPath?',
              options: [
                'A. Citizen builds an animated borough mascot because a vendor demo looked civic-minded',
                'B. Ben restates that a live, accessible parking service and a lawful 31 March extract are the outcome that justifies the project',
                'C. Officer starts a cabinet vanity dashboard in Sprint 1 because members enjoy charts',
                'D. Sofia freezes every requirement so nothing can change after Foundations',
              ],
              correct:
                'B. Ben restates that a live, accessible parking service and a lawful 31 March extract are the outcome that justifies the project',
              explain:
                'Principle 1 keeps work aligned to the agreed business outcome, not to interesting extras.',
            },
            {
              id: 'P4Q1A4',
              q: 'Foundations lasted three weeks and left Sprint-level field rules for later. Which principle does that apply?',
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
              id: 'P4Q1A5',
              q: 'Which statement correctly describes how AgilePM uses the four framework elements on PermitPath?',
              options: [
                'A. Process, People, Project Artifacts and Practices, underpinned by common sense and pragmatism',
                'B. Process and People only — artifacts are banned on a first agile project',
                'C. Practices replace the need for any defined roles',
                'D. Project Artifacts are produced only after the statutory return is filed',
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
            'Each question contains options about PermitPath. Remember to select 2 answers to each question. Both must be correct to score the mark.',
          extra: null,
          items: [
            {
              id: 'P4Q1B1',
              q: 'Which 2 statements reflect an appropriate AgilePM response to CivicRecord’s two-week extract window from 10 March?',
              options: [
                'A. Treat the window as a hard timebox and pull only Must Have extract work into the Sprint that covers it',
                'B. Slip the 31 March statutory date as soon as the vendor names 10 March',
                'C. Collaborate with Ravi and the vendor so the extract is a visible backlog item with clear acceptance criteria',
                'D. Ignore the constraint until Deployment and hope the API appears',
                'E. Drop WCAG testing to make room for the extract',
              ],
              correct: [
                'A. Treat the window as a hard timebox and pull only Must Have extract work into the Sprint that covers it',
                'C. Collaborate with Ravi and the vendor so the extract is a visible backlog item with clear acceptance criteria',
              ],
              explain:
                'Deliver on Time and Collaborate. Do not move the increment end-date or trade quality to hide a known constraint.',
            },
            {
              id: 'P4Q1B2',
              q: 'Which 2 actions would put Principle 3 Collaborate into practice on PermitPath?',
              options: [
                'A. Paul remains full-time with Citizen so business decisions are made inside the Sprint',
                'B. Sofia writes every acceptance criterion alone so parking officers are not interrupted',
                'C. Ben and Ravi join Sprint Reviews so value and integrity are inspected together',
                'D. Nia only sees the product after 31 March to “avoid slowing the team”',
                'E. Officer is forbidden from talking to Citizen until Increment 3',
              ],
              correct: [
                'A. Paul remains full-time with Citizen so business decisions are made inside the Sprint',
                'C. Ben and Ravi join Sprint Reviews so value and integrity are inspected together',
              ],
              explain:
                'Collaboration needs empowered business and solution roles working together throughout, not after the fact.',
            },
            {
              id: 'P4Q1B3',
              q: 'Which 2 statements correctly describe contingency on a project that fixes time, cost and quality?',
              options: [
                'A. Should Have and Could Have features provide the buffer when estimates prove optimistic',
                'B. The Must Have set must still be a genuine Minimum Usable Subset',
                'C. Contingency is created by leaving accessibility undefined',
                'D. Contingency is created by hiding extra weeks after 31 March in a secret plan',
                'E. All three permit types must be Must Have for Increment 1 so nothing can be dropped',
              ],
              correct: [
                'A. Should Have and Could Have features provide the buffer when estimates prove optimistic',
                'B. The Must Have set must still be a genuine Minimum Usable Subset',
              ],
              explain:
                'MoSCoW contingency only works if Musts are truly musts and lower priorities can be dropped without failing the business case.',
            },
            {
              id: 'P4Q1B4',
              q: 'Which 2 statements about incremental delivery from firm foundations apply to PermitPath?',
              options: [
                'A. Parking going live in Increment 1 can deliver the statutory extract before skip and garden waste are ready',
                'B. Foundations should have specified every skip-licence field to pixel level',
                'C. A shared understanding of problem, solution and risk was the point of the three-week Foundations',
                'D. Incremental delivery is only allowed if the whole £860k is spent in month one',
                'E. Once Delivery starts, Foundations decisions can never be revisited',
              ],
              correct: [
                'A. Parking going live in Increment 1 can deliver the statutory extract before skip and garden waste are ready',
                'C. A shared understanding of problem, solution and risk was the point of the three-week Foundations',
              ],
              explain:
                'Early increments release value. Foundations stay high-level. They may be revisited between increments if the next slice needs a refreshed baseline.',
            },
            {
              id: 'P4Q1B5',
              q: 'Which 2 leadership behaviours would undermine AgilePM’s philosophy on PermitPath?',
              options: [
                'A. Kate withdraws empowerment and requires her sign-off on every Sprint story',
                'B. Ben clarifies the vision and then lets the teams inspect and adapt',
                'C. Sofia replaces Sprint Reviews with a quarterly slideshow so members are not “bothered”',
                'D. Ravi explains architectural constraints in planning so teams can make informed choices',
                'E. Paul spends his time with Citizen answering resident-journey questions as they arise',
              ],
              correct: [
                'A. Kate withdraws empowerment and requires her sign-off on every Sprint story',
                'C. Sofia replaces Sprint Reviews with a quarterly slideshow so members are not “bothered”',
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
            'Column 1 lists actions proposed on PermitPath. For each action, select from Column 2 the AgilePM principle it best applies. Each selection from Column 2 can be used once, more than once or not at all.',
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
              id: 'P4Q1C1',
              q: 'Sofia keeps a visible increment burndown and a short risk commentary for Kate’s programme board.',
              correct: 'E',
              explain: 'Demonstrate Control is about making progress and issues visible to those who need to govern the project.',
            },
            {
              id: 'P4Q1C2',
              q: 'Ben drops a live map of every skip in the borough from Increment 1 because it does not help the 31 March parking return.',
              correct: 'A',
              explain: 'Protecting the outcome that justified the project is Focus on the Business Need.',
            },
            {
              id: 'P4Q1C3',
              q: 'The increment end-date stays 31 March even though councillors ask for skip licences to be squeezed in.',
              correct: 'B',
              explain: 'Deliver on Time treats the timebox as immovable; scope changes instead.',
            },
            {
              id: 'P4Q1C4',
              q: 'WCAG 2.2 AA checks remain in the Definition of Done when Citizen is under pressure.',
              correct: 'C',
              explain: 'Never Compromise Quality keeps agreed standards inside Done.',
            },
            {
              id: 'P4Q1C5',
              q: 'Daily Scrum, an information radiator in the contact centre, and a two-page increment review pack replace a 40-page committee report.',
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
              id: 'P4Q1D1',
              assertion:
                'Sofia should refuse the six-week extension and keep skip licences out of Increment 1.',
              reason:
                'AgilePM fixes time for the increment and uses feature priority, not elapsed time, as the main contingency.',
              correct: 'A',
              explain:
                'Both true, and the reason is why the assertion is right: do not blow the statutory timebox to absorb extra scope.',
            },
            {
              id: 'P4Q1D2',
              assertion:
                'Lila is right to block all statutory-extract work until corporate ICT finish a full data-warehouse strategy.',
              reason:
                'A Should Have may be de-scoped from the increment if it does not fit, but it should not be used to freeze empowered teams.',
              correct: 'D',
              explain:
                'Assertion false — the extract is a Must Have for 31 March and can start with a just-enough spike. Reason true as a general MoSCoW rule.',
            },
            {
              id: 'P4Q1D3',
              assertion:
                'Paul being pulled back to the contact centre three mornings a week is an approach risk the PAQ already hinted at.',
              reason:
                'If empowered business roles are not actually available, day-to-day decisions slow and the project starts to behave like a traditional hand-off model.',
              correct: 'A',
              explain:
                'Both true and linked: availability of business roles is a classic Project Approach issue.',
            },
            {
              id: 'P4Q1D4',
              assertion:
                'Ravi should hide the 10 March API date from Kate until after the statutory return is filed.',
              reason:
                'Demonstrate Control requires risks that threaten the increment outcome to be made visible.',
              correct: 'D',
              explain:
                'Assertion false (hiding a critical constraint is the opposite of control). Reason true.',
            },
            {
              id: 'P4Q1D5',
              assertion:
                'Citizen having a working parking pilot on the rehearsal environment is the primary measure of progress for Increment 1.',
              reason:
                'Never Compromise Quality means accessibility tests stay in the Definition of Done.',
              correct: 'B',
              explain:
                'Both true, but the quality principle does not explain why a working rehearsal is the progress measure — that is about inspecting a working solution.',
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
            'Answer the following questions about risk and the Project Approach on PermitPath. Choose one option from A to D.',
          extra: extraPaq,
          items: [
            {
              id: 'P4Q2A1',
              q: 'Using the PAQ extract, which statement is VUCA-derived risk rather than approach-derived risk?',
              options: [
                'A. Members attached a 70-page specification to the committee appendix',
                'B. Paul can only offer three mornings a week after week 6',
                'C. A coastal storm floods pay-and-display machines and spikes temporary-permit demand the week after go-live',
                'D. Skip and garden waste are still being labelled Must Have for March',
              ],
              correct:
                'C. A coastal storm floods pay-and-display machines and spikes temporary-permit demand the week after go-live',
              explain:
                'The storm is environmental VUCA. The other three are how the Council is choosing to run the project (approach).',
            },
            {
              id: 'P4Q2A2',
              q: 'Which PAQ red item should Sofia tackle first to protect agility?',
              options: [
                'A. Replace Scrum with a detailed Gantt so members feel comfortable',
                'B. Explain to members that the appendix is a starting backlog, not a frozen specification, and keep Musts as a Minimum Usable Subset',
                'C. Delete the PAQ because a first agile project should not record approach risk',
                'D. Make every line in the 70-page appendix a Must Have for 31 March',
              ],
              correct:
                'B. Explain to members that the appendix is a starting backlog, not a frozen specification, and keep Musts as a Minimum Usable Subset',
              explain:
                'The red PAQ item is organisational misunderstanding of emergent detail. Fix the approach; do not abandon agility.',
            },
            {
              id: 'P4Q2A3',
              q: 'Why can a disciplined AgilePM approach reduce the need for a separate traditional risk process?',
              options: [
                'A. First agile projects have no risks',
                'B. Short increments, visible progress, empowered roles and the PAQ surface and mitigate risk inside everyday management',
                'C. Only Democratic Services may record risks, so the team should not try',
                'D. Risk is transferred entirely to the CivicRecord vendor',
              ],
              correct:
                'B. Short increments, visible progress, empowered roles and the PAQ surface and mitigate risk inside everyday management',
              explain:
                'AgilePM’s built-in controls deal with most risk when applied with discipline. A duplicate bureaucracy is usually unnecessary.',
            },
            {
              id: 'P4Q2A4',
              q: 'Nia’s monthly IG board is the only path for FOI and retention decisions. What is the most appropriate tailoring?',
              options: [
                'A. Remove Information Governance from the project to go faster',
                'B. Keep the monthly board and accept that no retention decision can occur inside a Sprint',
                'C. Bring Nia (or a deputy with authority) into the team cadence so compliance decisions happen at Sprint pace',
                'D. Let Citizen invent a retention schedule without IG',
              ],
              correct:
                'C. Bring Nia (or a deputy with authority) into the team cadence so compliance decisions happen at Sprint pace',
              explain:
                'Tailor the approach so the needed authority sits with the team, not a monthly queue that recreates waterfall gates.',
            },
            {
              id: 'P4Q2A5',
              q: 'Which response correctly uses the PAQ rather than treating it as a one-off scorecard?',
              options: [
                'A. Revisit Amber/Red items when increment plans change or new approach risks appear',
                'B. File the PAQ with Democratic Services and never look at it again',
                'C. Change Green items to Red so Cabinet stays frightened',
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
              id: 'P4Q2B1',
              q: 'Which 2 actions would mitigate the Amber business-availability risk around Paul and the parking officers?',
              options: [
                'A. Agree a named deputy Ambassador with decision rights on the mornings Paul is on the phones',
                'B. Delay all parking analysis until Increment 3 “when the contact centre is quiet” with no plan',
                'C. Timebox parking workshops in Foundations/early Delivery and protect those slots',
                'D. Require every parking officer to attend every Daily Scrum in the chamber',
                'E. Convert parking to a waterfall workstream so they do not need an Ambassador',
              ],
              correct: [
                'A. Agree a named deputy Ambassador with decision rights on the mornings Paul is on the phones',
                'C. Timebox parking workshops in Foundations/early Delivery and protect those slots',
              ],
              explain:
                'Make the role real: authority plus protected time. Do not invent a second lifecycle or abandon the service.',
            },
            {
              id: 'P4Q2B2',
              q: 'Which 2 statements correctly distinguish VUCA-derived risk from approach-derived risk on PermitPath?',
              options: [
                'A. A cyber incident at the payment gateway is largely environmental / VUCA',
                'B. Labelling skip and garden waste as Must Have for March is approach-derived',
                'C. All risks on a first agile project are approach-derived',
                'D. VUCA risks cannot be discussed in Foundations',
                'E. Approach risk is only recorded after the statutory return is filed',
              ],
              correct: [
                'A. A cyber incident at the payment gateway is largely environmental / VUCA',
                'B. Labelling skip and garden waste as Must Have for March is approach-derived',
              ],
              explain:
                'VUCA comes from the environment. Approach risk comes from how we choose to run the project.',
            },
            {
              id: 'P4Q2B3',
              q: 'Which 2 PAQ-related actions would Sofia take if members keep inflating Must Haves?',
              options: [
                'A. Facilitate a MoSCoW challenge: “If this is missing, do we cancel PermitPath?”',
                'B. Ask Ben to own the Must Have set as the Minimum Usable Subset',
                'C. Accept every Must so no councillor is upset',
                'D. Move the 31 March date to make room for every permit type',
                'E. Delete Should Haves from the language of the project',
              ],
              correct: [
                'A. Facilitate a MoSCoW challenge: “If this is missing, do we cancel PermitPath?”',
                'B. Ask Ben to own the Must Have set as the Minimum Usable Subset',
              ],
              explain:
                'The Visionary owns the outcome. Musts that fail the cancel-the-project test are not Musts.',
            },
            {
              id: 'P4Q2B4',
              q: 'Which 2 statements describe appropriate use of AgilePM instead of adding a parallel RAID bureaucracy?',
              options: [
                'A. Increment Reviews and the Delivery Plan already expose threats to the 31 March outcome',
                'B. A short, living risk commentary can sit with the plan without a second process',
                'C. A 40-page corporate risk register updated monthly replaces Sprint Reviews',
                'D. Risks may only be spoken in Cabinet, never in Daily Scrums',
                'E. The PAQ is discarded once Delivery starts',
              ],
              correct: [
                'A. Increment Reviews and the Delivery Plan already expose threats to the 31 March outcome',
                'B. A short, living risk commentary can sit with the plan without a second process',
              ],
              explain:
                'Discipline inside AgilePM is the risk process. Extra theatre is optional, not required.',
            },
            {
              id: 'P4Q2B5',
              q: 'Which 2 tailoring choices would reduce first-time multi-team approach risk on PermitPath?',
              options: [
                'A. A regular multi-team planning event so Citizen and Officer sequence shared work',
                'B. Ravi holds a single Solution Architecture Definition both teams respect',
                'C. Each team invents its own Definition of Done with no shared accessibility bar',
                'D. Ban the teams from talking to each other to reduce meetings',
                'E. Give Sofia both Scrum Master roles so nobody else leads',
              ],
              correct: [
                'A. A regular multi-team planning event so Citizen and Officer sequence shared work',
                'B. Ravi holds a single Solution Architecture Definition both teams respect',
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
            'For each PermitPath observation in Column 1, select from Column 2 the best description. Each selection can be used once, more than once or not at all.',
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
              id: 'P4Q2C1',
              q: 'A regional power cut takes the citizen portal offline on go-live morning.',
              correct: 'A',
              explain: 'External shock — VUCA, not a choice about how the project is run.',
            },
            {
              id: 'P4Q2C2',
              q: 'Members treat the 70-page appendix as an unchangeable specification and demand one big-bang go-live.',
              correct: 'B',
              explain: 'That is an organisational way-of-working choice: approach risk.',
            },
            {
              id: 'P4Q2C3',
              q: 'Sofia and Ben walk the Amber/Red PAQ lines in the increment planning event and agree mitigations.',
              correct: 'C',
              explain: 'Using the PAQ to shape the approach is what it is for.',
            },
            {
              id: 'P4Q2C4',
              q: 'The PMO files the PAQ as a completed checklist and forbids anyone to change a rating.',
              correct: 'D',
              explain: 'A frozen scorecard is not how the questionnaire is meant to work.',
            },
            {
              id: 'P4Q2C5',
              q: 'Kate’s favourite biscuits are out of stock in the programme-board room.',
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
              id: 'P4Q2D1',
              assertion:
                'The Amber rating on “requirements can be prioritised” is an approach risk Sofia should treat as active.',
              reason:
                'If Must Haves are not a genuine Minimum Usable Subset, the increment cannot use features as contingency.',
              correct: 'A',
              explain: 'Both true and connected — that is exactly why the PAQ line matters.',
            },
            {
              id: 'P4Q2D2',
              assertion:
                'An Amber rating on incremental delivery means Sofia can skip increment planning and run one big-bang release on 31 March.',
              reason:
                'An Amber PAQ line means the principle is at risk; it does not replace planning and control artifacts.',
              correct: 'D',
              explain: 'Assertion false — Amber on incremental delivery is a reason to plan increments more visibly, not abandon them. Reason true.',
            },
            {
              id: 'P4Q2D3',
              assertion:
                'Empowered day-to-day decisions cannot exist while FOI and retention need a monthly IG board.',
              reason:
                'Authority that sits outside the team cadence recreates a gated approach even if the team is called agile.',
              correct: 'A',
              explain: 'Both true — the Amber empowerment line is describing this exact pattern.',
            },
            {
              id: 'P4Q2D4',
              assertion:
                'The Red item on emergent detail should stay visible on Kate’s programme board.',
              reason:
                'The PAQ is discarded once Delivery starts.',
              correct: 'C',
              explain: 'Assertion true — first-agile misunderstanding remains a live approach risk. Reason false — the PAQ is revisited, not filed and forgotten.',
            },
            {
              id: 'P4Q2D5',
              assertion:
                'Paul’s three-morning offer should be recorded and mitigated rather than ignored because the overall PAQ looks “mostly Green”.',
              reason:
                'A single unmet PAQ line can still threaten an increment if that role is in the current slice of scope.',
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
            'Answer the following questions about requirements, backlogs and estimating on PermitPath. Choose one option from A to D.',
          extra: null,
          items: [
            {
              id: 'P4Q3A1',
              q: 'Which hierarchy correctly describes how PermitPath work should be organised?',
              options: [
                'A. A project outcome and goals, a Solution/Product Backlog, increment slices, then Sprint Backlogs',
                'B. A single Sprint Backlog that lists every skip-licence field until 31 March',
                'C. Only a Gantt chart — backlogs are not used with AgilePM',
                'D. A Benefits Assessment that replaces all backlogs after Foundations',
              ],
              correct:
                'A. A project outcome and goals, a Solution/Product Backlog, increment slices, then Sprint Backlogs',
              explain:
                'v3 organises work as goals / solution / increments / sprint-level items, with detail rising as the horizon nears.',
            },
            {
              id: 'P4Q3A2',
              q: 'When should Citizen write field-level validation rules for the skip-licence cutover?',
              options: [
                'A. In Pre-Project, before the transformation fund is agreed',
                'B. In Foundations, for every future increment',
                'C. At the last responsible moment — typically the Sprint that will build that slice',
                'D. After Deployment, so residents can invent the rules live',
              ],
              correct:
                'C. At the last responsible moment — typically the Sprint that will build that slice',
              explain:
                'Detailed analysis is deferred until it is about to be used. Skip licences are Increment 2 unless they survive as Should Have work.',
            },
            {
              id: 'P4Q3A3',
              q: 'Which estimate style is appropriate in Foundations for PermitPath?',
              options: [
                'A. Hour-level estimates for every garden-waste field',
                'B. High-level estimates good enough to shape increments and test the £860k / 31 March box',
                'C. No estimates at all, because agile forbids numbers in local government',
                'D. A fixed-price quote for the cabinet dashboard to two decimal places',
              ],
              correct:
                'B. High-level estimates good enough to shape increments and test the £860k / 31 March box',
              explain:
                'Estimating matches the lifecycle phase: coarse in Foundations, finer in Sprint Planning.',
            },
            {
              id: 'P4Q3A4',
              q: 'Skip licences are Should Have for Increment 1. What does that mean if Citizen is running out of time?',
              options: [
                'A. Skip licences must still ship or the increment has failed',
                'B. Skip licences can be dropped from Increment 1 without failing the Minimum Usable Subset',
                'C. Skip licences become a Must Have automatically in week 6',
                'D. Skip licences cannot be started until Increment 3',
              ],
              correct:
                'B. Skip licences can be dropped from Increment 1 without failing the Minimum Usable Subset',
              explain:
                'Should Haves are intended contingency. The increment still succeeds if Musts (safe parking apply/renew/evidence, officer decision, statutory extract) are done.',
            },
            {
              id: 'P4Q3A5',
              q: 'Who should confirm that a requirement labelled Must Have really is a Must for the project?',
              options: [
                'A. Any developer who likes the feature',
                'B. The CivicRecord vendor',
                'C. The Business Visionary, using the “would we cancel without it?” test, with the team challenging false Musts',
                'D. The Workshop Facilitator acting alone',
              ],
              correct:
                'C. The Business Visionary, using the “would we cancel without it?” test, with the team challenging false Musts',
              explain:
                'Ben owns the outcome. The whole team should challenge inflated Musts. Facilitators do not own priority.',
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
              id: 'P4Q3B1',
              q: 'Which 2 statements correctly apply MoSCoW at increment level for PermitPath?',
              options: [
                'A. A requirement can be Should Have for Increment 1 and Must Have for the whole project',
                'B. Garden-waste subscriptions can be Could Have now even if Cabinet wants them later',
                'C. Increment-level MoSCoW must copy project-level MoSCoW exactly',
                'D. Won’t Have this time is not a permitted priority',
                'E. Must Have at increment level means “nice to have if a parking officer is free”',
              ],
              correct: [
                'A. A requirement can be Should Have for Increment 1 and Must Have for the whole project',
                'B. Garden-waste subscriptions can be Could Have now even if Cabinet wants them later',
              ],
              explain:
                'Priorities are timeframe-specific. What is Must for the finished service may not be Must for increment one.',
            },
            {
              id: 'P4Q3B2',
              q: 'Which 2 estimating behaviours fit Sprint Planning for Citizen in Increment 1?',
              options: [
                'A. The people who will do the work forecast the Sprint Backlog',
                'B. Estimates get more precise because the stories are about to be built',
                'C. Sofia issues hour targets the night before and forbids discussion',
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
              id: 'P4Q3B3',
              q: 'Using the additional information, which 2 backlog decisions are appropriate in week 6?',
              options: [
                'A. Keep parking Must Haves first — three of five done is not yet a usable subset',
                'B. Start skip-licence stories immediately because the councillors asked',
                'C. Skip licences can remain Should Have and be dropped if the CivicRecord API consumes the last Sprint',
                'D. Re-label every unfinished item as Must Have so nobody can drop it',
                'E. Freeze the Product Backlog so Lila cannot reorder anything',
              ],
              correct: [
                'A. Keep parking Must Haves first — three of five done is not yet a usable subset',
                'C. Skip licences can remain Should Have and be dropped if the CivicRecord API consumes the last Sprint',
              ],
              explain:
                'Protect the Minimum Usable Subset. Use Should Haves as the valve when a constraint appears.',
            },
            {
              id: 'P4Q3B4',
              q: 'Which 2 items belong in a Solution/Product Backlog rather than only in a personal notebook?',
              options: [
                'A. Apply / renew / evidence against resident parking',
                'B. Ravi’s CivicRecord extract spike',
                'C. Sofia’s private reminder to book the civic suite',
                'D. Kate’s leave dates with no project impact',
                'E. A rumour about a neighbouring borough’s app',
              ],
              correct: [
                'A. Apply / renew / evidence against resident parking',
                'B. Ravi’s CivicRecord extract spike',
              ],
              explain:
                'Backlogs hold the work of the project — outcomes, stories, spikes — not trivia.',
            },
            {
              id: 'P4Q3B5',
              q: 'Which 2 statements about the Minimum Usable Subset are correct for Increment 1?',
              options: [
                'A. If parking cannot be applied for, decided with an audit trail, and extracted for the return, the increment has not delivered its Musts',
                'B. Skip licences are not required for the increment to succeed',
                'C. The cabinet dashboard is part of the Increment 1 Minimum Usable Subset',
                'D. The Minimum Usable Subset is whatever remains on 31 March',
                'E. Could Haves are included in the Minimum Usable Subset by definition',
              ],
              correct: [
                'A. If parking cannot be applied for, decided with an audit trail, and extracted for the return, the increment has not delivered its Musts',
                'B. Skip licences are not required for the increment to succeed',
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
              id: 'P4Q3C1',
              q: 'A range of £800k–£900k and “about three increments before 31 March” used to approve the transformation-fund drawdown.',
              correct: 'A',
              explain: 'Coarse numbers to decide whether to start — Pre-Project.',
            },
            {
              id: 'P4Q3C2',
              q: 'Increment 1 = parking and the statutory extract; Increment 2 = skip licences; Increment 3 = garden waste and the dashboard.',
              correct: 'C',
              explain: 'Slicing outcomes across increments is increment planning.',
            },
            {
              id: 'P4Q3C3',
              q: 'Task-level forecast for the three parking stories Citizen will finish this Sprint.',
              correct: 'D',
              explain: 'Sprint Planning is where detailed estimates belong.',
            },
            {
              id: 'P4Q3C4',
              q: 'A high-level Solution Architecture Definition and a first-cut Prioritised Requirements List.',
              correct: 'B',
              explain: 'Those are Foundations work-products, still high-level.',
            },
            {
              id: 'P4Q3C5',
              q: 'Did contact-centre calls for parking permits fall six months after the service was live?',
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
              id: 'P4Q3D1',
              assertion:
                'Lila should reorder the Increment 1 backlog so the remaining parking Musts beat skip licences.',
              reason:
                'MoSCoW exists so lower-priority work yields when a timebox is under pressure.',
              correct: 'A',
              explain: 'Both true and linked — that is the point of Should Have skip licences.',
            },
            {
              id: 'P4Q3D2',
              assertion:
                'Detailed skip-licence fields should now be specified because the councillors asked in week 6.',
              reason:
                'Detailed analysis is done at the last responsible moment for the increment that will build that slice.',
              correct: 'D',
              explain: 'Assertion false (skip is Should Have / Increment 2). Reason true.',
            },
            {
              id: 'P4Q3D3',
              assertion:
                'The CivicRecord API appearing on 10 March should be treated as Increment 1 work that may displace Should Haves.',
              reason:
                'A Must Have integration constraint inside the increment consumes the same timebox as other Increment 1 work.',
              correct: 'A',
              explain: 'Both true — the extract is in the box; skip licences may lose.',
            },
            {
              id: 'P4Q3D4',
              assertion:
                'Officer is right to have produced no Increment 1 increment while waiting for a data-warehouse strategy.',
              reason:
                'A Should Have may be deferred, but a team should still pursue any Must Have work in its backlog.',
              correct: 'D',
              explain:
                'Assertion over-states the freeze — the statutory extract is a Must. Reason true.',
            },
            {
              id: 'P4Q3D5',
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
            'Answer the following questions about planning, control and compliance on PermitPath. Choose one option from A to D.',
          extra: extraIncrement1,
          items: [
            {
              id: 'P4Q4A1',
              q: 'Which planning artefact should Sofia keep current for Kate while Citizen and Officer are in Sprints?',
              options: [
                'A. A high-level Delivery Plan plus increment goals, not a task-level Gantt for every week to 31 March',
                'B. A daily 400-line plan that assigns every contact-centre hour',
                'C. No plan — agile means improvisation only',
                'D. A Benefits Assessment that replaces the Delivery Plan in week 1',
              ],
              correct:
                'A. A high-level Delivery Plan plus increment goals, not a task-level Gantt for every week to 31 March',
              explain:
                'Planning stays appropriate to horizon: increment-level for the project, Sprint Backlogs for the teams.',
            },
            {
              id: 'P4Q4A2',
              q: 'How should Citizen and Officer handle a shared dependency on Ravi’s CivicRecord extract?',
              options: [
                'A. Never discuss it — each team “self-manages” in isolation',
                'B. Surface it in a multi-team planning event and sequence Sprint goals around the 10 March window',
                'C. Ask Kate to code the extract on Sundays',
                'D. Duplicate the extract in both teams with no shared design',
              ],
              correct:
                'B. Surface it in a multi-team planning event and sequence Sprint goals around the 10 March window',
              explain:
                'v3 expects Scrum to be tailored with a project-level planning event for cross-team dependencies.',
            },
            {
              id: 'P4Q4A3',
              q: 'What is the most appropriate control if week-6 rehearsal shows 3 of 5 Musts done and skip licences untouched?',
              options: [
                'A. Declare Increment 1 failed and stop the project',
                'B. Inspect the increment goal, drop or defer skip licences, and concentrate both teams on the remaining Musts and the extract API',
                'C. Extend the increment by six weeks as the councillors asked',
                'D. Replace Sprint Reviews with a written apology to Cabinet',
              ],
              correct:
                'B. Inspect the increment goal, drop or defer skip licences, and concentrate both teams on the remaining Musts and the extract API',
              explain:
                'Control means respond to what the increment is telling you — inside the timebox, using priority.',
            },
            {
              id: 'P4Q4A4',
              q: 'How should FOI and retention rules for parking personal data be handled so agility and compliance both survive?',
              options: [
                'A. Ignore retention because the project is agile',
                'B. Treat the retention / FOI note as a work-product with acceptance criteria and pull it into a Sprint before parking data goes live',
                'C. Complete every conceivable IG document for Increments 2 and 3 in Foundations',
                'D. Wait until after Deployment and hope for retrospective approval from Nia',
              ],
              correct:
                'B. Treat the retention / FOI note as a work-product with acceptance criteria and pull it into a Sprint before parking data goes live',
              explain:
                'Regulatory work is planned and done just in time, not skipped and not front-loaded for the whole programme.',
            },
            {
              id: 'P4Q4A5',
              q: 'How does financial governance on PermitPath differ from a traditional fixed-scope project?',
              options: [
                'A. Time and cost are fixed; scope is the variable that protects the business case',
                'B. Scope is fixed; time and the transformation fund expand until every member request is built',
                'C. There is no financial governance on agile projects in local government',
                'D. Kate must approve every story’s cost to the nearest pound mid-Sprint',
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
              id: 'P4Q4B1',
              q: 'Which 2 events give Kate enough control without a weekly 40-page committee report?',
              options: [
                'A. Increment Reviews with a working parking rehearsal',
                'B. A short, visible Delivery Plan and risk commentary',
                'C. Daily personal status emails from every developer to Kate',
                'D. Cancelling Sprint Reviews so nothing incomplete is seen',
                'E. A benefits audit in week 2 of Foundations',
              ],
              correct: [
                'A. Increment Reviews with a working parking rehearsal',
                'B. A short, visible Delivery Plan and risk commentary',
              ],
              explain:
                'Demonstrate Control with working software and a thin, honest plan — not theatre or hidden work.',
            },
            {
              id: 'P4Q4B2',
              q: 'Which 2 tailoring actions help two Scrum teams stay one AgilePM project?',
              options: [
                'A. Shared increment goals set with Ben and Ravi',
                'B. A dependency board reviewed in the multi-team planning event',
                'C. Separate visions that contradict each other',
                'D. Different accessibility bars in each team’s Definition of Done',
                'E. No Product Owner because Sofia will write every story',
              ],
              correct: [
                'A. Shared increment goals set with Ben and Ravi',
                'B. A dependency board reviewed in the multi-team planning event',
              ],
              explain:
                'Multi-team control is shared goals plus explicit dependency management.',
            },
            {
              id: 'P4Q4B3',
              q: 'Which 2 statements about tracking in a Sprint timebox are appropriate?',
              options: [
                'A. Daily Scrum inspects whether the Sprint Goal is still in reach',
                'B. Unfinished Should Haves can leave the Sprint without failing Increment 1 if Musts remain on track',
                'C. Progress is reported only as percentage of CivicRecord documents signed',
                'D. Once a Sprint starts, no one may mention a new API date',
                'E. Tracking is Democratic Services’ job and teams should not look at the board',
              ],
              correct: [
                'A. Daily Scrum inspects whether the Sprint Goal is still in reach',
                'B. Unfinished Should Haves can leave the Sprint without failing Increment 1 if Musts remain on track',
              ],
              explain:
                'Inspect and adapt inside the Sprint; increment success is the Must Have set, not every Should.',
            },
            {
              id: 'P4Q4B4',
              q: 'Which 2 work-products support regulatory compliance without destroying agility?',
              options: [
                'A. A retention / FOI note sized to parking, built inside a Sprint',
                'B. An auditable grant/refuse history on parking records (already a Must Have quality attribute)',
                'C. A 200-page compliance strategy covering garden-waste features that will not exist for a year',
                'D. Verbal IG approval with no record',
                'E. Deleting audit logs after each Sprint to “stay lightweight”',
              ],
              correct: [
                'A. A retention / FOI note sized to parking, built inside a Sprint',
                'B. An auditable grant/refuse history on parking records (already a Must Have quality attribute)',
              ],
              explain:
                'Just-enough, just-in-time evidence. Quality attributes that are Musts stay in the solution.',
            },
            {
              id: 'P4Q4B5',
              q: 'Which 2 responses to the councillors’ six-week extension request demonstrate control?',
              options: [
                'A. Keep 31 March; offer skip licences a place in Increment 2 with a visible date',
                'B. Explain that extra scope is paid for by dropping Should/Could, not by stretching time',
                'C. Agree the extension quietly so Kate is not worried',
                'D. Cancel Increment Reviews until garden waste is also live',
                'E. Declare accessibility optional so everything fits',
              ],
              correct: [
                'A. Keep 31 March; offer skip licences a place in Increment 2 with a visible date',
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
              id: 'P4Q4C1',
              q: 'Sofia convenes a two-hour increment planning event so Citizen, Officer and Ravi sequence the 10 March extract.',
              correct: 'C',
              explain: 'That is the multi-team planning tailoring v3 expects.',
            },
            {
              id: 'P4Q4C2',
              q: 'Kate is shown a working parking rehearsal and a one-page increment forecast, not a 40-page pack.',
              correct: 'B',
              explain: 'Tracking by working solution plus a thin forecast is Demonstrate Control.',
            },
            {
              id: 'P4Q4C3',
              q: 'The Delivery Plan still shows three increments and a fixed 31 March Increment 1 date.',
              correct: 'A',
              explain: 'Horizon-appropriate planning, dates held.',
            },
            {
              id: 'P4Q4C4',
              q: 'Parking cannot use live personal data until the retention / FOI story meets its acceptance criteria.',
              correct: 'D',
              explain: 'Compliance integrated as real work, not a side process.',
            },
            {
              id: 'P4Q4C5',
              q: 'Sofia agrees the six-week extension in a corridor so skip licences can join Increment 1.',
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
              id: 'P4Q4D1',
              assertion:
                'Sofia should keep the increment timebox and publish a revised feature forecast that drops or slips skip licences.',
              reason:
                'In AgilePM, control is exercised by changing scope inside a fixed time and cost box.',
              correct: 'A',
              explain: 'Both true and the reason is why the assertion is the right control action.',
            },
            {
              id: 'P4Q4D2',
              assertion:
                'Officer should stay idle until corporate ICT finish their data-warehouse strategy.',
              reason:
                'Teams demonstrate control by progressing Must Have work and making blockers visible.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P4Q4D3',
              assertion:
                'The 10 March API date should appear on the shared dependency board before the next multi-team planning event.',
              reason:
                'Cross-team dependencies are controlled by making them explicit in project-level planning, not inside one team’s private chat.',
              correct: 'A',
              explain: 'Both true and linked.',
            },
            {
              id: 'P4Q4D4',
              assertion:
                'Financial governance requires Sofia to request another £150k so skip licences can join Increment 1.',
              reason:
                'AgilePM financial governance expands the cost box whenever elected members add scope.',
              correct: 'E',
              explain:
                'Both false — hold the £860k envelope and ask which features no longer fit; do not treat member requests as a licence to inflate cost.',
            },
            {
              id: 'P4Q4D5',
              assertion:
                'Kate should receive the week-6 rehearsal as evidence of progress even though two Musts remain.',
              reason:
                'Progress may only be reported as pages of CivicRecord specification signed.',
              correct: 'C',
              explain:
                'Assertion true — incomplete working software is still the primary measure. Reason false — that is traditional document control, not AgilePM.',
            },
          ],
        },
      ],
    },
  ],
}
