export const DOMAIN_NAMES = [
  "Teaching Quality & Pedagogy",
  "Curriculum Implementation",
  "Student Assessment & Evaluation",
  "School Leadership & Management",
  "Infrastructure & Resources",
  "Student Support & Welfare",
  "Parent & Community Engagement",
  "Teacher Development",
  "School Culture & Climate",
  "Data-Driven Decision Making",
  "Technology Integration",
  "Safety & Discipline",
  "Financial Management",
  "Student Achievement Outcomes",
] as const;

export type DomainName = (typeof DOMAIN_NAMES)[number];

export type DomainRating = "critical" | "needs_improvement" | "adequate" | "good" | "excellent";
export type Priority = "high" | "medium" | "low";
export type Timeframe = "30_days" | "60_days" | "90_days";
export type Difficulty = "easy" | "moderate" | "challenging";
export type BenchmarkStatus = "ahead" | "on_track" | "behind" | "critical";

export interface DomainAnalysis {
  domain: string;
  score: number;
  rating: DomainRating;
  findings: string[];
  strengths: string[];
  improvements: string[];
  priority: Priority;
}

export interface PriorityAction {
  rank: number;
  domain: string;
  action: string;
  expectedImpact: string;
  timeframe: Timeframe;
  resources: string[];
  difficulty: Difficulty;
}

export interface BenchmarkComparison {
  domain: string;
  schoolScore: number;
  bestPracticeScore: number;
  gap: number;
  status: BenchmarkStatus;
}

export interface ImprovementTimeline {
  phase30Days: { actions: string[]; expectedOutcome: string };
  phase60Days: { actions: string[]; expectedOutcome: string };
  phase90Days: { actions: string[]; expectedOutcome: string };
}

export interface SchoolDeepReport {
  overallScore: number;
  overallRating: string;
  domainAnalysis: DomainAnalysis[];
  criticalGaps: DomainAnalysis[];
  strengths: DomainAnalysis[];
  priorityActions: PriorityAction[];
  benchmarkComparison: BenchmarkComparison[];
  improvementTimeline: ImprovementTimeline;
  resourceRecommendations: { domain: string; resources: string[] }[];
  aiSummary: string;
}

const BEST_PRACTICE_SCORE = 85;

