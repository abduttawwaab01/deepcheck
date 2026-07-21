export interface ParentDomainAnalysis {
  domain: string;
  score: number;
  rating: 'needs_guidance' | 'developing' | 'adequate' | 'proficient' | 'exemplary';
  findings: string[];
  strengths: string[];
  improvements: string[];
  priority: 'high' | 'medium' | 'low';
  practicalTips: string[];
}

export interface ParentingStyleProfile {
  primary: 'authoritative' | 'authoritarian' | 'permissive' | 'uninvolved';
  secondary: string;
  description: string;
  strengths: string[];
  concerns: string[];
}

export interface ParentActionPlan {
  week: number;
  theme: string;
  actions: string[];
  expectedOutcome: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
}

export interface AgeSpecificInsight {
  ageGroup: string;
  relevantDomains: string[];
  developmentalStage: string;
  keyStrategies: string[];
  warningSigns: string[];
}

export interface ResourceRecommendation {
  domain: string;
  category: 'book' | 'article' | 'video' | 'activity' | 'professional';
  title: string;
  description: string;
  url?: string;
}

export interface ParentDeepReport {
  overallScore: number;
  overallRating: string;
  domainAnalysis: ParentDomainAnalysis[];
  parentingStyle: ParentingStyleProfile;
  criticalGaps: ParentDomainAnalysis[];
  strengths: ParentDomainAnalysis[];
  actionPlan: ParentActionPlan[];
  ageSpecificInsights: AgeSpecificInsight;
  resourceRecommendations: ResourceRecommendation[];
  redFlags: { domain: string; concern: string; urgency: 'immediate' | 'soon' | 'monitor' }[];
  aiSummary: string;
}

const DOMAIN_FINDINGS: Record<string, string[]> = {
  'Communication & Emotional Connection': [
    'Regular family meals and conversations strengthen emotional bonds',
    'Active listening validates children\'s feelings and builds trust',
    'Open communication reduces the likelihood of risky behaviour in adolescence',
    'Children who feel heard are more likely to share problems early',
  ],
  'Discipline & Behavior Management': [
    'Positive discipline techniques are more effective than physical punishment',
    'Consistent boundaries help children feel safe and understand expectations',
    'Authoritative discipline combines warmth with structure for best outcomes',
    'Inconsistent discipline can confuse children and increase behavioural issues',
  ],
  'Academic Support & Involvement': [
    'Parental involvement in education is the strongest predictor of academic success',
    'Creating a homework routine improves focus and performance',
    'Communicating regularly with teachers helps identify learning gaps early',
    'Encouraging curiosity beyond textbooks fosters a love of learning',
  ],
  'Health, Nutrition & Wellbeing': [
    'Balanced nutrition including local foods supports optimal growth',
    'Regular physical activity improves concentration and emotional regulation',
    'Routine health check-ups prevent small issues from becoming serious',
    'Adequate sleep is essential for cognitive development and behaviour',
  ],
  'Safety & Supervision': [
    'Age-appropriate supervision balances safety with growing independence',
    'Teaching children about personal safety empowers them to protect themselves',
    'Knowing your child\'s friends and whereabouts builds a safety network',
    'Home safety measures prevent common childhood injuries',
  ],
  'Social Development': [
    'Positive peer relationships build emotional intelligence and resilience',
    'Structured social activities teach cooperation and conflict resolution',
    'Children learn social norms by observing parental interactions',
    'Encouraging community involvement builds empathy and civic responsibility',
  ],
  'Digital Literacy & Screen Time': [
    'Setting clear screen time boundaries protects developmental health',
    'Co-viewing digital content creates opportunities for guided learning',
    'Teaching critical thinking about online content protects against misinformation',
    'Modelling healthy screen habits influences children\'s digital behaviour',
  ],
  'Cultural & Moral Values': [
    'Passing down cultural traditions helps children develop strong identity',
    'Moral reasoning develops through discussion and real-life examples',
    'Cultural pride acts as a protective factor against negative peer pressure',
    'Stories and proverbs are powerful tools for transmitting values',
  ],
  'Adolescent Development': [
    'Understanding developmental stages prevents misinterpretation of behaviour',
    'Adolescents need increasing autonomy with maintained connection',
    'Puberty education reduces anxiety and promotes healthy self-image',
    'Peer pressure resistance is built through strong family relationships',
  ],
  'Stress Management & Self-Care': [
    'Parental wellbeing directly impacts parenting quality',
    'Modelling healthy coping strategies teaches children emotional regulation',
    'Seeking support is a sign of strength, not weakness',
    'Self-care routines prevent burnout and improve family dynamics',
  ],
  'Special Needs Awareness': [
    'Early identification of developmental concerns leads to better outcomes',
    'Inclusive parenting approaches benefit all children, not just those with needs',
    'Professional assessment provides clarity and direction for support',
    'Every child develops at their own pace, but persistent delays need attention',
  ],
  'Financial Literacy for Children': [
    'Teaching children to save from an early age builds financial responsibility',
    'Age-appropriate money conversations reduce financial anxiety',
    'Children who understand budgeting make better financial decisions as adults',
    'Involving children in family financial discussions builds practical knowledge',
  ],
};

