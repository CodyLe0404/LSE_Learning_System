/**
 * LMS Course Catalog & Discovery Service
 * Strictly adheres to the relational database schema:
 * - COURSE_CATEGORIES (CategoryId, CategoryName, ParentCategoryId)
 * - COURSES (CourseId, CourseCode, CourseName, Description, CategoryId, CourseType, Level, Duration, Version, Status, CreatedBy, CreatedAt, UpdatedAt)
 * - COURSE_SECTIONS (SectionId, CourseId, Title, Description, DisplayOrder)
 * - COURSE_CONTENTS (ContentId, SectionId, ContentType, Title, DisplayOrder, IsRequired, Duration)
 * - VIDEOS (VideoId, ContentId, FilePath, FileName, Duration, FileSize, ThumbnailPath)
 * - DOCUMENTS (DocumentId, ContentId, FilePath, FileName, FileSize, FileType, Version)
 */

// ============================================================================
// 1. RAW RELATIONAL DATABASE TABLES (MOCK REPOSITORY)
// ============================================================================

export const COURSE_CATEGORIES = [
  // Parent Categories (ParentCategoryId = null)
  { CategoryId: 1, CategoryName: 'Technical & Engineering', ParentCategoryId: null },
  { CategoryId: 2, CategoryName: 'Management & Leadership', ParentCategoryId: null },
  { CategoryId: 3, CategoryName: 'Compliance & Governance', ParentCategoryId: null },
  { CategoryId: 4, CategoryName: 'Soft Skills & Productivity', ParentCategoryId: null },
  { CategoryId: 5, CategoryName: 'Common & Onboarding', ParentCategoryId: null },

  // Children of Technical (ParentCategoryId = 1)
  { CategoryId: 101, CategoryName: 'Software Engineering & C#', ParentCategoryId: 1 },
  { CategoryId: 102, CategoryName: 'Database & Data Architecture', ParentCategoryId: 1 },
  { CategoryId: 103, CategoryName: 'Frontend & Modern Web', ParentCategoryId: 1 },
  { CategoryId: 104, CategoryName: 'Cloud, DevOps & Security', ParentCategoryId: 1 },
  { CategoryId: 105, CategoryName: 'Quality Assurance & Testing', ParentCategoryId: 1 },

  // Children of Management (ParentCategoryId = 2)
  { CategoryId: 201, CategoryName: 'Agile & Scrum Delivery', ParentCategoryId: 2 },
  { CategoryId: 202, CategoryName: 'People Leadership & Mentoring', ParentCategoryId: 2 },
  { CategoryId: 203, CategoryName: 'Operations & Process Strategy', ParentCategoryId: 2 },

  // Children of Compliance (ParentCategoryId = 3)
  { CategoryId: 301, CategoryName: 'Information Security & Privacy', ParentCategoryId: 3 },
  { CategoryId: 302, CategoryName: 'Corporate Ethics & Legal Standards', ParentCategoryId: 3 },
  { CategoryId: 303, CategoryName: 'Workplace Safety & Standards', ParentCategoryId: 3 },

  // Children of Soft Skills (ParentCategoryId = 4)
  { CategoryId: 401, CategoryName: 'Executive Communication', ParentCategoryId: 4 },
  { CategoryId: 402, CategoryName: 'High-Impact Presentation', ParentCategoryId: 4 },
  { CategoryId: 403, CategoryName: 'Conflict Resolution & Teamwork', ParentCategoryId: 4 },

  // Children of Common & Onboarding (ParentCategoryId = 5)
  { CategoryId: 501, CategoryName: 'Company Culture & Values', ParentCategoryId: 5 },
  { CategoryId: 502, CategoryName: 'Workplace Safety Protocols', ParentCategoryId: 5 },
  { CategoryId: 503, CategoryName: 'IT Tools & Corporate SOPs', ParentCategoryId: 5 }
];