const DOMAIN_FINDINGS: Record<DomainName, {
  critical: string[];
  needs_improvement: string[];
  adequate: string[];
  good: string[];
  excellent: string[];
}> = {
  "Teaching Quality & Pedagogy": {
    critical: [
      "Teachers rely primarily on lecture-based methods with limited student engagement strategies",
      "No evidence of differentiated instruction to address diverse learning needs",
      "Lesson delivery lacks structured learning objectives and measurable outcomes",
      "Classroom instruction does not incorporate formative assessment techniques",
    ],
    needs_improvement: [
      "Teaching methods are predominantly teacher-centered with occasional student participation",
      "Limited use of collaborative or inquiry-based learning strategies",
      "Lesson plans lack alignment with age-appropriate pedagogical approaches",
      "Assessment feedback to students is infrequent and not actionable",
    ],
    adequate: [
      "Teachers demonstrate basic competency in content delivery and classroom management",
      "Some evidence of varied instructional strategies across different subjects",
      "Lesson plans include basic learning objectives but lack depth in differentiation",
      "Formative assessments are conducted but results are not consistently used to adjust instruction",
    ],
    good: [
      "Teachers employ a range of active learning strategies including group work and practical demonstrations",
      "Evidence of differentiated instruction targeting different ability levels within classes",
      "Regular formative assessments inform instructional adjustments",
      "Teachers demonstrate strong content knowledge and effective communication skills",
    ],
    excellent: [
      "Teachers consistently implement research-backed pedagogical approaches across all subjects",
      "Student-centered learning is the norm with evidence of project-based and inquiry-based instruction",
      "High-quality formative and summative assessments drive continuous instructional improvement",
      "Teachers model critical thinking and higher-order questioning techniques effectively",
    ],
  },
  "Curriculum Implementation": {
    critical: [
      "No structured curriculum mapping or pacing guide exists for core subjects",
      "Significant portions of the national curriculum are not being covered each term",
      "Teaching materials are outdated and do not align with current curriculum standards",
      "No evidence of cross-curricular integration or thematic planning",
    ],
    needs_improvement: [
      "Curriculum coverage is incomplete with several topics consistently skipped each term",
      "Pacing guides exist but are not followed, leading to rushed coverage before examinations",
      "Teaching materials partially align with the national curriculum but lack comprehensive coverage",
      "Limited integration of locally relevant content into the standard curriculum",
    ],
    adequate: [
      "Core curriculum topics are generally covered but with inconsistent depth across subjects",
      "Pacing guides exist and are mostly followed with some deviations",
      "Teaching and learning materials are available but may need updating in several subjects",
      "Basic cross-curricular connections are made in some subject areas",
    ],
    good: [
      "Comprehensive curriculum coverage with systematic pacing across all terms",
      "Teaching materials are current, relevant, and well-organized for effective delivery",
      "Evidence of vertical and horizontal curriculum alignment across grade levels",
      "Cross-curricular themes are intentionally planned and executed",
    ],
    excellent: [
      "Full curriculum coverage with enrichment activities extending beyond minimum requirements",
      "Curriculum is delivered with exceptional fidelity and creative adaptation to local context",
      "Teaching materials are regularly updated and supplemented with current resources",
      "Seamless vertical and horizontal curriculum integration across all levels and subjects",
    ],
  },
  "Student Assessment & Evaluation": {
    critical: [
      "No consistent assessment policy or schedule across the school",
      "Assessments are limited to end-of-term examinations only",
      "No evidence of assessment results being analyzed or used for instructional planning",
      "Student work is rarely graded with constructive feedback",
    ],
    needs_improvement: [
      "Assessment schedule exists but is not consistently implemented across all subjects",
      "Over-reliance on objective tests with limited use of alternative assessment methods",
      "Assessment results are recorded but rarely analyzed for patterns or trends",
      "Feedback to students is generic and does not guide improvement",
    ],
    adequate: [
      "Regular assessments are conducted following a published schedule",
      "Mix of assessment types including tests, assignments, and class exercises",
      "Basic analysis of assessment results is conducted at the class level",
      "Students receive grades with some explanatory feedback",
    ],
    good: [
      "Comprehensive assessment policy with diverse methods including portfolios and practical assessments",
      "Assessment results are systematically analyzed to identify student and class-level trends",
      "Rubric-based grading ensures consistency and transparency across teachers",
      "Students receive timely, specific, and actionable feedback on their work",
    ],
    excellent: [
      "Robust multi-modal assessment system aligned with national examination standards (WAEC/NECO)",
      "Data from assessments is analyzed at school, class, and individual student levels with clear action plans",
      "Moderation and standardization processes ensure assessment validity and reliability",
      "Students are equipped with self-assessment and peer-assessment skills",
    ],
  },
  "School Leadership & Management": {
    critical: [
      "Leadership structure is unclear with no defined roles and responsibilities",
      "No evidence of a school development plan or strategic vision",
      "Decision-making is centralized with no staff involvement or consultation",
      "Administrative processes are disorganized and lack standard operating procedures",
    ],
    needs_improvement: [
      "Leadership exists but operates primarily in reactive mode without proactive planning",
      "School development plan exists but is not actively monitored or implemented",
      "Limited delegation of responsibilities to middle management or department heads",
      "Communication between leadership and staff is inconsistent and top-down",
    ],
    adequate: [
      "Clear leadership hierarchy with defined roles and basic management structures",
      "School development plan exists with some regular review and updating",
      "Staff meetings are held regularly though participation and follow-through vary",
      "Basic administrative systems are in place for daily operations",
    ],
    good: [
      "Strong distributed leadership model with empowered department and committee heads",
      "Strategic plan is actively implemented with quarterly reviews and progress tracking",
      "Transparent communication channels between leadership, staff, students, and parents",
      "Effective conflict resolution and problem-solving mechanisms are in place",
    ],
    excellent: [
      "Visionary leadership driving continuous school improvement with measurable targets",
      "Highly effective distributed leadership with staff ownership of school goals",
      "Strategic plan is data-informed with regular stakeholder input and evidence-based adjustments",
      "Leadership models best practices in educational management recognized by quality assurance bodies",
    ],
  },
  "Infrastructure & Resources": {
    critical: [
      "Basic classroom infrastructure is inadequate with overcrowding and poor ventilation",
      "No functional library, laboratory, or dedicated learning spaces",
      "Essential teaching and learning materials are unavailable across most subjects",
      "Sanitary facilities are insufficient and do not meet minimum standards",
    ],
    needs_improvement: [
      "Classrooms are functional but lack adequate furniture, lighting, and ventilation",
      "Library or resource center exists but is poorly stocked and underutilized",
      "Teaching materials are available in some subjects but not consistently across all levels",
      "Sports and recreational facilities are limited or in poor condition",
    ],
    adequate: [
      "Classrooms are sufficient in number and meet basic comfort and safety standards",
      "Library exists with a moderate collection of relevant books and learning materials",
      "Teaching and learning resources are available for core subjects",
      "Basic maintenance schedule keeps infrastructure in acceptable condition",
    ],
    good: [
      "Well-maintained classrooms with modern furniture, adequate lighting, and ventilation",
      "Functional library with diverse, current collections and a management system",
      "Subject-specific laboratories and resource rooms are equipped for practical learning",
      "Sports facilities and recreational spaces support physical education programmes",
    ],
    excellent: [
      "Modern, purpose-built learning spaces designed for flexible and collaborative instruction",
      "Comprehensive library and media centre with digital and print resources exceeding standards",
      "Fully equipped laboratories, ICT suites, and maker spaces for hands-on learning",
      "Infrastructure consistently meets or exceeds UBEC/SEBEC facility standards",
    ],
  },
  "Student Support & Welfare": {
    critical: [
      "No formal student welfare or support programme exists",
      "Students with learning difficulties receive no special attention or accommodation",
      "No system for identifying or supporting at-risk or vulnerable students",
      "Nutritional and health support programmes are absent",
    ],
    needs_improvement: [
      "Basic student welfare policies exist but are not consistently implemented",
      "Limited support for students with special educational needs or learning difficulties",
      "Counselling services are available on an ad hoc basis rather than systematically",
      "Anti-bullying and peer support initiatives are mentioned but not actively enforced",
    ],
    adequate: [
      "Student welfare policy is in place with designated staff for support functions",
      "Basic provisions exist for students with identified learning difficulties",
      "School counselling services are available with regular scheduled sessions",
      "Health and nutrition support programmes operate at a basic level",
    ],
    good: [
      "Comprehensive student welfare programme with proactive identification and support systems",
      "Inclusive education practices accommodate diverse learning needs effectively",
      "Professional counselling services with referral pathways to external support",
      "Active peer mentoring and anti-bullying programmes with measurable outcomes",
    ],
    excellent: [
      "Holistic student support ecosystem addressing academic, social, emotional, and physical needs",
      "Fully inclusive practices with individualized learning plans for students with special needs",
      "Comprehensive mental health and psychosocial support programme with trained counsellors",
      "Student welfare outcomes are tracked and inform continuous programme improvement",
    ],
  },
  "Parent & Community Engagement": {
    critical: [
      "No formal mechanism for parent-teacher communication or engagement",
      "Parents are not involved in school decision-making or governance",
      "Community partnerships are non-existent or purely transactional",
      "PTA/parent forums do not exist or have never been convened",
    ],
    needs_improvement: [
      "Parent-teacher meetings occur but are poorly attended and lack structured agendas",
      "Communication with parents is limited to report card distribution and disciplinary issues",
      "Community engagement is minimal beyond occasional events or donations",
      "Parent volunteers or resource persons are rarely invited into the school",
    ],
    adequate: [
      "Regular parent-teacher meetings are held with reasonable attendance",
      "Multiple communication channels exist including meetings, notes, and phone contact",
      "PTA is active and contributes to some school development discussions",
      "Basic community partnerships support school programmes and activities",
    ],
    good: [
      "Active parent engagement programme with multiple touchpoints throughout the year",
      "Parents are regular partners in school governance through PTA and advisory committees",
      "Community resources including professionals, businesses, and organisations are actively leveraged",
      "Two-way communication is consistent, timely, and builds genuine partnerships",
    ],
    excellent: [
      "Exemplary parent-school partnership model with deep engagement in learning and governance",
      "Parents contribute meaningfully as volunteers, mentors, and resource persons",
      "School is a valued community hub with robust partnerships benefiting students and families",
      "Community engagement is formalized with clear MOUs and mutual accountability",
    ],
  },
  "Teacher Development": {
    critical: [
      "No professional development programme or policy exists for teaching staff",
      "Teachers have not participated in any formal training in the past two years",
      "No mentoring or induction programme for newly appointed teachers",
      "Teachers are not encouraged or supported to pursue further qualifications",
    ],
    needs_improvement: [
      "Occasional in-service training is offered but without a systematic development plan",
      "Teacher appraisals are conducted but not linked to professional growth plans",
      "New teacher orientation is limited to basic administrative briefing",
      "Limited opportunities for peer learning or collaborative professional development",
    ],
    adequate: [
      "Annual professional development plan identifies training needs and provides opportunities",
      "Teacher appraisal system includes performance review and basic feedback",
      "Induction programme supports new teachers through their first term",
      "Some collaborative planning and peer observation activities occur",
    ],
    good: [
      "Comprehensive CPD programme with needs assessment, delivery, and follow-up evaluation",
      "Teacher appraisals are developmental with individualized growth plans and mentoring",
      "Strong induction programme pairs new teachers with experienced mentors",
      "Teachers are supported to attend external training, conferences, and further education",
    ],
    excellent: [
      "Professional development culture is embedded with teachers as active learners and researchers",
      "TRCN-compliant appraisal and certification support system ensures teacher quality standards",
      "Comprehensive induction with structured mentoring produces highly effective new teachers",
      "School is recognized as a centre of excellence for teacher development and pedagogical innovation",
    ],
  },
  "School Culture & Climate": {
    critical: [
      "School environment is characterized by low morale, disengagement, and negative attitudes",
      "No evidence of shared values, vision, or positive school identity",
      "Staff and student relationships are predominantly authoritarian or disengaged",
      "The physical environment does not reflect a welcoming or learning-focused culture",
    ],
    needs_improvement: [
      "Some positive cultural elements exist but are not consistently promoted or sustained",
      "School rules and expectations are posted but not internalized by students or staff",
      "Celebration of student achievement and recognition is sporadic",
      "Physical environment is functional but does not inspire learning or pride",
    ],
    adequate: [
      "Generally positive school culture with shared expectations for behaviour and conduct",
      "Regular assemblies and events reinforce school values and community spirit",
      "Staff morale is moderate with some collaborative and supportive practices",
      "School environment is clean, organized, and reasonably well-maintained",
    ],
    good: [
      "Strong positive school culture with visible shared values and high expectations",
      "Regular recognition and celebration of academic, sporting, and co-curricular achievements",
      "Collaborative staff culture with effective teamwork and mutual support",
      "Learning environment is stimulating, inclusive, and reflects diverse student identities",
    ],
    excellent: [
      "Vibrant, inclusive school culture that fosters belonging, excellence, and continuous improvement",
      "Students, staff, and parents actively contribute to and celebrate the school's positive identity",
      "Culture of innovation, experimentation, and constructive risk-taking in teaching and learning",
      "Physical and social environment serves as a model for other schools in the community",
    ],
  },
  "Data-Driven Decision Making": {
    critical: [
      "No systematic collection or use of school performance data",
      "Decision-making relies entirely on intuition or tradition without evidence",
      "Student records are maintained inconsistently with frequent gaps and errors",
      "No access to data analysis tools or skills within the school leadership",
    ],
    needs_improvement: [
      "Basic data is collected on student enrolment and attendance but not used for planning",
      "Assessment results are recorded but not analyzed for actionable insights",
      "Some data exists but is scattered across different systems or paper records",
      "Limited data literacy among staff prevents effective use of available information",
    ],
    adequate: [
      "Regular data collection on enrolment, attendance, assessment, and basic school operations",
      "Assessment data is analyzed at class and subject levels to inform some decisions",
      "Student records are maintained in a reasonably organized and accessible system",
      "Leadership demonstrates some data-informed decision-making practices",
    ],
    good: [
      "Comprehensive data collection with systematic analysis driving school improvement planning",
      "Assessment analytics identify school-wide trends, gaps, and opportunities for targeted intervention",
      "Integrated data management system provides real-time access to key performance indicators",
      "Staff are trained in basic data interpretation and use for classroom-level decisions",
    ],
    excellent: [
      "Sophisticated data ecosystem with automated collection, analysis, and reporting dashboards",
      "Data drives all major decisions from classroom instruction to strategic planning",
      "Predictive analytics identify at-risk students and areas requiring proactive intervention",
      "Data governance framework ensures accuracy, privacy, and ethical use of all school data",
    ],
  },
  "Technology Integration": {
    critical: [
      "ICT infrastructure is insufficient for meaningful technology integration in learning",
      "No computers or digital devices are available for student or teacher use",
      "Teachers lack basic digital literacy skills required for modern instruction",
      "No internet connectivity or digital content resources exist in the school",
    ],
    needs_improvement: [
      "Limited ICT equipment exists but is not regularly used for instructional purposes",
      "Some teachers use technology for basic tasks like typing lesson notes",
      "Internet access is unreliable or unavailable for most staff and students",
      "No policy or plan for integrating technology into teaching and learning",
    ],
    adequate: [
      "Basic ICT infrastructure supports limited technology-enhanced learning activities",
      "A number of teachers incorporate technology tools into their instruction regularly",
      "Internet connectivity is available and used for research and resource development",
      "Technology use is addressed in the school development plan",
    ],
    good: [
      "Adequate ICT infrastructure with regular access for both teachers and students",
      "Technology is meaningfully integrated across multiple subjects as a learning tool",
      "Digital literacy is part of teacher professional development and student learning outcomes",
      "E-learning platforms or digital content libraries supplement classroom instruction",
    ],
    excellent: [
      "State-of-the-art ICT infrastructure supporting seamless technology integration in all subjects",
      "Students and teachers are proficient digital citizens and creators of digital content",
      "Blended and online learning models enhance and extend classroom instruction",
      "Technology infrastructure and practices align with national ICT-in-education standards",
    ],
  },
  "Safety & Discipline": {
    critical: [
      "No formal safety or discipline policy exists in the school",
      "Students and staff do not feel safe within the school environment",
      "Incidents of violence, bullying, or substance abuse are unreported and unaddressed",
      "No emergency preparedness plan or safety protocols are in place",
    ],
    needs_improvement: [
      "Discipline policy exists but is inconsistently enforced and not regularly reviewed",
      "Basic safety measures are present but do not comprehensively address all risks",
      "Incident reporting is ad hoc with no tracking or follow-up system",
      "Emergency drills and safety awareness activities are infrequent",
    ],
    adequate: [
      "Clear discipline and safety policies are published and generally enforced",
      "Basic safety infrastructure including fire extinguishers, first aid kits, and exits are present",
      "Incidents are recorded and addressed through established disciplinary procedures",
      "Regular safety drills are conducted at least once per term",
    ],
    good: [
      "Comprehensive safety and discipline policies with restorative and positive approaches",
      "Safe and secure learning environment with well-maintained safety infrastructure",
      "Proactive anti-bullying and positive behaviour support programmes with measurable outcomes",
      "Emergency preparedness is regularly tested with clear protocols and trained staff",
    ],
    excellent: [
      "Exemplary safety culture where every member of the community feels secure and valued",
      "Discipline is maintained through positive reinforcement, restorative practices, and clear expectations",
      "Comprehensive risk management with regular audits, insurance, and proactive mitigation",
      "Safety and discipline practices serve as benchmarks for schools across the state or region",
    ],
  },
  "Financial Management": {
    critical: [
      "No formal budget or financial planning process exists",
      "Financial records are incomplete, disorganized, or absent",
      "School funds are not accounted for or subject to any oversight mechanism",
      "Fees and levies are collected without transparent records or reporting to stakeholders",
    ],
    needs_improvement: [
      "Basic budget exists but is not regularly reviewed or adhered to",
      "Financial records are maintained but lack detail and systematic organization",
      "Limited financial transparency with stakeholders receiving minimal reporting",
      "Procurement processes are informal and not documented",
    ],
    adequate: [
      "Annual budget is prepared, approved, and generally followed with some variance",
      "Financial records are maintained with regular reconciliation and basic reporting",
      "PTA and school board receive periodic financial reports",
      "Procurement follows basic competitive bidding for major purchases",
    ],
    good: [
      "Comprehensive budgeting process with departmental input and regular variance analysis",
      "Robust financial management systems with clear audit trails and internal controls",
      "Regular and transparent financial reporting to all stakeholders including parents",
      "Procurement policies ensure value for money with documented competitive processes",
    ],
    excellent: [
      "Exemplary financial governance with multi-year financial planning aligned to strategic goals",
      "Professional financial management meeting UBEC and state education authority standards",
      "Full financial transparency with detailed public reporting and independent audit",
      "Diversified funding streams with active pursuit of grants and partnership opportunities",
    ],
  },
  "Student Achievement Outcomes": {
    critical: [
      "Student performance on internal and external examinations is severely below acceptable levels",
      "No systematic tracking of student achievement data across cohorts",
      "Pass rates in core subjects (Mathematics, English, Science) are critically low",
      "Significant gender or demographic gaps in achievement are unaddressed",
    ],
    needs_improvement: [
      "Student achievement is below national or state averages in several core subjects",
      "Some tracking of results exists but analysis is limited to surface-level comparisons",
      "Pass rates show improvement over time but remain below target benchmarks",
      "Achievement gaps between student groups are identified but not systematically addressed",
    ],
    adequate: [
      "Student achievement meets basic benchmarks with some subjects performing better than others",
      "Results are tracked and compared across terms and years to identify trends",
      "Pass rates in core subjects are generally satisfactory though with room for improvement",
      "Basic interventions are in place for underperforming students or subjects",
    ],
    good: [
      "Student achievement consistently meets or exceeds national and state examination benchmarks",
      "Comprehensive achievement tracking with cohort analysis and trend identification",
      "Strong pass rates in WAEC/NECO with competitive performance across all core subjects",
      "Achievement gaps are monitored and targeted interventions show measurable improvement",
    ],
    excellent: [
      "Student achievement places the school among the top performers in the state or region",
      "Results consistently surpass national averages and approach or meet best practice levels",
      "WAEC/NECO results demonstrate outstanding performance with distinctions in multiple subjects",
      "Data shows sustained improvement with excellence across all student demographic groups",
    ],
  },
};

