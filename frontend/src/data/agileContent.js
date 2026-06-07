// AgilePM v3 Foundation study content.
// All data here is static, self-contained study material (no external/network
// dependencies). It powers the hidden /agile study area: flashcards, the
// matching game and the mock exams.

// Human-readable names for each syllabus area code.
export const TOPICS = {
  KC: 'Key Concepts',
  SC: 'Scrum Overview',
  AF: 'AgilePM Fundamentals',
  IN: 'Individuals & Interactions',
  CC: 'Collaboration & Communication',
  PR: 'Project Lifecycle Framework',
  ES: 'Requirements, Estimating & Prioritisation',
  PC: 'Planning & Control',
  RK: 'Risk Management & the Project Approach',
  GV: 'Governance, Compliance & Products',
}

// Real exam shape (looked up from APMG): 50 multiple-choice questions,
// 40 minutes, pass mark 60% (30/50), closed book.
export const EXAM_CONFIG = {
  questionCount: 50,
  durationMinutes: 40,
  passMark: 30,
  passPercent: 60,
}

// Approximate topic weighting used to assemble each 50-question mock paper.
// The official syllabus weights some areas more heavily than others; these
// counts sum to 50 and mirror the relative emphasis of the syllabus.
export const EXAM_WEIGHTING = {
  KC: 5,
  SC: 6,
  AF: 5,
  IN: 7,
  CC: 4,
  PR: 5,
  ES: 6,
  PC: 5,
  RK: 3,
  GV: 4,
}