const DOMAIN_TIPS: Record<string, string[]> = {
  'Communication & Emotional Connection': [
    'Start a weekly family meeting to discuss plans and concerns',
    'Ask open-ended questions like "What was the best part of your day?"',
    'Put phones away during meals to give full attention to conversations',
    'Create a safe space where children can share without fear of judgement',
  ],
  'Discipline & Behavior Management': [
    'Use the "when...then" approach: "When you finish homework, then you can play"',
    'Set clear, consistent rules and explain the reasons behind them',
    'Praise effort and behaviour rather than traits: "You worked hard" not "You\'re smart"',
    'Take a pause before responding to challenging behaviour',
  ],
  'Academic Support & Involvement': [
    'Create a homework routine with a designated study space',
    'Visit school events and parent-teacher meetings regularly',
    'Show interest in what your child is learning by asking specific questions',
    'Provide educational materials like books, puzzles, and learning games',
  ],
  'Health, Nutrition & Wellbeing': [
    'Include traditional Nigerian foods like beans, moi-moi, and vegetables in meals',
    'Establish a consistent bedtime routine for adequate sleep',
    'Encourage outdoor play and physical activity for at least 60 minutes daily',
    'Schedule regular health check-ups and keep vaccination records updated',
  ],
  'Safety & Supervision': [
    'Teach your child their full name, address, and an emergency contact number',
    'Know your child\'s friends and their families',
    'Install basic home safety measures like socket covers and secure furniture',
    'Practice safety scenarios through role-play in a non-scary way',
  ],
  'Social Development': [
    'Arrange playdates and group activities to build social skills',
    'Teach conflict resolution by modelling it at home',
    'Encourage participation in clubs, religious groups, or community activities',
    'Help your child identify and express their emotions constructively',
  ],
  'Digital Literacy & Screen Time': [
    'Set screen time limits: under 2 years minimal, 2-5 years max 1 hour, 6+ years with boundaries',
    'Use parental controls and keep devices in shared family spaces',
    'Watch and discuss content together to build critical thinking',
    'Create a family media agreement that everyone follows',
  ],
  'Cultural & Moral Values': [
    'Share family stories, proverbs, and traditions during gatherings',
    'Involve children in cultural celebrations and explain their significance',
    'Discuss moral dilemmas and ask "What would you do?" scenarios',
    'Model the values you want your children to adopt',
  ],
  'Adolescent Development': [
    'Gradually increase independence while maintaining open communication',
    'Provide age-appropriate information about puberty and body changes',
    'Respect their need for privacy while staying connected',
    'Be available without being intrusive — let them come to you',
  ],
  'Stress Management & Self-Care': [
    'Identify your stress triggers and develop healthy coping mechanisms',
    'Build a support network of family, friends, or parent groups',
    'Schedule regular personal time, even if it\'s just 15 minutes daily',
    'Practice mindfulness or prayer as a daily grounding routine',
  ],
  'Special Needs Awareness': [
    'Trust your instincts if you notice developmental differences',
    'Seek professional evaluation early rather than adopting a wait-and-see approach',
    'Connect with support groups and organisations for guidance',
    'Celebrate your child\'s unique strengths alongside addressing challenges',
  ],
  'Financial Literacy for Children': [
    'Save together for a family goal using a transparent savings box',
    'Give age-appropriate pocket money and guide spending decisions',
    'Play money-related games to teach counting and budgeting',
    'Involve children in simple household budget discussions',
  ],
};

const DOMAIN_STRENGTHS: Record<string, string[]> = {
  'Communication & Emotional Connection': [
    'Strong emotional bonds create resilience in children',
    'Open dialogue reduces the risk of mental health issues',
    'Children who feel connected make better decisions independently',
  ],
  'Discipline & Behavior Management': [
    'Consistent discipline builds self-regulation and accountability',
    'Clear expectations reduce anxiety and behavioural problems',
    'Positive discipline strengthens the parent-child relationship',
  ],
  'Academic Support & Involvement': [
    'Involved parents raise higher-achieving students',
    'Academic support builds confidence and motivation',
    'Early intervention in learning challenges leads to better outcomes',
  ],
  'Health, Nutrition & Wellbeing': [
    'Healthy children have better concentration and emotional regulation',
    'Good nutrition habits established in childhood last a lifetime',
    'Regular health monitoring prevents serious health issues',
  ],
  'Safety & Supervision': [
    'Safe environments allow children to explore and learn confidently',
    'Appropriate supervision builds trust and security',
    'Safety awareness empowers children to protect themselves',
  ],
  'Social Development': [
    'Strong social skills predict better relationships and career success',
    'Positive peer relationships reduce vulnerability to negative influences',
    'Community involvement builds empathy and leadership',
  ],
  'Digital Literacy & Screen Time': [
    'Digital literacy is essential for academic and career readiness',
    'Healthy screen habits protect sleep, attention, and physical health',
    'Critical thinking about online content prevents exploitation',
  ],
  'Cultural & Moral Values': [
    'Cultural identity strengthens self-esteem and belonging',
    'Moral grounding guides ethical decision-making throughout life',
    'Values transmitted in childhood shape adult character',
  ],
  'Adolescent Development': [
    'Understanding adolescent needs prevents parent-child conflict',
    'Guiding teens through challenges builds lifelong coping skills',
    'Healthy adolescent development sets the stage for adult independence',
  ],
  'Stress Management & Self-Care': [
    'Self-care enables sustained, quality parenting over the long term',
    'Emotionally regulated parents raise emotionally regulated children',
    'A support network provides practical help and emotional relief',
  ],
  'Special Needs Awareness': [
    'Early awareness leads to timely intervention and better outcomes',
    'Inclusive approaches benefit all family members',
    'Professional support provides evidence-based strategies',
  ],
  'Financial Literacy for Children': [
    'Financial literacy reduces the risk of debt and financial stress in adulthood',
    'Early money education builds confidence and decision-making skills',
    'Family financial discussions demystify money and reduce anxiety',
  ],
};