const DOMAIN_RESOURCES: Record<DomainName, string[]> = {
  "Teaching Quality & Pedagogy": [
    "National Policy on Education (2013) — Section on Teaching Methods and Standards",
    "TRCN Code of Professional Conduct for Teachers",
    "Teacher Registration Council of Nigeria (TRCN) competency standards",
    "Nigerian Educational Research and Development Council (NERDC) teaching guidelines",
    "WAEC/NECO Chief Examiners' reports — pedagogy recommendations",
    "Universal Basic Education Commission (UBEC) teacher effectiveness framework",
  ],
  "Curriculum Implementation": [
    "National Policy on Education — curriculum provisions and scope",
    "NERDC approved curriculum guides and syllabi for all subjects",
    "UBEC/SEBEC curriculum implementation standards for basic education",
    "State Ministry of Education curriculum pacing guides",
    "WAEC/NECO examination syllabi for terminal and certification assessments",
    "National Curriculum Studies Centre materials and resource packs",
  ],
  "Student Assessment & Evaluation": [
    "National Policy on Education — assessment and examination guidelines",
    "WAEC and NECO examination assessment frameworks and standards",
    "NERDC assessment guidelines for continuous assessment",
    "Federal Ministry of Education continuous assessment policy framework",
    "UBEC assessment standards for Basic Education Certificate Examinations",
    "TRCN assessment literacy standards for teachers",
  ],
  "School Leadership & Management": [
    "National Policy on Education — school governance provisions",
    "UBEC school management and leadership standards",
    "National Teachers Institute (NTI) school leadership training modules",
    "Federal Ministry of Education school inspection and quality assurance framework",
    "State Universal Basic Education Board (SUBEB) management guidelines",
    "National Orientation Agency (NOA) school governance best practices",
  ],
  "Infrastructure & Resources": [
    "UBEC/SEBEC minimum standards for school infrastructure",
    "National Policy on Education — provision of facilities and equipment",
    "Federal Ministry of Education school facilities standards",
    "State education authority infrastructure development guidelines",
    "National Library of Nigeria school library standards",
    "NERDC approved teaching and learning materials list",
  ],
  "Student Support & Welfare": [
    "National Policy on Education — special educational needs provisions",
    "Federal Ministry of Education inclusive education guidelines",
    "UBEC special education and welfare support standards",
    "National Commission for Persons with Disabilities — education provisions",
    "Nigerian school health programme guidelines (Federal Ministry of Health)",
    "Child Rights Act (2003) — education and welfare provisions",
  ],
  "Parent & Community Engagement": [
    "National Policy on Education — community participation provisions",
    "UBEC guidelines for parent-teacher associations",
    "National Commission for Mass Education — community engagement frameworks",
    "Federal Ministry of Education school-based management committee (SBMC) guidelines",
    "Child Rights Act (2003) — parental responsibilities in education",
    "National Orientation Agency community partnership guidelines",
  ],
  "Teacher Development": [
    "Teacher Registration Council of Nigeria (TRCN) — professional development standards",
    "National Policy on Education — teacher education and training provisions",
    "National Teachers Institute (NTI) capacity building programmes",
    "UBEC teacher professional development framework",
    "Federal Ministry of Education teacher appraisal and certification standards",
    "WAEC/NECO teacher preparation and content knowledge requirements",
  ],
  "School Culture & Climate": [
    "National Policy on Education — values and character education provisions",
    "National Orientation Agency (NOA) school culture development guidelines",
    "Federal Ministry of Education school environment and culture standards",
    "UBEC/SEBEC school climate and ethos assessment frameworks",
    "Nigerian educational quality assurance standards — school environment indicators",
    "National Council for Arts and Culture school programmes",
  ],
  "Data-Driven Decision Making": [
    "National Policy on Education — data and information management provisions",
    "UBEC Education Management Information System (EMIS) standards",
    "Federal Ministry of Education school data collection and reporting guidelines",
    "Nigerian Educational Data System (NEDS) reporting requirements",
    "UNESCO Institute for Statistics data standards for Nigerian education",
    "National Bureau of Statistics education indicators framework",
  ],
  "Technology Integration": [
    "National Policy on Education — ICT in education provisions",
    "National Information Technology Development Agency (NITDA) education standards",
    "Federal Ministry of Education ICT-in-Education masterplan",
    "UBEC/SEBEC technology integration guidelines for basic education",
    "National Council for Information Technology in Education standards",
    "WAEC/NECO ICT competency requirements and examination standards",
  ],
  "Safety & Discipline": [
    "National Policy on Education — safety and discipline provisions",
    "Child Rights Act (2003) — protection from violence and harmful treatment",
    "Federal Ministry of Education school safety and emergency preparedness guidelines",
    "National Safe Schools Framework (Federal Ministry of Education)",
    "UBEC school security and discipline management standards",
    "Nigerian police and civil defence corps school safety partnership guidelines",
  ],
  "Financial Management": [
    "National Policy on Education — funding and financial management provisions",
    "UBEC financial management guidelines for grant recipient schools",
    "Federal Ministry of Education school financial accountability standards",
    "Public Procurement Act (2007) — applicable procurement procedures",
    "UBEC/SEBEC financial reporting and audit requirements",
    "National Council on Education school fee and levy guidelines",
  ],
  "Student Achievement Outcomes": [
    "WAEC examination standards and benchmark performance levels",
    "NECO examination standards and national achievement benchmarks",
    "National Policy on Education — student performance expectations",
    "UBEC Basic Education Certificate Examination (BECE) performance standards",
    "National assessment frameworks and benchmarking studies",
    "State education authority academic performance standards and targets",
  ],
};