export const COURSES = [
  {
    CourseId: 101,
    CourseCode: 'ENG-CS-101',
    CourseName: 'C# 12 & .NET 9 Enterprise Architecture Masterclass',
    Description: 'Master modern C# features, clean architecture, dependency injection, high-throughput Web APIs, and asynchronous programming patterns in production enterprise systems.',
    CategoryId: 101,
    CourseType: 'Online',
    Level: 'Intermediate',
    Duration: 360, // minutes (6.0 hrs)
    Version: 2,
    Status: 'Published',
    CreatedBy: 1003,
    CreatedAt: '2026-01-15T08:30:00Z',
    UpdatedAt: '2026-08-20T14:15:00Z',
    // UI Metadata & Presentation attributes
    instructorName: 'Lê Văn C (Tech Lead)',
    instructorTitle: 'Principal Software Architect',
    rating: 4.9,
    enrollmentCount: 1420
  },
  {
    CourseId: 102,
    CourseCode: 'ENG-SQL-201',
    CourseName: 'SQL Server High Availability, Indexing & Query Tuning',
    Description: 'In-depth database administration covering index fragmentation, execution plan debugging, AlwaysOn availability groups, partitioning, and deadlock resolution.',
    CategoryId: 102,
    CourseType: 'Online',
    Level: 'Advanced',
    Duration: 300, // minutes (5.0 hrs)
    Version: 1,
    Status: 'Published',
    CreatedBy: 1003,
    CreatedAt: '2026-02-01T09:00:00Z',
    UpdatedAt: '2026-08-10T11:00:00Z',
    instructorName: 'Lê Văn C (Tech Lead)',
    instructorTitle: 'Principal Database Architect',
    rating: 4.85,
    enrollmentCount: 980
  },
  {
    CourseId: 103,
    CourseCode: 'ENG-VUE-301',
    CourseName: 'Full-Stack Vue 3, Vite, Pinia & Tailwind Design Systems',
    Description: 'Build high-performance, accessible enterprise web applications with Vue 3 Composition API, PrimeVue 4 theme design tokens, Vite plugins, and reactive state architectures.',
    CategoryId: 103,
    CourseType: 'Online',
    Level: 'Beginner',
    Duration: 420, // minutes (7.0 hrs)
    Version: 3,
    Status: 'Published',
    CreatedBy: 1002,
    CreatedAt: '2026-02-20T10:00:00Z',
    UpdatedAt: '2026-09-01T16:45:00Z',
    instructorName: 'Trần Thị B (Senior Frontend)',
    instructorTitle: 'Lead UI/UX Engineer',
    rating: 4.95,
    enrollmentCount: 2150
  },
  {
    CourseId: 104,
    CourseCode: 'ENG-CLOUD-401',
    CourseName: 'Cloud Infrastructure, Docker & Kubernetes CI/CD Pipelines',
    Description: 'Comprehensive hands-on training for containerizing microservices, setting up Helm charts, Kubernetes cluster monitoring, zero-downtime rolling updates, and security hardening.',
    CategoryId: 104,
    CourseType: 'Blended',
    Level: 'Advanced',
    Duration: 480, // minutes (8.0 hrs)
    Version: 1,
    Status: 'Published',
    CreatedBy: 1005,
    CreatedAt: '2026-03-10T08:00:00Z',
    UpdatedAt: '2026-09-05T09:30:00Z',
    instructorName: 'Hoàng Anh D (DevOps Lead)',
    instructorTitle: 'Cloud Solutions Architect',
    rating: 4.88,
    enrollmentCount: 1120
  },
  {
    CourseId: 105,
    CourseCode: 'ENG-QA-102',
    CourseName: 'Automated End-to-End Testing & Performance Benchmarking',
    Description: 'Implement automated test pyramids with Playwright, Jest, and k6 performance load tests. Learn CI/CD test gates and defect root-cause analysis.',
    CategoryId: 105,
    CourseType: 'Online',
    Level: 'Intermediate',
    Duration: 240, // minutes (4.0 hrs)
    Version: 1,
    Status: 'Published',
    CreatedBy: 1004,
    CreatedAt: '2026-04-12T11:00:00Z',
    UpdatedAt: '2026-08-18T13:20:00Z',
    instructorName: 'Phạm Thị D (QA Lead)',
    instructorTitle: 'Senior Test Automation Engineer',
    rating: 4.78,
    enrollmentCount: 860
  },
  {
    CourseId: 201,
    CourseCode: 'MGT-AGILE-101',
    CourseName: 'Agile Project Management & Scrum Master in Practice',
    Description: 'From sprint backlog grooming and user story point estimation to sprint retrospectives and velocity forecasting. Practical Scrum framework for technical delivery teams.',
    CategoryId: 201,
    CourseType: 'Blended',
    Level: 'Beginner',
    Duration: 270, // minutes (4.5 hrs)
    Version: 2,
    Status: 'Published',
    CreatedBy: 1008,
    CreatedAt: '2026-01-28T14:00:00Z',
    UpdatedAt: '2026-08-12T10:15:00Z',
    instructorName: 'Nguyễn Văn K (Agile Coach)',
    instructorTitle: 'Director of Delivery Management',
    rating: 4.92,
    enrollmentCount: 1740
  },
  {
    CourseId: 202,
    CourseCode: 'MGT-LEAD-202',
    CourseName: 'Strategic Leadership & Coaching High-Performance Tech Teams',
    Description: 'Develop empathetic coaching skills, 1-on-1 career frameworks, constructive technical feedback delivery, psychological safety, and retention strategies for engineering leaders.',
    CategoryId: 202,
    CourseType: 'Offline',
    Level: 'Advanced',
    Duration: 360, // minutes (6.0 hrs)
    Version: 1,
    Status: 'Published',
    CreatedBy: 1007,
    CreatedAt: '2026-02-18T09:30:00Z',
    UpdatedAt: '2026-07-28T15:40:00Z',
    instructorName: 'Đặng Minh H (HR Director)',
    instructorTitle: 'Executive Leadership Coach',
    rating: 4.96,
    enrollmentCount: 650
  },
  {
    CourseId: 301,
    CourseCode: 'SEC-ISO-27001',
    CourseName: 'Information Security & Privacy Compliance 2026 (Mandatory)',
    Description: 'Mandatory annual corporate training covering phishing defenses, confidential data handling, credential hygiene, GDPR/CCPA compliance, and incident response escalation.',
    CategoryId: 301,
    CourseType: 'Online',
    Level: 'Beginner',
    Duration: 180, // minutes (3.0 hrs)
    Version: 4,
    Status: 'Published',
    CreatedBy: 1001,
    CreatedAt: '2026-01-05T08:00:00Z',
    UpdatedAt: '2026-09-01T10:00:00Z',
    instructorName: 'Security Compliance Office',
    instructorTitle: 'Chief Information Security Office',
    rating: 4.84,
    enrollmentCount: 3890
  },
  {
    CourseId: 302,
    CourseCode: 'SEC-ETH-101',
    CourseName: 'Corporate Code of Conduct, Anti-Bribery & Legal Governance',
    Description: 'Comprehensive overview of LSE corporate policies, anti-corruption standards, non-disclosure agreements, conflict of interest declarations, and whistleblower protection.',
    CategoryId: 302,
    CourseType: 'Online',
    Level: 'Beginner',
    Duration: 120, // minutes (2.0 hrs)
    Version: 2,
    Status: 'Published',
    CreatedBy: 1007,
    CreatedAt: '2026-01-15T13:00:00Z',
    UpdatedAt: '2026-06-30T11:30:00Z',
    instructorName: 'Legal & Compliance Bureau',
    instructorTitle: 'Corporate Legal Affairs',
    rating: 4.75,
    enrollmentCount: 3410
  },
  {
    CourseId: 401,
    CourseCode: 'SOFT-COMM-101',
    CourseName: 'Executive Communication & Technical Storytelling for Engineers',
    Description: 'Bridge technical complexity with business value. Learn how to write compelling RFCs, pitch ideas to non-technical stakeholders, and lead cross-department meetings effectively.',
    CategoryId: 401,
    CourseType: 'Online',
    Level: 'Beginner',
    Duration: 210, // minutes (3.5 hrs)
    Version: 1,
    Status: 'Published',
    CreatedBy: 1004,
    CreatedAt: '2026-03-12T10:00:00Z',
    UpdatedAt: '2026-08-25T14:15:00Z',
    instructorName: 'Phạm Thị D (Senior Lead)',
    instructorTitle: 'Communications Strategist',
    rating: 4.89,
    enrollmentCount: 1680
  },
  {
    CourseId: 402,
    CourseCode: 'SOFT-EQ-201',
    CourseName: 'Emotional Intelligence & Conflict Resolution in Tech Teams',
    Description: 'Navigate difficult code reviews, resolve technical disagreements constructively, overcome imposter syndrome, and foster a healthy blameless culture in demanding projects.',
    CategoryId: 403,
    CourseType: 'Blended',
    Level: 'Intermediate',
    Duration: 195, // minutes (3.25 hrs)
    Version: 1,
    Status: 'Published',
    CreatedBy: 1004,
    CreatedAt: '2026-04-02T15:00:00Z',
    UpdatedAt: '2026-09-02T12:00:00Z',
    instructorName: 'Nguyễn Văn A (Director)',
    instructorTitle: 'Head of People Operations',
    rating: 4.91,
    enrollmentCount: 1240
  },
  {
    CourseId: 501,
    CourseCode: 'ONB-CULT-101',
    CourseName: 'LSE Foundation: Corporate Mission, Vision & Core Values',
    Description: 'Essential onboarding journey for new employees. Explore the history, organizational structure, customer-first philosophy, and corporate milestones of LSE Corporation.',
    CategoryId: 501,
    CourseType: 'Online',
    Level: 'Beginner',
    Duration: 90, // minutes (1.5 hrs)
    Version: 3,
    Status: 'Published',
    CreatedBy: 1007,
    CreatedAt: '2026-01-02T08:00:00Z',
    UpdatedAt: '2026-08-15T09:00:00Z',
    instructorName: 'HR Onboarding Guild',
    instructorTitle: 'Talent Development Team',
    rating: 4.97,
    enrollmentCount: 4200
  },
  {
    CourseId: 502,
    CourseCode: 'ONB-SAFE-102',
    CourseName: 'Workplace Health, Safety & Emergency Response Protocols',
    Description: 'Essential physical workplace safety, fire evacuation procedures, first aid protocols, ergonomic guidelines, and emergency incident reporting for all office locations.',
    CategoryId: 502,
    CourseType: 'Offline',
    Level: 'Beginner',
    Duration: 120, // minutes (2.0 hrs)
    Version: 2,
    Status: 'Published',
    CreatedBy: 1009,
    CreatedAt: '2026-01-08T09:30:00Z',
    UpdatedAt: '2026-07-15T14:00:00Z',
    instructorName: 'Facilities & Safety Committee',
    instructorTitle: 'Occupational Health & Safety Office',
    rating: 4.82,
    enrollmentCount: 3950
  },
  {
    CourseId: 503,
    CourseCode: 'ONB-IT-103',
    CourseName: 'Enterprise IT Ecosystem, VPN, SSO & Cybersecurity Tooling',
    Description: 'Step-by-step setup for corporate laptops: configuring Cisco AnyConnect VPN, Okta SSO MFA tokens, Git access keys, Jira/Confluence, and company collaboration tools.',
    CategoryId: 503,
    CourseType: 'Online',
    Level: 'Beginner',
    Duration: 150, // minutes (2.5 hrs)
    Version: 2,
    Status: 'Published',
    CreatedBy: 1001,
    CreatedAt: '2026-01-12T11:00:00Z',
    UpdatedAt: '2026-08-20T16:00:00Z',
    instructorName: 'IT Operations & Infrastructure',
    instructorTitle: 'Global Service Desk',
    rating: 4.86,
    enrollmentCount: 3820
  }
];

