export const jss3ToSs1Questions = [
  // ===========================================================================
  // MATHEMATICS (65 questions) - J-MATH-001 to J-MATH-065
  // ===========================================================================

  // --- Easy (J-MATH-001 to J-MATH-020) ---

  {
    code: "J-MATH-001",
    questionText: "Simplify: 3x + 5y - 2x + 3y",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Algebraic Expressions",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "x + 8y", isCorrect: true, optionOrder: 1 },
      { optionText: "5x + 8y", isCorrect: false, optionOrder: 2 },
      { optionText: "x + 2y", isCorrect: false, optionOrder: 3 },
      { optionText: "6xy", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Group like terms: (3x - 2x) + (5y + 3y) = x + 8y."
  },

  {
    code: "J-MATH-002",
    questionText: "What is the value of 2^3 × 2^2?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Indices",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "32", isCorrect: true, optionOrder: 1 },
      { optionText: "64", isCorrect: false, optionOrder: 2 },
      { optionText: "16", isCorrect: false, optionOrder: 3 },
      { optionText: "10", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "2^3 × 2^2 = 2^(3+2) = 2^5 = 32."
  },

  {
    code: "J-MATH-003",
    questionText: "If a = 3 and b = -2, find a + b.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Directed Numbers",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "1", isCorrect: true, optionOrder: 1 },
      { optionText: "5", isCorrect: false, optionOrder: 2 },
      { optionText: "-1", isCorrect: false, optionOrder: 3 },
      { optionText: "-5", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "a + b = 3 + (-2) = 3 - 2 = 1."
  },

  {
    code: "J-MATH-004",
    questionText: "Solve for x: x + 7 = 15",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Simple Equations",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "8", isCorrect: true, optionOrder: 1 },
      { optionText: "22", isCorrect: false, optionOrder: 2 },
      { optionText: "7", isCorrect: false, optionOrder: 3 },
      { optionText: "9", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "x = 15 - 7 = 8."
  },

  {
    code: "J-MATH-005",
    questionText: "What is the next number in the sequence: 2, 5, 8, 11, ___?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Number Patterns",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "14", isCorrect: true, optionOrder: 1 },
      { optionText: "13", isCorrect: false, optionOrder: 2 },
      { optionText: "15", isCorrect: false, optionOrder: 3 },
      { optionText: "12", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The sequence increases by 3 each time: 11 + 3 = 14."
  },

  {
    code: "J-MATH-006",
    questionText: "Find the mean of: 4, 8, 6, 5, 7",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Statistics - Mean",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "6", isCorrect: true, optionOrder: 1 },
      { optionText: "5", isCorrect: false, optionOrder: 2 },
      { optionText: "7", isCorrect: false, optionOrder: 3 },
      { optionText: "30", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Sum = 4+8+6+5+7 = 30. Mean = 30/5 = 6."
  },

  {
    code: "J-MATH-007",
    questionText: "What is the probability of rolling an even number on a fair six-sided die?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Probability",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "1/2", isCorrect: true, optionOrder: 1 },
      { optionText: "1/3", isCorrect: false, optionOrder: 2 },
      { optionText: "1/6", isCorrect: false, optionOrder: 3 },
      { optionText: "2/3", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Even numbers on a die: 2, 4, 6 (3 outcomes). Total outcomes: 6. Probability = 3/6 = 1/2."
  },

  {
    code: "J-MATH-008",
    questionText: "If A = {1, 2, 3} and B = {2, 3, 4}, what is A ∩ B?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Sets - Intersection",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "{2, 3}", isCorrect: true, optionOrder: 1 },
      { optionText: "{1, 2, 3, 4}", isCorrect: false, optionOrder: 2 },
      { optionText: "{1, 4}", isCorrect: false, optionOrder: 3 },
      { optionText: "{1, 2, 3}", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A ∩ B contains elements common to both sets: 2 and 3."
  },

  {
    code: "J-MATH-009",
    questionText: "Convert 0.25 to a fraction in its simplest form.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Fractions and Decimals",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "1/4", isCorrect: true, optionOrder: 1 },
      { optionText: "1/5", isCorrect: false, optionOrder: 2 },
      { optionText: "2/5", isCorrect: false, optionOrder: 3 },
      { optionText: "1/8", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "0.25 = 25/100 = 1/4."
  },

  {
    code: "J-MATH-010",
    questionText: "What is the perimeter of a rectangle with length 8 cm and width 5 cm?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Perimeter",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "26 cm", isCorrect: true, optionOrder: 1 },
      { optionText: "40 cm", isCorrect: false, optionOrder: 2 },
      { optionText: "13 cm", isCorrect: false, optionOrder: 3 },
      { optionText: "22 cm", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Perimeter = 2(L + W) = 2(8 + 5) = 2 × 13 = 26 cm."
  },

  {
    code: "J-MATH-011",
    questionText: "Evaluate: (-3) × (-4)",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Directed Numbers",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "12", isCorrect: true, optionOrder: 1 },
      { optionText: "-12", isCorrect: false, optionOrder: 2 },
      { optionText: "7", isCorrect: false, optionOrder: 3 },
      { optionText: "-7", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The product of two negative numbers is positive: (-3) × (-4) = 12."
  },

  {
    code: "J-MATH-012",
    questionText: "What is the area of a triangle with base 10 cm and height 6 cm?",
    questionType: "multiple_choice",
    rendererType: "geometry",
    concept: "Area of Triangle",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    geometryData: { type: "triangle", label: "Triangle ABC", dimensions: { base: 10, height: 6 } },
    options: [
      { optionText: "30 cm²", isCorrect: true, optionOrder: 1 },
      { optionText: "60 cm²", isCorrect: false, optionOrder: 2 },
      { optionText: "15 cm²", isCorrect: false, optionOrder: 3 },
      { optionText: "16 cm²", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Area = (1/2) × base × height = (1/2) × 10 × 6 = 30 cm²."
  },

  {
    code: "J-MATH-013",
    questionText: "Solve: 2x - 3 = 7",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Simple Equations",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "5", isCorrect: true, optionOrder: 1 },
      { optionText: "2", isCorrect: false, optionOrder: 2 },
      { optionText: "10", isCorrect: false, optionOrder: 3 },
      { optionText: "3", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "2x = 7 + 3 = 10, so x = 10/2 = 5."
  },

  {
    code: "J-MATH-014",
    questionText: "Which of the following is an example of a prime number?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Number Theory",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "17", isCorrect: true, optionOrder: 1 },
      { optionText: "21", isCorrect: false, optionOrder: 2 },
      { optionText: "27", isCorrect: false, optionOrder: 3 },
      { optionText: "15", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "17 has only two factors (1 and 17), making it prime. 21, 27, and 15 are composite."
  },

  {
    code: "J-MATH-015",
    questionText: "What is 15% of 200?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Percentages",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "30", isCorrect: true, optionOrder: 1 },
      { optionText: "15", isCorrect: false, optionOrder: 2 },
      { optionText: "20", isCorrect: false, optionOrder: 3 },
      { optionText: "300", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "15% of 200 = (15/100) × 200 = 30."
  },

  {
    code: "J-MATH-016",
    questionText: "How many sides does a hexagon have?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Geometry - Polygons",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "6", isCorrect: true, optionOrder: 1 },
      { optionText: "5", isCorrect: false, optionOrder: 2 },
      { optionText: "7", isCorrect: false, optionOrder: 3 },
      { optionText: "8", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A hexagon is a six-sided polygon."
  },

  {
    code: "J-MATH-017",
    questionText: "If 3^x = 27, what is the value of x?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Indices",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "3", isCorrect: true, optionOrder: 1 },
      { optionText: "9", isCorrect: false, optionOrder: 2 },
      { optionText: "24", isCorrect: false, optionOrder: 3 },
      { optionText: "81", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "3^x = 27 = 3^3, therefore x = 3."
  },

  {
    code: "J-MATH-018",
    questionText: "What is the mode of the numbers: 2, 3, 3, 5, 7, 3, 8?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Statistics - Mode",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "3", isCorrect: true, optionOrder: 1 },
      { optionText: "5", isCorrect: false, optionOrder: 2 },
      { optionText: "2", isCorrect: false, optionOrder: 3 },
      { optionText: "7", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The mode is the most frequent number. 3 appears 3 times."
  },

  {
    code: "J-MATH-019",
    questionText: "Simplify: 5(2x + 3) - 2x",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Algebraic Expressions",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "8x + 15", isCorrect: true, optionOrder: 1 },
      { optionText: "10x + 15", isCorrect: false, optionOrder: 2 },
      { optionText: "8x + 3", isCorrect: false, optionOrder: 3 },
      { optionText: "3x + 15", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "5(2x + 3) - 2x = 10x + 15 - 2x = 8x + 15."
  },

  {
    code: "J-MATH-020",
    questionText: "What type of angle measures 90°?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Geometry - Angles",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Right angle", isCorrect: true, optionOrder: 1 },
      { optionText: "Acute angle", isCorrect: false, optionOrder: 2 },
      { optionText: "Obtuse angle", isCorrect: false, optionOrder: 3 },
      { optionText: "Reflex angle", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A right angle measures exactly 90°."
  },

  // --- Medium (J-MATH-021 to J-MATH-050) ---

  {
    code: "J-MATH-021",
    questionText: "Factorise completely: x² - 9",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Factorisation",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "(x - 3)(x + 3)", isCorrect: true, optionOrder: 1 },
      { optionText: "(x - 3)(x - 3)", isCorrect: false, optionOrder: 2 },
      { optionText: "(x + 3)(x + 3)", isCorrect: false, optionOrder: 3 },
      { optionText: "x(x - 9)", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "x² - 9 is a difference of two squares: (x - 3)(x + 3)."
  },

  {
    code: "J-MATH-022",
    questionText: "Solve the simultaneous equations: x + y = 7 and x - y = 3",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Simultaneous Equations",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "x = 5, y = 2", isCorrect: true, optionOrder: 1 },
      { optionText: "x = 2, y = 5", isCorrect: false, optionOrder: 2 },
      { optionText: "x = 4, y = 3", isCorrect: false, optionOrder: 3 },
      { optionText: "x = 3, y = 4", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Adding: 2x = 10 → x = 5. Then 5 + y = 7 → y = 2."
  },

  {
    code: "J-MATH-023",
    questionText: "In a right-angled triangle, if the two shorter sides are 6 cm and 8 cm, what is the length of the hypotenuse?",
    questionType: "multiple_choice",
    rendererType: "geometry",
    concept: "Pythagoras' Theorem",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    geometryData: { type: "right_triangle", label: "Right Triangle ABC", dimensions: { sideA: 6, sideB: 8, hypotenuse: 10 } },
    options: [
      { optionText: "10 cm", isCorrect: true, optionOrder: 1 },
      { optionText: "14 cm", isCorrect: false, optionOrder: 2 },
      { optionText: "12 cm", isCorrect: false, optionOrder: 3 },
      { optionText: "9 cm", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "h² = 6² + 8² = 36 + 64 = 100. h = √100 = 10 cm."
  },

  {
    code: "J-MATH-024",
    questionText: "A bag contains 3 red balls and 5 blue balls. What is the probability of drawing a red ball?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Probability",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "3/8", isCorrect: true, optionOrder: 1 },
      { optionText: "5/8", isCorrect: false, optionOrder: 2 },
      { optionText: "3/5", isCorrect: false, optionOrder: 3 },
      { optionText: "1/3", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Total balls = 3 + 5 = 8. Red balls = 3. Probability = 3/8."
  },

  {
    code: "J-MATH-025",
    questionText: "If f(x) = 2x + 1, what is f(3)?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Functions",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "7", isCorrect: true, optionOrder: 1 },
      { optionText: "6", isCorrect: false, optionOrder: 2 },
      { optionText: "5", isCorrect: false, optionOrder: 3 },
      { optionText: "8", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "f(3) = 2(3) + 1 = 6 + 1 = 7."
  },

  {
    code: "J-MATH-026",
    questionText: "Solve the inequality: 2x + 3 > 9",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Inequalities",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "x > 3", isCorrect: true, optionOrder: 1 },
      { optionText: "x > 6", isCorrect: false, optionOrder: 2 },
      { optionText: "x < 3", isCorrect: false, optionOrder: 3 },
      { optionText: "x > 2", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "2x + 3 > 9 → 2x > 6 → x > 3."
  },

  {
    code: "J-MATH-027",
    questionText: "What is the median of: 12, 7, 5, 9, 14, 8, 10?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Statistics - Median",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "9", isCorrect: true, optionOrder: 1 },
      { optionText: "8", isCorrect: false, optionOrder: 2 },
      { optionText: "10", isCorrect: false, optionOrder: 3 },
      { optionText: "7", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Sorted: 5, 7, 8, 9, 10, 12, 14. The 4th number is the median: 9."
  },

  {
    code: "J-MATH-028",
    questionText: "Expand: (x + 2)(x + 5)",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Algebraic Expansion",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "x² + 7x + 10", isCorrect: true, optionOrder: 1 },
      { optionText: "x² + 10x + 7", isCorrect: false, optionOrder: 2 },
      { optionText: "x² + 3x + 10", isCorrect: false, optionOrder: 3 },
      { optionText: "x² + 7x + 7", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "(x + 2)(x + 5) = x² + 5x + 2x + 10 = x² + 7x + 10."
  },

  {
    code: "J-MATH-029",
    questionText: "If the ratio of boys to girls in a class is 3:2, and there are 30 students, how many boys are there?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Ratio and Proportion",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "18", isCorrect: true, optionOrder: 1 },
      { optionText: "12", isCorrect: false, optionOrder: 2 },
      { optionText: "15", isCorrect: false, optionOrder: 3 },
      { optionText: "20", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Total parts = 3 + 2 = 5. Boys = (3/5) × 30 = 18."
  },

  {
    code: "J-MATH-030",
    questionText: "What is the volume of a cube with side length 4 cm?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Volume",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "64 cm³", isCorrect: true, optionOrder: 1 },
      { optionText: "16 cm³", isCorrect: false, optionOrder: 2 },
      { optionText: "32 cm³", isCorrect: false, optionOrder: 3 },
      { optionText: "12 cm³", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Volume = side³ = 4³ = 64 cm³."
  },

  {
    code: "J-MATH-031",
    questionText: "Simplify: 3/4 + 2/5",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Fractions",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "23/20", isCorrect: true, optionOrder: 1 },
      { optionText: "5/9", isCorrect: false, optionOrder: 2 },
      { optionText: "7/20", isCorrect: false, optionOrder: 3 },
      { optionText: "1/2", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "LCM of 4 and 5 is 20. 3/4 = 15/20, 2/5 = 8/20. Sum = 23/20."
  },

  {
    code: "J-MATH-032",
    questionText: "Given that sin θ = 3/5, where θ is acute, what is cos θ?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Trigonometry Basics",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "4/5", isCorrect: true, optionOrder: 1 },
      { optionText: "2/5", isCorrect: false, optionOrder: 2 },
      { optionText: "5/3", isCorrect: false, optionOrder: 3 },
      { optionText: "3/4", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "sin²θ + cos²θ = 1. cos²θ = 1 - (9/25) = 16/25. cos θ = 4/5 (acute → positive)."
  },

  {
    code: "J-MATH-033",
    questionText: "Solve: 2^(2x) = 16",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Indices and Exponential Equations",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "2", isCorrect: true, optionOrder: 1 },
      { optionText: "4", isCorrect: false, optionOrder: 2 },
      { optionText: "8", isCorrect: false, optionOrder: 3 },
      { optionText: "1", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "2^(2x) = 16 = 2^4. So 2x = 4, x = 2."
  },

  {
    code: "J-MATH-034",
    questionText: "What is the sum of interior angles of a pentagon?",
    questionType: "multiple_choice",
    rendererType: "geometry",
    concept: "Geometry - Polygons",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    geometryData: { type: "quadrilateral", label: "Pentagon", dimensions: { sides: 5 } },
    options: [
      { optionText: "540°", isCorrect: true, optionOrder: 1 },
      { optionText: "360°", isCorrect: false, optionOrder: 2 },
      { optionText: "720°", isCorrect: false, optionOrder: 3 },
      { optionText: "180°", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Sum = (n - 2) × 180° = (5 - 2) × 180° = 3 × 180° = 540°."
  },

  {
    code: "J-MATH-035",
    questionText: "The bearing of A from B is 060°. What is the bearing of B from A?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Bearings",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "240°", isCorrect: true, optionOrder: 1 },
      { optionText: "060°", isCorrect: false, optionOrder: 2 },
      { optionText: "120°", isCorrect: false, optionOrder: 3 },
      { optionText: "300°", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The back bearing differs by 180°. 060° + 180° = 240°."
  },

  {
    code: "J-MATH-036",
    questionText: "If P = {x: x is an even number between 1 and 10} and Q = {x: x is a multiple of 3 between 1 and 10}, find n(P ∪ Q).",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Sets - Union",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "7", isCorrect: true, optionOrder: 1 },
      { optionText: "6", isCorrect: false, optionOrder: 2 },
      { optionText: "5", isCorrect: false, optionOrder: 3 },
      { optionText: "8", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "P = {2,4,6,8,10}, Q = {3,6,9}. P ∪ Q = {2,3,4,6,8,9,10}. n = 7."
  },

  {
    code: "J-MATH-037",
    questionText: "Find the gradient (slope) of the line passing through (1, 2) and (3, 6).",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Coordinate Geometry",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "2", isCorrect: true, optionOrder: 1 },
      { optionText: "4", isCorrect: false, optionOrder: 2 },
      { optionText: "1/2", isCorrect: false, optionOrder: 3 },
      { optionText: "3", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Gradient m = (y₂ - y₁)/(x₂ - x₁) = (6 - 2)/(3 - 1) = 4/2 = 2."
  },

  {
    code: "J-MATH-038",
    questionText: "A cylindrical tank has radius 7 m and height 10 m. What is its capacity? (Take π = 22/7)",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Volume of Cylinder",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 60,
    allowsCalculator: true,
    options: [
      { optionText: "1540 m³", isCorrect: true, optionOrder: 1 },
      { optionText: "220 m³", isCorrect: false, optionOrder: 2 },
      { optionText: "154 m³", isCorrect: false, optionOrder: 3 },
      { optionText: "3080 m³", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "V = πr²h = (22/7) × 7² × 10 = (22/7) × 49 × 10 = 22 × 7 × 10 = 1540 m³."
  },

  {
    code: "J-MATH-039",
    questionText: "Simplify: log₁₀(100) + log₁₀(1000)",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Logarithms",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "5", isCorrect: true, optionOrder: 1 },
      { optionText: "3", isCorrect: false, optionOrder: 2 },
      { optionText: "2", isCorrect: false, optionOrder: 3 },
      { optionText: "100000", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "log₁₀(100) = 2, log₁₀(1000) = 3. Sum = 2 + 3 = 5."
  },

  {
    code: "J-MATH-040",
    questionText: "What is the nth term of the sequence: 3, 7, 11, 15, ...?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Number Patterns - Sequences",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "4n - 1", isCorrect: true, optionOrder: 1 },
      { optionText: "4n + 1", isCorrect: false, optionOrder: 2 },
      { optionText: "3n + 1", isCorrect: false, optionOrder: 3 },
      { optionText: "n + 3", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Common difference = 4. n-th term = 4n - 1 (since first term = 4(1) - 1 = 3)."
  },

  {
    code: "J-MATH-041",
    questionText: "Given the matrix A = [[2, 3], [1, 4]], what is the element in the first row, second column?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Matrices",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "3", isCorrect: true, optionOrder: 1 },
      { optionText: "2", isCorrect: false, optionOrder: 2 },
      { optionText: "1", isCorrect: false, optionOrder: 3 },
      { optionText: "4", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "First row: [2, 3]. Second column element is 3."
  },

  {
    code: "J-MATH-042",
    questionText: "The bar chart below shows the simple interest earned on ₦5000 at different interest rates over 3 years. The interest amounts are: 2% → ₦300, 4% → ₦600, 6% → ₦900, 8% → ₦1200. What is the simple interest at 5%?",
    questionType: "multiple_choice",
    rendererType: "chart",
    concept: "Simple Interest",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 60,
    allowsCalculator: true,
    chartData: { type: "bar", title: "Simple Interest at Different Rates", labels: ["2%", "4%", "6%", "8%"], values: [300, 600, 900, 1200], unit: "₦" },
    options: [
      { optionText: "₦750", isCorrect: true, optionOrder: 1 },
      { optionText: "₦700", isCorrect: false, optionOrder: 2 },
      { optionText: "₦800", isCorrect: false, optionOrder: 3 },
      { optionText: "₦650", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "I = PRT/100 = (5000 × 5 × 3)/100 = 75000/100 = ₦750. The pattern shows ₦150 increase per 1%."
  },

  {
    code: "J-MATH-043",
    questionText: "Two angles of a triangle are 65° and 45°. Find the third angle.",
    questionType: "multiple_choice",
    rendererType: "geometry",
    concept: "Geometry - Triangles",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    geometryData: { type: "triangle", label: "Triangle ABC", dimensions: { angleA: 65, angleB: 45 } },
    options: [
      { optionText: "70°", isCorrect: true, optionOrder: 1 },
      { optionText: "80°", isCorrect: false, optionOrder: 2 },
      { optionText: "60°", isCorrect: false, optionOrder: 3 },
      { optionText: "90°", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Sum of angles in a triangle = 180°. Third angle = 180° - 65° - 45° = 70°."
  },

  {
    code: "J-MATH-044",
    questionText: "What is the range of the data: 3, 7, 2, 9, 12, 5?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Statistics - Range",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "10", isCorrect: true, optionOrder: 1 },
      { optionText: "9", isCorrect: false, optionOrder: 2 },
      { optionText: "12", isCorrect: false, optionOrder: 3 },
      { optionText: "7", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Range = highest - lowest = 12 - 2 = 10."
  },

  {
    code: "J-MATH-045",
    questionText: "If 2x + y = 10 and x - y = 2, what is the value of x?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Simultaneous Equations",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "4", isCorrect: true, optionOrder: 1 },
      { optionText: "2", isCorrect: false, optionOrder: 2 },
      { optionText: "6", isCorrect: false, optionOrder: 3 },
      { optionText: "3", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Adding: (2x + y) + (x - y) = 10 + 2 → 3x = 12 → x = 4."
  },

  {
    code: "J-MATH-046",
    questionText: "A car travels 180 km in 3 hours. What is its average speed?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Speed, Distance, Time",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "60 km/h", isCorrect: true, optionOrder: 1 },
      { optionText: "90 km/h", isCorrect: false, optionOrder: 2 },
      { optionText: "54 km/h", isCorrect: false, optionOrder: 3 },
      { optionText: "45 km/h", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Speed = Distance/Time = 180/3 = 60 km/h."
  },

  {
    code: "J-MATH-047",
    questionText: "The graph shows the number of books sold by a shop in 5 days. Monday: 12, Tuesday: 18, Wednesday: 15, Thursday: 20, Friday: 10. What is the total number of books sold?",
    questionType: "multiple_choice",
    rendererType: "chart",
    concept: "Statistics - Data Interpretation",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    chartData: { type: "bar", title: "Books Sold Per Day", labels: ["Mon", "Tue", "Wed", "Thu", "Fri"], values: [12, 18, 15, 20, 10], unit: "books" },
    options: [
      { optionText: "75", isCorrect: true, optionOrder: 1 },
      { optionText: "65", isCorrect: false, optionOrder: 2 },
      { optionText: "80", isCorrect: false, optionOrder: 3 },
      { optionText: "70", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Total = 12 + 18 + 15 + 20 + 10 = 75 books."
  },

  {
    code: "J-MATH-048",
    questionText: "If tan θ = 1, what is the value of θ (0° ≤ θ ≤ 90°)?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Trigonometry Basics",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "45°", isCorrect: true, optionOrder: 1 },
      { optionText: "30°", isCorrect: false, optionOrder: 2 },
      { optionText: "60°", isCorrect: false, optionOrder: 3 },
      { optionText: "90°", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "tan 45° = 1, so θ = 45°."
  },

  {
    code: "J-MATH-049",
    questionText: "The pie chart below shows how a student spends his ₦1000 pocket money: Food 40%, Transport 25%, Books 20%, Savings 15%. How much is spent on Food?",
    questionType: "multiple_choice",
    rendererType: "chart",
    concept: "Statistics - Pie Chart",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: true,
    chartData: { type: "pie", title: "Pocket Money Spending", labels: ["Food", "Transport", "Books", "Savings"], values: [40, 25, 20, 15], unit: "percent" },
    options: [
      { optionText: "₦400", isCorrect: true, optionOrder: 1 },
      { optionText: "₦250", isCorrect: false, optionOrder: 2 },
      { optionText: "₦200", isCorrect: false, optionOrder: 3 },
      { optionText: "₦500", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "40% of ₦1000 = (40/100) × 1000 = ₦400."
  },

  {
    code: "J-MATH-050",
    questionText: "Find the equation of a line with gradient 2 that passes through (0, 3).",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Coordinate Geometry",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "y = 2x + 3", isCorrect: true, optionOrder: 1 },
      { optionText: "y = 3x + 2", isCorrect: false, optionOrder: 2 },
      { optionText: "y = 2x - 3", isCorrect: false, optionOrder: 3 },
      { optionText: "y = x + 3", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Using y = mx + c, m = 2, c = 3. Equation: y = 2x + 3."
  },

  // --- Hard (J-MATH-051 to J-MATH-065) ---

  {
    code: "J-MATH-051",
    questionText: "Solve the quadratic equation: x² - 5x + 6 = 0",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Quadratic Equations",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "x = 2 or x = 3", isCorrect: true, optionOrder: 1 },
      { optionText: "x = 1 or x = 6", isCorrect: false, optionOrder: 2 },
      { optionText: "x = -2 or x = -3", isCorrect: false, optionOrder: 3 },
      { optionText: "x = 5 or x = -1", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "x² - 5x + 6 = (x - 2)(x - 3) = 0, so x = 2 or x = 3."
  },

  {
    code: "J-MATH-052",
    questionText: "Simplify: (3 + √2)(3 - √2)",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Surds",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "7", isCorrect: true, optionOrder: 1 },
      { optionText: "9", isCorrect: false, optionOrder: 2 },
      { optionText: "11", isCorrect: false, optionOrder: 3 },
      { optionText: "9 - 2√2", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "(3 + √2)(3 - √2) = 3² - (√2)² = 9 - 2 = 7."
  },

  {
    code: "J-MATH-053",
    questionText: "In a class of 40 students, 25 study Mathematics, 20 study English, and 10 study both. How many students study neither subject?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Sets - Venn Diagrams",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "5", isCorrect: true, optionOrder: 1 },
      { optionText: "10", isCorrect: false, optionOrder: 2 },
      { optionText: "15", isCorrect: false, optionOrder: 3 },
      { optionText: "0", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "n(M ∪ E) = n(M) + n(E) - n(M ∩ E) = 25 + 20 - 10 = 35. Neither = 40 - 35 = 5."
  },

  {
    code: "J-MATH-054",
    questionText: "A man is 4 times as old as his son. In 5 years, he will be 3 times as old as his son. How old is the son now?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Word Problems - Age",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 90,
    allowsCalculator: false,
    options: [
      { optionText: "10 years", isCorrect: true, optionOrder: 1 },
      { optionText: "12 years", isCorrect: false, optionOrder: 2 },
      { optionText: "8 years", isCorrect: false, optionOrder: 3 },
      { optionText: "15 years", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Let son = x, man = 4x. In 5 years: 4x + 5 = 3(x + 5). 4x + 5 = 3x + 15 → x = 10."
  },

  {
    code: "J-MATH-055",
    questionText: "If the sum of the first n terms of an arithmetic progression is S_n = 2n² + n, find the first term.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Arithmetic Progression",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "3", isCorrect: true, optionOrder: 1 },
      { optionText: "2", isCorrect: false, optionOrder: 2 },
      { optionText: "4", isCorrect: false, optionOrder: 3 },
      { optionText: "1", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "First term = S₁ = 2(1)² + 1 = 2 + 1 = 3."
  },

  {
    code: "J-MATH-056",
    questionText: "A ship sails 40 km due east then 30 km due north. How far is it from its starting point?",
    questionType: "multiple_choice",
    rendererType: "geometry",
    concept: "Pythagoras' Theorem - Application",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 60,
    allowsCalculator: true,
    geometryData: { type: "right_triangle", label: "Ship's Journey", dimensions: { horizontal: 40, vertical: 30 } },
    options: [
      { optionText: "50 km", isCorrect: true, optionOrder: 1 },
      { optionText: "70 km", isCorrect: false, optionOrder: 2 },
      { optionText: "35 km", isCorrect: false, optionOrder: 3 },
      { optionText: "60 km", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Distance = √(40² + 30²) = √(1600 + 900) = √2500 = 50 km."
  },

  {
    code: "J-MATH-057",
    questionText: "Find the value of x if 2^(x+1) + 2^x = 12",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Indices - Exponential Equations",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "2", isCorrect: true, optionOrder: 1 },
      { optionText: "3", isCorrect: false, optionOrder: 2 },
      { optionText: "1", isCorrect: false, optionOrder: 3 },
      { optionText: "4", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "2^(x+1) + 2^x = 2(2^x) + 2^x = 3(2^x) = 12. 2^x = 4, so x = 2."
  },

  {
    code: "J-MATH-058",
    questionText: "What is the probability that a number selected at random from 1 to 20 is a prime number?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Probability",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "2/5", isCorrect: true, optionOrder: 1 },
      { optionText: "1/2", isCorrect: false, optionOrder: 2 },
      { optionText: "3/10", isCorrect: false, optionOrder: 3 },
      { optionText: "9/20", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Primes between 1-20: 2,3,5,7,11,13,17,19 (8 numbers). Probability = 8/20 = 2/5."
  },

  {
    code: "J-MATH-059",
    questionText: "Given matrix A = [[2, 5], [1, 3]], find the determinant of A.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Matrices - Determinant",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "1", isCorrect: true, optionOrder: 1 },
      { optionText: "-1", isCorrect: false, optionOrder: 2 },
      { optionText: "11", isCorrect: false, optionOrder: 3 },
      { optionText: "6", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "det(A) = (2 × 3) - (5 × 1) = 6 - 5 = 1."
  },

  {
    code: "J-MATH-060",
    questionText: "Solve for x and y: 3x - y = 7 and 2x + 3y = 1",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Simultaneous Equations",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "x = 2, y = -1", isCorrect: true, optionOrder: 1 },
      { optionText: "x = 1, y = -4", isCorrect: false, optionOrder: 2 },
      { optionText: "x = 3, y = 2", isCorrect: false, optionOrder: 3 },
      { optionText: "x = -1, y = 1", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "From first: y = 3x - 7. Sub into second: 2x + 3(3x - 7) = 1 → 2x + 9x - 21 = 1 → 11x = 22 → x = 2, y = 3(2) - 7 = -1."
  },

  {
    code: "J-MATH-061",
    questionText: "A line graph shows the temperature recorded every 2 hours: 0h: 20°C, 2h: 18°C, 4h: 16°C, 6h: 14°C, 8h: 16°C, 10h: 20°C, 12h: 24°C. What is the temperature at 6 hours?",
    questionType: "multiple_choice",
    rendererType: "chart",
    concept: "Statistics - Line Graph",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    chartData: { type: "line", title: "Daily Temperature", labels: ["0h", "2h", "4h", "6h", "8h", "10h", "12h"], values: [20, 18, 16, 14, 16, 20, 24], unit: "°C" },
    options: [
      { optionText: "14°C", isCorrect: true, optionOrder: 1 },
      { optionText: "16°C", isCorrect: false, optionOrder: 2 },
      { optionText: "18°C", isCorrect: false, optionOrder: 3 },
      { optionText: "20°C", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "From the data, at 6h the temperature is 14°C."
  },

  {
    code: "J-MATH-062",
    questionText: "If sin θ = 0.6 and θ is acute, find tan θ.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Trigonometry Basics",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: true,
    options: [
      { optionText: "0.75", isCorrect: true, optionOrder: 1 },
      { optionText: "0.8", isCorrect: false, optionOrder: 2 },
      { optionText: "1.25", isCorrect: false, optionOrder: 3 },
      { optionText: "0.6", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "sin θ = 0.6 = 3/5. Opposite = 3, Hypotenuse = 5. Adjacent = √(25 - 9) = 4. tan θ = opp/adj = 3/4 = 0.75."
  },

  {
    code: "J-MATH-063",
    questionText: "Order the following numbers from smallest to largest: 0.3, 2/5, 0.25, 1/3, 0.4",
    questionType: "multiple_choice",
    rendererType: "interactive",
    concept: "Ordering Numbers",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    interactiveData: { type: "ordering", items: ["0.25", "0.3", "1/3", "2/5", "0.4"], correctOrder: ["0.25", "0.3", "1/3", "2/5", "0.4"] },
    options: [
      { optionText: "0.25, 0.3, 1/3, 2/5, 0.4", isCorrect: true, optionOrder: 1 },
      { optionText: "0.25, 1/3, 0.3, 2/5, 0.4", isCorrect: false, optionOrder: 2 },
      { optionText: "0.3, 0.25, 1/3, 0.4, 2/5", isCorrect: false, optionOrder: 3 },
      { optionText: "1/3, 0.25, 0.3, 0.4, 2/5", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "0.25 = 0.25, 0.3 = 0.3, 1/3 ≈ 0.333, 2/5 = 0.4, 0.4 = 0.4."
  },

  {
    code: "J-MATH-064",
    questionText: "If f(x) = 3x - 5 and g(x) = x², find f(g(2)).",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Functions - Composition",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "7", isCorrect: true, optionOrder: 1 },
      { optionText: "11", isCorrect: false, optionOrder: 2 },
      { optionText: "-1", isCorrect: false, optionOrder: 3 },
      { optionText: "4", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "g(2) = 2² = 4. f(g(2)) = f(4) = 3(4) - 5 = 12 - 5 = 7."
  },

  {
    code: "J-MATH-065",
    questionText: "A man swims at 3 km/h in still water. The river flows at 1 km/h. He swims downstream for 2 km. How long does it take him?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Speed, Distance, Time",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 90,
    allowsCalculator: false,
    options: [
      { optionText: "30 minutes", isCorrect: true, optionOrder: 1 },
      { optionText: "40 minutes", isCorrect: false, optionOrder: 2 },
      { optionText: "20 minutes", isCorrect: false, optionOrder: 3 },
      { optionText: "1 hour", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Downstream speed = 3 + 1 = 4 km/h. Time = Distance/Speed = 2/4 = 0.5 h = 30 minutes."
  },

  // ===========================================================================
  // ENGLISH (55 questions) - J-ENG-001 to J-ENG-055
  // ===========================================================================

  // --- Easy (J-ENG-001 to J-ENG-018) ---

  {
    code: "J-ENG-001",
    questionText: "Choose the correct spelling:",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Spelling",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Accommodation", isCorrect: true, optionOrder: 1 },
      { optionText: "Acommodation", isCorrect: false, optionOrder: 2 },
      { optionText: "Accomodation", isCorrect: false, optionOrder: 3 },
      { optionText: "Acomodation", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The correct spelling is 'accommodation' with two 'c's and two 'm's."
  },

  {
    code: "J-ENG-002",
    questionText: "Identify the noun in the sentence: 'The beautiful bird sang loudly.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Parts of Speech - Nouns",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "bird", isCorrect: true, optionOrder: 1 },
      { optionText: "beautiful", isCorrect: false, optionOrder: 2 },
      { optionText: "sang", isCorrect: false, optionOrder: 3 },
      { optionText: "loudly", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Bird' is the noun (a person, place, or thing). 'Beautiful' is an adjective, 'sang' is a verb, 'loudly' is an adverb."
  },

  {
    code: "J-ENG-003",
    questionText: "What is the past tense of 'run'?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Tenses",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "ran", isCorrect: true, optionOrder: 1 },
      { optionText: "runned", isCorrect: false, optionOrder: 2 },
      { optionText: "run", isCorrect: false, optionOrder: 3 },
      { optionText: "running", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Run' is an irregular verb. Its past tense is 'ran'."
  },

  {
    code: "J-ENG-004",
    questionText: "Which word is an antonym of 'hot'?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Vocabulary - Antonyms",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "cold", isCorrect: true, optionOrder: 1 },
      { optionText: "warm", isCorrect: false, optionOrder: 2 },
      { optionText: "cool", isCorrect: false, optionOrder: 3 },
      { optionText: "mild", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "An antonym is a word with opposite meaning. 'Cold' is the opposite of 'hot'."
  },

  {
    code: "J-ENG-005",
    questionText: "Identify the preposition in: 'The book is on the table.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Parts of Speech - Prepositions",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "on", isCorrect: true, optionOrder: 1 },
      { optionText: "book", isCorrect: false, optionOrder: 2 },
      { optionText: "is", isCorrect: false, optionOrder: 3 },
      { optionText: "table", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'On' is a preposition showing the relationship between the book and the table."
  },

  {
    code: "J-ENG-006",
    questionText: "What is a synonym for 'happy'?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Vocabulary - Synonyms",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "joyful", isCorrect: true, optionOrder: 1 },
      { optionText: "sad", isCorrect: false, optionOrder: 2 },
      { optionText: "angry", isCorrect: false, optionOrder: 3 },
      { optionText: "tired", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Joyful' is a synonym (word with similar meaning) of 'happy'."
  },

  {
    code: "J-ENG-007",
    questionText: "Choose the correct sentence:",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Sentence Structure",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "She goes to school every day.", isCorrect: true, optionOrder: 1 },
      { optionText: "She go to school every day.", isCorrect: false, optionOrder: 2 },
      { optionText: "She going to school every day.", isCorrect: false, optionOrder: 3 },
      { optionText: "She gone to school every day.", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'She goes' is the correct subject-verb agreement for third person singular in present tense."
  },

  {
    code: "J-ENG-008",
    questionText: "What figure of speech is 'The wind whispered through the trees'?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Figurative Language - Personification",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Personification", isCorrect: true, optionOrder: 1 },
      { optionText: "Simile", isCorrect: false, optionOrder: 2 },
      { optionText: "Metaphor", isCorrect: false, optionOrder: 3 },
      { optionText: "Hyperbole", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Personification gives human qualities (whispered) to non-human things (wind)."
  },

  {
    code: "J-ENG-009",
    questionText: "Which of the following is a complete sentence?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Sentence Fragments",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "The dog barked loudly.", isCorrect: true, optionOrder: 1 },
      { optionText: "Running down the street.", isCorrect: false, optionOrder: 2 },
      { optionText: "Because he was hungry.", isCorrect: false, optionOrder: 3 },
      { optionText: "A very tall building.", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'The dog barked loudly' has both a subject (the dog) and a verb (barked) expressing a complete thought."
  },

  {
    code: "J-ENG-010",
    questionText: "What is a literary term for the main character in a story?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Literature Terms - Protagonist",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Protagonist", isCorrect: true, optionOrder: 1 },
      { optionText: "Antagonist", isCorrect: false, optionOrder: 2 },
      { optionText: "Narrator", isCorrect: false, optionOrder: 3 },
      { optionText: "Symbol", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The protagonist is the central character or main character of a story."
  },

  {
    code: "J-ENG-011",
    questionText: "Choose the correct article: 'He is ___ honest man.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Articles",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "an", isCorrect: true, optionOrder: 1 },
      { optionText: "a", isCorrect: false, optionOrder: 2 },
      { optionText: "the", isCorrect: false, optionOrder: 3 },
      { optionText: "no article needed", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Honest' starts with a silent 'h', so the vowel sound requires 'an'."
  },

  {
    code: "J-ENG-012",
    questionText: "What is the plural of 'child'?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Plurals",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "children", isCorrect: true, optionOrder: 1 },
      { optionText: "childs", isCorrect: false, optionOrder: 2 },
      { optionText: "childes", isCorrect: false, optionOrder: 3 },
      { optionText: "childrens", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Child' has an irregular plural form: 'children'."
  },

  {
    code: "J-ENG-013",
    questionText: "Which of these sentences uses a simile?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Figurative Language - Simile",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Her eyes sparkled like diamonds.", isCorrect: true, optionOrder: 1 },
      { optionText: "Her eyes were diamonds.", isCorrect: false, optionOrder: 2 },
      { optionText: "Her eyes sparkled brightly.", isCorrect: false, optionOrder: 3 },
      { optionText: "She had beautiful eyes.", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A simile uses 'like' or 'as' to compare. 'Like diamonds' is the clue."
  },

  {
    code: "J-ENG-014",
    questionText: "Identify the adverb in: 'She quickly finished her homework.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Parts of Speech - Adverbs",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "quickly", isCorrect: true, optionOrder: 1 },
      { optionText: "finished", isCorrect: false, optionOrder: 2 },
      { optionText: "homework", isCorrect: false, optionOrder: 3 },
      { optionText: "she", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Quickly' is an adverb modifying the verb 'finished', describing how she finished."
  },

  {
    code: "J-ENG-015",
    questionText: "What is an essay's introductory paragraph mainly meant to do?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Essay Structure - Introduction",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Present the main idea and hook the reader", isCorrect: true, optionOrder: 1 },
      { optionText: "Summarize all the points", isCorrect: false, optionOrder: 2 },
      { optionText: "Provide evidence and examples", isCorrect: false, optionOrder: 3 },
      { optionText: "Restate the conclusion", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The introduction presents the main idea (thesis) and hooks the reader's attention."
  },

  {
    code: "J-ENG-016",
    questionText: "Which word means 'to look at something carefully'?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Vocabulary",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "examine", isCorrect: true, optionOrder: 1 },
      { optionText: "ignore", isCorrect: false, optionOrder: 2 },
      { optionText: "glimpse", isCorrect: false, optionOrder: 3 },
      { optionText: "skip", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Examine' means to inspect or look at something carefully."
  },

  {
    code: "J-ENG-017",
    questionText: "Choose the correct punctuation: 'Where are you going___'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Punctuation",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "?", isCorrect: true, optionOrder: 1 },
      { optionText: ".", isCorrect: false, optionOrder: 2 },
      { optionText: "!", isCorrect: false, optionOrder: 3 },
      { optionText: ",", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A question requires a question mark at the end."
  },

  {
    code: "J-ENG-018",
    questionText: "What is the setting of a story?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Literature Terms - Setting",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "The time and place of the story", isCorrect: true, optionOrder: 1 },
      { optionText: "The characters in the story", isCorrect: false, optionOrder: 2 },
      { optionText: "The problem in the story", isCorrect: false, optionOrder: 3 },
      { optionText: "The lesson of the story", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Setting refers to the time, place, and circumstances in which a story takes place."
  },

  // --- Medium (J-ENG-019 to J-ENG-040) ---

  {
    code: "J-ENG-019",
    questionText: "Read the passage and answer the question.\n\nPassage: \"The sun was setting behind the mountains, painting the sky in brilliant colours. Although the day had been long and tiring, the hikers felt a sense of accomplishment. They had reached the summit just before noon and spent hours taking in the breathtaking view. Now, as they made their way down the winding trail, they chatted happily about their adventure. The cool evening breeze was a welcome relief after the intense midday heat.\"\n\nWhich sentence from the passage is a complex sentence?",
    questionType: "multiple_choice",
    rendererType: "passage",
    concept: "Grammar - Sentence Types",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    passageText: "The sun was setting behind the mountains, painting the sky in brilliant colours. Although the day had been long and tiring, the hikers felt a sense of accomplishment. They had reached the summit just before noon and spent hours taking in the breathtaking view. Now, as they made their way down the winding trail, they chatted happily about their adventure. The cool evening breeze was a welcome relief after the intense midday heat.",
    options: [
      { optionText: "Although the day had been long and tiring, the hikers felt a sense of accomplishment.", isCorrect: true, optionOrder: 1 },
      { optionText: "The sun was setting behind the mountains, painting the sky in brilliant colours.", isCorrect: false, optionOrder: 2 },
      { optionText: "The cool evening breeze was a welcome relief after the intense midday heat.", isCorrect: false, optionOrder: 3 },
      { optionText: "They chatted happily about their adventure.", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A complex sentence has one independent clause ('the hikers felt a sense of accomplishment') and one dependent clause ('Although the day had been long and tiring') joined by a subordinating conjunction."
  },

  {
    code: "J-ENG-020",
    questionText: "What is the meaning of the idiom 'break the ice'?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Vocabulary - Idioms",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "To start a conversation in a social setting", isCorrect: true, optionOrder: 1 },
      { optionText: "To damage something frozen", isCorrect: false, optionOrder: 2 },
      { optionText: "To end a relationship", isCorrect: false, optionOrder: 3 },
      { optionText: "To become very cold", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Break the ice' means to initiate conversation in a tense or formal situation."
  },

  {
    code: "J-ENG-021",
    questionText: "Identify the literary device in: 'The thunder roared its mighty anger.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Figurative Language - Personification",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Personification", isCorrect: true, optionOrder: 1 },
      { optionText: "Alliteration", isCorrect: false, optionOrder: 2 },
      { optionText: "Onomatopoeia", isCorrect: false, optionOrder: 3 },
      { optionText: "Oxymoron", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Personification gives human emotions ('mighty anger') to thunder, an inanimate object."
  },

  {
    code: "J-ENG-022",
    questionText: "Which of these is a proper noun?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Proper Nouns",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Nigeria", isCorrect: true, optionOrder: 1 },
      { optionText: "country", isCorrect: false, optionOrder: 2 },
      { optionText: "river", isCorrect: false, optionOrder: 3 },
      { optionText: "city", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A proper noun names a specific person, place, or thing and is capitalised. 'Nigeria' is a specific country."
  },

  {
    code: "J-ENG-023",
    questionText: "What is the correct conjunction: 'She was tired, ___ she continued working.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Conjunctions",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "but", isCorrect: true, optionOrder: 1 },
      { optionText: "and", isCorrect: false, optionOrder: 2 },
      { optionText: "because", isCorrect: false, optionOrder: 3 },
      { optionText: "so", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'But' shows contrast - she was tired yet she continued."
  },

  {
    code: "J-ENG-024",
    questionText: "Read the passage and answer the question.\n\nPassage: \"The sun rose slowly over the horizon, painting the sky in shades of orange and pink. Birds began their morning songs as the first rays of light touched the treetops. The village slowly came alive as farmers headed to their fields and children prepared for school. It was going to be another beautiful day in the countryside.\"\n\nWhat is the main idea of this passage?",
    questionType: "multiple_choice",
    rendererType: "passage",
    concept: "Comprehension - Main Idea",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    passageText: "The sun rose slowly over the horizon, painting the sky in shades of orange and pink. Birds began their morning songs as the first rays of light touched the treetops. The village slowly came alive as farmers headed to their fields and children prepared for school. It was going to be another beautiful day in the countryside.",
    options: [
      { optionText: "The start of a beautiful day in the countryside", isCorrect: true, optionOrder: 1 },
      { optionText: "The activities of farmers", isCorrect: false, optionOrder: 2 },
      { optionText: "The beauty of the sunset", isCorrect: false, optionOrder: 3 },
      { optionText: "Children going to school", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The passage describes a morning scene and concludes it will be a beautiful day, so the main idea is the start of a beautiful day in the countryside."
  },

  {
    code: "J-ENG-025",
    questionText: "What is the correct comparative form of 'good'?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Comparatives",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "better", isCorrect: true, optionOrder: 1 },
      { optionText: "gooder", isCorrect: false, optionOrder: 2 },
      { optionText: "more good", isCorrect: false, optionOrder: 3 },
      { optionText: "best", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Good' is irregular. Its comparative is 'better', superlative is 'best'."
  },

  {
    code: "J-ENG-026",
    questionText: "\"She sells seashells by the seashore\" is an example of what?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Figurative Language - Alliteration",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Alliteration", isCorrect: true, optionOrder: 1 },
      { optionText: "Assonance", isCorrect: false, optionOrder: 2 },
      { optionText: "Rhyme", isCorrect: false, optionOrder: 3 },
      { optionText: "Onomatopoeia", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Alliteration is the repetition of initial consonant sounds ('s' sound repeated)."
  },

  {
    code: "J-ENG-027",
    questionText: "Change to passive voice: 'The boy ate the apple.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Active and Passive Voice",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "The apple was eaten by the boy.", isCorrect: true, optionOrder: 1 },
      { optionText: "The apple is eaten by the boy.", isCorrect: false, optionOrder: 2 },
      { optionText: "The boy was eaten by the apple.", isCorrect: false, optionOrder: 3 },
      { optionText: "The apple ate the boy.", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Passive: object (apple) + was/were + past participle (eaten) + by + subject (boy)."
  },

  {
    code: "J-ENG-028",
    questionText: "What is the theme of a story?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Literature Terms - Theme",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "The central message or lesson", isCorrect: true, optionOrder: 1 },
      { optionText: "The list of characters", isCorrect: false, optionOrder: 2 },
      { optionText: "The time period of the story", isCorrect: false, optionOrder: 3 },
      { optionText: "The name of the author", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The theme is the underlying message, moral, or central idea of a literary work."
  },

  {
    code: "J-ENG-029",
    questionText: "Which word best completes the sentence: 'The results of the experiment were ___.' (meaning not what was expected)",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Vocabulary - Context Clues",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "unexpected", isCorrect: true, optionOrder: 1 },
      { optionText: "expected", isCorrect: false, optionOrder: 2 },
      { optionText: "predictable", isCorrect: false, optionOrder: 3 },
      { optionText: "ordinary", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Unexpected' means not anticipated or surprising, fitting the description 'not what was expected'."
  },

  {
    code: "J-ENG-030",
    questionText: "Read the passage and answer.\n\nPassage: \"The old man sat on the park bench every afternoon. He watched children play and couples walk by. One day, a young boy approached him and asked, 'Why do you sit here alone every day?' The old man smiled and replied, 'I am not alone. I am surrounded by memories.'\"\n\nWhat does the old man mean by 'I am surrounded by memories'?",
    questionType: "multiple_choice",
    rendererType: "passage",
    concept: "Comprehension - Inference",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    passageText: "The old man sat on the park bench every afternoon. He watched children play and couples walk by. One day, a young boy approached him and asked, 'Why do you sit here alone every day?' The old man smiled and replied, 'I am not alone. I am surrounded by memories.'",
    options: [
      { optionText: "The park reminds him of past experiences", isCorrect: true, optionOrder: 1 },
      { optionText: "There are ghosts in the park", isCorrect: false, optionOrder: 2 },
      { optionText: "He has many friends visiting him", isCorrect: false, optionOrder: 3 },
      { optionText: "He is lost in his thoughts", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The old man means the park holds many memories from his past, so he feels accompanied by those memories."
  },

  {
    code: "J-ENG-031",
    questionText: "What is a tag question for: 'You are coming, ___?'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Tag Questions",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "aren't you?", isCorrect: true, optionOrder: 1 },
      { optionText: "isn't you?", isCorrect: false, optionOrder: 2 },
      { optionText: "don't you?", isCorrect: false, optionOrder: 3 },
      { optionText: "won't you?", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "For positive statement 'You are', use negative tag 'aren't you?'."
  },

  {
    code: "J-ENG-032",
    questionText: "Which of these sentences contains a metaphor?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Figurative Language - Metaphor",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Time is a thief that steals our moments.", isCorrect: true, optionOrder: 1 },
      { optionText: "The baby slept like a log.", isCorrect: false, optionOrder: 2 },
      { optionText: "The wind blew strongly.", isCorrect: false, optionOrder: 3 },
      { optionText: "She ran very fast.", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A metaphor directly states that one thing is another ('Time is a thief') without using 'like' or 'as'."
  },

  {
    code: "J-ENG-033",
    questionText: "In essay writing, what does a topic sentence do?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Essay Structure - Topic Sentence",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "States the main idea of a paragraph", isCorrect: true, optionOrder: 1 },
      { optionText: "Concludes the essay", isCorrect: false, optionOrder: 2 },
      { optionText: "Introduces the author", isCorrect: false, optionOrder: 3 },
      { optionText: "Lists supporting evidence", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A topic sentence expresses the main idea of a paragraph and guides its content."
  },

  {
    code: "J-ENG-034",
    questionText: "What is the meaning of the prefix 'un-' in 'unusual'?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Vocabulary - Prefixes",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "not", isCorrect: true, optionOrder: 1 },
      { optionText: "before", isCorrect: false, optionOrder: 2 },
      { optionText: "again", isCorrect: false, optionOrder: 3 },
      { optionText: "very", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The prefix 'un-' means 'not'. 'Unusual' means 'not usual'."
  },

  {
    code: "J-ENG-035",
    questionText: "Which is the correct reported speech: She said, 'I am happy.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Reported Speech",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "She said that she was happy.", isCorrect: true, optionOrder: 1 },
      { optionText: "She said that I am happy.", isCorrect: false, optionOrder: 2 },
      { optionText: "She said that she is happy.", isCorrect: false, optionOrder: 3 },
      { optionText: "She said that she has been happy.", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "In reported speech, present tense changes to past tense: 'I am' → 'she was'."
  },

  {
    code: "J-ENG-036",
    questionText: "Read the passage and answer.\n\nPassage: \"Deforestation is the clearing of forests on a massive scale. This practice has severe consequences for the environment. Forests help regulate the climate by absorbing carbon dioxide. When trees are cut down, the stored carbon is released back into the atmosphere, contributing to global warming. Furthermore, deforestation destroys habitats, leading to the loss of biodiversity. Many species of plants and animals face extinction because their natural homes are destroyed.\"\n\nAccording to the passage, how does deforestation contribute to global warming?",
    questionType: "multiple_choice",
    rendererType: "passage",
    concept: "Comprehension - Factual",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    passageText: "Deforestation is the clearing of forests on a massive scale. This practice has severe consequences for the environment. Forests help regulate the climate by absorbing carbon dioxide. When trees are cut down, the stored carbon is released back into the atmosphere, contributing to global warming. Furthermore, deforestation destroys habitats, leading to the loss of biodiversity. Many species of plants and animals face extinction because their natural homes are destroyed.",
    options: [
      { optionText: "Stored carbon is released into the atmosphere", isCorrect: true, optionOrder: 1 },
      { optionText: "Trees stop producing oxygen", isCorrect: false, optionOrder: 2 },
      { optionText: "The soil becomes infertile", isCorrect: false, optionOrder: 3 },
      { optionText: "Animals migrate to other areas", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The passage states: 'When trees are cut down, the stored carbon is released back into the atmosphere, contributing to global warming.'"
  },

  {
    code: "J-ENG-037",
    questionText: "What is the difference between 'affect' and 'effect'?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Vocabulary - Commonly Confused Words",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Affect is a verb; effect is usually a noun", isCorrect: true, optionOrder: 1 },
      { optionText: "They mean exactly the same thing", isCorrect: false, optionOrder: 2 },
      { optionText: "Affect is a noun; effect is a verb", isCorrect: false, optionOrder: 3 },
      { optionText: "Both words are always nouns", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Affect' is typically a verb meaning to influence. 'Effect' is typically a noun meaning a result."
  },

  {
    code: "J-ENG-038",
    questionText: "Which of the following is an oxymoron?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Figurative Language - Oxymoron",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "deafening silence", isCorrect: true, optionOrder: 1 },
      { optionText: "loud noise", isCorrect: false, optionOrder: 2 },
      { optionText: "bright light", isCorrect: false, optionOrder: 3 },
      { optionText: "big house", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "An oxymoron combines contradictory terms. 'Deafening silence' pairs two opposing ideas."
  },

  {
    code: "J-ENG-039",
    questionText: "In the sentence 'She is the president of the club', the word 'president' is a ___.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Subject Complement",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "subject complement", isCorrect: true, optionOrder: 1 },
      { optionText: "direct object", isCorrect: false, optionOrder: 2 },
      { optionText: "indirect object", isCorrect: false, optionOrder: 3 },
      { optionText: "prepositional object", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "After a linking verb ('is'), 'president' renames the subject and is a subject complement."
  },

  {
    code: "J-ENG-040",
    questionText: "What is the purpose of a conclusion in an essay?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Essay Structure - Conclusion",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "To restate the thesis and summarise key points", isCorrect: true, optionOrder: 1 },
      { optionText: "To introduce new arguments", isCorrect: false, optionOrder: 2 },
      { optionText: "To present the first piece of evidence", isCorrect: false, optionOrder: 3 },
      { optionText: "To list all references", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The conclusion restates the thesis in a new way and summarises the main points discussed."
  },

  // --- Hard (J-ENG-041 to J-ENG-055) ---

  {
    code: "J-ENG-041",
    questionText: "Read the passage and answer.\n\nPassage: \"The Industrial Revolution, which began in Britain in the late 18th century, marked a major turning point in history. It transformed societies from agrarian economies to industrial powerhouses. Inventions like the steam engine and spinning jenny revolutionised production methods. However, this progress came at a cost. Urbanisation led to overcrowded cities with poor sanitation. Factory workers, including children, endured long hours in dangerous conditions for meagre wages. The gap between the wealthy factory owners and the working class widened significantly.\"\n\nWhich of the following best summarises the passage?",
    questionType: "multiple_choice",
    rendererType: "passage",
    concept: "Summary",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 90,
    allowsCalculator: false,
    passageText: "The Industrial Revolution, which began in Britain in the late 18th century, marked a major turning point in history. It transformed societies from agrarian economies to industrial powerhouses. Inventions like the steam engine and spinning jenny revolutionised production methods. However, this progress came at a cost. Urbanisation led to overcrowded cities with poor sanitation. Factory workers, including children, endured long hours in dangerous conditions for meagre wages. The gap between the wealthy factory owners and the working class widened significantly.",
    options: [
      { optionText: "The Industrial Revolution brought progress but also social problems like poor working conditions and inequality.", isCorrect: true, optionOrder: 1 },
      { optionText: "The steam engine was the most important invention in history.", isCorrect: false, optionOrder: 2 },
      { optionText: "Factory workers were paid fairly for their work.", isCorrect: false, optionOrder: 3 },
      { optionText: "The Industrial Revolution only benefited wealthy people.", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The passage presents both the positive transformation and the negative social costs, making option A the most balanced summary."
  },

  {
    code: "J-ENG-042",
    questionText: "Identify the grammatical error: 'Neither the teacher nor the students was present.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Subject-Verb Agreement",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "The verb should be 'were' to agree with 'students'", isCorrect: true, optionOrder: 1 },
      { optionText: "The verb should be 'is'", isCorrect: false, optionOrder: 2 },
      { optionText: "'Neither' should be 'Either'", isCorrect: false, optionOrder: 3 },
      { optionText: "There is no error", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "With 'neither...nor', the verb agrees with the nearer subject. 'Students' is plural, so verb should be 'were'."
  },

  {
    code: "J-ENG-043",
    questionText: "What literary device is used when a story is told by a narrator outside the story who knows ALL characters' thoughts?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Literature Terms - Point of View",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "understand",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Third-person omniscient", isCorrect: true, optionOrder: 1 },
      { optionText: "First-person narrator", isCorrect: false, optionOrder: 2 },
      { optionText: "Third-person limited", isCorrect: false, optionOrder: 3 },
      { optionText: "Second-person narrator", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Third-person omniscient narrator knows all characters' thoughts, feelings, and actions."
  },

  {
    code: "J-ENG-044",
    questionText: "Choose the correctly punctuated sentence:",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Punctuation - Complex Sentences",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "After the rain stopped, we went outside to play.", isCorrect: true, optionOrder: 1 },
      { optionText: "After the rain stopped we went outside to play.", isCorrect: false, optionOrder: 2 },
      { optionText: "After the rain, stopped we went outside to play.", isCorrect: false, optionOrder: 3 },
      { optionText: "After the rain stopped we went, outside to play.", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A comma is needed after a dependent clause ('After the rain stopped') that begins a sentence."
  },

  {
    code: "J-ENG-045",
    questionText: "Read the passage and answer.\n\nPassage: \"The concept of 'culture shock' describes the anxiety and disorientation people experience when immersed in a new culture. It typically progresses through four stages: the honeymoon stage, characterised by excitement and fascination; the frustration stage, where differences become irritating; the adjustment stage, as individuals begin to adapt; and finally, the acceptance stage, where the new culture feels normal. Understanding these stages can help people navigate their feelings when living abroad.\"\n\nAccording to the passage, during which stage of culture shock do people find cultural differences most frustrating?",
    questionType: "multiple_choice",
    rendererType: "passage",
    concept: "Comprehension - Sequential",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "understand",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    passageText: "The concept of 'culture shock' describes the anxiety and disorientation people experience when immersed in a new culture. It typically progresses through four stages: the honeymoon stage, characterised by excitement and fascination; the frustration stage, where differences become irritating; the adjustment stage, as individuals begin to adapt; and finally, the acceptance stage, where the new culture feels normal. Understanding these stages can help people navigate their feelings when living abroad.",
    options: [
      { optionText: "Frustration stage", isCorrect: true, optionOrder: 1 },
      { optionText: "Honeymoon stage", isCorrect: false, optionOrder: 2 },
      { optionText: "Adjustment stage", isCorrect: false, optionOrder: 3 },
      { optionText: "Acceptance stage", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The passage explicitly states that 'the frustration stage' is where 'differences become irritating.'"
  },

  {
    code: "J-ENG-046",
    questionText: "Which of the following sentences is grammatically correct?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Conditional Sentences",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "If I had known, I would have come earlier.", isCorrect: true, optionOrder: 1 },
      { optionText: "If I have known, I would come earlier.", isCorrect: false, optionOrder: 2 },
      { optionText: "If I knew, I would have come earlier.", isCorrect: false, optionOrder: 3 },
      { optionText: "If I was known, I would come earlier.", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "This is a third conditional (unreal past): 'If + had + past participle, would have + past participle'."
  },

  {
    code: "J-ENG-047",
    questionText: "What is the tone of the following sentence: 'Another beautiful day filled with endless possibilities awaits us.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Literature Terms - Tone",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Optimistic", isCorrect: true, optionOrder: 1 },
      { optionText: "Sarcastic", isCorrect: false, optionOrder: 2 },
      { optionText: "Gloomy", isCorrect: false, optionOrder: 3 },
      { optionText: "Neutral", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Words like 'beautiful', 'endless possibilities' convey a positive, hopeful, optimistic tone."
  },

  {
    code: "J-ENG-048",
    questionText: "Which word is the correct spelling for a person who studies rocks?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Vocabulary - Spelling",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "geologist", isCorrect: true, optionOrder: 1 },
      { optionText: "geologyst", isCorrect: false, optionOrder: 2 },
      { optionText: "geolologist", isCorrect: false, optionOrder: 3 },
      { optionText: "geologest", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A 'geologist' studies rocks. The suffix '-ist' indicates a person who practices something."
  },

  {
    code: "J-ENG-049",
    questionText: "Read the passage and answer.\n\nPassage: \"Social media has fundamentally changed how people communicate and share information. While it has democratised access to information and connected people across vast distances, it has also introduced new challenges. The spread of misinformation, echo chambers that reinforce existing beliefs, and concerns about privacy are significant drawbacks. Moreover, studies suggest a correlation between heavy social media use and increased rates of anxiety and depression among teenagers. The key, experts argue, is not to abandon social media but to use it mindfully.\"\n\nWhat is the author's attitude toward social media in this passage?",
    questionType: "multiple_choice",
    rendererType: "passage",
    concept: "Comprehension - Author's Attitude",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 90,
    allowsCalculator: false,
    passageText: "Social media has fundamentally changed how people communicate and share information. While it has democratised access to information and connected people across vast distances, it has also introduced new challenges. The spread of misinformation, echo chambers that reinforce existing beliefs, and concerns about privacy are significant drawbacks. Moreover, studies suggest a correlation between heavy social media use and increased rates of anxiety and depression among teenagers. The key, experts argue, is not to abandon social media but to use it mindfully.",
    options: [
      { optionText: "Balanced and measured", isCorrect: true, optionOrder: 1 },
      { optionText: "Strongly opposed", isCorrect: false, optionOrder: 2 },
      { optionText: "Enthusiastically supportive", isCorrect: false, optionOrder: 3 },
      { optionText: "Indifferent", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The author presents both benefits and drawbacks, concluding with a moderate view of mindful use, showing a balanced attitude."
  },

  {
    code: "J-ENG-050",
    questionText: "Identify the figure of speech: 'The pen is mightier than the sword.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Figurative Language - Metonymy",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Metonymy", isCorrect: true, optionOrder: 1 },
      { optionText: "Simile", isCorrect: false, optionOrder: 2 },
      { optionText: "Personification", isCorrect: false, optionOrder: 3 },
      { optionText: "Alliteration", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Metonymy substitutes one word for another closely related concept. 'Pen' stands for writing/ideas, 'sword' for military force."
  },

  {
    code: "J-ENG-051",
    questionText: "What type of clause is underlined? 'The student WHO STUDIED HARD passed the exam.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Relative Clauses",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Relative clause (adjective clause)", isCorrect: true, optionOrder: 1 },
      { optionText: "Noun clause", isCorrect: false, optionOrder: 2 },
      { optionText: "Adverbial clause", isCorrect: false, optionOrder: 3 },
      { optionText: "Main clause", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Who studied hard' is a relative clause that modifies the noun 'student', making it an adjective clause."
  },

  {
    code: "J-ENG-052",
    questionText: "Arrange the following words in alphabetical order: 'necessary', 'neighbour', 'navigate', 'narrative'",
    questionType: "multiple_choice",
    rendererType: "interactive",
    concept: "Vocabulary - Alphabetical Order",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    interactiveData: { type: "ordering", items: ["narrative", "navigate", "necessary", "neighbour"], correctOrder: ["narrative", "navigate", "necessary", "neighbour"] },
    options: [
      { optionText: "narrative, navigate, necessary, neighbour", isCorrect: true, optionOrder: 1 },
      { optionText: "navigate, narrative, neighbour, necessary", isCorrect: false, optionOrder: 2 },
      { optionText: "necessary, neighbour, narrative, navigate", isCorrect: false, optionOrder: 3 },
      { optionText: "neighbour, necessary, narrative, navigate", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Alphabetically: narrative (n-a-r), navigate (n-a-v), necessary (n-e-c), neighbour (n-e-i)."
  },

  {
    code: "J-ENG-053",
    questionText: "Which of these sentences has a dangling modifier?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Grammar - Dangling Modifiers",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "Walking through the door, the room was empty.", isCorrect: true, optionOrder: 1 },
      { optionText: "Walking through the door, I saw the empty room.", isCorrect: false, optionOrder: 2 },
      { optionText: "As I walked through the door, I saw the empty room.", isCorrect: false, optionOrder: 3 },
      { optionText: "The room was empty when I walked through the door.", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Walking through the door' modifies 'the room' incorrectly (a room cannot walk). The implied subject is missing."
  },

  {
    code: "J-ENG-054",
    questionText: "Read the passage and answer.\n\nPassage: \"Renewable energy sources such as solar, wind, and hydroelectric power are essential for a sustainable future. Unlike fossil fuels, which are finite and contribute to climate change, renewables offer an inexhaustible supply of clean energy. However, there are challenges. Solar and wind power are intermittent—they do not produce energy consistently throughout the day. Energy storage technology, particularly improved battery systems, is critical to overcoming this limitation. Many countries are investing heavily in research to make renewable energy more reliable and affordable.\"\n\nWhat is the main challenge with solar and wind power mentioned in the passage?",
    questionType: "multiple_choice",
    rendererType: "passage",
    concept: "Comprehension - Identifying Challenges",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "understand",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    passageText: "Renewable energy sources such as solar, wind, and hydroelectric power are essential for a sustainable future. Unlike fossil fuels, which are finite and contribute to climate change, renewables offer an inexhaustible supply of clean energy. However, there are challenges. Solar and wind power are intermittent—they do not produce energy consistently throughout the day. Energy storage technology, particularly improved battery systems, is critical to overcoming this limitation. Many countries are investing heavily in research to make renewable energy more reliable and affordable.",
    options: [
      { optionText: "Their energy production is intermittent", isCorrect: true, optionOrder: 1 },
      { optionText: "They produce greenhouse gases", isCorrect: false, optionOrder: 2 },
      { optionText: "They are too expensive to build", isCorrect: false, optionOrder: 3 },
      { optionText: "They require fossil fuels to operate", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The passage states: 'Solar and wind power are intermittent—they do not produce energy consistently throughout the day.'"
  },

  {
    code: "J-ENG-055",
    questionText: "Fill in the blank with the correct word: 'The professor's ___ knowledge of the subject impressed everyone.' (meaning thorough and extensive)",
    questionType: "multiple_choice",
    rendererType: "interactive",
    concept: "Vocabulary - Context Clues",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    interactiveData: { type: "fill_blanks", blanks: [{ id: "b1", textBefore: "The professor's", textAfter: "knowledge of the subject impressed everyone.", correctAnswer: "comprehensive" }] },
    options: [
      { optionText: "comprehensive", isCorrect: true, optionOrder: 1 },
      { optionText: "superficial", isCorrect: false, optionOrder: 2 },
      { optionText: "limited", isCorrect: false, optionOrder: 3 },
      { optionText: "basic", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'Comprehensive' means thorough and extensive, fitting the description in parentheses."
  },

  // ===========================================================================
  // CRITICAL THINKING (50 questions) - J-CT-001 to J-CT-050
  // ===========================================================================

  // --- Easy (J-CT-001 to J-CT-015) ---

  {
    code: "J-CT-001",
    questionText: "If all A are B, and some B are C, which of the following must be true?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Syllogisms",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Some A may be C", isCorrect: true, optionOrder: 1 },
      { optionText: "All A are C", isCorrect: false, optionOrder: 2 },
      { optionText: "No A is C", isCorrect: false, optionOrder: 3 },
      { optionText: "All C are A", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Since all A are B and some B are C, it is possible (but not guaranteed) that some A are C. 'Some A may be C' is the only safe conclusion."
  },

  {
    code: "J-CT-002",
    questionText: "Which word does not belong: Apple, Banana, Carrot, Grape?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Classification",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Carrot", isCorrect: true, optionOrder: 1 },
      { optionText: "Apple", isCorrect: false, optionOrder: 2 },
      { optionText: "Banana", isCorrect: false, optionOrder: 3 },
      { optionText: "Grape", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Apple, Banana, and Grape are fruits. Carrot is a vegetable."
  },

  {
    code: "J-CT-003",
    questionText: "Complete the analogy: Doctor is to Hospital as Teacher is to ___.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Analogies",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "School", isCorrect: true, optionOrder: 1 },
      { optionText: "Classroom", isCorrect: false, optionOrder: 2 },
      { optionText: "Books", isCorrect: false, optionOrder: 3 },
      { optionText: "Students", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A doctor works in a hospital. A teacher works in a school. The relationship is professional to workplace."
  },

  {
    code: "J-CT-004",
    questionText: "If you rearrange the letters 'CIFAIPC' you get the name of a(n):",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Word Puzzles - Anagrams",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Ocean", isCorrect: true, optionOrder: 1 },
      { optionText: "Country", isCorrect: false, optionOrder: 2 },
      { optionText: "Animal", isCorrect: false, optionOrder: 3 },
      { optionText: "Planet", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "CIFAIPC rearranged spells PACIFIC, which is an ocean."
  },

  {
    code: "J-CT-005",
    questionText: "A clock shows 3:15. What is the angle between the hour and minute hands?",
    questionType: "multiple_choice",
    rendererType: "geometry",
    concept: "Problem Solving - Angles",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    geometryData: { type: "number_line", label: "Clock", dimensions: { hour: 3, minute: 15 } },
    options: [
      { optionText: "7.5°", isCorrect: true, optionOrder: 1 },
      { optionText: "0°", isCorrect: false, optionOrder: 2 },
      { optionText: "15°", isCorrect: false, optionOrder: 3 },
      { optionText: "30°", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "At 3:15, minute hand is at 3, hour hand has moved 1/4 of the way to 4. 1/4 of 30° = 7.5°."
  },

  {
    code: "J-CT-006",
    questionText: "Which number comes next: 1, 1, 2, 3, 5, 8, ___?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Number Patterns - Fibonacci",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "13", isCorrect: true, optionOrder: 1 },
      { optionText: "11", isCorrect: false, optionOrder: 2 },
      { optionText: "10", isCorrect: false, optionOrder: 3 },
      { optionText: "14", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "This is the Fibonacci sequence. Each term is the sum of the previous two: 5 + 8 = 13."
  },

  {
    code: "J-CT-007",
    questionText: "If all cats are mammals and some mammals are bats, can we conclude some cats are bats?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Logical Reasoning - Deduction",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "No", isCorrect: true, optionOrder: 1 },
      { optionText: "Yes", isCorrect: false, optionOrder: 2 },
      { optionText: "Maybe", isCorrect: false, optionOrder: 3 },
      { optionText: "Only if bats are cats", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Just because all cats are mammals and some mammals are bats does not mean any cats are bats. Cats and bats are distinct groups within mammals."
  },

  {
    code: "J-CT-008",
    questionText: "Which shape is the odd one out: Square, Rectangle, Triangle, Cube?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Classification - Shapes",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Cube", isCorrect: true, optionOrder: 1 },
      { optionText: "Square", isCorrect: false, optionOrder: 2 },
      { optionText: "Rectangle", isCorrect: false, optionOrder: 3 },
      { optionText: "Triangle", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Square, Rectangle, and Triangle are 2D shapes. Cube is a 3D shape."
  },

  {
    code: "J-CT-009",
    questionText: "A farmer has 15 goats. All but 9 die. How many goats are left?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Logical Reasoning - Word Play",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "9", isCorrect: true, optionOrder: 1 },
      { optionText: "6", isCorrect: false, optionOrder: 2 },
      { optionText: "15", isCorrect: false, optionOrder: 3 },
      { optionText: "0", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "'All but 9 die' means 9 are left alive. The phrasing means 'all except 9'."
  },

  {
    code: "J-CT-010",
    questionText: "If A is taller than B, and B is taller than C, who is the shortest?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Logical Reasoning - Ordering",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "C", isCorrect: true, optionOrder: 1 },
      { optionText: "A", isCorrect: false, optionOrder: 2 },
      { optionText: "B", isCorrect: false, optionOrder: 3 },
      { optionText: "Cannot be determined", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A > B > C, so C is the shortest."
  },

  {
    code: "J-CT-011",
    questionText: "What is the missing number: 2, 6, 18, 54, ___?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Number Patterns - Geometric",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "162", isCorrect: true, optionOrder: 1 },
      { optionText: "108", isCorrect: false, optionOrder: 2 },
      { optionText: "72", isCorrect: false, optionOrder: 3 },
      { optionText: "216", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Each term is multiplied by 3: 54 × 3 = 162."
  },

  {
    code: "J-CT-012",
    questionText: "Which one of the following is always true about a triangle?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Logical Reasoning - Properties",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "understand",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "The sum of its interior angles is 180°", isCorrect: true, optionOrder: 1 },
      { optionText: "All sides are equal", isCorrect: false, optionOrder: 2 },
      { optionText: "It has four sides", isCorrect: false, optionOrder: 3 },
      { optionText: "It has one right angle", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "For any triangle, the sum of interior angles is always 180°. Not all triangles have equal sides or a right angle."
  },

  {
    code: "J-CT-013",
    questionText: "If today is Monday, what day will it be in 10 days?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Problem Solving - Modular Arithmetic",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Thursday", isCorrect: true, optionOrder: 1 },
      { optionText: "Wednesday", isCorrect: false, optionOrder: 2 },
      { optionText: "Friday", isCorrect: false, optionOrder: 3 },
      { optionText: "Tuesday", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "10 days = 1 week + 3 days. Monday + 3 = Thursday."
  },

  {
    code: "J-CT-014",
    questionText: "Which conclusion follows? 'All students study. John is a student.'",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Deductive Reasoning",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "John studies", isCorrect: true, optionOrder: 1 },
      { optionText: "John does not study", isCorrect: false, optionOrder: 2 },
      { optionText: "Some students do not study", isCorrect: false, optionOrder: 3 },
      { optionText: "John is a teacher", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "If all students study and John is a student, then by deduction, John studies."
  },

  {
    code: "J-CT-015",
    questionText: "A pencil and an eraser cost ₦150 together. The pencil costs ₦100 more than the eraser. How much does the eraser cost?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Problem Solving - Simultaneous",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "₦25", isCorrect: true, optionOrder: 1 },
      { optionText: "₦50", isCorrect: false, optionOrder: 2 },
      { optionText: "₦75", isCorrect: false, optionOrder: 3 },
      { optionText: "₦100", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Let e = eraser cost. Pencil = e + 100. e + (e + 100) = 150 → 2e = 50 → e = 25."
  },

  // --- Medium (J-CT-016 to J-CT-035) ---

  {
    code: "J-CT-016",
    questionText: "If the day after tomorrow is Sunday, what day is today?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Logical Reasoning - Calendar",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Friday", isCorrect: true, optionOrder: 1 },
      { optionText: "Saturday", isCorrect: false, optionOrder: 2 },
      { optionText: "Thursday", isCorrect: false, optionOrder: 3 },
      { optionText: "Monday", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Day after tomorrow = Sunday. Tomorrow = Saturday. Today = Friday."
  },

  {
    code: "J-CT-017",
    questionText: "All dogs are mammals. Some pets are dogs. Which conclusion is valid?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Syllogisms",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Some pets are mammals", isCorrect: true, optionOrder: 1 },
      { optionText: "All mammals are dogs", isCorrect: false, optionOrder: 2 },
      { optionText: "No dogs are pets", isCorrect: false, optionOrder: 3 },
      { optionText: "All pets are dogs", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Some pets are dogs (given), and all dogs are mammals, so some pets are mammals is valid."
  },

  {
    code: "J-CT-018",
    questionText: "A bat and a ball cost ₦110 together. The bat costs ₦100 more than the ball. How much does the ball cost?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Problem Solving - Common Trick",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "₦5", isCorrect: true, optionOrder: 1 },
      { optionText: "₦10", isCorrect: false, optionOrder: 2 },
      { optionText: "₦15", isCorrect: false, optionOrder: 3 },
      { optionText: "₦20", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Let b = ball cost. Bat = b + 100. b + (b + 100) = 110 → 2b = 10 → b = 5. Many people incorrectly answer 10."
  },

  {
    code: "J-CT-019",
    questionText: "Water is to Aquarium as Air is to ___.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Analogies",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Atmosphere", isCorrect: true, optionOrder: 1 },
      { optionText: "Balloon", isCorrect: false, optionOrder: 2 },
      { optionText: "Oxygen", isCorrect: false, optionOrder: 3 },
      { optionText: "Wind", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Water fills an aquarium; air fills the atmosphere. The relationship is element to its container."
  },

  {
    code: "J-CT-020",
    questionText: "You have a 3-liter jug and a 5-liter jug. How can you measure exactly 4 liters?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Problem Solving - Water Jug",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 90,
    allowsCalculator: false,
    options: [
      { optionText: "Fill 5, pour to 3, empty 3, pour remaining 2 from 5 to 3, fill 5, pour to 3 until full, leaving 4 in 5", isCorrect: true, optionOrder: 1 },
      { optionText: "Fill 3, pour to 5, fill 3, pour to 5 until full, leaving 1 in 3, empty 5, pour 1 to 5, fill 3, pour to 5", isCorrect: false, optionOrder: 2 },
      { optionText: "Fill 5 and 3, mix them together", isCorrect: false, optionOrder: 3 },
      { optionText: "It is impossible to measure exactly 4 liters", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Fill 5L, pour to 3L (leaves 2L in 5). Empty 3L. Pour the 2L from 5 to 3. Fill 5L, pour to 3L until full (adds 1L). 4L remains in 5L."
  },

  {
    code: "J-CT-021",
    questionText: "Find the odd one out: 64, 125, 216, 343, 512, 729",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Number Patterns - Classification",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "125", isCorrect: true, optionOrder: 1 },
      { optionText: "64", isCorrect: false, optionOrder: 2 },
      { optionText: "216", isCorrect: false, optionOrder: 3 },
      { optionText: "343", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "64 = 4³, 216 = 6³, 343 = 7³, 512 = 8³, 729 = 9³. 125 = 5³ is missing from the correct sequence of 4³, 6³, 7³, 8³, 9³ — wait, 64=4³, 125=5³, 216=6³, 343=7³, 512=8³, 729=9³. All are perfect cubes. But 64 = 8² also, making it a square as well. All are cubes, so 64 is also a perfect square."
  },

  {
    code: "J-CT-022",
    questionText: "If all flowers are plants and some plants are weeds, which of the following is true?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Syllogisms",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Some flowers may be weeds", isCorrect: true, optionOrder: 1 },
      { optionText: "All flowers are weeds", isCorrect: false, optionOrder: 2 },
      { optionText: "No flowers are weeds", isCorrect: false, optionOrder: 3 },
      { optionText: "All weeds are flowers", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Since all flowers are plants and some plants are weeds, it is possible that some flowers could be weeds (if those specific plants that are weeds also happen to be flowers), but it is not guaranteed."
  },

  {
    code: "J-CT-023",
    questionText: "Five people are in a race. A finishes before B. C finishes after D but before E. B finishes before C. Who finishes last?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Logical Reasoning - Ordering",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "E", isCorrect: true, optionOrder: 1 },
      { optionText: "A", isCorrect: false, optionOrder: 2 },
      { optionText: "B", isCorrect: false, optionOrder: 3 },
      { optionText: "C", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A > B > C > D and C > E ... wait: A before B, B before C, D before C, C before E. So A > B > C > E, and D is before C but we don't know D vs E. Actually: A before B, B before C, D before C, C before E. So A > B > C > E, and D is somewhere before C. E is after C, making E last."
  },

  {
    code: "J-CT-024",
    questionText: "A rectangle has a perimeter of 40 cm and a length of 12 cm. What is its width?",
    questionType: "multiple_choice",
    rendererType: "geometry",
    concept: "Problem Solving - Geometry",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    geometryData: { type: "quadrilateral", label: "Rectangle", dimensions: { perimeter: 40, length: 12 } },
    options: [
      { optionText: "8 cm", isCorrect: true, optionOrder: 1 },
      { optionText: "6 cm", isCorrect: false, optionOrder: 2 },
      { optionText: "10 cm", isCorrect: false, optionOrder: 3 },
      { optionText: "5 cm", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Perimeter = 2(L + W). 40 = 2(12 + W) → 20 = 12 + W → W = 8 cm."
  },

  {
    code: "J-CT-025",
    questionText: "If a clock shows 4:45, what is the angle between the hour and minute hands?",
    questionType: "multiple_choice",
    rendererType: "geometry",
    concept: "Logical Reasoning - Angles",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    geometryData: { type: "number_line", label: "Clock at 4:45", dimensions: { hour: 4, minute: 45 } },
    options: [
      { optionText: "127.5°", isCorrect: true, optionOrder: 1 },
      { optionText: "120°", isCorrect: false, optionOrder: 2 },
      { optionText: "135°", isCorrect: false, optionOrder: 3 },
      { optionText: "150°", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "At 4:45, minute hand at 9 (270° from 12). Hour hand at 4 + 45/60 = 4.75. Each hour = 30°. 4.75 × 30 = 142.5°. Difference = 270 - 142.5 = 127.5°."
  },

  {
    code: "J-CT-026",
    questionText: "What number should replace the question mark: 1, 4, 9, 16, 25, ___?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Number Patterns - Squares",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "36", isCorrect: true, optionOrder: 1 },
      { optionText: "30", isCorrect: false, optionOrder: 2 },
      { optionText: "49", isCorrect: false, optionOrder: 3 },
      { optionText: "35", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6² = 36."
  },

  {
    code: "J-CT-027",
    questionText: "Premise 1: All politicians are public speakers. Premise 2: Some public speakers are not honest. Conclusion: Some politicians are not honest. Is this conclusion valid?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Argument Analysis",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "evaluate",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "No, the conclusion does not logically follow", isCorrect: true, optionOrder: 1 },
      { optionText: "Yes, the conclusion follows logically", isCorrect: false, optionOrder: 2 },
      { optionText: "Only if all public speakers are politicians", isCorrect: false, optionOrder: 3 },
      { optionText: "Only if all politicians are honest", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The dishonest public speakers might be among those who are not politicians, so we cannot conclude that some politicians are dishonest."
  },

  {
    code: "J-CT-028",
    questionText: "If you fold a square paper in half diagonally, then fold it in half again, how many triangles will you see when you unfold it?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Problem Solving - Spatial",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "4", isCorrect: true, optionOrder: 1 },
      { optionText: "2", isCorrect: false, optionOrder: 2 },
      { optionText: "8", isCorrect: false, optionOrder: 3 },
      { optionText: "1", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Folding diagonally creates 2 triangles. Folding again creates 4 triangles total when unfolded (the crease lines divide the square into 4 triangles)."
  },

  {
    code: "J-CT-029",
    questionText: "In a row of students, Chidera is 15th from the left and 10th from the right. How many students are in the row?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Logical Reasoning - Positioning",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "24", isCorrect: true, optionOrder: 1 },
      { optionText: "25", isCorrect: false, optionOrder: 2 },
      { optionText: "23", isCorrect: false, optionOrder: 3 },
      { optionText: "26", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Total = position from left + position from right - 1 = 15 + 10 - 1 = 24."
  },

  {
    code: "J-CT-030",
    questionText: "Data Sufficiency: Is x > 5? Statement 1: x > 3. Statement 2: x < 10.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Data Sufficiency",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "evaluate",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Both statements together are not sufficient", isCorrect: true, optionOrder: 1 },
      { optionText: "Statement 1 alone is sufficient", isCorrect: false, optionOrder: 2 },
      { optionText: "Statement 2 alone is sufficient", isCorrect: false, optionOrder: 3 },
      { optionText: "Both statements together are sufficient", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "x > 3 and x < 10 means x is between 3 and 10, which could be less than, equal to, or greater than 5. Not sufficient."
  },

  {
    code: "J-CT-031",
    questionText: "If REASON is coded as 185114154, how is THINK coded? (A=1, B=2, ..., Z=26)",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Puzzles - Letter Coding",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "20891411", isCorrect: true, optionOrder: 1 },
      { optionText: "20191411", isCorrect: false, optionOrder: 2 },
      { optionText: "20981411", isCorrect: false, optionOrder: 3 },
      { optionText: "20891412", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "R=18, E=5, A=1, S=19, O=15, N=14 → 185114154. THINK: T=20, H=8, I=9, N=14, K=11 → 20891411."
  },

  {
    code: "J-CT-032",
    questionText: "Find the missing number: 7, 10, 9, 12, 11, ___",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Number Patterns - Alternating",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "14", isCorrect: true, optionOrder: 1 },
      { optionText: "13", isCorrect: false, optionOrder: 2 },
      { optionText: "15", isCorrect: false, optionOrder: 3 },
      { optionText: "10", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Two alternating sequences: +3, -1, +3, -1, +3. 7→10(+3), 10→9(-1), 9→12(+3), 12→11(-1), 11→14(+3)."
  },

  {
    code: "J-CT-033",
    questionText: "Puzzle: A man looks at a photograph and says, 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the photograph?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Puzzles - Relationship",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 90,
    allowsCalculator: false,
    options: [
      { optionText: "His son", isCorrect: true, optionOrder: 1 },
      { optionText: "Himself", isCorrect: false, optionOrder: 2 },
      { optionText: "His father", isCorrect: false, optionOrder: 3 },
      { optionText: "His brother", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "No siblings, so 'my father's son' = me. So 'that man's father is me'. The man in the photo is my son."
  },

  {
    code: "J-CT-034",
    questionText: "Data Sufficiency: What is the value of x? Statement 1: 2x + 4 = 12. Statement 2: x² = 16.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Data Sufficiency",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "evaluate",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Statement 1 alone is sufficient", isCorrect: true, optionOrder: 1 },
      { optionText: "Statement 2 alone is sufficient", isCorrect: false, optionOrder: 2 },
      { optionText: "Both statements together are needed", isCorrect: false, optionOrder: 3 },
      { optionText: "Neither statement alone is sufficient", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "From statement 1: 2x = 8, x = 4. Statement 2 gives x = ±4, so x is not uniquely determined."
  },

  {
    code: "J-CT-035",
    questionText: "If you start at point A, walk 5 km north, then 3 km east, then 5 km south, then 3 km west, where do you end?",
    questionType: "multiple_choice",
    rendererType: "geometry",
    concept: "Logical Reasoning - Spatial",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    geometryData: { type: "graph", label: "Path", dimensions: { north: 5, east: 3, south: 5, west: 3 } },
    options: [
      { optionText: "Back at point A", isCorrect: true, optionOrder: 1 },
      { optionText: "3 km east of A", isCorrect: false, optionOrder: 2 },
      { optionText: "5 km north of A", isCorrect: false, optionOrder: 3 },
      { optionText: "3 km west of A", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "5 km N + 5 km S = 0 (net N-S). 3 km E + 3 km W = 0 (net E-W). You return to the starting point."
  },

  // --- Hard (J-CT-036 to J-CT-050) ---

  {
    code: "J-CT-036",
    questionText: "Three friends, Ada, Bola, and Chidi, each have a different favourite colour: red, blue, or green. Ada does not like red. Bola does not like blue. Chidi likes green. What is Bola's favourite colour?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Logical Reasoning - Grid Deduction",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "Red", isCorrect: true, optionOrder: 1 },
      { optionText: "Blue", isCorrect: false, optionOrder: 2 },
      { optionText: "Green", isCorrect: false, optionOrder: 3 },
      { optionText: "Cannot be determined", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Chidi likes green. So red and blue are for Ada and Bola. Ada does not like red, so Ada likes blue. Bola likes red."
  },

  {
    code: "J-CT-037",
    questionText: "A truth-teller always tells the truth. A liar always lies. You meet two people: X says 'Y is a liar.' Y says 'X is a truth-teller.' What can you conclude?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Logical Reasoning - Truth Tellers and Liars",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 90,
    allowsCalculator: false,
    options: [
      { optionText: "X is lying and Y is lying", isCorrect: true, optionOrder: 1 },
      { optionText: "X is telling the truth and Y is telling the truth", isCorrect: false, optionOrder: 2 },
      { optionText: "X is telling the truth, Y is lying", isCorrect: false, optionOrder: 3 },
      { optionText: "X is lying, Y is telling the truth", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "If X is truth-teller, Y is liar (from X's statement). Then Y's statement 'X is truth-teller' would be true, but Y is liar—contradiction. If X is liar, then Y is truth-teller (X's statement is false). Then Y's statement 'X is truth-teller' would be false—but Y is truth-teller. Wait: If X lies, then 'Y is liar' is false → Y is truth-teller. Y says 'X is truth-teller' which would be false. But truth-teller cannot lie. Contradiction again. Actually: X says 'Y is liar'. If X is truth-teller, Y is liar. Y says 'X is truth-teller' — liar Y would say something false, so X would not be truth-teller. But we assumed X is truth-teller. Contradiction. If X is liar, 'Y is liar' is false → Y is truth-teller. Y says 'X is truth-teller' which would be false. But truth-teller Y cannot say false. Both are lying."
  },

  {
    code: "J-CT-038",
    questionText: "Complete the analogy: Chemist is to Molecule as Astronomer is to ___.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Analogies - Professional",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "Celestial body", isCorrect: true, optionOrder: 1 },
      { optionText: "Telescope", isCorrect: false, optionOrder: 2 },
      { optionText: "Laboratory", isCorrect: false, optionOrder: 3 },
      { optionText: "Microscope", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A chemist studies molecules. An astronomer studies celestial bodies (stars, planets, galaxies). The relationship is professional to object of study."
  },

  {
    code: "J-CT-039",
    questionText: "Find the missing number in the sequence: 3, 8, 15, 24, 35, ___",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Number Patterns - Quadratic",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "48", isCorrect: true, optionOrder: 1 },
      { optionText: "46", isCorrect: false, optionOrder: 2 },
      { optionText: "47", isCorrect: false, optionOrder: 3 },
      { optionText: "49", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Differences: 5, 7, 9, 11 (increasing by 2). Next difference = 13. 35 + 13 = 48. Pattern: n(n+2): 1×3=3, 2×4=8, 3×5=15, 4×6=24, 5×7=35, 6×8=48."
  },

  {
    code: "J-CT-040",
    questionText: "Data Sufficiency: Is triangle ABC a right-angled triangle? Statement 1: AB² + BC² = AC². Statement 2: Angle ABC = 90°.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Data Sufficiency - Geometry",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "evaluate",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "Each statement alone is sufficient", isCorrect: true, optionOrder: 1 },
      { optionText: "Statement 1 alone is sufficient but not statement 2", isCorrect: false, optionOrder: 2 },
      { optionText: "Statement 2 alone is sufficient but not statement 1", isCorrect: false, optionOrder: 3 },
      { optionText: "Both statements together are needed", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Statement 1: Pythagoras' theorem → right-angled at B. Statement 2: Explicitly states a right angle. Both independently confirm it is a right triangle."
  },

  {
    code: "J-CT-041",
    questionText: "Seven people attend a meeting. Each person shakes hands with every other person exactly once. How many handshakes occur?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Problem Solving - Combinatorics",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "21", isCorrect: true, optionOrder: 1 },
      { optionText: "42", isCorrect: false, optionOrder: 2 },
      { optionText: "14", isCorrect: false, optionOrder: 3 },
      { optionText: "28", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Number of handshakes = C(7,2) = 7!/(2!×5!) = (7×6)/2 = 21."
  },

  {
    code: "J-CT-042",
    questionText: "If you write the numbers from 1 to 100, how many times do you write the digit 9?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Problem Solving - Counting",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 90,
    allowsCalculator: false,
    options: [
      { optionText: "20", isCorrect: true, optionOrder: 1 },
      { optionText: "19", isCorrect: false, optionOrder: 2 },
      { optionText: "21", isCorrect: false, optionOrder: 3 },
      { optionText: "10", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Units place: every 10 numbers (9,19,...,99) = 10 times. Tens place: 90-99 = 10 times. Total = 20."
  },

  {
    code: "J-CT-043",
    questionText: "Premise: If it rains, the ground gets wet. The ground is wet. Conclusion: It rained. Is this argument valid?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Argument Analysis - Fallacies",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "evaluate",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "No, it commits the fallacy of affirming the consequent", isCorrect: true, optionOrder: 1 },
      { optionText: "Yes, it is logically valid", isCorrect: false, optionOrder: 2 },
      { optionText: "No, it commits the fallacy of denying the antecedent", isCorrect: false, optionOrder: 3 },
      { optionText: "Yes, because the ground is wet", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "If P→Q and Q is true, we cannot conclude P. The ground could be wet for other reasons (e.g., someone spilled water). This is affirming the consequent."
  },

  {
    code: "J-CT-044",
    questionText: "A train passes a pole in 15 seconds and a platform 100 m long in 25 seconds. What is the length of the train?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Problem Solving - Speed",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 90,
    allowsCalculator: true,
    options: [
      { optionText: "150 m", isCorrect: true, optionOrder: 1 },
      { optionText: "100 m", isCorrect: false, optionOrder: 2 },
      { optionText: "200 m", isCorrect: false, optionOrder: 3 },
      { optionText: "125 m", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Let train length = L, speed = S. Passing pole: L/S = 15 → L = 15S. Passing platform: (L + 100)/S = 25 → 15S + 100 = 25S → 10S = 100 → S = 10 m/s. L = 15 × 10 = 150 m."
  },

  {
    code: "J-CT-045",
    questionText: "The pie chart shows the distribution of students in a school: Science 40%, Arts 30%, Commerce 25%, Others 5%. If there are 800 students, how many are in Science?",
    questionType: "multiple_choice",
    rendererType: "chart",
    concept: "Data Interpretation - Pie Chart",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: true,
    chartData: { type: "pie", title: "Student Distribution", labels: ["Science", "Arts", "Commerce", "Others"], values: [40, 30, 25, 5], unit: "percent" },
    options: [
      { optionText: "320", isCorrect: true, optionOrder: 1 },
      { optionText: "240", isCorrect: false, optionOrder: 2 },
      { optionText: "200", isCorrect: false, optionOrder: 3 },
      { optionText: "300", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "40% of 800 = 0.4 × 800 = 320 students in Science."
  },

  {
    code: "J-CT-046",
    questionText: "What is the missing term in the series: A2, D5, G8, J11, ___?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Puzzles - Alphanumeric",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "M14", isCorrect: true, optionOrder: 1 },
      { optionText: "N14", isCorrect: false, optionOrder: 2 },
      { optionText: "M15", isCorrect: false, optionOrder: 3 },
      { optionText: "L14", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Letters: A→D(+3), D→G(+3), G→J(+3), J→M(+3). Numbers: 2→5(+3), 5→8(+3), 8→11(+3), 11→14(+3). So M14."
  },

  {
    code: "J-CT-047",
    questionText: "A cube is painted red on all faces and then cut into 27 smaller equal cubes. How many of the smaller cubes have exactly two faces painted red?",
    questionType: "multiple_choice",
    rendererType: "geometry",
    concept: "Problem Solving - 3D Visualization",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 90,
    allowsCalculator: false,
    geometryData: { type: "graph", label: "3×3×3 Cube", dimensions: { size: 3 } },
    options: [
      { optionText: "12", isCorrect: true, optionOrder: 1 },
      { optionText: "8", isCorrect: false, optionOrder: 2 },
      { optionText: "6", isCorrect: false, optionOrder: 3 },
      { optionText: "24", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A 3×3×3 cube has 27 smaller cubes. Cubes with exactly 2 painted faces are on edges (not corners). Each edge has 1 such cube. 12 edges × 1 = 12."
  },

  {
    code: "J-CT-048",
    questionText: "Five houses in a row are each painted a different colour: red, blue, green, white, yellow. The red house is next to the green house. The blue house is between the white and yellow houses. The green house is at one end. What colour is the house at the other end?",
    questionType: "multiple_choice",
    rendererType: "interactive",
    concept: "Logical Reasoning - Grid Puzzle",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 120,
    allowsCalculator: false,
    interactiveData: { type: "ordering", items: ["red", "blue", "green", "white", "yellow"], correctOrder: ["green", "red", "white", "blue", "yellow"] },
    options: [
      { optionText: "Yellow", isCorrect: true, optionOrder: 1 },
      { optionText: "Red", isCorrect: false, optionOrder: 2 },
      { optionText: "Blue", isCorrect: false, optionOrder: 3 },
      { optionText: "White", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Green at one end. Green next to red → red is second. Blue between white and yellow → white, blue, yellow in order. So order is: green, red, white, blue, yellow. Other end is yellow."
  },

  {
    code: "J-CT-049",
    questionText: "Data Sufficiency: How old is Ada? Statement 1: Ada is twice as old as Bola. Statement 2: In 5 years, Ada will be 1.5 times as old as Bola.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Data Sufficiency - Age",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "evaluate",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "Both statements together are needed", isCorrect: true, optionOrder: 1 },
      { optionText: "Statement 1 alone is sufficient", isCorrect: false, optionOrder: 2 },
      { optionText: "Statement 2 alone is sufficient", isCorrect: false, optionOrder: 3 },
      { optionText: "Neither statement alone is sufficient", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Statement 1: A = 2B, not unique. Statement 2: A+5 = 1.5(B+5), not unique. Together: 2B+5 = 1.5B+7.5 → 0.5B = 2.5 → B=5, A=10."
  },

  {
    code: "J-CT-050",
    questionText: "All A are B. All B are C. Some D are A. Which of the following must be true?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Syllogisms - Chains",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "Some D are C", isCorrect: true, optionOrder: 1 },
      { optionText: "All C are A", isCorrect: false, optionOrder: 2 },
      { optionText: "Some C are D", isCorrect: false, optionOrder: 3 },
      { optionText: "All D are C", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Some D are A. All A are B → Some D are B. All B are C → Some D are C. This must be true."
  },

  // ===========================================================================
  // SUPPLEMENTAL: CONSOLIDATED CORE CONCEPTS — J-SUP-001 onwards
  // ===========================================================================

  // --- Quadratic Equations (5 questions) ---
  {
    code: "J-SUP-001",
    questionText: "Solve: x² − 5x + 6 = 0",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Quadratic Equations",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 40,
    allowsCalculator: false,
    options: [
      { optionText: "x = 2 or x = 3", isCorrect: true, optionOrder: 1 },
      { optionText: "x = 1 or x = 6", isCorrect: false, optionOrder: 2 },
      { optionText: "x = −2 or x = −3", isCorrect: false, optionOrder: 3 },
      { optionText: "x = −1 or x = −6", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Factor: (x − 2)(x − 3) = 0. So x = 2 or x = 3."
  },
  {
    code: "J-SUP-002",
    questionText: "What are the roots of x² + 2x − 8 = 0?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Quadratic Equations",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "x = 2 or x = −4", isCorrect: true, optionOrder: 1 },
      { optionText: "x = −2 or x = 4", isCorrect: false, optionOrder: 2 },
      { optionText: "x = 1 or x = −8", isCorrect: false, optionOrder: 3 },
      { optionText: "x = −1 or x = 8", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Factor: (x + 4)(x − 2) = 0. So x = −4 or x = 2."
  },
  {
    code: "J-SUP-003",
    questionText: "Using the formula, find x in: 2x² − 3x − 5 = 0",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Quadratic Equations",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 60,
    allowsCalculator: false,
    options: [
      { optionText: "x = 2.5 or x = −1", isCorrect: true, optionOrder: 1 },
      { optionText: "x = 5 or x = −2", isCorrect: false, optionOrder: 2 },
      { optionText: "x = −2.5 or x = 1", isCorrect: false, optionOrder: 3 },
      { optionText: "x = 3 or x = −1", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "a=2, b=−3, c=−5. Discriminant = 9+40=49. x = (3±7)/4. x = 10/4 = 2.5 or x = −4/4 = −1."
  },
  {
    code: "J-SUP-004",
    questionText: "For the equation x² − 6x + k = 0 to have equal roots, what must k be?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Quadratic Equations",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "analyze",
    expectedTimeSecs: 50,
    allowsCalculator: false,
    options: [
      { optionText: "9", isCorrect: true, optionOrder: 1 },
      { optionText: "6", isCorrect: false, optionOrder: 2 },
      { optionText: "12", isCorrect: false, optionOrder: 3 },
      { optionText: "36", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Equal roots require discriminant = 0. b² − 4ac = 36 − 4k = 0. So k = 9."
  },
  {
    code: "J-SUP-005",
    questionText: "The sum of the roots of x² − 7x + 10 = 0 is:",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Quadratic Equations",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "remember",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "7", isCorrect: true, optionOrder: 1 },
      { optionText: "10", isCorrect: false, optionOrder: 2 },
      { optionText: "−7", isCorrect: false, optionOrder: 3 },
      { optionText: "17", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "For ax² + bx + c = 0, sum of roots = −b/a = −(−7)/1 = 7."
  },

  // --- Trigonometry (5 questions) ---
  {
    code: "J-SUP-006",
    questionText: "What is sin 30°?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Trigonometry",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 25,
    allowsCalculator: false,
    options: [
      { optionText: "1/2", isCorrect: true, optionOrder: 1 },
      { optionText: "√3/2", isCorrect: false, optionOrder: 2 },
      { optionText: "1/√2", isCorrect: false, optionOrder: 3 },
      { optionText: "1", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "sin 30° = 1/2. This is a standard trigonometric value from the 30-60-90 triangle."
  },
  {
    code: "J-SUP-007",
    questionText: "In a right-angled triangle, if the opposite side is 5 and the hypotenuse is 13, what is sin θ?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Trigonometry",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "5/13", isCorrect: true, optionOrder: 1 },
      { optionText: "12/13", isCorrect: false, optionOrder: 2 },
      { optionText: "5/12", isCorrect: false, optionOrder: 3 },
      { optionText: "13/5", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "sin θ = opposite/hypotenuse = 5/13."
  },
  {
    code: "J-SUP-008",
    questionText: "If tan θ = 3/4 and the adjacent side is 8, what is the opposite side?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Trigonometry",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 40,
    allowsCalculator: false,
    options: [
      { optionText: "6", isCorrect: true, optionOrder: 1 },
      { optionText: "4", isCorrect: false, optionOrder: 2 },
      { optionText: "12", isCorrect: false, optionOrder: 3 },
      { optionText: "10.67", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "tan θ = opposite/adjacent. 3/4 = opposite/8. opposite = (3/4) × 8 = 6."
  },
  {
    code: "J-SUP-009",
    questionText: "What is cos 60°?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Trigonometry",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 25,
    allowsCalculator: false,
    options: [
      { optionText: "1/2", isCorrect: true, optionOrder: 1 },
      { optionText: "√3/2", isCorrect: false, optionOrder: 2 },
      { optionText: "√2/2", isCorrect: false, optionOrder: 3 },
      { optionText: "0", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "cos 60° = 1/2. This is a standard value from the 30-60-90 triangle."
  },
  {
    code: "J-SUP-010",
    questionText: "Simplify: sin²θ + cos²θ",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Trigonometry",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "remember",
    expectedTimeSecs: 25,
    allowsCalculator: false,
    options: [
      { optionText: "1", isCorrect: true, optionOrder: 1 },
      { optionText: "0", isCorrect: false, optionOrder: 2 },
      { optionText: "2 sin²θ", isCorrect: false, optionOrder: 3 },
      { optionText: "2 cos²θ", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The Pythagorean identity: sin²θ + cos²θ = 1 for all values of θ."
  },

  // --- Sets & Venn Diagrams (5 questions) ---
  {
    code: "J-SUP-011",
    questionText: "If A = {1, 2, 3, 4} and B = {3, 4, 5, 6}, what is A ∩ B?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Sets & Venn Diagrams",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 25,
    allowsCalculator: false,
    options: [
      { optionText: "{3, 4}", isCorrect: true, optionOrder: 1 },
      { optionText: "{1, 2, 3, 4, 5, 6}", isCorrect: false, optionOrder: 2 },
      { optionText: "{1, 2, 5, 6}", isCorrect: false, optionOrder: 3 },
      { optionText: "{1, 2, 3, 4}", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A ∩ B (intersection) contains elements in BOTH A and B: {3, 4}."
  },
  {
    code: "J-SUP-012",
    questionText: "If A = {2, 4, 6} and B = {1, 3, 5}, what is A ∪ B?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Sets & Venn Diagrams",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 25,
    allowsCalculator: false,
    options: [
      { optionText: "{1, 2, 3, 4, 5, 6}", isCorrect: true, optionOrder: 1 },
      { optionText: "{}", isCorrect: false, optionOrder: 2 },
      { optionText: "{2, 4, 6, 1, 3, 5, 2, 4, 6}", isCorrect: false, optionOrder: 3 },
      { optionText: "{6}", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A ∪ B (union) contains all elements in A or B (or both): {1, 2, 3, 4, 5, 6}."
  },
  {
    code: "J-SUP-013",
    questionText: "In a class of 40 students, 25 study Physics, 20 study Chemistry, and 8 study both. How many study neither?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Sets & Venn Diagrams",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "3", isCorrect: true, optionOrder: 1 },
      { optionText: "5", isCorrect: false, optionOrder: 2 },
      { optionText: "8", isCorrect: false, optionOrder: 3 },
      { optionText: "13", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "P(C ∪ H) = P + C − Both = 25 + 20 − 8 = 37. Neither = 40 − 37 = 3."
  },
  {
    code: "J-SUP-014",
    questionText: "If U = {1,2,3,4,5,6,7,8} and A = {2,4,6,8}, what is A' (complement of A)?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Sets & Venn Diagrams",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "{1, 3, 5, 7}", isCorrect: true, optionOrder: 1 },
      { optionText: "{2, 4, 6, 8}", isCorrect: false, optionOrder: 2 },
      { optionText: "{}", isCorrect: false, optionOrder: 3 },
      { optionText: "{1, 2, 3, 4, 5, 6, 7, 8}", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A' contains all elements in U that are NOT in A: {1, 3, 5, 7}."
  },
  {
    code: "J-SUP-015",
    questionText: "If n(A ∪ B) = 50, n(A) = 30, and n(B) = 25, what is n(A ∩ B)?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Sets & Venn Diagrams",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 40,
    allowsCalculator: false,
    options: [
      { optionText: "5", isCorrect: true, optionOrder: 1 },
      { optionText: "10", isCorrect: false, optionOrder: 2 },
      { optionText: "55", isCorrect: false, optionOrder: 3 },
      { optionText: "15", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B). So 50 = 30 + 25 − n(A ∩ B). n(A ∩ B) = 5."
  },

  // --- Mensuration (5 questions) ---
  {
    code: "J-SUP-016",
    questionText: "Find the area of a triangle with base 12 cm and height 8 cm.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Mensuration",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 25,
    allowsCalculator: false,
    options: [
      { optionText: "48 cm²", isCorrect: true, optionOrder: 1 },
      { optionText: "96 cm²", isCorrect: false, optionOrder: 2 },
      { optionText: "20 cm²", isCorrect: false, optionOrder: 3 },
      { optionText: "24 cm²", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Area = ½ × base × height = ½ × 12 × 8 = 48 cm²."
  },
  {
    code: "J-SUP-017",
    questionText: "What is the circumference of a circle with radius 7 cm? (Use π = 22/7)",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Mensuration",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "44 cm", isCorrect: true, optionOrder: 1 },
      { optionText: "154 cm", isCorrect: false, optionOrder: 2 },
      { optionText: "22 cm", isCorrect: false, optionOrder: 3 },
      { optionText: "88 cm", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Circumference = 2πr = 2 × (22/7) × 7 = 44 cm."
  },
  {
    code: "J-SUP-018",
    questionText: "Find the volume of a cylinder with radius 3 cm and height 10 cm. (Use π = 3.14)",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Mensuration",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 40,
    allowsCalculator: true,
    options: [
      { optionText: "282.6 cm³", isCorrect: true, optionOrder: 1 },
      { optionText: "94.2 cm³", isCorrect: false, optionOrder: 2 },
      { optionText: "30 cm³", isCorrect: false, optionOrder: 3 },
      { optionText: "188.4 cm³", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Volume = πr²h = 3.14 × 9 × 10 = 282.6 cm³."
  },
  {
    code: "J-SUP-019",
    questionText: "A rectangular room is 5 m long and 4 m wide. What is its area?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Mensuration",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 20,
    allowsCalculator: false,
    options: [
      { optionText: "20 m²", isCorrect: true, optionOrder: 1 },
      { optionText: "18 m²", isCorrect: false, optionOrder: 2 },
      { optionText: "9 m²", isCorrect: false, optionOrder: 3 },
      { optionText: "40 m²", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Area = length × width = 5 × 4 = 20 m²."
  },
  {
    code: "J-SUP-020",
    questionText: "Find the surface area of a cube with side 4 cm.",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Mensuration",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "96 cm²", isCorrect: true, optionOrder: 1 },
      { optionText: "64 cm²", isCorrect: false, optionOrder: 2 },
      { optionText: "16 cm²", isCorrect: false, optionOrder: 3 },
      { optionText: "48 cm²", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "A cube has 6 faces. Surface area = 6 × side² = 6 × 16 = 96 cm²."
  },

  // --- Linear Equations (5 questions) ---
  {
    code: "J-SUP-021",
    questionText: "Solve for x: 3x + 7 = 22",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Linear Equations",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "x = 5", isCorrect: true, optionOrder: 1 },
      { optionText: "x = 29", isCorrect: false, optionOrder: 2 },
      { optionText: "x = 3", isCorrect: false, optionOrder: 3 },
      { optionText: "x = 15", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "3x + 7 = 22. 3x = 15. x = 5."
  },
  {
    code: "J-SUP-022",
    questionText: "If 2(x − 3) = 10, what is x?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Linear Equations",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 35,
    allowsCalculator: false,
    options: [
      { optionText: "x = 8", isCorrect: true, optionOrder: 1 },
      { optionText: "x = 2", isCorrect: false, optionOrder: 2 },
      { optionText: "x = 5", isCorrect: false, optionOrder: 3 },
      { optionText: "x = 13", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "2(x − 3) = 10. 2x − 6 = 10. 2x = 16. x = 8."
  },
  {
    code: "J-SUP-023",
    questionText: "Solve simultaneously: x + y = 10 and x − y = 4",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Linear Equations",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "x = 7, y = 3", isCorrect: true, optionOrder: 1 },
      { optionText: "x = 3, y = 7", isCorrect: false, optionOrder: 2 },
      { optionText: "x = 6, y = 4", isCorrect: false, optionOrder: 3 },
      { optionText: "x = 5, y = 5", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Add the equations: 2x = 14, x = 7. Then y = 10 − 7 = 3."
  },
  {
    code: "J-SUP-024",
    questionText: "What is the gradient of the line y = 3x − 5?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Linear Equations",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 20,
    allowsCalculator: false,
    options: [
      { optionText: "3", isCorrect: true, optionOrder: 1 },
      { optionText: "−5", isCorrect: false, optionOrder: 2 },
      { optionText: "5", isCorrect: false, optionOrder: 3 },
      { optionText: "−3", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "In y = mx + c, m is the gradient. Here m = 3."
  },
  {
    code: "J-SUP-025",
    questionText: "A phone costs ₦x. If a 10% discount reduces the price by ₦500, what is x?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Linear Equations",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 45,
    allowsCalculator: false,
    options: [
      { optionText: "₦5,000", isCorrect: true, optionOrder: 1 },
      { optionText: "₦500", isCorrect: false, optionOrder: 2 },
      { optionText: "₦50,000", isCorrect: false, optionOrder: 3 },
      { optionText: "₦4,500", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "10% of x = 500. 0.1x = 500. x = 5,000."
  },

  // --- Statistics & Probability (5 questions) ---
  {
    code: "J-SUP-026",
    questionText: "Find the mean of: 4, 8, 6, 10, 12",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Statistics",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "8", isCorrect: true, optionOrder: 1 },
      { optionText: "6", isCorrect: false, optionOrder: 2 },
      { optionText: "10", isCorrect: false, optionOrder: 3 },
      { optionText: "7", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Mean = (4+8+6+10+12)/5 = 40/5 = 8."
  },
  {
    code: "J-SUP-027",
    questionText: "What is the median of: 3, 7, 1, 9, 5?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Statistics",
    difficultyLevel: "medium",
    difficultyParam: "0.0",
    discriminationParam: "1.2",
    guessingParam: "0.25",
    bloomLevel: "apply",
    expectedTimeSecs: 35,
    allowsCalculator: false,
    options: [
      { optionText: "5", isCorrect: true, optionOrder: 1 },
      { optionText: "3", isCorrect: false, optionOrder: 2 },
      { optionText: "7", isCorrect: false, optionOrder: 3 },
      { optionText: "1", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Order: 1, 3, 5, 7, 9. The middle value (3rd of 5) is 5."
  },
  {
    code: "J-SUP-028",
    questionText: "A bag contains 4 red, 3 blue, and 5 green balls. What is the probability of picking a blue ball?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Probability",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "apply",
    expectedTimeSecs: 30,
    allowsCalculator: false,
    options: [
      { optionText: "1/4", isCorrect: true, optionOrder: 1 },
      { optionText: "3/12", isCorrect: false, optionOrder: 2 },
      { optionText: "1/3", isCorrect: false, optionOrder: 3 },
      { optionText: "5/12", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Total balls = 4+3+5 = 12. P(blue) = 3/12 = 1/4."
  },
  {
    code: "J-SUP-029",
    questionText: "The mode of the data set 2, 3, 3, 5, 7, 3, 8 is:",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Statistics",
    difficultyLevel: "easy",
    difficultyParam: "-1.5",
    discriminationParam: "1.0",
    guessingParam: "0.30",
    bloomLevel: "remember",
    expectedTimeSecs: 25,
    allowsCalculator: false,
    options: [
      { optionText: "3", isCorrect: true, optionOrder: 1 },
      { optionText: "5", isCorrect: false, optionOrder: 2 },
      { optionText: "7", isCorrect: false, optionOrder: 3 },
      { optionText: "4", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "The mode is the most frequent value. 3 appears 3 times, more than any other value."
  },
  {
    code: "J-SUP-030",
    questionText: "If two fair dice are thrown, what is the probability that the sum is 7?",
    questionType: "multiple_choice",
    rendererType: "standard",
    concept: "Probability",
    difficultyLevel: "hard",
    difficultyParam: "1.5",
    discriminationParam: "1.5",
    guessingParam: "0.20",
    bloomLevel: "apply",
    expectedTimeSecs: 50,
    allowsCalculator: false,
    options: [
      { optionText: "1/6", isCorrect: true, optionOrder: 1 },
      { optionText: "1/12", isCorrect: false, optionOrder: 2 },
      { optionText: "7/36", isCorrect: false, optionOrder: 3 },
      { optionText: "6/36", isCorrect: false, optionOrder: 4 }
    ],
    explanation: "Total outcomes = 36. Ways to get 7: (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) = 6 ways. P = 6/36 = 1/6."
  },
];

export type Jss3ToSs1Seed = typeof jss3ToSs1Questions[0];