const BEST_PRACTICE_ACTIONS: Record<DomainName, { action: string; expectedImpact: string; timeframe: Timeframe; difficulty: Difficulty; resources: string[] }> = {
  "Teaching Quality & Pedagogy": {
    action: "Implement structured lesson observation programme with peer feedback and coaching cycles",
    expectedImpact: "Improved instructional quality with measurable gains in student engagement and achievement within one term",
    timeframe: "60_days",
    difficulty: "moderate",
    resources: ["TRCN teaching standards framework", "NERDC pedagogy guidelines", "Peer coaching protocols"],
  },
  "Curriculum Implementation": {
    action: "Develop comprehensive curriculum mapping with pacing guides and ensure alignment with NERDC standards",
    expectedImpact: "Full curriculum coverage with systematic progression, reducing gaps before terminal examinations",
    timeframe: "90_days",
    difficulty: "challenging",
    resources: ["NERDC curriculum guides", "WAEC/NECO syllabi", "Pacing guide templates"],
  },
  "Student Assessment & Evaluation": {
    action: "Establish a school-wide continuous assessment policy aligned with Federal Ministry of Education guidelines",
    expectedImpact: "Balanced assessment system improving validity and reliability of student performance measurement",
    timeframe: "60_days",
    difficulty: "moderate",
    resources: ["FME continuous assessment policy", "WAEC assessment frameworks", "Rubric development guides"],
  },
  "School Leadership & Management": {
    action: "Create a distributed leadership structure with empowered department heads and committee chairs",
    expectedImpact: "More responsive management with faster decision implementation and improved staff engagement",
    timeframe: "90_days",
    difficulty: "challenging",
    resources: ["NTI leadership modules", "SBMC governance guidelines", "Management handbooks"],
  },
  "Infrastructure & Resources": {
    action: "Conduct a comprehensive infrastructure audit and develop a prioritized improvement plan with UBEC standards",
    expectedImpact: "Systematic upgrade of learning environments meeting minimum national facility standards",
    timeframe: "90_days",
    difficulty: "challenging",
    resources: ["UBEC infrastructure standards", "Facility audit checklist", "SUBEB development guidelines"],
  },
  "Student Support & Welfare": {
    action: "Establish a formal student welfare committee with referral pathways and support protocols",
    expectedImpact: "Improved identification and support of at-risk students reducing dropout and welfare incidents",
    timeframe: "30_days",
    difficulty: "easy",
    resources: ["FME inclusive education guidelines", "Child Rights Act provisions", "Welfare committee frameworks"],
  },
  "Parent & Community Engagement": {
    action: "Launch a structured parent engagement programme with monthly touchpoints and volunteer opportunities",
    expectedImpact: "Stronger home-school partnerships improving student attendance, behaviour, and academic outcomes",
    timeframe: "30_days",
    difficulty: "easy",
    resources: ["UBEC PTA guidelines", "SBMC engagement frameworks", "Communication templates"],
  },
  "Teacher Development": {
    action: "Implement a needs-based CPD programme with individualized teacher growth plans and mentoring",
    expectedImpact: "Enhanced teacher competencies leading to improved instruction quality and professional satisfaction",
    timeframe: "90_days",
    difficulty: "moderate",
    resources: ["TRCN professional development standards", "NTI training modules", "Mentoring programme guides"],
  },
  "School Culture & Climate": {
    action: "Develop and implement a school values programme with recognition systems and community-building activities",
    expectedImpact: "Positive, inclusive school culture with improved morale and reduced disciplinary incidents",
    timeframe: "60_days",
    difficulty: "moderate",
    resources: ["NOA school culture guidelines", "Values education resources", "Recognition programme templates"],
  },
  "Data-Driven Decision Making": {
    action: "Implement an Education Management Information System (EMIS) with training for data collection and analysis",
    expectedImpact: "Evidence-based decision making at all levels with real-time access to key performance indicators",
    timeframe: "90_days",
    difficulty: "challenging",
    resources: ["UBEC EMIS standards", "NEDS reporting guidelines", "Data literacy training materials"],
  },
  "Technology Integration": {
    action: "Develop a technology integration plan aligned with the National ICT-in-Education masterplan with teacher training",
    expectedImpact: "Meaningful technology use in teaching and learning enhancing student engagement and digital literacy",
    timeframe: "90_days",
    difficulty: "challenging",
    resources: ["NITDA education standards", "FME ICT masterplan", "Digital literacy curricula"],
  },
  "Safety & Discipline": {
    action: "Establish a comprehensive school safety plan with emergency protocols, positive discipline, and student safety committees",
    expectedImpact: "Safer learning environment with reduced incidents and improved sense of security for all community members",
    timeframe: "30_days",
    difficulty: "easy",
    resources: ["National Safe Schools Framework", "Child Rights Act provisions", "Emergency preparedness checklists"],
  },
  "Financial Management": {
    action: "Implement transparent financial management systems with regular reporting and independent oversight",
    expectedImpact: "Improved financial accountability and resource allocation efficiency with stakeholder confidence",
    timeframe: "60_days",
    difficulty: "moderate",
    resources: ["UBEC financial guidelines", "Public Procurement Act", "Audit and reporting templates"],
  },
  "Student Achievement Outcomes": {
    action: "Establish an achievement monitoring system with cohort analysis, gap identification, and targeted intervention programmes",
    expectedImpact: "Data-driven improvement in examination pass rates and reduction in achievement gaps across student groups",
    timeframe: "60_days",
    difficulty: "moderate",
    resources: ["WAEC/NECO performance benchmarks", "BECE standards", "Gap analysis frameworks"],
  },
};

