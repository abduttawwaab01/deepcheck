import { db } from "@/lib/db";
import {
  users, roles, permissions, rolePermissions, userRoles,
} from "@/lib/db/schemas/users";
import { subjects, topics, concepts, conceptPrerequisites, conceptMisconceptions } from "@/lib/db/schemas/content";
import { questions as questionsTable, questionOptions } from "@/lib/db/schemas/questions";
import { questionBanks, questionBankConfigs } from "@/lib/db/schemas/question-banks";
import { subscriptionPlans } from "@/lib/db/schemas/payments";
import { schoolAssessmentQuestions, schoolAssessmentOptions } from "@/lib/db/schemas/school-assessments";
import { parentAssessmentQuestions, parentAssessmentOptions } from "@/lib/db/schemas/parent-assessments";
import {
  primaryToJss1Questions,
  jss3ToSs1Questions,
  ss3ToUniversityQuestions,
} from "@/data/assessments/seeds";
import { schoolAssessmentQuestions as schoolSeeds, schoolAssessmentDomains } from "@/data/school-assessment-seeds";
import { parentAssessmentQuestions as parentSeeds, parentAssessmentDomains } from "@/data/parent-assessment-seeds";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function seed() {
  console.log("🌱 Seeding Deep Check database...\n");
  const pwHash = await bcrypt.hash("successor", 10);

  // ─── Clean existing data ──────────────────────────────────────────
  await db.execute(sql`TRUNCATE TABLE
    user_roles, users, role_permissions, permissions, roles,
    guardian_relations, student_profiles, teacher_profiles,
    school_settings, schools,
    concept_prerequisites, concept_misconceptions, concepts, topics, subjects,
    question_options, questions, question_bank_configs, question_banks,
    assessment_configs, subscription_plans,
    school_assessment_options, school_assessment_questions, school_assessment_responses, school_assessment_deep_reports,
    parent_assessment_options, parent_assessment_questions, parent_assessment_responses, parent_assessment_deep_reports
  CASCADE`);
  console.log("✓ Existing data cleared\n");

  // ─── Roles ─────────────────────────────────────────────────────────
  const roleData = await db.insert(roles).values([
    { name: "admin", description: "System administrator", isSystem: true, priority: 100 },
    { name: "school_admin", description: "School principal/head", isSystem: true, priority: 80 },
    { name: "teacher", description: "Teacher", isSystem: true, priority: 60 },
    { name: "student", description: "Student / self-registered user", isSystem: true, priority: 40 },
    { name: "parent", description: "Parent/guardian", isSystem: true, priority: 20 },
  ]).returning();
  console.log(`✓ ${roleData.length} roles created`);

  const adminRole = roleData.find((r) => r.name === "admin")!;
  const schoolAdminRole = roleData.find((r) => r.name === "school_admin")!;
  const teacherRole = roleData.find((r) => r.name === "teacher")!;
  const studentRole = roleData.find((r) => r.name === "student")!;
  const parentRole = roleData.find((r) => r.name === "parent")!;

  // ─── Permissions ───────────────────────────────────────────────────
  const permData = await db.insert(permissions).values([
    { code: "manage:system", name: "manage:system", module: "system", description: "Full system access" },
    { code: "manage:school", name: "manage:school", module: "school", description: "Manage school settings" },
    { code: "manage:assessments", name: "manage:assessments", module: "assessment", description: "Create/edit assessments" },
    { code: "view:reports", name: "view:reports", module: "report", description: "View diagnostic reports" },
    { code: "manage:students", name: "manage:students", module: "student", description: "Manage student profiles" },
    { code: "take:assessment", name: "take:assessment", module: "assessment", description: "Take assessments" },
  ]).returning();
  console.log(`✓ ${permData.length} permissions created`);

  const permMap = Object.fromEntries(permData.map((p) => [p.code, p.id]));

  await db.insert(rolePermissions).values([
    { roleId: adminRole.id, permissionId: permMap["manage:system"] },
    { roleId: schoolAdminRole.id, permissionId: permMap["manage:school"] },
    { roleId: schoolAdminRole.id, permissionId: permMap["manage:assessments"] },
    { roleId: schoolAdminRole.id, permissionId: permMap["view:reports"] },
    { roleId: schoolAdminRole.id, permissionId: permMap["manage:students"] },
    { roleId: teacherRole.id, permissionId: permMap["manage:assessments"] },
    { roleId: teacherRole.id, permissionId: permMap["view:reports"] },
    { roleId: studentRole.id, permissionId: permMap["take:assessment"] },
    { roleId: studentRole.id, permissionId: permMap["view:reports"] },
    { roleId: parentRole.id, permissionId: permMap["view:reports"] },
  ]);
  console.log("✓ Role-permission mappings created");

  // ─── Admin User (only user created by seed) ───────────────────────
  const [adminUser] = await db.insert(users).values([
    { email: "admin@skoolar.org", firstName: "Deep", lastName: "Admin", passwordHash: pwHash, isVerified: true, isActive: true },
  ]).returning();
  await db.insert(userRoles).values([{ userId: adminUser.id, roleId: adminRole.id }]);
  console.log("✓ Admin user created (admin@skoolar.org / successor)");

  // ─── Subjects ──────────────────────────────────────────────────────
  const subjectData = await db.insert(subjects).values([
    { name: "Mathematics", code: "mathematics", iconUrl: "function-square", description: "Numbers, algebra, geometry, and problem-solving" },
    { name: "English", code: "english", iconUrl: "book-open", description: "Reading comprehension, grammar, and composition" },
    { name: "Physics", code: "physics", iconUrl: "atom", description: "Matter, energy, motion, and forces" },
    { name: "Chemistry", code: "chemistry", iconUrl: "flask-conical", description: "Elements, compounds, reactions, and bonding" },
    { name: "Biology", code: "biology", iconUrl: "dna", description: "Living organisms, cells, genetics, and ecosystems" },
    { name: "Verbal Reasoning", code: "verbal-reason", iconUrl: "brain", description: "Analogies, classification, logical deduction, and verbal puzzles" },
    { name: "Quantitative Reasoning", code: "quant-reason", iconUrl: "calculator", description: "Number patterns, data sufficiency, problem solving, and logical math" },
    { name: "General Studies", code: "general-studies", iconUrl: "graduation-cap", description: "Study skills, critical thinking, and general knowledge" },
  ]).returning();
  console.log(`✓ ${subjectData.length} subjects created`);

  const subjectMap = Object.fromEntries(subjectData.map((s) => [s.code!, s.id]));
  const mathId = subjectMap.mathematics;
  const engId = subjectMap.english;
  const phyId = subjectMap.physics;
  const chemId = subjectMap.chemistry;
  const bioId = subjectMap.biology;
  const vrId = subjectMap["verbal-reason"];
  const qrId = subjectMap["quant-reason"];
  const gsId = subjectMap["general-studies"];

  // ─── Topics ────────────────────────────────────────────────────────
  const topicData = await db.insert(topics).values([
    // Mathematics
    { name: "Number & Operations", code: "number-operations", subjectId: mathId, displayOrder: 1 },
    { name: "Algebra", code: "algebra", subjectId: mathId, displayOrder: 2 },
    { name: "Geometry & Measurement", code: "geometry-measurement", subjectId: mathId, displayOrder: 3 },
    { name: "Statistics & Probability", code: "statistics-probability", subjectId: mathId, displayOrder: 4 },
    { name: "Commercial Arithmetic", code: "commercial-arithmetic", subjectId: mathId, displayOrder: 5 },
    { name: "Trigonometry", code: "trigonometry", subjectId: mathId, displayOrder: 6 },
    { name: "Calculus & Functions", code: "calculus-functions", subjectId: mathId, displayOrder: 7 },
    { name: "Matrices & Determinants", code: "matrices-determinants", subjectId: mathId, displayOrder: 8 },
    { name: "Coordinate Geometry", code: "coordinate-geometry", subjectId: mathId, displayOrder: 9 },
    { name: "Sets & Logic", code: "sets-logic", subjectId: mathId, displayOrder: 10 },
    // English
    { name: "Reading Comprehension", code: "reading-comprehension", subjectId: engId, displayOrder: 1 },
    { name: "Grammar & Usage", code: "grammar-usage", subjectId: engId, displayOrder: 2 },
    { name: "Vocabulary", code: "vocabulary", subjectId: engId, displayOrder: 3 },
    { name: "Writing Skills", code: "writing-skills", subjectId: engId, displayOrder: 4 },
    { name: "Literature", code: "literature", subjectId: engId, displayOrder: 5 },
    { name: "Figures of Speech", code: "figures-of-speech", subjectId: engId, displayOrder: 6 },
    // Physics
    { name: "Mechanics", code: "mechanics", subjectId: phyId, displayOrder: 1 },
    { name: "Waves & Optics", code: "waves-optics", subjectId: phyId, displayOrder: 2 },
    // Chemistry
    { name: "General Chemistry", code: "general-chemistry", subjectId: chemId, displayOrder: 1 },
    // Biology
    { name: "General Biology", code: "general-biology", subjectId: bioId, displayOrder: 1 },
    // Verbal Reasoning
    { name: "Verbal Analogies", code: "verbal-analogies", subjectId: vrId, displayOrder: 1 },
    { name: "Classification & Odd One Out", code: "classification", subjectId: vrId, displayOrder: 2 },
    { name: "Logical Deduction", code: "logical-deduction", subjectId: vrId, displayOrder: 3 },
    { name: "Verbal Puzzles & Sequencing", code: "verbal-puzzles", subjectId: vrId, displayOrder: 4 },
    { name: "Spelling & Word Patterns", code: "spelling-word-patterns", subjectId: vrId, displayOrder: 5 },
    // Quantitative Reasoning
    { name: "Number Patterns & Sequences", code: "number-patterns", subjectId: qrId, displayOrder: 1 },
    { name: "Data Sufficiency", code: "data-sufficiency", subjectId: qrId, displayOrder: 2 },
    { name: "Problem Solving", code: "problem-solving", subjectId: qrId, displayOrder: 3 },
    { name: "Puzzles & Logic", code: "puzzles-logic", subjectId: qrId, displayOrder: 4 },
    { name: "Data Interpretation", code: "data-interpretation", subjectId: qrId, displayOrder: 5 },
    // General Studies
    { name: "Study Skills & Time Management", code: "study-skills", subjectId: gsId, displayOrder: 1 },
    { name: "Critical Thinking & Analysis", code: "critical-thinking", subjectId: gsId, displayOrder: 2 },
  ]).returning();
  console.log(`✓ ${topicData.length} topics created`);
  const topicMap = Object.fromEntries(topicData.map((t) => [t.code!, t.id]));

  // ─── Concepts ──────────────────────────────────────────────────────
  const insertedConcepts = await db.insert(concepts).values([
    // --- Math: Number & Operations ---
    { name: "Place Value", code: "place-value", subtopicId: topicMap["number-operations"], bloomLevel: "remember", isFoundational: true },
    { name: "Addition", code: "addition", subtopicId: topicMap["number-operations"], bloomLevel: "remember", isFoundational: true },
    { name: "Subtraction", code: "subtraction", subtopicId: topicMap["number-operations"], bloomLevel: "remember", isFoundational: true },
    { name: "Multiplication", code: "multiplication", subtopicId: topicMap["number-operations"], bloomLevel: "remember", isFoundational: true },
    { name: "Division", code: "division", subtopicId: topicMap["number-operations"], bloomLevel: "remember", isFoundational: true },
    { name: "Fractions", code: "fractions", subtopicId: topicMap["number-operations"], bloomLevel: "understand", isFoundational: true },
    { name: "Decimals", code: "decimals", subtopicId: topicMap["number-operations"], bloomLevel: "understand" },
    { name: "Percentages", code: "percentages", subtopicId: topicMap["number-operations"], bloomLevel: "apply" },
    { name: "Ratio", code: "ratio", subtopicId: topicMap["number-operations"], bloomLevel: "apply" },
    { name: "Money", code: "money", subtopicId: topicMap["number-operations"], bloomLevel: "apply" },
    { name: "Number Sense", code: "number-sense", subtopicId: topicMap["number-operations"], bloomLevel: "remember", isFoundational: true },
    { name: "Directed Numbers", code: "directed-numbers", subtopicId: topicMap["number-operations"], bloomLevel: "apply" },
    { name: "Indices", code: "indices", subtopicId: topicMap["number-operations"], bloomLevel: "apply" },
    { name: "Surds", code: "surds", subtopicId: topicMap["number-operations"], bloomLevel: "apply" },
    { name: "Number Theory", code: "number-theory", subtopicId: topicMap["number-operations"], bloomLevel: "understand" },
    { name: "Sequences", code: "sequences", subtopicId: topicMap["number-operations"], bloomLevel: "apply" },
    // --- Math: Algebra ---
    { name: "Algebra", code: "algebra", subtopicId: topicMap.algebra, bloomLevel: "understand", isFoundational: true },
    { name: "Algebraic Expressions", code: "algebraic-expressions", subtopicId: topicMap.algebra, bloomLevel: "understand", isFoundational: true },
    { name: "Linear Equations", code: "linear-equations", subtopicId: topicMap.algebra, bloomLevel: "apply" },
    { name: "Inequalities", code: "inequalities", subtopicId: topicMap.algebra, bloomLevel: "apply" },
    { name: "Simple Equations", code: "simple-equations", subtopicId: topicMap.algebra, bloomLevel: "apply" },
    { name: "Simultaneous Equations", code: "simultaneous-equations", subtopicId: topicMap.algebra, bloomLevel: "apply" },
    { name: "Quadratic Equations", code: "quadratic-equations", subtopicId: topicMap.algebra, bloomLevel: "apply" },
    { name: "Factorisation", code: "factorisation", subtopicId: topicMap.algebra, bloomLevel: "apply" },
    { name: "Algebraic Expansion", code: "algebraic-expansion", subtopicId: topicMap.algebra, bloomLevel: "apply" },
    { name: "Arithmetic Progression", code: "arithmetic-progression", subtopicId: topicMap.algebra, bloomLevel: "apply" },
    { name: "Simple Interest", code: "simple-interest", subtopicId: topicMap.algebra, bloomLevel: "apply" },
    // --- Math: Geometry & Measurement ---
    { name: "Shapes & Angles", code: "shapes-angles", subtopicId: topicMap["geometry-measurement"], bloomLevel: "remember", isFoundational: true },
    { name: "Area & Perimeter", code: "area-perimeter", subtopicId: topicMap["geometry-measurement"], bloomLevel: "apply" },
    { name: "Volume", code: "volume", subtopicId: topicMap["geometry-measurement"], bloomLevel: "apply" },
    { name: "Measurement", code: "measurement", subtopicId: topicMap["geometry-measurement"], bloomLevel: "remember" },
    { name: "Time", code: "time", subtopicId: topicMap["geometry-measurement"], bloomLevel: "apply" },
    { name: "Symmetry", code: "symmetry", subtopicId: topicMap["geometry-measurement"], bloomLevel: "remember" },
    { name: "Direction & Position", code: "direction-position", subtopicId: topicMap["geometry-measurement"], bloomLevel: "understand" },
    { name: "Geometry", code: "geometry", subtopicId: topicMap["geometry-measurement"], bloomLevel: "understand" },
    { name: "Perimeter", code: "perimeter", subtopicId: topicMap["geometry-measurement"], bloomLevel: "apply" },
    { name: "Mensuration", code: "mensuration", subtopicId: topicMap["geometry-measurement"], bloomLevel: "apply" },
    { name: "Bearings", code: "bearings", subtopicId: topicMap["geometry-measurement"], bloomLevel: "apply" },
    { name: "Pythagoras Theorem", code: "pythagoras-theorem", subtopicId: topicMap["geometry-measurement"], bloomLevel: "apply" },
    // --- Math: Statistics & Probability ---
    { name: "Data Collection", code: "data-collection", subtopicId: topicMap["statistics-probability"], bloomLevel: "remember" },
    { name: "Data Interpretation", code: "data-interpretation-math", subtopicId: topicMap["statistics-probability"], bloomLevel: "understand" },
    { name: "Probability", code: "probability", subtopicId: topicMap["statistics-probability"], bloomLevel: "understand" },
    { name: "Statistics", code: "statistics", subtopicId: topicMap["statistics-probability"], bloomLevel: "understand" },
    { name: "Mean", code: "mean", subtopicId: topicMap["statistics-probability"], bloomLevel: "apply" },
    { name: "Median", code: "median", subtopicId: topicMap["statistics-probability"], bloomLevel: "apply" },
    { name: "Mode", code: "mode", subtopicId: topicMap["statistics-probability"], bloomLevel: "apply" },
    // --- Math: Commercial Arithmetic ---
    { name: "Commercial Arithmetic", code: "commercial-arithmetic", subtopicId: topicMap["commercial-arithmetic"], bloomLevel: "apply" },
    // --- Math: Trigonometry ---
    { name: "Trigonometry", code: "trigonometry", subtopicId: topicMap.trigonometry, bloomLevel: "apply" },
    { name: "Trigonometry Basics", code: "trigonometry-basics", subtopicId: topicMap.trigonometry, bloomLevel: "understand" },
    // --- Math: Calculus & Functions ---
    { name: "Differentiation Basics", code: "differentiation-basics", subtopicId: topicMap["calculus-functions"], bloomLevel: "apply" },
    { name: "Integration", code: "integration", subtopicId: topicMap["calculus-functions"], bloomLevel: "apply" },
    { name: "Limits", code: "limits", subtopicId: topicMap["calculus-functions"], bloomLevel: "understand" },
    { name: "Functions", code: "functions", subtopicId: topicMap["calculus-functions"], bloomLevel: "understand" },
    // --- Math: Matrices & Determinants ---
    { name: "Matrices", code: "matrices", subtopicId: topicMap["matrices-determinants"], bloomLevel: "apply" },
    { name: "Matrices - Determinant", code: "matrices-determinant", subtopicId: topicMap["matrices-determinants"], bloomLevel: "apply" },
    // --- Math: Coordinate Geometry ---
    { name: "Coordinate Geometry", code: "coordinate-geometry", subtopicId: topicMap["coordinate-geometry"], bloomLevel: "apply" },
    // --- Math: Sets & Logic ---
    { name: "Sets", code: "sets", subtopicId: topicMap["sets-logic"], bloomLevel: "understand" },
    // --- English: Reading Comprehension ---
    { name: "Main Idea", code: "main-idea", subtopicId: topicMap["reading-comprehension"], bloomLevel: "understand", isFoundational: true },
    { name: "Inference", code: "inference", subtopicId: topicMap["reading-comprehension"], bloomLevel: "analyze" },
    { name: "Comprehension", code: "comprehension", subtopicId: topicMap["reading-comprehension"], bloomLevel: "understand", isFoundational: true },
    // --- English: Grammar & Usage ---
    { name: "Parts of Speech", code: "parts-of-speech", subtopicId: topicMap["grammar-usage"], bloomLevel: "remember", isFoundational: true },
    { name: "Sentence Structure", code: "sentence-structure", subtopicId: topicMap["grammar-usage"], bloomLevel: "apply" },
    { name: "Tenses", code: "tenses", subtopicId: topicMap["grammar-usage"], bloomLevel: "apply" },
    { name: "Grammar", code: "grammar", subtopicId: topicMap["grammar-usage"], bloomLevel: "remember" },
    { name: "Punctuation", code: "punctuation", subtopicId: topicMap["grammar-usage"], bloomLevel: "remember" },
    // --- English: Vocabulary ---
    { name: "Vocabulary", code: "vocabulary", subtopicId: topicMap.vocabulary, bloomLevel: "remember" },
    { name: "Spelling", code: "spelling", subtopicId: topicMap.vocabulary, bloomLevel: "remember" },
    // --- English: Writing Skills ---
    { name: "Essay Structure - Introduction", code: "essay-introduction", subtopicId: topicMap["writing-skills"], bloomLevel: "apply" },
    { name: "Essay Structure - Topic Sentence", code: "essay-topic-sentence", subtopicId: topicMap["writing-skills"], bloomLevel: "apply" },
    { name: "Essay Structure - Conclusion", code: "essay-conclusion", subtopicId: topicMap["writing-skills"], bloomLevel: "apply" },
    { name: "Summary", code: "summary", subtopicId: topicMap["writing-skills"], bloomLevel: "apply" },
    // --- English: Literature ---
    { name: "Literature Terms - Theme", code: "literature-theme", subtopicId: topicMap.literature, bloomLevel: "understand" },
    { name: "Literature Terms - Tone", code: "literature-tone", subtopicId: topicMap.literature, bloomLevel: "analyze" },
    { name: "Literature Terms - Setting", code: "literature-setting", subtopicId: topicMap.literature, bloomLevel: "remember" },
    { name: "Literature Terms - Protagonist", code: "literature-protagonist", subtopicId: topicMap.literature, bloomLevel: "remember" },
    { name: "Literature Terms - Point of View", code: "literature-point-of-view", subtopicId: topicMap.literature, bloomLevel: "understand" },
    // --- English: Figures of Speech ---
    { name: "Figurative Language - Simile", code: "figurative-simile", subtopicId: topicMap["figures-of-speech"], bloomLevel: "remember" },
    { name: "Figurative Language - Metaphor", code: "figurative-metaphor", subtopicId: topicMap["figures-of-speech"], bloomLevel: "remember" },
    { name: "Figurative Language - Personification", code: "figurative-personification", subtopicId: topicMap["figures-of-speech"], bloomLevel: "remember" },
    { name: "Figurative Language - Alliteration", code: "figurative-alliteration", subtopicId: topicMap["figures-of-speech"], bloomLevel: "remember" },
    { name: "Figurative Language - Oxymoron", code: "figurative-oxymoron", subtopicId: topicMap["figures-of-speech"], bloomLevel: "understand" },
    { name: "Figurative Language - Metonymy", code: "figurative-metonymy", subtopicId: topicMap["figures-of-speech"], bloomLevel: "understand" },
    { name: "Figures of Speech", code: "figures-of-speech", subtopicId: topicMap["figures-of-speech"], bloomLevel: "remember" },
    // --- Physics ---
    { name: "Forces", code: "forces", subtopicId: topicMap.mechanics, bloomLevel: "understand", isFoundational: true },
    { name: "Motion", code: "motion", subtopicId: topicMap.mechanics, bloomLevel: "understand" },
    { name: "Energy", code: "energy", subtopicId: topicMap.mechanics, bloomLevel: "apply" },
    { name: "Wave Properties", code: "wave-properties", subtopicId: topicMap["waves-optics"], bloomLevel: "understand", isFoundational: true },
    { name: "Light", code: "light", subtopicId: topicMap["waves-optics"], bloomLevel: "apply" },
    { name: "Sound", code: "sound", subtopicId: topicMap["waves-optics"], bloomLevel: "apply" },
    { name: "Speed Distance Time", code: "speed-distance-time", subtopicId: topicMap.mechanics, bloomLevel: "apply" },
    // --- Verbal Reasoning ---
    { name: "Analogies", code: "analogies", subtopicId: topicMap["verbal-analogies"], bloomLevel: "understand" },
    { name: "Classification", code: "classification", subtopicId: topicMap.classification, bloomLevel: "analyze" },
    { name: "Odd One Out", code: "odd-one-out", subtopicId: topicMap.classification, bloomLevel: "analyze" },
    { name: "Logical Deduction", code: "logical-deduction", subtopicId: topicMap["logical-deduction"], bloomLevel: "evaluate" },
    { name: "Puzzles", code: "puzzles", subtopicId: topicMap["verbal-puzzles"], bloomLevel: "evaluate" },
    { name: "Word Problems", code: "word-problems", subtopicId: topicMap["verbal-puzzles"], bloomLevel: "apply" },
    { name: "Sequencing Events", code: "sequencing-events", subtopicId: topicMap["verbal-puzzles"], bloomLevel: "understand" },
    { name: "Patterns", code: "patterns", subtopicId: topicMap["verbal-puzzles"], bloomLevel: "understand" },
    { name: "Word Puzzles - Anagrams", code: "word-puzzles-anagrams", subtopicId: topicMap["verbal-puzzles"], bloomLevel: "apply" },
    // --- Quantitative Reasoning ---
    { name: "Number Patterns", code: "number-patterns", subtopicId: topicMap["number-patterns"], bloomLevel: "understand" },
    { name: "Data Sufficiency", code: "data-sufficiency", subtopicId: topicMap["data-sufficiency"], bloomLevel: "analyze" },
    { name: "Problem Solving", code: "problem-solving", subtopicId: topicMap["problem-solving"], bloomLevel: "evaluate" },
    { name: "Puzzles - Alphanumeric", code: "puzzles-alphanumeric", subtopicId: topicMap["puzzles-logic"], bloomLevel: "evaluate" },
    { name: "Puzzles - Letter Coding", code: "puzzles-letter-coding", subtopicId: topicMap["puzzles-logic"], bloomLevel: "evaluate" },
    { name: "IQ Puzzle", code: "iq-puzzle", subtopicId: topicMap["puzzles-logic"], bloomLevel: "evaluate" },
    { name: "Logical Reasoning", code: "logical-reasoning", subtopicId: topicMap["puzzles-logic"], bloomLevel: "evaluate" },
    { name: "Spatial Reasoning", code: "spatial-reasoning", subtopicId: topicMap["puzzles-logic"], bloomLevel: "analyze" },
    { name: "Classification - Shapes", code: "classification-shapes", subtopicId: topicMap.classification, bloomLevel: "analyze" },
    { name: "Ordering Numbers", code: "ordering-numbers", subtopicId: topicMap["number-patterns"], bloomLevel: "remember" },
    // --- General Studies ---
    { name: "Study Skills", code: "study-skills", subtopicId: topicMap["study-skills"], bloomLevel: "understand" },
    { name: "Time Management", code: "time-management", subtopicId: topicMap["study-skills"], bloomLevel: "apply" },
    { name: "Critical Analysis", code: "critical-analysis", subtopicId: topicMap["critical-thinking"], bloomLevel: "evaluate" },
    { name: "Decision Making", code: "decision-making", subtopicId: topicMap["critical-thinking"], bloomLevel: "evaluate" },
    { name: "Identifying Biases", code: "identifying-biases", subtopicId: topicMap["critical-thinking"], bloomLevel: "analyze" },
    { name: "Evaluation of Arguments", code: "evaluation-arguments", subtopicId: topicMap["critical-thinking"], bloomLevel: "evaluate" },
    { name: "Assumptions", code: "assumptions", subtopicId: topicMap["critical-thinking"], bloomLevel: "analyze" },
    { name: "Inferences", code: "inferences", subtopicId: topicMap["critical-thinking"], bloomLevel: "analyze" },
    { name: "Synthesis", code: "synthesis", subtopicId: topicMap["critical-thinking"], bloomLevel: "create" },
    { name: "Author's Purpose", code: "authors-purpose", subtopicId: topicMap["critical-thinking"], bloomLevel: "analyze" },
    { name: "Tone Analysis", code: "tone-analysis", subtopicId: topicMap["critical-thinking"], bloomLevel: "analyze" },
    { name: "Ethical Reasoning", code: "ethical-reasoning", subtopicId: topicMap["critical-thinking"], bloomLevel: "evaluate" },
    { name: "Research Methodology", code: "research-methodology", subtopicId: topicMap["critical-thinking"], bloomLevel: "understand" },
    { name: "Argument Analysis", code: "argument-analysis", subtopicId: topicMap["critical-thinking"], bloomLevel: "evaluate" },
    { name: "Advanced Vocabulary", code: "advanced-vocabulary", subtopicId: topicMap.vocabulary, bloomLevel: "remember" },
  ]).returning();
  console.log(`✓ ${insertedConcepts.length} concepts created`);

  const conceptMap = Object.fromEntries(insertedConcepts.map((c) => [c.code!, c.id]));

  // ─── Concept Name → Topic Code Mapping ─────────────────────────────
  // Used to auto-link seed questions to their parent topic
  const conceptToTopicCode: Record<string, string> = {
    // Number & Operations
    "Addition": "number-operations",
    "Subtraction": "number-operations",
    "Multiplication": "number-operations",
    "Division": "number-operations",
    "Place Value": "number-operations",
    "Fractions": "number-operations",
    "Decimals": "number-operations",
    "Percentages": "number-operations",
    "Ratio": "number-operations",
    "Money": "number-operations",
    "Number Sense": "number-operations",
    "Directed Numbers": "number-operations",
    "Indices": "number-operations",
    "Indices - Exponential Equations": "number-operations",
    "Indices and Exponential Equations": "number-operations",
    "Surds": "number-operations",
    "Number Theory": "number-operations",
    "Sequences": "number-operations",
    "Ordering Numbers": "number-operations",
    "Fractions and Decimals": "number-operations",
    "Ratio and Proportion": "number-operations",
    "Simple Interest": "number-operations",
    // Algebra
    "Algebra": "algebra",
    "Algebraic Expressions": "algebra",
    "Linear Equations": "algebra",
    "Inequalities": "algebra",
    "Simple Equations": "algebra",
    "Simultaneous Equations": "algebra",
    "Quadratic Equations": "algebra",
    "Factorisation": "algebra",
    "Algebraic Expansion": "algebra",
    "Arithmetic Progression": "algebra",
    "Functions": "algebra",
    "Functions - Composition": "algebra",
    // Geometry & Measurement
    "Shapes & Angles": "geometry-measurement",
    "Area & Perimeter": "geometry-measurement",
    "Volume": "geometry-measurement",
    "Measurement": "geometry-measurement",
    "Time": "geometry-measurement",
    "Symmetry": "geometry-measurement",
    "Direction & Position": "geometry-measurement",
    "Geometry": "geometry-measurement",
    "Perimeter": "geometry-measurement",
    "Mensuration": "geometry-measurement",
    "Bearings": "geometry-measurement",
    "Pythagoras' Theorem": "geometry-measurement",
    "Pythagoras' Theorem - Application": "geometry-measurement",
    "Geometry - Angles": "geometry-measurement",
    "Geometry - Polygons": "geometry-measurement",
    "Geometry - Triangles": "geometry-measurement",
    "Volume of Cylinder": "geometry-measurement",
    "Area of Triangle": "geometry-measurement",
    "Logical Reasoning - Angles": "geometry-measurement",
    // Statistics & Probability
    "Data Collection": "statistics-probability",
    "Data Interpretation": "statistics-probability",
    "Probability": "statistics-probability",
    "Statistics": "statistics-probability",
    "Statistics - Data Interpretation": "statistics-probability",
    "Statistics - Line Graph": "statistics-probability",
    "Statistics - Mean": "statistics-probability",
    "Statistics - Median": "statistics-probability",
    "Statistics - Mode": "statistics-probability",
    "Statistics - Pie Chart": "statistics-probability",
    "Statistics - Range": "statistics-probability",
    "Probability Distributions": "statistics-probability",
    "Data Interpretation - Pie Chart": "statistics-probability",
    // Commercial Arithmetic
    "Commercial Arithmetic": "commercial-arithmetic",
    "Banking and Finance": "commercial-arithmetic",
    "Financial Literacy": "commercial-arithmetic",
    "Economics Basics": "commercial-arithmetic",
    "Business Studies": "commercial-arithmetic",
    // Trigonometry
    "Trigonometry": "trigonometry",
    "Trigonometry Basics": "trigonometry",
    // Calculus & Functions
    "Differentiation Basics": "calculus-functions",
    "Integration": "calculus-functions",
    "Limits": "calculus-functions",
    // Matrices & Determinants
    "Matrices": "matrices-determinants",
    "Matrices - Determinant": "matrices-determinants",
    // Coordinate Geometry
    "Coordinate Geometry": "coordinate-geometry",
    // Sets & Logic
    "Sets - Intersection": "sets-logic",
    "Sets - Union": "sets-logic",
    "Sets - Venn Diagrams": "sets-logic",
    "Sets & Venn Diagrams": "sets-logic",
    // Reading Comprehension
    "Main Idea": "reading-comprehension",
    "Inference": "reading-comprehension",
    "Comprehension": "reading-comprehension",
    "Comprehension - Author's Attitude": "reading-comprehension",
    "Comprehension - Factual": "reading-comprehension",
    "Comprehension - Identifying Challenges": "reading-comprehension",
    "Comprehension - Inference": "reading-comprehension",
    "Comprehension - Main Idea": "reading-comprehension",
    "Comprehension - Sequential": "reading-comprehension",
    "Complex Comprehension": "reading-comprehension",
    // Grammar & Usage
    "Parts of Speech": "grammar-usage",
    "Sentence Structure": "grammar-usage",
    "Tenses": "grammar-usage",
    "Grammar": "grammar-usage",
    "Punctuation": "grammar-usage",
    "Grammar - Active and Passive Voice": "grammar-usage",
    "Grammar - Articles": "grammar-usage",
    "Grammar - Comparatives": "grammar-usage",
    "Grammar - Conditional Sentences": "grammar-usage",
    "Grammar - Conjunctions": "grammar-usage",
    "Grammar - Dangling Modifiers": "grammar-usage",
    "Grammar - Plurals": "grammar-usage",
    "Grammar - Proper Nouns": "grammar-usage",
    "Grammar - Relative Clauses": "grammar-usage",
    "Grammar - Reported Speech": "grammar-usage",
    "Grammar - Sentence Fragments": "grammar-usage",
    "Grammar - Sentence Structure": "grammar-usage",
    "Grammar - Sentence Types": "grammar-usage",
    "Grammar - Subject Complement": "grammar-usage",
    "Grammar - Subject-Verb Agreement": "grammar-usage",
    "Grammar - Tag Questions": "grammar-usage",
    "Parts of Speech - Adverbs": "grammar-usage",
    "Parts of Speech - Nouns": "grammar-usage",
    "Parts of Speech - Prepositions": "grammar-usage",
    "Punctuation - Complex Sentences": "grammar-usage",
    // Vocabulary
    "Vocabulary": "vocabulary",
    "Spelling": "vocabulary",
    "Advanced Vocabulary": "vocabulary",
    "Vocabulary - Alphabetical Order": "vocabulary",
    "Vocabulary - Antonyms": "vocabulary",
    "Vocabulary - Commonly Confused Words": "vocabulary",
    "Vocabulary - Context Clues": "vocabulary",
    "Vocabulary - Idioms": "vocabulary",
    "Vocabulary - Prefixes": "vocabulary",
    "Vocabulary - Spelling": "vocabulary",
    "Vocabulary - Synonyms": "vocabulary",
    "Spelling - Regular Patterns": "vocabulary",
    // Writing Skills
    "Essay Structure - Introduction": "writing-skills",
    "Essay Structure - Topic Sentence": "writing-skills",
    "Essay Structure - Conclusion": "writing-skills",
    "Summary": "writing-skills",
    // Literature
    "Literature Terms - Theme": "literature",
    "Literature Terms - Tone": "literature",
    "Literature Terms - Setting": "literature",
    "Literature Terms - Protagonist": "literature",
    "Literature Terms - Point of View": "literature",
    // Figures of Speech
    "Figurative Language - Simile": "figures-of-speech",
    "Figurative Language - Metaphor": "figures-of-speech",
    "Figurative Language - Personification": "figures-of-speech",
    "Figurative Language - Alliteration": "figures-of-speech",
    "Figurative Language - Oxymoron": "figures-of-speech",
    "Figurative Language - Metonymy": "figures-of-speech",
    "Figures of Speech": "figures-of-speech",
    // Physics
    "Forces": "mechanics",
    "Motion": "mechanics",
    "Energy": "mechanics",
    "Wave Properties": "waves-optics",
    "Light": "waves-optics",
    "Sound": "waves-optics",
    "Speed, Distance, Time": "mechanics",
    // Verbal Reasoning
    "Analogies": "verbal-analogies",
    "Analogies - Professional": "verbal-analogies",
    "Classification": "classification",
    "Odd One Out": "classification",
    "Logical Deduction": "logical-deduction",
    "Puzzles": "verbal-puzzles",
    "Word Problems": "verbal-puzzles",
    "Sequencing Events": "verbal-puzzles",
    "Patterns": "verbal-puzzles",
    "Word Puzzles - Anagrams": "verbal-puzzles",
    "Puzzles - Relationship": "verbal-puzzles",
    "Logical Reasoning - Calendar": "verbal-puzzles",
    "Logical Reasoning - Deduction": "logical-deduction",
    "Logical Reasoning - Grid Deduction": "logical-deduction",
    "Logical Reasoning - Grid Puzzle": "verbal-puzzles",
    "Logical Reasoning - Ordering": "verbal-puzzles",
    "Logical Reasoning - Positioning": "verbal-puzzles",
    "Logical Reasoning - Properties": "verbal-puzzles",
    "Logical Reasoning - Spatial": "verbal-puzzles",
    "Logical Reasoning - Truth Tellers and Liars": "logical-deduction",
    "Logical Reasoning - Word Play": "verbal-puzzles",
    "Syllogisms": "logical-deduction",
    "Syllogisms - Chains": "logical-deduction",
    "Logical Statements": "logical-deduction",
    "Permutations and Combinations": "number-operations",
    // Quantitative Reasoning
    "Number Patterns": "number-patterns",
    "Number Patterns - Alternating": "number-patterns",
    "Number Patterns - Classification": "number-patterns",
    "Number Patterns - Fibonacci": "number-patterns",
    "Number Patterns - Geometric": "number-patterns",
    "Number Patterns - Quadratic": "number-patterns",
    "Number Patterns - Sequences": "number-patterns",
    "Number Patterns - Squares": "number-patterns",
    "Data Sufficiency": "data-sufficiency",
    "Data Sufficiency - Age": "data-sufficiency",
    "Data Sufficiency - Geometry": "data-sufficiency",
    "Problem Solving": "problem-solving",
    "Problem Solving - 3D Visualization": "problem-solving",
    "Problem Solving - Angles": "problem-solving",
    "Problem Solving - Combinatorics": "problem-solving",
    "Problem Solving - Common Trick": "problem-solving",
    "Problem Solving - Counting": "problem-solving",
    "Problem Solving - Geometry": "problem-solving",
    "Problem Solving - Modular Arithmetic": "problem-solving",
    "Problem Solving - Simultaneous": "problem-solving",
    "Problem Solving - Spatial": "problem-solving",
    "Problem Solving - Speed": "problem-solving",
    "Problem Solving - Water Jug": "problem-solving",
    "Puzzles - Alphanumeric": "puzzles-logic",
    "Puzzles - Letter Coding": "puzzles-logic",
    "IQ Puzzle": "puzzles-logic",
    "Logical Reasoning": "puzzles-logic",
    "Spatial Reasoning": "puzzles-logic",
    "Classification - Shapes": "classification",
    "Word Problems - Age": "problem-solving",
    "Decision Making": "problem-solving",
    // General Studies
    "Study Skills": "study-skills",
    "Time Management": "study-skills",
    "Critical Analysis": "critical-thinking",
    "Identifying Biases": "critical-thinking",
    "Evaluation of Arguments": "critical-thinking",
    "Assumptions": "critical-thinking",
    "Inferences": "critical-thinking",
    "Synthesis": "critical-thinking",
    "Author's Purpose": "critical-thinking",
    "Tone Analysis": "critical-thinking",
    "Ethical Reasoning": "critical-thinking",
    "Research Methodology": "critical-thinking",
    "Argument Analysis": "critical-thinking",
    "Argument Analysis - Fallacies": "critical-thinking",
    "Complex Numbers": "algebra",
    "Vectors": "geometry-measurement",
    "Proof Techniques": "critical-thinking",
    "Sequences and Series": "number-operations",
    "Logarithms": "algebra",
    "Deductive Reasoning": "logical-deduction",
  };

  await db.insert(conceptPrerequisites).values([
    { conceptId: conceptMap.fractions, prerequisiteId: conceptMap["place-value"] },
    { conceptId: conceptMap.decimals, prerequisiteId: conceptMap.fractions },
    { conceptId: conceptMap.percentages, prerequisiteId: conceptMap.decimals },
    { conceptId: conceptMap.ratio, prerequisiteId: conceptMap.fractions },
    { conceptId: conceptMap["algebraic-expressions"], prerequisiteId: conceptMap["place-value"] },
    { conceptId: conceptMap["linear-equations"], prerequisiteId: conceptMap["algebraic-expressions"] },
    { conceptId: conceptMap.inequalities, prerequisiteId: conceptMap["linear-equations"] },
    { conceptId: conceptMap["area-perimeter"], prerequisiteId: conceptMap["shapes-angles"] },
    { conceptId: conceptMap.volume, prerequisiteId: conceptMap["area-perimeter"] },
    { conceptId: conceptMap.inference, prerequisiteId: conceptMap["main-idea"] },
    { conceptId: conceptMap["sentence-structure"], prerequisiteId: conceptMap["parts-of-speech"] },
    { conceptId: conceptMap.tenses, prerequisiteId: conceptMap["sentence-structure"] },
    { conceptId: conceptMap.motion, prerequisiteId: conceptMap.forces },
    { conceptId: conceptMap.energy, prerequisiteId: conceptMap.motion },
    { conceptId: conceptMap.light, prerequisiteId: conceptMap["wave-properties"] },
    { conceptId: conceptMap.sound, prerequisiteId: conceptMap["wave-properties"] },
  ]);
  console.log("✓ Concept prerequisites created");

  await db.insert(conceptMisconceptions).values([
    { conceptId: conceptMap.fractions, misconception: "Believes larger denominator means larger fraction", correctionStrategy: "Use visual fraction strips to compare same-numerator fractions", severity: "common" },
    { conceptId: conceptMap["linear-equations"], misconception: "Believes variables always represent a single unknown", correctionStrategy: "Use balance-scale models to show equivalence", severity: "moderate" },
    { conceptId: conceptMap.forces, misconception: "Believes force is required to maintain motion", correctionStrategy: "Demonstrate inertia with frictionless surfaces", severity: "moderate" },
    { conceptId: conceptMap["parts-of-speech"], misconception: "Confuses adjectives with adverbs", correctionStrategy: "Practice identifying words that modify nouns vs verbs", severity: "common" },
  ]);
  console.log("✓ Concept misconceptions created");

  // ─── Build concept name → conceptId lookup ─────────────────────────
  const conceptNameToId = new Map<string, string>();
  for (const c of insertedConcepts) {
    conceptNameToId.set(c.name.toLowerCase(), c.id);
  }

  // ─── Question Banks ────────────────────────────────────────────────
  const bankData = await db.insert(questionBanks).values([
    { level: "PRI-JSS1", title: "Primary → JSS1 Transition", description: "Diagnostic for students transitioning from Primary to JSS1", displayOrder: 1 },
    { level: "JSS3-SS1", title: "JSS3 → SS1 Transition", description: "Diagnostic for students transitioning from JSS3 to SS1", displayOrder: 2 },
    { level: "SS3-UNI", title: "SS3 → University Transition", description: "Diagnostic for students transitioning from SS3 to University", displayOrder: 3 },
    { level: "TCH-QUALITY", title: "Teacher Quality Assessment", description: "Assessment of teaching practice and professional competencies", displayOrder: 4 },
  ]).returning();
  const bankMap = Object.fromEntries(bankData.map((b) => [b.level, b.id]));
  console.log(`✓ ${bankData.length} question banks created`);

  // Section configs
  const sectionConfigs = [
    { bankId: bankMap["PRI-JSS1"], sectionName: "Number & Operations", questionCount: 50, timeLimitMinutes: 15, displayOrder: 1 },
    { bankId: bankMap["PRI-JSS1"], sectionName: "Algebra", questionCount: 40, timeLimitMinutes: 12, displayOrder: 2 },
    { bankId: bankMap["PRI-JSS1"], sectionName: "Geometry & Measurement", questionCount: 40, timeLimitMinutes: 12, displayOrder: 3 },
    { bankId: bankMap["PRI-JSS1"], sectionName: "Statistics & Probability", questionCount: 40, timeLimitMinutes: 11, displayOrder: 4 },
    { bankId: bankMap["JSS3-SS1"], sectionName: "Number & Operations", questionCount: 50, timeLimitMinutes: 15, displayOrder: 1 },
    { bankId: bankMap["JSS3-SS1"], sectionName: "Algebra", questionCount: 40, timeLimitMinutes: 12, displayOrder: 2 },
    { bankId: bankMap["JSS3-SS1"], sectionName: "Geometry & Measurement", questionCount: 40, timeLimitMinutes: 12, displayOrder: 3 },
    { bankId: bankMap["JSS3-SS1"], sectionName: "Statistics & Probability", questionCount: 40, timeLimitMinutes: 11, displayOrder: 4 },
    { bankId: bankMap["SS3-UNI"], sectionName: "Number & Operations", questionCount: 50, timeLimitMinutes: 15, displayOrder: 1 },
    { bankId: bankMap["SS3-UNI"], sectionName: "Algebra", questionCount: 40, timeLimitMinutes: 12, displayOrder: 2 },
    { bankId: bankMap["SS3-UNI"], sectionName: "Geometry & Measurement", questionCount: 40, timeLimitMinutes: 12, displayOrder: 3 },
    { bankId: bankMap["SS3-UNI"], sectionName: "Statistics & Probability", questionCount: 40, timeLimitMinutes: 11, displayOrder: 4 },
  ];
  const configData = await db.insert(questionBankConfigs).values(sectionConfigs).returning();
  console.log(`✓ ${configData.length} section configs created`);

  // ─── Seed Questions ─────────────────────────────────────────────────
  const allBankQuestions = [
    ...primaryToJss1Questions.map((q) => ({ ...q, bankId: bankMap["PRI-JSS1"] })),
    ...jss3ToSs1Questions.map((q) => ({ ...q, bankId: bankMap["JSS3-SS1"] })),
    ...ss3ToUniversityQuestions.map((q) => ({ ...q, bankId: bankMap["SS3-UNI"] })),
  ];
  console.log(`\nSeeding ${allBankQuestions.length} questions...`);

  let insertedCount = 0;
  let mappedCount = 0;
  let unmappedConcepts = new Set<string>();
  const insertedQuestions: { id: string; options: any[] }[] = [];
  for (const q of allBankQuestions) {
    const { options, ...rest } = q;
    const questionFields: Record<string, any> = { ...rest };

    // Auto-map topicId and conceptId from concept name
    const conceptName = (q.concept as string) || "";
    const topicCode = conceptToTopicCode[conceptName];
    if (topicCode && topicMap[topicCode]) {
      questionFields.topicId = topicMap[topicCode];
      mappedCount++;
    }
    const matchedConceptId = conceptNameToId.get(conceptName.toLowerCase());
    if (matchedConceptId) {
      questionFields.conceptId = matchedConceptId;
    } else if (conceptName) {
      unmappedConcepts.add(conceptName);
    }

    const [inserted] = await db.insert(questionsTable).values(questionFields as any).returning();
    insertedQuestions.push({ id: inserted.id, options: q.options || [] });
    insertedCount++;
    if (insertedCount % 50 === 0) process.stdout.write(".");
  }
  console.log(`\n✓ ${insertedCount} questions inserted (${mappedCount} mapped to topics)`);
  if (unmappedConcepts.size > 0) {
    console.log(`⚠ Unmapped concepts (${unmappedConcepts.size}): ${[...unmappedConcepts].join(", ")}`);
  }

  for (const q of insertedQuestions) {
    q.options = shuffleArray(q.options).map((o, i) => ({ ...o, optionOrder: i + 1 }));
  }

  const allOptions = insertedQuestions.flatMap(({ id, options }) =>
    options.map((o: any) => ({ ...o, questionId: id }))
  );
  const BATCH_SIZE = 200;
  let insertedOptions = 0;
  for (let i = 0; i < allOptions.length; i += BATCH_SIZE) {
    const batch = allOptions.slice(i, i + BATCH_SIZE);
    await db.insert(questionOptions).values(batch);
    insertedOptions += batch.length;
    process.stdout.write(`\r  Options: ${insertedOptions}/${allOptions.length}`);
  }
  console.log(`\n✓ ${allOptions.length} question options inserted (batched)`);

  // ─── Teacher Quality Bank ──────────────────────────────────────────
  const tqBankId = bankMap["TCH-QUALITY"];
  const tqQuestions = [
    { questionText: "When planning a lesson, what is the MOST important first step?", concept: "lesson-planning", bloomLevel: "understand", difficultyLevel: "medium", expectedTimeSecs: 60, allowsCalculator: false,
      options: [{ optionText: "Selecting assessment methods", isCorrect: false, optionOrder: 1 }, { optionText: "Defining clear learning objectives", isCorrect: true, optionOrder: 2 }, { optionText: "Choosing instructional materials", isCorrect: false, optionOrder: 3 }, { optionText: "Arranging the classroom layout", isCorrect: false, optionOrder: 4 }] },
    { questionText: "Which strategy BEST supports differentiated instruction in a mixed-ability classroom?", concept: "differentiation", bloomLevel: "apply", difficultyLevel: "medium", expectedTimeSecs: 60, allowsCalculator: false,
      options: [{ optionText: "Using tiered assignments at varied complexity levels", isCorrect: true, optionOrder: 1 }, { optionText: "Having all students complete the same worksheet", isCorrect: false, optionOrder: 2 }, { optionText: "Grouping only by student ability permanently", isCorrect: false, optionOrder: 3 }, { optionText: "Moving through content as quickly as possible", isCorrect: false, optionOrder: 4 }] },
    { questionText: "Formative assessment is BEST described as:", concept: "assessment-strategies", bloomLevel: "understand", difficultyLevel: "easy", expectedTimeSecs: 45, allowsCalculator: false,
      options: [{ optionText: "End-of-term examinations", isCorrect: false, optionOrder: 1 }, { optionText: "Ongoing checks for understanding during instruction", isCorrect: true, optionOrder: 2 }, { optionText: "Standardized testing for accountability", isCorrect: false, optionOrder: 3 }, { optionText: "Summative projects at the end of a unit", isCorrect: false, optionOrder: 4 }] },
    { questionText: "A student consistently interrupts class discussions. The MOST effective first response is to:", concept: "classroom-management", bloomLevel: "apply", difficultyLevel: "medium", expectedTimeSecs: 45, allowsCalculator: false,
      options: [{ optionText: "Send the student to the principal's office", isCorrect: false, optionOrder: 1 }, { optionText: "Privately discuss the behavior and set expectations", isCorrect: true, optionOrder: 2 }, { optionText: "Ignore the behavior entirely", isCorrect: false, optionOrder: 3 }, { optionText: "Publicly reprimand the student in front of peers", isCorrect: false, optionOrder: 4 }] },
    { questionText: "When communicating with parents about student progress, it is BEST to:", concept: "parent-communication", bloomLevel: "apply", difficultyLevel: "easy", expectedTimeSecs: 45, allowsCalculator: false,
      options: [{ optionText: "Only contact parents when there is a problem", isCorrect: false, optionOrder: 1 }, { optionText: "Share both strengths and areas for growth constructively", isCorrect: true, optionOrder: 2 }, { optionText: "Compare the student negatively to classmates", isCorrect: false, optionOrder: 3 }, { optionText: "Use educational jargon to demonstrate expertise", isCorrect: false, optionOrder: 4 }] },
    { questionText: "Which practice BEST promotes an inclusive classroom environment?", concept: "inclusive-education", bloomLevel: "evaluate", difficultyLevel: "hard", expectedTimeSecs: 60, allowsCalculator: false,
      options: [{ optionText: "Using multiple representation formats for content", isCorrect: true, optionOrder: 1 }, { optionText: "Teaching all students in exactly the same way", isCorrect: false, optionOrder: 2 }, { optionText: "Separating students with learning differences", isCorrect: false, optionOrder: 3 }, { optionText: "Focusing only on average-performing students", isCorrect: false, optionOrder: 4 }] },
  ];
  for (const q of tqQuestions) {
    const { options, ...fields } = q;
    const [inserted] = await db.insert(questionsTable).values({
      bankId: tqBankId, questionType: "multiple_choice", assessmentType: "teacher_quality", rendererType: "standard",
      difficultyParam: q.difficultyLevel === "easy" ? "-1.5" : q.difficultyLevel === "medium" ? "0" : "1.5",
      discriminationParam: "1.2", guessingParam: "0.25", ...fields,
    } as any).returning();
    const shuffled = shuffleArray(q.options).map((o, i) => ({ ...o, optionOrder: i + 1 }));
    await db.insert(questionOptions).values(shuffled.map((o) => ({ questionId: inserted.id, optionText: o.optionText, isCorrect: o.isCorrect, optionOrder: o.optionOrder })));
  }
  console.log("✓ Teacher quality bank seeded with 6 questions\n");

  // ─── School Assessment Questions ─────────────────────────────────
  console.log(`\nSeeding ${schoolSeeds.length} school assessment questions...`);
  let schoolQCount = 0;
  for (let i = 0; i < schoolSeeds.length; i++) {
    const q = schoolSeeds[i];
    const [inserted] = await db.insert(schoolAssessmentQuestions).values({
      code: q.code,
      domain: q.domain,
      questionText: q.questionText,
      dimension: q.dimension,
      displayOrder: i + 1,
      isActive: true,
    }).returning();
    
    const opts = q.options.map((o, idx) => ({
      questionId: inserted.id,
      optionText: o.optionText,
      score: o.score,
      optionOrder: idx + 1,
    }));
    await db.insert(schoolAssessmentOptions).values(opts);
    schoolQCount++;
  }
  console.log(`✓ ${schoolQCount} school assessment questions seeded (${schoolAssessmentDomains.length} domains)\n`);

  // ─── Parent Assessment Questions ─────────────────────────────────
  console.log(`Seeding ${parentSeeds.length} parent assessment questions...`);
  let parentQCount = 0;
  for (let i = 0; i < parentSeeds.length; i++) {
    const q = parentSeeds[i];
    const [inserted] = await db.insert(parentAssessmentQuestions).values({
      code: q.code,
      domain: q.domain,
      questionText: q.questionText,
      dimension: q.dimension,
      displayOrder: i + 1,
      isActive: true,
    }).returning();
    
    const opts = q.options.map((o, idx) => ({
      questionId: inserted.id,
      optionText: o.optionText,
      score: o.score,
      optionOrder: idx + 1,
    }));
    await db.insert(parentAssessmentOptions).values(opts);
    parentQCount++;
  }
  console.log(`✓ ${parentQCount} parent assessment questions seeded (${parentAssessmentDomains.length} domains)\n`);

  // ─── Subscription Plans (Coin Packages) ────────────────────────────
  await db.insert(subscriptionPlans).values([
    { name: "Custom Coins", code: "coins_custom", amount: "0", interval: "one_time", credits: 0, isActive: true, features: ["Buy any number at ₦2,000/coin"] },
    { name: "Bundle 20 Coins", code: "coins_bundle_20", amount: "35000", interval: "one_time", credits: 20, isActive: true, features: ["20 deep report coins at ₦35,000"] },
  ]);
  console.log("✓ Coin packages seeded\n");

  console.log("✅ Seeding complete!");
  console.log(`\nAdmin credentials:`);
  console.log(`  Email:     admin@skoolar.org`);
  console.log(`  Password:  successor`);
  console.log(`\nAll other users will be created through the registration flow.\n`);
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