export const COURSE_SECTIONS = [
  // Course 101: C# & .NET 9 Architecture
  { SectionId: 1001, CourseId: 101, Title: 'Module 1: Modern C# 12 Language Features', Description: 'Primary constructors, collection expressions, pattern matching and ref fields.', DisplayOrder: 1 },
  { SectionId: 1002, CourseId: 101, Title: 'Module 2: Clean Architecture & Domain-Driven Design', Description: 'Separation of concerns, Domain Entities, Value Objects, and Application Handlers.', DisplayOrder: 2 },
  { SectionId: 1003, CourseId: 101, Title: 'Module 3: High-Throughput Asynchronous Programming', Description: 'Task Parallel Library, ValueTask optimization, Channels, and lock-free concurrency.', DisplayOrder: 3 },
  { SectionId: 1004, CourseId: 101, Title: 'Module 4: Enterprise Web API Security & Resiliency', Description: 'Rate limiting, Polly retry policies, OpenTelemetry tracing, and JWT auth.', DisplayOrder: 4 },

  // Course 102: SQL Server
  { SectionId: 1011, CourseId: 102, Title: 'Module 1: Query Execution Engine & Index Mechanics', Description: 'B-Tree internals, clustered vs non-clustered indexes, and statistical histograms.', DisplayOrder: 1 },
  { SectionId: 1012, CourseId: 102, Title: 'Module 2: Execution Plan Analysis & Tuning Patterns', Description: 'Identifying table scans, expensive sorts, implicit conversions, and parameter sniffing.', DisplayOrder: 2 },
  { SectionId: 1013, CourseId: 102, Title: 'Module 3: High Availability with AlwaysOn AGs', Description: 'Synchronous vs asynchronous replication, quorum configurations, and automatic failover.', DisplayOrder: 3 },

  // Course 103: Vue 3 & Pinia
  { SectionId: 1021, CourseId: 103, Title: 'Module 1: Composition API Primitives & Reactivity', Description: 'ref vs reactive, computed properties, watchers, and custom reusable composables.', DisplayOrder: 1 },
  { SectionId: 1022, CourseId: 103, Title: 'Module 2: State Management with Pinia & Persistence', Description: 'Store definitions, getters, actions, and custom localStorage synchronization.', DisplayOrder: 2 },
  { SectionId: 1023, CourseId: 103, Title: 'Module 3: PrimeVue 4 Design Tokens & Custom Themes', Description: 'Aura design presets, semantic tokens, dark mode selector, and responsive layouts.', DisplayOrder: 3 },
  { SectionId: 1024, CourseId: 103, Title: 'Module 4: Performance Optimization & Code Splitting', Description: 'Dynamic routing with Vite plugins, tree-shaking, and WebP asset pipeline.', DisplayOrder: 4 },

  // Course 104: Cloud & Kubernetes
  { SectionId: 1031, CourseId: 104, Title: 'Module 1: Multi-stage Docker Builds & Container Hardening', Description: 'Minimal Alpine images, non-root users, vulnerability scanning with Trivy.', DisplayOrder: 1 },
  { SectionId: 1032, CourseId: 104, Title: 'Module 2: Kubernetes Workloads, Ingress & Helm Deployments', Description: 'Deployments, Services, ConfigMaps, Secrets, and Helm chart templating.', DisplayOrder: 2 },
  { SectionId: 1033, CourseId: 104, Title: 'Module 3: Automated CI/CD GitOps Pipeline', Description: 'GitHub Actions, automated automated rollback strategies, and health probes.', DisplayOrder: 3 },

  // Course 301: Information Security & Privacy Compliance 2026
  { SectionId: 1041, CourseId: 301, Title: 'Module 1: Threat Landscape & Social Engineering Defense', Description: 'Identifying advanced phishing, spear-phishing, deepfakes, and malware infection vectors.', DisplayOrder: 1 },
  { SectionId: 1042, CourseId: 301, Title: 'Module 2: Corporate Data Classification & Handling', Description: 'Confidential, restricted, and public data tiers. Encryption in transit and at rest.', DisplayOrder: 2 },
  { SectionId: 1043, CourseId: 301, Title: 'Module 3: Global Data Protection (GDPR & CCPA)', Description: 'Consent management, data subject requests, breach notifications within 72 hours.', DisplayOrder: 3 },
  { SectionId: 1044, CourseId: 301, Title: 'Module 4: Security Incident Escalation & Response', Description: 'Recognizing indicators of compromise and alerting SOC/CSIRT immediately.', DisplayOrder: 4 },

  // Course 201: Agile Project Management
  { SectionId: 1051, CourseId: 201, Title: 'Module 1: Scrum Ceremonies & Empirical Process Control', Description: 'Sprint Planning, Daily Standups, Sprint Review, and Retrospectives.', DisplayOrder: 1 },
  { SectionId: 1052, CourseId: 201, Title: 'Module 2: User Story Mapping & Estimation Techniques', Description: 'INVEST criteria, planning poker, velocity calculations, and release burndown.', DisplayOrder: 2 },
  { SectionId: 1053, CourseId: 201, Title: 'Module 3: Managing Technical Debt & Stakeholder Alignments', Description: 'Balancing new product features with architectural stability and refactoring.', DisplayOrder: 3 },

  // Course 401: Executive Communication
  { SectionId: 1061, CourseId: 401, Title: 'Module 1: The Pyramid Principle in Technical Writing', Description: 'Start with the conclusion, structure logic groups, and eliminate fluff.', DisplayOrder: 1 },
  { SectionId: 1062, CourseId: 401, Title: 'Module 2: Translating Architecture into Business ROI', Description: 'Articulating cost savings, scalability benefits, and risk mitigation to C-suite.', DisplayOrder: 2 },

  // Course 501: Corporate Culture & Values
  { SectionId: 1071, CourseId: 501, Title: 'Module 1: LSE Heritage, Vision & Guiding Principles', Description: 'Our founding journey, technological vision, and commitment to client success.', DisplayOrder: 1 },
  { SectionId: 1072, CourseId: 501, Title: 'Module 2: Diversity, Inclusion & Workplace Respect', Description: 'Creating psychological safety, respectful dialogue, and zero tolerance for harassment.', DisplayOrder: 2 }
];

