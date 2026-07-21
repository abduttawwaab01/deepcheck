import { db } from "@/lib/db";
import {
  users, roles, permissions, rolePermissions, userRoles, studentProfiles,
} from "@/lib/db/schemas/users";
import { schools, schoolSettings } from "@/lib/db/schemas/schools";
import { teacherProfiles } from "@/lib/db/schemas/teachers";
import { guardianRelations } from "@/lib/db/schemas/guardians";
import { subjects, topics, concepts, conceptPrerequisites, conceptMisconceptions } from "@/lib/db/schemas/content";
import { questions as questionsTable, questionOptions } from "@/lib/db/schemas/questions";
import { questionBanks, questionBankConfigs } from "@/lib/db/schemas/question-banks";
import { assessmentConfigs } from "@/lib/db/schemas/assessments";
import { paymentTransactions, subscriptionPlans } from "@/lib/db/schemas/payments";
import { schoolAssessmentQuestions, schoolAssessmentOptions } from "@/lib/db/schemas/school-assessments";
import {
  primaryToJss1Questions,
  jss3ToSs1Questions,
  ss3ToUniversityQuestions,
} from "@/data/assessments/seeds";
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
  console.log("🌱 Seeding Deep Check diagnostic database...\n");
  const pwHash = await bcrypt.hash("successor", 10);

  // ─── Clean existing data ──────────────────────────────────────────
  await db.execute(sql`TRUNCATE TABLE
    user_roles, users, role_permissions, permissions, roles,
    guardian_relations, student_profiles, teacher_profiles,
    school_settings, schools,
    concept_prerequisites, concept_misconceptions, concepts, topics, subjects,
    question_options, questions, question_bank_configs, question_banks,
    assessment_configs, subscription_plans
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

  const rolePermInserts = [
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
  ];
  await db.insert(rolePermissions).values(rolePermInserts);
  console.log("✓ Role-permission mappings created");

  // ─── Admin User ────────────────────────────────────────────────────
  const [adminUser] = await db.insert(users).values([
    { email: "admin@skoolar.org", firstName: "Deep", lastName: "Admin", passwordHash: pwHash, isVerified: true, isActive: true },
  ]).returning();
  await db.insert(userRoles).values([{ userId: adminUser.id, roleId: adminRole.id }]);
  console.log("✓ Admin user created (admin@skoolar.org / successor)");

  // ─── Schools ───────────────────────────────────────────────────────
  const schoolData = await db.insert(schools).values([
    { name: "Gracefield College", slug: "gracefield-college", city: "Lagos", state: "Lagos", schoolType: "secondary", verificationStatus: "verified", subscriptionStatus: "premium", deepReportCredits: 50, isActive: true },
    { name: "Excel Comprehensive Academy", slug: "excel-comprehensive", city: "Abuja", state: "FCT", schoolType: "secondary", verificationStatus: "verified", subscriptionStatus: "free", deepReportCredits: 5, isActive: true },
  ]).returning();
  console.log(`✓ ${schoolData.length} schools created`);

  // School settings
  await db.insert(schoolSettings).values([
    { schoolId: schoolData[0].id },
    { schoolId: schoolData[1].id },
  ]);

  // ─── School Admin Users ─────────────────────────────────────────────
  const graceAdminData = [
    { email: "principal@gracefield.ng", firstName: "Gracefield", lastName: "Principal", passwordHash: pwHash, isVerified: true, isActive: true },
  ];
  const excelAdminData = [
    { email: "admin@excelacademy.ng", firstName: "Excel", lastName: "Admin", passwordHash: pwHash, isVerified: true, isActive: true },
  ];

  const schoolAdminUsers = await db.insert(users).values([
    ...graceAdminData, ...excelAdminData,
  ]).returning();

  await db.insert(userRoles).values([
    { userId: schoolAdminUsers[0].id, roleId: schoolAdminRole.id },
    { userId: schoolAdminUsers[1].id, roleId: schoolAdminRole.id },
  ]);
  console.log(`✓ ${schoolAdminUsers.length} school admin users created`);

  // ─── Teachers ──────────────────────────────────────────────────────
  const teacherUserData = [
    { email: "chioma@gracefield.ng", firstName: "Chioma", lastName: "Okafor", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "david@gracefield.ng", firstName: "David", lastName: "Adeyemi", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "fatima@excelacademy.ng", firstName: "Fatima", lastName: "Usman", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "peter@excelacademy.ng", firstName: "Peter", lastName: "Eze", passwordHash: pwHash, isVerified: true, isActive: true },
  ];
  const teacherUsers = await db.insert(users).values(teacherUserData).returning();

  await db.insert(userRoles).values(
    teacherUsers.map((u) => ({ userId: u.id, roleId: teacherRole.id })),
  );
  console.log(`✓ ${teacherUsers.length} teachers created`);

  // Teacher profiles
  await db.insert(teacherProfiles).values([
    { userId: teacherUsers[0].id, schoolId: schoolData[0].id, subject: "Mathematics", yearsOfExperience: 8 },
    { userId: teacherUsers[1].id, schoolId: schoolData[0].id, subject: "English", yearsOfExperience: 5 },
    { userId: teacherUsers[2].id, schoolId: schoolData[1].id, subject: "Physics", yearsOfExperience: 6 },
    { userId: teacherUsers[3].id, schoolId: schoolData[1].id, subject: "Chemistry", yearsOfExperience: 4 },
  ]);

  // ─── Students ──────────────────────────────────────────────────────
  const studentUserData = [
    { email: "adedayo@student.ng", firstName: "Adedayo", lastName: "Ogunlesi", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "amara@student.ng", firstName: "Amara", lastName: "Okonkwo", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "kelechi@student.ng", firstName: "Kelechi", lastName: "Nwosu", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "tunde@student.ng", firstName: "Tunde", lastName: "Bakare", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "zainab@student.ng", firstName: "Zainab", lastName: "Yusuf", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "chidi@student.ng", firstName: "Chidi", lastName: "Okafor", passwordHash: pwHash, isVerified: true, isActive: true },
  ];
  const studentUsers = await db.insert(users).values(studentUserData).returning();

  await db.insert(userRoles).values(
    studentUsers.map((u) => ({ userId: u.id, roleId: studentRole.id })),
  );
  console.log(`✓ ${studentUsers.length} students created`);

  // Student profiles (using schema fields: userId, studentCode, dateOfBirth, gender, currentSchoolId, enrollmentStatus)
  await db.insert(studentProfiles).values([
    { userId: studentUsers[0].id, currentSchoolId: schoolData[0].id, enrollmentStatus: "active" },
    { userId: studentUsers[1].id, currentSchoolId: schoolData[0].id, enrollmentStatus: "active" },
    { userId: studentUsers[2].id, currentSchoolId: schoolData[0].id, enrollmentStatus: "active" },
    { userId: studentUsers[3].id, currentSchoolId: schoolData[1].id, enrollmentStatus: "active" },
    { userId: studentUsers[4].id, currentSchoolId: schoolData[1].id, enrollmentStatus: "active" },
    { userId: studentUsers[5].id, currentSchoolId: schoolData[1].id, enrollmentStatus: "active" },
  ]);

  // ─── Parent ────────────────────────────────────────────────────────
  const parentUserData = [
    { email: "bukola@guardian.ng", firstName: "Bukola", lastName: "Ogunlesi", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "nnamdi@guardian.ng", firstName: "Nnamdi", lastName: "Okonkwo", passwordHash: pwHash, isVerified: true, isActive: true },
  ];
  const parentUsers = await db.insert(users).values(parentUserData).returning();

  await db.insert(userRoles).values(
    parentUsers.map((u) => ({ userId: u.id, roleId: parentRole.id })),
  );
  console.log(`✓ ${parentUsers.length} parents created`);

  // Guardian relationships
  await db.insert(guardianRelations).values([
    { guardianId: parentUsers[0].id, studentId: studentUsers[0].id, relationship: "mother" },
    { guardianId: parentUsers[1].id, studentId: studentUsers[1].id, relationship: "father" },
  ]);

  // ─── Subjects ──────────────────────────────────────────────────────
  const subjectData = await db.insert(subjects).values([
    { name: "Mathematics", code: "mathematics", iconUrl: "function-square", description: "Numbers, algebra, geometry, and problem-solving" },
    { name: "English", code: "english", iconUrl: "book-open", description: "Reading comprehension, grammar, and composition" },
    { name: "Physics", code: "physics", iconUrl: "atom", description: "Matter, energy, motion, and forces" },
    { name: "Chemistry", code: "chemistry", iconUrl: "flask-conical", description: "Elements, compounds, reactions, and bonding" },
    { name: "Biology", code: "biology", iconUrl: "dna", description: "Living organisms, cells, genetics, and ecosystems" },
  ]).returning();
  console.log(`✓ ${subjectData.length} subjects created`);

  const subjectMap = Object.fromEntries(subjectData.map((s) => [s.code!, s.id]));
  const mathId = subjectMap.mathematics;
  const engId = subjectMap.english;
  const phyId = subjectMap.physics;
  const chemId = subjectMap.chemistry;
  const bioId = subjectMap.biology;

  // ─── Topics & Concepts ─────────────────────────────────────────────
  const mathTopics = [
    { name: "Number & Operations", code: "number-operations", subjectId: mathId, displayOrder: 1 },
    { name: "Algebra", code: "algebra", subjectId: mathId, displayOrder: 2 },
    { name: "Geometry & Measurement", code: "geometry-measurement", subjectId: mathId, displayOrder: 3 },
    { name: "Statistics & Probability", code: "statistics-probability", subjectId: mathId, displayOrder: 4 },
  ];
  const engTopics = [
    { name: "Reading Comprehension", code: "reading-comprehension", subjectId: engId, displayOrder: 1 },
    { name: "Grammar & Usage", code: "grammar-usage", subjectId: engId, displayOrder: 2 },
  ];
  const phyTopics = [
    { name: "Mechanics", code: "mechanics", subjectId: phyId, displayOrder: 1 },
    { name: "Waves & Optics", code: "waves-optics", subjectId: phyId, displayOrder: 2 },
  ];

  const topicData = await db.insert(topics).values([
    ...mathTopics, ...engTopics, ...phyTopics,
  ]).returning();
  console.log(`✓ ${topicData.length} topics created`);
  const topicMap = Object.fromEntries(topicData.map((t) => [t.code!, t.id]));

  // Concepts (schema: name, code, subtopicId, bloomLevel, isFoundational, importanceWeight)
  const conceptData = [
    { name: "Place Value", code: "place-value", subtopicId: topicMap["number-operations"], bloomLevel: "remember", isFoundational: true },
    { name: "Fractions", code: "fractions", subtopicId: topicMap["number-operations"], bloomLevel: "understand", isFoundational: true },
    { name: "Decimals", code: "decimals", subtopicId: topicMap["number-operations"], bloomLevel: "understand" },
    { name: "Percentages", code: "percentages", subtopicId: topicMap["number-operations"], bloomLevel: "apply" },
    { name: "Ratios", code: "ratios", subtopicId: topicMap["number-operations"], bloomLevel: "apply" },
    { name: "Algebraic Expressions", code: "algebraic-expressions", subtopicId: topicMap.algebra, bloomLevel: "understand", isFoundational: true },
    { name: "Linear Equations", code: "linear-equations", subtopicId: topicMap.algebra, bloomLevel: "apply" },
    { name: "Inequalities", code: "inequalities", subtopicId: topicMap.algebra, bloomLevel: "apply" },
    { name: "Shapes & Angles", code: "shapes-angles", subtopicId: topicMap["geometry-measurement"], bloomLevel: "remember", isFoundational: true },
    { name: "Area & Perimeter", code: "area-perimeter", subtopicId: topicMap["geometry-measurement"], bloomLevel: "apply" },
    { name: "Volume", code: "volume", subtopicId: topicMap["geometry-measurement"], bloomLevel: "apply" },
    { name: "Data Collection", code: "data-collection", subtopicId: topicMap["statistics-probability"], bloomLevel: "remember" },
    { name: "Probability", code: "probability", subtopicId: topicMap["statistics-probability"], bloomLevel: "understand" },
    { name: "Main Idea", code: "main-idea", subtopicId: topicMap["reading-comprehension"], bloomLevel: "understand", isFoundational: true },
    { name: "Inference", code: "inference", subtopicId: topicMap["reading-comprehension"], bloomLevel: "analyze" },
    { name: "Vocabulary in Context", code: "vocabulary-context", subtopicId: topicMap["reading-comprehension"], bloomLevel: "understand" },
    { name: "Parts of Speech", code: "parts-of-speech", subtopicId: topicMap["grammar-usage"], bloomLevel: "remember", isFoundational: true },
    { name: "Sentence Structure", code: "sentence-structure", subtopicId: topicMap["grammar-usage"], bloomLevel: "apply" },
    { name: "Tenses", code: "tenses", subtopicId: topicMap["grammar-usage"], bloomLevel: "apply" },
    { name: "Forces", code: "forces", subtopicId: topicMap.mechanics, bloomLevel: "understand", isFoundational: true },
    { name: "Motion", code: "motion", subtopicId: topicMap.mechanics, bloomLevel: "understand" },
    { name: "Energy", code: "energy", subtopicId: topicMap.mechanics, bloomLevel: "apply" },
    { name: "Wave Properties", code: "wave-properties", subtopicId: topicMap["waves-optics"], bloomLevel: "understand", isFoundational: true },
    { name: "Light", code: "light", subtopicId: topicMap["waves-optics"], bloomLevel: "apply" },
    { name: "Sound", code: "sound", subtopicId: topicMap["waves-optics"], bloomLevel: "apply" },
  ];
  const insertedConcepts = await db.insert(concepts).values(conceptData).returning();
  console.log(`✓ ${insertedConcepts.length} concepts created`);

  const conceptMap = Object.fromEntries(insertedConcepts.map((c) => [c.code!, c.id]));

  // Concept prerequisites
  await db.insert(conceptPrerequisites).values([
    { conceptId: conceptMap.fractions, prerequisiteId: conceptMap["place-value"] },
    { conceptId: conceptMap.decimals, prerequisiteId: conceptMap.fractions },
    { conceptId: conceptMap.percentages, prerequisiteId: conceptMap.decimals },
    { conceptId: conceptMap.ratios, prerequisiteId: conceptMap.fractions },
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

  // Concept misconceptions (schema: conceptId, misconception, code, description, severity, correctionStrategy)
  await db.insert(conceptMisconceptions).values([
    { conceptId: conceptMap.fractions, misconception: "Believes larger denominator means larger fraction", correctionStrategy: "Use visual fraction strips to compare same-numerator fractions", severity: "common" },
    { conceptId: conceptMap["linear-equations"], misconception: "Believes variables always represent a single unknown", correctionStrategy: "Use balance-scale models to show equivalence", severity: "moderate" },
    { conceptId: conceptMap.forces, misconception: "Believes force is required to maintain motion", correctionStrategy: "Demonstrate inertia with frictionless surfaces", severity: "moderate" },
    { conceptId: conceptMap["parts-of-speech"], misconception: "Confuses adjectives with adverbs", correctionStrategy: "Practice identifying words that modify nouns vs verbs", severity: "common" },
  ]);
  console.log("✓ Concept misconceptions created");

  // ─── Question Banks ────────────────────────────────────────────────
  const bankData = await db.insert(questionBanks).values([
    { level: "PRI-JSS1", title: "Primary → JSS1 Transition", description: "Mathematics diagnostic for students moving from Primary to JSS1", displayOrder: 1 },
    { level: "JSS3-SS1", title: "JSS3 → SS1 Transition", description: "Mathematics diagnostic for students moving from JSS3 to SS1", displayOrder: 2 },
    { level: "SS3-UNI", title: "SS3 → University Transition", description: "Mathematics diagnostic for students moving from SS3 to University", displayOrder: 3 },
  ]).returning();
  const bankMap = Object.fromEntries(bankData.map((b) => [b.level, b.id]));
  console.log(`✓ ${bankData.length} question banks created`);

  // Section configs (schema: bankId, sectionName, questionCount, timeLimitMinutes, displayOrder)
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
  const insertedQuestions: { id: string; options: any[] }[] = [];
  for (const q of allBankQuestions) {
    const { options, ...questionFields } = q;
    const [inserted] = await db.insert(questionsTable).values(questionFields as any).returning();
    insertedQuestions.push({ id: inserted.id, options: q.options || [] });
    insertedCount++;
    if (insertedCount % 50 === 0) process.stdout.write(".");
  }
  console.log(`\n✓ ${insertedCount} questions inserted`);

  // Shuffle options for each question so correct answer is not always first
  for (const q of insertedQuestions) {
    q.options = shuffleArray(q.options).map((o, i) => ({ ...o, optionOrder: i + 1 }));
  }

  // Insert all options in one batch
  const allOptions = insertedQuestions.flatMap(({ id, options }) =>
    options.map((o: any) => ({ ...o, questionId: id }))
  );
  if (allOptions.length > 0) {
    await db.insert(questionOptions).values(allOptions);
  }
  console.log(`✓ ${allOptions.length} question options inserted`);

  // ─── Terminal Assessment Configs ────────────────────────────────────
  await db.insert(assessmentConfigs).values([
    { title: "Primary → JSS1 Terminal Assessment", subjectId: mathId, questionCount: 30, timeLimitMinutes: 45, isAdaptive: true, isPublic: true },
    { title: "JSS3 → SS1 Terminal Assessment", subjectId: mathId, questionCount: 30, timeLimitMinutes: 45, isAdaptive: true, isPublic: true },
    { title: "SS3 → University Terminal Assessment", subjectId: mathId, questionCount: 30, timeLimitMinutes: 45, isAdaptive: true, isPublic: true },
  ]);
  console.log("✓ Terminal assessment configs created");

  // ─── Teacher Quality Bank ──────────────────────────────────────────
  const tqBankData = await db.insert(questionBanks).values([
    { level: "TCH-QUALITY", title: "Teacher Quality Assessment", description: "Assessment of teaching practice and professional competencies", displayOrder: 4 },
  ]).returning();
  const tqBankId = tqBankData[0].id;

  const tqQuestions = [
    {
      questionText: "When planning a lesson, what is the MOST important first step?",
      concept: "lesson-planning", bloomLevel: "understand", difficultyLevel: "medium", expectedTimeSecs: 60, allowsCalculator: false,
      options: [
        { optionText: "Selecting assessment methods", isCorrect: false, optionOrder: 1 },
        { optionText: "Defining clear learning objectives", isCorrect: true, optionOrder: 2 },
        { optionText: "Choosing instructional materials", isCorrect: false, optionOrder: 3 },
        { optionText: "Arranging the classroom layout", isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      questionText: "Which strategy BEST supports differentiated instruction in a mixed-ability classroom?",
      concept: "differentiation", bloomLevel: "apply", difficultyLevel: "medium", expectedTimeSecs: 60, allowsCalculator: false,
      options: [
        { optionText: "Using tiered assignments at varied complexity levels", isCorrect: true, optionOrder: 1 },
        { optionText: "Having all students complete the same worksheet", isCorrect: false, optionOrder: 2 },
        { optionText: "Grouping only by student ability permanently", isCorrect: false, optionOrder: 3 },
        { optionText: "Moving through content as quickly as possible", isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      questionText: "Formative assessment is BEST described as:",
      concept: "assessment-strategies", bloomLevel: "understand", difficultyLevel: "easy", expectedTimeSecs: 45, allowsCalculator: false,
      options: [
        { optionText: "End-of-term examinations", isCorrect: false, optionOrder: 1 },
        { optionText: "Ongoing checks for understanding during instruction", isCorrect: true, optionOrder: 2 },
        { optionText: "Standardized testing for accountability", isCorrect: false, optionOrder: 3 },
        { optionText: "Summative projects at the end of a unit", isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      questionText: "A student consistently interrupts class discussions. The MOST effective first response is to:",
      concept: "classroom-management", bloomLevel: "apply", difficultyLevel: "medium", expectedTimeSecs: 45, allowsCalculator: false,
      options: [
        { optionText: "Send the student to the principal's office", isCorrect: false, optionOrder: 1 },
        { optionText: "Privately discuss the behavior and set expectations", isCorrect: true, optionOrder: 2 },
        { optionText: "Ignore the behavior entirely", isCorrect: false, optionOrder: 3 },
        { optionText: "Publicly reprimand the student in front of peers", isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      questionText: "When communicating with parents about student progress, it is BEST to:",
      concept: "parent-communication", bloomLevel: "apply", difficultyLevel: "easy", expectedTimeSecs: 45, allowsCalculator: false,
      options: [
        { optionText: "Only contact parents when there is a problem", isCorrect: false, optionOrder: 1 },
        { optionText: "Share both strengths and areas for growth constructively", isCorrect: true, optionOrder: 2 },
        { optionText: "Compare the student negatively to classmates", isCorrect: false, optionOrder: 3 },
        { optionText: "Use educational jargon to demonstrate expertise", isCorrect: false, optionOrder: 4 },
      ],
    },
    {
      questionText: "Which practice BEST promotes an inclusive classroom environment?",
      concept: "inclusive-education", bloomLevel: "evaluate", difficultyLevel: "hard", expectedTimeSecs: 60, allowsCalculator: false,
      options: [
        { optionText: "Using multiple representation formats for content", isCorrect: true, optionOrder: 1 },
        { optionText: "Teaching all students in exactly the same way", isCorrect: false, optionOrder: 2 },
        { optionText: "Separating students with learning differences", isCorrect: false, optionOrder: 3 },
        { optionText: "Focusing only on average-performing students", isCorrect: false, optionOrder: 4 },
      ],
    },
  ];

  for (const q of tqQuestions) {
    const { options, ...fields } = q;
    const [inserted] = await db.insert(questionsTable).values({
      bankId: tqBankId,
      questionType: "multiple_choice",
      assessmentType: "teacher_quality",
      rendererType: "standard",
      difficultyParam: q.difficultyLevel === "easy" ? "-1.5" : q.difficultyLevel === "medium" ? "0" : "1.5",
      discriminationParam: "1.2",
      guessingParam: "0.25",
      ...fields,
    } as any).returning();
    const shuffled = shuffleArray(q.options).map((o, i) => ({ ...o, optionOrder: i + 1 }));
    await db.insert(questionOptions).values(
      shuffled.map((o) => ({ questionId: inserted.id, optionText: o.optionText, isCorrect: o.isCorrect, optionOrder: o.optionOrder })),
    );
  }
  console.log("✓ Teacher quality bank seeded with 6 questions\n");

  // ─── School Assessment Questions ────────────────────────────────────
  const schoolQBank = [
    { text: "How would you rate the quality of teaching in your school?", opts: ["Excellent", "Good", "Average", "Poor"] },
    { text: "Are the school facilities adequate for effective learning?", opts: ["Very Adequate", "Adequate", "Somewhat Adequate", "Inadequate"] },
    { text: "How satisfied are you with the school's communication with parents?", opts: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"] },
    { text: "Does the school provide adequate learning materials?", opts: ["Always", "Often", "Sometimes", "Rarely"] },
    { text: "How safe do students feel at this school?", opts: ["Very Safe", "Safe", "Somewhat Safe", "Unsafe"] },
    { text: "Are teachers available for extra help outside class hours?", opts: ["Always Available", "Often Available", "Sometimes Available", "Rarely Available"] },
    { text: "How effective is the school's discipline policy?", opts: ["Very Effective", "Effective", "Somewhat Effective", "Ineffective"] },
    { text: "Does the school adequately prepare students for examinations?", opts: ["Very Well", "Well", "Adequately", "Poorly"] },
    { text: "How would you rate the school's extracurricular activities?", opts: ["Excellent", "Good", "Fair", "Poor"] },
    { text: "Would you recommend this school to other parents?", opts: ["Definitely Yes", "Probably Yes", "Uncertain", "No"] },
    { text: "Are classrooms equipped with modern teaching technology?", opts: ["Fully Equipped", "Partially Equipped", "Minimally Equipped", "Not Equipped"] },
    { text: "How well does the school support students with special needs?", opts: ["Very Well", "Well", "Limited Support", "No Support"] },
  ];
  for (let i = 0; i < schoolQBank.length; i++) {
    const sq = schoolQBank[i];
    const [q] = await db.insert(schoolAssessmentQuestions).values({
      questionText: sq.text,
      displayOrder: i + 1,
      isActive: true,
    }).returning();
    await db.insert(schoolAssessmentOptions).values(
      sq.opts.map((text, j) => ({ questionId: q.id, optionText: text, optionOrder: j + 1, score: 4 - j })),
    );
  }
  console.log("✓ School assessment seeded with 12 questions\n");

  // ─── Subscription Plans ────────────────────────────────────────────
  await db.insert(subscriptionPlans).values([
    { name: "Free", code: "free", amount: "0", interval: "one_time", credits: 1, isActive: true, features: [] },
    { name: "Basic", code: "basic", amount: "5000", interval: "term", credits: 10, isActive: true, features: [] },
    { name: "Pro", code: "pro", amount: "15000", interval: "term", credits: 50, isActive: true, features: [] },
    { name: "Enterprise", code: "enterprise", amount: "50000", interval: "annual", credits: -1, isActive: true, features: [] },
  ]);
  console.log("✓ Subscription plans created\n");

  console.log("✅ Seeding complete!");
  console.log(`\nCredentials (all users):`);
  console.log(`  Admin:     admin@skoolar.org / successor`);
  console.log(`  Students:  adedayo@student.ng / successor`);
  console.log(`  Teachers:  chioma@gracefield.ng / successor`);
  console.log(`  Parents:   bukola@guardian.ng / successor`);
  console.log(`  Schools:   principal@gracefield.ng / successor\n`);
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