const DOMAIN_IMPROVEMENTS: Record<string, string[]> = {
  'Communication & Emotional Connection': [
    'Schedule dedicated one-on-one time with each child daily',
    'Practice reflective listening — repeat back what your child says',
    'Share your own feelings appropriately to model vulnerability',
    'Reduce distractions during conversations with your children',
  ],
  'Discipline & Behavior Management': [
    'Replace physical punishment with logical consequences',
    'Develop a family behaviour agreement that everyone helps create',
    'Be consistent across all caregivers — parents, grandparents, siblings',
    'Focus on teaching rather than punishing when rules are broken',
  ],
  'Academic Support & Involvement': [
    'Attend school meetings and request regular progress updates',
    'Create a structured homework schedule with your child',
    'Provide a quiet, well-lit study area free from distractions',
    'Explore tutoring or extra classes if your child struggles in specific subjects',
  ],
  'Health, Nutrition & Wellbeing': [
    'Gradually introduce more fruits, vegetables, and whole foods into meals',
    'Establish consistent sleep and wake times, including weekends',
    'Reduce sugary snacks and drinks — offer healthier alternatives',
    'Schedule overdue health check-ups and vaccinations',
  ],
  'Safety & Supervision': [
    'Update safety measures based on your child\'s current age and abilities',
    'Have regular safety conversations without creating fear',
    'Know your child\'s online and offline social circles',
    'Create a family safety plan for emergencies',
  ],
  'Social Development': [
    'Encourage your child to join structured group activities',
    'Coach your child through social conflicts rather than solving them',
    'Host other children to help your child practise hosting and sharing',
    'Discuss bullying openly and create a plan if it occurs',
  ],
  'Digital Literacy & Screen Time': [
    'Audit your child\'s current screen time and set clear limits',
    'Move devices to shared spaces and remove from bedrooms',
    'Explore educational apps and content together',
    'Create a family technology agreement with consequences for violations',
  ],
  'Cultural & Moral Values': [
    'Dedicate time weekly to share cultural stories or traditions',
    'Involve children in planning and participating in cultural events',
    'Discuss current events through a moral and cultural lens',
    'Visit cultural sites or museums to reinforce heritage',
  ],
  'Adolescent Development': [
    'Educate yourself about your child\'s developmental stage',
    'Have age-appropriate conversations about relationships and health',
    'Gradually increase responsibilities and freedoms with clear expectations',
    'Stay connected through shared interests and activities',
  ],
  'Stress Management & Self-Care': [
    'Identify and reduce sources of unnecessary stress in your routine',
    'Join a parenting support group or community',
    'Seek professional help if stress is affecting your daily functioning',
    'Create a personal self-care plan with realistic daily actions',
  ],
  'Special Needs Awareness': [
    'Learn about typical developmental milestones for your child\'s age',
    'Seek professional evaluation if you have concerns — early is better',
    'Connect with organisations that support families with similar experiences',
    'Advocate for your child\'s needs within the education system',
  ],
  'Financial Literacy for Children': [
    'Start giving pocket money with guidance on saving and spending',
    'Use everyday shopping trips as learning opportunities',
    'Create a visible savings goal to motivate your child',
    'Discuss family financial decisions at an age-appropriate level',
  ],
};

function calculateDomainScores(
  responses: { questionId: string; score: number; domain: string; dimension: string }[]
): Map<string, { total: number; count: number; percentage: number }> {
  const domainMap = new Map<string, { total: number; count: number }>();

  for (const response of responses) {
    const existing = domainMap.get(response.domain);
    if (existing) {
      existing.total += response.score;
      existing.count += 1;
    } else {
      domainMap.set(response.domain, { total: response.score, count: 1 });
    }
  }

  const scores = new Map<string, { total: number; count: number; percentage: number }>();
  Array.from(domainMap.entries()).forEach(([domain, data]) => {
    const percentage = (data.total / (data.count * 5)) * 100;
    scores.set(domain, { ...data, percentage: Math.round(percentage * 10) / 10 });
  });

  return scores;
}

function rateDomain(score: number): ParentDomainAnalysis['rating'] {
  if (score < 20) return 'needs_guidance';
  if (score < 40) return 'developing';
  if (score < 60) return 'adequate';
  if (score < 80) return 'proficient';
  return 'exemplary';
}

function ratePriority(score: number): ParentDomainAnalysis['priority'] {
  if (score < 40) return 'high';
  if (score < 70) return 'medium';
  return 'low';
}

function getOverallRating(score: number): string {
  if (score < 20) return 'Critical — Immediate intervention needed across multiple areas';
  if (score < 40) return 'Developing — Significant room for growth in several areas';
  if (score < 60) return 'Adequate — Solid foundation with opportunities to strengthen';
  if (score < 80) return 'Proficient — Strong parenting with minor areas to refine';
  return 'Exemplary — Outstanding parenting practices across most areas';
}

