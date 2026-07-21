export interface ParentAssessmentQuestion {
  code: string;
  domain: string;
  questionText: string;
  dimension: string;
  options: { optionText: string; score: number; optionOrder: number }[];
}

const likertOptions = (never = "Never", rarely = "Rarely", sometimes = "Sometimes", often = "Often", always = "Always") => [
  { optionText: never, score: 1, optionOrder: 1 },
  { optionText: rarely, score: 2, optionOrder: 2 },
  { optionText: sometimes, score: 3, optionOrder: 3 },
  { optionText: often, score: 4, optionOrder: 4 },
  { optionText: always, score: 5, optionOrder: 5 },
];

export const parentAssessmentQuestions: ParentAssessmentQuestion[] = [
  // ──────────────────────────────────────────────────────────
  // DOMAIN 1: Communication & Emotional Connection
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-001",
    domain: "Communication & Emotional Connection",
    questionText:
      "When my child wants to talk to me, I stop what I am doing, make eye contact, and listen without interrupting until they are finished.",
    dimension: "Active Listening",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-002",
    domain: "Communication & Emotional Connection",
    questionText:
      "When my child is upset or frustrated, I first acknowledge their feelings (e.g., 'I can see you are upset') before trying to fix the problem or offer advice.",
    dimension: "Emotional Validation",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-003",
    domain: "Communication & Emotional Connection",
    questionText:
      "I regularly create opportunities for open conversations with my child by asking open-ended questions like 'How did that make you feel?' or 'What was the best part of your day?'",
    dimension: "Open Dialogue",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-004",
    domain: "Communication & Emotional Connection",
    questionText:
      "I dedicate at least 30 minutes each day to undistracted quality time with my child — playing, reading, or simply being together without phones or screens.",
    dimension: "Quality Time",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-005",
    domain: "Communication & Emotional Connection",
    questionText:
      "I regularly express love, pride, and affection to my child through both words (e.g., 'I am proud of you') and physical gestures such as hugs or pats on the back.",
    dimension: "Expressing Affection",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },

  // ──────────────────────────────────────────────────────────
  // DOMAIN 2: Discipline & Behavior Management
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-006",
    domain: "Discipline & Behavior Management",
    questionText:
      "I have clear rules at home that my child understands, and I enforce these rules consistently regardless of my mood or the situation.",
    dimension: "Consistent Rules",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-007",
    domain: "Discipline & Behavior Management",
    questionText:
      "When my child misbehaves, I use teaching-oriented discipline (e.g., explaining consequences, time-ins, loss of privileges) rather than shouting, slapping, or other physical punishments.",
    dimension: "Positive Discipline",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-008",
    domain: "Discipline & Behavior Management",
    questionText:
      "I allow my child to experience the natural consequences of their actions (e.g., feeling cold because they refused to wear a sweater) as a learning opportunity, when it is safe to do so.",
    dimension: "Natural Consequences",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-009",
    domain: "Discipline & Behavior Management",
    questionText:
      "Even when I am angry, I avoid using words that shame, belittle, or label my child (e.g., 'You are lazy,' 'You are stupid,' 'You are a bad child').",
    dimension: "Avoiding Harsh Punishment",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-010",
    domain: "Discipline & Behavior Management",
    questionText:
      "I demonstrate the behavior I expect from my child — for example, speaking respectfully to others, managing my own anger calmly, and being honest — because I know they model what I do.",
    dimension: "Modeling Behavior",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },

  // ──────────────────────────────────────────────────────────
  // DOMAIN 3: Academic Support & Involvement
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-011",
    domain: "Academic Support & Involvement",
    questionText:
      "I set aside a regular time and a quiet, well-lit space each day for my child to do homework, and I check in with them (not do the work for them) to make sure they understand the task.",
    dimension: "Homework Assistance",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-012",
    domain: "Academic Support & Involvement",
    questionText:
      "I attend my child's school events — such as parent-teacher meetings, PTA meetings, cultural days, and sports activities — at least once per term.",
    dimension: "School Engagement",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-013",
    domain: "Academic Support & Involvement",
    questionText:
      "I maintain regular communication with my child's teachers or school — whether by phone, text, or in person — to stay informed about their academic progress and behavior.",
    dimension: "Communication with Teachers",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-014",
    domain: "Academic Support & Involvement",
    questionText:
      "I provide learning materials at home such as textbooks, reading books, educational games, or access to educational content that supports what my child is learning in school.",
    dimension: "Learning Environment at Home",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-015",
    domain: "Academic Support & Involvement",
    questionText:
      "I encourage my child to do their best academically and set high but realistic expectations, while also celebrating effort and improvement rather than only rewarding perfect results.",
    dimension: "Educational Expectations",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },

  // ──────────────────────────────────────────────────────────
  // DOMAIN 4: Health, Nutrition & Wellbeing
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-016",
    domain: "Health, Nutrition & Wellbeing",
    questionText:
      "I ensure my child eats a balanced diet that includes fruits, vegetables, protein, and grains every day, and I limit the amount of sugary snacks, soft drinks, and processed food they consume.",
    dimension: "Balanced Diet",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-017",
    domain: "Health, Nutrition & Wellbeing",
    questionText:
      "My child has a consistent bedtime routine, and they sleep for the recommended number of hours for their age (9–12 hours for children 6–12, 8–10 hours for teenagers) most nights.",
    dimension: "Sleep Routines",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-018",
    domain: "Health, Nutrition & Wellbeing",
    questionText:
      "I encourage my child to engage in at least 60 minutes of physical activity daily — such as playing football, running, dancing, skipping rope, or walking — and I sometimes join them.",
    dimension: "Physical Activity",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-019",
    domain: "Health, Nutrition & Wellbeing",
    questionText:
      "I take my child for routine medical and dental checkups (not just when they are sick), and I ensure their vaccinations are up to date.",
    dimension: "Medical Checkups",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-020",
    domain: "Health, Nutrition & Wellbeing",
    questionText:
      "I pay attention to my child's emotional and mental health by checking in on how they are feeling, noticing changes in mood or behavior, and creating a safe space for them to express worry or sadness.",
    dimension: "Mental Health Awareness",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },

  // ──────────────────────────────────────────────────────────
  // DOMAIN 5: Safety & Supervision
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-021",
    domain: "Safety & Supervision",
    questionText:
      "I provide supervision that is appropriate for my child's age — for example, not leaving a young child unsupervised at home but giving a teenager more privacy and freedom within agreed boundaries.",
    dimension: "Age-Appropriate Supervision",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-022",
    domain: "Safety & Supervision",
    questionText:
      "I actively monitor my child's online activities by knowing which websites they visit, which apps they use, and who they communicate with on social media.",
    dimension: "Online Safety",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-023",
    domain: "Safety & Supervision",
    questionText:
      "I regularly check my home for safety hazards — such as uncovered electrical sockets, unsafe cooking arrangements, accessible medications, or broken furniture — and fix them promptly.",
    dimension: "Safe Environment",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-024",
    domain: "Safety & Supervision",
    questionText:
      "My child knows what to do in an emergency — including how to call for help (112, 199, or a trusted adult's phone number), and we have practiced a fire escape plan or emergency meeting point.",
    dimension: "Emergency Preparedness",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-025",
    domain: "Safety & Supervision",
    questionText:
      "I generally know where my child is, who they are with, and what they are doing when they are not at home, and we have an agreement that they check in with me or a trusted adult.",
    dimension: "Knowing Child's Whereabouts",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },

  // ──────────────────────────────────────────────────────────
  // DOMAIN 6: Social Development
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-026",
    domain: "Social Development",
    questionText:
      "I encourage my child to build healthy friendships by inviting their friends over, allowing age-appropriate social outings, and asking about their friends' lives and interests.",
    dimension: "Peer Relationships",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-027",
    domain: "Social Development",
    questionText:
      "When my child has a disagreement with a sibling, friend, or classmate, I coach them through resolving it calmly — by using words, listening to the other person, and finding a fair solution — rather than fighting or withdrawing.",
    dimension: "Conflict Resolution Skills",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-028",
    domain: "Social Development",
    questionText:
      "I help my child develop empathy by asking them to consider other people's feelings (e.g., 'How do you think your friend felt when that happened?') and by discussing real-life situations involving others.",
    dimension: "Empathy Building",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-029",
    domain: "Social Development",
    questionText:
      "I actively teach and reinforce sharing, cooperation, and taking turns — whether at home with siblings, in the neighbourhood, or at school — and I praise my child when they demonstrate these behaviours.",
    dimension: "Sharing & Cooperation",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-030",
    domain: "Social Development",
    questionText:
      "I involve my child in community or group activities such as church/mosque events, neighbourhood clean-ups, cultural festivals, or volunteering, so they learn to contribute beyond themselves.",
    dimension: "Community Involvement",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },

  // ──────────────────────────────────────────────────────────
  // DOMAIN 7: Digital Literacy & Screen Time
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-031",
    domain: "Digital Literacy & Screen Time",
    questionText:
      "I have set clear and enforceable daily limits on my child's recreational screen time (TV, phone, tablet, gaming console), and I enforce these limits consistently.",
    dimension: "Screen Time Rules",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-032",
    domain: "Digital Literacy & Screen Time",
    questionText:
      "I check the content my child consumes online — including the videos they watch, the games they play, and the apps they install — to make sure it is age-appropriate.",
    dimension: "Content Monitoring",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-033",
    domain: "Digital Literacy & Screen Time",
    questionText:
      "We have device-free zones or times at home — for example, no phones during meals, no screens in bedrooms after a certain hour, or screen-free family time on Sundays.",
    dimension: "Device-Free Zones",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-034",
    domain: "Digital Literacy & Screen Time",
    questionText:
      "I teach my child about digital citizenship — such as not sharing personal information online, being kind in online interactions, not cyberbullying, and understanding that online actions have real consequences.",
    dimension: "Digital Citizenship",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-035",
    domain: "Digital Literacy & Screen Time",
    questionText:
      "I have spoken to my child about online predators and strangers, warning them never to meet someone in person that they only know from the internet, and to tell me if anyone online makes them uncomfortable.",
    dimension: "Online Predator Awareness",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },

  // ──────────────────────────────────────────────────────────
  // DOMAIN 8: Cultural & Moral Values
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-036",
    domain: "Cultural & Moral Values",
    questionText:
      "I actively pass on our cultural traditions to my child — such as proverbs, folklore, language, festivals, and family customs — by telling stories, attending cultural events, or involving them in traditional practices.",
    dimension: "Tradition Passing",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-037",
    domain: "Cultural & Moral Values",
    questionText:
      "I use everyday situations to discuss right and wrong with my child — such as what happened in the news, a conflict they had, or a moral dilemma in a film — to help them develop ethical reasoning.",
    dimension: "Ethical Discussions",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-038",
    domain: "Cultural & Moral Values",
    questionText:
      "I provide my child with religious or moral guidance (prayer, fasting, church/mosque attendance, moral stories) that helps them understand a sense of purpose, gratitude, and accountability beyond themselves.",
    dimension: "Religious & Moral Guidance",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-039",
    domain: "Cultural & Moral Values",
    questionText:
      "I teach my child to show respect for elders — such as greeting adults properly, using polite language like 'Sir,' 'Ma,' 'Aunty,' and 'Uncle,' and listening when elders speak — and I model this behaviour myself.",
    dimension: "Respect for Elders",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-040",
    domain: "Cultural & Moral Values",
    questionText:
      "I consistently reinforce honesty with my child by praising them when they tell the truth (even when it is difficult), never punishing them excessively for honest mistakes, and being truthful myself.",
    dimension: "Honesty Reinforcement",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },

  // ──────────────────────────────────────────────────────────
  // DOMAIN 9: Adolescent Development
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-041",
    domain: "Adolescent Development",
    questionText:
      "I have had (or plan to have) age-appropriate conversations with my child about puberty — including body changes, menstruation, hygiene, and emotional shifts — before they experience them.",
    dimension: "Puberty Awareness",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-042",
    domain: "Adolescent Development",
    questionText:
      "As my child grows older, I gradually give them more independence — such as making choices about clothing, managing small amounts of money, or spending time with friends — while maintaining agreed boundaries.",
    dimension: "Supporting Independence",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-043",
    domain: "Adolescent Development",
    questionText:
      "I support my child in exploring their interests, hobbies, talents, and sense of self — even when these differ from what I expected or preferred — without ridicule or pressure.",
    dimension: "Identity Exploration",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-044",
    domain: "Adolescent Development",
    questionText:
      "I have openly discussed the topic of peer pressure with my child — including how to recognise it, how to say no assertively, and that it is okay to walk away from situations that feel wrong.",
    dimension: "Peer Pressure Guidance",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-045",
    domain: "Adolescent Development",
    questionText:
      "I help my child manage strong emotions — such as anger, jealousy, disappointment, or anxiety — by teaching them coping strategies like deep breathing, journaling, talking it out, or taking a break, rather than dismissing their feelings.",
    dimension: "Emotional Regulation",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },

  // ──────────────────────────────────────────────────────────
  // DOMAIN 10: Stress Management & Self-Care
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-046",
    domain: "Stress Management & Self-Care",
    questionText:
      "I recognise the early signs of burnout in myself — such as irritability, exhaustion, or feeling overwhelmed — and I take proactive steps to rest, delegate, or ask for help before it affects my parenting.",
    dimension: "Parental Burnout Prevention",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-047",
    domain: "Stress Management & Self-Care",
    questionText:
      "I try to maintain a healthy balance between work, household responsibilities, and family time, and I do not consistently sacrifice my child's needs or my own rest for the sake of work.",
    dimension: "Work-Life Balance",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-048",
    domain: "Stress Management & Self-Care",
    questionText:
      "When I am struggling with parenting challenges, I reach out for support — from my spouse, family members, friends, a counsellor, a pastor/imam, or a parenting group — rather than trying to handle everything alone.",
    dimension: "Seeking Support",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-049",
    domain: "Stress Management & Self-Care",
    questionText:
      "When I face setbacks — such as job loss, health problems, or family conflicts — I handle the situation with resilience in front of my child, showing them how to cope with difficulty without losing hope.",
    dimension: "Modeling Resilience",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-050",
    domain: "Stress Management & Self-Care",
    questionText:
      "I regularly take time for my own physical and emotional wellbeing — whether through exercise, prayer/meditation, hobbies, socializing, or simply resting — because I understand that a healthy parent is a better parent.",
    dimension: "Self-Care Practices",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },

  // ──────────────────────────────────────────────────────────
  // DOMAIN 11: Special Needs Awareness
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-051",
    domain: "Special Needs Awareness",
    questionText:
      "I am aware of the signs that may indicate a learning difference or developmental delay in my child — such as persistent difficulty reading, writing, concentrating, or socialising — and I do not dismiss them as laziness.",
    dimension: "Recognising Learning Differences",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-052",
    domain: "Special Needs Awareness",
    questionText:
      "If I suspect my child has a learning, behavioural, or developmental challenge, I seek professional evaluation and support (e.g., from a psychologist, paediatrician, or special education specialist) rather than waiting for them to 'grow out of it.'",
    dimension: "Seeking Professional Help",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-053",
    domain: "Special Needs Awareness",
    questionText:
      "I treat all children in my household fairly, adjusting expectations and support based on each child's individual abilities and needs, and I avoid comparing one child unfavourably to another.",
    dimension: "Inclusive Parenting",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-054",
    domain: "Special Needs Awareness",
    questionText:
      "If my child has a diagnosed condition, I actively advocate for their needs at school — by communicating with teachers, requesting accommodations, and ensuring they are treated with dignity and inclusion.",
    dimension: "Advocacy",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-055",
    domain: "Special Needs Awareness",
    questionText:
      "I understand what accommodations and support systems are available for children with special needs in my child's school or community — such as resource teachers, counselling services, or support groups — and I make use of them when needed.",
    dimension: "Understanding Accommodations",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },

  // ──────────────────────────────────────────────────────────
  // DOMAIN 12: Financial Literacy for Children
  // ──────────────────────────────────────────────────────────
  {
    code: "PAR-056",
    domain: "Financial Literacy for Children",
    questionText:
      "I regularly talk to my child about money — including where money comes from, how it is earned, and why we cannot buy everything we want — in a way they can understand for their age.",
    dimension: "Money Conversations",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-057",
    domain: "Financial Literacy for Children",
    questionText:
      "I encourage my child to save a portion of any money they receive (from gifts, chores, or an allowance) by giving them a savings box, piggy bank, or helping them open a savings account.",
    dimension: "Saving Habits",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-058",
    domain: "Financial Literacy for Children",
    questionText:
      "I involve my child in simple budgeting decisions — such as planning the food for a family outing within a budget, or comparing prices while shopping — so they understand how to make choices with limited resources.",
    dimension: "Budgeting Basics",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-059",
    domain: "Financial Literacy for Children",
    questionText:
      "I teach my child the value of delayed gratification by encouraging them to save up for something they want over time, rather than always buying it for them immediately.",
    dimension: "Delayed Gratification",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
  {
    code: "PAR-060",
    domain: "Financial Literacy for Children",
    questionText:
      "I encourage my child to share their resources with others — such as giving to those in need during Sallah, Christmas, or community events — and I model charitable giving by involving them in acts of generosity.",
    dimension: "Charitable Giving",
    options: likertOptions("Never", "Rarely", "Sometimes", "Often", "Always"),
  },
];