function rateDomain(score: number): DomainRating {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "adequate";
  if (score >= 20) return "needs_improvement";
  return "critical";
}

function ratePriority(score: number): Priority {
  if (score < 30) return "high";
  if (score < 60) return "medium";
  return "low";
}

function computeDomainScore(responses: { score: number; domain: string }[]): number {
  if (responses.length === 0) return 0;
  const totalScore = responses.reduce((sum, r) => sum + r.score, 0);
  const maxPossible = responses.length * 5;
  return Math.round((totalScore / maxPossible) * 100);
}

function getFindings(domain: DomainName, rating: DomainRating): string[] {
  return DOMAIN_FINDINGS[domain][rating] || [];
}

function computeOverallScore(domainAnalyses: DomainAnalysis[]): number {
  if (domainAnalyses.length === 0) return 0;
  const total = domainAnalyses.reduce((sum, d) => sum + d.score, 0);
  return Math.round(total / domainAnalyses.length);
}

function overallRatingFromScore(score: number): string {
  if (score >= 80) return "Excellent — School demonstrates best practices across most areas";
  if (score >= 60) return "Good — School meets standards with clear strengths and some areas for improvement";
  if (score >= 40) return "Adequate — School meets minimum standards but significant improvement is needed";
  if (score >= 20) return "Needs Improvement — Major areas require urgent attention and systematic reform";
  return "Critical — School faces severe challenges across multiple areas requiring immediate intervention";
}