// ---------------------------------------------------------------------------
// Flashcards: { id, topic, front, back }
// ---------------------------------------------------------------------------
export const FLASHCARDS = [
  // Key Concepts
  { id: 'f-kc-1', topic: 'KC', front: 'Definition of Business Agility', back: 'A progressive, people-centric approach to all aspects of business that is transforming how organisations operate and succeed in the modern world — achieved by inspiring, enabling and harnessing collaborative and creative ways of working.' },
  { id: 'f-kc-2', topic: 'KC', front: 'What does VUCA stand for?', back: 'Volatility, Uncertainty, Complexity, Ambiguity.' },
  { id: 'f-kc-3', topic: 'KC', front: 'The 4 Agile Manifesto values (ABC-enhanced)', back: '1) Individuals and interactions over processes and tools; 2) Working solutions over comprehensive documentation; 3) Customer collaboration over contract negotiation; 4) Responding to change over following a plan.' },
  { id: 'f-kc-4', topic: 'KC', front: 'Key enhancement in the ABC version of the Manifesto', back: '"Software" was changed to "Solutions" — broadening it beyond software.' },
  { id: 'f-kc-5', topic: 'KC', front: 'Where and when was the Agile Manifesto created?', back: 'Snowbird, Utah, in 2001 by 17 experts.' },
  { id: 'f-kc-6', topic: 'KC', front: 'Meaning of the Manifesto final sentence', back: '"While there is value in the items on the right, we value the items on the left more." We do not reject the right-side items; they are useful only when they add real value and include just enough detail.' },
  { id: 'f-kc-7', topic: 'KC', front: 'Two contexts of Product Development', back: 'Project Management (PM) and Product Lifecycle Management (PLM).' },
  { id: 'f-kc-8', topic: 'KC', front: 'Characteristics of an agile approach', back: 'Detailed work done at the last responsible moment; iterative (short cycles, feedback); incremental delivery (value gained early).' },

  // Scrum
  { id: 'f-sc-1', topic: 'SC', front: 'Definition of Scrum', back: 'A lightweight framework that helps people, teams and organisations generate value through adaptive solutions for complex problems.' },
  { id: 'f-sc-2', topic: 'SC', front: 'The 5 Scrum Values', back: 'Commitment, Focus, Openness, Respect, Courage.' },
  { id: 'f-sc-3', topic: 'SC', front: 'The 3 Scrum roles', back: 'Product Owner (maximise value, manage Product Backlog), Scrum Master (establish Scrum, team effectiveness, servant leader), Developers (create usable Increment each Sprint).' },
  { id: 'f-sc-4', topic: 'SC', front: 'Scrum Team size & nature', back: '10 or fewer people, cross-functional and self-managing.' },
  { id: 'f-sc-5', topic: 'SC', front: 'The 5 Scrum events and timeboxes', back: 'Sprint (≤1 month), Sprint Planning (max 8 hrs), Daily Scrum (15 min), Sprint Review (max 4 hrs), Sprint Retrospective (max 3 hrs).' },
  { id: 'f-sc-6', topic: 'SC', front: 'Scrum artefacts and their commitments', back: 'Product Backlog → Product Goal; Sprint Backlog → Sprint Goal; Product Increment → Definition of Done.' },
  { id: 'f-sc-7', topic: 'SC', front: 'The 3 pillars of empiricism', back: 'Transparency, Inspection, Adaptation. Scrum is founded on empiricism and lean thinking.' },
  { id: 'f-sc-8', topic: 'SC', front: 'Sprint Planning topics', back: 'Why (Sprint Goal), What (PBIs selected), How (the plan).' },
  { id: 'f-sc-9', topic: 'SC', front: 'When is an Increment "born"?', back: 'When a Product Backlog Item meets the Definition of Done.' },

  // AgilePM Fundamentals
  { id: 'f-af-1', topic: 'AF', front: 'AgilePM philosophy', back: 'Best value emerges when projects are aligned to clear goals, deliver frequently and involve the collaboration of motivated and empowered people.' },
  { id: 'f-af-2', topic: 'AF', front: 'The 4 project variables', back: 'Time, Cost, Quality, Features.' },
  { id: 'f-af-3', topic: 'AF', front: 'What does AgilePM fix vs vary?', back: 'Fixes Time, Cost and Quality; varies Features. (Traditional fixes Features and varies Time/Cost.)' },
  { id: 'f-af-4', topic: 'AF', front: 'The 8 AgilePM Principles', back: '1) Focus on the Business Need; 2) Deliver on Time; 3) Collaborate; 4) Never Compromise Quality; 5) Build Incrementally from Firm Foundations; 6) Develop Iteratively; 7) Communicate Continuously and Clearly; 8) Demonstrate Control.' },
  { id: 'f-af-5', topic: 'AF', front: "Parkinson's Law", back: 'Work expands to fill the available time. AgilePM counters this via MoSCoW + timeboxing.' },
  { id: 'f-af-6', topic: 'AF', front: 'AgilePM is built on...', back: 'Common Sense and Pragmatism.' },

  // Individuals & Interactions
  { id: 'f-in-1', topic: 'IN', front: 'Number of Agile Leadership principles', back: '9 principles of agile leadership.' },
  { id: 'f-in-2', topic: 'IN', front: 'Definition of a Stakeholder', back: 'Anyone who can affect, or is affected by, the project.' },
  { id: 'f-in-3', topic: 'IN', front: 'The 3 classes of stakeholder', back: 'Project Leadership Roles, Solution Development Roles, External Stakeholders.' },
  { id: 'f-in-4', topic: 'IN', front: 'Who is the "Project Champion"?', back: 'The Business Sponsor — owns the project and Business Case, holds the budget, final authority on critical decisions. Always one person.' },
  { id: 'f-in-5', topic: 'IN', front: 'Who sets the Definition of Done?', back: 'The Solution Architect (owns solution design + delivery approach, ensures regulatory/quality standards).' },
  { id: 'f-in-6', topic: 'IN', front: 'Who acts like the overall Product Owner for the project?', back: 'The Business Visionary — owns the evolving solution, creates/communicates the Business Case and goals.' },
  { id: 'f-in-7', topic: 'IN', front: 'What does the Project Manager NOT do?', back: 'Does NOT create the Business Case. They manage the environment, high-level planning, inspect progress and remove impediments.' },
  { id: 'f-in-8', topic: 'IN', front: 'The 3 roles with EQUAL authority', back: 'Business Visionary, Business Sponsor, Solution Architect.' },
  { id: 'f-in-9', topic: 'IN', front: "Watts' 2 commandments (Scrum Master)", back: 'First ask the team; Make yourself redundant.' },
  { id: 'f-in-10', topic: 'IN', front: "PO's 4 key stakeholder relationships", back: 'Business Visionary, Solution Architect, Project Manager, Business & Technical Advisors.' },
  { id: 'f-in-11', topic: 'IN', front: "PM's 6 key relationships", back: 'Business Sponsor, Business Visionary, Solution Architect, Product Owner, Scrum Master, Other Stakeholders.' },
  { id: 'f-in-12', topic: 'IN', front: 'Leadership style spectrum', back: 'Servant Leadership ←→ Command-and-Control. AgilePM/Scrum sit toward servant leadership.' },

  // Collaboration & Communication
  { id: 'f-cc-1', topic: 'CC', front: 'Definition of Collaboration', back: 'Working together towards a shared goal.' },
  { id: 'f-cc-2', topic: 'CC', front: 'Definition of Communication', back: 'The exchange of thoughts, opinions or information between people (speech, writing, symbols, images, gestures, behaviour).' },
  { id: 'f-cc-3', topic: 'CC', front: 'Best/most effective communication method', back: 'Face-to-Face. (Email is best for confirming previous discussions.)' },
  { id: 'f-cc-4', topic: 'CC', front: 'Jim Highsmith quote', back: '"Documentation is not understanding, process is not discipline, formality is not skill."' },
  { id: 'f-cc-5', topic: 'CC', front: 'Power/Interest Grid quadrants', back: 'High Power/High Interest = Closely Engage; High Power/Low Interest = Keep Satisfied; Low Power/High Interest = Keep Informed; Low Power/Low Interest = Monitor.' },
  { id: 'f-cc-6', topic: 'CC', front: 'A Facilitated Workshop requires...', back: 'An owner + selected participants + an independent facilitator.' },

  // Project Lifecycle
  { id: 'f-pr-1', topic: 'PR', front: 'The 6 lifecycle phases', back: 'Pre-Project, Feasibility, Foundations, Delivery (Development), Deployment, Realisation (Post-Deployment).' },
  { id: 'f-pr-2', topic: 'PR', front: 'The 3 nested timeboxes', back: 'Project Timebox, Project Increment Timebox, Delivery Timebox (Sprint).' },
  { id: 'f-pr-3', topic: 'PR', front: 'Product vs Solution Increment', back: 'Product Increment = built by ONE Delivery Team, meets DoD, usable. Solution Increment = combination of multiple products + other items (training, comms, change, marketing).' },
  { id: 'f-pr-4', topic: 'PR', front: 'Purpose of Feasibility', back: 'Determine if the project is possible and cost-effective (assess desirability, feasibility, viability).' },
  { id: 'f-pr-5', topic: 'PR', front: 'Purpose of Foundations', back: 'Explore needs/solution and define the delivery approach; produce the Delivery Plan (Required).' },
  { id: 'f-pr-6', topic: 'PR', front: 'Key lifecycle principle', back: '"Just enough detail, just in time" — defer to the last responsible moment.' },

  // Requirements, Estimating & Prioritisation
  { id: 'f-es-1', topic: 'ES', front: 'Definition of a Requirement', back: 'A business or user need that must be met by the Solution delivered by the project.' },
  { id: 'f-es-2', topic: 'ES', front: 'Functional vs Non-Functional Requirements', back: 'Functional = what the solution must DO; Non-functional (NFRs) = how WELL it must perform (response, capacity, availability, safety, usability).' },
  { id: 'f-es-3', topic: 'ES', front: 'User Story format', back: 'As a <user/role>, I want <feature/capability>, so that <goal/value>.' },
  { id: 'f-es-4', topic: 'ES', front: 'The 4 Cs of a User Story', back: 'Card, Conversation, Confirmation, Context.' },
  { id: 'f-es-5', topic: 'ES', front: 'INVEST criteria', back: 'Independent, Negotiable, Valuable, Estimable, Small (enough), Testable.' },
  { id: 'f-es-6', topic: 'ES', front: 'MoSCoW priorities', back: 'Must Have, Should Have, Could Have, Won\'t Have (this time).' },
  { id: 'f-es-7', topic: 'ES', front: 'MoSCoW 60/20 rule', back: 'Must Have effort ≤60% of total; Could Haves ~20% (the contingency buffer). Won\'t Haves are out of scope.' },
  { id: 'f-es-8', topic: 'ES', front: 'When is something a Must Have?', back: 'It meets ONE of: legally required; essential for safety; solution cannot function without it; solution not marketable without it.' },
  { id: 'f-es-9', topic: 'ES', front: 'Styles of estimating', back: 'By Analogy (comparative, T-shirt sizing/story points), By Decomposition (bottom-up tasks), By Velocity (average story points over ~3 sprints).' },
  { id: 'f-es-10', topic: 'ES', front: '3 levels of story detail', back: 'Epic Stories (Feasibility), User Stories (Foundations), Fine-grained User Stories (Delivery/Sprint).' },
  { id: 'f-es-11', topic: 'ES', front: 'Scope creep vs depth changes', back: 'Scope creep = changes to BREADTH of requirements (change control). Depth changes = handled via MoSCoW contingency.' },

  // Planning & Control
  { id: 'f-pc-1', topic: 'PC', front: 'The 3 AgilePM planning concepts', back: 'Outcome-based planning; plan to sensible horizons at appropriate detail; plan & re-plan using best available estimates.' },
  { id: 'f-pc-2', topic: 'PC', front: 'The 4 tracking & control concepts', back: 'Outcome-based measurement; transparency of process and progress; responding to change; Management by Exception.' },
  { id: 'f-pc-3', topic: 'PC', front: 'Standard Sprint length', back: 'Standard 2 weeks; range 1–4 weeks; max 6 weeks.' },
  { id: 'f-pc-4', topic: 'PC', front: 'Management by Exception', back: 'Empowered teams handle day-to-day; only major deviations (e.g. Sprint Goal at risk) are escalated to PM + PO + BV.' },
  { id: 'f-pc-5', topic: 'PC', front: 'Progress is measured by...', back: 'Working solutions / value delivered, not tasks completed or effort.' },
  { id: 'f-pc-6', topic: 'PC', front: 'Charts used for tracking', back: 'Burn-down, Burn-up, Cumulative Flow — for inspection & adaptation, NOT for performance judgement.' },

  // Risk
  { id: 'f-rk-1', topic: 'RK', front: 'Definition of Risk', back: 'The possibility of something happening that could unexpectedly affect the project\'s goals or its ability to achieve them.' },
  { id: 'f-rk-2', topic: 'RK', front: 'Risk ownership', back: 'Value Ownership → Business Visionary; Solution Delivery → Solution Architect; Delivery Enablement → Project Manager.' },
  { id: 'f-rk-3', topic: 'RK', front: 'What is the PAQ?', back: 'Project Approach Questionnaire — 17 statements rated on a consensus scale to identify approach-based risks. Done in Feasibility, reviewed at end of Foundations.' },
  { id: 'f-rk-4', topic: 'RK', front: 'PAQ rule', back: 'Any disagreement = a risk requiring action.' },
  { id: 'f-rk-5', topic: 'RK', front: 'Main inherent source of risk', back: 'VUCA. AgilePM\'s daily practices (iterative dev, refinement, retros, transparency) manage it.' },

  // Governance
  { id: 'f-gv-1', topic: 'GV', front: 'Definition of Governance', back: 'The set of processes, structures and controls that ensure a project is well managed and meeting its objective.' },
  { id: 'f-gv-2', topic: 'GV', front: 'Definition of Empiricism', back: 'Learning through experience and making decisions based on what is observed (real-world results).' },
  { id: 'f-gv-3', topic: 'GV', front: 'Cone of Uncertainty (Barry Boehm)', back: 'Estimate accuracy narrows through the lifecycle: Pre-Project 0.25x–4x; Feasibility ~0.5x–2x; Foundations ~0.8x–1.25x; Delivery tighter; Deployment = actuals.' },
  { id: 'f-gv-4', topic: 'GV', front: 'AgilePM gives estimates as...', back: 'Ranges, not single figures. If a sponsor insists on one figure, THEY choose from the range — not the estimator.' },
  { id: 'f-gv-5', topic: 'GV', front: 'Two kinds of quality (compliance)', back: 'Solution quality (does it meet needs / built lawfully?) and Process quality (built in a controlled, disciplined way?).' },
  { id: 'f-gv-6', topic: 'GV', front: 'Business Case in the MoSCoW view', back: 'Worst Case = just Musts; Expected Case = Musts + Shoulds; Best Case = Musts + Shoulds + Coulds. Benefits based on Musts + Shoulds.' },
]

