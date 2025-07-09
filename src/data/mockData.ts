export interface Persona {
  id: string;
  name: string;
  program: string;
  ageRange: string;
  careerStage: string;
  avatar?: string;
  motivationalTagline: string;
  goals: string[];
  fears: string[];
  motivations: string[];
  channels: string[];
  demographics: {
    location: string;
    income: string;
    education: string;
  };
  psychographics: {
    values: string[];
    interests: string[];
    lifestyle: string;
  };
  programNeeds: string[];
  performance: {
    cpl: number;
    ctr: number;
    conversionRate: number;
    totalSpend: number;
    totalLeads: number;
  };
  moodBoardImages: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Campaign {
  id: string;
  personaId: string;
  name: string;
  channel: string;
  spend: number;
  clicks: number;
  leads: number;
  cta: string;
  notes: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
}

export interface Activity {
  id: string;
  type: 'persona_created' | 'campaign_launched' | 'insight_generated' | 'performance_alert';
  title: string;
  description: string;
  timestamp: string;
  personaId?: string;
  campaignId?: string;
}

export interface Insight {
  id: string;
  personaId: string;
  title: string;
  content: string;
  type: 'optimization' | 'opportunity' | 'warning' | 'trend';
  generatedAt: string;
  isGptGenerated: boolean;
}

export interface CampaignPlan {
  id: string;
  campaignId: string;
  markdownContent: string;
  lastUpdated: string;
}

// Mock Personas Data
export const mockPersonas: Persona[] = [
  {
    id: '1',
    name: 'Matthew',
    program: 'Supply Chain',
    ageRange: '34-45',
    careerStage: 'Mid-Career Professional',
    avatar: '/lovable-uploads/d84fb05f-879d-4d53-9840-0637944579b1.png',
    motivationalTagline: 'Building tomorrow\'s tech solutions today',
    goals: ['Land FAANG internship', 'Master full-stack development', 'Build startup portfolio'],
    fears: ['Falling behind in rapidly evolving tech', 'Impostor syndrome', 'Job market saturation'],
    motivations: ['Innovation and creativity', 'High earning potential', 'Making global impact'],
    channels: ['Instagram', 'TikTok', 'LinkedIn', 'Discord', 'YouTube'],
    demographics: {
      location: 'Urban/Suburban Michigan',
      income: '$0-25K (family support)',
      education: 'Current undergrad'
    },
    psychographics: {
      values: ['Innovation', 'Efficiency', 'Authenticity'],
      interests: ['Coding', 'Gaming', 'Entrepreneurship', 'Tech podcasts'],
      lifestyle: 'Digital-first, highly connected'
    },
    programNeeds: [
      'Async learning flexibility',
      'Industry-relevant projects',
      'Personal brand credibility',
      'Tech stack diversity',
      'Networking opportunities',
      'Career placement support'
    ],
    performance: {
      cpl: 45.50,
      ctr: 3.2,
      conversionRate: 12.5,
      totalSpend: 12500,
      totalLeads: 275
    },
    moodBoardImages: [
      '/lovable-uploads/7c1b2453-e7b0-4e31-ab62-900114b973ac.png',
      '/lovable-uploads/1b34ec87-603e-411a-ba2f-ddce2e6887e7.png',
      '/lovable-uploads/e7a40ff2-a28c-4f5e-a2f4-64d58660aa7d.png',
      '/lovable-uploads/526bac4b-876d-4930-87a3-a35b7eb4293d.png'
    ],
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Liz',
    program: 'Healthcare',
    ageRange: '25-34',
    careerStage: 'Early Stage Career',
    avatar: '/lovable-uploads/a3668f73-99ce-4727-ae09-712fc0960627.png',
    motivationalTagline: 'Transforming experience into leadership excellence',
    goals: ['Executive role transition', 'Network with industry leaders', 'Develop strategic thinking'],
    fears: ['Career stagnation', 'Age discrimination', 'Financial instability during transition'],
    motivations: ['Leadership impact', 'Financial growth', 'Work-life balance'],
    channels: ['LinkedIn', 'Facebook', 'Email', 'Professional networks', 'Podcasts'],
    demographics: {
      location: 'Metro Detroit area',
      income: '$75K-120K',
      education: 'Bachelor\'s + work experience'
    },
    psychographics: {
      values: ['Achievement', 'Stability', 'Growth'],
      interests: ['Leadership books', 'Networking events', 'Golf', 'Investment'],
      lifestyle: 'Time-conscious, goal-oriented'
    },
    programNeeds: [
      'Executive leadership training',
      'Strategic thinking modules',
      'Network access to C-suite',
      'Flexible scheduling options',
      'ROI measurement tools',
      'Industry transformation insights'
    ],
    performance: {
      cpl: 78.25,
      ctr: 2.8,
      conversionRate: 8.5,
      totalSpend: 15600,
      totalLeads: 199
    },
    moodBoardImages: [
      '/lovable-uploads/ab3d3d86-e2b3-4037-9b79-b941a63875d4.png',
      '/lovable-uploads/fc881505-3a2f-4166-94fe-199aee2f5cbf.png',
      '/lovable-uploads/37f02383-ebc1-4ee9-b9b7-4d6004733a32.png',
      '/lovable-uploads/1a920559-d7a3-4c76-9bfc-7da61ccd715f.png'
    ],
    isActive: true,
    createdAt: '2024-02-03'
  },
  {
    id: '3',
    name: 'Claire',
    program: 'Management Strategy & Leadership',
    ageRange: '45-55',
    careerStage: 'Mid-Career Professional',
    avatar: '/lovable-uploads/24dd0e2e-244c-4d6b-b857-11531bc70aba.png',
    motivationalTagline: 'It\'s never too late to learn something new',
    goals: ['Skill diversification', 'Professional certification', 'Personal enrichment'],
    fears: ['Technology gaps', 'Ageism in workplace', 'Irrelevance in changing markets'],
    motivations: ['Intellectual curiosity', 'Job security', 'Personal fulfillment'],
    channels: ['Facebook', 'Email', 'YouTube', 'Professional associations', 'Traditional media'],
    demographics: {
      location: 'Small towns/Rural Michigan',
      income: '$50K-85K',
      education: 'Bachelor\'s degree'
    },
    psychographics: {
      values: ['Learning', 'Tradition', 'Community'],
      interests: ['Reading', 'Community involvement', 'Family activities', 'Travel'],
      lifestyle: 'Balanced, community-focused'
    },
    programNeeds: [
      'Self-paced learning options',
      'Practical skill applications',
      'Community support network',
      'Cost-effective programs',
      'Work-life balance consideration',
      'Clear progression pathways'
    ],
    performance: {
      cpl: 92.10,
      ctr: 1.9,
      conversionRate: 15.2,
      totalSpend: 8900,
      totalLeads: 97
    },
    moodBoardImages: [
      '/lovable-uploads/e465a6f2-b5b2-4ebd-9da9-37aa8ea7c24e.png',
      '/lovable-uploads/fbbe45d9-eb4f-44b1-8f8a-7e78c0b371cb.png',
      '/lovable-uploads/ee9ed60e-573f-4e6b-ba43-871921c90535.png'
    ],
    isActive: false,
    createdAt: '2024-01-28'
  },
  {
    id: '4',
    name: 'Kelly',
    program: 'Supply Chain',
    ageRange: '50-60',
    careerStage: 'Senior Executive',
    avatar: '/lovable-uploads/4341c6c4-9c16-40ac-891a-84356888cd98.png',
    motivationalTagline: 'Leading with wisdom and vision',
    goals: ['C-suite advancement', 'Board position preparation', 'Legacy building'],
    fears: ['Industry disruption', 'Succession planning', 'Market volatility'],
    motivations: ['Thought leadership', 'Industry influence', 'Organizational impact'],
    channels: ['LinkedIn', 'Email', 'Industry publications', 'Executive networks', 'Conferences'],
    demographics: {
      location: 'Major metropolitan areas',
      income: '$200K+',
      education: 'Advanced degree + extensive experience'
    },
    psychographics: {
      values: ['Excellence', 'Integrity', 'Innovation'],
      interests: ['Strategic planning', 'Mentoring', 'Industry analysis', 'Executive coaching'],
      lifestyle: 'High-performance, results-driven'
    },
    programNeeds: [
      'Executive-level curriculum',
      'Peer networking opportunities',
      'Industry transformation insights',
      'Leadership coaching',
      'Strategic decision-making frameworks',
      'Board readiness preparation'
    ],
    performance: {
      cpl: 120.75,
      ctr: 1.5,
      conversionRate: 22.8,
      totalSpend: 18200,
      totalLeads: 151
    },
    moodBoardImages: [
      '/lovable-uploads/61aab3ad-75cc-4df5-8e1c-89c2a76356cf.png',
      '/lovable-uploads/9ed3e26c-b739-4b63-a36f-b2fa1e8dcad5.png',
      '/lovable-uploads/3d07f583-455d-41d9-8d6b-d713c351c538.png'
    ],
    isActive: true,
    createdAt: '2024-03-01'
  }
];

// Mock Campaigns Data
export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    personaId: '1',
    name: 'CS Program - Social Media Blitz',
    channel: 'Instagram',
    spend: 2500,
    clicks: 1250,
    leads: 87,
    cta: 'Code Your Future at MSU',
    notes: 'High engagement on coding challenge posts',
    startDate: '2024-03-01',
    status: 'active'
  },
  {
    id: '2',
    personaId: '2',
    name: 'MBA Leadership Summit',
    channel: 'LinkedIn',
    spend: 3200,
    clicks: 890,
    leads: 45,
    cta: 'Lead the Change - MSU MBA',
    notes: 'Strong response from finance professionals',
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    status: 'completed'
  },
  {
    id: '3',
    personaId: '3',
    name: 'Continuing Ed - Community Focus',
    channel: 'Facebook',
    spend: 1800,
    clicks: 720,
    leads: 63,
    cta: 'Never Stop Learning',
    notes: 'Better performance in evening posts',
    startDate: '2024-03-10',
    status: 'active'
  }
];

