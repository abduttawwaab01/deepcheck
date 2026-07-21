export interface SchoolAssessmentQuestion {
  code: string;
  domain: string;
  questionText: string;
  dimension: string;
  options: { optionText: string; score: number; optionOrder: number }[];
}

export interface SchoolAssessmentDomain {
  name: string;
  description: string;
  icon: string;
}

export const schoolAssessmentDomains: SchoolAssessmentDomain[] = [
  {
    name: "Teaching Quality & Pedagogy",
    description: "Evaluates the effectiveness of instructional strategies, classroom delivery, and teacher-student interactions that drive learning outcomes.",
    icon: "GraduationCap",
  },
  {
    name: "Curriculum Implementation",
    description: "Assesses how faithfully and effectively the prescribed curriculum is delivered, adapted, and enriched across all grade levels.",
    icon: "BookOpen",
  },
  {
    name: "Student Assessment & Evaluation",
    description: "Examines the variety, fairness, and diagnostic value of assessment methods used to measure and improve student learning.",
    icon: "ClipboardCheck",
  },
  {
    name: "School Leadership & Management",
    description: "Measures the capacity of school administrators to set vision, manage resources, support staff, and drive school improvement.",
    icon: "Users",
  },
  {
    name: "Infrastructure & Resources",
    description: "Evaluates the adequacy, condition, and accessibility of physical facilities, equipment, and learning materials.",
    icon: "Building2",
  },
  {
    name: "Student Support & Welfare",
    description: "Assesses the systems in place to address students' academic, emotional, social, health, and extracurricular needs.",
    icon: "Heart",
  },
  {
    name: "Parent & Community Engagement",
    description: "Measures the strength and effectiveness of partnerships between the school, families, and the surrounding community.",
    icon: "Handshake",
  },
  {
    name: "Teacher Development",
    description: "Evaluates opportunities and structures for continuous professional growth, mentoring, and career advancement of teaching staff.",
    icon: "TrendingUp",
  },
  {
    name: "School Culture & Climate",
    description: "Assesses the social-emotional environment of the school including respect, inclusion, student voice, and celebration of diversity.",
    icon: "Sparkles",
  },
  {
    name: "Data-Driven Decision Making",
    description: "Examines how effectively the school collects, analyses, and acts on data to inform planning and improve outcomes.",
    icon: "BarChart3",
  },
  {
    name: "Technology Integration",
    description: "Evaluates the availability, use, and pedagogical impact of digital tools, platforms, and ICT skills across the school.",
    icon: "Monitor",
  },
  {
    name: "Safety & Discipline",
    description: "Assesses policies and practices that ensure physical safety, emotional security, and positive behaviour management.",
    icon: "Shield",
  },
  {
    name: "Financial Management",
    description: "Measures the transparency, accountability, and strategic effectiveness of the school's financial planning and resource use.",
    icon: "Landmark",
  },
  {
    name: "Student Achievement Outcomes",
    description: "Evaluates measurable academic results, progression, graduation, and readiness for post-secondary pathways.",
    icon: "Award",
  },
];