function generateBenchmarkComparison(domainAnalyses: DomainAnalysis[]): BenchmarkComparison[] {
  return domainAnalyses.map((d) => {
    const gap = d.score - BEST_PRACTICE_SCORE;
    let status: BenchmarkStatus;
    if (gap >= 0) {
      status = "ahead";
    } else if (gap >= -15) {
      status = "on_track";
    } else if (gap >= -30) {
      status = "behind";
    } else {
      status = "critical";
    }
    return {
      domain: d.domain,
      schoolScore: d.score,
      bestPracticeScore: BEST_PRACTICE_SCORE,
      gap: Math.round(gap),
      status,
    };
  });
}

function generatePriorityActions(domainAnalyses: DomainAnalysis[]): PriorityAction[] {
  const sorted = [...domainAnalyses].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 5);
  return weakest.map((d, i) => {
    const bp = BEST_PRACTICE_ACTIONS[d.domain as DomainName];
    return {
      rank: i + 1,
      domain: d.domain,
      action: bp.action,
      expectedImpact: bp.expectedImpact,
      timeframe: bp.timeframe,
      resources: bp.resources,
      difficulty: bp.difficulty,
    };
  });
}

function generateImprovementTimeline(
  domainAnalyses: DomainAnalysis[],
  priorityActions: PriorityAction[],
): ImprovementTimeline {
  const criticalDomains = domainAnalyses.filter((d) => d.rating === "critical" || d.rating === "needs_improvement");
  const mediumDomains = domainAnalyses.filter((d) => d.rating === "adequate");
  const goodDomains = domainAnalyses.filter((d) => d.rating === "good" || d.rating === "excellent");

  const phase30Actions: string[] = [];
  const phase60Actions: string[] = [];
  const phase90Actions: string[] = [];

  for (const action of priorityActions) {
    if (action.timeframe === "30_days") {
      phase30Actions.push(`[${action.domain}] ${action.action}`);
    } else if (action.timeframe === "60_days") {
      phase60Actions.push(`[${action.domain}] ${action.action}`);
    } else {
      phase90Actions.push(`[${action.domain}] ${action.action}`);
    }
  }

  if (criticalDomains.length > 0) {
    phase30Actions.unshift(
      `Conduct rapid assessment of critical areas: ${criticalDomains.map((d) => d.domain).join(", ")}`,
      "Assign dedicated task teams for each critical domain with weekly reporting cadence",
    );
  }

  if (mediumDomains.length > 0) {
    phase60Actions.push(
      `Develop targeted improvement plans for adequate domains: ${mediumDomains.map((d) => d.domain).join(", ")}`,
    );
  }

  if (goodDomains.length > 0) {
    phase90Actions.push(
      `Document and share best practices from strong domains: ${goodDomains.map((d) => d.domain).join(", ")}`,
    );
  }

  phase90Actions.push("Conduct follow-up assessment to measure improvement across all domains");

  return {
    phase30Days: {
      actions: phase30Actions,
      expectedOutcome:
        criticalDomains.length > 0
          ? `Immediate stabilization of ${criticalDomains.length} critical domain(s) with foundational systems established`
          : "Quick wins achieved and improvement momentum established",
    },
    phase60Days: {
      actions: phase60Actions,
      expectedOutcome:
        mediumDomains.length > 0
          ? `${mediumDomains.length} adequate domain(s) advanced toward good rating with measurable progress`
          : "Sustained improvement across priority areas with emerging best practices",
    },
    phase90Days: {
      actions: phase90Actions,
      expectedOutcome:
        "Comprehensive improvement cycle completed with measurable gains across all domains and baseline for next cycle established",
    },
  };
}

