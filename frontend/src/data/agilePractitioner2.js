// Original Practitioner Paper 2 — North Quay Logistics.
// Official 80-line booklet layout. Not copied from any APMG sample.

const scenario = {
  title: 'Project Scenario — North Quay Logistics',
  sections: [
    {
      heading: 'The organisation',
      body: 'North Quay Logistics is a regional freight firm running three depots — Riverside, Fenland and Dockside. Each depot still uses a different warehouse tool: a 2011 barcode suite, a site-built putaway database, and night-sort spreadsheets at Fenland. Mis-scans sit at 4.2%. The CFO has funded a single warehouse platform so inbound and outbound share one stock picture, every carton is scanned to an agreed accuracy bar, and Health & Safety can evidence dock-lock and exclusion-zone controls before peak Christmas traffic.',
    },
    {
      heading: 'The project',
      body: 'Project name: DockOne. Outcome required: one live warehouse platform at all three depots, with scan-accuracy evidence and health-and-safety interlocks on every active bay. The first increment must be in service at Riverside before 15 November so Christmas peak is not run on three tools. Total cost is fixed at £2.1m. Calendar time is fixed by that go-live. Scan accuracy and health-and-safety standards are treated as fixed quality. Features will be prioritised with MoSCoW.\n\nTwo Scrum delivery teams will work in two-week Sprints: Inbound (goods-in, putaway, dock safety) and Outbound (pick, pack, despatch). A shared Solution Architect owns technical integrity across both Product Backlogs. The firm has not run a multi-team AgilePM project or a three-depot cutover before.',
    },
    {
      heading: 'Named roles',
      body: 'Business Sponsor: Mei Chen, CFO — funds the project and chairs the steering group.\nBusiness Visionary: Tomasz Wójcik, Operations Director — owns the business vision and Must Have outcome.\nProject Manager: Aisha Rahman — enables delivery, planning and control across both teams.\nSolution Architect: Dev Patel.\nProduct Owner: Nina Cole.\nBusiness Ambassador: Jonny Pike, warehouse lead, full-time with the teams.\nBusiness Advisor: Karim Adey, Health & Safety.\nWorkshop Facilitator: used when Aisha is not the right independent chair.\nScrum Masters: one per delivery team.',
    },
    {
      heading: 'Constraints and known issues',
      body: 'Fenland’s night sort still runs on spreadsheets. Several shift managers want a complete specification signed before any Sprint starts. The handheld vendor will only offer a firmware-unlock window in late October. Karim has said any dock-lock change must have a signed method statement before live traffic uses that bay. Mei will not move the 15 November Riverside go-live or increase the £2.1m envelope. Procurement has asked for a frozen specification as a contract schedule.',
    },
    {
      heading: 'Outline delivery',
      body: 'Increment 1 (to 15 November): Riverside live for receive / putaway and pick / despatch against the existing SKU master. Scan-accuracy checks and dock-lock interlocks sit in the Definition of Done. A cycle-count dashboard is Should Have. Carrier-API auto-booking is Could Have.\nIncrement 2: Fenland and Dockside cut over.\nIncrement 3: peak analytics and a customer OTIF pack.\nA high-level Delivery Plan exists. Fine detail is left for Sprint Planning. Foundations lasted four weeks and produced a Prioritised Requirements List, Solution Architecture Definition, and a Project Approach Questionnaire that flagged a first-time multi-site cutover, thin night-shift availability, and procurement’s wish to freeze the specification.',
    },
  ],
}

const extraIncrement1 = {
  title: 'Additional information — mid Increment 1',
  body: 'Week 6 of Increment 1. Inbound has finished 4 of 6 Must Have receive / putaway stories and has a working Riverside pilot on the rehearsal dock. Outbound has not started the cycle-count dashboard because Nina is waiting for a “full stock-integrity strategy” from Finance. Two Fenland shift managers have asked Aisha to extend Increment 1 by five weeks so the night-sort can join the same go-live. Dev has found that the handheld firmware unlock will not be available until 28 October — inside the last Sprint of Increment 1. Jonny is being pulled back to the night sort three evenings a week.',
}

const extraPaq = {
  title: 'Additional information — Project Approach Questionnaire extracts',
  body: 'PAQ statements the team marked Amber or Red in Foundations:\n1. Business roles can be made available at the level the project needs — Amber (Fenland night supervisors can offer two hours after 02:00).\n2. The solution can be delivered incrementally — Green.\n3. A first multi-site cutover can be planned and resourced — Amber (the firm has never switched three depots onto one platform).\n4. The wider organisation understands that detailed specifications will emerge — Amber (procurement issued a 70-page specification as a contract schedule and wants it frozen).\n5. Empowered teams can make day-to-day decisions — Green (Karim will attend Sprint Reviews; dock-lock method statements remain a named Advisor product).',
}

