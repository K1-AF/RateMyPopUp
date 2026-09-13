// Original Practitioner Paper 5 — Kestrel University.
// Official 80-line booklet layout. Not copied from any APMG sample.
// All organisations, people and student records in this paper are fictional.

const scenario = {
  title: 'Project Scenario — Kestrel University',
  sections: [
    {
      heading: 'The organisation',
      body: 'Kestrel University places undergraduates from three faculties — Nursing, Education and Allied Health — into hospitals, schools and clinics. Allocations still sit in three faculty spreadsheets and a shared mailbox. Last year 11% of Nursing students arrived on a ward without a confirmed supervisor. The Pro Vice-Chancellor (Education) has approved a single placement-matching platform so students, coordinators and partners share one record, DBS and data-sharing status is visible before a start date is issued, and equality monitoring can be evidenced for the Office for Students (OfS).',
    },
    {
      heading: 'The project',
      body: 'Project name: PlaceWise. Outcome required: a live matching service that can confirm a lawful, DBS-cleared Nursing placement before the September cohort arrives, with an auditable data-sharing trail and equality monitoring. The first increment must be in service for Nursing before 1 September so the autumn term does not start on spreadsheets. Total cost is fixed at the OfS-funded envelope of £960k. Calendar time is fixed by the term start. DBS completion, lawful data sharing and equality monitoring are treated as fixed quality. Features will be prioritised with MoSCoW.\n\nTwo Scrum delivery teams will work in two-week Sprints: Match (allocation and student/partner matching) and Comply (DBS evidence, data-sharing agreements and equality monitoring). A shared Solution Architect owns technical integrity across both Product Backlogs. The University has not run a multi-team AgilePM project before.',
    },
    {
      heading: 'Named roles',
      body: 'Business Sponsor: Helen Cho, PVC Education — funds the project from the OfS envelope and chairs the steering group.\nBusiness Visionary: Idris Banerjee, Head of Placements — owns the business vision and Must Have outcome.\nProject Manager: Jo Fernandes — enables delivery, planning and control across both teams.\nSolution Architect: Samira Qureshi.\nProduct Owner (placement product): Tom Hale, faculty coordinator.\nBusiness Ambassador: Nia Brooks, placement administrator, full-time with Match.\nBusiness Advisor: Rowan Ellis, Data Protection.\nWorkshop Facilitator: used when Jo is not the right independent chair.\nScrum Masters: one per delivery team.',
    },
    {
      heading: 'Constraints and known issues',
      body: 'Partner hospitals are slow to name operational contacts. Several programme leads want a complete specification signed before any Sprint starts. St Kilda NHS Trust will only offer a two-week integration window in August. Rowan has said any export of student data to a partner must complete a Data Protection Impact Assessment before personal data leaves the University network. Three faculties are already labelling conflicting local reports as Must Haves. Helen will not move the 1 September Nursing go-live or increase the £960k OfS envelope.',
    },
    {
      heading: 'Outline delivery',
      body: 'Increment 1 (to 1 September): Nursing live for match / allocate / confirm against existing placement templates. A two-trust data-sharing portal is Should Have. An equality dashboard is Could Have.\nIncrement 2: Education cut over and remaining Nursing trusts.\nIncrement 3: Allied Health plus the OfS equality analytics pack.\nA high-level Delivery Plan exists. Fine detail is left for Sprint Planning. Foundations lasted three weeks and produced a Prioritised Requirements List, Solution Architecture Definition, and a Project Approach Questionnaire that flagged first-time multi-team working, slow hospital engagement, and conflicting faculty Musts.',
    },
  ],
}

const extraIncrement1 = {
  title: 'Additional information — mid Increment 1',
  body: 'Week 6 of Increment 1. Match has finished 4 of 6 Must Have allocation stories and has a working Nursing pilot on the rehearsal environment. Comply has not started the two-trust data-sharing portal because Tom is waiting for a “full partner communications pack” from the University press office. Two deans have asked Jo to extend Increment 1 by five weeks so Education placements can join the same September go-live. Samira has found that the St Kilda Trust feed will not be available until 18 August — inside the last Sprint of Increment 1. Nia is being pulled back to clearing three afternoons a week.',
}

const extraPaq = {
  title: 'Additional information — Project Approach Questionnaire extracts',
  body: 'PAQ statements the team marked Amber or Red in Foundations:\n1. Business roles can be made available at the level the project needs — Amber (Education placement officer can offer half a day a week; two trusts have not named a contact).\n2. The solution can be delivered incrementally — Green.\n3. Requirements can be prioritised and the Must Have set kept to a genuine Minimum Usable Subset — Amber (three faculties still call every local preference a Must).\n4. The wider organisation understands that detailed specifications will emerge — Red (Registry attached a 70-page placement specification to the OfS bid as if it were a frozen contract).\n5. Empowered teams can make day-to-day decisions — Amber (Data Protection sign-off currently sits on Rowan’s fortnightly committee).',
}