// Mock Activity Feed
export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'insight_generated',
    title: 'New optimization insight for Digital Native Dana',
    description: 'AI identified 23% improvement opportunity in TikTok ad timing',
    timestamp: '2024-03-15T10:30:00Z',
    personaId: '1'
  },
  {
    id: '2',
    type: 'campaign_launched',
    title: 'MBA Leadership Summit campaign launched',
    description: 'LinkedIn campaign targeting career pivot professionals',
    timestamp: '2024-03-15T09:15:00Z',
    personaId: '2',
    campaignId: '2'
  },
  {
    id: '3',
    type: 'performance_alert',
    title: 'CPL threshold exceeded for Lifelong Learner Lisa',
    description: 'Facebook campaign CPL increased 15% above target',
    timestamp: '2024-03-14T16:45:00Z',
    personaId: '3'
  },
  {
    id: '4',
    type: 'persona_created',
    title: 'New persona: Digital Native Dana',
    description: 'AI-generated persona for Computer Science program',
    timestamp: '2024-03-14T14:20:00Z',
    personaId: '1'
  }
];

// Mock Insights
export const mockInsights: Insight[] = [
  {
    id: '1',
    personaId: '1',
    title: 'Optimize TikTok Ad Timing',
    content: 'Data shows 23% higher engagement when posting between 6-8 PM EST. Consider shifting budget allocation to evening slots.',
    type: 'optimization',
    generatedAt: '2024-03-15T10:30:00Z',
    isGptGenerated: true
  },
  {
    id: '2',
    personaId: '2',
    title: 'LinkedIn Article Opportunity',
    content: 'Career pivot professionals respond well to thought leadership content. Consider sponsored articles about industry transformation.',
    type: 'opportunity',
    generatedAt: '2024-03-14T11:15:00Z',
    isGptGenerated: true
  },
  {
    id: '3',
    personaId: '3',
    title: 'Budget Reallocation Warning',
    content: 'Facebook CPL trending upward. Consider testing YouTube pre-roll ads for this demographic.',
    type: 'warning',
    generatedAt: '2024-03-13T15:22:00Z',
    isGptGenerated: true
  }
];