export const schoolAssessmentQuestions: SchoolAssessmentQuestion[] = [
  // =====================================================================
  // DOMAIN 1: Teaching Quality & Pedagogy (SKL-001 to SKL-005)
  // =====================================================================

  {
    code: "SKL-001",
    domain: "Teaching Quality & Pedagogy",
    questionText: "How consistently do teachers use differentiated instruction to address the varied learning needs, pace, and ability levels of students within the same classroom?",
    dimension: "Differentiated Instruction",
    options: [
      { optionText: "Never — all students receive identical instruction regardless of their needs or ability levels", score: 1, optionOrder: 1 },
      { optionText: "Rarely — differentiation happens only occasionally or is limited to one or two subjects", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — teachers attempt differentiation but strategies are inconsistent or superficial", score: 3, optionOrder: 3 },
      { optionText: "Often — most teachers use a range of differentiation strategies such as tiered tasks, flexible grouping, and varied materials", score: 4, optionOrder: 4 },
      { optionText: "Always — differentiation is embedded across all classrooms with clear evidence of individualized learning pathways for every student", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-002",
    domain: "Teaching Quality & Pedagogy",
    questionText: "How effectively do teachers use formative assessment during lessons — such as questioning techniques, exit tickets, peer assessment, and real-time feedback — to adjust their teaching and identify misconceptions before moving on?",
    dimension: "Formative Assessment",
    options: [
      { optionText: "Never — lessons proceed without any check for understanding or in-lesson assessment", score: 1, optionOrder: 1 },
      { optionText: "Rarely — formative assessment is limited to occasional questions directed at the same few students", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some teachers use formative assessment tools but rarely act on the results to adjust instruction in real time", score: 3, optionOrder: 3 },
      { optionText: "Often — most teachers regularly use formative assessment and adapt their lesson flow based on what they learn", score: 4, optionOrder: 4 },
      { optionText: "Always — formative assessment is a routine and systematic part of every lesson with documented evidence of instructional adjustments", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-003",
    domain: "Teaching Quality & Pedagogy",
    questionText: "To what extent are lessons designed to maximise active student engagement — including collaborative work, hands-on activities, student-led discussions, and problem-solving tasks — rather than relying primarily on passive lecturing?",
    dimension: "Student Engagement",
    options: [
      { optionText: "Never — instruction is almost entirely lecture-based with students passively receiving information throughout the lesson", score: 1, optionOrder: 1 },
      { optionText: "Rarely — occasional group work or activities are included but most lesson time involves passive listening", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — a mix of active and passive methods is used but active strategies lack structure or clear learning purpose", score: 3, optionOrder: 3 },
      { optionText: "Often — most lessons incorporate well-structured active learning strategies that require students to think, discuss, and apply knowledge", score: 4, optionOrder: 4 },
      { optionText: "Always — active engagement is the dominant instructional mode with consistent evidence of students driving their own learning", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-004",
    domain: "Teaching Quality & Pedagogy",
    questionText: "How consistently do teachers scaffold complex learning tasks — breaking down challenging concepts into manageable steps, providing worked examples, modelling thinking processes, and gradually releasing responsibility to students?",
    dimension: "Scaffolding",
    options: [
      { optionText: "Never — students are given complex tasks with no structured support or guided introduction", score: 1, optionOrder: 1 },
      { optionText: "Rarely — scaffolding is applied only for lower-ability students rather than as a universal instructional strategy", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some teachers provide partial scaffolding but release of responsibility is inconsistent or premature", score: 3, optionOrder: 3 },
      { optionText: "Often — teachers systematically scaffold tasks using models, guided practice, and structured release to independence", score: 4, optionOrder: 4 },
      { optionText: "Always — scaffolded instruction is a consistent practice with clear progression from teacher-led modelling to independent mastery", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-005",
    domain: "Teaching Quality & Pedagogy",
    questionText: "How effectively do teachers connect curriculum content to real-world applications, current events, local contexts, and cross-curricular links to make learning relevant and meaningful for students?",
    dimension: "Real-World Connections",
    options: [
      { optionText: "Never — content is taught purely in abstract terms with no reference to how it applies outside the classroom", score: 1, optionOrder: 1 },
      { optionText: "Rarely — real-world connections are made only when explicitly prompted or for a single topic per term", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — teachers occasionally draw real-world parallels but connections are superficial or not sustained across units", score: 3, optionOrder: 3 },
      { optionText: "Often — most lessons include deliberate real-world applications, case studies, or project-based learning tied to student contexts", score: 4, optionOrder: 4 },
      { optionText: "Always — authentic real-world connections are embedded across the curriculum with documented projects, community links, and applied learning", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 2: Curriculum Implementation (SKL-006 to SKL-010)
  // =====================================================================

  {
    code: "SKL-006",
    domain: "Curriculum Implementation",
    questionText: "How comprehensively does the delivered curriculum cover all mandatory topics, skills, and learning objectives specified in the official syllabus or standards framework for each grade level?",
    dimension: "Curriculum Coverage",
    options: [
      { optionText: "Never — significant portions of the syllabus are routinely skipped or left untaught across multiple subjects", score: 1, optionOrder: 1 },
      { optionText: "Rarely — coverage is inconsistent with some subjects adequately taught while others have major gaps", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — most syllabus topics are covered but depth varies significantly and several objectives are only superficially addressed", score: 3, optionOrder: 3 },
      { optionText: "Often — all mandatory objectives are covered with adequate depth, with minor gaps in non-core areas", score: 4, optionOrder: 4 },
      { optionText: "Always — complete and thorough coverage of every syllabus objective is documented through unit plans, lesson logs, and curriculum maps", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-007",
    domain: "Curriculum Implementation",
    questionText: "To what extent are teachers' lesson plans, assessments, and teaching materials deliberately aligned with national or regional curriculum standards, including correct cognitive level demands and prerequisite knowledge sequencing?",
    dimension: "Standards Alignment",
    options: [
      { optionText: "Never — there is no evidence of curriculum standards being referenced in planning, teaching, or assessment materials", score: 1, optionOrder: 1 },
      { optionText: "Rarely — alignment is incidental rather than intentional, with most lesson plans not referencing specific standards", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some departments align to standards but others do not, and alignment is limited to surface-level topic matching", score: 3, optionOrder: 3 },
      { optionText: "Often — most teachers demonstrate clear alignment between standards, lesson objectives, activities, and assessments", score: 4, optionOrder: 4 },
      { optionText: "Always — systematic and documented standards alignment is evident across all grades and subjects with regular audits", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-008",
    domain: "Curriculum Implementation",
    questionText: "How effectively does the school monitor and manage curriculum pacing to ensure that instructional time is used efficiently and that all required content is completed well before examination periods?",
    dimension: "Pacing & Time Management",
    options: [
      { optionText: "Never — there is no pacing guide or schedule monitoring, resulting in large portions of the curriculum being rushed or incomplete before exams", score: 1, optionOrder: 1 },
      { optionText: "Rarely — pacing is managed informally by individual teachers with frequent delays and no school-wide tracking", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — pacing guides exist but are not consistently followed or monitored, leading to periodic content gaps", score: 3, optionOrder: 3 },
      { optionText: "Often — a pacing calendar is maintained and reviewed regularly, with most subjects staying on track throughout the year", score: 4, optionOrder: 4 },
      { optionText: "Always — rigorous pacing management ensures timely completion of the curriculum with built-in buffer time for revision and remediation", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-009",
    domain: "Curriculum Implementation",
    questionText: "How systematically does the school identify and provide targeted remediation for students who are falling behind in core curriculum content, including diagnostic assessments, intervention programmes, and progress monitoring?",
    dimension: "Remediation for Struggling Students",
    options: [
      { optionText: "Never — students who fall behind receive no additional support and are expected to keep up or repeat the class", score: 1, optionOrder: 1 },
      { optionText: "Rarely — remediation is ad hoc and depends on individual teacher initiative with no structured intervention system", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some remediation exists such as extra homework or after-school sessions but it is not informed by diagnostic data", score: 3, optionOrder: 3 },
      { optionText: "Often — a structured intervention programme identifies struggling students early and provides targeted support with regular progress checks", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive tiered intervention system uses diagnostic data to match students with precisely targeted remediation and tracks their recovery", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-010",
    domain: "Curriculum Implementation",
    questionText: "How effectively does the school provide enrichment opportunities and advanced learning pathways for high-achieving students who have already mastered the core curriculum content?",
    dimension: "Enrichment for Advanced Learners",
    options: [
      { optionText: "Never — advanced students are given no additional challenge and are expected to simply complete the same work as everyone else", score: 1, optionOrder: 1 },
      { optionText: "Rarely — enrichment is limited to occasional extra assignments with no structured programme or identified advanced learners", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some teachers provide extension activities but there is no school-wide policy or consistent identification process", score: 3, optionOrder: 3 },
      { optionText: "Often — the school has a formal gifted programme with differentiated extension tasks, subject acceleration options, and competitions", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive enrichment ecosystem includes acceleration, mentoring, research projects, and external competitions with documented outcomes", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 3: Student Assessment & Evaluation (SKL-011 to SKL-015)
  // =====================================================================

  {
    code: "SKL-011",
    domain: "Student Assessment & Evaluation",
    questionText: "How well does the school employ a balanced range of assessment methods — including formative, summative, performance-based, portfolio, oral, and practical assessments — rather than relying solely on end-of-term written examinations?",
    dimension: "Varied Assessment Methods",
    options: [
      { optionText: "Never — student achievement is measured exclusively through end-of-term written exams with no other assessment types used", score: 1, optionOrder: 1 },
      { optionText: "Rarely — one or two additional assessment types are used but written exams remain the sole formal measure of achievement", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — multiple assessment types are used but some are applied inconsistently or lack clear marking criteria", score: 3, optionOrder: 3 },
      { optionText: "Often — a deliberate mix of assessment methods is used across subjects with each method serving a clear diagnostic purpose", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive assessment policy mandates diverse methods with documented validity, reliability checks, and teacher training on implementation", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-012",
    domain: "Student Assessment & Evaluation",
    questionText: "How promptly and constructively do teachers provide feedback on student work — with specific, actionable comments that help students understand their mistakes, know their next steps, and improve their performance?",
    dimension: "Timely & Constructive Feedback",
    options: [
      { optionText: "Never — student work is returned weeks later with only a grade or score and no written comments", score: 1, optionOrder: 1 },
      { optionText: "Rarely — feedback is late, generic, or limited to correcting answers without explaining why they were wrong", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — feedback is provided within a reasonable time but varies greatly in quality and actionability across teachers", score: 3, optionOrder: 3 },
      { optionText: "Often — most teachers provide specific, timely feedback that identifies strengths, pinpoints errors, and suggests clear improvement strategies", score: 4, optionOrder: 4 },
      { optionText: "Always — feedback is consistently timely, specific, and dialogic, with evidence of students acting on it and teachers verifying its impact", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-013",
    domain: "Student Assessment & Evaluation",
    questionText: "To what extent are students actively involved in assessing their own learning — through self-reflection journals, self-grading against rubrics, learning journals, goal-setting exercises, and peer evaluation activities?",
    dimension: "Student Self-Assessment",
    options: [
      { optionText: "Never — students play no role in evaluating their own learning and assessment is entirely teacher-directed", score: 1, optionOrder: 1 },
      { optionText: "Rarely — students occasionally reflect on their grades but are not taught or encouraged to self-assess their understanding", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — self-assessment is attempted in some classes but students lack the skills or tools to do it meaningfully", score: 3, optionOrder: 3 },
      { optionText: "Often — students regularly use structured self-assessment tools and can accurately evaluate their own strengths and areas for growth", score: 4, optionOrder: 4 },
      { optionText: "Always — self and peer assessment are embedded across all grades with students maintaining learning portfolios and tracking their own progress", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-014",
    domain: "Student Assessment & Evaluation",
    questionText: "How systematically do teachers and school leaders analyse student assessment results — identifying patterns of underperformance, weak topics, and at-risk cohorts — and then use these findings to adjust teaching strategies, intervention programmes, and resource allocation?",
    dimension: "Data-Driven Instruction",
    options: [
      { optionText: "Never — exam results are recorded but never analysed or used to inform any instructional decisions", score: 1, optionOrder: 1 },
      { optionText: "Rarely — individual teachers may look at their own class results but no school-wide analysis or action planning occurs", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — basic analysis is conducted at department level but findings are rarely translated into concrete teaching adjustments", score: 3, optionOrder: 3 },
      { optionText: "Often — regular data analysis meetings review assessment results and lead to targeted changes in instruction and support", score: 4, optionOrder: 4 },
      { optionText: "Always — a robust data-informed culture drives all instructional decisions with documented evidence of results leading to measurable improvements", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-015",
    domain: "Student Assessment & Evaluation",
    questionText: "How consistently do teachers use detailed rubrics — with clearly defined performance levels, criteria, and descriptors — for subjective assessments such as essays, projects, presentations, and practical tasks?",
    dimension: "Rubric Usage",
    options: [
      { optionText: "Never — subjective tasks are marked using only teacher judgement with no rubrics, descriptors, or transparent criteria", score: 1, optionOrder: 1 },
      { optionText: "Rarely — rubrics exist for some assessments but are not shared with students or used consistently across the department", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — rubrics are provided but are overly vague or have too few performance levels to distinguish between grades effectively", score: 3, optionOrder: 3 },
      { optionText: "Often — clear, criterion-referenced rubrics are used for most subjective assessments and shared with students before they begin the task", score: 4, optionOrder: 4 },
      { optionText: "Always — rubrics are professionally designed, standardised across departments, shared transparently, and validated through moderation exercises", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 4: School Leadership & Management (SKL-016 to SKL-020)
  // =====================================================================

  {
    code: "SKL-016",
    domain: "School Leadership & Management",
    questionText: "How clearly articulated, communicated, and understood is the school's vision and mission across all stakeholder groups — including teachers, students, parents, and support staff — with evidence that it genuinely guides daily decisions rather than being a decorative wall poster?",
    dimension: "Vision & Mission Clarity",
    options: [
      { optionText: "Never — the school has no stated vision or mission, or if one exists it is unknown to most staff and never referenced", score: 1, optionOrder: 1 },
      { optionText: "Rarely — a vision exists on paper but is rarely communicated and has no visible influence on school practices or decisions", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — the vision is communicated periodically but many staff cannot articulate it and its influence on decisions is inconsistent", score: 3, optionOrder: 3 },
      { optionText: "Often — the vision is regularly referenced in meetings, communications, and planning with most staff able to explain how it shapes their work", score: 4, optionOrder: 4 },
      { optionText: "Always — the vision is deeply embedded in school culture, planning, and daily practice with all stakeholders actively working towards its goals", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-017",
    domain: "School Leadership & Management",
    questionText: "To what extent does school leadership distribute authority and responsibility across middle managers, department heads, and teacher leaders rather than concentrating all decision-making in a single principal or vice-principal?",
    dimension: "Distributed Leadership",
    options: [
      { optionText: "Never — the principal makes every significant decision alone with no delegation to department heads or teacher leaders", score: 1, optionOrder: 1 },
      { optionText: "Rarely — some tasks are delegated but all meaningful decisions require the principal's personal approval", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — department heads have limited authority but are not fully empowered or trained to lead their teams independently", score: 3, optionOrder: 3 },
      { optionText: "Often — middle leaders are empowered to make significant decisions within clear frameworks, with the principal providing strategic oversight", score: 4, optionOrder: 4 },
      { optionText: "Always — leadership is systematically distributed with trained middle leaders, teacher-led committees, and student leadership all contributing to governance", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-018",
    domain: "School Leadership & Management",
    questionText: "How effectively does school leadership support teachers through adequate resources, manageable workloads, recognition of effort, professional autonomy, and responsive handling of concerns raised by staff?",
    dimension: "Teacher Support",
    options: [
      { optionText: "Never — teachers receive minimal support, excessive workloads, and no recognition, with concerns routinely dismissed", score: 1, optionOrder: 1 },
      { optionText: "Rarely — some support is available but it is reactive rather than proactive and does not address teachers' core needs", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — teachers have access to basic support but significant issues such as workload or resources remain unaddressed", score: 3, optionOrder: 3 },
      { optionText: "Often — leadership actively supports teachers through regular check-ins, resource provision, and a responsive approach to staff concerns", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive teacher support system includes wellness programmes, professional autonomy, timely resource allocation, and formal recognition mechanisms", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-019",
    domain: "School Leadership & Management",
    questionText: "How transparent and inclusive is the school's decision-making process — do teachers, parents, and students have meaningful input into policies, schedules, and school improvement priorities through formal mechanisms such as committees, surveys, or assemblies?",
    dimension: "Decision-Making Transparency",
    options: [
      { optionText: "Never — decisions are made behind closed doors with no consultation, no communication, and no explanation provided to stakeholders", score: 1, optionOrder: 1 },
      { optionText: "Rarely — decisions are announced after the fact with no prior consultation or opportunity for input from affected parties", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some decisions are discussed in staff meetings but parent and student input is rarely sought or genuinely considered", score: 3, optionOrder: 3 },
      { optionText: "Often — formal consultation mechanisms exist and stakeholders' views are genuinely sought and demonstrably influence final decisions", score: 4, optionOrder: 4 },
      { optionText: "Always — a culture of participatory governance ensures all stakeholders have structured, meaningful input into major decisions with feedback loops", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-020",
    domain: "School Leadership & Management",
    questionText: "How effectively does the school develop and implement a multi-year strategic plan with measurable targets, assigned responsibilities, clear timelines, regular progress reviews, and evidence-based adjustments?",
    dimension: "Strategic Planning",
    options: [
      { optionText: "Never — the school operates year-to-year with no long-term plan, no targets, and no systematic approach to improvement", score: 1, optionOrder: 1 },
      { optionText: "Rarely — a strategic plan may exist on paper but it is outdated, not referenced in decision-making, and has no monitoring mechanism", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — a strategic plan exists with some targets but progress is rarely reviewed and adjustments are made reactively rather than proactively", score: 3, optionOrder: 3 },
      { optionText: "Often — the school has an active strategic plan with annual targets, quarterly reviews, and clear accountability for implementation", score: 4, optionOrder: 4 },
      { optionText: "Always — a living strategic plan is regularly reviewed, data-informed, collaboratively developed, and demonstrably drives resource allocation and school decisions", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 5: Infrastructure & Resources (SKL-021 to SKL-025)
  // =====================================================================

  {
    code: "SKL-021",
    domain: "Infrastructure & Resources",
    questionText: "How adequate are the physical classroom conditions — including ventilation, lighting, seating, noise control, temperature, and space — for creating an environment that is conducive to focused learning for all students?",
    dimension: "Classroom Conditions",
    options: [
      { optionText: "Never — classrooms are overcrowded, poorly ventilated, have insufficient lighting, broken furniture, or other conditions that actively hinder learning", score: 1, optionOrder: 1 },
      { optionText: "Rarely — most classrooms are functional but have notable deficiencies such as inadequate lighting, broken desks, or poor ventilation", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — classrooms are generally acceptable but some have conditions that regularly disrupt learning such as noise, heat, or overcrowding", score: 3, optionOrder: 3 },
      { optionText: "Often — classrooms are well-maintained, adequately sized, well-lit, and ventilated with minor issues addressed promptly", score: 4, optionOrder: 4 },
      { optionText: "Always — all classrooms meet or exceed recommended standards for comfort, safety, and learning suitability with regular facility audits", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-022",
    domain: "Infrastructure & Resources",
    questionText: "How well-equipped are the school's science laboratories, computer labs, and technical workshops with sufficient, current, and properly maintained equipment to support the practical components of the curriculum?",
    dimension: "Laboratory Equipment",
    options: [
      { optionText: "Never — laboratories either do not exist or contain no functional equipment, forcing all practical work to be skipped or demonstrated only", score: 1, optionOrder: 1 },
      { optionText: "Rarely — some equipment exists but is outdated, broken, or insufficient for class-sized groups, requiring students to share excessively", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — equipment is available for core practicals but not for the full range required by the curriculum, with periodic maintenance gaps", score: 3, optionOrder: 3 },
      { optionText: "Often — laboratories are well-equipped for most curriculum practicals with regular maintenance schedules and adequate consumables", score: 4, optionOrder: 4 },
      { optionText: "Always — all labs are fully equipped, regularly maintained, and stocked with modern apparatus covering the complete curriculum with additional enrichment resources", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-023",
    domain: "Infrastructure & Resources",
    questionText: "How adequate, current, and accessible are the school library resources — including physical books, digital databases, reference materials, and reading spaces — to support independent learning, research, and a reading culture?",
    dimension: "Library Resources",
    options: [
      { optionText: "Never — the school has no library or the library exists but is empty, locked, or inaccessible to students", score: 1, optionOrder: 1 },
      { optionText: "Rarely — the library has a small, outdated collection that does not align with the curriculum and is open only limited hours", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — the library has a reasonable collection but lacks current titles, digital resources, or a system that encourages regular student use", score: 3, optionOrder: 3 },
      { optionText: "Often — the library has a well-curated, diverse collection with digital access, quiet study spaces, and regular programmes to promote reading", score: 4, optionOrder: 4 },
      { optionText: "Always — a modern learning resource centre offers extensive physical and digital collections, research support, and a vibrant reading culture programme", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-024",
    domain: "Infrastructure & Resources",
    questionText: "How reliably are textbooks, workbooks, stationery, and other essential learning materials available to every student at the start of each academic term, including provisions for students who cannot afford to purchase their own?",
    dimension: "Learning Materials Availability",
    options: [
      { optionText: "Never — students frequently lack textbooks and essential materials with no school support for those who cannot afford them", score: 1, optionOrder: 1 },
      { optionText: "Rarely — materials arrive late, are in insufficient quantities, or some students go without while others must share", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — core textbooks are available but supplementary materials, workbooks, and stationery are inconsistently provided", score: 3, optionOrder: 3 },
      { optionText: "Often — all essential materials are available on time with a support system in place for students facing financial difficulties", score: 4, optionOrder: 4 },
      { optionText: "Always — every student receives all required materials before the term begins, supported by a bursary fund and efficient procurement processes", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-025",
    domain: "Infrastructure & Resources",
    questionText: "How effectively does the school maintain its facilities, grounds, and equipment through a proactive maintenance programme that addresses repairs before they become hazardous, prevents deterioration, and ensures all infrastructure remains safe and functional?",
    dimension: "Facility Maintenance",
    options: [
      { optionText: "Never — there is no maintenance programme and infrastructure is visibly deteriorating with broken facilities left unrepaired for extended periods", score: 1, optionOrder: 1 },
      { optionText: "Rarely — repairs happen only after complaints or emergencies, with no preventive maintenance and significant visible deterioration", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — basic maintenance is performed but there is no systematic schedule, leading to recurring issues and slow response times", score: 3, optionOrder: 3 },
      { optionText: "Often — a regular maintenance schedule exists with dedicated staff or contracts, most repairs are completed promptly, and facilities are well-kept", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive maintenance programme with budgeted resources, scheduled inspections, and rapid response ensures all facilities remain in excellent condition", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 6: Student Support & Welfare (SKL-026 to SKL-030)
  // =====================================================================

  {
    code: "SKL-026",
    domain: "Student Support & Welfare",
    questionText: "How accessible and effective are the school's counselling services — including academic guidance, social-emotional support, and crisis intervention — with trained counsellers available to students who need help?",
    dimension: "Counselling Services",
    options: [
      { optionText: "Never — the school has no counselling services and students experiencing personal, emotional, or academic difficulties have no professional support", score: 1, optionOrder: 1 },
      { optionText: "Rarely — informal counselling may be offered by untrained teachers but there is no professional counsellor or structured support system", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — a counsellor is available but has limited hours, no private space for sessions, and is overwhelmed by demand", score: 3, optionOrder: 3 },
      { optionText: "Often — qualified counsellers are available with scheduled sessions, referral pathways, and a confidential support environment", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive counselling programme includes trained professionals, peer support systems, mental health curriculum, and crisis response protocols", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-027",
    domain: "Student Support & Welfare",
    questionText: "How effectively does the school identify and support students with special educational needs and disabilities — including screening, individualised education plans, specialist teachers, and appropriate accommodations in mainstream classrooms?",
    dimension: "Special Needs Support",
    options: [
      { optionText: "Never — students with special needs receive no screening, no individualised support, and are expected to cope in mainstream classrooms without accommodations", score: 1, optionOrder: 1 },
      { optionText: "Rarely — some students are informally identified but there are no structured programmes, trained specialists, or documented accommodations", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — basic screening exists and some accommodations are made but there are no individualised plans or specialist staff to support implementation", score: 3, optionOrder: 3 },
      { optionText: "Often — the school has a dedicated SEN department with screening processes, individualised plans, trained staff, and regular progress monitoring", score: 4, optionOrder: 4 },
      { optionText: "Always — a fully inclusive support system includes early screening, personalised learning plans, specialist intervention, assistive technology, and staff training", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-028",
    domain: "Student Support & Welfare",
    questionText: "How well-managed and nutritionally adequate is the school's feeding programme — ensuring that it provides balanced, safe, and sufficient meals to students who rely on it, especially those from food-insecure households?",
    dimension: "Feeding Programme",
    options: [
      { optionText: "Never — there is no feeding programme and students who cannot bring food from home go hungry during school hours", score: 1, optionOrder: 1 },
      { optionText: "Rarely — an informal feeding programme exists but is inconsistent, nutritionally inadequate, and fails to reach all students in need", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — meals are provided daily but nutritional quality is low, portions are insufficient, or food safety standards are not consistently met", score: 3, optionOrder: 3 },
      { optionText: "Often — the feeding programme provides balanced, hygienic meals to all eligible students with a monitoring system for nutritional adequacy", score: 4, optionOrder: 4 },
      { optionText: "Always — a professionally managed feeding programme offers nutritionally planned meals, dietary accommodations, hygiene standards, and tracks student health outcomes", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-029",
    domain: "Student Support & Welfare",
    questionText: "How accessible and effective are the school's health services — including first aid, health screenings, immunisation coordination, referral pathways to external medical providers, and health education for students?",
    dimension: "Health Services",
    options: [
      { optionText: "Never — the school has no health services, no first aid provision, and no system for responding to student health emergencies", score: 1, optionOrder: 1 },
      { optionText: "Rarely — basic first aid is available through a general office but there is no trained nurse, no health screening, and no referral system", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — a first aid room exists with basic supplies but health screenings are irregular and the school has no formal medical referral pathway", score: 3, optionOrder: 3 },
      { optionText: "Often — a health room is staffed by a trained person with first aid supplies, regular health screenings, immunisation tracking, and referral links", score: 4, optionOrder: 4 },
      { optionText: "Always — comprehensive health services include a school nurse, first aid training for staff, routine screenings, immunisation coordination, and community health partnerships", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-030",
    domain: "Student Support & Welfare",
    questionText: "How diverse, inclusive, and well-resourced is the school's extracurricular programme — including sports, arts, clubs, debate, STEM activities, and leadership opportunities — and to what extent do all students have equitable access to participate?",
    dimension: "Extracurricular Activities",
    options: [
      { optionText: "Never — the school offers no extracurricular activities and the school day is entirely limited to academic lessons", score: 1, optionOrder: 1 },
      { optionText: "Rarely — one or two activities exist but they are dominated by a small group of students with no effort to include others", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — several extracurricular activities are offered but participation is limited by resources, scheduling, or teacher availability", score: 3, optionOrder: 3 },
      { optionText: "Often — a wide range of activities is offered with intentional efforts to ensure inclusive participation across gender, ability, and年级 levels", score: 4, optionOrder: 4 },
      { optionText: "Always — a vibrant extracurricular programme with dedicated resources, trained sponsors, regular schedules, and documented student development outcomes", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 7: Parent & Community Engagement (SKL-031 to SKL-035)
  // =====================================================================

  {
    code: "SKL-031",
    domain: "Parent & Community Engagement",
    questionText: "How consistent, two-way, and meaningful is the communication between the school and parents — going beyond occasional report cards to include regular updates on student progress, school events, policy changes, and opportunities for parent feedback?",
    dimension: "Parent-Teacher Communication",
    options: [
      { optionText: "Never — parents receive no regular communication from the school and are only contacted when there is a serious problem", score: 1, optionOrder: 1 },
      { optionText: "Rarely — communication is one-directional and limited to report cards or emergency notifications with no mechanism for parent input", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — parents receive periodic updates but communication is sporadic, inconsistent across classes, and rarely invites parent perspective", score: 3, optionOrder: 3 },
      { optionText: "Often — regular, multi-channel communication keeps parents informed and there are formal mechanisms such as surveys and suggestion boxes for parent feedback", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive communication strategy includes regular newsletters, parent apps, open-door policies, feedback loops, and documented responsiveness to parent input", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-032",
    domain: "Parent & Community Engagement",
    questionText: "To what extent has the school established formal partnerships with local businesses, organisations, NGOs, universities, or government agencies that contribute resources, expertise, mentors, internships, or programme support to enhance student learning?",
    dimension: "Community Partnerships",
    options: [
      { optionText: "Never — the school operates in isolation with no connections to external organisations or community resources", score: 1, optionOrder: 1 },
      { optionText: "Rarely — occasional informal contacts exist but there are no formal partnerships or structured agreements with external organisations", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — a few partnerships exist but they are inactive, under-utilised, or limited to a single department or programme", score: 3, optionOrder: 3 },
      { optionText: "Often — active partnerships with multiple community organisations provide students with mentoring, resources, and real-world learning opportunities", score: 4, optionOrder: 4 },
      { optionText: "Always — a strategic partnership framework includes documented agreements, shared goals, regular engagement, and measurable impact on student outcomes", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-033",
    domain: "Parent & Community Engagement",
    questionText: "How genuinely are parents involved in school decision-making processes — through active parent-teacher associations, school governing body representation, curriculum consultation, and meaningful input into school policies?",
    dimension: "Parent Involvement in Decisions",
    options: [
      { optionText: "Never — parents have no formal role in any school decisions and are excluded from governance, planning, and policy development", score: 1, optionOrder: 1 },
      { optionText: "Rarely — a parent association exists in name but is not consulted on decisions and meetings are poorly attended or dominated by the school", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — parents serve on the school governing body but their influence is limited and they are rarely consulted on day-to-day decisions", score: 3, optionOrder: 3 },
      { optionText: "Often — parents are actively represented in school governance and are regularly consulted on major decisions through structured mechanisms", score: 4, optionOrder: 4 },
      { optionText: "Always — parents are genuine partners in school governance with voting rights, regular consultation on key decisions, and visible influence on school direction", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-034",
    domain: "Parent & Community Engagement",
    questionText: "How effectively does the school build connections between home and classroom learning — through homework guidance for parents, family literacy events, open classroom days, and tools that help parents understand and support their child's academic progress?",
    dimension: "Home-School Learning Links",
    options: [
      { optionText: "Never — the school makes no effort to help parents understand or support their child's learning at home", score: 1, optionOrder: 1 },
      { optionText: "Rarely — homework is sent home but parents receive no guidance on how to support it and have no visibility into classroom learning", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — occasional parent workshops or open days are held but they are poorly attended and have no follow-up support", score: 3, optionOrder: 3 },
      { optionText: "Often — the school provides regular guidance to parents, hosts family learning events, and uses digital tools to share student progress transparently", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive home-school programme includes parent workshops, family literacy nights, progress dashboards, and documented evidence of improved parent engagement", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-035",
    domain: "Parent & Community Engagement",
    questionText: "How well does the school organise and sustain community service programmes — where students regularly engage in meaningful outreach, volunteering, environmental projects, or social action that benefit the surrounding community?",
    dimension: "Community Service",
    options: [
      { optionText: "Never — there are no community service programmes and students have no structured opportunity to contribute to their community", score: 1, optionOrder: 1 },
      { optionText: "Rarely — occasional one-off events such as a clean-up day are organised but there is no sustained programme or student reflection component", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — community service is part of the programme but participation is voluntary for a few students with no school-wide engagement", score: 3, optionOrder: 3 },
      { optionText: "Often — structured community service programmes involve most students in regular, meaningful activities with clear community impact", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive service-learning programme integrates community service with curriculum reflection, tracks impact, and develops student civic responsibility", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 8: Teacher Development (SKL-036 to SKL-040)
  // =====================================================================

  {
    code: "SKL-036",
    domain: "Teacher Development",
    questionText: "How frequently and effectively does the school provide professional development opportunities — including workshops, conferences, online courses, subject-specific training, and pedagogy seminars — that are aligned with identified school improvement needs and individual teacher growth plans?",
    dimension: "Professional Development Opportunities",
    options: [
      { optionText: "Never — there is no professional development programme and teachers receive no training or growth opportunities beyond initial qualification", score: 1, optionOrder: 1 },
      { optionText: "Rarely — occasional workshops are offered but they are generic, disconnected from school needs, and not linked to individual teacher plans", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — professional development is available but participation is inconsistent, topics are not always relevant, and impact is not evaluated", score: 3, optionOrder: 3 },
      { optionText: "Often — a planned PD programme addresses school priorities, caters to individual needs, and includes follow-up support to ensure implementation", score: 4, optionOrder: 4 },
      { optionText: "Always — a strategic PD programme with needs assessment, individual growth plans, diverse formats, impact evaluation, and sustained follow-up", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-037",
    domain: "Teacher Development",
    questionText: "How well does the school's mentoring programme support newly appointed or early-career teachers through structured induction, regular observation by experienced mentors, constructive feedback, and a clear progression pathway toward full professional competence?",
    dimension: "Mentoring Programmes",
    options: [
      { optionText: "Never — new teachers are left to sink or swim with no induction, no mentoring, and no structured support during their critical early years", score: 1, optionOrder: 1 },
      { optionText: "Rarely — an informal buddy system exists but there are no structured mentoring protocols, regular check-ins, or accountability for mentors", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — mentoring is assigned but meetings are irregular, feedback is superficial, and there is no clear progression framework for new teachers", score: 3, optionOrder: 3 },
      { optionText: "Often — a structured mentoring programme pairs new teachers with trained mentors who provide regular, constructive support with documented progress", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive induction programme includes trained mentors, structured observation cycles, reflective journals, and a competency framework with milestone reviews", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-038",
    domain: "Teacher Development",
    questionText: "How systematically does the school facilitate peer observation and collaborative lesson planning — where teachers regularly observe each other's practice, share resources, co-develop lessons, and engage in professional dialogue to improve teaching quality?",
    dimension: "Peer Observation & Collaboration",
    options: [
      { optionText: "Never — teachers work in isolation with no opportunities or expectation to observe colleagues or collaborate on lesson planning", score: 1, optionOrder: 1 },
      { optionText: "Rarely — peer observation happens only during formal inspections and there is no culture of collaborative planning or resource sharing", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some teachers observe colleagues informally but there is no structured programme, protected time, or follow-up action", score: 3, optionOrder: 3 },
      { optionText: "Often — regular peer observation is timetabled with structured protocols, and collaborative planning sessions produce shared resources", score: 4, optionOrder: 4 },
      { optionText: "Always — a robust peer learning culture includes scheduled observation cycles, professional learning communities, lesson study, and documented practice improvements", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-039",
    domain: "Teacher Development",
    questionText: "How fair, transparent, and growth-oriented is the school's teacher performance management system — including clear expectations, regular classroom observations, evidence-based appraisals, and constructive development plans that improve practice rather than merely assigning ratings?",
    dimension: "Performance Management",
    options: [
      { optionText: "Never — there is no performance management system and teacher quality is not systematically assessed or supported", score: 1, optionOrder: 1 },
      { optionText: "Rarely — evaluations are annual, tick-box exercises with no meaningful observation, no developmental feedback, and no link to professional growth", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — a performance system exists but observations are infrequent, feedback is vague, and there is no clear connection to PD planning", score: 3, optionOrder: 3 },
      { optionText: "Often — a fair appraisal system includes regular observations, evidence-based feedback, and individual growth plans linked to PD opportunities", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive performance framework includes self-assessment, peer input, structured observations, coaching, and clear links to career progression", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-040",
    domain: "Teacher Development",
    questionText: "How effectively does the school support teacher career progression — through clear promotion pathways, leadership development opportunities, specialist role creation, and recognition of advanced qualifications and expertise?",
    dimension: "Career Progression",
    options: [
      { optionText: "Never — teachers have no clear career pathway and promotion depends entirely on seniority or personal connections rather than competence", score: 1, optionOrder: 1 },
      { optionText: "Rarely — promotion exists but pathways are unclear, leadership opportunities are limited, and advanced qualifications are not rewarded", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some progression opportunities exist but they are not systematic, and career conversations between teachers and leadership are rare", score: 3, optionOrder: 3 },
      { optionText: "Often — clear promotion criteria, leadership development programmes, and specialist pathways are available with regular career planning conversations", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive career framework includes leadership pipelines, specialist tracks, funded further study, and documented career progression for all teachers", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 9: School Culture & Climate (SKL-041 to SKL-045)
  // =====================================================================

  {
    code: "SKL-041",
    domain: "School Culture & Climate",
    questionText: "To what extent is the school characterised by a culture of mutual respect, inclusion, and dignity — where all students and staff, regardless of background, ability, gender, ethnicity, or religion, are treated fairly and feel a genuine sense of belonging?",
    dimension: "Respect & Inclusion",
    options: [
      { optionText: "Never — there are visible patterns of discrimination, exclusion, or disrespect that are tolerated or ignored by the school community", score: 1, optionOrder: 1 },
      { optionText: "Rarely — respect is expected in rules but not consistently modelled by staff or practised among students, with occasional exclusion going unaddressed", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — the school promotes respect but incidents of exclusion or disrespect occur and responses are inconsistent across the school", score: 3, optionOrder: 3 },
      { optionText: "Often — respect and inclusion are actively modelled and reinforced, with staff intervening in incidents and students demonstrating inclusive attitudes", score: 4, optionOrder: 4 },
      { optionText: "Always — a deeply embedded culture of respect and inclusion is evident in daily interactions, school policies, and the school's response to diversity", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-042",
    domain: "School Culture & Climate",
    questionText: "How meaningfully are students given voice and agency in school life — through student councils, suggestion systems, representation on school committees, class meetings, and genuine responsiveness by leadership to student concerns?",
    dimension: "Student Voice & Agency",
    options: [
      { optionText: "Never — students have no formal or informal mechanism to express opinions and their views are never sought on school matters", score: 1, optionOrder: 1 },
      { optionText: "Rarely — a student council exists but it has no influence, meetings are infrequent, and student suggestions are routinely ignored", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — student voice mechanisms exist but their impact is limited and students report feeling their input does not lead to real changes", score: 3, optionOrder: 3 },
      { optionText: "Often — student councils and feedback systems are active, and leadership demonstrably acts on student suggestions with visible outcomes", score: 4, optionOrder: 4 },
      { optionText: "Always — student agency is embedded through multiple channels with documented examples of student-initiated changes and leadership responding to student priorities", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-043",
    domain: "School Culture & Climate",
    questionText: "How effectively does the school recognise and celebrate student and staff achievements — including academic excellence, sporting accomplishments, creative contributions, community service, and personal growth — through regular, visible, and inclusive events?",
    dimension: "Celebration of Achievements",
    options: [
      { optionText: "Never — there are no events or systems to recognise achievements and excellent work goes unacknowledged", score: 1, optionOrder: 1 },
      { optionText: "Rarely — achievements are celebrated only for top performers in mainstream academics, ignoring the majority of contributions", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some achievements are recognised at assembly or in newsletters but the practice is inconsistent and excludes many categories of success", score: 3, optionOrder: 3 },
      { optionText: "Often — a regular schedule of recognition events covers academic, sporting, creative, and community contributions with inclusive criteria", score: 4, optionOrder: 4 },
      { optionText: "Always — a vibrant culture of celebration includes multiple recognition systems, regular events, and documented efforts to ensure all types of achievement are valued", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-044",
    domain: "School Culture & Climate",
    questionText: "How comprehensive and effectively implemented is the school's anti-bullying policy — including clear definitions, prevention education, confidential reporting mechanisms, fair investigation procedures, support for victims, and restorative consequences for perpetrators?",
    dimension: "Anti-Bullying Policies",
    options: [
      { optionText: "Never — the school has no anti-bullying policy and bullying incidents are dismissed as normal parts of growing up", score: 1, optionOrder: 1 },
      { optionText: "Rarely — a policy exists on paper but is not taught to students, not enforced by staff, and victims have no safe reporting mechanism", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — the policy is communicated but responses to bullying are inconsistent, investigations are informal, and support for victims is limited", score: 3, optionOrder: 3 },
      { optionText: "Often — the policy is well-known, prevention education is provided, reporting is accessible, and there are clear investigation and support protocols", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive anti-bullying programme includes education, anonymous reporting, trained investigators, restorative justice, and documented outcome monitoring", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-045",
    domain: "School Culture & Climate",
    questionText: "How actively does the school promote diversity awareness and cultural competence through curriculum content, events, guest speakers, literature choices, and classroom discussions that expose students to different perspectives, cultures, and worldviews?",
    dimension: "Diversity Awareness",
    options: [
      { optionText: "Never — the curriculum and school events reflect a single cultural perspective with no exposure to diversity or different worldviews", score: 1, optionOrder: 1 },
      { optionText: "Rarely — diversity is mentioned occasionally but not systematically integrated into curriculum content, events, or school culture", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some diversity-related activities occur but they are tokenistic, isolated, and not embedded in the broader curriculum", score: 3, optionOrder: 3 },
      { optionText: "Often — diversity awareness is deliberately integrated across curriculum subjects and school events with guest speakers and multicultural activities", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive diversity programme includes curriculum integration, regular events, inclusive literature, and documented student learning about cultural competence", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 10: Data-Driven Decision Making (SKL-046 to SKL-050)
  // =====================================================================

  {
    code: "SKL-046",
    domain: "Data-Driven Decision Making",
    questionText: "How systematically does the school track and maintain comprehensive student data — including attendance, academic performance, behavioural records, health information, and socio-emotional indicators — in a centralised, accessible, and secure system?",
    dimension: "Student Data Tracking",
    options: [
      { optionText: "Never — student records are paper-based, fragmented, incomplete, or stored in individual teachers' personal files with no centralised system", score: 1, optionOrder: 1 },
      { optionText: "Rarely — basic academic records exist in a central system but attendance, behavioural, and welfare data are scattered or incomplete", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — a student information system exists but data quality is inconsistent, updates are irregular, and some data categories are missing", score: 3, optionOrder: 3 },
      { optionText: "Often — a centralised system tracks key student data across academic, attendance, and welfare domains with regular updates and quality checks", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive, real-time data system captures all student indicators with automated quality checks, access controls, and regular data audits", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-047",
    domain: "Data-Driven Decision Making",
    questionText: "How effectively does the school analyse assessment data at multiple levels — including individual student, class, subject, grade, and cohort — to identify patterns, diagnose weaknesses, and generate actionable insights for teachers and school leaders?",
    dimension: "Assessment Analytics",
    options: [
      { optionText: "Never — assessment data is recorded but never analysed beyond individual teacher marking and no patterns or trends are identified", score: 1, optionOrder: 1 },
      { optionText: "Rarely — basic class averages are calculated but there is no deeper analysis of question-level performance, cohort trends, or weakness patterns", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some analysis is conducted but it is limited to end-of-term reports and does not break down results by question type, concept, or demographic", score: 3, optionOrder: 3 },
      { optionText: "Often — regular analysis across multiple dimensions produces actionable reports that identify specific weak areas, at-risk students, and improvement priorities", score: 4, optionOrder: 4 },
      { optionText: "Always — advanced analytics with visual dashboards provide real-time insights across all levels with automated alerts for at-risk students and trend monitoring", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-048",
    domain: "Data-Driven Decision Making",
    questionText: "To what extent does the school use evidence from data analysis — including assessment results, attendance patterns, survey findings, and benchmarking data — as the primary basis for planning school improvement initiatives, resource allocation, and policy changes?",
    dimension: "Evidence-Based Planning",
    options: [
      { optionText: "Never — school planning decisions are based on tradition, intuition, or the preferences of individuals rather than on any collected data", score: 1, optionOrder: 1 },
      { optionText: "Rarely — data is occasionally referenced in planning documents but decisions are primarily driven by habit, politics, or external mandates", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some planning decisions reference data but the connection between evidence and action is often weak or inconsistently applied", score: 3, optionOrder: 3 },
      { optionText: "Often — improvement plans explicitly cite data evidence, set measurable targets, and include mechanisms for tracking whether the evidence-based actions are working", score: 4, optionOrder: 4 },
      { optionText: "Always — a culture of evidence-based decision-making pervades all planning levels with documented links between data findings, actions, and measured outcomes", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-049",
    domain: "Data-Driven Decision Making",
    questionText: "How well does the school share relevant data and insights with stakeholders — including parents receiving detailed progress reports, teachers accessing class analytics, and governors reviewing whole-school performance dashboards — while maintaining appropriate data privacy?",
    dimension: "Data Sharing with Stakeholders",
    options: [
      { optionText: "Never — data is hoarded by administration and is not shared with teachers, parents, or governing bodies in any meaningful form", score: 1, optionOrder: 1 },
      { optionText: "Rarely — parents receive basic report cards but teachers have limited access to cross-class data and governors receive only summaries", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — data sharing exists but it is delayed, lacks context, and stakeholders struggle to interpret or act on the information provided", score: 3, optionOrder: 3 },
      { optionText: "Often — timely, contextualised data is shared with all key stakeholders through appropriate channels with guidance on interpretation and action", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive data-sharing framework provides role-appropriate access, visual dashboards, privacy safeguards, and training for stakeholders to use data effectively", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-050",
    domain: "Data-Driven Decision Making",
    questionText: "How effectively does the school implement continuous improvement cycles — using the Plan-Do-Study-Act (PDSA) model or similar frameworks — where initiatives are piloted, evaluated against data, refined based on evidence, and scaled only when proven effective?",
    dimension: "Continuous Improvement Cycles",
    options: [
      { optionText: "Never — the school implements new initiatives without evaluation and discontinues them based on opinions rather than data", score: 1, optionOrder: 1 },
      { optionText: "Rarely — some improvement initiatives are evaluated at the end of a year but there is no systematic cycle of testing, learning, and adapting", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — improvement cycles are attempted but they are incomplete, with pilots lacking control groups and evaluations lacking rigour", score: 3, optionOrder: 3 },
      { optionText: "Often — the school uses structured PDSA cycles with clear hypotheses, data collection during pilots, and evidence-based decisions to scale or abandon", score: 4, optionOrder: 4 },
      { optionText: "Always — a mature continuous improvement culture includes documented PDSA cycles, data-driven scaling decisions, and institutional learning from both successes and failures", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 11: Technology Integration (SKL-051 to SKL-055)
  // =====================================================================

  {
    code: "SKL-051",
    domain: "Technology Integration",
    questionText: "How adequate and reliable is the school's ICT infrastructure — including sufficient computers or devices for student use, reliable internet connectivity, functioning projectors or smart boards, and accessible charging and technical support facilities?",
    dimension: "ICT Infrastructure",
    options: [
      { optionText: "Never — the school has no functional ICT equipment, no internet, and technology plays no role in teaching or learning", score: 1, optionOrder: 1 },
      { optionText: "Rarely — limited ICT equipment exists but it is outdated, unreliable, or inaccessible to most students with frequent connectivity failures", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some ICT resources are available but they are insufficient for the student population, regularly out of order, or lack technical support", score: 3, optionOrder: 3 },
      { optionText: "Often — adequate, reliable ICT infrastructure is available to most students with regular maintenance, internet access, and technical support", score: 4, optionOrder: 4 },
      { optionText: "Always — comprehensive ICT infrastructure includes sufficient devices, high-speed internet, interactive displays, backup systems, and dedicated technical support", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-052",
    domain: "Technology Integration",
    questionText: "How well does the school provide digital literacy training for both staff and students — covering essential skills such as internet safety, information evaluation, responsible digital citizenship, basic software proficiency, and data privacy awareness?",
    dimension: "Digital Literacy Training",
    options: [
      { optionText: "Never — there is no digital literacy training and students and staff are left to develop these critical skills entirely on their own", score: 1, optionOrder: 1 },
      { optionText: "Rarely — basic computer skills are taught informally but there is no structured programme covering internet safety, digital citizenship, or information evaluation", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — digital literacy is addressed in some subjects but not systematically, and many students and staff lack critical online safety skills", score: 3, optionOrder: 3 },
      { optionText: "Often — a planned digital literacy programme covers core skills for both staff and students with regular updates on emerging technology risks", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive digital citizenship programme includes assessed competency development, regular safety training, and documented proficiency standards", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-053",
    domain: "Technology Integration",
    questionText: "To what extent does the school use e-learning platforms and digital content — including learning management systems, online assessments, digital textbooks, educational apps, and virtual learning environments — to supplement and enhance face-to-face instruction?",
    dimension: "E-Learning Platforms",
    options: [
      { optionText: "Never — the school uses no e-learning platforms or digital content and all teaching and learning is entirely paper-based", score: 1, optionOrder: 1 },
      { optionText: "Rarely — one e-learning tool may be used occasionally but it is not integrated into regular teaching and most subjects have no digital content", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some teachers use e-learning tools but adoption is inconsistent, platforms are under-utilised, and no school-wide system is in place", score: 3, optionOrder: 3 },
      { optionText: "Often — an LMS is widely used across subjects for content delivery, assignments, assessments, and communication with students", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive e-learning ecosystem includes LMS, digital assessments, virtual labs, and online collaboration tools fully integrated into daily teaching", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-054",
    domain: "Technology Integration",
    questionText: "How proficient and confident are teachers in using technology as a pedagogical tool — not just for presentation but for interactive learning, formative assessment, data analysis, differentiated instruction, and student collaboration?",
    dimension: "Teacher Technology Skills",
    options: [
      { optionText: "Never — teachers avoid using technology entirely or use it only for basic presentation, such as writing notes on a whiteboard projector", score: 1, optionOrder: 1 },
      { optionText: "Rarely — a few teachers use technology competently but most lack the skills or confidence to integrate it meaningfully into their pedagogy", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — basic technology use is common but higher-order pedagogical uses such as interactive assessment or data-driven differentiation are rare", score: 3, optionOrder: 3 },
      { optionText: "Often — most teachers demonstrate confident use of technology for varied pedagogical purposes including assessment, collaboration, and differentiation", score: 4, optionOrder: 4 },
      { optionText: "Always — all teachers demonstrate advanced, creative technology integration with evidence of improved learning outcomes from pedagogical technology use", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-055",
    domain: "Technology Integration",
    questionText: "How effectively does the school develop students' digital skills — including the ability to conduct online research, create digital content, use productivity software, collaborate using digital tools, and critically evaluate online information sources?",
    dimension: "Student Digital Skills",
    options: [
      { optionText: "Never — students graduate without any formal development of digital skills and most cannot effectively use basic technology tools", score: 1, optionOrder: 1 },
      { optionText: "Rarely — some students develop digital skills informally through personal use but the school provides no structured development of these competencies", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — digital skills are addressed in some subjects but there is no coherent school-wide progression and many students lack basic proficiency", score: 3, optionOrder: 3 },
      { optionText: "Often — a planned programme develops students' digital skills progressively across grade levels with assessments and portfolio evidence", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive digital skills curriculum ensures all students achieve documented proficiency in research, content creation, collaboration, and critical evaluation", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 12: Safety & Discipline (SKL-056 to SKL-060)
  // =====================================================================

  {
    code: "SKL-056",
    domain: "Safety & Discipline",
    questionText: "How comprehensive, communicated, and enforced are the school's safety policies — covering fire safety, laboratory safety, sports safety, transport safety, food safety, and building safety — with regular policy reviews and updates?",
    dimension: "Safety Policies",
    options: [
      { optionText: "Never — the school has no documented safety policies and there is no systematic approach to identifying or mitigating safety risks", score: 1, optionOrder: 1 },
      { optionText: "Rarely — basic safety rules exist but they are outdated, not communicated to all staff and students, and not regularly reviewed", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — safety policies exist and are communicated but enforcement is inconsistent and reviews happen only after an incident occurs", score: 3, optionOrder: 3 },
      { optionText: "Often — comprehensive safety policies are documented, communicated to all stakeholders, enforced consistently, and reviewed annually", score: 4, optionOrder: 4 },
      { optionText: "Always — a robust safety framework includes regular risk assessments, documented policies, mandatory briefings, incident tracking, and proactive policy updates", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-057",
    domain: "Safety & Discipline",
    questionText: "How well-prepared is the school to respond to emergencies — including natural disasters, medical incidents, security threats, and fire — through documented emergency plans, regular drills, trained first responders, communication protocols, and post-incident review processes?",
    dimension: "Emergency Preparedness",
    options: [
      { optionText: "Never — there is no emergency plan, no drills have been conducted, and staff would not know how to respond to a serious incident", score: 1, optionOrder: 1 },
      { optionText: "Rarely — a basic plan exists on paper but it has never been tested through drills and most staff are unfamiliar with their emergency roles", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — fire drills are conducted but other emergency types are not covered and the plan has not been updated to reflect current school layout", score: 3, optionOrder: 3 },
      { optionText: "Often — documented emergency plans cover multiple scenarios, regular drills are conducted, and designated staff have received emergency response training", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive emergency preparedness programme includes multiple drill types, trained response teams, communication systems, and documented post-drill reviews", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-058",
    domain: "Safety & Discipline",
    questionText: "How effectively does the school prevent and respond to bullying — including verbal, physical, social, and cyberbullying — through prevention education, confidential reporting systems, trained investigators, support for victims, and restorative consequences?",
    dimension: "Anti-Bullying Prevention & Response",
    options: [
      { optionText: "Never — bullying is widespread and the school either denies it exists or treats it as an inevitable part of school life", score: 1, optionOrder: 1 },
      { optionText: "Rarely — the school acknowledges bullying but has no prevention education, no confidential reporting, and inconsistent responses to incidents", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — reporting mechanisms exist but investigations are slow, consequences are inconsistent, and victims often do not feel supported", score: 3, optionOrder: 3 },
      { optionText: "Often — prevention education is delivered, reporting is accessible, investigations are timely, and both victims and perpetrators receive appropriate support", score: 4, optionOrder: 4 },
      { optionText: "Always — a whole-school anti-bullying programme includes prevention curriculum, anonymous reporting, trained investigators, restorative justice, and documented outcome tracking", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-059",
    domain: "Safety & Discipline",
    questionText: "To what extent does the school use positive behaviour support strategies — such as clear expectations, behaviour matrices, reward systems, social-emotional learning, and de-escalation techniques — rather than relying primarily on punitive measures like suspensions and caning?",
    dimension: "Positive Behaviour Support",
    options: [
      { optionText: "Never — discipline is handled entirely through harsh punishments such as caning, suspension, or public humiliation with no positive behaviour strategies", score: 1, optionOrder: 1 },
      { optionText: "Rarely — some reward systems exist but punitive measures remain the primary disciplinary tool and there is no proactive behaviour teaching", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — positive behaviour strategies are introduced but inconsistently applied, with punitive approaches still dominating responses to misbehaviour", score: 3, optionOrder: 3 },
      { optionText: "Often — a school-wide positive behaviour framework teaches expectations, uses reward systems, and applies proportionate consequences with de-escalation support", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive PBIS programme includes school-wide expectations, data-driven interventions, SEL curriculum, restorative practices, and documented reduction in exclusions", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-060",
    domain: "Safety & Discipline",
    questionText: "How adequate are the school's physical security measures — including secure perimeter fencing, controlled entry points, visitor management, CCTV coverage, secure storage of hazardous materials, and safe playground and corridor design?",
    dimension: "Physical Security",
    options: [
      { optionText: "Never — the school has no perimeter fencing, no controlled entry, and anyone can enter the campus undetected at any time", score: 1, optionOrder: 1 },
      { optionText: "Rarely — basic fencing exists but entry points are uncontrolled, there is no visitor system, and hazardous areas are not secured", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — the school has some security features but they are insufficient, poorly maintained, or not consistently enforced such as open gates during school hours", score: 3, optionOrder: 3 },
      { optionText: "Often — secure fencing, controlled entry, visitor management, and CCTV are in place with regular security assessments and maintenance", score: 4, optionOrder: 4 },
      { optionText: "Always — comprehensive physical security includes controlled access, CCTV monitoring, visitor protocols, hazard storage, and regular security audits with documented results", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 13: Financial Management (SKL-061 to SKL-065)
  // =====================================================================

  {
    code: "SKL-061",
    domain: "Financial Management",
    questionText: "How effectively does the school develop and adhere to an annual budget that is based on actual needs assessment, covers all operational areas including teaching, maintenance, welfare, and development, and is approved by the relevant governing authority?",
    dimension: "Budget Planning & Adherence",
    options: [
      { optionText: "Never — there is no formal budget and financial decisions are made on an ad hoc basis with no planning or approval process", score: 1, optionOrder: 1 },
      { optionText: "Rarely — a basic budget exists but it is not based on needs assessment, excludes key areas, and is not adhered to during the year", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — a budget is prepared and approved but significant mid-year deviations occur and some expenditure areas are consistently underfunded", score: 3, optionOrder: 3 },
      { optionText: "Often — a needs-based budget is prepared, approved, monitored regularly, and adjusted within acceptable variance limits throughout the year", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive budgeting process includes needs assessment, stakeholder input, quarterly variance analysis, and documented adherence with explanations for deviations", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-062",
    domain: "Financial Management",
    questionText: "How transparent is the school's financial management — are income sources, expenditure categories, procurement processes, and financial reports accessible to the school governing body, parents, and relevant authorities with appropriate accountability mechanisms?",
    dimension: "Financial Transparency",
    options: [
      { optionText: "Never — financial records are not disclosed to anyone beyond the principal or bursar and there is no external oversight or accountability", score: 1, optionOrder: 1 },
      { optionText: "Rarely — the governing body receives basic summaries but there is no detailed reporting, no parent visibility, and procurement lacks formal processes", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — financial reports are presented to the governing body but they are delayed, lack detail, and procurement processes are not consistently followed", score: 3, optionOrder: 3 },
      { optionText: "Often — regular, detailed financial reports are provided to governance structures with documented procurement processes and external audit trails", score: 4, optionOrder: 4 },
      { optionText: "Always — full financial transparency includes published budgets, regular governance reports, external audits, open procurement, and accessible summaries for parents", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-063",
    domain: "Financial Management",
    questionText: "How strategically does the school allocate its financial resources — directing funding towards evidence-based priorities such as teacher development, learning materials, student welfare, and infrastructure improvements rather than towards administrative overheads or low-impact spending?",
    dimension: "Strategic Resource Allocation",
    options: [
      { optionText: "Never — spending decisions are made without reference to school improvement priorities and a disproportionate share goes to non-teaching costs", score: 1, optionOrder: 1 },
      { optionText: "Rarely — some funding reaches classrooms but there is no strategic framework linking expenditure to identified school improvement needs", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — resource allocation considers school priorities but decisions are influenced by convenience or politics rather than by evidence of impact", score: 3, optionOrder: 3 },
      { optionText: "Often — a resource allocation framework directs funding towards priority areas with documented justification and monitoring of impact on outcomes", score: 4, optionOrder: 4 },
      { optionText: "Always — strategic resource allocation is data-informed, transparently prioritised, regularly reviewed against outcomes, and adjusted based on evidence of return on investment", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-064",
    domain: "Financial Management",
    questionText: "How regularly and thoroughly are financial reports prepared, reviewed, and acted upon — including income and expenditure statements, bank reconciliations, debt tracking, and variance analysis — by the school's financial governance structures?",
    dimension: "Financial Reporting",
    options: [
      { optionText: "Never — there are no regular financial reports and the school's financial position is not systematically monitored or reported to anyone", score: 1, optionOrder: 1 },
      { optionText: "Rarely — basic financial summaries are prepared annually but they are not reviewed in detail and do not lead to any corrective action", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — financial reports are prepared quarterly but they are not presented to governance structures in a timely manner and actions are not followed up", score: 3, optionOrder: 3 },
      { optionText: "Often — regular, accurate financial reports are presented to the governing body with variance analysis, corrective actions documented, and bank reconciliations verified", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive financial reporting framework includes monthly reports, real-time dashboards, reconciliations, audit trails, and governance sign-off with action tracking", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-065",
    domain: "Financial Management",
    questionText: "To what extent has the school developed a long-term financial sustainability plan — including diversified income sources, reserve funds, infrastructure replacement schedules, fundraising strategies, and contingency planning for unexpected financial challenges?",
    dimension: "Financial Sustainability Planning",
    options: [
      { optionText: "Never — the school has no long-term financial plan and would face a crisis if a major unexpected expense or income shortfall occurred", score: 1, optionOrder: 1 },
      { optionText: "Rarely — the school operates from year to year with no reserve fund, no replacement planning, and no contingency provisions", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some long-term financial thinking exists but it is not formalised into a plan with targets, timelines, or accountability", score: 3, optionOrder: 3 },
      { optionText: "Often — a sustainability plan addresses income diversification, infrastructure replacement, reserves, and contingency, and is reviewed annually", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive financial sustainability framework includes multi-year projections, reserve policies, asset management, fundraising strategy, and documented stress testing", score: 5, optionOrder: 5 },
    ],
  },

  // =====================================================================
  // DOMAIN 14: Student Achievement Outcomes (SKL-066 to SKL-070)
  // =====================================================================

  {
    code: "SKL-066",
    domain: "Student Achievement Outcomes",
    questionText: "How does the school's overall pass rate in internal and external examinations compare to national averages and the performance of similar schools, and what trend has this rate followed over the past three to five years?",
    dimension: "Examination Pass Rates",
    options: [
      { optionText: "Never — the school's pass rate is significantly below the national average and has been declining year on year with no intervention", score: 1, optionOrder: 1 },
      { optionText: "Rarely — the pass rate is below average and has stagnated or declined, with improvement efforts showing no measurable impact", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — the pass rate is near the national average but improvement is slow and inconsistent across subjects and grade levels", score: 3, optionOrder: 3 },
      { optionText: "Often — the pass rate is above the national average with a positive upward trend across most subjects and documented evidence of improvement strategies", score: 4, optionOrder: 4 },
      { optionText: "Always — the pass rate significantly exceeds national and peer averages with consistent year-on-year improvement across all subjects", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-067",
    domain: "Student Achievement Outcomes",
    questionText: "What proportion of students who enroll in one level successfully progress to the next level — for example from primary to junior secondary, junior to senior secondary, or senior secondary to tertiary education — and how does this compare to regional benchmarks?",
    dimension: "Progression Rates",
    options: [
      { optionText: "Never — the school has high dropout rates at transition points and does not track or monitor student progression between levels", score: 1, optionOrder: 1 },
      { optionText: "Rarely — progression is tracked but rates are significantly below regional benchmarks with no targeted interventions for at-risk students", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — progression rates are near regional averages but gaps exist for specific demographics such as girls, students with disabilities, or lower-income groups", score: 3, optionOrder: 3 },
      { optionText: "Often — progression rates are above regional benchmarks with documented interventions supporting at-risk students through transition periods", score: 4, optionOrder: 4 },
      { optionText: "Always — exceptional progression rates are achieved across all demographic groups with data-driven early warning systems and targeted transition support", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-068",
    domain: "Student Achievement Outcomes",
    questionText: "How does the school's performance on standardised external examinations — such as national certification exams, entrance tests, or international benchmark assessments — compare to schools with similar demographics, and what percentage of students achieve distinction or merit-level grades?",
    dimension: "External Exam Performance",
    options: [
      { optionText: "Never — the school's external exam results are consistently far below comparable schools and no students achieve distinction or merit grades", score: 1, optionOrder: 1 },
      { optionText: "Rarely — results are below comparable schools with only occasional students achieving high grades and no improvement trend", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — results are similar to comparable schools but the proportion of high-achieving students is low and results vary significantly year to year", score: 3, optionOrder: 3 },
      { optionText: "Often — results exceed comparable schools with a growing proportion of students achieving distinction or merit and a positive trend over three years", score: 4, optionOrder: 4 },
      { optionText: "Always — the school consistently outperforms comparable institutions with a high proportion of distinction/merit grades and documented year-on-year improvement", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-069",
    domain: "Student Achievement Outcomes",
    questionText: "What is the school's graduation rate — the percentage of students who enter the school and complete the final grade within the expected timeframe — and how effectively does the school track and support students who are at risk of not completing their education?",
    dimension: "Graduation Rates",
    options: [
      { optionText: "Never — the school does not track graduation rates and many students leave before completing their education with no follow-up or support", score: 1, optionOrder: 1 },
      { optionText: "Rarely — graduation rates are known but are low, with high dropout rates in senior years and no systematic early warning or intervention system", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — graduation rates are near average but at-risk students are identified late and interventions are insufficient to prevent dropout", score: 3, optionOrder: 3 },
      { optionText: "Often — graduation rates are above average with an early warning system that identifies at-risk students and targeted interventions that maintain completion rates", score: 4, optionOrder: 4 },
      { optionText: "Always — near-universal graduation is achieved through comprehensive tracking, early intervention, family engagement, and documented strategies for every at-risk student", score: 5, optionOrder: 5 },
    ],
  },
  {
    code: "SKL-070",
    domain: "Student Achievement Outcomes",
    questionText: "To what extent does the school prepare students for success after graduation — through career guidance counselling, university application support, vocational training links, life skills education, and documented tracking of graduates' post-secondary pathways?",
    dimension: "College & Career Readiness",
    options: [
      { optionText: "Never — the school provides no career guidance, no post-graduation support, and has no idea what happens to students after they leave", score: 1, optionOrder: 1 },
      { optionText: "Rarely — occasional career talks are organised but there is no structured guidance programme and no tracking of graduate outcomes", score: 2, optionOrder: 2 },
      { optionText: "Sometimes — some career guidance exists but it is limited to university-bound students, with no vocational pathway support or graduate tracking", score: 3, optionOrder: 3 },
      { optionText: "Often — a career guidance programme supports all post-secondary pathways including university, vocational training, and employment, with graduate outcome tracking", score: 4, optionOrder: 4 },
      { optionText: "Always — a comprehensive readiness programme includes personalised guidance, skills workshops, application support, industry links, and documented graduate outcome data", score: 5, optionOrder: 5 },
    ],
  },
];