export const PRACTITIONER_PAPER_5 = {
  id: 'pract5',
  title: 'Practitioner Paper 5',
  project: 'Kestrel University — PlaceWise',
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
            'Answer the following questions about balancing Time, Cost, Quality and Features on PlaceWise. Choose one option from A to D for each question.',
          extra: null,
          items: [
            {
              id: 'P5Q1A1',
              q: 'Helen has locked 1 September and the £960k OfS envelope, and has told the teams that DBS and lawful data sharing will not be traded. Which variable should PlaceWise treat as the primary contingency?',
              options: [
                'A. Time — slide the term start if Nursing screens are unfinished',
                'B. Cost — ask OfS for a supplementary grant whenever a Should Have slips',
                'C. Quality — skip DBS evidence in the last Sprint so more faculties fit',
                'D. Features — vary scope through MoSCoW so the Minimum Usable Subset still fits the box',
              ],
              correct:
                'D. Features — vary scope through MoSCoW so the Minimum Usable Subset still fits the box',
              explain:
                'AgilePM fixes time, cost and quality. Features (MoSCoW) are the contingency that protects the September / OfS box.',
            },
            {
              id: 'P5Q1A2',
              q: 'A Nursing programme lead argues that “equality monitoring can flex a little” so Education can join Increment 1. According to AgilePM, why should PlaceWise reject that contingency?',
              options: [
                'A. Quality is never mentioned after Pre-Project',
                'B. Never Compromise Quality — agreed acceptance criteria and regulatory standards stay fixed; scope flexes instead',
                'C. Only Rowan may reduce quality, and only after Deployment',
                'D. Quality may flex if a faculty dean signs a waiver',
              ],
              correct:
                'B. Never Compromise Quality — agreed acceptance criteria and regulatory standards stay fixed; scope flexes instead',
              explain:
                'Principle 4 keeps agreed quality fixed. Equality monitoring is a stated quality standard, not a spare buffer.',
            },
            {
              id: 'P5Q1A3',
              q: 'Which action best demonstrates Focus on the Business Need for PlaceWise?',
              options: [
                'A. Match builds a decorative campus-map animation because a vendor demo looked impressive',
                'B. Idris restates that a live, lawful Nursing matching service by 1 September is the outcome that justifies the project',
                'C. Comply starts the Increment 3 analytics pack in Sprint 1 because dashboards are interesting',
                'D. Jo freezes every requirement so nothing can change after Foundations',
              ],
              correct:
                'B. Idris restates that a live, lawful Nursing matching service by 1 September is the outcome that justifies the project',
              explain:
                'Principle 1 keeps work aligned to the agreed business outcome, not to attractive extras.',
            },
            {
              id: 'P5Q1A4',
              q: 'Foundations lasted three weeks and left Sprint-level placement rules for later. Which principle does that apply?',
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
              id: 'P5Q1A5',
              q: 'Helen asks what “the AgilePM framework” actually comprises for PlaceWise. Which answer should Jo give?',
              options: [
                'A. Process, People, Project Artifacts and Practices, underpinned by common sense and pragmatism',
                'B. Process and People only — artifacts are banned on university agile projects',
                'C. Practices replace the need for any defined roles',
                'D. Project Artifacts are produced only after the September cohort has started',
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
            'Each question contains options about PlaceWise. Remember to select 2 answers to each question. Both must be correct to score the mark.',
          extra: null,
          items: [
            {
              id: 'P5Q1B1',
              q: 'Which 2 statements reflect an appropriate AgilePM response to St Kilda’s two-week August integration window?',
              options: [
                'A. Treat the window as a hard timebox and pull only Must Have feed work into the Sprint that covers it',
                'B. Slip the 1 September go-live as soon as the Trust names a date',
                'C. Collaborate with Samira and the Trust so the feed is a visible backlog item with clear acceptance criteria',
                'D. Ignore the constraint until Deployment and hope the feed appears',
                'E. Drop DBS checks to make room for the feed',
              ],
              correct: [
                'A. Treat the window as a hard timebox and pull only Must Have feed work into the Sprint that covers it',
                'C. Collaborate with Samira and the Trust so the feed is a visible backlog item with clear acceptance criteria',
              ],
              explain:
                'Deliver on Time and Collaborate. Do not move the increment end-date or trade quality to hide a known constraint.',
            },
            {
              id: 'P5Q1B2',
              q: 'Which 2 actions would put Principle 3 Collaborate into practice on PlaceWise?',
              options: [
                'A. Nia remains full-time with Match so placement decisions are made inside the Sprint',
                'B. Jo writes every acceptance criterion alone so faculty staff are not interrupted',
                'C. Idris and Samira join Sprint Reviews so value and integrity are inspected together',
                'D. Rowan only sees the product after go-live to “avoid slowing the team”',
                'E. Comply is forbidden from talking to Match until Increment 3',
              ],
              correct: [
                'A. Nia remains full-time with Match so placement decisions are made inside the Sprint',
                'C. Idris and Samira join Sprint Reviews so value and integrity are inspected together',
              ],
              explain:
                'Collaboration needs empowered business and solution roles working together throughout, not after the fact.',
            },
            {
              id: 'P5Q1B3',
              q: 'Which 2 statements correctly describe contingency on a project that fixes time, cost and quality?',
              options: [
                'A. Should Have and Could Have features provide the buffer when estimates prove optimistic',
                'B. The Must Have set must still be a genuine Minimum Usable Subset',
                'C. Contingency is created by leaving DBS standards undefined',
                'D. Contingency is created by hiding extra weeks in a secret plan',
                'E. All faculty reports must be Must Have so nothing can be dropped',
              ],
              correct: [
                'A. Should Have and Could Have features provide the buffer when estimates prove optimistic',
                'B. The Must Have set must still be a genuine Minimum Usable Subset',
              ],
              explain:
                'MoSCoW contingency only works if Musts are truly musts and lower priorities can be dropped without failing the business case.',
            },
            {
              id: 'P5Q1B4',
              q: 'Which 2 statements about incremental delivery from firm foundations apply to PlaceWise?',
              options: [
                'A. Nursing going live in Increment 1 can deliver value before Education and Allied Health are ready',
                'B. Foundations should have specified every Education screen to pixel level',
                'C. A shared understanding of problem, solution and risk was the point of the three-week Foundations',
                'D. Incremental delivery is only allowed if the whole £960k is spent in month one',
                'E. Once Delivery starts, Foundations decisions can never be revisited',
              ],
              correct: [
                'A. Nursing going live in Increment 1 can deliver value before Education and Allied Health are ready',
                'C. A shared understanding of problem, solution and risk was the point of the three-week Foundations',
              ],
              explain:
                'Early increments release value. Foundations stay high-level and may be refreshed between increments if the next slice needs it.',
            },
            {
              id: 'P5Q1B5',
              q: 'Which 2 leadership behaviours would undermine AgilePM’s philosophy on PlaceWise?',
              options: [
                'A. Helen withdraws empowerment and requires her sign-off on every Sprint story',
                'B. Idris clarifies the vision and then lets the teams inspect and adapt',
                'C. Jo replaces Sprint Reviews with a monthly slideshow so partners are not “bothered”',
                'D. Samira explains architectural constraints in planning so teams can make informed choices',
                'E. Nia spends her time with Match answering placement questions as they arise',
              ],
              correct: [
                'A. Helen withdraws empowerment and requires her sign-off on every Sprint story',
                'C. Jo replaces Sprint Reviews with a monthly slideshow so partners are not “bothered”',
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
            'Column 1 lists actions proposed on PlaceWise. For each action, select from Column 2 the AgilePM principle it best applies. Each selection from Column 2 can be used once, more than once or not at all.',
          extra: null,
          column2: [
            { key: 'A', text: 'Focus on the Business Need' },
            { key: 'B', text: 'Deliver on Time' },
            { key: 'C', text: 'Never Compromise Quality' },
            { key: 'D', text: 'Collaborate' },
            { key: 'E', text: 'Demonstrate Control' },
          ],
          items: [
            {
              id: 'P5Q1C1',
              q: 'Jo keeps a visible increment burndown and a short risk commentary for Helen’s steering group.',
              correct: 'E',
              explain: 'Demonstrate Control is about making progress and issues visible to those who need to govern the project.',
            },
            {
              id: 'P5Q1C2',
              q: 'Idris drops a faculty vanity report from Increment 1 because it does not help Nursing go live lawfully in September.',
              correct: 'A',
              explain: 'Protecting the outcome that justified the project is Focus on the Business Need.',
            },
            {
              id: 'P5Q1C3',
              q: 'The increment end-date stays 1 September even though two deans ask for Education to be squeezed in.',
              correct: 'B',
              explain: 'Deliver on Time treats the timebox as immovable; scope changes instead.',
            },
            {
              id: 'P5Q1C4',
              q: 'DBS and data-sharing acceptance tests remain in the Definition of Done when Match is under pressure.',
              correct: 'C',
              explain: 'Never Compromise Quality keeps agreed regulatory standards inside Done.',
            },
            {
              id: 'P5Q1C5',
              q: 'Tom and Nia sit with Match during the Sprint so allocation rules are decided with the people doing the work.',
              correct: 'D',
              explain: 'Collaborate puts empowered business and solution roles in the same cadence.',
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
              id: 'P5Q1D1',
              assertion:
                'Jo should keep the 1 September timebox and refuse to fold Education matching into Increment 1.',
              reason:
                'Deliver on Time treats the increment end-date as fixed, so extra faculty scope is paid for by priority, not by adding weeks.',
              correct: 'A',
              explain:
                'Both true, and the reason is why the assertion is right: do not blow the timebox to absorb extra scope.',
            },
            {
              id: 'P5Q1D2',
              assertion:
                'Tom is right to block all data-sharing portal work until the press office finishes a full partner pack.',
              reason:
                'A Should Have may be de-scoped from the increment if it does not fit, but it should not be used to freeze empowered teams.',
              correct: 'D',
              explain:
                'Assertion false — a Should Have can start without a corporate novel. Reason true — the portal can be dropped if the box is full, but that is a priority decision, not a freeze.',
            },
            {
              id: 'P5Q1D3',
              assertion:
                'Nia being pulled into clearing three afternoons a week is an approach-availability risk.',
              reason:
                'St Kilda’s August window is a hard timebox that Match should plan around.',
              correct: 'B',
              explain:
                'Both statements are true, but the Trust window does not explain why Nia’s absence is an approach risk.',
            },
            {
              id: 'P5Q1D4',
              assertion:
                'Samira should wait until the September steering group before mentioning the 18 August St Kilda feed.',
              reason:
                'Demonstrate Control requires risks that threaten the increment outcome to be made visible as soon as they are known.',
              correct: 'D',
              explain:
                'Assertion false (hiding a critical constraint is the opposite of control). Reason true.',
            },
            {
              id: 'P5Q1D5',
              assertion:
                'The rehearsal-environment Nursing pilot is a stronger progress signal than a registry paper listing unfinished documents.',
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
            'Answer the following questions about risk and the Project Approach on PlaceWise. Choose one option from A to D.',
          extra: extraPaq,
          items: [
            {
              id: 'P5Q2A1',
              q: 'Using the PAQ extract, which statement is VUCA-derived risk rather than approach-derived risk?',
              options: [
                'A. Registry attached a 70-page specification to the OfS bid',
                'B. Education can only offer half a day of business time a week',
                'C. A neighbouring trust withdraws 40 Nursing slots in July after a CQC inspection',
                'D. Three faculties are labelling local preferences as Must Haves',
              ],
              correct:
                'C. A neighbouring trust withdraws 40 Nursing slots in July after a CQC inspection',
              explain:
                'A sudden loss of ward capacity is environmental VUCA. The other three are how the University is choosing to run the project.',
            },
            {
              id: 'P5Q2A2',
              q: 'Which PAQ red item should Jo tackle first to protect agility?',
              options: [
                'A. Replace Scrum with a detailed Gantt so Registry feels comfortable',
                'B. Explain to Registry that the appendix is a starting backlog, not a frozen specification, and keep Musts as a Minimum Usable Subset',
                'C. Delete the PAQ because it is only a Foundations formality',
                'D. Make every line in the 70-page appendix a Must Have',
              ],
              correct:
                'B. Explain to Registry that the appendix is a starting backlog, not a frozen specification, and keep Musts as a Minimum Usable Subset',
              explain:
                'The red PAQ item is organisational misunderstanding of emergent detail. Fix the approach; do not abandon agility.',
            },
            {
              id: 'P5Q2A3',
              q: 'Why can a disciplined AgilePM approach reduce the need for a separate traditional risk process on PlaceWise?',
              options: [
                'A. University agile projects have no risks',
                'B. Short increments, visible progress, empowered roles and the PAQ surface and mitigate risk inside everyday management',
                'C. Only Registry may record risks, so the teams should not try',
                'D. Risk is transferred entirely to St Kilda NHS Trust',
              ],
              correct:
                'B. Short increments, visible progress, empowered roles and the PAQ surface and mitigate risk inside everyday management',
              explain:
                'AgilePM’s built-in controls deal with most risk when applied with discipline. A duplicate bureaucracy is usually unnecessary.',
            },
            {
              id: 'P5Q2A4',
              q: 'Rowan’s fortnightly Data Protection committee is the only path for export decisions. What is the most appropriate tailoring?',
              options: [
                'A. Remove Data Protection from the project to go faster',
                'B. Keep the committee and accept that no export decision can occur inside a Sprint',
                'C. Bring Rowan (or a deputy with authority) into the team cadence so compliance decisions happen at Sprint pace',
                'D. Let Match invent a lawful basis without Rowan',
              ],
              correct:
                'C. Bring Rowan (or a deputy with authority) into the team cadence so compliance decisions happen at Sprint pace',
              explain:
                'Tailor the approach so the needed authority sits with the team, not a fortnightly queue that recreates waterfall gates.',
            },
            {
              id: 'P5Q2A5',
              q: 'Which response correctly uses the PAQ rather than treating it as a one-off scorecard?',
              options: [
                'A. Revisit Amber/Red items when increment plans change or new approach risks appear',
                'B. File the PAQ and never look at it again',
                'C. Change Green items to Red so the steering group stays frightened',
                'D. Only Helen may read the PAQ',
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
              id: 'P5Q2B1',
              q: 'Which 2 actions would mitigate the Amber business-availability risk with Education and the silent trusts?',
              options: [
                'A. Agree a named deputy Ambassador for Education with decision rights in Nia’s absence',
                'B. Delay all Education analysis until Increment 3 “when people are free” with no plan',
                'C. Timebox hospital-contact workshops in Foundations/early Delivery and protect those slots',
                'D. Require every ward clerk to attend every Daily Scrum in person',
                'E. Convert Education to a waterfall workstream so they do not need an Ambassador',
              ],
              correct: [
                'A. Agree a named deputy Ambassador for Education with decision rights in Nia’s absence',
                'C. Timebox hospital-contact workshops in Foundations/early Delivery and protect those slots',
              ],
              explain:
                'Make the role real: authority plus protected time. Do not invent a second lifecycle or abandon the faculty.',
            },
            {
              id: 'P5Q2B2',
              q: 'Which 2 statements correctly distinguish VUCA-derived risk from approach-derived risk on PlaceWise?',
              options: [
                'A. A ransomware incident at a partner hospital is largely environmental / VUCA',
                'B. Labelling every faculty preference as a Must Have is approach-derived',
                'C. All risks on an agile project are approach-derived',
                'D. VUCA risks cannot be discussed in Foundations',
                'E. Approach risk is only recorded after Deployment',
              ],
              correct: [
                'A. A ransomware incident at a partner hospital is largely environmental / VUCA',
                'B. Labelling every faculty preference as a Must Have is approach-derived',
              ],
              explain:
                'VUCA comes from the environment. Approach risk comes from how we choose to run the project.',
            },
            {
              id: 'P5Q2B3',
              q: 'Which 2 PAQ-related actions should Jo take if the three faculties keep inflating Must Haves?',
              options: [
                'A. Facilitate a MoSCoW challenge: “If this is missing, do we cancel PlaceWise?”',
                'B. Ask Idris to own the Must Have set as the Minimum Usable Subset',
                'C. Accept every Must so no dean is upset',
                'D. Move the 1 September date to make room for every Must',
                'E. Delete Should Haves from the language of the project',
              ],
              correct: [
                'A. Facilitate a MoSCoW challenge: “If this is missing, do we cancel PlaceWise?”',
                'B. Ask Idris to own the Must Have set as the Minimum Usable Subset',
              ],
              explain:
                'The Visionary owns the outcome. Musts that fail the cancel-the-project test are not Musts.',
            },
            {
              id: 'P5Q2B4',
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
              id: 'P5Q2B5',
              q: 'Which 2 tailoring choices would reduce first-time multi-team approach risk on PlaceWise?',
              options: [
                'A. A regular multi-team planning event so Match and Comply sequence shared work',
                'B. Samira holds a single Solution Architecture Definition both teams respect',
                'C. Each team invents its own Definition of Done with no shared DBS/data-sharing bar',
                'D. Ban the teams from talking to each other to reduce meetings',
                'E. Give Jo both Scrum Master roles so nobody else leads',
              ],
              correct: [
                'A. A regular multi-team planning event so Match and Comply sequence shared work',
                'B. Samira holds a single Solution Architecture Definition both teams respect',
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
            'For each PlaceWise observation in Column 1, select from Column 2 the best description. Each selection can be used once, more than once or not at all.',
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
              id: 'P5Q2C1',
              q: 'A neighbouring trust merger in July halves the Nursing beds available for September.',
              correct: 'A',
              explain: 'External shock — VUCA, not a choice about how the project is run.',
            },
            {
              id: 'P5Q2C2',
              q: 'Registry treats the 70-page OfS appendix as an unchangeable specification.',
              correct: 'B',
              explain: 'That is an organisational way-of-working choice: approach risk.',
            },
            {
              id: 'P5Q2C3',
              q: 'Jo and Idris walk the Amber/Red PAQ lines in the increment planning event and agree mitigations.',
              correct: 'C',
              explain: 'Using the PAQ to shape the approach is what it is for.',
            },
            {
              id: 'P5Q2C4',
              q: 'Registry files the PAQ as a completed checklist and forbids anyone to change a rating.',
              correct: 'D',
              explain: 'A frozen scorecard is not how the questionnaire is meant to work.',
            },
            {
              id: 'P5Q2C5',
              q: 'Helen’s preferred lecture-theatre coffee urn is empty before steering group.',
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
              id: 'P5Q2D1',
              assertion:
                'The Amber rating on “requirements can be prioritised” is an approach risk Jo should treat as active.',
              reason:
                'If Must Haves are not a genuine Minimum Usable Subset, the increment cannot use features as contingency.',
              correct: 'A',
              explain: 'Both true and connected — that is exactly why the PAQ line matters.',
            },
            {
              id: 'P5Q2D2',
              assertion:
                'A Green rating on incremental delivery means no increment plan is required.',
              reason:
                'A Green PAQ line means the principle is understood; it does not replace planning and control artifacts.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P5Q2D3',
              assertion:
                'Empowered day-to-day decisions cannot exist while student-data exports need a fortnightly DP committee.',
              reason:
                'Authority that sits outside the team cadence recreates a gated approach even if the team is called agile.',
              correct: 'A',
              explain: 'Both true — the Amber empowerment line is describing this exact pattern.',
            },
            {
              id: 'P5Q2D4',
              assertion:
                'Jo should insert a traditional stage-gate between every Sprint because the PAQ has a Red line.',
              reason:
                'A Red PAQ rating means AgilePM must be abandoned and replaced with a fixed specification.',
              correct: 'E',
              explain: 'Both false — Red items are resolved by tailoring AgilePM, not by installing a second lifecycle.',
            },
            {
              id: 'P5Q2D5',
              assertion:
                'Education’s half-day-a-week offer should be recorded and mitigated even though most PAQ lines are Green.',
              reason:
                'Green and Amber PAQ lines can be ignored until Post-Project.',
              correct: 'C',
              explain: 'Assertion true — a single unmet line can still threaten a later slice. Reason false.',
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
            'Answer the following questions about requirements, backlogs and estimating on PlaceWise. Choose one option from A to D.',
          extra: null,
          items: [
            {
              id: 'P5Q3A1',
              q: 'Which hierarchy correctly describes how PlaceWise work should be organised?',
              options: [
                'A. A project outcome and goals, a Solution/Product Backlog, increment slices, then Sprint Backlogs',
                'B. A single Sprint Backlog that lists every Education screen for the whole OfS year',
                'C. Only a Gantt chart — backlogs are not used with AgilePM',
                'D. A Benefits Assessment that replaces all backlogs after Foundations',
              ],
              correct:
                'A. A project outcome and goals, a Solution/Product Backlog, increment slices, then Sprint Backlogs',
              explain:
                'v3 organises work as goals / solution / increments / sprint-level items, with detail rising as the horizon nears.',
            },
            {
              id: 'P5Q3A2',
              q: 'When should Match write field-level validation rules for the Education spreadsheet cutover?',
              options: [
                'A. In Pre-Project, before the OfS envelope is agreed',
                'B. In Foundations, for every future increment',
                'C. At the last responsible moment — typically the Sprint that will build that slice',
                'D. After Deployment, so schools can invent the rules live',
              ],
              correct:
                'C. At the last responsible moment — typically the Sprint that will build that slice',
              explain:
                'Detailed analysis is deferred until it is about to be used. Education is Increment 2.',
            },
            {
              id: 'P5Q3A3',
              q: 'Which estimate style is appropriate in Foundations for PlaceWise?',
              options: [
                'A. Hour-level estimates for every Education clerk screen',
                'B. High-level estimates good enough to shape increments and test the £960k / September box',
                'C. No estimates at all, because agile forbids numbers',
                'D. A fixed-price quote for the equality analytics pack to two decimal places',
              ],
              correct:
                'B. High-level estimates good enough to shape increments and test the £960k / September box',
              explain:
                'Estimating matches the lifecycle phase: coarse in Foundations, finer in Sprint Planning.',
            },
            {
              id: 'P5Q3A4',
              q: 'The two-trust data-sharing portal is Should Have for Increment 1. What does that mean if Match is running out of time?',
              options: [
                'A. The portal must still ship or the increment has failed',
                'B. The portal can be dropped from Increment 1 without failing the Minimum Usable Subset',
                'C. The portal becomes a Must Have automatically in week 6',
                'D. The portal cannot be started until Increment 3',
              ],
              correct:
                'B. The portal can be dropped from Increment 1 without failing the Minimum Usable Subset',
              explain:
                'Should Haves are intended contingency. The increment still succeeds if Musts (safe Nursing match/allocate/confirm) are done.',
            },
            {
              id: 'P5Q3A5',
              q: 'Who should confirm that a requirement labelled Must Have really is a Must for PlaceWise?',
              options: [
                'A. Any developer who likes the feature',
                'B. St Kilda NHS Trust',
                'C. The Business Visionary, using the “would we cancel without it?” test, with the team challenging false Musts',
                'D. The Workshop Facilitator acting alone',
              ],
              correct:
                'C. The Business Visionary, using the “would we cancel without it?” test, with the team challenging false Musts',
              explain:
                'Idris owns the outcome. The whole team should challenge inflated Musts. Facilitators do not own priority.',
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
              id: 'P5Q3B1',
              q: 'Which 2 statements correctly apply MoSCoW at increment level for PlaceWise?',
              options: [
                'A. A requirement can be Should Have for Increment 1 and Must Have for the whole project',
                'B. The equality dashboard can be Could Have now even if OfS wants it later',
                'C. Increment-level MoSCoW must copy project-level MoSCoW exactly',
                'D. Won’t Have this time is not a permitted priority',
                'E. Must Have at increment level means “nice to have if someone is free”',
              ],
              correct: [
                'A. A requirement can be Should Have for Increment 1 and Must Have for the whole project',
                'B. The equality dashboard can be Could Have now even if OfS wants it later',
              ],
              explain:
                'Priorities are timeframe-specific. What is Must for the finished service may not be Must for increment one.',
            },
            {
              id: 'P5Q3B2',
              q: 'Which 2 estimating behaviours fit Sprint Planning for Match in Increment 1?',
              options: [
                'A. The people who will do the work forecast the Sprint Backlog',
                'B. Estimates get more precise because the stories are about to be built',
                'C. Jo issues hour targets the night before and forbids discussion',
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
              id: 'P5Q3B3',
              q: 'Using the additional information, which 2 backlog decisions are appropriate in week 6?',
              options: [
                'A. Keep Nursing Must Haves first — four of six done is not yet a usable subset',
                'B. Start Education spreadsheet stories immediately because the deans asked',
                'C. The data-sharing portal can remain Should Have and be dropped if the St Kilda feed consumes the last Sprint',
                'D. Re-label every unfinished item as Must Have so nobody can drop it',
                'E. Freeze the Product Backlog so Tom cannot reorder anything',
              ],
              correct: [
                'A. Keep Nursing Must Haves first — four of six done is not yet a usable subset',
                'C. The data-sharing portal can remain Should Have and be dropped if the St Kilda feed consumes the last Sprint',
              ],
              explain:
                'Protect the Minimum Usable Subset. Use Should Haves as the valve when a constraint appears.',
            },
            {
              id: 'P5Q3B4',
              q: 'Which 2 items belong in a Solution/Product Backlog rather than only in a personal notebook?',
              options: [
                'A. Match / allocate / confirm against Nursing templates',
                'B. Samira’s St Kilda feed spike',
                'C. Jo’s private reminder to book a room for the next steering group cake',
                'D. Helen’s conference dates with no project impact',
                'E. A rumour about a rival university’s app',
              ],
              correct: [
                'A. Match / allocate / confirm against Nursing templates',
                'B. Samira’s St Kilda feed spike',
              ],
              explain:
                'Backlogs hold the work of the project — outcomes, stories, spikes — not trivia.',
            },
            {
              id: 'P5Q3B5',
              q: 'Which 2 statements about the Minimum Usable Subset are correct for Increment 1?',
              options: [
                'A. If Nursing cannot match, allocate and confirm lawfully, the increment has not delivered its Musts',
                'B. The two-trust data-sharing portal is not required for the increment to succeed',
                'C. The OfS equality analytics pack is part of the Increment 1 Minimum Usable Subset',
                'D. The Minimum Usable Subset is whatever remains on the last day',
                'E. Could Haves are included in the Minimum Usable Subset by definition',
              ],
              correct: [
                'A. If Nursing cannot match, allocate and confirm lawfully, the increment has not delivered its Musts',
                'B. The two-trust data-sharing portal is not required for the increment to succeed',
              ],
              explain:
                'MUS = Must Haves for that timeframe. Should/Could sit above that line.',
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
              id: 'P5Q3C1',
              q: 'A range of £900k–£1.0m and “about three increments around a September first release” used to approve the OfS bid.',
              correct: 'A',
              explain: 'Coarse numbers to decide whether to start — Pre-Project.',
            },
            {
              id: 'P5Q3C2',
              q: 'Increment 1 = Nursing match/allocate/confirm; Increment 2 = Education; Increment 3 = Allied Health + analytics.',
              correct: 'C',
              explain: 'Slicing outcomes across increments is increment planning.',
            },
            {
              id: 'P5Q3C3',
              q: 'Task-level forecast for the three allocation stories Match will finish this Sprint.',
              correct: 'D',
              explain: 'Sprint Planning is where detailed estimates belong.',
            },
            {
              id: 'P5Q3C4',
              q: 'A high-level Solution Architecture Definition and a first-cut Prioritised Requirements List.',
              correct: 'B',
              explain: 'Those are Foundations work-products, still high-level.',
            },
            {
              id: 'P5Q3C5',
              q: 'Did unconfirmed Nursing arrivals fall from 11% six months after all three faculties were live?',
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
              id: 'P5Q3D1',
              assertion:
                'Tom should reorder the Increment 1 backlog so the remaining Nursing Musts beat the data-sharing portal.',
              reason:
                'MoSCoW exists so lower-priority work yields when a timebox is under pressure.',
              correct: 'A',
              explain: 'Both true and linked — that is the point of a Should Have portal.',
            },
            {
              id: 'P5Q3D2',
              assertion:
                'Detailed Education spreadsheet fields should now be specified because two deans asked in week 6.',
              reason:
                'Detailed analysis is done at the last responsible moment for the increment that will build that slice.',
              correct: 'D',
              explain: 'Assertion false (Education is Increment 2). Reason true.',
            },
            {
              id: 'P5Q3D3',
              assertion:
                'The St Kilda feed appearing on 18 August should be treated as Increment 1 work that may displace Should Haves.',
              reason:
                'A Must Have integration constraint inside the increment consumes the same timebox as other Increment 1 work.',
              correct: 'A',
              explain: 'Both true — the feed is in the box; the portal may lose.',
            },
            {
              id: 'P5Q3D4',
              assertion:
                'Comply is right to have produced no Increment 1 increment while waiting for a communications pack.',
              reason:
                'A Should Have may be deferred, but a team should still pursue any Must Have work in its backlog.',
              correct: 'D',
              explain:
                'Assertion over-states the freeze. Reason true — they should not idle if Musts remain.',
            },
            {
              id: 'P5Q3D5',
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
            'Answer the following questions about planning, control and compliance on PlaceWise. Choose one option from A to D.',
          extra: extraIncrement1,
          items: [
            {
              id: 'P5Q4A1',
              q: 'Which planning artefact should Jo keep current for Helen while Match and Comply are in Sprints?',
              options: [
                'A. A high-level Delivery Plan plus increment goals, not a task-level Gantt for the whole OfS year',
                'B. A daily 400-line plan that assigns every coordinator hour',
                'C. No plan — agile means improvisation only',
                'D. A Benefits Assessment that replaces the Delivery Plan in week 1',
              ],
              correct:
                'A. A high-level Delivery Plan plus increment goals, not a task-level Gantt for the whole OfS year',
              explain:
                'Planning stays appropriate to horizon: increment-level for the project, Sprint Backlogs for the teams.',
            },
            {
              id: 'P5Q4A2',
              q: 'How should Match and Comply handle a shared dependency on Samira’s St Kilda feed?',
              options: [
                'A. Never discuss it — each team “self-manages” in isolation',
                'B. Surface it in a multi-team planning event and sequence Sprint goals around the August window',
                'C. Ask Helen to code the adapter on Sundays',
                'D. Duplicate the feed in both teams with no shared design',
              ],
              correct:
                'B. Surface it in a multi-team planning event and sequence Sprint goals around the August window',
              explain:
                'v3 expects Scrum to be tailored with a project-level planning event for cross-team dependencies.',
            },
            {
              id: 'P5Q4A3',
              q: 'What is the most appropriate control if week-6 rehearsal shows 4 of 6 Musts done and the portal untouched?',
              options: [
                'A. Declare Increment 1 failed and stop the project',
                'B. Inspect the increment goal, drop or defer the portal, and concentrate both teams on the remaining Musts and the feed',
                'C. Extend the increment by five weeks as the deans asked',
                'D. Replace Sprint Reviews with a written apology',
              ],
              correct:
                'B. Inspect the increment goal, drop or defer the portal, and concentrate both teams on the remaining Musts and the feed',
              explain:
                'Control means respond to what the increment is telling you — inside the timebox, using priority.',
            },
            {
              id: 'P5Q4A4',
              q: 'How should the DPIA for partner data export be handled so agility and compliance both survive?',
              options: [
                'A. Ignore the DPIA because the project is agile',
                'B. Treat the DPIA as a work-product with acceptance criteria and pull it into a Sprint before student data leaves the network',
                'C. Complete every conceivable IG document for Increments 2 and 3 in Foundations',
                'D. Wait until after Deployment and hope for retrospective approval',
              ],
              correct:
                'B. Treat the DPIA as a work-product with acceptance criteria and pull it into a Sprint before student data leaves the network',
              explain:
                'Regulatory work is planned and done just in time, not skipped and not front-loaded for the whole programme.',
            },
            {
              id: 'P5Q4A5',
              q: 'How does financial governance on PlaceWise differ from a traditional fixed-scope project?',
              options: [
                'A. Time and cost are fixed; scope is the variable that protects the business case',
                'B. Scope is fixed; time and cost expand until every faculty request is built',
                'C. There is no financial governance on agile projects',
                'D. Helen must approve every story’s cost to the nearest pound mid-Sprint',
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
              id: 'P5Q4B1',
              q: 'Which 2 events give Helen enough control without a weekly 40-page report?',
              options: [
                'A. Increment Reviews with a working Nursing rehearsal',
                'B. A short, visible Delivery Plan and risk commentary',
                'C. Daily personal status emails from every developer to Helen',
                'D. Cancelling Sprint Reviews so nothing incomplete is seen',
                'E. A benefits audit in week 2 of Foundations',
              ],
              correct: [
                'A. Increment Reviews with a working Nursing rehearsal',
                'B. A short, visible Delivery Plan and risk commentary',
              ],
              explain:
                'Demonstrate Control with working software and a thin, honest plan — not theatre or hidden work.',
            },
            {
              id: 'P5Q4B2',
              q: 'Which 2 tailoring actions help two Scrum teams stay one AgilePM project?',
              options: [
                'A. Shared increment goals set with Idris and Samira',
                'B. A dependency board reviewed in the multi-team planning event',
                'C. Separate visions that contradict each other',
                'D. Different DBS/data-sharing bars in each team’s Definition of Done',
                'E. No Product Owner because Jo will write every story',
              ],
              correct: [
                'A. Shared increment goals set with Idris and Samira',
                'B. A dependency board reviewed in the multi-team planning event',
              ],
              explain:
                'Multi-team control is shared goals plus explicit dependency management.',
            },
            {
              id: 'P5Q4B3',
              q: 'Which 2 statements about tracking in a Sprint timebox are appropriate?',
              options: [
                'A. Daily Scrum inspects whether the Sprint Goal is still in reach',
                'B. Unfinished Should Haves can leave the Sprint without failing Increment 1 if Musts remain on track',
                'C. Progress is reported only as percentage of documents signed',
                'D. Once a Sprint starts, no one may mention a new St Kilda date',
                'E. Tracking is Registry’s job and teams should not look at the board',
              ],
              correct: [
                'A. Daily Scrum inspects whether the Sprint Goal is still in reach',
                'B. Unfinished Should Haves can leave the Sprint without failing Increment 1 if Musts remain on track',
              ],
              explain:
                'Inspect and adapt inside the Sprint; increment success is the Must Have set, not every Should.',
            },
            {
              id: 'P5Q4B4',
              q: 'Which 2 work-products support regulatory compliance without destroying agility?',
              options: [
                'A. A DPIA sized to partner export, built inside a Sprint',
                'B. An auditable DBS and data-sharing history on placement records (already a Must Have quality attribute)',
                'C. A 200-page compliance strategy covering features that will not exist for a year',
                'D. Verbal Data Protection approval with no record',
                'E. Deleting logs after each Sprint to “stay lightweight”',
              ],
              correct: [
                'A. A DPIA sized to partner export, built inside a Sprint',
                'B. An auditable DBS and data-sharing history on placement records (already a Must Have quality attribute)',
              ],
              explain:
                'Just-enough, just-in-time evidence. Quality attributes that are Musts stay in the solution.',
            },
            {
              id: 'P5Q4B5',
              q: 'Which 2 responses to the deans’ five-week extension request demonstrate control?',
              options: [
                'A. Keep 1 September; offer Education a place in Increment 2 with a visible date',
                'B. Explain that extra scope is paid for by dropping Should/Could, not by stretching time',
                'C. Agree the extension quietly so Helen is not worried',
                'D. Cancel Increment Reviews until Education is also live',
                'E. Declare quality optional so everything fits',
              ],
              correct: [
                'A. Keep 1 September; offer Education a place in Increment 2 with a visible date',
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
              id: 'P5Q4C1',
              q: 'Jo convenes a two-hour increment planning event so Match, Comply and Samira sequence the August St Kilda feed.',
              correct: 'C',
              explain: 'That is the multi-team planning tailoring v3 expects.',
            },
            {
              id: 'P5Q4C2',
              q: 'Helen is shown a working Nursing rehearsal and a one-page increment forecast, not a 40-page pack.',
              correct: 'B',
              explain: 'Tracking by working solution plus a thin forecast is Demonstrate Control.',
            },
            {
              id: 'P5Q4C3',
              q: 'The Delivery Plan still shows three increments and a fixed 1 September Increment 1 date.',
              correct: 'A',
              explain: 'Horizon-appropriate planning, dates held.',
            },
            {
              id: 'P5Q4C4',
              q: 'Partner data cannot leave the network until the DPIA story meets its acceptance criteria.',
              correct: 'D',
              explain: 'Compliance integrated as real work, not a side process.',
            },
            {
              id: 'P5Q4C5',
              q: 'Jo agrees the five-week extension in a corridor so Education can join Increment 1.',
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
              id: 'P5Q4D1',
              assertion:
                'Jo should keep the increment timebox and publish a revised feature forecast that drops or slips the data-sharing portal.',
              reason:
                'In AgilePM, control is exercised by changing scope inside a fixed time and cost box.',
              correct: 'A',
              explain: 'Both true and the reason is why the assertion is the right control action.',
            },
            {
              id: 'P5Q4D2',
              assertion:
                'Comply should stay idle until the press office finishes its partner pack.',
              reason:
                'Teams demonstrate control by progressing Must Have work and making blockers visible.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P5Q4D3',
              assertion:
                'The 18 August feed date should appear on the shared dependency board before the next multi-team planning event.',
              reason:
                'Cross-team dependencies are controlled by making them explicit in project-level planning, not inside one team’s private chat.',
              correct: 'A',
              explain: 'Both true and linked.',
            },
            {
              id: 'P5Q4D4',
              assertion:
                'Helen should receive the week-6 rehearsal as evidence of progress even though two Musts remain.',
              reason:
                'A working solution that is not yet complete is still a better control signal than a status report about documents.',
              correct: 'A',
              explain: 'Both true — incomplete working software is still the primary measure.',
            },
            {
              id: 'P5Q4D5',
              assertion:
                'Financial governance requires Jo to request another £180k so Education can join Increment 1.',
              reason:
                'AgilePM financial governance holds the cost box and asks which features no longer fit.',
              correct: 'D',
              explain: 'Assertion false (do not bust the OfS envelope for extra scope). Reason true.',
            },
          ],
        },
      ],
    },
  ],
}