export const COURSE_CONTENTS = [
  // Section 1001 (Course 101, Module 1)
  { ContentId: 5001, SectionId: 1001, ContentType: 'Video', Title: 'Modern C# 12 Syntax Overview & Setup', DisplayOrder: 1, IsRequired: true, Duration: 25 },
  { ContentId: 5002, SectionId: 1001, ContentType: 'Document', Title: 'C# 12 Language Cheat Sheet & Guide', DisplayOrder: 2, IsRequired: false, Duration: 15 },
  { ContentId: 5003, SectionId: 1001, ContentType: 'Video', Title: 'Primary Constructors & Collection Expressions in Action', DisplayOrder: 3, IsRequired: true, Duration: 35 },

  // Section 1002 (Course 101, Module 2)
  { ContentId: 5011, SectionId: 1002, ContentType: 'Video', Title: 'Domain Entities, Value Objects & Aggregates', DisplayOrder: 1, IsRequired: true, Duration: 40 },
  { ContentId: 5012, SectionId: 1002, ContentType: 'Document', Title: 'Clean Architecture Template Project Specification', DisplayOrder: 2, IsRequired: true, Duration: 20 },
  { ContentId: 5013, SectionId: 1002, ContentType: 'Video', Title: 'Implementing CQRS with MediatR & Pipeline Behaviors', DisplayOrder: 3, IsRequired: true, Duration: 45 },

  // Section 1003 (Course 101, Module 3)
  { ContentId: 5021, SectionId: 1003, ContentType: 'Video', Title: 'Async/Await Internals & ThreadPool Optimization', DisplayOrder: 1, IsRequired: true, Duration: 50 },
  { ContentId: 5022, SectionId: 1003, ContentType: 'Document', Title: 'High Performance .NET Memory Management Reference', DisplayOrder: 2, IsRequired: false, Duration: 25 },

  // Section 1004 (Course 101, Module 4)
  { ContentId: 5031, SectionId: 1004, ContentType: 'Video', Title: 'Resiliency Patterns with Microsoft Polly v8', DisplayOrder: 1, IsRequired: true, Duration: 45 },
  { ContentId: 5032, SectionId: 1004, ContentType: 'Document', Title: 'Production Web API Checklist & Benchmark PDF', DisplayOrder: 2, IsRequired: true, Duration: 30 },

  // Section 1011 (Course 102, Module 1)
  { ContentId: 5041, SectionId: 1011, ContentType: 'Video', Title: 'SQL Server Storage Engine & B-Tree Structure', DisplayOrder: 1, IsRequired: true, Duration: 35 },
  { ContentId: 5042, SectionId: 1011, ContentType: 'Document', Title: 'Index Maintenance & Fill-Factor Strategy Whitepaper', DisplayOrder: 2, IsRequired: false, Duration: 20 },
  { ContentId: 5043, SectionId: 1011, ContentType: 'Video', Title: 'Deep Dive: Clustered vs Filtered Indexes', DisplayOrder: 3, IsRequired: true, Duration: 45 },

  // Section 1012 (Course 102, Module 2)
  { ContentId: 5051, SectionId: 1012, ContentType: 'Video', Title: 'Reading & Interpreting Graphical Execution Plans', DisplayOrder: 1, IsRequired: true, Duration: 50 },
  { ContentId: 5052, SectionId: 1012, ContentType: 'Document', Title: 'Query Anti-Patterns & Refactoring Guidebook', DisplayOrder: 2, IsRequired: true, Duration: 30 },

  // Section 1021 (Course 103, Module 1)
  { ContentId: 5061, SectionId: 1021, ContentType: 'Video', Title: 'Vue 3 Reactivity Engine: ref, reactive & effectScope', DisplayOrder: 1, IsRequired: true, Duration: 30 },
  { ContentId: 5062, SectionId: 1021, ContentType: 'Document', Title: 'Vue 3 Composition API Best Practices & Style Guide', DisplayOrder: 2, IsRequired: false, Duration: 15 },
  { ContentId: 5063, SectionId: 1021, ContentType: 'Video', Title: 'Building Reusable Custom Composables', DisplayOrder: 3, IsRequired: true, Duration: 40 },

  // Section 1022 (Course 103, Module 2)
  { ContentId: 5071, SectionId: 1022, ContentType: 'Video', Title: 'Pinia Store Architecture & State Synchronization', DisplayOrder: 1, IsRequired: true, Duration: 35 },
  { ContentId: 5072, SectionId: 1022, ContentType: 'Document', Title: 'Pinia vs Vuex Architectural Comparison Sheet', DisplayOrder: 2, IsRequired: false, Duration: 15 },

  // Section 1041 (Course 301, Module 1)
  { ContentId: 5081, SectionId: 1041, ContentType: 'Video', Title: 'Current Cyber Threat Vectors & Social Engineering', DisplayOrder: 1, IsRequired: true, Duration: 25 },
  { ContentId: 5082, SectionId: 1041, ContentType: 'Document', Title: 'Phishing Awareness & Reporting Standard Operating Procedure', DisplayOrder: 2, IsRequired: true, Duration: 15 },

  // Section 1042 (Course 301, Module 2)
  { ContentId: 5091, SectionId: 1042, ContentType: 'Video', Title: 'Data Classification Rules & Encryption Baseline', DisplayOrder: 1, IsRequired: true, Duration: 30 },
  { ContentId: 5092, SectionId: 1042, ContentType: 'Document', Title: 'LSE Clean Desk & Screen Policy Document', DisplayOrder: 2, IsRequired: true, Duration: 15 },

  // Section 1043 (Course 301, Module 3)
  { ContentId: 5101, SectionId: 1043, ContentType: 'Video', Title: 'Handling PII & Complying with Global Privacy Acts', DisplayOrder: 1, IsRequired: true, Duration: 35 },
  { ContentId: 5102, SectionId: 1043, ContentType: 'Document', Title: 'Privacy Rights & Subject Access Request SOP', DisplayOrder: 2, IsRequired: true, Duration: 20 },

  // Section 1051 (Course 201, Module 1)
  { ContentId: 5111, SectionId: 1051, ContentType: 'Video', Title: 'Scrum Roles, Ceremonies & Artifacts', DisplayOrder: 1, IsRequired: true, Duration: 35 },
  { ContentId: 5112, SectionId: 1051, ContentType: 'Document', Title: 'Scrum Master Checklist & Sprint Facilitation Guide', DisplayOrder: 2, IsRequired: false, Duration: 20 },

  // Section 1071 (Course 501, Module 1)
  { ContentId: 5121, SectionId: 1071, ContentType: 'Video', Title: 'Welcome to LSE: Our Vision, Values & People', DisplayOrder: 1, IsRequired: true, Duration: 25 },
  { ContentId: 5122, SectionId: 1071, ContentType: 'Document', Title: 'LSE Employee Handbook & Core Values Charter', DisplayOrder: 2, IsRequired: true, Duration: 25 }
];