function buildDomainAnalysis(
  domain: string,
  score: number
): ParentDomainAnalysis {
  const rating = rateDomain(score);
  const priority = ratePriority(score);
  const findings = DOMAIN_FINDINGS[domain] || [];
  const strengths = DOMAIN_STRENGTHS[domain] || [];
  const improvements = DOMAIN_IMPROVEMENTS[domain] || [];
  const practicalTips = DOMAIN_TIPS[domain] || [];

  const filteredStrengths = score >= 60 ? strengths : strengths.slice(0, 1);
  const filteredImprovements = score < 60 ? improvements : improvements.slice(0, 1);
  const filteredTips = priority === 'high'
    ? practicalTips
    : practicalTips.slice(0, 2);

  return {
    domain,
    score,
    rating,
    findings,
    strengths: filteredStrengths,
    improvements: filteredImprovements,
    priority,
    practicalTips: filteredTips,
  };
}

function determineParentingStyle(
  domainScores: Map<string, { percentage: number }>
): ParentingStyleProfile {
  const disciplineScore = domainScores.get('Discipline & Behavior Management')?.percentage ?? 50;
  const communicationScore = domainScores.get('Communication & Emotional Connection')?.percentage ?? 50;

  const highDiscipline = disciplineScore >= 60;
  const lowDiscipline = disciplineScore < 40;
  const highCommunication = communicationScore >= 60;
  const lowCommunication = communicationScore < 40;

  if (highDiscipline && highCommunication) {
    return {
      primary: 'authoritative',
      secondary: 'Balanced warmth and structure',
      description:
        'You combine clear expectations with emotional warmth. This is widely regarded as the most effective parenting style, producing children who are confident, socially competent, and academically successful.',
      strengths: [
        'Children feel both loved and guided',
        'Clear rules are delivered with empathy and explanation',
        'Encourages independence within safe boundaries',
        'Builds strong communication and mutual respect',
      ],
      concerns: [
        'Maintaining consistency can be tiring — ensure both parents are aligned',
        'Some situations may require firmer, faster decisions',
      ],
    };
  }

  if (highDiscipline && lowCommunication) {
    return {
      primary: 'authoritarian',
      secondary: 'Structure without sufficient warmth',
      description:
        'You maintain strong rules and expectations but may not provide enough emotional openness. Children may comply but may not develop intrinsic motivation or feel comfortable sharing their feelings.',
      strengths: [
        'Clear boundaries and consistent expectations',
        'Children understand rules and consequences',
        'Strong emphasis on respect and discipline',
      ],
      concerns: [
        'Children may become secretive or rebellious as they grow older',
        'May damage the emotional bond between parent and child',
        'Children may struggle with decision-making and self-expression',
        'Consider explaining the "why" behind rules more often',
      ],
    };
  }

  if (lowDiscipline && highCommunication) {
    return {
      primary: 'permissive',
      secondary: 'Warmth without sufficient structure',
      description:
        'You are emotionally warm and communicative but may not set enough boundaries. Children may feel loved but can struggle with self-discipline, authority, and resilience.',
      strengths: [
        'Strong emotional connection and openness',
        'Children feel safe expressing themselves',
        'Nurturing and supportive environment',
      ],
      concerns: [
        'Children may struggle to respect authority figures outside the home',
        'Lack of boundaries can lead to entitlement or poor self-regulation',
        'May find it difficult to enforce consequences when needed',
        'Consider setting and holding firm boundaries with love',
      ],
    };
  }

  if (lowDiscipline && lowCommunication) {
    return {
      primary: 'uninvolved',
      secondary: 'Limited engagement in both areas',
      description:
        'Both discipline and communication need significant attention. This may be due to external pressures such as work demands, stress, or lack of support. Small, consistent steps can make a big difference.',
      strengths: [
        'Acknowledging the need for change is the first positive step',
        'Even small improvements in engagement can transform outcomes',
      ],
      concerns: [
        'Children may feel neglected or unimportant',
        'Higher risk of behavioural issues, poor academic performance, and emotional difficulties',
        'Seeking support from family, community, or professionals is strongly recommended',
        'Start with one small daily interaction to rebuild connection',
      ],
    };
  }

  return {
    primary: 'authoritative',
    secondary: 'Mixed style — leaning toward balanced',
    description:
        'Your parenting shows elements of multiple styles. This is normal and human. The goal is to consistently lean toward the authoritative approach that combines warmth with structure.',
    strengths: [
      'Flexibility to adapt to different situations',
      'Willingness to engage across multiple parenting dimensions',
    ],
    concerns: [
      'Inconsistency between styles can confuse children',
      'Work toward a more unified approach over time',
    ],
  };
}

