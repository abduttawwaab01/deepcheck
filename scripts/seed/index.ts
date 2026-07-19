// @ts-nocheck
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
import { subscriptionPlans } from "@/lib/db/schemas/payments";
import {
  primaryToJss1Questions,
  jss3ToSs1Questions,
  ss3ToUniversityQuestions,
} from "@/data/assessments/seeds";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";

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
  const permCodes = ["manage:system", "manage:school", "manage:assessments", "view:reports", "manage:students", "take:assessment"];
  const permDescs: Record<string, string> = {
    "manage:system": "Full system access", "manage:school": "Manage school settings",
    "manage:assessments": "Create/edit assessments", "view:reports": "View diagnostic reports",
    "manage:students": "Manage student profiles", "take:assessment": "Take assessments",
  };
  const permModules: Record<string, string> = {
    "manage:system": "system", "manage:school": "school", "manage:assessments": "assessment",
    "view:reports": "report", "manage:students": "student", "take:assessment": "assessment",
  };
  for (const c of permCodes) {
    await db.execute(sql`INSERT INTO permissions (id, code, name, module, description) VALUES (gen_random_uuid(), ${c}, ${c}, ${permModules[c]}, ${permDescs[c]})`);
  }
  const permRows = await db.execute(sql`SELECT id, code FROM permissions`);
  const permMap: Record<string, string> = {};
  for (const r of permRows.rows as { id: string; code: string }[]) permMap[r.code] = r.id;
  console.log(`✓ ${permCodes.length} permissions created`);

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
    { name: "Gracefield College", slug: "gracefield-college", city: "Lagos", state: "Lagos", schoolType: "Secondary", verificationStatus: "verified", subscriptionStatus: "premium", deepReportCredits: 50, isActive: true },
    { name: "Excel Comprehensive Academy", slug: "excel-comprehensive", city: "Abuja", state: "FCT", schoolType: "Secondary", verificationStatus: "verified", subscriptionStatus: "free", deepReportCredits: 5, isActive: true },
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

  // Student profiles
  await db.insert(studentProfiles).values([
    { userId: studentUsers[0].id, grade: "Grade 10", schoolId: schoolData[0].id },
    { userId: studentUsers[1].id, grade: "Grade 11", schoolId: schoolData[0].id },
    { userId: studentUsers[2].id, grade: "Grade 12", schoolId: schoolData[0].id },
    { userId: studentUsers[3].id, grade: "Grade 9", schoolId: schoolData[1].id },
    { userId: studentUsers[4].id, grade: "Grade 10", schoolId: schoolData[1].id },
    { userId: studentUsers[5].id, grade: "Grade 11", schoolId: schoolData[1].id },
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

  // Concepts
  const conceptData = [
    { name: "Place Value", code: "place-value", subtopicId: topicMap["number-operations"] },
    { name: "Fractions", code: "fractions", subtopicId: topicMap["number-operations"] },
    { name: "Decimals", code: "decimals", subtopicId: topicMap["number-operations"] },
    { name: "Percentages", code: "percentages", subtopicId: topicMap["number-operations"] },
    { name: "Ratios", code: "ratios", subtopicId: topicMap["number-operations"] },
    { name: "Algebraic Expressions", code: "algebraic-expressions", subtopicId: topicMap.algebra },
    { name: "Linear Equations", code: "linear-equations", subtopicId: topicMap.algebra },
    { name: "Inequalities", code: "inequalities", subtopicId: topicMap.algebra },
    { name: "Shapes & Angles", code: "shapes-angles", subtopicId: topicMap["geometry-measurement"] },
    { name: "Area & Perimeter", code: "area-perimeter", subtopicId: topicMap["geometry-measurement"] },
    { name: "Volume", code: "volume", subtopicId: topicMap["geometry-measurement"] },
    { name: "Data Collection", code: "data-collection", subtopicId: topicMap["statistics-probability"] },
    { name: "Probability", code: "probability", subtopicId: topicMap["statistics-probability"] },
    { name: "Main Idea", code: "main-idea", subtopicId: topicMap["reading-comprehension"] },
    { name: "Inference", code: "inference", subtopicId: topicMap["reading-comprehension"] },
    { name: "Vocabulary in Context", code: "vocabulary-context", subtopicId: topicMap["reading-comprehension"] },
    { name: "Parts of Speech", code: "parts-of-speech", subtopicId: topicMap["grammar-usage"] },
    { name: "Sentence Structure", code: "sentence-structure", subtopicId: topicMap["grammar-usage"] },
    { name: "Tenses", code: "tenses", subtopicId: topicMap["grammar-usage"] },
    { name: "Forces", code: "forces", subtopicId: topicMap.mechanics },
    { name: "Motion", code: "motion", subtopicId: topicMap.mechanics },
    { name: "Energy", code: "energy", subtopicId: topicMap.mechanics },
    { name: "Wave Properties", code: "wave-properties", subtopicId: topicMap["waves-optics"] },
    { name: "Light", code: "light", subtopicId: topicMap["waves-optics"] },
    { name: "Sound", code: "sound", subtopicId: topicMap["waves-optics"] },
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

  // Concept misconceptions
  await db.insert(conceptMisconceptions).values([
    { conceptId: conceptMap.fractions, misconception: "Believes larger denominator means larger fraction", remediationStrategy: "Use visual fraction strips to compare same-numerator fractions" },
    { conceptId: conceptMap["linear-equations"], misconception: "Believes variables always represent a single unknown", remediationStrategy: "Use balance-scale models to show equivalence" },
    { conceptId: conceptMap.forces, misconception: "Believes force is required to maintain motion", remediationStrategy: "Demonstrate inertia with frictionless surfaces" },
    { conceptId: conceptMap["parts-of-speech"], misconception: "Confuses adjectives with adverbs", remediationStrategy: "Practice identifying words that modify nouns vs verbs" },
  ]);
  console.log("✓ Concept misconceptions created");

  // ─── Question Banks ────────────────────────────────────────────────
  const bankData = await db.insert(questionBanks).values([
    { name: "Primary → JSS1 Transition", code: "PRI-JSS1", description: "Mathematics diagnostic for students moving from Primary to JSS1", subjectId: mathId, targetLevel: "Primary 6 → JSS 1", totalQuestions: 170, difficultyDistribution: { easy: 60, medium: 60, hard: 50 } },
    { name: "JSS3 → SS1 Transition", code: "JSS3-SS1", description: "Mathematics diagnostic for students moving from JSS3 to SS1", subjectId: mathId, targetLevel: "JSS 3 → SS 1", totalQuestions: 170, difficultyDistribution: { easy: 60, medium: 60, hard: 50 } },
    { name: "SS3 → University Transition", code: "SS3-UNI", description: "Mathematics diagnostic for students moving from SS3 to University", subjectId: mathId, targetLevel: "SS 3 → University", totalQuestions: 170, difficultyDistribution: { easy: 60, medium: 60, hard: 50 } },
  ]).returning();
  const bankMap = Object.fromEntries(bankData.map((b) => [b.code, b.id]));
  console.log(`✓ ${bankData.length} question banks created`);

  // Section configs
  const sectionConfigs = [
    { bankId: bankMap["PRI-JSS1"], name: "Number & Operations", slug: "number-operations", order: 1, questionCount: 50, timeMinutes: 15 },
    { bankId: bankMap["PRI-JSS1"], name: "Algebra", slug: "algebra", order: 2, questionCount: 40, timeMinutes: 12 },
    { bankId: bankMap["PRI-JSS1"], name: "Geometry & Measurement", slug: "geometry-measurement", order: 3, questionCount: 40, timeMinutes: 12 },
    { bankId: bankMap["PRI-JSS1"], name: "Statistics & Probability", slug: "statistics-probability", order: 4, questionCount: 40, timeMinutes: 11 },
    { bankId: bankMap["JSS3-SS1"], name: "Number & Operations", slug: "number-operations", order: 1, questionCount: 50, timeMinutes: 15 },
    { bankId: bankMap["JSS3-SS1"], name: "Algebra", slug: "algebra", order: 2, questionCount: 40, timeMinutes: 12 },
    { bankId: bankMap["JSS3-SS1"], name: "Geometry & Measurement", slug: "geometry-measurement", order: 3, questionCount: 40, timeMinutes: 12 },
    { bankId: bankMap["JSS3-SS1"], name: "Statistics & Probability", slug: "statistics-probability", order: 4, questionCount: 40, timeMinutes: 11 },
    { bankId: bankMap["SS3-UNI"], name: "Number & Operations", slug: "number-operations", order: 1, questionCount: 50, timeMinutes: 15 },
    { bankId: bankMap["SS3-UNI"], name: "Algebra", slug: "algebra", order: 2, questionCount: 40, timeMinutes: 12 },
    { bankId: bankMap["SS3-UNI"], name: "Geometry & Measurement", slug: "geometry-measurement", order: 3, questionCount: 40, timeMinutes: 12 },
    { bankId: bankMap["SS3-UNI"], name: "Statistics & Probability", slug: "statistics-probability", order: 4, questionCount: 40, timeMinutes: 11 },
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
  for (const q of allBankQuestions) {
    const { options, ...questionFields } = q;
    await db.insert(questionsTable).values(questionFields as any);
    insertedCount++;
    if (insertedCount % 50 === 0) process.stdout.write(".");
  }
  console.log(`\n✓ ${insertedCount} questions inserted`);

  // Insert options for all questions
  let optCount = 0;
  for (const q of allBankQuestions) {
    if (q.options && q.options.length > 0) {
      await db.insert(questionOptions).values(
        q.options.map((o: any) => ({ ...o, questionId: q.id })),
      );
      optCount += q.options.length;
    }
  }
  console.log(`✓ ${optCount} question options inserted`);

  // ─── Terminal Assessment Configs ────────────────────────────────────
  await db.insert(assessmentConfigs).values([
    { name: "Primary → JSS1 Terminal Assessment", slug: "pri-jss1-terminal", bankId: bankMap["PRI-JSS1"], description: "End-of-transition diagnostic for primary school leavers", totalQuestions: 30, timeMinutes: 45, passingScore: 40, isActive: true },
    { name: "JSS3 → SS1 Terminal Assessment", slug: "jss3-ss1-terminal", bankId: bankMap["JSS3-SS1"], description: "End-of-transition diagnostic for junior secondary leavers", totalQuestions: 30, timeMinutes: 45, passingScore: 40, isActive: true },
    { name: "SS3 → University Terminal Assessment", slug: "ss3-uni-terminal", bankId: bankMap["SS3-UNI"], description: "End-of-transition diagnostic for senior secondary leavers", totalQuestions: 30, timeMinutes: 45, passingScore: 40, isActive: true },
  ]);
  console.log("✓ Terminal assessment configs created\n");

  // ─── Subscription Plans ────────────────────────────────────────────
  await db.insert(subscriptionPlans).values([
    { name: "Free", slug: "free", price: 0, credits: 1, period: "month", features: { deepReports: 1, basicReports: -1, students: -1 } },
    { name: "Basic", slug: "basic", price: 5000, credits: 10, period: "month", features: { deepReports: 10, basicReports: -1, students: -1 } },
    { name: "Pro", slug: "pro", price: 15000, credits: 50, period: "month", features: { deepReports: 50, basicReports: -1, students: -1 } },
    { name: "Enterprise", slug: "enterprise", price: 50000, credits: -1, period: "month", features: { deepReports: -1, basicReports: -1, students: -1 } },
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