export const VIDEOS = [
  {
    VideoId: 9001,
    ContentId: 5001,
    FilePath: '/media/courses/eng-cs-101/01_csharp12_overview.mp4',
    FileName: '01_csharp12_overview.mp4',
    Duration: 1500, // seconds (25 mins)
    FileSize: 256880128, // ~245 MB
    ThumbnailPath: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9002,
    ContentId: 5003,
    FilePath: '/media/courses/eng-cs-101/02_constructors_expressions.mp4',
    FileName: '02_constructors_expressions.mp4',
    Duration: 2100, // seconds (35 mins)
    FileSize: 348220992, // ~332 MB
    ThumbnailPath: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9003,
    ContentId: 5011,
    FilePath: '/media/courses/eng-cs-101/03_domain_entities_ddd.mp4',
    FileName: '03_domain_entities_ddd.mp4',
    Duration: 2400, // seconds (40 mins)
    FileSize: 419430400, // ~400 MB
    ThumbnailPath: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9004,
    ContentId: 5013,
    FilePath: '/media/courses/eng-cs-101/04_cqrs_mediatr.mp4',
    FileName: '04_cqrs_mediatr.mp4',
    Duration: 2700, // seconds (45 mins)
    FileSize: 482344960, // ~460 MB
    ThumbnailPath: 'https://images.unsplash.com/photo-1516116211227-bbc03e339f4e?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9005,
    ContentId: 5021,
    FilePath: '/media/courses/eng-cs-101/05_async_threadpool.mp4',
    FileName: '05_async_threadpool.mp4',
    Duration: 3000,
    FileSize: 512000000,
    ThumbnailPath: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9006,
    ContentId: 5031,
    FilePath: '/media/courses/eng-cs-101/06_resiliency_polly.mp4',
    FileName: '06_resiliency_polly.mp4',
    Duration: 2700,
    FileSize: 440401920,
    ThumbnailPath: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9011,
    ContentId: 5041,
    FilePath: '/media/courses/eng-sql-201/01_storage_engine.mp4',
    FileName: '01_storage_engine.mp4',
    Duration: 2100,
    FileSize: 325058560,
    ThumbnailPath: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9012,
    ContentId: 5043,
    FilePath: '/media/courses/eng-sql-201/02_index_strategy.mp4',
    FileName: '02_index_strategy.mp4',
    Duration: 2700,
    FileSize: 461373440,
    ThumbnailPath: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9013,
    ContentId: 5051,
    FilePath: '/media/courses/eng-sql-201/03_execution_plans.mp4',
    FileName: '03_execution_plans.mp4',
    Duration: 3000,
    FileSize: 524288000,
    ThumbnailPath: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9021,
    ContentId: 5061,
    FilePath: '/media/courses/eng-vue-301/01_composition_reactivity.mp4',
    FileName: '01_composition_reactivity.mp4',
    Duration: 1800,
    FileSize: 283115520,
    ThumbnailPath: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9022,
    ContentId: 5063,
    FilePath: '/media/courses/eng-vue-301/02_custom_composables.mp4',
    FileName: '02_custom_composables.mp4',
    Duration: 2400,
    FileSize: 398458880,
    ThumbnailPath: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9023,
    ContentId: 5071,
    FilePath: '/media/courses/eng-vue-301/03_pinia_architecture.mp4',
    FileName: '03_pinia_architecture.mp4',
    Duration: 2100,
    FileSize: 335544320,
    ThumbnailPath: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9031,
    ContentId: 5081,
    FilePath: '/media/courses/sec-iso-27001/01_threat_landscape.mp4',
    FileName: '01_threat_landscape.mp4',
    Duration: 1500,
    FileSize: 220200960,
    ThumbnailPath: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9032,
    ContentId: 5091,
    FilePath: '/media/courses/sec-iso-27001/02_data_classification.mp4',
    FileName: '02_data_classification.mp4',
    Duration: 1800,
    FileSize: 262144000,
    ThumbnailPath: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9033,
    ContentId: 5101,
    FilePath: '/media/courses/sec-iso-27001/03_privacy_compliance.mp4',
    FileName: '03_privacy_compliance.mp4',
    Duration: 2100,
    FileSize: 314572800,
    ThumbnailPath: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9041,
    ContentId: 5111,
    FilePath: '/media/courses/mgt-agile-101/01_scrum_foundations.mp4',
    FileName: '01_scrum_foundations.mp4',
    Duration: 2100,
    FileSize: 310378496,
    ThumbnailPath: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
  },
  {
    VideoId: 9051,
    ContentId: 5121,
    FilePath: '/media/courses/onb-cult-101/01_corporate_heritage.mp4',
    FileName: '01_corporate_heritage.mp4',
    Duration: 1500,
    FileSize: 209715200,
    ThumbnailPath: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
  }
];