export const PRACTITIONER_PAPER_2 = {
  id: 'pract2',
  title: 'Practitioner Paper 2',
  project: 'North Quay Logistics — DockOne',
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
            'Answer the following questions about balancing Time, Cost, Quality and Features on DockOne. Choose one option from A to D for each question.',
          extra: null,
          items: [
            {
              id: 'P2Q1A1',
              q: 'Mei has locked 15 November and £2.1m. Karim will not sign a bay that fails the scan-accuracy or dock-lock bar. A Fenland supervisor still wants every local pick-path in the first go-live. What should DockOne treat as contingency?',
              options: [
                'A. Slip Christmas peak into January if putaway stories overrun',
                'B. Ask Mei for a top-up each time a Should Have looks tight',
                'C. Switch off dock-lock tests in the last Sprint so more pick-paths fit',
                'D. Hold Musts as the Minimum Usable Subset and drop Should/Could first',
              ],
              correct:
                'D. Hold Musts as the Minimum Usable Subset and drop Should/Could first',
              explain:
                'AgilePM fixes time, cost and quality. MoSCoW features are the contingency.',
            },
            {
              id: 'P2Q1A2',
              q: 'Why should Aisha reject a proposal to “relax health-and-safety for two weeks” so Fenland can share Riverside’s date?',
              options: [
                'A. Quality is only discussed in Pre-Project',
                'B. Never Compromise Quality — agreed H&S and scan-accuracy stay in Done; scope flexes instead',
                'C. Only Dev may waive quality, and only after Deployment',
                'D. A Sponsor waiver is enough to drop safety from Done',
              ],
              correct:
                'B. Never Compromise Quality — agreed H&S and scan-accuracy stay in Done; scope flexes instead',
              explain:
                'Principle 4 keeps agreed quality fixed. Extra depot scope is paid for by features, not by dropping safety.',
            },
            {
              id: 'P2Q1A3',
              q: 'A vendor offers a 3D warehouse fly-through that would consume Sprint 2. What should Tomasz do?',
              options: [
                'A. Accept it to keep the vendor relationship warm',
                'B. Decline it because it does not serve a live, safe Riverside service by 15 November',
                'C. Relabel it Must Have so the teams cannot drop it',
                'D. Freeze receive/putaway work until the fly-through is finished',
              ],
              correct:
                'B. Decline it because it does not serve a live, safe Riverside service by 15 November',
              explain:
                'Focus on the Business Need keeps effort on the outcome that justified DockOne.',
            },
            {
              id: 'P2Q1A4',
              q: 'Foundations produced a PRL, SAD and PAQ but not field-level Fenland rules. Which principle should Aisha cite when a buyer demands those rules now?',
              options: [
                'A. Communicate Continuously and Clearly — because artifacts are banned',
                'B. Build Incrementally from Firm Foundations — enough shared understanding to start; detail waits for the last responsible moment',
                'C. Deliver on Time — Foundations must always last exactly four weeks',
                'D. Demonstrate Control — only a Gantt baseline is allowed before Delivery',
              ],
              correct:
                'B. Build Incrementally from Firm Foundations — enough shared understanding to start; detail waits for the last responsible moment',
              explain:
                'Principle 5 wants a high-level foundation, then incremental build. Fenland detail belongs later.',
            },
            {
              id: 'P2Q1A5',
              q: 'Procurement claims “agile means DockOne has no products, only people”. How should Aisha describe the framework?',
              options: [
                'A. Process, People, Project Artifacts and Practices, underpinned by common sense and pragmatism',
                'B. People and Sprints only — artifacts contradict agility',
                'C. Practices replace the need for named roles such as Visionary',
                'D. Project Artifacts appear only after the Christmas peak',
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
            'Each question contains options about DockOne. Remember to select 2 answers to each question. Both must be correct to score the mark.',
          extra: null,
          items: [
            {
              id: 'P2Q1B1',
              q: 'The handheld vendor will only unlock firmware in late October. Which 2 actions should the teams take?',
              options: [
                'A. Treat the window as a timebox and pull only Must Have scanner work into the Sprint that covers it',
                'B. Move 15 November as soon as the vendor names a day',
                'C. Put the unlock on the shared backlog with acceptance criteria Dev and the vendor can see',
                'D. Leave the constraint unspoken until Deployment',
                'E. Drop health-and-safety tests to make room for flashing devices',
              ],
              correct: [
                'A. Treat the window as a timebox and pull only Must Have scanner work into the Sprint that covers it',
                'C. Put the unlock on the shared backlog with acceptance criteria Dev and the vendor can see',
              ],
              explain:
                'Deliver on Time and Collaborate. Do not slip the increment or trade quality to hide a known constraint.',
            },
            {
              id: 'P2Q1B2',
              q: 'Which 2 actions should put Collaborate into practice on the warehouse floor?',
              options: [
                'A. Keep Jonny with Inbound and Outbound so bay decisions are made inside the Sprint',
                'B. Let Aisha write every acceptance criterion so supervisors are left on the sort',
                'C. Bring Tomasz and Dev to Sprint Reviews so value and integrity are inspected together',
                'D. Keep Karim away until go-live so H&S “does not slow the teams”',
                'E. Forbid Outbound from talking to Inbound until Increment 3',
              ],
              correct: [
                'A. Keep Jonny with Inbound and Outbound so bay decisions are made inside the Sprint',
                'C. Bring Tomasz and Dev to Sprint Reviews so value and integrity are inspected together',
              ],
              explain:
                'Collaboration needs empowered business and solution roles working together throughout, not after go-live.',
            },
            {
              id: 'P2Q1B3',
              q: 'Time, cost and quality are fixed on DockOne. Which 2 statements should guide contingency?',
              options: [
                'A. Should Have and Could Have items are the buffer if estimates prove optimistic',
                'B. The Must Have set must remain a genuine Minimum Usable Subset',
                'C. Contingency is created by leaving scan accuracy undefined',
                'D. Contingency is created by hiding spare weeks in a private diary',
                'E. Every requested pick-path should be labelled Must Have',
              ],
              correct: [
                'A. Should Have and Could Have items are the buffer if estimates prove optimistic',
                'B. The Must Have set must remain a genuine Minimum Usable Subset',
              ],
              explain:
                'MoSCoW only works if Musts are true Musts and lower priorities can be dropped without failing the business case.',
            },
            {
              id: 'P2Q1B4',
              q: 'Which 2 statements should apply “build incrementally from firm foundations” to DockOne?',
              options: [
                'A. A live Riverside increment can earn value before Fenland and Dockside cut over',
                'B. Foundations should have pixel-specified every night-sort spreadsheet column',
                'C. The four-week Foundations existed to share problem, solution and risk at a high level',
                'D. Incremental delivery is allowed only if the whole £2.1m is spent in month one',
                'E. Once Delivery starts, Foundations products can never be refreshed',
              ],
              correct: [
                'A. A live Riverside increment can earn value before Fenland and Dockside cut over',
                'C. The four-week Foundations existed to share problem, solution and risk at a high level',
              ],
              explain:
                'Early increments release value. Foundations stay high-level and may be refreshed between increments if the next slice needs it.',
            },
            {
              id: 'P2Q1B5',
              q: 'Which 2 leadership moves should be treated as undermining AgilePM’s philosophy here?',
              options: [
                'A. Mei requires her personal sign-off on every Sprint story',
                'B. Tomasz restates the vision and then lets the teams inspect and adapt',
                'C. Aisha replaces Sprint Reviews with a monthly slide pack so “the floor is not disturbed”',
                'D. Dev explains architectural constraints in planning so teams can choose knowingly',
                'E. Jonny stays on the dock answering warehouse questions as they arise',
              ],
              correct: [
                'A. Mei requires her personal sign-off on every Sprint story',
                'C. Aisha replaces Sprint Reviews with a monthly slide pack so “the floor is not disturbed”',
              ],
              explain:
                'The philosophy needs empowered people and frequent demonstration of a working solution, not command-and-control or hidden progress.',
            },
          ],
        },
        {
          id: 'C',
          type: 'matching',
          marks: 5,
          instruction:
            'Column 1 lists actions proposed on DockOne. For each action, select from Column 2 the AgilePM principle it best applies. Each selection from Column 2 can be used once, more than once or not at all.',
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
              id: 'P2Q1C1',
              q: 'Aisha puts a one-page increment forecast and open constraints on the wall before Mei’s steering group.',
              correct: 'E',
              explain: 'Demonstrate Control makes progress and threats visible to those who govern the project.',
            },
            {
              id: 'P2Q1C2',
              q: 'Tomasz stops a customer OTIF mock-up that would delay Riverside receive before 15 November.',
              correct: 'A',
              explain: 'Protecting the outcome that justified the project is Focus on the Business Need.',
            },
            {
              id: 'P2Q1C3',
              q: 'The Increment 1 end-date stays 15 November when Fenland asks to join the same night.',
              correct: 'B',
              explain: 'Deliver on Time treats the timebox as immovable; scope changes instead.',
            },
            {
              id: 'P2Q1C4',
              q: 'Scan-accuracy and dock-lock checks stay in the Definition of Done during a squeezed Sprint.',
              correct: 'C',
              explain: 'Never Compromise Quality keeps agreed standards inside Done.',
            },
            {
              id: 'P2Q1C5',
              q: 'Jonny runs a 15-minute dock huddle and a wall board instead of a weekly email essay.',
              correct: 'D',
              explain: 'Communicate Continuously and Clearly prefers frequent, low-ceremony channels.',
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
              id: 'P2Q1D1',
              assertion:
                'Aisha should hold 15 November and place Fenland in Increment 2 rather than grant the five-week stretch.',
              reason:
                'AgilePM fixes the increment timebox and uses feature priority, not elapsed time, as the main contingency.',
              correct: 'A',
              explain:
                'Both true, and the reason is why the assertion is right: extra depot scope does not buy a longer box.',
            },
            {
              id: 'P2Q1D2',
              assertion:
                'Nina should halt Inbound’s remaining Musts until Finance publish a stock-integrity strategy.',
              reason:
                'A Should Have may be dropped from the increment, but that is not a reason to freeze Must Have delivery.',
              correct: 'D',
              explain:
                'Assertion false — remaining receive/putaway Musts should continue. Reason true.',
            },
            {
              id: 'P2Q1D3',
              assertion:
                'Losing Jonny three evenings a week should be treated as the PAQ availability amber coming true.',
              reason:
                'Without an empowered Ambassador in the cadence, day-to-day decisions revert to hand-offs.',
              correct: 'A',
              explain:
                'Both true and linked: business-role availability is a Project Approach issue.',
            },
            {
              id: 'P2Q1D4',
              assertion:
                'Dev should wait until the December steering pack to mention the 28 October unlock.',
              reason:
                'Demonstrate Control requires increment-threatening constraints to be made visible as soon as they are known.',
              correct: 'D',
              explain:
                'Assertion false — hiding the date is the opposite of control. Reason true.',
            },
            {
              id: 'P2Q1D5',
              assertion:
                'The rehearsal-dock pilot should be treated as the main progress signal for Increment 1.',
              reason:
                'AgilePM judges progress by a working solution inspected frequently, not by documents completed.',
              correct: 'A',
              explain:
                'Both true and the reason explains the assertion — a rehearsal bay is a working solution.',
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
            'Answer the following questions about risk and the Project Approach on DockOne. Choose one option from A to D.',
          extra: extraPaq,
          items: [
            {
              id: 'P2Q2A1',
              q: 'Read the PAQ extract. Which threat should Aisha log as environmental VUCA rather than a way-of-working risk?',
              options: [
                'A. Procurement wants the 70-page schedule frozen',
                'B. Fenland night supervisors can spare only two hours after 02:00',
                'C. A sudden fuel-price spike reroutes inbound trailers in the week after go-live',
                'D. The firm has never cut three depots onto one platform',
              ],
              correct:
                'C. A sudden fuel-price spike reroutes inbound trailers in the week after go-live',
              explain:
                'Fuel-price shock is environmental VUCA. The others are choices or capabilities in how the project is run.',
            },
            {
              id: 'P2Q2A2',
              q: 'Procurement wants the 70-page schedule treated as frozen. What should Aisha do first to protect agility?',
              options: [
                'A. Replace Scrum with a detailed Gantt so buyers feel comfortable',
                'B. Explain that the schedule is a starting backlog, not a locked specification, and keep Musts as a Minimum Usable Subset',
                'C. Archive the PAQ because Foundations is over',
                'D. Promote every line in the schedule to Must Have',
              ],
              correct:
                'B. Explain that the schedule is a starting backlog, not a locked specification, and keep Musts as a Minimum Usable Subset',
              explain:
                'The amber line is organisational misunderstanding of emergent detail. Fix the approach; do not abandon agility.',
            },
            {
              id: 'P2Q2A3',
              q: 'Why should DockOne not stand up a second monthly RAID board as its main risk system?',
              options: [
                'A. Agile projects have no risks',
                'B. Short increments, visible progress, empowered roles and the PAQ already surface and mitigate risk in everyday management',
                'C. Only the PMO may record risk, so the teams should stay silent',
                'D. All residual risk sits with the handheld vendor',
              ],
              correct:
                'B. Short increments, visible progress, empowered roles and the PAQ already surface and mitigate risk in everyday management',
              explain:
                'Disciplined AgilePM is the risk process. A duplicate bureaucracy is usually unnecessary.',
            },
            {
              id: 'P2Q2A4',
              q: 'Fenland night-sort decisions currently wait until Jonny is back on days. What should the project do?',
              options: [
                'A. Drop the night sort from the programme to go faster',
                'B. Accept that no Fenland decision can occur inside a Sprint',
                'C. Name a night-shift deputy with decision rights so warehouse calls happen at Sprint pace',
                'D. Let Inbound invent Fenland putaway rules without an Ambassador',
              ],
              correct:
                'C. Name a night-shift deputy with decision rights so warehouse calls happen at Sprint pace',
              explain:
                'Tailor the approach so authority sits with the team, not a next-day queue that recreates waterfall gates.',
            },
            {
              id: 'P2Q2A5',
              q: 'When should Aisha reopen the PAQ rather than leave it as a Foundations souvenir?',
              options: [
                'A. When increment plans change or a new approach risk appears',
                'B. Never — a completed PAQ must stay frozen',
                'C. Only to flip Green lines to Red before steering',
                'D. Only Mei is allowed to read it, and only after Deployment',
              ],
              correct:
                'A. When increment plans change or a new approach risk appears',
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
              id: 'P2Q2B1',
              q: 'Which 2 actions should mitigate the Amber night-shift availability line?',
              options: [
                'A. Appoint a night deputy Ambassador with decision rights when Jonny is on days',
                'B. Park all Fenland analysis until Increment 3 “when nights are quiet”, with no plan',
                'C. Timebox night-sort workshops in Foundations or early Delivery and protect those slots',
                'D. Require every night clerk to attend Daily Scrum after their shift',
                'E. Run Fenland as a separate waterfall stream so no Ambassador is needed',
              ],
              correct: [
                'A. Appoint a night deputy Ambassador with decision rights when Jonny is on days',
                'C. Timebox night-sort workshops in Foundations or early Delivery and protect those slots',
              ],
              explain:
                'Make the role real: authority plus protected time. Do not invent a second lifecycle or abandon the depot.',
            },
            {
              id: 'P2Q2B2',
              q: 'Which 2 statements should Aisha use when explaining VUCA versus approach risk to Mei?',
              options: [
                'A. A storm closing the estuary channel is largely environmental / VUCA',
                'B. Insisting the 70-page schedule cannot change is approach-derived',
                'C. Every risk on an agile project is approach-derived',
                'D. VUCA cannot be mentioned until Deployment',
                'E. Approach risk is recorded only after the Christmas peak',
              ],
              correct: [
                'A. A storm closing the estuary channel is largely environmental / VUCA',
                'B. Insisting the 70-page schedule cannot change is approach-derived',
              ],
              explain:
                'VUCA comes from the environment. Approach risk comes from how we choose to run the project.',
            },
            {
              id: 'P2Q2B3',
              q: 'Shift managers keep labelling local pick-paths as Must Have. Which 2 actions should Aisha take?',
              options: [
                'A. Run the test: “If this path is missing, do we cancel DockOne?”',
                'B. Ask Tomasz to own the Must Have set as the Minimum Usable Subset',
                'C. Accept every Must so the floor stays calm',
                'D. Move 15 November to absorb every path',
                'E. Stop using Should Have as a priority',
              ],
              correct: [
                'A. Run the test: “If this path is missing, do we cancel DockOne?”',
                'B. Ask Tomasz to own the Must Have set as the Minimum Usable Subset',
              ],
              explain:
                'The Visionary owns the outcome. Musts that fail the cancel-the-project test are not Musts.',
            },
            {
              id: 'P2Q2B4',
              q: 'Which 2 practices should carry risk without a parallel RAID bureaucracy?',
              options: [
                'A. Increment Reviews and the Delivery Plan already expose threats to the 15 November outcome',
                'B. A short, living risk commentary can sit with the plan',
                'C. A 40-page register updated monthly replaces Sprint Reviews',
                'D. Risks may be spoken only in steering, never in Daily Scrum',
                'E. The PAQ is discarded once Delivery starts',
              ],
              correct: [
                'A. Increment Reviews and the Delivery Plan already expose threats to the 15 November outcome',
                'B. A short, living risk commentary can sit with the plan',
              ],
              explain:
                'Discipline inside AgilePM is the risk process. Extra theatre is optional, not required.',
            },
            {
              id: 'P2Q2B5',
              q: 'DockOne has never cut three depots or run two Scrum teams together. Which 2 tailoring choices should Aisha make?',
              options: [
                'A. A regular multi-team planning event so Inbound and Outbound sequence shared work',
                'B. Dev holds one Solution Architecture Definition both teams respect',
                'C. Each team invents its own Done bar with no shared scan-accuracy standard',
                'D. Ban cross-team talk to cut meetings',
                'E. Give Aisha both Scrum Master seats so nobody else leads',
              ],
              correct: [
                'A. A regular multi-team planning event so Inbound and Outbound sequence shared work',
                'B. Dev holds one Solution Architecture Definition both teams respect',
              ],
              explain:
                'Shared architecture and an explicit planning event manage multi-team risk; isolation and role-hoarding do not.',
            },
          ],
        },
        {
          id: 'C',
          type: 'matching',
          marks: 5,
          instruction:
            'For each DockOne observation in Column 1, select from Column 2 the best description. Each selection can be used once, more than once or not at all.',
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
              id: 'P2Q2C1',
              q: 'A rival haulier opens overnight and steals a slice of peak volume.',
              correct: 'A',
              explain: 'Competitor shock is environmental VUCA, not a choice about how DockOne is run.',
            },
            {
              id: 'P2Q2C2',
              q: 'Night supervisors have no decision rights inside the Sprint cadence.',
              correct: 'B',
              explain: 'Withholding authority from the people who must decide is an approach choice.',
            },
            {
              id: 'P2Q2C3',
              q: 'After a failed rehearsal weekend Aisha and Tomasz retune the multi-site amber and add a second dress-rehearsal.',
              correct: 'C',
              explain: 'Using the PAQ to reshape the approach is what the questionnaire is for.',
            },
            {
              id: 'P2Q2C4',
              q: 'The PMO laminates the Foundations scores and forbids any later change of rating.',
              correct: 'D',
              explain: 'A frozen scorecard is not a living Project Approach Questionnaire.',
            },
            {
              id: 'P2Q2C5',
              q: 'The canteen changes its pie supplier in the Riverside mess.',
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
              id: 'P2Q2D1',
              assertion:
                'The Amber multi-site cutover line should stay on Aisha’s increment agenda.',
              reason:
                'An organisation that has never switched three depots needs extra rehearsal in the approach, not hope.',
              correct: 'A',
              explain: 'Both true and connected — that is why the PAQ line exists.',
            },
            {
              id: 'P2Q2D2',
              assertion:
                'Because incremental delivery is Green, Aisha should stop producing an increment-level Delivery Plan.',
              reason:
                'A Green PAQ answer means the team understands the principle; it is not a licence to drop planning products.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P2Q2D3',
              assertion:
                'Aisha should keep walking the Amber procurement line at increment planning.',
              reason:
                'Incremental delivery was rated Green in Foundations.',
              correct: 'B',
              explain:
                'Both statements are true, but a Green incremental-delivery line does not explain why the frozen-spec amber must stay visible.',
            },
            {
              id: 'P2Q2D4',
              assertion:
                'Aisha should insert a waterfall gate after every Sprint because three PAQ lines are Amber.',
              reason:
                'Amber PAQ items are closed by tailoring AgilePM, not by installing a second lifecycle.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P2Q2D5',
              assertion:
                'Procurement’s wish to freeze the 70-page schedule should be recorded as approach risk.',
              reason:
                'Approach risk cannot exist until after Deployment.',
              correct: 'C',
              explain:
                'Assertion true — a frozen spec is a way-of-working choice. Reason false — the PAQ exists to catch this in Foundations.',
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
            'Answer the following questions about requirements, backlogs and estimating on DockOne. Choose one option from A to D.',
          extra: null,
          items: [
            {
              id: 'P2Q3A1',
              q: 'How should DockOne organise work from Tomasz’s outcome down to a two-week Sprint?',
              options: [
                'A. Project outcome and goals, a Solution/Product Backlog, increment slices, then Sprint Backlogs',
                'B. One Sprint Backlog that lists every Fenland night-sort field for the whole programme',
                'C. A Gantt only — AgilePM does not use backlogs',
                'D. A Benefits Assessment that replaces backlogs after Foundations',
              ],
              correct:
                'A. Project outcome and goals, a Solution/Product Backlog, increment slices, then Sprint Backlogs',
              explain:
                'v3 organises work as goals / solution / increments / sprint-level items, with detail rising as the horizon nears.',
            },
            {
              id: 'P2Q3A2',
              q: 'When should Inbound write field-level validation for Fenland’s night-sort cutover?',
              options: [
                'A. In Pre-Project, before Mei releases funds',
                'B. In Foundations, for every later increment',
                'C. At the last responsible moment — typically the Sprint that will build Increment 2',
                'D. After Deployment, so clerks invent rules on a live bay',
              ],
              correct:
                'C. At the last responsible moment — typically the Sprint that will build Increment 2',
              explain:
                'Detailed analysis is deferred until it is about to be used. Fenland is not Increment 1.',
            },
            {
              id: 'P2Q3A3',
              q: 'What estimating grain should Foundations use to test the £2.1m / 15 November box?',
              options: [
                'A. Hour-level tasks for every Fenland clerk screen',
                'B. Coarse ranges good enough to shape increments and see whether the box still holds',
                'C. No numbers at all, because agile forbids estimates',
                'D. A two-decimal fixed quote for the Increment 3 OTIF pack',
              ],
              correct:
                'B. Coarse ranges good enough to shape increments and see whether the box still holds',
              explain:
                'Estimating matches the lifecycle phase: coarse in Foundations, finer in Sprint Planning.',
            },
            {
              id: 'P2Q3A4',
              q: 'Cycle-count is Should Have for Increment 1. If the firmware unlock consumes the last Sprint, what should Nina do?',
              options: [
                'A. Keep cycle-count in or declare the increment failed',
                'B. Drop cycle-count from Increment 1; the Minimum Usable Subset can still be met',
                'C. Promote cycle-count to Must Have automatically in week 6',
                'D. Forbid any cycle-count work until Increment 3',
              ],
              correct:
                'B. Drop cycle-count from Increment 1; the Minimum Usable Subset can still be met',
              explain:
                'Should Haves are intended contingency. Increment 1 still succeeds if safe Riverside flow is done.',
            },
            {
              id: 'P2Q3A5',
              q: 'Who should apply the test “would we cancel DockOne without this item?” to a claimed Must Have?',
              options: [
                'A. Any developer who likes the feature',
                'B. The handheld vendor',
                'C. Tomasz as Business Visionary, with the teams challenging false Musts',
                'D. The Workshop Facilitator acting alone',
              ],
              correct:
                'C. Tomasz as Business Visionary, with the teams challenging false Musts',
              explain:
                'The Visionary owns the outcome. Facilitators do not own priority; vendors do not either.',
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
              id: 'P2Q3B1',
              q: 'Which 2 statements correctly apply timeframe-specific MoSCoW on DockOne?',
              options: [
                'A. Cycle-count can be Should Have in Increment 1 and still be Must Have for the finished platform',
                'B. Carrier-API auto-booking can stay Could Have now even if peak customers will want it later',
                'C. Increment MoSCoW must copy project MoSCoW line for line',
                'D. Won’t Have this time is not a valid priority',
                'E. Must Have at increment level means “if someone is free”',
              ],
              correct: [
                'A. Cycle-count can be Should Have in Increment 1 and still be Must Have for the finished platform',
                'B. Carrier-API auto-booking can stay Could Have now even if peak customers will want it later',
              ],
              explain:
                'Priorities are timeframe-specific. What is Must for the finished platform need not be Must for increment one.',
            },
            {
              id: 'P2Q3B2',
              q: 'Inbound is forecasting the next two weeks. Which 2 estimating behaviours should they use?',
              options: [
                'A. The people who will do the work forecast the Sprint Backlog',
                'B. Estimates get finer because those stories are about to be built',
                'C. Aisha issues hour targets the night before and forbids discussion',
                'D. Foundation ranges are reused as if they were task estimates',
                'E. Estimating waits until after the Sprint Review',
              ],
              correct: [
                'A. The people who will do the work forecast the Sprint Backlog',
                'B. Estimates get finer because those stories are about to be built',
              ],
              explain:
                'Phase-appropriate estimating: the delivery team forecasts near-term work in more detail.',
            },
            {
              id: 'P2Q3B3',
              q: 'In week 6, which 2 backlog calls should Nina make?',
              options: [
                'A. Keep remaining Riverside Musts first — four of six is not yet a usable subset',
                'B. Pull Fenland night-sort stories now because shift managers asked',
                'C. Leave cycle-count as Should Have so it can yield if the unlock fills the last Sprint',
                'D. Relabel every unfinished item Must Have',
                'E. Freeze the Product Backlog so nothing can be reordered',
              ],
              correct: [
                'A. Keep remaining Riverside Musts first — four of six is not yet a usable subset',
                'C. Leave cycle-count as Should Have so it can yield if the unlock fills the last Sprint',
              ],
              explain:
                'Protect the Minimum Usable Subset. Use Should Haves as the valve when a constraint appears.',
            },
            {
              id: 'P2Q3B4',
              q: 'Nina is grooming the Solution Backlog. Which 2 items should she keep on it?',
              options: [
                'A. Riverside receive, putaway, pick and despatch against the SKU master',
                'B. Dev’s handheld-firmware spike',
                'C. Aisha’s reminder to buy biscuits for steering',
                'D. Mei’s holiday dates with no project impact',
                'E. A rumour about a rival scanner app',
              ],
              correct: [
                'A. Riverside receive, putaway, pick and despatch against the SKU master',
                'B. Dev’s handheld-firmware spike',
              ],
              explain:
                'Backlogs hold the work of the project — outcomes, stories, spikes — not trivia.',
            },
            {
              id: 'P2Q3B5',
              q: 'What should Nina treat as true of the Minimum Usable Subset for Riverside’s first increment?',
              options: [
                'A. If Riverside cannot receive, put away, pick and despatch safely, the increment has missed its Musts',
                'B. The cycle-count dashboard is not required for Increment 1 to succeed',
                'C. Peak analytics is inside the Increment 1 Minimum Usable Subset',
                'D. The Minimum Usable Subset is whatever is left on 15 November',
                'E. Could Haves are inside the Minimum Usable Subset by definition',
              ],
              correct: [
                'A. If Riverside cannot receive, put away, pick and despatch safely, the increment has missed its Musts',
                'B. The cycle-count dashboard is not required for Increment 1 to succeed',
              ],
              explain:
                'MUS is the Must Have set for that timeframe. Should/Could sit above that line.',
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
              id: 'P2Q3C1',
              q: '“About £2.1m and three increments before peak” used to release funds.',
              correct: 'A',
              explain: 'Coarse numbers to decide whether to start belong in Pre-Project.',
            },
            {
              id: 'P2Q3C2',
              q: 'Riverside first; Fenland and Dockside second; analytics third.',
              correct: 'C',
              explain: 'Slicing outcomes across increments is increment planning.',
            },
            {
              id: 'P2Q3C3',
              q: 'Task-level numbers for the three putaway stories Inbound will close before the next review.',
              correct: 'D',
              explain: 'Sprint Planning is where detailed estimates belong.',
            },
            {
              id: 'P2Q3C4',
              q: 'The four-week Foundations pack: a first PRL plus Dev’s still-coarse Solution Architecture Definition.',
              correct: 'B',
              explain: 'Those are Foundations work-products, still high-level.',
            },
            {
              id: 'P2Q3C5',
              q: 'After peak, did carton mis-scans fall from 4.2% once Riverside, Fenland and Dockside were all live?',
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
              id: 'P2Q3D1',
              assertion:
                'Nina should rank the unfinished Riverside Musts above the cycle-count dashboard.',
              reason:
                'MoSCoW is the valve that sheds lower-priority work when a timebox is tight.',
              correct: 'A',
              explain: 'Both true and linked — that is the point of a Should Have dashboard.',
            },
            {
              id: 'P2Q3D2',
              assertion:
                'Week 6 is the moment to specify Fenland spreadsheet columns because shift managers asked.',
              reason:
                'Detailed analysis waits for the last responsible moment of the increment that will build that slice.',
              correct: 'D',
              explain: 'Assertion false — Fenland is Increment 2. Reason true.',
            },
            {
              id: 'P2Q3D3',
              assertion:
                'Dev’s 28 October unlock should sit inside Increment 1 and may displace Should Have work.',
              reason:
                'A Must Have constraint shares the increment timebox with every other Increment 1 item.',
              correct: 'A',
              explain: 'Both true — the unlock is in the box; cycle-count may lose.',
            },
            {
              id: 'P2Q3D4',
              assertion:
                'Outbound should produce no Increment 1 increment until Finance finish their strategy.',
              reason:
                'An unclear Should Have is a reason to stop all Must Have pick and despatch work.',
              correct: 'E',
              explain:
                'Both false — Outbound should still pursue Musts, and an unclear Should Have is not a licence to idle.',
            },
            {
              id: 'P2Q3D5',
              assertion:
                'Inbound finishing four of six Musts means Riverside already has a Minimum Usable Subset.',
              reason:
                'A Minimum Usable Subset is met only when every Must Have for that timeframe is actually done.',
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
            'Answer the following questions about planning, control and compliance on DockOne. Choose one option from A to D.',
          extra: extraIncrement1,
          items: [
            {
              id: 'P2Q4A1',
              q: 'While both Scrum teams are in Sprints, what planning product should Aisha keep current for Mei?',
              options: [
                'A. A high-level Delivery Plan plus increment goals, not a 400-line Gantt for every remaining week',
                'B. A daily roster that assigns every supervisor hour',
                'C. No plan — agility means improvisation only',
                'D. A Benefits Assessment that replaces the Delivery Plan in week 1',
              ],
              correct:
                'A. A high-level Delivery Plan plus increment goals, not a 400-line Gantt for every remaining week',
              explain:
                'Planning stays appropriate to horizon: increment-level for the project, Sprint Backlogs for the teams.',
            },
            {
              id: 'P2Q4A2',
              q: 'Inbound and Outbound both depend on Dev’s 28 October unlock. What should they do?',
              options: [
                'A. Each team “self-manages” and never mentions the date',
                'B. Surface it in a multi-team planning event and sequence Sprint goals around that window',
                'C. Ask Mei to flash devices on Sundays',
                'D. Duplicate the unlock design in both teams with no shared architecture',
              ],
              correct:
                'B. Surface it in a multi-team planning event and sequence Sprint goals around that window',
              explain:
                'v3 expects Scrum to be tailored with a project-level planning event for cross-team dependencies.',
            },
            {
              id: 'P2Q4A3',
              q: 'Week 6 shows 4 of 6 Musts done and cycle-count untouched. What control action should Aisha take?',
              options: [
                'A. Declare Increment 1 failed and stop DockOne',
                'B. Inspect the increment goal, drop or defer cycle-count, and concentrate both teams on remaining Musts and the unlock',
                'C. Grant the five-week stretch the shift managers asked for',
                'D. Cancel Sprint Reviews and issue a written apology',
              ],
              correct:
                'B. Inspect the increment goal, drop or defer cycle-count, and concentrate both teams on remaining Musts and the unlock',
              explain:
                'Control means respond inside the timebox using priority, not by slipping the date or hiding work.',
            },
            {
              id: 'P2Q4A4',
              q: 'How should Karim’s dock-lock method statement be planned so agility and compliance both survive?',
              options: [
                'A. Ignore it because the project is agile',
                'B. Treat it as a work-product with acceptance criteria and pull it into a Sprint before a bay takes live traffic',
                'C. Write every conceivable H&S paper for Increments 2 and 3 during Foundations',
                'D. Seek approval after Deployment and hope it is retrospective',
              ],
              correct:
                'B. Treat it as a work-product with acceptance criteria and pull it into a Sprint before a bay takes live traffic',
              explain:
                'Regulatory work is just-enough and just-in-time — neither skipped nor front-loaded for the whole programme.',
            },
            {
              id: 'P2Q4A5',
              q: 'Mei asks whether DockOne can expand the £2.1m envelope to absorb Fenland in Increment 1. What should Aisha say about money?',
              options: [
                'A. Time and cost stay fixed; features are the variable that protects the business case',
                'B. Scope stays fixed; time and cost expand until every shift-manager request is built',
                'C. Agile projects have no financial governance',
                'D. Mei must price every story to the nearest pound mid-Sprint',
              ],
              correct:
                'A. Time and cost stay fixed; features are the variable that protects the business case',
              explain:
                'AgilePM holds the time-and-money box and flexes features — the opposite of traditional fixed scope.',
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
              id: 'P2Q4B1',
              q: 'Which 2 signals should give Mei control without a weekly 40-page pack?',
              options: [
                'A. Increment Reviews against the working Riverside rehearsal',
                'B. A short, visible Delivery Plan and risk commentary',
                'C. Daily personal status emails from every developer to Mei',
                'D. Cancelling Sprint Reviews so incomplete work stays hidden',
                'E. A benefits audit in week 2 of Foundations',
              ],
              correct: [
                'A. Increment Reviews against the working Riverside rehearsal',
                'B. A short, visible Delivery Plan and risk commentary',
              ],
              explain:
                'Demonstrate Control with working software and a thin, honest plan — not theatre or hidden work.',
            },
            {
              id: 'P2Q4B2',
              q: 'Inbound and Outbound are both Scrum teams on DockOne. Which 2 actions should keep them one project?',
              options: [
                'A. Shared increment goals set with Tomasz and Dev',
                'B. A dependency board reviewed in the multi-team planning event',
                'C. Separate, conflicting visions for Inbound and Outbound',
                'D. Different scan-accuracy bars in each Definition of Done',
                'E. Drop the Product Owner so Aisha writes every story',
              ],
              correct: [
                'A. Shared increment goals set with Tomasz and Dev',
                'B. A dependency board reviewed in the multi-team planning event',
              ],
              explain:
                'Multi-team control is shared goals plus explicit dependency management.',
            },
            {
              id: 'P2Q4B3',
              q: 'During a two-week Sprint, which 2 tracking behaviours should the Scrum teams use?',
              options: [
                'A. Daily Scrum inspects whether the Sprint Goal is still in reach',
                'B. Unfinished Should Haves can leave the Sprint without failing Increment 1 if Musts stay on track',
                'C. Progress is reported only as the percentage of documents signed',
                'D. Once a Sprint starts, nobody may mention a new firmware date',
                'E. Tracking is the PMO’s job; teams should not look at the board',
              ],
              correct: [
                'A. Daily Scrum inspects whether the Sprint Goal is still in reach',
                'B. Unfinished Should Haves can leave the Sprint without failing Increment 1 if Musts stay on track',
              ],
              explain:
                'Inspect and adapt inside the Sprint; increment success is the Must Have set, not every Should.',
            },
            {
              id: 'P2Q4B4',
              q: 'Karim and the scan-accuracy bar both need evidence. Which 2 products should the teams build just in time?',
              options: [
                'A. A dock-lock method statement sized to the bays going live, built inside a Sprint',
                'B. Scan-accuracy evidence on every carton (already a Must Have quality attribute)',
                'C. A 200-page compliance strategy covering features that will not exist for a year',
                'D. Verbal H&S approval with no record',
                'E. Deleting scan logs after each Sprint to “stay lightweight”',
              ],
              correct: [
                'A. A dock-lock method statement sized to the bays going live, built inside a Sprint',
                'B. Scan-accuracy evidence on every carton (already a Must Have quality attribute)',
              ],
              explain:
                'Just-enough, just-in-time evidence. Quality attributes that are Musts stay in the solution.',
            },
            {
              id: 'P2Q4B5',
              q: 'Fenland wants five extra weeks. Which 2 replies should Aisha give if she is demonstrating control?',
              options: [
                'A. Keep 15 November and publish Fenland as Increment 2 with a visible date',
                'B. Explain that extra scope is paid for by dropping Should/Could, not by stretching time',
                'C. Agree the stretch in a corridor so Mei is not worried',
                'D. Cancel Increment Reviews until Fenland is also live',
                'E. Declare quality optional so everything fits',
              ],
              correct: [
                'A. Keep 15 November and publish Fenland as Increment 2 with a visible date',
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
              id: 'P2Q4C1',
              q: 'Aisha books a two-hour increment planning slot so Inbound, Outbound and Dev sequence the 28 October unlock.',
              correct: 'C',
              explain: 'That is the multi-team planning tailoring v3 expects.',
            },
            {
              id: 'P2Q4C2',
              q: 'Mei walks the rehearsal dock and leaves with a one-page increment forecast.',
              correct: 'B',
              explain: 'Tracking by working solution plus a thin forecast is Demonstrate Control.',
            },
            {
              id: 'P2Q4C3',
              q: 'Aisha’s plan still lists three increments and keeps Riverside’s box ending 15 November.',
              correct: 'A',
              explain: 'Horizon-appropriate planning with the increment date held.',
            },
            {
              id: 'P2Q4C4',
              q: 'No bay takes live traffic until Karim’s method-statement story meets its acceptance criteria.',
              correct: 'D',
              explain: 'Compliance is planned as real work inside the cost and quality box.',
            },
            {
              id: 'P2Q4C5',
              q: 'Aisha agrees the five-week stretch in a corridor so Fenland can join Increment 1.',
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
              id: 'P2Q4D1',
              assertion:
                'Aisha should keep 15 November and reissue a feature forecast that drops or defers cycle-count.',
              reason:
                'AgilePM exercises control by changing scope inside a locked time and cost box.',
              correct: 'A',
              explain: 'Both true and the reason is why the assertion is the right control action.',
            },
            {
              id: 'P2Q4D2',
              assertion:
                'The 28 October firmware date should appear on the shared dependency board before the next multi-team planning event.',
              reason:
                'Cycle-count is a Should Have and may be dropped from Increment 1.',
              correct: 'B',
              explain:
                'Both true, but dropping cycle-count does not explain why a Must Have unlock belongs on the dependency board.',
            },
            {
              id: 'P2Q4D3',
              assertion:
                'Outbound should stay idle until Finance finish the stock-integrity strategy.',
              reason:
                'Teams demonstrate control by progressing Must Have work and making blockers visible.',
              correct: 'D',
              explain: 'Assertion false. Reason true.',
            },
            {
              id: 'P2Q4D4',
              assertion:
                'Mei should inspect the incomplete rehearsal dock as the primary progress evidence at week 6.',
              reason:
                'A partly finished working solution is a stronger control signal than a pack about documents produced.',
              correct: 'A',
              explain: 'Both true — incomplete working software is still the primary measure.',
            },
            {
              id: 'P2Q4D5',
              assertion:
                'Aisha should raise a £300k change request so Fenland night-sort can share Riverside’s go-live.',
              reason:
                'Financial governance on an AgilePM project holds the cost box and asks which features no longer fit.',
              correct: 'D',
              explain: 'Assertion false — extra depot scope does not bust the envelope. Reason true.',
            },
          ],
        },
      ],
    },
  ],
}