// Mock Campaign Plans
export const mockCampaignPlans: CampaignPlan[] = [
  {
    id: '1',
    campaignId: '1',
    lastUpdated: '2024-03-15T10:30:00Z',
    markdownContent: `# Campaign Overview

### **Why This Campaign, Why Now:**

**Elevating Computer Science Education in a Digital-First World**

The technology sector is experiencing unprecedented growth, with companies struggling to find qualified developers and computer scientists. Recent studies show a 35% increase in demand for software engineers, yet many students remain unaware of the opportunities available at MSU's Computer Science program. This campaign targets digitally native students who are already immersed in technology but need guidance on formal education pathways.

### **Who Are We Marketing To and Why:**

**Target Audience: Digital Native Students Seeking Career Foundation**

We are targeting tech-savvy students aged 18-22 who spend significant time on social media platforms, particularly Instagram and TikTok. These students have grown up with technology but may not have considered formal computer science education as their path forward. They're looking for programs that feel relevant, cutting-edge, and aligned with their digital lifestyle.

### **How The Program Helps:**

**Industry-Relevant Skills:** The program teaches current programming languages and frameworks that students see in real-world applications and social media tech content.

**Project-Based Learning:** Students build portfolios with projects they can showcase on their social media and professional profiles.

**Networking Opportunities:** Access to MSU's tech alumni network and internship placement programs with major tech companies.

### **What Are We Saying:**

"Code Your Future at MSU - Where Innovation Meets Education"

### **Why This Message Over Others:**

This message resonates with the target audience's desire to be creators and innovators, not just consumers of technology. The phrase "Code Your Future" directly connects their current interest in technology with their future career prospects, while "Where Innovation Meets Education" positions MSU as a forward-thinking institution that understands the tech landscape.

---

# **Campaign Phases**

### **Phase 1: Awareness Building Through Coding Challenges**

- **Objective:** Generate awareness through engaging, shareable content that demonstrates the fun and creative aspects of coding.
- **Implementation:** Daily coding challenges, tech trend explainers, and "day in the life" content from current CS students.

### **Phase 2: Social Proof and Success Stories**

- **Objective:** Build credibility by showcasing successful graduates and current student achievements.
- **Implementation:** Alumni spotlight posts, student project showcases, and internship success stories.

### **Phase 3: Direct Engagement and Community Building**

- **Objective:** Create a community around prospective CS students and encourage application submissions.
- **Implementation:** Live Q&A sessions, virtual campus tours, and exclusive Discord community for prospective students.

### **Phase 4: Conversion and Application Support**

- **Objective:** Convert engaged prospects into applications with personalized support and clear next steps.
- **Implementation:** One-on-one virtual meetings with admissions counselors, application deadline reminders, and scholarship opportunity highlights.`
  },
  {
    id: '2',
    campaignId: '2',
    lastUpdated: '2024-02-20T14:15:00Z',
    markdownContent: `# Campaign Overview

### **Why This Campaign, Why Now:**

**Elevating Leadership Skills in a Changing Business Landscape**

The post-pandemic business world has fundamentally shifted, requiring new leadership approaches and strategic thinking. Professionals with 5-15 years of experience are finding themselves at career crossroads, needing advanced business education to break through to executive levels. MSU's MBA program offers the strategic framework and network access these professionals need to make their next career leap.

### **Who Are We Marketing To and Why:**

**Target Audience: Mid-Career Professionals Seeking Executive Advancement**

We are targeting professionals aged 28-35 who have established themselves in their current roles but are hitting advancement barriers without additional credentials. These individuals are results-driven, time-conscious, and looking for ROI on their educational investment. They're active on LinkedIn and consume business-focused content regularly.

### **How The Program Helps:**

**Strategic Leadership Framework:** Advanced coursework in strategy, finance, and organizational behavior that directly applies to current work challenges.

**Executive Network Access:** Connection to MSU's extensive alumni network in C-suite positions across various industries.

**Flexible Format:** Evening and weekend classes designed for working professionals, with hybrid online/in-person options.

### **What Are We Saying:**

"Lead the Change - Transform Your Career with MSU MBA"

### **Why This Message Over Others:**

This message positions the target audience as change agents rather than followers, appealing to their leadership aspirations. "Transform Your Career" directly addresses their primary motivation for pursuing an MBA, while the MSU brand adds credibility and prestige to their educational choice.

---

# **Campaign Phases**

### **Phase 1: Leadership Summit Announcement**

- **Objective:** Generate initial awareness and establish MSU as a thought leader in business education.
- **Implementation:** Announce exclusive leadership summit featuring industry executives and MBA faculty.

### **Phase 2: Executive Success Stories**

- **Objective:** Build credibility through showcasing successful MBA alumni in leadership roles.
- **Implementation:** LinkedIn article series featuring MBA graduates who made successful career transitions.

### **Phase 3: Interactive Leadership Assessment**

- **Objective:** Engage prospects with personalized content that demonstrates program value.
- **Implementation:** Online leadership style assessment with personalized MBA curriculum recommendations.

### **Phase 4: Direct Outreach and Consultation**

- **Objective:** Convert qualified leads into applications through personalized engagement.
- **Implementation:** One-on-one career consultation calls with MBA admissions team and faculty.`
  },
  {
    id: '3',
    campaignId: '3',
    lastUpdated: '2024-03-12T16:45:00Z',
    markdownContent: `# Campaign Overview

### **Why This Campaign, Why Now:**

**Supporting Lifelong Learning in an Evolving Job Market**

The rapid pace of technological and industry change means that professionals must continuously update their skills to remain relevant. Many mid-career professionals feel overwhelmed by the pace of change and are looking for trusted educational institutions to guide their learning journey. MSU's continuing education programs provide the structure and credibility these learners need.

### **Who Are We Marketing To and Why:**

**Target Audience: Established Professionals Seeking Skill Enhancement**

We are targeting professionals aged 45-55 who have established careers but recognize the need for skill updates to maintain their competitive edge. These individuals value tradition and trust, preferring established institutions over online-only alternatives. They're active on Facebook and respond well to community-focused messaging.

### **How The Program Helps:**

**Practical Skill Application:** Courses designed to provide immediately applicable skills that enhance current job performance.

**Flexible Learning Options:** Self-paced and evening programs that accommodate busy professional schedules.

**Community Support:** Study groups and networking opportunities with peers facing similar career challenges.

### **What Are We Saying:**

"Never Stop Learning - Advance Your Career with MSU Continuing Education"

### **Why This Message Over Others:**

This message validates the target audience's commitment to professional growth while positioning continuous learning as a career advancement strategy rather than a necessity born from job insecurity. The MSU brand provides the institutional credibility this audience values.

---

# **Campaign Phases**

### **Phase 1: Community-Focused Awareness**

- **Objective:** Build awareness within local professional communities and associations.
- **Implementation:** Partnerships with local chambers of commerce and professional organizations for educational workshops.

### **Phase 2: Success Story Sharing**

- **Objective:** Demonstrate program value through relatable peer success stories.
- **Implementation:** Video testimonials from program graduates showing career advancement and skill application.

### **Phase 3: Interactive Skill Assessment**

- **Objective:** Engage prospects with personalized learning recommendations.
- **Implementation:** Online skill gap assessment with customized continuing education pathway recommendations.

### **Phase 4: Personal Consultation and Enrollment**

- **Objective:** Provide personalized guidance to convert prospects into enrolled students.
- **Implementation:** Individual consultations with academic advisors to create personalized learning plans.`
  }
];

// KPI Calculations
export const getKPIs = () => {
  const totalPersonas = mockPersonas.length;
  const activePersonas = mockPersonas.filter(p => p.isActive).length;
  const activeCampaigns = mockCampaigns.filter(c => c.status === 'active').length;
  const totalInsights = mockInsights.length;
  const totalSpend = mockCampaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalLeads = mockCampaigns.reduce((sum, c) => sum + c.leads, 0);
  const avgCPL = totalSpend / totalLeads;

  return {
    totalPersonas,
    activePersonas,
    activeCampaigns,
    totalInsights,
    totalSpend,
    totalLeads,
    avgCPL
  };
};