function buildActionPlan(
  criticalGaps: ParentDomainAnalysis[],
  strengths: ParentDomainAnalysis[]
): ParentActionPlan[] {
  const gapDomains = criticalGaps.map((g) => g.domain);
  const strengthDomains = strengths.map((s) => s.domain);

  const week1Actions: string[] = [];
  const week2Actions: string[] = [];
  const week3Actions: string[] = [];
  const week4Actions: string[] = [];

  if (gapDomains.length > 0) {
    const topGap = criticalGaps[0];
    week1Actions.push(
      `Focus on "${topGap.domain}" — review the practical tips provided`,
      ...topGap.practicalTips.slice(0, 2)
    );
  }
  week1Actions.push(
    'Schedule a family meeting this week to discuss goals together',
    'Choose one daily habit to improve (e.g., phone-free meals, bedtime routine)'
  );

  if (gapDomains.length > 1) {
    const secondGap = criticalGaps[1];
    week2Actions.push(
      `Address "${secondGap.domain}" — start with the easiest tip provided`,
      ...secondGap.practicalTips.slice(0, 1)
    );
  }
  week2Actions.push(
    'Implement a consistent daily routine for at least 5 days this week',
    'Have one meaningful one-on-one conversation with your child each day',
    'Journal one positive interaction and one challenge each evening'
  );

  week3Actions.push(
    'Build on progress from weeks 1 and 2 — what worked? What needs adjusting?',
    'Introduce one new positive discipline or communication technique',
    'Involve your child in setting one family goal together',
    'Connect with one other parent or support resource for shared learning'
  );

  if (strengthDomains.length > 0) {
    const topStrength = strengths[0];
    week4Actions.push(
      `Leverage your strength in "${topStrength.domain}" to support weaker areas`,
      `Use your strong ${topStrength.domain.toLowerCase()} skills to model behaviour for other areas`
    );
  }
  week4Actions.push(
    'Review all changes made over the past three weeks',
    'Celebrate progress — no matter how small',
    'Set specific, measurable goals for the next month',
    'Consider sharing your experience with another parent to reinforce your learning'
  );

  return [
    {
      week: 1,
      theme: 'Foundation — Awareness and First Steps',
      actions: week1Actions,
      expectedOutcome:
        'You will have identified your top priority area and begun implementing at least two practical changes.',
      difficulty: 'easy',
    },
    {
      week: 2,
      theme: 'Building Consistency — Routine and Connection',
      actions: week2Actions,
      expectedOutcome:
        'You will establish a daily routine that includes intentional connection time with your child.',
      difficulty: 'moderate',
    },
    {
      week: 3,
      theme: 'Deepening Practice — Skill Development',
      actions: week3Actions,
      expectedOutcome:
        'You will apply new techniques with growing confidence and begin to notice shifts in behaviour.',
      difficulty: 'moderate',
    },
    {
      week: 4,
      theme: 'Reflection and Sustainability — Making It Stick',
      actions: week4Actions,
      expectedOutcome:
        'You will have a clear picture of your progress and a sustainable plan for continued growth.',
      difficulty: 'challenging',
    },
  ];
}

function getAgeSpecificInsight(age?: number): AgeSpecificInsight {
  if (age === undefined || age === null) {
    return {
      ageGroup: 'Unknown',
      relevantDomains: Object.keys(DOMAIN_FINDINGS),
      developmentalStage: 'Age not provided — insights are general',
      keyStrategies: [
        'Focus on core communication and discipline foundations',
        'Build consistent routines that support overall development',
        'Seek age-appropriate resources for your specific situation',
      ],
      warningSigns: [
        'Persistent behavioural changes that last more than two weeks',
        'Sudden withdrawal from family or social activities',
        'Significant changes in eating, sleeping, or mood',
      ],
    };
  }

  if (age <= 5) {
    return {
      ageGroup: '0–5 years',
      relevantDomains: [
        'Communication & Emotional Connection',
        'Health, Nutrition & Wellbeing',
        'Safety & Supervision',
        'Cultural & Moral Values',
      ],
      developmentalStage:
        'Early Childhood — Rapid brain development, forming attachment bonds, learning through play and sensory exploration',
      keyStrategies: [
        'Respond consistently to your child\'s emotional cues to build secure attachment',
        'Read aloud daily — even newborns benefit from hearing your voice',
        'Establish predictable routines for meals, play, and sleep',
        'Allow supervised exploration to build confidence and curiosity',
        'Use simple, clear language and name emotions as they happen',
      ],
      warningSigns: [
        'Not responding to their name or making eye contact by 12 months',
        'Not walking or showing motor skill progress by expected milestones',
        'Lack of speech development appropriate for their age',
        'Extreme difficulty with transitions or separation beyond normal levels',
      ],
    };
  }

  if (age <= 10) {
    return {
      ageGroup: '6–10 years',
      relevantDomains: [
        'Academic Support & Involvement',
        'Social Development',
        'Discipline & Behavior Management',
        'Digital Literacy & Screen Time',
        'Financial Literacy for Children',
      ],
      developmentalStage:
        'Middle Childhood — Developing academic identity, expanding social world, understanding rules and fairness, growing independence',
      keyStrategies: [
        'Create a structured homework routine with a consistent time and space',
        'Encourage friendships and guide your child through social challenges',
        'Use logical consequences rather than punishment to teach accountability',
        'Introduce pocket money and guide saving and spending habits',
        'Set screen time limits and co-view content when possible',
      ],
      warningSigns: [
        'Sudden drop in academic performance or refusal to attend school',
        'Persistent difficulty making or keeping friends',
        'Frequent physical complaints without medical cause (headaches, stomachaches)',
        'Increasing secrecy or withdrawal from family activities',
      ],
    };
  }

  if (age <= 13) {
    return {
      ageGroup: '11–13 years',
      relevantDomains: [
        'Communication & Emotional Connection',
        'Adolescent Development',
        'Digital Literacy & Screen Time',
        'Stress Management & Self-Care',
        'Social Development',
      ],
      developmentalStage:
        'Early Adolescence — Puberty, identity formation, peer influence increases, emotional intensity grows, desire for independence',
      keyStrategies: [
        'Maintain open communication even when your child becomes less talkative',
        'Provide age-appropriate puberty education before changes begin',
        'Negotiate rules together — give choices within clear boundaries',
        'Stay involved in their digital life without being intrusive',
        'Model healthy stress management and emotional expression',
      ],
      warningSigns: [
        'Significant mood swings beyond typical adolescent fluctuations',
        'Loss of interest in previously enjoyed activities',
        'Changes in friend group accompanied by secretive behaviour',
        'Self-harm talk, eating disorder signs, or substance experimentation',
      ],
    };
  }

  if (age <= 17) {
    return {
      ageGroup: '14–17 years',
      relevantDomains: [
        'Communication & Emotional Connection',
        'Adolescent Development',
        'Financial Literacy for Children',
        'Safety & Supervision',
        'Digital Literacy & Screen Time',
      ],
      developmentalStage:
        'Late Adolescence — Preparing for independence, developing personal values, future planning, deeper relationships',
      keyStrategies: [
        'Shift from directing to advising — share your perspective, then listen',
        'Discuss future plans: education, career, and life goals',
        'Teach practical life skills: budgeting, cooking, time management',
        'Respect growing autonomy while maintaining non-negotiable safety boundaries',
        'Have honest conversations about relationships, consent, and responsibility',
      ],
      warningSigns: [
        'Complete withdrawal from family communication',
        'Academic disengagement or truancy',
        'Risk-taking behaviour: substance use, reckless driving, unsafe relationships',
        'Expressing hopelessness about the future or persistent sadness',
      ],
    };
  }

  return {
    ageGroup: '18+ years',
    relevantDomains: [
      'Communication & Emotional Connection',
      'Financial Literacy for Children',
      'Stress Management & Self-Care',
    ],
    developmentalStage:
      'Young Adulthood — Establishing independence, career development, adult relationships, continued identity formation',
    keyStrategies: [
      'Transition from parent to mentor — offer guidance when asked',
      'Support independence by allowing them to make and learn from decisions',
      'Maintain the relationship through regular, pressure-free contact',
      'Discuss financial independence: budgeting, savings, and career planning',
      'Respect their adult choices while sharing your perspective when welcome',
    ],
    warningSigns: [
      'Difficulty functioning independently in daily life',
      'Returning home due to unresolved emotional or mental health challenges',
      'Financial dependence without progress toward self-sufficiency',
      'Strained relationship characterised by conflict or silence',
    ],
  };
}

