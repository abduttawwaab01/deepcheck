import type { AssessmentConfig } from "./types";

const assessment: AssessmentConfig = {
  id: "ss3-to-university",
  title: "SS3 → University Readiness Assessment",
  level: "ss3_to_university",
  description:
    "Measures advanced mathematics, critical literacy, and academic readiness for tertiary education.",
  questionCount: 30,
  timeLimitMinutes: 45,
  sections: [
    {
      name: "Mathematics",
      count: 10,
      concepts: ["Calculus", "Vectors", "Probability", "Data analysis"],
    },
    {
      name: "Critical Literacy",
      count: 10,
      concepts: [
        "Academic reading",
        "Argument analysis",
        "Fallacies",
        "Academic writing",
      ],
    },
    {
      name: "Reasoning & Readiness",
      count: 10,
      concepts: [
        "Logic",
        "Research methods",
        "Study skills",
        "Ethics",
      ],
    },
  ],
  questions: [
    // ─────────────────────────────────────────────
    // MATHEMATICS — Questions 01–10
    // ─────────────────────────────────────────────
    {
      id: "ss3-uni-01",
      renderer: "standard",
      questionText:
        "What is the derivative of f(x) = x³ + 2x² − 5x + 7 with respect to x?",
      options: [
        { id: "a", text: "3x² + 4x − 5" },
        { id: "b", text: "3x² + 4x + 5" },
        { id: "c", text: "3x² + 2x − 5" },
        { id: "d", text: "x⁴ + 2x³ − 5x² + 7x" },
      ],
      correctOptionId: "a",
      concept: "Differentiation",
      bloomLevel: "apply",
      difficulty: 0.55,
      discrimination: 1.3,
      guessing: 0.2,
      expectedTimeSecs: 60,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-02",
      renderer: "geometry",
      questionText:
        "The graph shows f(x) = 2x² − 3x + 1 with a tangent line drawn at point P where x = 2. What is the gradient of the tangent at P?",
      geometryData: {
        type: "graph",
        label:
          "Coordinate plane showing parabola f(x) = 2x² − 3x + 1 and tangent line at P(2, 3)",
        dimensions: {
          pointX: 2,
          pointY: 3,
          slope: 5,
          yIntercept: -7,
        },
        markings: ["Point P(2, 3) labelled", "Tangent line through P"],
      },
      options: [
        { id: "a", text: "5" },
        { id: "b", text: "4" },
        { id: "c", text: "6" },
        { id: "d", text: "3" },
      ],
      correctOptionId: "a",
      concept: "Differentiation",
      bloomLevel: "apply",
      difficulty: 0.6,
      discrimination: 1.3,
      guessing: 0.2,
      expectedTimeSecs: 75,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-03",
      renderer: "geometry",
      questionText:
        "The vector diagram shows vectors p and q. Given p = (3, −2) and q = (−1, 4), what is p + q?",
      geometryData: {
        type: "graph",
        label:
          "Vector diagram showing p = (3, −2) and q = (−1, 4) as arrows from the origin",
        dimensions: {
          pX: 3,
          pY: -2,
          qX: -1,
          qY: 4,
        },
        markings: [
          "Vector p labelled (3, −2)",
          "Vector q labelled (−1, 4)",
        ],
      },
      options: [
        { id: "a", text: "(2, 2)" },
        { id: "b", text: "(4, −6)" },
        { id: "c", text: "(2, −2)" },
        { id: "d", text: "(4, 2)" },
      ],
      correctOptionId: "a",
      concept: "Vector Addition",
      bloomLevel: "apply",
      difficulty: 0.55,
      discrimination: 1.2,
      guessing: 0.2,
      expectedTimeSecs: 60,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-04",
      renderer: "standard",
      questionText:
        "A student must select 3 elective courses from a list of 8 available electives. How many different combinations of electives can the student choose?",
      options: [
        { id: "a", text: "24" },
        { id: "b", text: "56" },
        { id: "c", text: "336" },
        { id: "d", text: "112" },
      ],
      correctOptionId: "b",
      concept: "Probability",
      bloomLevel: "apply",
      difficulty: 0.6,
      discrimination: 1.2,
      guessing: 0.2,
      expectedTimeSecs: 65,
      allowsCalculator: true,
    },
    {
      id: "ss3-uni-05",
      renderer: "standard",
      questionText:
        "A bag contains 5 red marbles and 3 blue marbles. Two marbles are drawn without replacement. Which expression correctly gives the probability that both marbles are red?",
      options: [
        { id: "a", text: "(5/8) × (5/8)" },
        { id: "b", text: "(5/8) × (4/7)" },
        { id: "c", text: "(5/8) × (4/8)" },
        { id: "d", text: "(5/8) + (4/7)" },
      ],
      correctOptionId: "b",
      concept: "Probability",
      bloomLevel: "apply",
      difficulty: 0.65,
      discrimination: 1.3,
      guessing: 0.2,
      expectedTimeSecs: 60,
      allowsCalculator: true,
    },
    {
      id: "ss3-uni-06",
      renderer: "standard",
      questionText:
        "Evaluate the indefinite integral ∫(6x² − 4x + 3) dx.",
      options: [
        { id: "a", text: "2x³ − 2x² + 3x + C" },
        { id: "b", text: "6x³ − 4x² + 3x + C" },
        { id: "c", text: "2x³ − 4x² + 3x + C" },
        { id: "d", text: "12x − 4 + C" },
      ],
      correctOptionId: "a",
      concept: "Integration",
      bloomLevel: "apply",
      difficulty: 0.55,
      discrimination: 1.2,
      guessing: 0.2,
      expectedTimeSecs: 65,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-07",
      renderer: "standard",
      questionText:
        "A company\u2019s profit function is P(x) = −2x² + 120x − 1000, where x is the number of units produced in hundreds and P is in thousands of dollars. How many units must be produced to achieve the maximum profit, and what is that profit?",
      options: [
        {
          id: "a",
          text: "800 units yielding a maximum profit of $800,000",
        },
        {
          id: "b",
          text: "3,000 units yielding a maximum profit of $800,000",
        },
        {
          id: "c",
          text: "3,000 units yielding a maximum profit of $1,200,000",
        },
        {
          id: "d",
          text: "800 units yielding a maximum profit of $3,000,000",
        },
      ],
      correctOptionId: "b",
      concept: "Complex Problem Solving",
      bloomLevel: "analyze",
      difficulty: 0.75,
      discrimination: 1.5,
      guessing: 0.2,
      expectedTimeSecs: 90,
      allowsCalculator: true,
    },
    {
      id: "ss3-uni-08",
      renderer: "chart",
      questionText:
        "The line chart shows the growth of a bacterial population modelled by P(t) = 50 × 2^(t/2), where t is time in hours. What is the doubling time of this population?",
      chartData: {
        type: "line",
        title: "Bacterial Population Growth",
        labels: ["0", "1", "2", "3", "4", "5", "6"],
        values: [50, 71, 100, 141, 200, 283, 400],
        unit: "Population (cells/mL)",
      },
      options: [
        { id: "a", text: "1 hour" },
        { id: "b", text: "2 hours" },
        { id: "c", text: "3 hours" },
        { id: "d", text: "0.5 hours" },
      ],
      correctOptionId: "b",
      concept: "Data Modelling",
      bloomLevel: "analyze",
      difficulty: 0.7,
      discrimination: 1.4,
      guessing: 0.2,
      expectedTimeSecs: 80,
      allowsCalculator: true,
    },
    {
      id: "ss3-uni-09",
      renderer: "chart",
      questionText:
        "The chart shows the relationship between hours studied per week and final exam scores for 20 students. Which best describes the correlation shown?",
      chartData: {
        type: "line",
        title: "Hours Studied vs. Exam Score",
        labels: ["5", "10", "15", "20", "25", "30", "35"],
        values: [42, 55, 63, 68, 74, 81, 78],
        unit: "Exam score (%)",
      },
      options: [
        { id: "a", text: "Strong positive correlation" },
        { id: "b", text: "Weak negative correlation" },
        { id: "c", text: "No correlation" },
        { id: "d", text: "Strong negative correlation" },
      ],
      correctOptionId: "a",
      concept: "Correlation",
      bloomLevel: "analyze",
      difficulty: 0.6,
      discrimination: 1.2,
      guessing: 0.2,
      expectedTimeSecs: 55,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-10",
      renderer: "standard",
      questionText:
        "In a large lecture course, final exam scores have a mean of 68 and a standard deviation of 12. Which of the following is the most accurate interpretation of the standard deviation?",
      options: [
        { id: "a", text: "The highest score on the exam was 80." },
        {
          id: "b",
          text: "Scores typically differ from the mean by about 12 points.",
        },
        {
          id: "c",
          text: "Most students scored above 68 on the exam.",
        },
        {
          id: "d",
          text: "The median score is 12 points higher than the mean.",
        },
      ],
      correctOptionId: "b",
      concept: "Statistics",
      bloomLevel: "evaluate",
      difficulty: 0.65,
      discrimination: 1.3,
      guessing: 0.2,
      expectedTimeSecs: 50,
      allowsCalculator: false,
    },

    // ─────────────────────────────────────────────
    // CRITICAL LITERACY — Questions 11–20
    // ─────────────────────────────────────────────
    {
      id: "ss3-uni-11",
      renderer: "passage",
      questionText:
        "What is the main argument of the passage?",
      passageText:
        "Recent research in cognitive science has examined the relationship between cognitive load and multimedia learning. Mayer\u2019s cognitive theory of multimedia learning posits that learners process visual and auditory information through separate channels, each with limited capacity. A study by Chen and Chang (2023) investigated whether reducing extraneous cognitive load through segmenting instructional videos improved knowledge retention among 240 undergraduate students. Participants were randomly assigned to either a segmented video condition (videos divided into 5-minute segments with interleaved practice questions) or a continuous video condition (full 25-minute videos without interruption). Results indicated that students in the segmented condition scored significantly higher on a post-test administered one week later (M = 78.4, SD = 8.2) compared to the continuous condition (M = 65.7, SD = 10.1), t(238) = 4.83, p < .001. The researchers concluded that segmenting reduces cognitive overload and facilitates deeper encoding of information.",
      options: [
        {
          id: "a",
          text: "Multimedia learning is ineffective for undergraduate students.",
        },
        {
          id: "b",
          text: "Segmenting instructional videos into shorter segments with practice questions significantly improves knowledge retention.",
        },
        {
          id: "c",
          text: "Visual and auditory information are processed through a single channel in the brain.",
        },
        {
          id: "d",
          text: "The length of instructional videos does not affect learning outcomes.",
        },
      ],
      correctOptionId: "b",
      concept: "Academic Reading",
      bloomLevel: "analyze",
      difficulty: 0.6,
      discrimination: 1.2,
      guessing: 0.2,
      expectedTimeSecs: 90,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-12",
      renderer: "passage",
      questionText:
        "Which research methodology was employed in the study by Chen and Chang described in the passage?",
      passageText:
        "Recent research in cognitive science has examined the relationship between cognitive load and multimedia learning. Mayer\u2019s cognitive theory of multimedia learning posits that learners process visual and auditory information through separate channels, each with limited capacity. A study by Chen and Chang (2023) investigated whether reducing extraneous cognitive load through segmenting instructional videos improved knowledge retention among 240 undergraduate students. Participants were randomly assigned to either a segmented video condition (videos divided into 5-minute segments with interleaved practice questions) or a continuous video condition (full 25-minute videos without interruption). Results indicated that students in the segmented condition scored significantly higher on a post-test administered one week later (M = 78.4, SD = 8.2) compared to the continuous condition (M = 65.7, SD = 10.1), t(238) = 4.83, p < .001. The researchers concluded that segmenting reduces cognitive overload and facilitates deeper encoding of information.",
      options: [
        {
          id: "a",
          text: "A correlational study examining the relationship between video length and test scores.",
        },
        {
          id: "b",
          text: "A qualitative analysis of student perceptions of instructional videos.",
        },
        {
          id: "c",
          text: "A randomised controlled experiment comparing segmented and continuous video conditions.",
        },
        {
          id: "d",
          text: "A longitudinal study tracking students over multiple semesters.",
        },
      ],
      correctOptionId: "c",
      concept: "Academic Reading",
      bloomLevel: "analyze",
      difficulty: 0.65,
      discrimination: 1.3,
      guessing: 0.2,
      expectedTimeSecs: 90,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-13",
      renderer: "passage",
      questionText:
        "In the context of the passage, the word \u2018amplifies\u2019 most nearly means:",
      passageText:
        "Polymerase chain reaction (PCR) is a fundamental technique in molecular biology that amplifies specific DNA sequences. The process involves repeated thermal cycling to denature DNA, anneal primers, and extend new DNA strands. In a typical protocol, the reaction mixture undergoes approximately 30\u201335 cycles, each consisting of three stages: denaturation at 94\u201398\u00b0C, annealing at 50\u201365\u00b0C, and extension at 72\u00b0C. The specificity of PCR depends critically on primer design; primers with melting temperatures (Tm) that are too low may anneal non-specifically, while primers with complementary 3\u2032 ends can form primer-dimers that inhibit amplification. Recent advances include digital PCR (dPCR), which enables absolute quantification of nucleic acids without standard curves. Unlike conventional PCR, dPCR partitions the sample into thousands of individual reactions, and the proportion of positive partitions is used to calculate the initial target concentration using Poisson statistics.",
      options: [
        {
          id: "a",
          text: "Increases the volume of sound",
        },
        {
          id: "b",
          text: "Copies or multiplies genetic material",
        },
        {
          id: "c",
          text: "Strengthens an electrical signal",
        },
        {
          id: "d",
          text: "Exaggerates the importance of a finding",
        },
      ],
      correctOptionId: "b",
      concept: "Academic Reading",
      bloomLevel: "understand",
      difficulty: 0.6,
      discrimination: 1.1,
      guessing: 0.2,
      expectedTimeSecs: 70,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-14",
      renderer: "passage",
      questionText:
        "Which of the following can be reasonably inferred from the passage about PCR?",
      passageText:
        "Polymerase chain reaction (PCR) is a fundamental technique in molecular biology that amplifies specific DNA sequences. The process involves repeated thermal cycling to denature DNA, anneal primers, and extend new DNA strands. In a typical protocol, the reaction mixture undergoes approximately 30\u201335 cycles, each consisting of three stages: denaturation at 94\u201398\u00b0C, annealing at 50\u201365\u00b0C, and extension at 72\u00b0C. The specificity of PCR depends critically on primer design; primers with melting temperatures (Tm) that are too low may anneal non-specifically, while primers with complementary 3\u2032 ends can form primer-dimers that inhibit amplification. Recent advances include digital PCR (dPCR), which enables absolute quantification of nucleic acids without standard curves. Unlike conventional PCR, dPCR partitions the sample into thousands of individual reactions, and the proportion of positive partitions is used to calculate the initial target concentration using Poisson statistics.",
      options: [
        {
          id: "a",
          text: "PCR can only be used to amplify RNA sequences.",
        },
        {
          id: "b",
          text: "Digital PCR requires a standard curve for absolute quantification.",
        },
        {
          id: "c",
          text: "Poor primer design can reduce the effectiveness of PCR amplification.",
        },
        {
          id: "d",
          text: "All PCR protocols use exactly 35 cycles for optimal results.",
        },
      ],
      correctOptionId: "c",
      concept: "Academic Reading",
      bloomLevel: "analyze",
      difficulty: 0.65,
      discrimination: 1.3,
      guessing: 0.2,
      expectedTimeSecs: 80,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-15",
      renderer: "standard",
      questionText:
        "\u2018We should not allow students to use smartphones in class because if we permit smartphones, next they will demand tablets, then laptops, and soon they will be watching movies during lessons.\u2019 This argument commits which logical fallacy?",
      options: [
        { id: "a", text: "Straw man" },
        { id: "b", text: "Slippery slope" },
        { id: "c", text: "Ad hominem" },
        { id: "d", text: "False dilemma" },
      ],
      correctOptionId: "b",
      concept: "Fallacies",
      bloomLevel: "evaluate",
      difficulty: 0.7,
      discrimination: 1.4,
      guessing: 0.2,
      expectedTimeSecs: 50,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-16",
      renderer: "standard",
      questionText:
        "Read the following argument: \u2018All universities should require first-year students to take a writing-intensive course because research shows that students who complete such courses have higher graduation rates. However, some faculty argue that mandatory courses reduce academic freedom.\u2019 In this argument, the statement \u2018research shows that students who complete such courses have higher graduation rates\u2019 functions as:",
      options: [
        { id: "a", text: "The conclusion" },
        { id: "b", text: "A premise supporting the conclusion" },
        { id: "c", text: "A counter-argument" },
        { id: "d", text: "An unrelated observation" },
      ],
      correctOptionId: "b",
      concept: "Argument Analysis",
      bloomLevel: "analyze",
      difficulty: 0.6,
      discrimination: 1.2,
      guessing: 0.2,
      expectedTimeSecs: 55,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-17",
      renderer: "standard",
      questionText:
        "Which of the following is the strongest thesis statement for an argumentative essay on universal basic income (UBI)?",
      options: [
        {
          id: "a",
          text: "Universal basic income is a topic that many people discuss.",
        },
        {
          id: "b",
          text: "Universal basic income has both benefits and drawbacks depending on how it is implemented.",
        },
        {
          id: "c",
          text: "Implementing a universal basic income of $1,000 per month would reduce poverty rates while stimulating local economies, making it a viable policy for post-industrial economies.",
        },
        {
          id: "d",
          text: "I will discuss universal basic income in this essay.",
        },
      ],
      correctOptionId: "c",
      concept: "Academic Writing",
      bloomLevel: "evaluate",
      difficulty: 0.65,
      discrimination: 1.3,
      guessing: 0.2,
      expectedTimeSecs: 55,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-18",
      renderer: "standard",
      questionText:
        "The researcher\u2019s findings _____ the hypothesis that sleep deprivation impairs cognitive function, as the experimental group performed significantly worse than the control group.",
      options: [
        { id: "a", text: "corroborate" },
        { id: "b", text: "convolve" },
        { id: "c", text: "correlate" },
        { id: "d", text: "collaborate" },
      ],
      correctOptionId: "a",
      concept: "Academic Vocabulary",
      bloomLevel: "understand",
      difficulty: 0.55,
      discrimination: 1.1,
      guessing: 0.2,
      expectedTimeSecs: 40,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-19",
      renderer: "standard",
      questionText:
        "For a research paper on the effectiveness of mindfulness-based interventions for treating anxiety disorders, which of the following would be the most credible source?",
      options: [
        {
          id: "a",
          text: "A blog post by a meditation teacher with 20 years of experience",
        },
        {
          id: "b",
          text: "A peer-reviewed meta-analysis published in the Journal of Clinical Psychology",
        },
        {
          id: "c",
          text: "A YouTube video describing personal experiences with mindfulness",
        },
        {
          id: "d",
          text: "A newspaper article summarising recent trends in mental health treatment",
        },
      ],
      correctOptionId: "b",
      concept: "Source Evaluation",
      bloomLevel: "evaluate",
      difficulty: 0.6,
      discrimination: 1.2,
      guessing: 0.2,
      expectedTimeSecs: 45,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-20",
      renderer: "interactive",
      questionText:
        "Arrange the following steps of the academic writing process in the correct chronological order.",
      interactiveData: {
        type: "ordering",
        items: [
          "Conduct background research",
          "Develop a thesis statement",
          "Outline main arguments",
          "Write the first draft",
          "Revise and edit",
          "Proofread final draft",
        ],
        correctOrder: [
          "Conduct background research",
          "Develop a thesis statement",
          "Outline main arguments",
          "Write the first draft",
          "Revise and edit",
          "Proofread final draft",
        ],
      },
      options: [
        {
          id: "a",
          text: "Drag items to arrange in the correct order",
        },
      ],
      correctOptionId: "a",
      concept: "Academic Writing",
      bloomLevel: "analyze",
      difficulty: 0.55,
      discrimination: 1.1,
      guessing: 0.2,
      expectedTimeSecs: 80,
      allowsCalculator: false,
    },

    // ─────────────────────────────────────────────
    // REASONING & READINESS — Questions 21–30
    // ─────────────────────────────────────────────
    {
      id: "ss3-uni-21",
      renderer: "standard",
      questionText:
        "Given that proposition p is true and proposition q is false, what is the truth value of the compound statement (p \u2228 q) \u2227 \u00acq?",
      options: [
        { id: "a", text: "True" },
        { id: "b", text: "False" },
        { id: "c", text: "Cannot be determined" },
      ],
      correctOptionId: "a",
      concept: "Formal Logic",
      bloomLevel: "apply",
      difficulty: 0.65,
      discrimination: 1.4,
      guessing: 0.25,
      expectedTimeSecs: 60,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-22",
      renderer: "chart",
      questionText:
        "A researcher conducts an experiment to test the effect of three different fertilisers on plant growth. The chart shows the mean plant height after 4 weeks. What is the dependent variable in this experiment?",
      chartData: {
        type: "bar",
        title: "Mean Plant Height by Fertiliser Type",
        labels: ["Fertiliser A", "Fertiliser B", "Control"],
        values: [24.5, 18.3, 12.1],
        unit: "Height (cm)",
      },
      options: [
        { id: "a", text: "Fertiliser type" },
        { id: "b", text: "Plant height" },
        { id: "c", text: "Number of plants" },
        { id: "d", text: "Duration of the experiment" },
      ],
      correctOptionId: "b",
      concept: "Research Methodology",
      bloomLevel: "analyze",
      difficulty: 0.55,
      discrimination: 1.2,
      guessing: 0.2,
      expectedTimeSecs: 50,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-23",
      renderer: "standard",
      questionText:
        "A researcher wants to determine whether a new teaching method improves student performance compared to the traditional method. Which of the following correctly states the null hypothesis (H\u2080)?",
      options: [
        {
          id: "a",
          text: "The new teaching method significantly improves student performance.",
        },
        {
          id: "b",
          text: "There is no significant difference in student performance between the new method and the traditional method.",
        },
        {
          id: "c",
          text: "The traditional teaching method is inferior to the new method.",
        },
        {
          id: "d",
          text: "Student performance will decrease under the new teaching method.",
        },
      ],
      correctOptionId: "b",
      concept: "Hypothesis Testing",
      bloomLevel: "understand",
      difficulty: 0.6,
      discrimination: 1.3,
      guessing: 0.2,
      expectedTimeSecs: 50,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-24",
      renderer: "standard",
      questionText:
        "A student has four assignments due next week with the following deadlines and grade weightings:\n\n\u2022 Assignment W: Monday, worth 5% of final grade\n\u2022 Assignment X: Wednesday, worth 20% of final grade\n\u2022 Assignment Y: Thursday, worth 15% of final grade\n\u2022 Assignment Z: Friday, worth 30% of final grade\n\nWhich of the following represents the most effective prioritisation strategy?",
      options: [
        {
          id: "a",
          text: "Complete W first (most urgent), then X (urgent and important), then Y, then Z (least urgent but most important)",
        },
        {
          id: "b",
          text: "Complete Z first (most important), then X and Y, then W last",
        },
        {
          id: "c",
          text: "Work on all assignments simultaneously for one hour each day",
        },
        {
          id: "d",
          text: "Complete Y first (moderate urgency), then Z, then X, then W",
        },
      ],
      correctOptionId: "a",
      concept: "Time Management",
      bloomLevel: "evaluate",
      difficulty: 0.7,
      discrimination: 1.4,
      guessing: 0.2,
      expectedTimeSecs: 65,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-25",
      renderer: "passage",
      questionText:
        "According to the passage, which study strategy is most strongly supported by cognitive science research for long-term retention?",
      passageText:
        "Cognitive science research has identified several evidence-based learning strategies that significantly enhance long-term retention. Spaced practice, which involves distributing study sessions over time rather than cramming, has been shown to produce more durable learning. Similarly, retrieval practice\u2014actively recalling information from memory without consulting notes\u2014strengthens neural pathways and improves transfer. In contrast, strategies such as re-reading textbooks, highlighting passages, and massed practice (cramming) are far less effective, despite being the most commonly used methods among students. A meta-analysis by Dunlosky et al. (2013) rated retrieval practice and distributed practice as having high utility across a wide range of conditions, while highlighting and summarisation were rated as having low utility. The researchers recommend that educators explicitly teach students these evidence-based strategies to improve academic outcomes.",
      options: [
        {
          id: "a",
          text: "Re-reading textbook chapters multiple times",
        },
        {
          id: "b",
          text: "Spaced practice combined with retrieval practice",
        },
        {
          id: "c",
          text: "Highlighting and colour-coding key passages",
        },
        {
          id: "d",
          text: "Listening to recorded lectures again",
        },
      ],
      correctOptionId: "b",
      concept: "Study Strategies",
      bloomLevel: "understand",
      difficulty: 0.55,
      discrimination: 1.1,
      guessing: 0.2,
      expectedTimeSecs: 80,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-26",
      renderer: "passage",
      questionText:
        "In the scenario described, which ethical principle is primarily at stake?",
      passageText:
        "A pharmaceutical company has developed a new drug that effectively treats a rare disease affecting approximately 5,000 people worldwide. The drug costs $2,000 per dose to manufacture. The company sets the price at $75,000 per dose, citing the need to recoup research and development costs. Patient advocacy groups argue that the price is unethical because it places life-saving treatment out of reach for many patients who cannot afford it. The company responds that without the potential for high returns, there would be no financial incentive to develop treatments for rare diseases, and that they offer a limited patient assistance program for those who cannot afford the drug.",
      options: [
        { id: "a", text: "Autonomy \u2014 respecting patients\u2019 right to make their own medical decisions" },
        { id: "b", text: "Beneficence \u2014 acting in the best interest of patients and society" },
        { id: "c", text: "Justice \u2014 fair distribution of benefits, risks, and costs" },
        { id: "d", text: "Fidelity \u2014 keeping promises and maintaining trust" },
      ],
      correctOptionId: "c",
      concept: "Ethical Reasoning",
      bloomLevel: "evaluate",
      difficulty: 0.7,
      discrimination: 1.4,
      guessing: 0.2,
      expectedTimeSecs: 80,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-27",
      renderer: "standard",
      questionText:
        "A researcher surveys 200 university students and finds a mean monthly textbook expenditure of $85. She wants to determine whether this sample mean is a reliable estimate of the population mean. What additional information is most essential?",
      options: [
        { id: "a", text: "The median expenditure of the sample" },
        {
          id: "b",
          text: "The standard deviation of the sample",
        },
        { id: "c", text: "The names of the textbook suppliers used" },
        {
          id: "d",
          text: "The number of courses each student is taking",
        },
      ],
      correctOptionId: "b",
      concept: "Data Sufficiency",
      bloomLevel: "evaluate",
      difficulty: 0.65,
      discrimination: 1.3,
      guessing: 0.2,
      expectedTimeSecs: 55,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-28",
      renderer: "standard",
      questionText:
        "If a student completes all assigned readings, then they will understand the lecture material. A student understands the lecture material. Which conclusion, if any, can be validly drawn?",
      options: [
        {
          id: "a",
          text: "The student completed all assigned readings.",
        },
        {
          id: "b",
          text: "The student did not complete all assigned readings.",
        },
        {
          id: "c",
          text: "The student might have completed the readings, but understanding could also be due to other reasons.",
        },
        {
          id: "d",
          text: "The student will fail the course.",
        },
      ],
      correctOptionId: "c",
      concept: "Conditional Reasoning",
      bloomLevel: "evaluate",
      difficulty: 0.7,
      discrimination: 1.5,
      guessing: 0.2,
      expectedTimeSecs: 55,
      allowsCalculator: false,
    },
    {
      id: "ss3-uni-29",
      renderer: "chart",
      questionText:
        "A student is choosing a university using a weighted decision matrix with four criteria: academic reputation (weight 3), tuition cost (weight 2), location (weight 1), and campus facilities (weight 2). Based on the weighted scores shown in the chart, which university should the student choose?",
      chartData: {
        type: "bar",
        title: "Weighted Scores for University Selection",
        labels: [
          "University A",
          "University B",
          "University C",
          "University D",
        ],
        values: [82, 76, 91, 68],
        unit: "Weighted score",
      },
      options: [
        { id: "a", text: "University A" },
        { id: "b", text: "University B" },
        { id: "c", text: "University C" },
        { id: "d", text: "University D" },
      ],
      correctOptionId: "c",
      concept: "Decision Making",
      bloomLevel: "evaluate",
      difficulty: 0.6,
      discrimination: 1.2,
      guessing: 0.2,
      expectedTimeSecs: 60,
      allowsCalculator: true,
    },
    {
      id: "ss3-uni-30",
      renderer: "interactive",
      questionText:
        "Complete the following statements about metacognition by filling in the blanks with the most appropriate academic terms.",
      interactiveData: {
        type: "fill_blanks",
        blanks: [
          {
            id: "blank1",
            textBefore:
              "Metacognition can be strengthened by regularly",
            textAfter:
              "one\u2019s own level of understanding before, during, and after a learning task.",
            correctAnswer: "assessing",
          },
          {
            id: "blank2",
            textBefore:
              "An effective metacognitive strategy involves",
            textAfter:
              "learning approaches based on what does or does not work for the individual.",
            correctAnswer: "adjusting",
          },
        ],
      },
      options: [
        {
          id: "a",
          text: "Complete the blanks with the correct words",
        },
      ],
      correctOptionId: "a",
      concept: "Metacognition",
      bloomLevel: "evaluate",
      difficulty: 0.65,
      discrimination: 1.3,
      guessing: 0.2,
      expectedTimeSecs: 70,
      allowsCalculator: false,
    },
  ],
};

export default assessment;