export const DOCUMENTS = [
  {
    DocumentId: 8001,
    ContentId: 5002,
    FilePath: '/docs/courses/eng-cs-101/csharp12_modern_cheatsheet.pdf',
    FileName: 'csharp12_modern_cheatsheet.pdf',
    FileSize: 4823449, // ~4.6 MB
    FileType: 'pdf',
    Version: 2
  },
  {
    DocumentId: 8002,
    ContentId: 5012,
    FilePath: '/docs/courses/eng-cs-101/clean_architecture_spec_v2.docx',
    FileName: 'clean_architecture_spec_v2.docx',
    FileSize: 2457600, // ~2.3 MB
    FileType: 'docx',
    Version: 2
  },
  {
    DocumentId: 8003,
    ContentId: 5022,
    FilePath: '/docs/courses/eng-cs-101/dotnet_memory_diagnostics.pdf',
    FileName: 'dotnet_memory_diagnostics.pdf',
    FileSize: 6291456, // ~6.0 MB
    FileType: 'pdf',
    Version: 1
  },
  {
    DocumentId: 8004,
    ContentId: 5032,
    FilePath: '/docs/courses/eng-cs-101/webapi_production_readiness.pdf',
    FileName: 'webapi_production_readiness.pdf',
    FileSize: 3145728, // ~3.0 MB
    FileType: 'pdf',
    Version: 1
  },
  {
    DocumentId: 8011,
    ContentId: 5042,
    FilePath: '/docs/courses/eng-sql-201/sql_index_strategy_guide.pdf',
    FileName: 'sql_index_strategy_guide.pdf',
    FileSize: 5242880, // ~5.0 MB
    FileType: 'pdf',
    Version: 1
  },
  {
    DocumentId: 8012,
    ContentId: 5052,
    FilePath: '/docs/courses/eng-sql-201/sql_execution_anti_patterns.pdf',
    FileName: 'sql_execution_anti_patterns.pdf',
    FileSize: 7340032, // ~7.0 MB
    FileType: 'pdf',
    Version: 1
  },
  {
    DocumentId: 8021,
    ContentId: 5062,
    FilePath: '/docs/courses/eng-vue-301/vue3_style_guide_2026.pdf',
    FileName: 'vue3_style_guide_2026.pdf',
    FileSize: 3670016, // ~3.5 MB
    FileType: 'pdf',
    Version: 3
  },
  {
    DocumentId: 8022,
    ContentId: 5072,
    FilePath: '/docs/courses/eng-vue-301/pinia_architecture_sheet.xlsx',
    FileName: 'pinia_architecture_sheet.xlsx',
    FileSize: 1048576, // ~1.0 MB
    FileType: 'xlsx',
    Version: 1
  },
  {
    DocumentId: 8031,
    ContentId: 5082,
    FilePath: '/docs/courses/sec-iso-27001/phishing_defense_sop_2026.pdf',
    FileName: 'phishing_defense_sop_2026.pdf',
    FileSize: 2097152, // ~2.0 MB
    FileType: 'pdf',
    Version: 4
  },
  {
    DocumentId: 8032,
    ContentId: 5092,
    FilePath: '/docs/courses/sec-iso-27001/clean_desk_screen_policy.pdf',
    FileName: 'clean_desk_screen_policy.pdf',
    FileSize: 1572864, // ~1.5 MB
    FileType: 'pdf',
    Version: 2
  },
  {
    DocumentId: 8033,
    ContentId: 5102,
    FilePath: '/docs/courses/sec-iso-27001/privacy_data_subject_request_sop.docx',
    FileName: 'privacy_data_subject_request_sop.docx',
    FileSize: 1887436, // ~1.8 MB
    FileType: 'docx',
    Version: 3
  },
  {
    DocumentId: 8041,
    ContentId: 5112,
    FilePath: '/docs/courses/mgt-agile-101/scrum_master_playbook.pdf',
    FileName: 'scrum_master_playbook.pdf',
    FileSize: 4194304, // ~4.0 MB
    FileType: 'pdf',
    Version: 2
  },
  {
    DocumentId: 8051,
    ContentId: 5122,
    FilePath: '/docs/courses/onb-cult-101/lse_employee_values_handbook.pdf',
    FileName: 'lse_employee_values_handbook.pdf',
    FileSize: 8388608, // ~8.0 MB
    FileType: 'pdf',
    Version: 3
  }
];