function buildResourceRecommendations(
  domainScores: Map<string, { percentage: number }>
): ResourceRecommendation[] {
  const resources: ResourceRecommendation[] = [];

  const lowDomains = Array.from(domainScores.entries())    .filter(([, data]) => data.percentage < 60)
    .sort((a, b) => a[1].percentage - b[1].percentage);

  const targetDomains = lowDomains.length > 0
    ? lowDomains.slice(0, 5).map(([domain]) => domain)
    : Array.from(domainScores.keys()).slice(0, 3);

  const resourcePool: Record<string, ResourceRecommendation[]> = {
    'Communication & Emotional Connection': [
      {
        domain: 'Communication & Emotional Connection',
        category: 'book',
        title: 'How to Talk So Kids Will Listen & Listen So Kids Will Talk',
        description:
          'Practical communication techniques that strengthen the parent-child relationship across all ages.',
      },
      {
        domain: 'Communication & Emotional Connection',
        category: 'activity',
        title: 'Weekly Family Meeting',
        description:
          'Hold a 20-minute family meeting each week where every member shares highs, lows, and requests. Keep it structured and positive.',
      },
      {
        domain: 'Communication & Emotional Connection',
        category: 'article',
        title: 'The Power of Active Listening in Parenting',
        description:
          'Learn how reflecting back what your child says builds trust and encourages open communication.',
      },
    ],
    'Discipline & Behavior Management': [
      {
        domain: 'Discipline & Behavior Management',
        category: 'book',
        title: 'Positive Discipline by Jane Nelsen',
        description:
          'A comprehensive guide to discipline that teaches without punishment, building long-term self-discipline.',
      },
      {
        domain: 'Discipline & Behavior Management',
        category: 'video',
        title: '1-2-3 Magic: Effective Discipline for Children',
        description:
          'A simple, proven counting method for managing challenging behaviour without yelling, spanking, or arguing.',
      },
      {
        domain: 'Discipline & Behavior Management',
        category: 'activity',
        title: 'Family Behaviour Agreement',
        description:
          'Sit together and create a written agreement about family rules, expectations, and consequences everyone agrees to.',
      },
    ],
    'Academic Support & Involvement': [
      {
        domain: 'Academic Support & Involvement',
        category: 'article',
        title: 'How Nigerian Parents Can Support Learning at Home',
        description:
          'Practical strategies for supporting education even when you feel limited by your own educational background.',
      },
      {
        domain: 'Academic Support & Involvement',
        category: 'activity',
        title: 'Homework Station Setup',
        description:
          'Create a dedicated, well-lit study space with necessary supplies. Establish a consistent homework time each day.',
      },
      {
        domain: 'Academic Support & Involvement',
        category: 'professional',
        title: 'Parent-Teacher Conference Preparation',
        description:
          'Prepare questions before meetings: What is my child doing well? Where do they struggle? How can I help at home?',
      },
    ],
    'Health, Nutrition & Wellbeing': [
      {
        domain: 'Health, Nutrition & Wellbeing',
        category: 'book',
        title: 'Nigerian Cookbook for Healthy Families',
        description:
          'Explore nutritious Nigerian meals that children enjoy while supporting optimal growth and development.',
      },
      {
        domain: 'Health, Nutrition & Wellbeing',
        category: 'activity',
        title: 'Family Cooking Sessions',
        description:
          'Involve children in preparing meals — it teaches life skills, nutrition awareness, and creates bonding opportunities.',
      },
      {
        domain: 'Health, Nutrition & Wellbeing',
        category: 'professional',
        title: 'Child Health Check-Up Checklist',
        description:
          'Schedule regular growth monitoring, dental check-ups, vision tests, and ensure vaccinations are up to date.',
      },
    ],
    'Safety & Supervision': [
      {
        domain: 'Safety & Supervision',
        category: 'article',
        title: 'Age-Appropriate Supervision Guide',
        description:
          'Understanding how much supervision your child needs at each developmental stage.',
      },
      {
        domain: 'Safety & Supervision',
        category: 'activity',
        title: 'Safety Rules Discussion',
        description:
          'Regularly discuss safety topics: stranger awareness, road safety, home safety, and personal body boundaries.',
      },
      {
        domain: 'Safety & Supervision',
        category: 'video',
        title: 'Teaching Children Personal Safety',
        description:
          'Age-appropriate videos that teach children about safe and unsafe situations in an empowering way.',
      },
    ],
    'Social Development': [
      {
        domain: 'Social Development',
        category: 'activity',
        title: 'Structured Play Dates and Group Activities',
        description:
          'Arrange regular social opportunities for your child to practise sharing, cooperation, and conflict resolution.',
      },
      {
        domain: 'Social Development',
        category: 'book',
        title: 'Raising a Socially Competent Child',
        description:
          'Strategies for building empathy, cooperation, and healthy relationships from early childhood through adolescence.',
      },
      {
        domain: 'Social Development',
        category: 'professional',
        title: 'Social Skills Groups',
        description:
          'Consider enrolling your child in community groups, religious organisations, or school clubs for structured social interaction.',
      },
    ],
    'Digital Literacy & Screen Time': [
      {
        domain: 'Digital Literacy & Screen Time',
        category: 'article',
        title: 'Nigerian Family Guide to Managing Screen Time',
        description:
          'Practical screen time guidelines by age group with strategies for implementation that work in Nigerian households.',
      },
      {
        domain: 'Digital Literacy & Screen Time',
        category: 'activity',
        title: 'Family Media Agreement',
        description:
          'Create a written agreement together about when, where, and how devices are used in your home.',
      },
      {
        domain: 'Digital Literacy & Screen Time',
        category: 'video',
        title: 'Online Safety for Nigerian Children',
        description:
          'Resources that teach children about online predators, cyberbullying, and responsible digital citizenship.',
      },
    ],
    'Cultural & Moral Values': [
      {
        domain: 'Cultural & Moral Values',
        category: 'activity',
        title: 'Story Night',
        description:
          'Share family stories, cultural tales, and proverbs weekly. Discuss the lessons and how they apply to modern life.',
      },
      {
        domain: 'Cultural & Moral Values',
        category: 'book',
        title: 'Nigerian Folktales for Children',
        description:
          'Collections of traditional stories that transmit cultural values and moral lessons through engaging narratives.',
      },
      {
        domain: 'Cultural & Moral Values',
        category: 'video',
        title: 'Cultural Celebrations and Their Meaning',
        description:
          'Explore videos about Nigerian cultural festivals and traditions to help children understand their heritage.',
      },
    ],
    'Adolescent Development': [
      {
        domain: 'Adolescent Development',
        category: 'book',
        title: 'The Teenage Brain by Frances Jensen',
        description:
          'Understanding the science behind adolescent behaviour helps parents respond with empathy rather than frustration.',
      },
      {
        domain: 'Adolescent Development',
        category: 'article',
        title: 'Parenting Nigerian Teens in a Modern World',
        description:
          'Navigating the intersection of traditional expectations and contemporary adolescent challenges.',
      },
      {
        domain: 'Adolescent Development',
        category: 'professional',
        title: 'Family Counselling Services',
        description:
          'Consider professional family therapy if communication has broken down or if there are significant behavioural concerns.',
      },
    ],
    'Stress Management & Self-Care': [
      {
        domain: 'Stress Management & Self-Care',
        category: 'book',
        title: 'Self-Compassion for Parents',
        description:
          'Learn to be kind to yourself as a parent — perfection is not the goal, consistency and love are.',
      },
      {
        domain: 'Stress Management & Self-Care',
        category: 'activity',
        title: 'Daily Self-Care Ritual',
        description:
          'Commit to one small daily self-care act: 15 minutes of quiet, a walk, prayer, or a hobby. Model this for your children.',
      },
      {
        domain: 'Stress Management & Self-Care',
        category: 'professional',
        title: 'Parent Support Groups',
        description:
          'Join local or online parenting communities where you can share experiences and get practical advice from other parents.',
      },
    ],
    'Special Needs Awareness': [
      {
        domain: 'Special Needs Awareness',
        category: 'article',
        title: 'Understanding Developmental Milestones in Nigerian Children',
        description:
          'A comprehensive guide to typical developmental milestones and when to seek professional evaluation.',
      },
      {
        domain: 'Special Needs Awareness',
        category: 'professional',
        title: 'Early Intervention Services',
        description:
          'Connect with child development specialists, occupational therapists, or educational psychologists for assessment and support.',
      },
      {
        domain: 'Special Needs Awareness',
        category: 'activity',
        title: 'Developmental Observation Journal',
        description:
          'Keep a brief weekly journal noting your child\'s development in key areas to identify patterns and track progress.',
      },
    ],
    'Financial Literacy for Children': [
      {
        domain: 'Financial Literacy for Children',
        category: 'activity',
        title: 'Savings Box Challenge',
        description:
          'Use a transparent container to save together for a family goal. Children can see money grow and learn delayed gratification.',
      },
      {
        domain: 'Financial Literacy for Children',
        category: 'book',
        title: 'Money Lessons for Children',
        description:
          'Age-appropriate books that teach counting, saving, sharing, and making choices with money.',
      },
      {
        domain: 'Financial Literacy for Children',
        category: 'video',
        title: 'Teaching Children About Money in Nigeria',
        description:
          'Video resources on pocket money management, saving culture, and financial responsibility for Nigerian families.',
      },
    ],
  };

  for (const domain of targetDomains) {
    const domainResources = resourcePool[domain];
    if (domainResources) {
      resources.push(...domainResources);
    }
  }

  return resources;
}