// ---------------------------------------------------------------------------
// Matching game pairs: { id, topic, term, definition }
// ---------------------------------------------------------------------------
export const MATCHING_PAIRS = [
  { id: 'm-1', topic: 'KC', term: 'V in VUCA', definition: 'Volatility — things change quickly and unpredictably' },
  { id: 'm-2', topic: 'KC', term: 'U in VUCA', definition: 'Uncertainty — hard to predict what will happen' },
  { id: 'm-3', topic: 'KC', term: 'C in VUCA', definition: 'Complexity — many interconnected parts; cause/effect unclear' },
  { id: 'm-4', topic: 'KC', term: 'A in VUCA', definition: 'Ambiguity — information can have more than one meaning' },
  { id: 'm-5', topic: 'KC', term: 'Manifesto enhancement', definition: '"Software" changed to "Solutions"' },
  { id: 'm-6', topic: 'SC', term: 'Product Owner', definition: 'Maximises value of product; manages Product Backlog' },
  { id: 'm-7', topic: 'SC', term: 'Scrum Master', definition: 'Establishes Scrum; team effectiveness; servant leader' },
  { id: 'm-8', topic: 'SC', term: 'Developers', definition: 'Create a usable Product Increment each Sprint' },
  { id: 'm-9', topic: 'SC', term: 'Daily Scrum timebox', definition: '15 minutes' },
  { id: 'm-10', topic: 'SC', term: 'Sprint Review timebox', definition: 'Maximum 4 hours' },
  { id: 'm-11', topic: 'SC', term: 'Sprint Retrospective timebox', definition: 'Maximum 3 hours' },
  { id: 'm-12', topic: 'SC', term: 'Sprint Planning timebox', definition: 'Maximum 8 hours' },
  { id: 'm-13', topic: 'SC', term: 'Product Backlog commitment', definition: 'Product Goal' },
  { id: 'm-14', topic: 'SC', term: 'Sprint Backlog commitment', definition: 'Sprint Goal' },
  { id: 'm-15', topic: 'SC', term: 'Increment commitment', definition: 'Definition of Done' },
  { id: 'm-16', topic: 'AF', term: 'AgilePM fixes', definition: 'Time, Cost, Quality' },
  { id: 'm-17', topic: 'AF', term: 'AgilePM varies', definition: 'Features' },
  { id: 'm-18', topic: 'AF', term: "Parkinson's Law", definition: 'Work expands to fill available time' },
  { id: 'm-19', topic: 'IN', term: 'Business Sponsor', definition: 'Project Champion; owns Business Case; holds budget' },
  { id: 'm-20', topic: 'IN', term: 'Business Visionary', definition: 'Acts like overall Product Owner for the project' },
  { id: 'm-21', topic: 'IN', term: 'Solution Architect', definition: 'Owns solution design; sets the Definition of Done' },
  { id: 'm-22', topic: 'IN', term: 'Project Manager', definition: 'Manages environment; does NOT create Business Case' },
  { id: 'm-23', topic: 'CC', term: 'Most effective communication', definition: 'Face-to-Face' },
  { id: 'm-24', topic: 'CC', term: 'Best for confirming discussions', definition: 'Email' },
  { id: 'm-25', topic: 'CC', term: 'High Power / High Interest', definition: 'Closely Engage' },
  { id: 'm-26', topic: 'CC', term: 'High Power / Low Interest', definition: 'Keep Satisfied' },
  { id: 'm-27', topic: 'CC', term: 'Low Power / High Interest', definition: 'Keep Informed' },
  { id: 'm-28', topic: 'CC', term: 'Low Power / Low Interest', definition: 'Monitor' },
  { id: 'm-29', topic: 'ES', term: 'Must Have effort cap', definition: '≤ 60% of total effort' },
  { id: 'm-30', topic: 'ES', term: 'Could Have buffer', definition: '~ 20% contingency' },
  { id: 'm-31', topic: 'ES', term: 'INVEST – I', definition: 'Independent' },
  { id: 'm-32', topic: 'ES', term: 'INVEST – V', definition: 'Valuable' },
  { id: 'm-33', topic: 'ES', term: 'Epic Stories', definition: 'Feasibility level of detail' },
  { id: 'm-34', topic: 'ES', term: 'Fine-grained User Stories', definition: 'Delivery / Sprint level of detail' },
  { id: 'm-35', topic: 'PR', term: 'Foundations output', definition: 'Delivery Plan (Required)' },
  { id: 'm-36', topic: 'PR', term: 'Realisation phase', definition: 'Ensure expected benefits are achieved' },
  { id: 'm-37', topic: 'PR', term: 'Pre-Project artifact', definition: 'Terms of Reference' },
  { id: 'm-38', topic: 'PC', term: 'Standard Sprint length', definition: '2 weeks (range 1–4, max 6)' },
  { id: 'm-39', topic: 'PC', term: 'Management by Exception', definition: 'Escalate only major deviations' },
  { id: 'm-40', topic: 'RK', term: 'Value Ownership risk', definition: 'Business Visionary' },
  { id: 'm-41', topic: 'RK', term: 'Solution Delivery risk', definition: 'Solution Architect' },
  { id: 'm-42', topic: 'RK', term: 'Delivery Enablement risk', definition: 'Project Manager' },
  { id: 'm-43', topic: 'RK', term: 'PAQ', definition: '17 statements identifying approach-based risk' },
  { id: 'm-44', topic: 'GV', term: 'Cone of Uncertainty', definition: 'Estimate accuracy narrows through the lifecycle' },
  { id: 'm-45', topic: 'GV', term: 'Empiricism', definition: 'Decisions based on observed real-world results' },
  { id: 'm-46', topic: 'GV', term: 'Worst Case business case', definition: 'Just the Must Haves' },
]