// Fallback thematic gradients for courses that don't have video thumbnails
export const CATEGORY_GRADIENTS = {
  1: 'from-blue-600 via-indigo-600 to-cyan-600',
  2: 'from-purple-600 via-violet-600 to-indigo-700',
  3: 'from-rose-600 via-red-600 to-amber-600',
  4: 'from-emerald-600 via-teal-600 to-cyan-700',
  5: 'from-amber-600 via-orange-600 to-rose-600',
  default: 'from-primary-600 via-indigo-600 to-sky-600'
};

// ============================================================================
// 2. DOMAIN REPOSITORY & QUERY SERVICE
// ============================================================================

/**
 * Build hierarchical parent-child category tree for Department views
 */
export function getCategoryTree() {
  const parents = COURSE_CATEGORIES.filter(c => c.ParentCategoryId === null);
  return parents.map(parent => {
    const children = COURSE_CATEGORIES.filter(c => c.ParentCategoryId === parent.CategoryId);
    const parentCourseCount = COURSES.filter(course => {
      const cat = COURSE_CATEGORIES.find(c => c.CategoryId === course.CategoryId);
      return cat?.CategoryId === parent.CategoryId || cat?.ParentCategoryId === parent.CategoryId;
    }).length;

    return {
      ...parent,
      totalCourses: parentCourseCount,
      children: children.map(child => ({
        ...child,
        courseCount: COURSES.filter(course => course.CategoryId === child.CategoryId).length
      }))
    };
  });
}

/**
 * Format bytes into human-readable string
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Format minutes into readable duration
 */