function buildRedFlags(
  domainAnalyses: ParentDomainAnalysis[]
): ParentDeepReport['redFlags'] {
  const redFlags: ParentDeepReport['redFlags'] = [];

  for (const analysis of domainAnalyses) {
    if (analysis.score < 20) {
      redFlags.push({
        domain: analysis.domain,
        concern: `Critical score of ${analysis.score}% indicates serious gaps that may significantly impact your child's development and wellbeing`,
        urgency: 'immediate',
      });
    } else if (analysis.score < 40) {
      redFlags.push({
        domain: analysis.domain,
        concern: `Score of ${analysis.score}% shows significant room for improvement — this area needs focused attention in the coming weeks`,
        urgency: 'soon',
      });
    } else if (analysis.score < 50) {
      redFlags.push({
        domain: analysis.domain,
        concern: `Score of ${analysis.score}% is below average — monitor this area and consider the suggested improvements`,
        urgency: 'monitor',
      });
    }
  }

  return redFlags.sort((a, b) => {
    const order = { immediate: 0, soon: 1, monitor: 2 };
    return order[a.urgency] - order[b.urgency];
  });
}

function generateAiSummary(
  overallScore: number,
  domainAnalyses: ParentDomainAnalysis[],
  parentingStyle: ParentingStyleProfile,
  criticalGaps: ParentDomainAnalysis[],
  strengths: ParentDomainAnalysis[],
  childAge?: number
): string {
  const overallRating = getOverallRating(overallScore);
  const ageContext = childAge !== undefined
    ? ` Your child is ${childAge} years old, which places them in the ${getAgeSpecificInsight(childAge).developmentalStage.split('—')[0].trim()} stage.`
    : '';

  let summary = `Your overall parenting score is ${overallScore}%, rated as "${overallRating.split('—')[0].trim()}.${ageContext}"\n\n`;

  summary += `Your parenting style profile is primarily ${parentingStyle.primary}`;
  if (parentingStyle.secondary) {
    summary += ` with a secondary tendency toward "${parentingStyle.secondary}"`;
  }
  summary += `. ${parentingStyle.description}\n\n`;

  if (strengths.length > 0) {
    summary += `Your key strengths are in ${strengths.map((s) => `"${s.domain}"`).join(', ')}. `;
    summary += 'These are areas where you are making a real positive difference in your child\'s life. ';
    summary += 'Continue building on these foundations.\n\n';
  }

  if (criticalGaps.length > 0) {
    summary += `Your areas needing the most attention are ${criticalGaps.map((g) => `"${g.domain}"`).join(', ')}. `;
    summary += 'These areas scored below 40% and represent opportunities for meaningful improvement. ';
    summary += 'The action plan provided focuses on these priority areas with practical, achievable steps.\n\n';
  }

  if (criticalGaps.length === 0) {
    summary += 'You do not have any critical gaps, which is excellent. ';
    summary += 'Focus on maintaining your strengths while continuing to refine areas scored below 70%.\n\n';
  }

  summary += `The 4-week action plan is designed to help you make steady progress. `;
  summary += `Start with Week 1's foundation activities and build momentum from there. `;
  summary += `Remember: parenting is a journey, not a destination. Every small, consistent step counts.`;

  return summary;
}