function generateResourceRecommendations(domainAnalyses: DomainAnalysis[]): { domain: string; resources: string[] }[] {
  return domainAnalyses
    .filter((d) => d.rating !== "excellent")
    .sort((a, b) => a.score - b.score)
    .map((d) => ({
      domain: d.domain,
      resources: DOMAIN_RESOURCES[d.domain as DomainName] || [],
    }));
}

function generateAiSummary(report: Omit<SchoolDeepReport, "aiSummary">): string {
  const { overallScore, overallRating, criticalGaps, strengths, priorityActions, benchmarkComparison } = report;

  const criticalCount = criticalGaps.length;
  const strengthCount = strengths.length;
  const behindCount = benchmarkComparison.filter((b) => b.status === "behind" || b.status === "critical").length;

  let summary = `This school assessment evaluates performance across 14 critical educational domains, yielding an overall score of ${overallScore}%. `;

  if (overallScore >= 80) {
    summary += `The school demonstrates exceptional quality across nearly all assessment areas, placing it among top-performing institutions. `;
  } else if (overallScore >= 60) {
    summary += `The school shows solid performance with notable strengths but has identifiable areas that would benefit from targeted improvement. `;
  } else if (overallScore >= 40) {
    summary += `The school meets basic standards in several areas but faces significant challenges that require systematic improvement planning. `;
  } else {
    summary += `The school faces critical challenges across multiple areas that demand urgent, coordinated intervention and resource allocation. `;
  }

  if (criticalCount > 0) {
    const gapNames = criticalGaps.slice(0, 3).map((g) => g.domain);
    summary += `${criticalCount} domain(s) scored below 40%, classified as critical gaps — including ${gapNames.join(", ")} — requiring immediate attention. `;
  }

  if (strengthCount > 0) {
    const strengthNames = strengths.slice(0, 3).map((s) => s.domain);
    summary += `${strengthCount} domain(s) demonstrated strong performance at 70% or above — notably ${strengthNames.join(", ")} — which can serve as foundations for broader improvement. `;
  }

  if (behindCount > 3) {
    summary += `The school falls behind best practice benchmarks in ${behindCount} of 14 domains, indicating a significant overall improvement opportunity. `;
  } else if (behindCount > 0) {
    summary += `${behindCount} domain(s) lag behind best practice benchmarks, presenting clear targets for focused development. `;
  }

  if (criticalCount > 0) {
    const topAction = priorityActions[0];
    summary += `The highest priority action is to ${topAction.action.toLowerCase()} in ${topAction.domain}, which is expected to ${topAction.expectedImpact.toLowerCase()} `;

    if (topAction.difficulty === "easy") {
      summary += `This can be implemented quickly with minimal resource requirements. `;
    } else if (topAction.difficulty === "moderate") {
      summary += `This requires moderate planning and resource commitment. `;
    } else {
      summary += `This is a significant undertaking requiring substantial planning and investment. `;
    }
  }

  summary += `A 30-60-90 day improvement timeline has been developed, starting with stabilization of critical areas, progressing to systematic improvement of mid-range domains, and culminating in a comprehensive review cycle. Continuous monitoring against WAEC/NECO benchmarks, UBEC/SEBEC standards, and TRCN requirements is recommended to track progress and sustain improvement.`;

  return summary;
}