export function formatMinutes(totalMinutes) {
  if (!totalMinutes || totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours} hrs`;
  return `${minutes} mins`;
}

/**
 * Retrieve primary thumbnail for a course:
 * Checks VIDEOS table for any video matching course contents,
 * or returns curated fallback Unsplash image.
 */
export function getCourseThumbnail(courseId) {
  const sectionIds = COURSE_SECTIONS.filter(s => s.CourseId === courseId).map(s => s.SectionId);
  const contentIds = COURSE_CONTENTS.filter(c => sectionIds.includes(c.SectionId) && c.ContentType === 'Video').map(c => c.ContentId);
  const video = VIDEOS.find(v => contentIds.includes(v.ContentId) && v.ThumbnailPath);

  if (video && video.ThumbnailPath) {
    return video.ThumbnailPath;
  }

  // Curated fallbacks per course
  const courseFallbacks = {
    101: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    102: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    103: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    104: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    105: 'https://images.unsplash.com/photo-1516116211227-bbc03e339f4e?auto=format&fit=crop&w=800&q=80',
    201: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    202: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    301: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    302: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    401: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    402: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    501: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    502: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    503: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'
  };

  return courseFallbacks[courseId] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
}

/**
 * Hydrate a course with related category metadata, thumbnail, section & lecture counts
 */
export function hydrateCourseSummary(course) {
  const category = COURSE_CATEGORIES.find(c => c.CategoryId === course.CategoryId);
  const parentCategory = category?.ParentCategoryId 
    ? COURSE_CATEGORIES.find(c => c.CategoryId === category.ParentCategoryId) 
    : category;

  const sections = COURSE_SECTIONS.filter(s => s.CourseId === course.CourseId);
  const sectionIds = sections.map(s => s.SectionId);
  const contents = COURSE_CONTENTS.filter(c => sectionIds.includes(c.SectionId));
  const videoCount = contents.filter(c => c.ContentType === 'Video').length;
  const documentCount = contents.filter(c => c.ContentType === 'Document').length;
  const hasRequired = contents.some(c => c.IsRequired);

  return {
    ...course,
    categoryName: category?.CategoryName || 'Unassigned',
    parentCategoryName: parentCategory?.CategoryName || 'General',
    parentCategoryId: parentCategory?.CategoryId || null,
    thumbnailUrl: getCourseThumbnail(course.CourseId),
    sectionsCount: sections.length,
    lessonsCount: contents.length,
    videoCount,
    documentCount,
    hasRequired,
    formattedDuration: formatMinutes(course.Duration)
  };
}

/**
 * Get Full Course Details with complete relational hierarchy
 */
export function getCourseDetails(courseId) {
  const course = COURSES.find(c => c.CourseId === Number(courseId));
  if (!course) return null;

  const hydrated = hydrateCourseSummary(course);
  
  // Sections sorted by DisplayOrder
  const sections = COURSE_SECTIONS
    .filter(s => s.CourseId === course.CourseId)
    .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
    .map(section => {
      // Contents for this section sorted by DisplayOrder
      const contents = COURSE_CONTENTS
        .filter(c => c.SectionId === section.SectionId)
        .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
        .map(content => {
          let videoMeta = null;
          let documentMeta = null;

          if (content.ContentType === 'Video') {
            videoMeta = VIDEOS.find(v => v.ContentId === content.ContentId) || null;
          } else if (content.ContentType === 'Document') {
            documentMeta = DOCUMENTS.find(d => d.ContentId === content.ContentId) || null;
          }

          return {
            ...content,
            video: videoMeta ? {
              ...videoMeta,
              formattedSize: formatFileSize(videoMeta.FileSize),
              formattedDuration: `${Math.floor(videoMeta.Duration / 60)}m ${videoMeta.Duration % 60}s`
            } : null,
            document: documentMeta ? {
              ...documentMeta,
              formattedSize: formatFileSize(documentMeta.FileSize)
            } : null
          };
        });

      const sectionMinutes = contents.reduce((acc, curr) => acc + (curr.Duration || 0), 0);

      return {
        ...section,
        contents,
        totalItems: contents.length,
        totalDuration: sectionMinutes,
        formattedDuration: formatMinutes(sectionMinutes)
      };
    });

  return {
    ...hydrated,
    sections,
    totalRequiredCount: sections.reduce((acc, s) => acc + s.contents.filter(c => c.IsRequired).length, 0),
    totalElectiveCount: sections.reduce((acc, s) => acc + s.contents.filter(c => !c.IsRequired).length, 0)
  };
}

/**
 * Filter and search courses with pagination and sorting
 */
export function getCatalogCourses(options = {}) {
  const {
    search = '',
    tab = 'all', // 'all' | 'department' | 'soft_skills' | 'onboarding'
    categoryId = null,
    level = 'all',
    courseType = 'all',
    status = 'all',
    sort = 'newest',
    page = 1,
    pageSize = 8
  } = options;

  let list = COURSES.map(hydrateCourseSummary);

  // Tab Filtering
  if (tab === 'soft_skills') {
    // Soft skills parent category is 4 (or children: 401, 402, 403)
    list = list.filter(c => c.parentCategoryId === 4 || [4, 401, 402, 403].includes(c.CategoryId));
  } else if (tab === 'onboarding') {
    // Onboarding parent category is 5 (or children: 501, 502, 503)
    list = list.filter(c => c.parentCategoryId === 5 || [5, 501, 502, 503].includes(c.CategoryId));
  } else if (tab === 'department') {
    // Department technical or management tracks (categories 1 and 2 and their children)
    if (categoryId) {
      list = list.filter(c => c.CategoryId === Number(categoryId) || c.parentCategoryId === Number(categoryId));
    } else {
      list = list.filter(c => [1, 2].includes(c.parentCategoryId));
    }
  }

  // Explicit Category Filter
  if (categoryId && tab !== 'department') {
    list = list.filter(c => c.CategoryId === Number(categoryId) || c.parentCategoryId === Number(categoryId));
  }

  // Search filter across CourseName, CourseCode, Description, CategoryName, and Instructor
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(c => 
      c.CourseName.toLowerCase().includes(q) ||
      c.CourseCode.toLowerCase().includes(q) ||
      c.Description.toLowerCase().includes(q) ||
      c.categoryName.toLowerCase().includes(q) ||
      c.parentCategoryName.toLowerCase().includes(q) ||
      (c.instructorName && c.instructorName.toLowerCase().includes(q))
    );
  }

  // Level filter
  if (level && level !== 'all') {
    list = list.filter(c => c.Level.toLowerCase() === level.toLowerCase());
  }

  // CourseType filter (Online, Offline, Blended)
  if (courseType && courseType !== 'all') {
    list = list.filter(c => c.CourseType.toLowerCase() === courseType.toLowerCase());
  }

  // Status filter (Published, Draft, Archived)
  if (status && status !== 'all') {
    list = list.filter(c => c.Status.toLowerCase() === status.toLowerCase());
  }

  // Sorting
  list.sort((a, b) => {
    switch (sort) {
      case 'newest':
        return new Date(b.CreatedAt) - new Date(a.CreatedAt);
      case 'duration_asc':
        return a.Duration - b.Duration;
      case 'duration_desc':
        return b.Duration - a.Duration;
      case 'level': {
        const order = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return (order[a.Level] || 0) - (order[b.Level] || 0);
      }
      case 'title_asc':
        return a.CourseName.localeCompare(b.CourseName);
      case 'popular':
        return (b.enrollmentCount || 0) - (a.enrollmentCount || 0);
      default:
        return 0;
    }
  });

  const total = list.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedItems = list.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    total,
    page: safePage,
    pageSize,
    totalPages
  };
}

/**
 * Autocomplete suggestions for Hero search bar
 */
export function getAutocompleteSuggestions(query) {
  if (!query || query.trim().length < 2) return { courses: [], codes: [], categories: [] };
  const q = query.toLowerCase().trim();

  const matchedCourses = COURSES
    .filter(c => c.CourseName.toLowerCase().includes(q) || c.CourseCode.toLowerCase().includes(q))
    .slice(0, 5)
    .map(hydrateCourseSummary);

  const matchedCodes = COURSES
    .filter(c => c.CourseCode.toLowerCase().includes(q))
    .slice(0, 4)
    .map(c => ({ code: c.CourseCode, title: c.CourseName, id: c.CourseId }));

  const matchedCategories = COURSE_CATEGORIES
    .filter(c => c.CategoryName.toLowerCase().includes(q))
    .slice(0, 4)
    .map(c => ({
      id: c.CategoryId,
      name: c.CategoryName,
      isParent: c.ParentCategoryId === null
    }));

  return {
    courses: matchedCourses,
    codes: matchedCodes,
    categories: matchedCategories
  };
}

/**
 * LocalStorage helpers for user enrollments & bookmarks
 */
const ENROLLED_KEY = 'lse_enrolled_courses';
const BOOKMARKS_KEY = 'lse_bookmarked_courses';

export function getEnrolledCourseIds() {
  try {
    const raw = localStorage.getItem(ENROLLED_KEY);
    return raw ? JSON.parse(raw) : [101, 301]; // Defaults
  } catch {
    return [101, 301];
  }
}

export function enrollCourse(courseId) {
  const ids = getEnrolledCourseIds();
  if (!ids.includes(courseId)) {
    ids.push(courseId);
    localStorage.setItem(ENROLLED_KEY, JSON.stringify(ids));
  }
  return ids;
}

export function getBookmarkedCourseIds() {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [103, 401];
  } catch {
    return [103, 401];
  }
}

export function toggleBookmarkCourse(courseId) {
  let ids = getBookmarkedCourseIds();
  if (ids.includes(courseId)) {
    ids = ids.filter(id => id !== courseId);
  } else {
    ids.push(courseId);
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids));
  return ids;
}