export function generateParentDeepReport(
  responses: { questionId: string; score: number; domain: string; dimension: string }[],
  childAge?: number
): ParentDeepReport {
  const domainScores = calculateDomainScores(responses);

  const domainAnalyses: ParentDomainAnalysis[] = [];
  Array.from(domainScores.entries()).forEach(([domain, data]) => {
    domainAnalyses.push(buildDomainAnalysis(domain, data.percentage));
  });

  domainAnalyses.sort((a, b) => a.score - b.score);

  const overallScore =
    domainAnalyses.length > 0
      ? Math.round(
          (domainAnalyses.reduce((sum, d) => sum + d.score, 0) / domainAnalyses.length) * 10
        ) / 10
      : 0;

  const overallRating = getOverallRating(overallScore);
  const parentingStyle = determineParentingStyle(domainScores);

  const criticalGaps = domainAnalyses.filter((d) => d.score < 40);
  const strengths = domainAnalyses.filter((d) => d.score >= 70);

  const actionPlan = buildActionPlan(criticalGaps, strengths);
  const ageSpecificInsights = getAgeSpecificInsight(childAge);
  const resourceRecommendations = buildResourceRecommendations(domainScores);
  const redFlags = buildRedFlags(domainAnalyses);
  const aiSummary = generateAiSummary(
    overallScore,
    domainAnalyses,
    parentingStyle,
    criticalGaps,
    strengths,
    childAge
  );

  return {
    overallScore,
    overallRating,
    domainAnalysis: domainAnalyses,
    parentingStyle,
    criticalGaps,
    strengths,
    actionPlan,
    ageSpecificInsights,
    resourceRecommendations,
    redFlags,
    aiSummary,
  };
}