export function generateSchoolDeepReport(responses: {
  questionId: string;
  score: number;
  domain: string;
}[]): SchoolDeepReport {
  const domainGroups: Record<string, { score: number; domain: string }[]> = {};
  for (const r of responses) {
    if (!domainGroups[r.domain]) domainGroups[r.domain] = [];
    domainGroups[r.domain].push(r);
  }

  const domainAnalyses: DomainAnalysis[] = DOMAIN_NAMES.map((domainName) => {
    const groupResponses = domainGroups[domainName] || [];
    const score = computeDomainScore(groupResponses);
    const rating = rateDomain(score);
    const priority = ratePriority(score);
    const findings = getFindings(domainName, rating);
    const domainData = DOMAIN_FINDINGS[domainName];

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (score >= 70) {
      strengths.push(...(domainData.excellent || []).slice(0, 2));
      if (score >= 80) strengths.push(...(domainData.good || []).slice(0, 1));
    } else if (score >= 40) {
      strengths.push(...(domainData.good || []).slice(0, 1));
    }

    if (score < 70) {
      improvements.push(...findings.slice(0, 2));
      if (score < 40) {
        improvements.push(...(domainData.needs_improvement || []).slice(0, 2));
      }
    }

    return {
      domain: domainName,
      score,
      rating,
      findings: findings.slice(0, 4),
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 4),
      priority,
    };
  });

  const overallScore = computeOverallScore(domainAnalyses);

  const criticalGaps = domainAnalyses.filter((d) => d.score < 40);
  const domainStrengths = domainAnalyses.filter((d) => d.score >= 70);

  const priorityActions = generatePriorityActions(domainAnalyses);

  const benchmarkComparison = generateBenchmarkComparison(domainAnalyses);

  const improvementTimeline = generateImprovementTimeline(domainAnalyses, priorityActions);

  const resourceRecommendations = generateResourceRecommendations(domainAnalyses);

  const reportWithoutSummary = {
    overallScore,
    overallRating: overallRatingFromScore(overallScore),
    domainAnalysis: domainAnalyses,
    criticalGaps,
    strengths: domainStrengths,
    priorityActions,
    benchmarkComparison,
    improvementTimeline,
    resourceRecommendations,
  };

  const aiSummary = generateAiSummary(reportWithoutSummary);

  return {
    ...reportWithoutSummary,
    aiSummary,
  };
}