export const parentAssessmentDomains = [
  {
    name: "Communication & Emotional Connection",
    description:
      "Measures the quality of open communication, emotional attunement, and emotional safety between parent and child. Strong emotional connection is the foundation for a child's self-esteem, trust, and willingness to share problems.",
    icon: "MessageCircleHeart",
  },
  {
    name: "Discipline & Behavior Management",
    description:
      "Evaluates whether discipline is consistent, respectful, and constructive. Covers the use of positive discipline strategies, avoidance of harsh physical or verbal punishment, and the parent's ability to model the behaviour they expect.",
    icon: "ShieldCheck",
  },
  {
    name: "Academic Support & Involvement",
    description:
      "Assesses parental engagement in the child's education — from providing a supportive homework environment and attending school events to maintaining communication with teachers and setting appropriate academic expectations.",
    icon: "GraduationCap",
  },
  {
    name: "Health, Nutrition & Wellbeing",
    description:
      "Covers the parent's efforts to ensure the child's physical health through balanced nutrition, adequate sleep, regular physical activity, preventive medical care, and awareness of the child's mental and emotional health.",
    icon: "HeartPulse",
  },
  {
    name: "Safety & Supervision",
    description:
      "Evaluates the parent's ability to provide age-appropriate supervision, maintain a physically safe home, prepare children for emergencies, monitor whereabouts, and ensure online safety.",
    icon: "Shield",
  },
  {
    name: "Social Development",
    description:
      "Assesses how well the parent supports the child's ability to form healthy friendships, resolve conflicts, show empathy, cooperate with others, and participate meaningfully in the community.",
    icon: "Users",
  },
  {
    name: "Digital Literacy & Screen Time",
    description:
      "Evaluates the parent's approach to managing screen time, monitoring content, establishing device-free boundaries, teaching digital citizenship, and protecting children from online threats including predators.",
    icon: "MonitorSmartphone",
  },
  {
    name: "Cultural & Moral Values",
    description:
      "Covers the transmission of cultural identity, moral reasoning, religious or spiritual guidance, respect for elders, and the reinforcement of honesty and ethical behaviour in daily life.",
    icon: "BookHeart",
  },
  {
    name: "Adolescent Development",
    description:
      "Evaluates parental preparedness and responsiveness to the developmental needs of growing children — including puberty education, supporting autonomy, identity exploration, managing peer pressure, and emotional regulation.",
    icon: "Sprout",
  },
  {
    name: "Stress Management & Self-Care",
    description:
      "Assesses the parent's awareness of their own wellbeing — including burnout prevention, work-life balance, willingness to seek help, resilience in adversity, and regular self-care practices.",
    icon: "Leaf",
  },
  {
    name: "Special Needs Awareness",
    description:
      "Evaluates the parent's awareness and responsiveness to learning differences and developmental challenges — including recognising signs, seeking professional help, inclusive practices, advocacy, and understanding available accommodations.",
    icon: "Lightbulb",
  },
  {
    name: "Financial Literacy for Children",
    description:
      "Assesses the parent's efforts to teach children about money — including conversations about earning and spending, building saving habits, basic budgeting, delayed gratification, and the value of charitable giving.",
    icon: "Coins",
  },
];
