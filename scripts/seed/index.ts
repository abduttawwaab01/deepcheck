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

async function seed() {
  console.log("🌱 Seeding Deep Check diagnostic database...\n");
  const pwHash = await bcrypt.hash("successor", 10);

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

  // ─── Admin User ────────────────────────────────────────────────────
  const [adminUser] = await db.insert(users).values([
    { email: "admin@skoolar.org", firstName: "Deep", lastName: "Admin", passwordHash: pwHash, isVerified: true, isActive: true },
  ]).returning();
  await db.insert(userRoles).values([{ userId: adminUser.id, roleId: adminRole.id }]);
  console.log("✓ Admin user created");

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
    { email: "adeola@school.edu.ng", firstName: "Adeola", lastName: "Ogunlesi", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "chidi@school.edu.ng", firstName: "Chidi", lastName: "Okonkwo", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "zainab@school.edu.ng", firstName: "Zainab", lastName: "Abdullahi", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "emeka@excel.edu.ng", firstName: "Emeka", lastName: "Nwosu", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "temilade@excel.edu.ng", firstName: "Temilade", lastName: "Johnson", passwordHash: pwHash, isVerified: true, isActive: true },
    { email: "student@self.ng", firstName: "Student", lastName: "Self", passwordHash: pwHash, isVerified: true, isActive: true },
  ];
  const studentUsers = await db.insert(users).values(studentUserData).returning();

  await db.insert(userRoles).values(
    studentUsers.map((u) => ({ userId: u.id, roleId: studentRole.id })),
  );
  console.log(`✓ ${studentUsers.length} students created`);

  // Student profiles (link to schools where applicable)
  await db.insert(studentProfiles).values([
    { userId: studentUsers[0].id, studentCode: "GF-001", currentSchoolId: schoolData[0].id, enrollmentStatus: "active" },
    { userId: studentUsers[1].id, studentCode: "GF-002", currentSchoolId: schoolData[0].id, enrollmentStatus: "active" },
    { userId: studentUsers[2].id, studentCode: "GF-003", currentSchoolId: schoolData[0].id, enrollmentStatus: "active" },
    { userId: studentUsers[3].id, studentCode: "EC-001", currentSchoolId: schoolData[1].id, enrollmentStatus: "active" },
    { userId: studentUsers[4].id, studentCode: "EC-002", currentSchoolId: schoolData[1].id, enrollmentStatus: "active" },
    { userId: studentUsers[5].id, studentCode: "SELF-001", enrollmentStatus: "active" },
  ]);

  // ─── Parent ────────────────────────────────────────────────────────
  const [parentUser] = await db.insert(users).values([
    { email: "parent@family.ng", firstName: "Ngozi", lastName: "Ogunlesi", passwordHash: pwHash, isVerified: true, isActive: true },
  ]).returning();
  await db.insert(userRoles).values([{ userId: parentUser.id, roleId: parentRole.id }]);
  console.log("✓ Parent user created");

  // Link parent to children (Adeola and Chidi)
  await db.insert(guardianRelations).values([
    { guardianId: parentUser.id, studentId: studentUsers[0].id, relationship: "mother", isPrimary: true },
    { guardianId: parentUser.id, studentId: studentUsers[1].id, relationship: "guardian", isPrimary: true },
  ]);

  // ─── Permissions ────────────────────────────────────────────────────
  const permData = await db.insert(permissions).values([
    { code: "user:read", name: "Read users", module: "users" },
    { code: "user:write", name: "Create/Edit users", module: "users" },
    { code: "question:manage", name: "Manage questions", module: "assessment" },
    { code: "assessment:read", name: "Read assessments", module: "assessment" },
    { code: "report:read", name: "Read reports", module: "reports" },
    { code: "report:generate", name: "Generate deep reports", module: "reports" },
    { code: "report:pay", name: "Pay for deep reports", module: "reports" },
    { code: "school:manage", name: "Manage school", module: "school" },
    { code: "payment:read", name: "View payments", module: "payments" },
  ]).returning();
  console.log(`✓ ${permData.length} permissions created`);

  // All permissions to admin
  await db.insert(rolePermissions).values(
    permData.map((p) => ({ roleId: adminRole.id, permissionId: p.id, isAllowed: true })),
  );

  // ─── Subjects / Topics / Concepts ──────────────────────────────────
  const subjectData = await db.insert(subjects).values([
    { name: "Mathematics", code: "MATH", description: "Mathematics for WASSCE", isActive: true },
    { name: "English Language", code: "ENG", description: "English Language for WASSCE", isActive: true },
    { name: "Physics", code: "PHY", description: "Physics for WASSCE", isActive: true },
    { name: "Chemistry", code: "CHEM", description: "Chemistry for WASSCE", isActive: true },
    { name: "Biology", code: "BIO", description: "Biology for WASSCE", isActive: true },
  ]).returning();
  console.log(`✓ ${subjectData.length} subjects created`);

  const math = subjectData[0];
  const eng = subjectData[1];
  const phy = subjectData[2];
  const chem = subjectData[3];
  const bio = subjectData[4];

  const topicData = await db.insert(topics).values([
    { subjectId: math.id, name: "Algebra", description: "Algebraic expressions, equations, inequalities", displayOrder: 1, isActive: true },
    { subjectId: math.id, name: "Geometry", description: "Shapes, angles, theorems", displayOrder: 2, isActive: true },
    { subjectId: math.id, name: "Trigonometry", description: "Ratios, identities, applications", displayOrder: 3, isActive: true },
    { subjectId: math.id, name: "Statistics", description: "Data collection, measures, probability", displayOrder: 4, isActive: true },
    { subjectId: math.id, name: "Calculus", description: "Differentiation and integration basics", displayOrder: 5, isActive: true },
    { subjectId: eng.id, name: "Grammar", description: "Parts of speech, tenses, syntax", displayOrder: 1, isActive: true },
    { subjectId: eng.id, name: "Comprehension", description: "Reading and passage analysis", displayOrder: 2, isActive: true },
    { subjectId: eng.id, name: "Essay Writing", description: "Structure, argument, style", displayOrder: 3, isActive: true },
    { subjectId: eng.id, name: "Literature", description: "Prose, poetry, drama", displayOrder: 4, isActive: true },
    { subjectId: eng.id, name: "Vocabulary", description: "Word meaning and usage", displayOrder: 5, isActive: true },
    { subjectId: phy.id, name: "Mechanics", description: "Forces, motion, energy", displayOrder: 1, isActive: true },
    { subjectId: phy.id, name: "Waves", description: "Sound, light, wave properties", displayOrder: 2, isActive: true },
    { subjectId: phy.id, name: "Electricity", description: "Circuits, current, voltage", displayOrder: 3, isActive: true },
    { subjectId: chem.id, name: "Atomic Structure", description: "Atoms, elements, periodic table", displayOrder: 1, isActive: true },
    { subjectId: chem.id, name: "Chemical Reactions", description: "Equations, balancing, types", displayOrder: 2, isActive: true },
    { subjectId: bio.id, name: "Cell Biology", description: "Cell structure, division, function", displayOrder: 1, isActive: true },
    { subjectId: bio.id, name: "Ecology", description: "Ecosystems, food chains, environment", displayOrder: 2, isActive: true },
  ]).returning();
  console.log(`✓ ${topicData.length} topics created`);

  const conceptData = await db.insert(concepts).values([
    { subtopicId: topicData[0].id, name: "Linear Equations", description: "Solving ax + b = c", estimatedMasteryHours: "4", importanceWeight: 8, isFoundational: true, bloomLevel: "apply" },
    { subtopicId: topicData[0].id, name: "Quadratic Equations", description: "ax² + bx + c = 0", estimatedMasteryHours: "6", importanceWeight: 9, isFoundational: true, bloomLevel: "analyze" },
    { subtopicId: topicData[1].id, name: "Triangles", description: "Properties and theorems", estimatedMasteryHours: "5", importanceWeight: 7, bloomLevel: "understand" },
    { subtopicId: topicData[2].id, name: "Trigonometric Ratios", description: "Sine, cosine, tangent", estimatedMasteryHours: "4", importanceWeight: 8, bloomLevel: "remember" },
    { subtopicId: topicData[5].id, name: "Parts of Speech", description: "Nouns, verbs, adjectives", estimatedMasteryHours: "3", importanceWeight: 6, isFoundational: true, bloomLevel: "remember" },
    { subtopicId: topicData[5].id, name: "Tenses", description: "Past, present, future", estimatedMasteryHours: "4", importanceWeight: 7, isFoundational: true, bloomLevel: "understand" },
    { subtopicId: topicData[6].id, name: "Main Idea", description: "Identifying central theme", estimatedMasteryHours: "4", importanceWeight: 8, bloomLevel: "analyze" },
    { subtopicId: topicData[6].id, name: "Inference", description: "Drawing conclusions from text", estimatedMasteryHours: "5", importanceWeight: 7, bloomLevel: "evaluate" },
    { subtopicId: topicData[10].id, name: "Newton's Laws", description: "Force, mass, acceleration", estimatedMasteryHours: "6", importanceWeight: 9, isFoundational: true, bloomLevel: "apply" },
    { subtopicId: topicData[12].id, name: "Ohm's Law", description: "V = IR", estimatedMasteryHours: "4", importanceWeight: 8, bloomLevel: "apply" },
    { subtopicId: topicData[13].id, name: "Atomic Models", description: "Structure of the atom", estimatedMasteryHours: "5", importanceWeight: 7, bloomLevel: "remember" },
    { subtopicId: topicData[15].id, name: "Mitosis & Meiosis", description: "Cell division processes", estimatedMasteryHours: "5", importanceWeight: 8, bloomLevel: "understand" },
  ]).returning();
  console.log(`✓ ${conceptData.length} concepts created`);

  await db.insert(conceptPrerequisites).values([
    { conceptId: conceptData[1].id, prerequisiteId: conceptData[0].id },
    { conceptId: conceptData[7].id, prerequisiteId: conceptData[6].id },
    { conceptId: conceptData[9].id, prerequisiteId: conceptData[8].id },
  ]);

  await db.insert(conceptMisconceptions).values([
    { conceptId: conceptData[0].id, misconception: "Division by zero", description: "Thinking x/0 = 0 instead of undefined", severity: "high" },
    { conceptId: conceptData[3].id, misconception: "Sine-cosine confusion", description: "Confusing sine with cosine in right triangles", severity: "high" },
    { conceptId: conceptData[7].id, misconception: "Correlation vs causation", description: "Thinking correlation implies causation", severity: "medium" },
  ]);

  // ─── Academic Questions (22) ────────────────────────────────────────
  interface QInput {
    subjectId?: string; topicId?: string; conceptId?: string;
    questionText: string; bloomLevel: string;
    difficultyParam: string; discriminationParam: string; guessingParam: string;
    expectedTimeSecs: number;
    options: Array<{ optionText: string; optionOrder: number; isCorrect: boolean }>;
  }

  const academicQuestions: QInput[] = [
    { subjectId: math.id, topicId: topicData[0].id, conceptId: conceptData[0].id, questionText: "What is the value of x if 3x + 7 = 22?", bloomLevel: "apply", difficultyParam: "0.4", discriminationParam: "1.2", guessingParam: "0.25", expectedTimeSecs: 30, options: [
      { optionText: "3", optionOrder: 1, isCorrect: false }, { optionText: "5", optionOrder: 2, isCorrect: true },
      { optionText: "7", optionOrder: 3, isCorrect: false }, { optionText: "15", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: math.id, topicId: topicData[0].id, conceptId: conceptData[0].id, questionText: "Solve: 2(x - 3) = 10", bloomLevel: "apply", difficultyParam: "0.5", discriminationParam: "1.1", guessingParam: "0.25", expectedTimeSecs: 45, options: [
      { optionText: "x = 5", optionOrder: 1, isCorrect: false }, { optionText: "x = 8", optionOrder: 2, isCorrect: true },
      { optionText: "x = 6", optionOrder: 3, isCorrect: false }, { optionText: "x = 2", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: math.id, topicId: topicData[0].id, conceptId: conceptData[1].id, questionText: "What are the roots of x² - 5x + 6 = 0?", bloomLevel: "analyze", difficultyParam: "0.65", discriminationParam: "1.4", guessingParam: "0.2", expectedTimeSecs: 60, options: [
      { optionText: "2 and 3", optionOrder: 1, isCorrect: true }, { optionText: "-2 and -3", optionOrder: 2, isCorrect: false },
      { optionText: "1 and 6", optionOrder: 3, isCorrect: false }, { optionText: "-1 and 6", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: math.id, topicId: topicData[1].id, conceptId: conceptData[2].id, questionText: "In a right-angled triangle, if the two shorter sides are 3 and 4, what is the hypotenuse?", bloomLevel: "apply", difficultyParam: "0.4", discriminationParam: "1.0", guessingParam: "0.25", expectedTimeSecs: 45, options: [
      { optionText: "5", optionOrder: 1, isCorrect: true }, { optionText: "6", optionOrder: 2, isCorrect: false },
      { optionText: "7", optionOrder: 3, isCorrect: false }, { optionText: "12", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: math.id, topicId: topicData[2].id, conceptId: conceptData[3].id, questionText: "What is sin(30°)?", bloomLevel: "remember", difficultyParam: "0.3", discriminationParam: "0.9", guessingParam: "0.25", expectedTimeSecs: 20, options: [
      { optionText: "0", optionOrder: 1, isCorrect: false }, { optionText: "0.5", optionOrder: 2, isCorrect: true },
      { optionText: "0.707", optionOrder: 3, isCorrect: false }, { optionText: "1", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: math.id, topicId: topicData[3].id, questionText: "What is the mean of: 2, 4, 6, 8, 10?", bloomLevel: "remember", difficultyParam: "0.3", discriminationParam: "0.8", guessingParam: "0.25", expectedTimeSecs: 20, options: [
      { optionText: "4", optionOrder: 1, isCorrect: false }, { optionText: "6", optionOrder: 2, isCorrect: true },
      { optionText: "7", optionOrder: 3, isCorrect: false }, { optionText: "8", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: math.id, topicId: topicData[4].id, questionText: "What is the derivative of x²?", bloomLevel: "apply", difficultyParam: "0.7", discriminationParam: "1.5", guessingParam: "0.2", expectedTimeSecs: 30, options: [
      { optionText: "x", optionOrder: 1, isCorrect: false }, { optionText: "2x", optionOrder: 2, isCorrect: true },
      { optionText: "x²", optionOrder: 3, isCorrect: false }, { optionText: "2", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: eng.id, topicId: topicData[5].id, conceptId: conceptData[4].id, questionText: "Which word is a noun in: 'The beautiful garden bloomed'?", bloomLevel: "remember", difficultyParam: "0.2", discriminationParam: "0.8", guessingParam: "0.25", expectedTimeSecs: 20, options: [
      { optionText: "beautiful", optionOrder: 1, isCorrect: false }, { optionText: "garden", optionOrder: 2, isCorrect: true },
      { optionText: "bloomed", optionOrder: 3, isCorrect: false }, { optionText: "The", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: eng.id, topicId: topicData[5].id, conceptId: conceptData[5].id, questionText: "Which sentence is in the past tense?", bloomLevel: "understand", difficultyParam: "0.4", discriminationParam: "1.0", guessingParam: "0.25", expectedTimeSecs: 25, options: [
      { optionText: "She runs fast", optionOrder: 1, isCorrect: false },
      { optionText: "She ran fast", optionOrder: 2, isCorrect: true },
      { optionText: "She will run fast", optionOrder: 3, isCorrect: false },
      { optionText: "She is running fast", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: eng.id, topicId: topicData[5].id, conceptId: conceptData[5].id, questionText: "Which sentence has correct subject-verb agreement?", bloomLevel: "understand", difficultyParam: "0.5", discriminationParam: "1.2", guessingParam: "0.25", expectedTimeSecs: 30, options: [
      { optionText: "The team are winning", optionOrder: 1, isCorrect: false },
      { optionText: "The team is winning", optionOrder: 2, isCorrect: true },
      { optionText: "The team were winning", optionOrder: 3, isCorrect: false },
      { optionText: "The team have been winning", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: eng.id, topicId: topicData[6].id, conceptId: conceptData[6].id, questionText: "'The sun set behind the mountains, painting the sky in shades of orange and pink.' What is the main idea?", bloomLevel: "analyze", difficultyParam: "0.55", discriminationParam: "1.3", guessingParam: "0.2", expectedTimeSecs: 45, options: [
      { optionText: "The sun is hot", optionOrder: 1, isCorrect: false },
      { optionText: "A sunset is described", optionOrder: 2, isCorrect: true },
      { optionText: "Mountains are tall", optionOrder: 3, isCorrect: false },
      { optionText: "Orange is a color", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: eng.id, topicId: topicData[6].id, conceptId: conceptData[7].id, questionText: "If it rained every time the ground is wet, what logical error is this?", bloomLevel: "evaluate", difficultyParam: "0.7", discriminationParam: "1.5", guessingParam: "0.2", expectedTimeSecs: 50, options: [
      { optionText: "Circular reasoning", optionOrder: 1, isCorrect: false },
      { optionText: "Affirming the consequent", optionOrder: 2, isCorrect: true },
      { optionText: "Denying the antecedent", optionOrder: 3, isCorrect: false },
      { optionText: "False analogy", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: eng.id, topicId: topicData[9].id, questionText: "What does 'benevolent' mean?", bloomLevel: "remember", difficultyParam: "0.5", discriminationParam: "1.0", guessingParam: "0.25", expectedTimeSecs: 15, options: [
      { optionText: "Cruel", optionOrder: 1, isCorrect: false }, { optionText: "Kind", optionOrder: 2, isCorrect: true },
      { optionText: "Weak", optionOrder: 3, isCorrect: false }, { optionText: "Angry", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: phy.id, topicId: topicData[10].id, conceptId: conceptData[8].id, questionText: "If mass = 10kg and acceleration = 2 m/s², what is the force?", bloomLevel: "apply", difficultyParam: "0.4", discriminationParam: "1.1", guessingParam: "0.25", expectedTimeSecs: 30, options: [
      { optionText: "5 N", optionOrder: 1, isCorrect: false }, { optionText: "20 N", optionOrder: 2, isCorrect: true },
      { optionText: "12 N", optionOrder: 3, isCorrect: false }, { optionText: "0.2 N", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: phy.id, topicId: topicData[10].id, conceptId: conceptData[8].id, questionText: "What is Newton's First Law also known as?", bloomLevel: "remember", difficultyParam: "0.3", discriminationParam: "0.8", guessingParam: "0.25", expectedTimeSecs: 15, options: [
      { optionText: "Law of Acceleration", optionOrder: 1, isCorrect: false },
      { optionText: "Law of Inertia", optionOrder: 2, isCorrect: true },
      { optionText: "Law of Reaction", optionOrder: 3, isCorrect: false },
      { optionText: "Law of Gravity", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: phy.id, topicId: topicData[11].id, questionText: "Which wave type requires a medium?", bloomLevel: "understand", difficultyParam: "0.4", discriminationParam: "1.0", guessingParam: "0.25", expectedTimeSecs: 20, options: [
      { optionText: "Light wave", optionOrder: 1, isCorrect: false },
      { optionText: "Sound wave", optionOrder: 2, isCorrect: true },
      { optionText: "Radio wave", optionOrder: 3, isCorrect: false },
      { optionText: "X-ray", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: phy.id, topicId: topicData[12].id, conceptId: conceptData[9].id, questionText: "If V = 12V and R = 4Ω, what is I?", bloomLevel: "apply", difficultyParam: "0.45", discriminationParam: "1.2", guessingParam: "0.25", expectedTimeSecs: 25, options: [
      { optionText: "48 A", optionOrder: 1, isCorrect: false }, { optionText: "3 A", optionOrder: 2, isCorrect: true },
      { optionText: "0.33 A", optionOrder: 3, isCorrect: false }, { optionText: "8 A", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: chem.id, topicId: topicData[13].id, conceptId: conceptData[10].id, questionText: "What particle determines the atomic number?", bloomLevel: "remember", difficultyParam: "0.3", discriminationParam: "0.9", guessingParam: "0.25", expectedTimeSecs: 15, options: [
      { optionText: "Neutron", optionOrder: 1, isCorrect: false }, { optionText: "Proton", optionOrder: 2, isCorrect: true },
      { optionText: "Electron", optionOrder: 3, isCorrect: false }, { optionText: "Nucleus", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: chem.id, topicId: topicData[14].id, questionText: "What type of reaction is: AB + CD → AD + CB?", bloomLevel: "understand", difficultyParam: "0.5", discriminationParam: "1.1", guessingParam: "0.25", expectedTimeSecs: 25, options: [
      { optionText: "Synthesis", optionOrder: 1, isCorrect: false },
      { optionText: "Decomposition", optionOrder: 2, isCorrect: false },
      { optionText: "Double displacement", optionOrder: 3, isCorrect: true },
      { optionText: "Combustion", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: bio.id, topicId: topicData[15].id, conceptId: conceptData[11].id, questionText: "Which process divides a cell into two identical daughter cells?", bloomLevel: "understand", difficultyParam: "0.4", discriminationParam: "1.0", guessingParam: "0.25", expectedTimeSecs: 20, options: [
      { optionText: "Meiosis", optionOrder: 1, isCorrect: false }, { optionText: "Mitosis", optionOrder: 2, isCorrect: true },
      { optionText: "Fertilization", optionOrder: 3, isCorrect: false }, { optionText: "Osmosis", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: bio.id, topicId: topicData[16].id, questionText: "What is the primary source of energy in an ecosystem?", bloomLevel: "remember", difficultyParam: "0.2", discriminationParam: "0.7", guessingParam: "0.25", expectedTimeSecs: 15, options: [
      { optionText: "Wind", optionOrder: 1, isCorrect: false }, { optionText: "Sun", optionOrder: 2, isCorrect: true },
      { optionText: "Water", optionOrder: 3, isCorrect: false }, { optionText: "Soil", optionOrder: 4, isCorrect: false },
    ]},
    { subjectId: bio.id, topicId: topicData[15].id, questionText: "What organelle is the 'powerhouse of the cell'?", bloomLevel: "remember", difficultyParam: "0.2", discriminationParam: "0.7", guessingParam: "0.25", expectedTimeSecs: 10, options: [
      { optionText: "Nucleus", optionOrder: 1, isCorrect: false }, { optionText: "Mitochondria", optionOrder: 2, isCorrect: true },
      { optionText: "Ribosome", optionOrder: 3, isCorrect: false }, { optionText: "Golgi apparatus", optionOrder: 4, isCorrect: false },
    ]},
  ];

  for (const q of academicQuestions) {
    const { options: opts, ...rest } = q;
    const [inserted] = await db.insert(questionsTable).values({ ...rest, assessmentType: "academic" }).returning();
    await db.insert(questionOptions).values(
      opts.map((o) => ({ questionId: inserted.id, optionText: o.optionText, optionOrder: o.optionOrder, isCorrect: o.isCorrect })),
    );
  }
  console.log(`✓ ${academicQuestions.length} academic questions created`);

  // ─── Teacher Quality Questions (12) ─────────────────────────────────
  const teacherQuestions: QInput[] = [
    { questionText: "How often do you prepare lesson plans before class?", bloomLevel: "evaluate", difficultyParam: "0.4", discriminationParam: "1.0", guessingParam: "0.2", expectedTimeSecs: 20, options: [
      { optionText: "Always", optionOrder: 1, isCorrect: true },
      { optionText: "Most times", optionOrder: 2, isCorrect: false },
      { optionText: "Rarely", optionOrder: 3, isCorrect: false },
      { optionText: "Never", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How do you handle a student who is struggling with a topic?", bloomLevel: "evaluate", difficultyParam: "0.5", discriminationParam: "1.2", guessingParam: "0.15", expectedTimeSecs: 30, options: [
      { optionText: "Ignore and move on", optionOrder: 1, isCorrect: false },
      { optionText: "Provide extra support", optionOrder: 2, isCorrect: true },
      { optionText: "Tell them to catch up", optionOrder: 3, isCorrect: false },
      { optionText: "Send to principal", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How often do you encourage students to ask questions?", bloomLevel: "evaluate", difficultyParam: "0.3", discriminationParam: "0.9", guessingParam: "0.2", expectedTimeSecs: 20, options: [
      { optionText: "Every lesson", optionOrder: 1, isCorrect: true },
      { optionText: "Once a week", optionOrder: 2, isCorrect: false },
      { optionText: "Rarely", optionOrder: 3, isCorrect: false },
      { optionText: "Never", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How would you describe your classroom management style?", bloomLevel: "evaluate", difficultyParam: "0.5", discriminationParam: "1.1", guessingParam: "0.2", expectedTimeSecs: 30, options: [
      { optionText: "Authoritarian - strict rules", optionOrder: 1, isCorrect: false },
      { optionText: "Authoritative - firm but warm", optionOrder: 2, isCorrect: true },
      { optionText: "Permissive - students lead", optionOrder: 3, isCorrect: false },
      { optionText: "Uninvolved - minimal interference", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How do you assess student understanding during lessons?", bloomLevel: "apply", difficultyParam: "0.4", discriminationParam: "1.0", guessingParam: "0.2", expectedTimeSecs: 25, options: [
      { optionText: "Only use exams", optionOrder: 1, isCorrect: false },
      { optionText: "Mix of formative and summative", optionOrder: 2, isCorrect: true },
      { optionText: "Group discussions only", optionOrder: 3, isCorrect: false },
      { optionText: "Homework only", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How do you dress for school?", bloomLevel: "understand", difficultyParam: "0.2", discriminationParam: "0.7", guessingParam: "0.25", expectedTimeSecs: 15, options: [
      { optionText: "Professional/business attire", optionOrder: 1, isCorrect: true },
      { optionText: "Smart casual", optionOrder: 2, isCorrect: false },
      { optionText: "Very casual", optionOrder: 3, isCorrect: false },
      { optionText: "No particular effort", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How do you communicate with parents?", bloomLevel: "evaluate", difficultyParam: "0.4", discriminationParam: "1.0", guessingParam: "0.2", expectedTimeSecs: 25, options: [
      { optionText: "Regularly and proactively", optionOrder: 1, isCorrect: true },
      { optionText: "Only when there is a problem", optionOrder: 2, isCorrect: false },
      { optionText: "Through the school only", optionOrder: 3, isCorrect: false },
      { optionText: "I don't communicate with parents", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How often do you use teaching aids and technology in class?", bloomLevel: "apply", difficultyParam: "0.3", discriminationParam: "0.9", guessingParam: "0.2", expectedTimeSecs: 20, options: [
      { optionText: "Every lesson", optionOrder: 1, isCorrect: true },
      { optionText: "Sometimes", optionOrder: 2, isCorrect: false },
      { optionText: "Rarely", optionOrder: 3, isCorrect: false },
      { optionText: "Never", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How do you handle conflicts between students?", bloomLevel: "evaluate", difficultyParam: "0.5", discriminationParam: "1.2", guessingParam: "0.15", expectedTimeSecs: 30, options: [
      { optionText: "Ignore it", optionOrder: 1, isCorrect: false },
      { optionText: "Mediate fairly", optionOrder: 2, isCorrect: true },
      { optionText: "Always side with one party", optionOrder: 3, isCorrect: false },
      { optionText: "Report and avoid involvement", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How do you stay updated on teaching best practices?", bloomLevel: "analyze", difficultyParam: "0.5", discriminationParam: "1.0", guessingParam: "0.2", expectedTimeSecs: 25, options: [
      { optionText: "Attend workshops and training", optionOrder: 1, isCorrect: true },
      { optionText: "Read on my own", optionOrder: 2, isCorrect: false },
      { optionText: "Learn from colleagues", optionOrder: 3, isCorrect: false },
      { optionText: "I don't seek new knowledge", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How would you rate your punctuality?", bloomLevel: "analyze", difficultyParam: "0.3", discriminationParam: "0.8", guessingParam: "0.25", expectedTimeSecs: 15, options: [
      { optionText: "Always on time", optionOrder: 1, isCorrect: true },
      { optionText: "Usually on time", optionOrder: 2, isCorrect: false },
      { optionText: "Often late", optionOrder: 3, isCorrect: false },
      { optionText: "Very late frequently", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "What is your primary motivation for teaching?", bloomLevel: "evaluate", difficultyParam: "0.6", discriminationParam: "1.3", guessingParam: "0.15", expectedTimeSecs: 30, options: [
      { optionText: "Impact student lives", optionOrder: 1, isCorrect: true },
      { optionText: "Salary and benefits", optionOrder: 2, isCorrect: false },
      { optionText: "Job security", optionOrder: 3, isCorrect: false },
      { optionText: "Family tradition", optionOrder: 4, isCorrect: false },
    ]},
  ];
  for (const q of teacherQuestions) {
    const { options: opts, ...rest } = q;
    const [inserted] = await db.insert(questionsTable).values({ ...rest, assessmentType: "teacher_quality", subjectId: phy.id }).returning();
    await db.insert(questionOptions).values(
      opts.map((o) => ({ questionId: inserted.id, optionText: o.optionText, optionOrder: o.optionOrder, isCorrect: o.isCorrect })),
    );
  }
  console.log(`✓ ${teacherQuestions.length} teacher quality questions created`);

  // ─── School Quality Questions (12) ─────────────────────────────────
  const schoolQuestions: QInput[] = [
    { questionText: "Does your school have a clear mission and vision statement that guides daily operations?", bloomLevel: "evaluate", difficultyParam: "0.4", discriminationParam: "1.0", guessingParam: "0.2", expectedTimeSecs: 20, options: [
      { optionText: "Yes, fully implemented", optionOrder: 1, isCorrect: true },
      { optionText: "Yes, but not followed", optionOrder: 2, isCorrect: false },
      { optionText: "In development", optionOrder: 3, isCorrect: false },
      { optionText: "No", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How often does the school leadership observe classroom teaching?", bloomLevel: "evaluate", difficultyParam: "0.4", discriminationParam: "1.1", guessingParam: "0.2", expectedTimeSecs: 20, options: [
      { optionText: "Weekly", optionOrder: 1, isCorrect: true },
      { optionText: "Monthly", optionOrder: 2, isCorrect: false },
      { optionText: "Once per term", optionOrder: 3, isCorrect: false },
      { optionText: "Never", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "Does the school have functioning laboratories and practical equipment?", bloomLevel: "understand", difficultyParam: "0.3", discriminationParam: "0.9", guessingParam: "0.2", expectedTimeSecs: 20, options: [
      { optionText: "Fully equipped", optionOrder: 1, isCorrect: true },
      { optionText: "Partially equipped", optionOrder: 2, isCorrect: false },
      { optionText: "Minimal equipment", optionOrder: 3, isCorrect: false },
      { optionText: "No labs", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How does the school support students with learning difficulties?", bloomLevel: "evaluate", difficultyParam: "0.5", discriminationParam: "1.2", guessingParam: "0.15", expectedTimeSecs: 30, options: [
      { optionText: "Dedicated support programs", optionOrder: 1, isCorrect: true },
      { optionText: "Teacher referral system", optionOrder: 2, isCorrect: false },
      { optionText: "Minimal support", optionOrder: 3, isCorrect: false },
      { optionText: "No support provided", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "What is the average student-to-teacher ratio in your school?", bloomLevel: "remember", difficultyParam: "0.2", discriminationParam: "0.7", guessingParam: "0.25", expectedTimeSecs: 15, options: [
      { optionText: "Below 20:1", optionOrder: 1, isCorrect: true },
      { optionText: "20:1 to 30:1", optionOrder: 2, isCorrect: false },
      { optionText: "30:1 to 40:1", optionOrder: 3, isCorrect: false },
      { optionText: "Above 40:1", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "Does the school involve parents in student academic progress?", bloomLevel: "analyze", difficultyParam: "0.4", discriminationParam: "1.0", guessingParam: "0.2", expectedTimeSecs: 20, options: [
      { optionText: "Regular communication + meetings", optionOrder: 1, isCorrect: true },
      { optionText: "Only during open day", optionOrder: 2, isCorrect: false },
      { optionText: "Only when there is a problem", optionOrder: 3, isCorrect: false },
      { optionText: "No parent involvement", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How safe is the school environment?", bloomLevel: "analyze", difficultyParam: "0.4", discriminationParam: "1.0", guessingParam: "0.2", expectedTimeSecs: 20, options: [
      { optionText: "Very safe with security measures", optionOrder: 1, isCorrect: true },
      { optionText: "Moderately safe", optionOrder: 2, isCorrect: false },
      { optionText: "Some safety concerns", optionOrder: 3, isCorrect: false },
      { optionText: "Not safe", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "Are teachers provided with regular professional development opportunities?", bloomLevel: "apply", difficultyParam: "0.3", discriminationParam: "0.9", guessingParam: "0.2", expectedTimeSecs: 20, options: [
      { optionText: "Yes, regular training programs", optionOrder: 1, isCorrect: true },
      { optionText: "Occasional workshops", optionOrder: 2, isCorrect: false },
      { optionText: "Rarely", optionOrder: 3, isCorrect: false },
      { optionText: "Never", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "Does the school have adequate sanitation and hygiene facilities?", bloomLevel: "remember", difficultyParam: "0.2", discriminationParam: "0.7", guessingParam: "0.25", expectedTimeSecs: 15, options: [
      { optionText: "Excellent facilities", optionOrder: 1, isCorrect: true },
      { optionText: "Adequate", optionOrder: 2, isCorrect: false },
      { optionText: "Inadequate", optionOrder: 3, isCorrect: false },
      { optionText: "No proper facilities", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "Does the school track and analyze student performance data to improve outcomes?", bloomLevel: "evaluate", difficultyParam: "0.5", discriminationParam: "1.2", guessingParam: "0.15", expectedTimeSecs: 25, options: [
      { optionText: "Yes, systematically", optionOrder: 1, isCorrect: true },
      { optionText: "Sometimes", optionOrder: 2, isCorrect: false },
      { optionText: "Only for exams", optionOrder: 3, isCorrect: false },
      { optionText: "No data tracking", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "How often are school facilities (buildings, furniture) maintained?", bloomLevel: "analyze", difficultyParam: "0.3", discriminationParam: "0.8", guessingParam: "0.2", expectedTimeSecs: 20, options: [
      { optionText: "Regular maintenance schedule", optionOrder: 1, isCorrect: true },
      { optionText: "Only when something breaks", optionOrder: 2, isCorrect: false },
      { optionText: "Rarely maintained", optionOrder: 3, isCorrect: false },
      { optionText: "Never maintained", optionOrder: 4, isCorrect: false },
    ]},
    { questionText: "Does the school have a clear anti-bullying policy that is enforced?", bloomLevel: "evaluate", difficultyParam: "0.4", discriminationParam: "1.0", guessingParam: "0.2", expectedTimeSecs: 20, options: [
      { optionText: "Yes, with strict enforcement", optionOrder: 1, isCorrect: true },
      { optionText: "Policy exists but loosely enforced", optionOrder: 2, isCorrect: false },
      { optionText: "Informal handling only", optionOrder: 3, isCorrect: false },
      { optionText: "No policy", optionOrder: 4, isCorrect: false },
    ]},
  ];
  for (const q of schoolQuestions) {
    const { options: opts, ...rest } = q;
    const [inserted] = await db.insert(questionsTable).values({ ...rest, assessmentType: "school_quality" }).returning();
    await db.insert(questionOptions).values(
      opts.map((o) => ({ questionId: inserted.id, optionText: o.optionText, optionOrder: o.optionOrder, isCorrect: o.isCorrect })),
    );
  }
  console.log(`✓ ${schoolQuestions.length} school quality questions created`);

  // ─── Assessment Configs ──────────────────────────────────────────────
  await db.insert(assessmentConfigs).values([
    { title: "Mathematics Diagnostic", assessmentType: "academic", subjectId: math.id, questionCount: 10, timeLimitMinutes: 15, isAdaptive: true, isPublic: true },
    { title: "English Language Diagnostic", assessmentType: "academic", subjectId: eng.id, questionCount: 10, timeLimitMinutes: 15, isAdaptive: true, isPublic: true },
    { title: "Teacher Quality Assessment", assessmentType: "teacher_quality", questionCount: 12, timeLimitMinutes: 20, isAdaptive: false, isPublic: false },
    { title: "School Quality Assessment", assessmentType: "school_quality", questionCount: 12, timeLimitMinutes: 20, isAdaptive: false, isPublic: false },
  ]);

  // ─── Subscription Plans ─────────────────────────────────────────────
  await db.insert(subscriptionPlans).values([
    { name: "Deep Report", code: "deep_report", amount: "3000", interval: "one_time", credits: 1, features: ["Deep Report PDF", "Personalized recommendations", "Concept diagnostics"], isActive: true },
    { name: "Parent Bundle", code: "parent_bundle", amount: "10000", interval: "one_time", credits: 5, features: ["5 Deep Reports", "Track children's progress"], isActive: true },
    { name: "School Term", code: "school_term", amount: "150000", interval: "term", credits: 999999, features: ["Unlimited deep reports", "Teacher assessments", "School quality assessment", "All reports", "Admin dashboard"], isActive: true },
  ]);

  // ─── Terminal Readiness Question Banks ────────────────────────────────
  const bankData = await db.insert(questionBanks).values([
    { level: "primary_to_jss1", title: "Primary 6 → JSS1 Readiness", description: "Assesses readiness for secondary school transition", displayOrder: 1 },
    { level: "jss3_to_ss1", title: "JSS3 → SS1 Readiness", description: "Assesses readiness for senior secondary education", displayOrder: 2 },
    { level: "ss3_to_university", title: "SS3 → University Readiness", description: "Assesses readiness for tertiary education", displayOrder: 3 },
  ]).returning();
  console.log(`✓ ${bankData.length} question banks created`);

  // Bank section configs
  await db.insert(questionBankConfigs).values([
    { bankId: bankData[0].id, sectionName: "Numeracy", questionCount: 30, timeLimitMinutes: 30, displayOrder: 1 },
    { bankId: bankData[0].id, sectionName: "Literacy", questionCount: 20, timeLimitMinutes: 20, displayOrder: 2 },
    { bankId: bankData[0].id, sectionName: "Critical Thinking", questionCount: 15, timeLimitMinutes: 20, displayOrder: 3 },
    { bankId: bankData[1].id, sectionName: "Mathematics", questionCount: 30, timeLimitMinutes: 35, displayOrder: 1 },
    { bankId: bankData[1].id, sectionName: "English", questionCount: 20, timeLimitMinutes: 20, displayOrder: 2 },
    { bankId: bankData[1].id, sectionName: "Critical Thinking", questionCount: 15, timeLimitMinutes: 20, displayOrder: 3 },
    { bankId: bankData[2].id, sectionName: "Advanced Mathematics", questionCount: 25, timeLimitMinutes: 35, displayOrder: 1 },
    { bankId: bankData[2].id, sectionName: "Critical Literacy", questionCount: 20, timeLimitMinutes: 25, displayOrder: 2 },
    { bankId: bankData[2].id, sectionName: "Reasoning & Readiness", questionCount: 15, timeLimitMinutes: 20, displayOrder: 3 },
  ]);
  console.log("✓ Bank section configs created");

  // Helper: batch insert questions with options
  async function seedBank(bankId: string, qList: any[]) {
    const batchSize = 25;
    let count = 0;
    for (let i = 0; i < qList.length; i += batchSize) {
      const batch = qList.slice(i, i + batchSize);
      const qRecords: any[] = batch.map((q: any) => ({
        bankId,
        code: q.code,
        questionText: q.questionText,
        questionType: q.questionType || "multiple_choice",
        rendererType: q.rendererType || "standard",
        concept: q.concept || "",
        difficultyLevel: q.difficultyLevel || "medium",
        bloomLevel: q.bloomLevel || "understand",
        expectedTimeSecs: q.expectedTimeSecs || 60,
        allowsCalculator: q.allowsCalculator || false,
        passageText: q.passageText || null,
        chartData: q.chartData ? JSON.parse(JSON.stringify(q.chartData)) : null,
        geometryData: q.geometryData ? JSON.parse(JSON.stringify(q.geometryData)) : null,
        interactiveData: q.interactiveData ? JSON.parse(JSON.stringify(q.interactiveData)) : null,
        explanation: q.explanation || "",
        assessmentType: "academic",
        status: "approved",
        isActive: true,
      }));
      const inserted = await db.insert(questionsTable).values(qRecords).returning();
      const optionRecords: any[] = [];
      for (let j = 0; j < batch.length; j++) {
        if (batch[j].options) {
          batch[j].options.forEach((opt: any, oi: number) => {
            optionRecords.push({
              questionId: inserted[j].id,
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
              optionOrder: opt.optionOrder || oi + 1,
            });
          });
        }
      }
      if (optionRecords.length > 0) {
        await db.insert(questionOptions).values(optionRecords);
      }
      count += batch.length;
    }
    return count;
  }

  const primaryCount = await seedBank(bankData[0].id, primaryToJss1Questions);
  console.log(`✓ ${primaryCount} Primary→JSS1 questions seeded`);

  const jss3Count = await seedBank(bankData[1].id, jss3ToSs1Questions);
  console.log(`✓ ${jss3Count} JSS3→SS1 questions seeded`);

  const ss3Count = await seedBank(bankData[2].id, ss3ToUniversityQuestions);
  console.log(`✓ ${ss3Count} SS3→University questions seeded`);

  // ─── Terminal Assessment Configs ─────────────────────────────────────
  await db.insert(assessmentConfigs).values([
    { title: "Primary 6 → JSS1 Readiness Assessment", assessmentType: "academic", questionCount: 65, timeLimitMinutes: 70, isAdaptive: false, isPublic: true },
    { title: "JSS3 → SS1 Readiness Assessment", assessmentType: "academic", questionCount: 65, timeLimitMinutes: 75, isAdaptive: false, isPublic: true },
    { title: "SS3 → University Readiness Assessment", assessmentType: "academic", questionCount: 60, timeLimitMinutes: 80, isAdaptive: false, isPublic: true },
  ]);
  console.log("✓ Terminal assessment configs created");

  console.log("\n✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