// ---------------------------------------------------------------------------
// Question bank: { id, topic, q, options[], correct (must match an option), explain }
// Each mock paper samples 50 questions, weighted by EXAM_WEIGHTING, then
// shuffles both question order and option order.
// ---------------------------------------------------------------------------
export const QUESTION_BANK = [
  // ---- KC: Key Concepts ----
  { id: 'q-kc-1', topic: 'KC', q: 'What does the "V" in VUCA stand for?', options: ['Volatility', 'Value', 'Velocity', 'Viability'], correct: 'Volatility', explain: 'VUCA = Volatility, Uncertainty, Complexity, Ambiguity.' },
  { id: 'q-kc-2', topic: 'KC', q: 'In the ABC-enhanced Agile Manifesto, which word replaced "software"?', options: ['Solutions', 'Systems', 'Services', 'Products'], correct: 'Solutions', explain: 'Changing "software" to "solutions" broadens the Manifesto beyond software.' },
  { id: 'q-kc-3', topic: 'KC', q: 'Where was the Agile Manifesto created?', options: ['Snowbird, Utah', 'Silicon Valley', 'Seattle', 'Boston'], correct: 'Snowbird, Utah', explain: 'Created in 2001 in Snowbird, Utah by 17 experts.' },
  { id: 'q-kc-4', topic: 'KC', q: 'Which is a value in the Agile Manifesto?', options: ['Working solutions over comprehensive documentation', 'Processes and tools over individuals', 'Following a plan over responding to change', 'Contract negotiation over customer collaboration'], correct: 'Working solutions over comprehensive documentation', explain: 'The Manifesto values the left side more, but the right still has value.' },
  { id: 'q-kc-5', topic: 'KC', q: 'How many people created the original Agile Manifesto?', options: ['17', '12', '4', '9'], correct: '17', explain: '17 experts met in Snowbird, Utah in 2001.' },
  { id: 'q-kc-6', topic: 'KC', q: 'What does the Manifesto\'s final sentence emphasise?', options: ['The right-side items still have value, just less', 'The right-side items should be rejected', 'Only the left-side items matter', 'Documentation has no value'], correct: 'The right-side items still have value, just less', explain: '"While there is value in the items on the right, we value the items on the left more."' },
  { id: 'q-kc-7', topic: 'KC', q: 'Business Agility is best described as a...', options: ['Progressive, people-centric approach to all aspects of business', 'Software development methodology', 'Documentation framework', 'Contract negotiation technique'], correct: 'Progressive, people-centric approach to all aspects of business', explain: 'It is achieved by harnessing collaborative and creative ways of working.' },
  { id: 'q-kc-8', topic: 'KC', q: 'Which describes "incremental delivery"?', options: ['Releasing the solution bit by bit to gain value early', 'Doing all analysis up front', 'Delivering everything at the end', 'Avoiding feedback'], correct: 'Releasing the solution bit by bit to gain value early', explain: 'Incremental delivery gains value early; iterative refines through cycles.' },
  { id: 'q-kc-9', topic: 'KC', q: 'In an agile approach, detailed work (analysis, design, planning) is completed...', options: ['At the last responsible moment', 'Entirely at the start', 'Only after deployment', 'Never'], correct: 'At the last responsible moment', explain: 'Deferring detail keeps it relevant and reduces waste.' },
  { id: 'q-kc-10', topic: 'KC', q: 'The "A" in VUCA refers to information that...', options: ['Can have more than one meaning', 'Changes quickly', 'Is too complex', 'Cannot be predicted'], correct: 'Can have more than one meaning', explain: 'Ambiguity = information can be interpreted in multiple ways.' },
  { id: 'q-kc-11', topic: 'KC', q: 'Why is agility needed in project delivery?', options: ['Legacy methods assume the problem won\'t change', 'It removes the need for any planning', 'It guarantees fixed scope', 'It avoids customer involvement'], correct: 'Legacy methods assume the problem won\'t change', explain: 'In VUCA environments detailed upfront plans become outdated quickly.' },
  { id: 'q-kc-12', topic: 'KC', q: 'Which pair are the two contexts of product development?', options: ['Project Management and Product Lifecycle Management', 'Design and Build', 'Sales and Marketing', 'Testing and Deployment'], correct: 'Project Management and Product Lifecycle Management', explain: 'Product development happens in PM and PLM contexts.' },

  // ---- SC: Scrum Overview ----
  { id: 'q-sc-1', topic: 'SC', q: 'How many values does Scrum have?', options: ['5', '4', '3', '8'], correct: '5', explain: 'Commitment, Focus, Openness, Respect, Courage.' },
  { id: 'q-sc-2', topic: 'SC', q: 'Which is NOT one of the five Scrum values?', options: ['Collaboration', 'Commitment', 'Courage', 'Respect'], correct: 'Collaboration', explain: 'The five are Commitment, Focus, Openness, Respect, Courage.' },
  { id: 'q-sc-3', topic: 'SC', q: 'What is the timebox for the Daily Scrum?', options: ['15 minutes', '1 hour', '30 minutes', '8 hours'], correct: '15 minutes', explain: 'Daily Scrum is a 15-minute event for the Developers.' },
  { id: 'q-sc-4', topic: 'SC', q: 'Maximum length of a Sprint?', options: ['1 month', '2 weeks', '6 weeks', '3 months'], correct: '1 month', explain: 'A Sprint is one month or less.' },
  { id: 'q-sc-5', topic: 'SC', q: 'The Sprint Retrospective is timeboxed to a maximum of...', options: ['3 hours', '4 hours', '8 hours', '1 hour'], correct: '3 hours', explain: 'Retrospective max 3 hours (for a one-month Sprint).' },
  { id: 'q-sc-6', topic: 'SC', q: 'Who is accountable for maximising the value of the product?', options: ['Product Owner', 'Scrum Master', 'Developers', 'Project Manager'], correct: 'Product Owner', explain: 'The Product Owner maximises value and manages the Product Backlog.' },
  { id: 'q-sc-7', topic: 'SC', q: 'The commitment associated with the Product Increment is the...', options: ['Definition of Done', 'Sprint Goal', 'Product Goal', 'Acceptance Criteria'], correct: 'Definition of Done', explain: 'Product Backlog→Product Goal, Sprint Backlog→Sprint Goal, Increment→DoD.' },
  { id: 'q-sc-8', topic: 'SC', q: 'What are the three pillars of empiricism?', options: ['Transparency, Inspection, Adaptation', 'Plan, Do, Check', 'Commitment, Focus, Courage', 'Time, Cost, Quality'], correct: 'Transparency, Inspection, Adaptation', explain: 'Scrum is founded on empiricism and lean thinking.' },
  { id: 'q-sc-9', topic: 'SC', q: 'Maximum recommended Scrum Team size?', options: ['10 people', '7 people', '15 people', '20 people'], correct: '10 people', explain: 'Typically 10 or fewer, cross-functional and self-managing.' },
  { id: 'q-sc-10', topic: 'SC', q: 'The Sprint Review is best described as a...', options: ['Working session, not a presentation', 'Formal presentation to management', 'Status report', 'Sign-off meeting'], correct: 'Working session, not a presentation', explain: 'It inspects the outcome and determines future adaptations collaboratively.' },
  { id: 'q-sc-11', topic: 'SC', q: 'Which order are the Sprint Planning topics addressed?', options: ['Why, What, How', 'What, Why, How', 'How, What, Why', 'Why, How, What'], correct: 'Why, What, How', explain: 'Why (Goal) → What (PBIs) → How (the plan).' },
  { id: 'q-sc-12', topic: 'SC', q: 'When is a Product Increment considered "born"?', options: ['When a PBI meets the Definition of Done', 'At Sprint Planning', 'At the Sprint Review', 'When the PBI is added to the backlog'], correct: 'When a PBI meets the Definition of Done', explain: 'An Increment exists once a PBI satisfies the DoD.' },
  { id: 'q-sc-13', topic: 'SC', q: 'Who creates the Sprint Backlog?', options: ['The Developers', 'The Product Owner', 'The Scrum Master', 'The Business Sponsor'], correct: 'The Developers', explain: 'The Sprint Backlog is created by the Developers, for the Developers.' },
  { id: 'q-sc-14', topic: 'SC', q: 'Scrum is founded on empiricism and...', options: ['Lean thinking', 'Waterfall', 'Six Sigma', 'PRINCE2'], correct: 'Lean thinking', explain: 'The two foundations are empiricism and lean thinking.' },

  // ---- AF: AgilePM Fundamentals ----
  { id: 'q-af-1', topic: 'AF', q: 'In AgilePM, which variables are FIXED by default?', options: ['Time, Cost, Quality', 'Features, Time, Cost', 'Quality, Features', 'Time only'], correct: 'Time, Cost, Quality', explain: 'AgilePM fixes Time, Cost and Quality and varies Features.' },
  { id: 'q-af-2', topic: 'AF', q: 'Which variable does AgilePM allow to VARY?', options: ['Features', 'Quality', 'Time', 'Cost'], correct: 'Features', explain: 'Features flex via MoSCoW; the rest are fixed.' },
  { id: 'q-af-3', topic: 'AF', q: 'How many AgilePM principles are there?', options: ['8', '9', '12', '5'], correct: '8', explain: 'There are 8 AgilePM principles (the "rules of engagement").' },
  { id: 'q-af-4', topic: 'AF', q: 'Which is an AgilePM principle?', options: ['Never Compromise Quality', 'Maximise documentation', 'Deliver only at the end', 'Avoid collaboration'], correct: 'Never Compromise Quality', explain: 'The 8 principles include Never Compromise Quality and Deliver on Time.' },
  { id: 'q-af-5', topic: 'AF', q: 'AgilePM is built on which two foundations?', options: ['Common Sense and Pragmatism', 'Theory and Documentation', 'Hierarchy and Control', 'Speed and Cost'], correct: 'Common Sense and Pragmatism', explain: 'The underlying ethos rests on common sense and pragmatism.' },
  { id: 'q-af-6', topic: 'AF', q: 'Parkinson\'s Law states that...', options: ['Work expands to fill the available time', 'Cost always doubles', 'Quality always slips', 'Scope always grows'], correct: 'Work expands to fill the available time', explain: 'AgilePM counters this with MoSCoW and timeboxing.' },
  { id: 'q-af-7', topic: 'AF', q: 'How is contingency managed in AgilePM?', options: ['Via MoSCoW (flexing features)', 'By adding extra time', 'By adding extra budget', 'By reducing quality'], correct: 'Via MoSCoW (flexing features)', explain: 'Contingency is built into the scope of features, not time/budget.' },
  { id: 'q-af-8', topic: 'AF', q: 'In the traditional/sequential approach, what is typically fixed?', options: ['Features', 'Time', 'Cost', 'Quality'], correct: 'Features', explain: 'Traditional fixes Features and varies Time/Cost (quality often slips).' },
  { id: 'q-af-9', topic: 'AF', q: 'The AgilePM philosophy says best value emerges when projects are...', options: ['Aligned to clear goals and deliver frequently', 'Heavily documented', 'Tightly controlled by one manager', 'Planned entirely up front'], correct: 'Aligned to clear goals and deliver frequently', explain: 'Plus the collaboration of motivated and empowered people.' },
  { id: 'q-af-10', topic: 'AF', q: 'Which is one of the 8 AgilePM principles?', options: ['Build Incrementally from Firm Foundations', 'Document Everything First', 'Avoid Change', 'Fix the Features'], correct: 'Build Incrementally from Firm Foundations', explain: 'Establish a high-level understanding before major development.' },
  { id: 'q-af-11', topic: 'AF', q: 'Which AgilePM principle relates to visibility through transparency rather than heavy reports?', options: ['Demonstrate Control', 'Deliver on Time', 'Collaborate', 'Develop Iteratively'], correct: 'Demonstrate Control', explain: 'Control is demonstrated via transparency, not heavy reporting.' },
  { id: 'q-af-12', topic: 'AF', q: 'Which combined benefit do AgilePM + Scrum provide?', options: ['Lifecycle with appropriate governance', 'Removal of all roles', 'No need for planning', 'Fixed scope guarantees'], correct: 'Lifecycle with appropriate governance', explain: 'They add governance, roles and techniques for on-time/within-budget delivery.' },

  // ---- IN: Individuals & Interactions ----
  { id: 'q-in-1', topic: 'IN', q: 'How many principles of agile leadership are there?', options: ['9', '8', '12', '5'], correct: '9', explain: 'There are 9 principles of agile leadership.' },
  { id: 'q-in-2', topic: 'IN', q: 'A stakeholder is defined as anyone who...', options: ['Can affect, or is affected by, the project', 'Pays for the project only', 'Works on the Sprint Backlog', 'Signs the contract'], correct: 'Can affect, or is affected by, the project', explain: 'Broad definition covering all who influence or are influenced.' },
  { id: 'q-in-3', topic: 'IN', q: 'Which role is known as the "Project Champion"?', options: ['Business Sponsor', 'Business Visionary', 'Solution Architect', 'Project Manager'], correct: 'Business Sponsor', explain: 'The Business Sponsor owns the project and Business Case, holds the budget.' },
  { id: 'q-in-4', topic: 'IN', q: 'Who sets the Definition of Done at project level?', options: ['Solution Architect', 'Product Owner', 'Scrum Master', 'Business Sponsor'], correct: 'Solution Architect', explain: 'The Solution Architect owns the solution design and sets the DoD.' },
  { id: 'q-in-5', topic: 'IN', q: 'Which role acts like the overall Product Owner for the project?', options: ['Business Visionary', 'Business Sponsor', 'Project Manager', 'Scrum Master'], correct: 'Business Visionary', explain: 'The BV owns the evolving solution and creates/communicates the Business Case.' },
  { id: 'q-in-6', topic: 'IN', q: 'Which document does the Project Manager NOT create?', options: ['Business Case', 'Delivery Plan', 'High-level planning artifacts', 'Schedule'], correct: 'Business Case', explain: 'The PM does not create the Business Case; the BV does.' },
  { id: 'q-in-7', topic: 'IN', q: 'Which three roles hold EQUAL authority?', options: ['Business Visionary, Business Sponsor, Solution Architect', 'PM, PO, Scrum Master', 'Developers, PO, PM', 'Scrum Master, BV, PM'], correct: 'Business Visionary, Business Sponsor, Solution Architect', explain: 'These three roles have equal authority.' },
  { id: 'q-in-8', topic: 'IN', q: 'Who holds the project budget and provides funding?', options: ['Business Sponsor', 'Business Visionary', 'Solution Architect', 'Product Owner'], correct: 'Business Sponsor', explain: 'The Business Sponsor holds the budget and has final authority on critical decisions.' },
  { id: 'q-in-9', topic: 'IN', q: 'How many key relationships does the Project Manager have?', options: ['6', '4', '9', '3'], correct: '6', explain: 'BS, BV, SA, PO, Scrum Master, Other Stakeholders.' },
  { id: 'q-in-10', topic: 'IN', q: 'How many key stakeholder relationships does the Product Owner have?', options: ['4', '6', '3', '5'], correct: '4', explain: 'BV, SA, PM, and Business & Technical Advisors.' },
  { id: 'q-in-11', topic: 'IN', q: 'Watts\' two commandments for the Scrum Master are "make yourself redundant" and...', options: ['First ask the team', 'Always lead from the front', 'Control the backlog', 'Report to the sponsor'], correct: 'First ask the team', explain: 'First ask the team; make yourself redundant.' },
  { id: 'q-in-12', topic: 'IN', q: 'Cross-functional members on a Scrum team (BAs, testers, designers) are all called...', options: ['Developers', 'Specialists', 'Advisors', 'Resources'], correct: 'Developers', explain: 'Anyone working on Sprint Backlog tasks is a "Developer".' },
  { id: 'q-in-13', topic: 'IN', q: 'The AgilePM/Scrum leadership style sits toward which end of the spectrum?', options: ['Servant Leadership', 'Command-and-Control', 'Laissez-faire', 'Autocratic'], correct: 'Servant Leadership', explain: 'The spectrum runs Servant Leadership ←→ Command-and-Control.' },
  { id: 'q-in-14', topic: 'IN', q: 'Which is one of the 3 classes of stakeholder?', options: ['External Stakeholders', 'Paying customers only', 'Senior managers only', 'Regulators only'], correct: 'External Stakeholders', explain: 'Project Leadership, Solution Development, and External Stakeholders.' },
  { id: 'q-in-15', topic: 'IN', q: 'Who is accountable for the Scrum Team\'s effectiveness?', options: ['Scrum Master', 'Product Owner', 'Project Manager', 'Business Visionary'], correct: 'Scrum Master', explain: 'The Scrum Master is accountable for team effectiveness as a servant leader.' },
  { id: 'q-in-16', topic: 'IN', q: 'Which agile leadership principle concerns developing people?', options: ['Leaders develop new leaders, not followers', 'Leaders favour hierarchies', 'Leaders control all decisions', 'Leaders avoid delegation'], correct: 'Leaders develop new leaders, not followers', explain: 'A core principle: build leaders, not followers.' },

  // ---- CC: Collaboration & Communication ----
  { id: 'q-cc-1', topic: 'CC', q: 'Which is the most effective form of communication?', options: ['Face-to-Face', 'Email', 'Instant messaging', 'Social media'], correct: 'Face-to-Face', explain: 'Face-to-face is the best/most effective method.' },
  { id: 'q-cc-2', topic: 'CC', q: 'Which method is best for confirming previous discussions?', options: ['Email', 'Face-to-Face', 'Virtual meeting', 'Phone call'], correct: 'Email', explain: 'Email is best for confirming what was already discussed.' },
  { id: 'q-cc-3', topic: 'CC', q: 'Collaboration is defined as...', options: ['Working together towards a shared goal', 'Exchanging information', 'Negotiating contracts', 'Writing documentation'], correct: 'Working together towards a shared goal', explain: 'That is the core definition of collaboration.' },
  { id: 'q-cc-4', topic: 'CC', q: 'On the Power/Interest grid, High Power/High Interest stakeholders should be...', options: ['Closely Engaged', 'Monitored', 'Kept Informed', 'Kept Satisfied'], correct: 'Closely Engaged', explain: 'Closely engage the most powerful and interested stakeholders.' },
  { id: 'q-cc-5', topic: 'CC', q: 'On the Power/Interest grid, Low Power/Low Interest stakeholders should be...', options: ['Monitored', 'Closely Engaged', 'Kept Satisfied', 'Kept Informed'], correct: 'Monitored', explain: 'Low power/low interest = simply monitor.' },
  { id: 'q-cc-6', topic: 'CC', q: 'On the Power/Interest grid, High Power/Low Interest stakeholders should be...', options: ['Kept Satisfied', 'Closely Engaged', 'Monitored', 'Kept Informed'], correct: 'Kept Satisfied', explain: 'Keep powerful but less interested stakeholders satisfied.' },
  { id: 'q-cc-7', topic: 'CC', q: 'Who said "Documentation is not understanding, process is not discipline, formality is not skill"?', options: ['Jim Highsmith', 'Barry Boehm', 'Rachel Davies', 'Ken Schwaber'], correct: 'Jim Highsmith', explain: 'Jim Highsmith — emphasising substance over ceremony.' },
  { id: 'q-cc-8', topic: 'CC', q: 'A facilitated workshop requires an owner, participants and...', options: ['An independent facilitator', 'A project sponsor', 'A written agenda only', 'A regulator'], correct: 'An independent facilitator', explain: 'Independent facilitation keeps the workshop neutral and effective.' },
  { id: 'q-cc-9', topic: 'CC', q: 'Which is a common cause of project failure linked to communication?', options: ['Over-reliance on written communication', 'Too many face-to-face meetings', 'Using a shared language', 'Involving stakeholders early'], correct: 'Over-reliance on written communication', explain: 'Other causes include not using a shared language and missing key stakeholders.' },
  { id: 'q-cc-10', topic: 'CC', q: 'Communication is defined as the exchange of thoughts, opinions or information using...', options: ['Speech, writing, symbols, images, gestures, behaviour', 'Only written documents', 'Only meetings', 'Only formal reports'], correct: 'Speech, writing, symbols, images, gestures, behaviour', explain: 'Communication spans many channels, not just writing.' },

  // ---- PR: Project Lifecycle Framework ----
  { id: 'q-pr-1', topic: 'PR', q: 'Which is the FIRST phase of the project lifecycle?', options: ['Pre-Project', 'Feasibility', 'Foundations', 'Delivery'], correct: 'Pre-Project', explain: 'Order: Pre-Project, Feasibility, Foundations, Delivery, Deployment, Realisation.' },
  { id: 'q-pr-2', topic: 'PR', q: 'What is the purpose of the Feasibility phase?', options: ['Determine if the project is possible and cost-effective', 'Build the solution', 'Deploy to production', 'Measure benefits'], correct: 'Determine if the project is possible and cost-effective', explain: 'Assess desirability, feasibility and viability at a high level.' },
  { id: 'q-pr-3', topic: 'PR', q: 'Which artifact is REQUIRED output of Foundations?', options: ['Delivery Plan', 'Terms of Reference', 'Benefits Assessment', 'Feasibility Assessment'], correct: 'Delivery Plan', explain: 'Foundations produces the Delivery Plan (Required).' },
  { id: 'q-pr-4', topic: 'PR', q: 'A Product Increment is built by...', options: ['One Delivery Team and meets the DoD', 'Multiple teams plus training and comms', 'The Business Sponsor', 'The deployment team only'], correct: 'One Delivery Team and meets the DoD', explain: 'A Solution Increment combines multiple products + other items.' },
  { id: 'q-pr-5', topic: 'PR', q: 'What is the purpose of the Realisation phase?', options: ['Ensure expected benefits are achieved', 'Build increments', 'Define the delivery approach', 'Decide if the project is worth investigating'], correct: 'Ensure expected benefits are achieved', explain: 'Realisation (Post-Deployment) measures benefits and supports improvement.' },
  { id: 'q-pr-6', topic: 'PR', q: 'Which artifact is recommended in Pre-Project?', options: ['Terms of Reference', 'Delivery Plan', 'Business Case', 'Benefits Assessment'], correct: 'Terms of Reference', explain: 'Pre-Project recommends a Terms of Reference.' },
  { id: 'q-pr-7', topic: 'PR', q: 'How many phases does the project lifecycle have?', options: ['6', '4', '5', '8'], correct: '6', explain: 'Pre-Project, Feasibility, Foundations, Delivery, Deployment, Realisation.' },
  { id: 'q-pr-8', topic: 'PR', q: 'Which are the three nested timeboxes?', options: ['Project, Project Increment, Delivery (Sprint)', 'Plan, Build, Test', 'Day, Week, Month', 'Feasibility, Foundations, Delivery'], correct: 'Project, Project Increment, Delivery (Sprint)', explain: 'The Delivery timebox (Sprint) sits inside the Project Increment timebox.' },
  { id: 'q-pr-9', topic: 'PR', q: 'The key lifecycle principle is...', options: ['Just enough detail, just in time', 'Plan everything up front', 'Document then build', 'Deliver only once'], correct: 'Just enough detail, just in time', explain: 'Defer detail to the last responsible moment.' },
  { id: 'q-pr-10', topic: 'PR', q: 'What is in live operation, built from deployed Solution Increments?', options: ['Deployed Solution', 'Product Increment', 'Sprint Backlog', 'Product Goal'], correct: 'Deployed Solution', explain: 'The Deployed Solution is what is running in live operation.' },
  { id: 'q-pr-11', topic: 'PR', q: 'During which phase is the solution released into operational use?', options: ['Deployment', 'Delivery', 'Foundations', 'Feasibility'], correct: 'Deployment', explain: 'Deployment handles change management, training, rollout and rollback.' },
  { id: 'q-pr-12', topic: 'PR', q: 'The purpose of the Foundations phase is to...', options: ['Explore needs/solution and define the delivery approach', 'Measure benefits', 'Decide whether to investigate', 'Run the live service'], correct: 'Explore needs/solution and define the delivery approach', explain: 'Foundations refines the Business Case and creates the Delivery Plan.' },

  // ---- ES: Requirements, Estimating & Prioritisation ----
  { id: 'q-es-1', topic: 'ES', q: 'In MoSCoW, the maximum effort for Must Haves should be...', options: ['60%', '80%', '20%', '50%'], correct: '60%', explain: 'Must Haves ≤60% of total effort to keep contingency.' },
  { id: 'q-es-2', topic: 'ES', q: 'Could Haves typically represent what proportion of effort (the contingency buffer)?', options: ['~20%', '~60%', '~40%', '~80%'], correct: '~20%', explain: 'Could Haves are the ~20% buffer dropped first if needed.' },
  { id: 'q-es-3', topic: 'ES', q: 'What does the "I" in INVEST stand for?', options: ['Independent', 'Important', 'Iterative', 'Integrated'], correct: 'Independent', explain: 'INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable.' },
  { id: 'q-es-4', topic: 'ES', q: 'What is the correct User Story format?', options: ['As a <role>, I want <feature>, so that <value>', 'Given <x>, When <y>, Then <z>', 'The system shall <do x>', 'It must <do x> by <date>'], correct: 'As a <role>, I want <feature>, so that <value>', explain: 'Rachel Davies\' standard user story format.' },
  { id: 'q-es-5', topic: 'ES', q: 'Which is NOT one of the 4 Cs of a User Story?', options: ['Commitment', 'Card', 'Conversation', 'Confirmation'], correct: 'Commitment', explain: 'The 4 Cs are Card, Conversation, Confirmation, Context.' },
  { id: 'q-es-6', topic: 'ES', q: 'A requirement that the solution "cannot function without" is a...', options: ['Must Have', 'Should Have', 'Could Have', 'Won\'t Have'], correct: 'Must Have', explain: 'Must Have meets one of: legal, safety, cannot function, not marketable.' },
  { id: 'q-es-7', topic: 'ES', q: 'Non-functional requirements describe...', options: ['How well the solution must perform', 'What the solution must do', 'Who owns the budget', 'When delivery happens'], correct: 'How well the solution must perform', explain: 'NFRs cover response times, capacity, availability, safety, usability.' },
  { id: 'q-es-8', topic: 'ES', q: 'Estimating "by velocity" means using...', options: ['Average story points over ~3 sprints', 'T-shirt sizing', 'Bottom-up task breakdown', 'Expert single-point guesses'], correct: 'Average story points over ~3 sprints', explain: 'Velocity averages recent sprint output to forecast.' },
  { id: 'q-es-9', topic: 'ES', q: 'Epic stories are typically used at which level of detail?', options: ['Feasibility', 'Foundations', 'Delivery/Sprint', 'Deployment'], correct: 'Feasibility', explain: 'Epics (Feasibility) → User Stories (Foundations) → fine-grained (Delivery).' },
  { id: 'q-es-10', topic: 'ES', q: 'Scope creep refers to changes in the...', options: ['Breadth of requirements', 'Depth of a requirement', 'Sprint length', 'Team size'], correct: 'Breadth of requirements', explain: 'Breadth changes use change control; depth changes use MoSCoW contingency.' },
  { id: 'q-es-11', topic: 'ES', q: 'Which estimating style uses T-shirt sizing or story points?', options: ['By Analogy (comparative)', 'By Decomposition', 'By Velocity', 'By Mandate'], correct: 'By Analogy (comparative)', explain: 'Comparative estimating uses relative sizing.' },
  { id: 'q-es-12', topic: 'ES', q: 'A requirement is defined as...', options: ['A business or user need that must be met by the solution', 'A task in the sprint backlog', 'A risk to the project', 'A governance control'], correct: 'A business or user need that must be met by the solution', explain: 'Requirements capture business/user needs.' },
  { id: 'q-es-13', topic: 'ES', q: 'The Minimum Useable Subset (MUST) consists of...', options: ['Must Haves only', 'Musts + Shoulds', 'All requirements', 'Could Haves'], correct: 'Must Haves only', explain: 'The MUST is the essential set: Must Haves, always delivered.' },
  { id: 'q-es-14', topic: 'ES', q: 'Which technique is recommended for writing Acceptance Criteria?', options: ['Given/When/Then (BDD)', 'MoSCoW', 'Cone of Uncertainty', 'Power/Interest grid'], correct: 'Given/When/Then (BDD)', explain: 'Behaviour-driven Given/When/Then expresses acceptance criteria.' },

  // ---- PC: Planning & Control ----
  { id: 'q-pc-1', topic: 'PC', q: 'The standard recommended Sprint length is...', options: ['2 weeks', '1 week', '4 weeks', '6 weeks'], correct: '2 weeks', explain: 'Standard 2 weeks; range 1–4 weeks; max 6.' },
  { id: 'q-pc-2', topic: 'PC', q: 'Management by Exception means...', options: ['Escalate only major deviations', 'Report every task daily to the sponsor', 'Avoid all escalation', 'Manage every detail centrally'], correct: 'Escalate only major deviations', explain: 'Empowered teams handle day-to-day; only exceptions escalate.' },
  { id: 'q-pc-3', topic: 'PC', q: 'Progress in AgilePM is measured by...', options: ['Working solutions / value delivered', 'Tasks completed', 'Hours worked', 'Documents produced'], correct: 'Working solutions / value delivered', explain: 'Outcome-based measurement focuses on delivered value.' },
  { id: 'q-pc-4', topic: 'PC', q: 'Burn-down and burn-up charts are used for...', options: ['Inspection and adaptation', 'Judging individual performance', 'Setting salaries', 'Contract negotiation'], correct: 'Inspection and adaptation', explain: 'Charts support transparency, not performance judgement.' },
  { id: 'q-pc-5', topic: 'PC', q: 'Which is one of the 3 AgilePM planning concepts?', options: ['Outcome-based planning', 'Plan everything in detail up front', 'Avoid re-planning', 'Fix scope permanently'], correct: 'Outcome-based planning', explain: 'Plus: plan to sensible horizons; plan & re-plan using best estimates.' },
  { id: 'q-pc-6', topic: 'PC', q: 'A Sprint Goal at risk is treated as a(n)...', options: ['Exception (escalate)', 'Normal daily event', 'Reason to extend the Sprint', 'Cause to add scope'], correct: 'Exception (escalate)', explain: 'PM + PO + BV handle escalations under Management by Exception.' },
  { id: 'q-pc-7', topic: 'PC', q: 'The maximum permitted Sprint length is...', options: ['6 weeks', '4 weeks', '2 weeks', '1 month'], correct: '6 weeks', explain: 'Standard 2 weeks, range 1–4, maximum 6.' },
  { id: 'q-pc-8', topic: 'PC', q: 'Stories are broken into tasks during...', options: ['Sprint Planning (Topic 3 – How)', 'The Daily Scrum', 'The Sprint Review', 'Foundations'], correct: 'Sprint Planning (Topic 3 – How)', explain: 'Tasks are created in the "How" topic and tracked on the team board.' },
  { id: 'q-pc-9', topic: 'PC', q: 'Which is one of the 4 tracking & control concepts?', options: ['Transparency of process and progress', 'Detailed upfront planning', 'Single-point estimates', 'Command-and-control reporting'], correct: 'Transparency of process and progress', explain: 'The four: outcome-based measurement, transparency, responding to change, MBE.' },
  { id: 'q-pc-10', topic: 'PC', q: 'Lean thinking is primarily about...', options: ['Reducing waste and focusing on essentials', 'Maximising documentation', 'Adding contingency time', 'Increasing team size'], correct: 'Reducing waste and focusing on essentials', explain: 'Lean connects to user stories (just enough detail) and backlogs.' },
  { id: 'q-pc-11', topic: 'PC', q: 'Who facilitates the Project Planning Event in a multi-team project?', options: ['Project Manager (with POs and Scrum Masters)', 'Business Sponsor alone', 'A single Developer', 'The regulator'], correct: 'Project Manager (with POs and Scrum Masters)', explain: 'The PM aligns multiple delivery teams.' },
  { id: 'q-pc-12', topic: 'PC', q: 'Which is a sensible planning horizon in AgilePM?', options: ['Long-term: entire project + post-project', 'Only the current day', 'Only the next 5 years', 'No horizon at all'], correct: 'Long-term: entire project + post-project', explain: 'Horizons: long (project), medium (current/next increment), short (sprint).' },

  // ---- RK: Risk Management & the Project Approach ----
  { id: 'q-rk-1', topic: 'RK', q: 'How many statements are in the Project Approach Questionnaire (PAQ)?', options: ['17', '12', '9', '8'], correct: '17', explain: 'The PAQ has 17 statements rated on a consensus scale.' },
  { id: 'q-rk-2', topic: 'RK', q: 'In the PAQ, any disagreement indicates...', options: ['A risk requiring action', 'Project completion', 'A successful approach', 'No further action needed'], correct: 'A risk requiring action', explain: 'Disagreement signals an approach-based risk to mitigate.' },
  { id: 'q-rk-3', topic: 'RK', q: 'Who owns Value Ownership risk?', options: ['Business Visionary', 'Solution Architect', 'Project Manager', 'Scrum Master'], correct: 'Business Visionary', explain: 'BV=Value, SA=Solution Delivery, PM=Delivery Enablement.' },
  { id: 'q-rk-4', topic: 'RK', q: 'When is the PAQ first completed?', options: ['Feasibility', 'Pre-Project', 'Foundations', 'Delivery'], correct: 'Feasibility', explain: 'First pass in Feasibility; reviewed at end of Foundations and revisits.' },
  { id: 'q-rk-5', topic: 'RK', q: 'Risk is defined as the possibility of something happening that could...', options: ['Unexpectedly affect the project\'s goals', 'Improve the budget', 'Speed up delivery', 'Reduce scope intentionally'], correct: 'Unexpectedly affect the project\'s goals', explain: 'Risk concerns uncertain events affecting goals or ability to achieve them.' },
  { id: 'q-rk-6', topic: 'RK', q: 'Who owns Solution Delivery risk?', options: ['Solution Architect', 'Business Visionary', 'Project Manager', 'Product Owner'], correct: 'Solution Architect', explain: 'The SA owns Solution Delivery risk.' },
  { id: 'q-rk-7', topic: 'RK', q: 'The main inherent source of project risk in AgilePM is...', options: ['VUCA', 'Documentation', 'Team size', 'Budget'], correct: 'VUCA', explain: 'VUCA is the inherent source; daily agile practices manage it.' },
  { id: 'q-rk-8', topic: 'RK', q: 'Who owns Delivery Enablement risk?', options: ['Project Manager', 'Business Sponsor', 'Solution Architect', 'Business Visionary'], correct: 'Project Manager', explain: 'The PM owns Delivery Enablement risk.' },

  // ---- GV: Governance, Compliance & Products ----
  { id: 'q-gv-1', topic: 'GV', q: 'Governance is defined as...', options: ['Processes, structures and controls ensuring a project is well managed', 'A type of documentation', 'A communication channel', 'A risk register'], correct: 'Processes, structures and controls ensuring a project is well managed', explain: 'Governance ensures the project meets its objective.' },
  { id: 'q-gv-2', topic: 'GV', q: 'Empiricism is best defined as...', options: ['Decisions based on observed real-world results', 'Decisions based on detailed plans', 'Decisions made by the sponsor', 'Decisions based on documentation'], correct: 'Decisions based on observed real-world results', explain: 'Learning through experience and observation.' },
  { id: 'q-gv-3', topic: 'GV', q: 'The Cone of Uncertainty is attributed to...', options: ['Barry Boehm', 'Jim Highsmith', 'Rachel Davies', 'Ken Schwaber'], correct: 'Barry Boehm', explain: 'Boehm\'s Cone of Uncertainty narrows estimates through the lifecycle.' },
  { id: 'q-gv-4', topic: 'GV', q: 'AgilePM provides estimates as...', options: ['Ranges, not single figures', 'A single fixed number', 'Only at the end', 'Verbal guesses'], correct: 'Ranges, not single figures', explain: 'If a sponsor wants one figure, they choose it from the range.' },
  { id: 'q-gv-5', topic: 'GV', q: 'If a sponsor insists on a single estimate figure, who chooses it?', options: ['The sponsor (from the range)', 'The estimator', 'The Scrum Master', 'The regulator'], correct: 'The sponsor (from the range)', explain: 'The estimator provides the range; the sponsor selects within it.' },
  { id: 'q-gv-6', topic: 'GV', q: 'At Foundations, the Cone of Uncertainty accuracy is approximately...', options: ['0.8x – 1.25x', '0.25x – 4x', '0.5x – 2x', 'Exact actuals'], correct: '0.8x – 1.25x', explain: 'Accuracy narrows as requirements become understood.' },
  { id: 'q-gv-7', topic: 'GV', q: 'Which artifact records actual, measured benefits?', options: ['Benefits Assessment', 'Business Case', 'Feasibility Assessment', 'Terms of Reference'], correct: 'Benefits Assessment', explain: 'The Benefits Assessment (Realisation) records measured benefits.' },
  { id: 'q-gv-8', topic: 'GV', q: 'In the MoSCoW business case view, the "Worst Case" includes...', options: ['Just the Must Haves', 'Musts + Shoulds', 'All requirements', 'Could Haves only'], correct: 'Just the Must Haves', explain: 'Worst=Musts, Expected=Musts+Shoulds, Best=Musts+Shoulds+Coulds.' },
  { id: 'q-gv-9', topic: 'GV', q: 'The two kinds of quality relevant to compliance are...', options: ['Solution quality and Process quality', 'Code quality and Test quality', 'Internal and External', 'Functional and Non-functional'], correct: 'Solution quality and Process quality', explain: 'Solution = meets needs lawfully; Process = built in a controlled way.' },
  { id: 'q-gv-10', topic: 'GV', q: 'Time and cost in AgilePM are controlled by...', options: ['MoSCoW + Timeboxing', 'Adding contingency budget', 'Extending deadlines', 'Reducing quality'], correct: 'MoSCoW + Timeboxing', explain: 'MoSCoW flexes features within fixed timeboxes.' },
]
