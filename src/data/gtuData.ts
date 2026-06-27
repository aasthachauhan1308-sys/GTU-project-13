import { Department, Subject, StudyMaterial, ExamPaper, Notice } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'it',
    name: 'Information Technology',
    shortName: 'IT',
    description: 'Deals with software development, databases, networking, cloud, and internet technologies.',
    iconName: 'Laptop'
  },
  {
    id: 'ce',
    name: 'Computer Engineering',
    shortName: 'CE',
    description: 'Deals with computer hardware, software systems, algorithms, AI, and operating systems.',
    iconName: 'Cpu'
  },
  {
    id: 'mechanical',
    name: 'Mechanical Engineering',
    shortName: 'ME',
    description: 'Deals with designing, manufacturing, and maintaining thermal and mechanical systems.',
    iconName: 'Settings'
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    shortName: 'CL',
    description: 'Deals with construction, design, and maintenance of structures like roads, bridges, and buildings.',
    iconName: 'Building2'
  },
  {
    id: 'electrical',
    name: 'Electrical Engineering',
    shortName: 'EE',
    description: 'Deals with electrical power generation, transmission, electrical machine control, and grid systems.',
    iconName: 'Zap'
  },
  {
    id: 'ec',
    name: 'Electronics & Communication',
    shortName: 'EC',
    description: 'Deals with electronic devices, signals, digital communication, VLSI, and embedded systems.',
    iconName: 'Radio'
  },
  {
    id: 'automobile',
    name: 'Automobile Engineering',
    shortName: 'AE',
    description: 'Deals with designing, manufacturing, and operating passenger vehicles, trucks, and motorbikes.',
    iconName: 'Car'
  },
  {
    id: 'chemical',
    name: 'Chemical Engineering',
    shortName: 'CH',
    description: 'Deals with chemical plant design, industrial reactions, polymers, and process safety.',
    iconName: 'FlaskConical'
  },
  {
    id: 'textile',
    name: 'Textile Engineering',
    shortName: 'TE',
    description: 'Deals with fiber polymers, yarn manufacture, weaving, knitting, and fabric finishing.',
    iconName: 'Scissors'
  },
  {
    id: 'plastic',
    name: 'Plastic Engineering',
    shortName: 'PE',
    description: 'Deals with polymer processes, injection molding, mold design, and plastics processing machinery.',
    iconName: 'Layers'
  },
  {
    id: 'environmental',
    name: 'Environmental Engineering',
    shortName: 'EV',
    description: 'Deals with water treatment, pollution control, waste management, and sustainable environment.',
    iconName: 'Leaf'
  },
  {
    id: 'mining',
    name: 'Mining Engineering',
    shortName: 'MN',
    description: 'Deals with extraction of minerals, rock mechanics, mine planning, and environmental impact of mines.',
    iconName: 'Gem'
  },
  {
    id: 'metallurgy',
    name: 'Metallurgy Engineering',
    shortName: 'MT',
    description: 'Deals with extraction, processing, and heat treatment of metals, alloys, and advanced materials.',
    iconName: 'Hammer'
  },
  {
    id: 'biomedical',
    name: 'Biomedical Engineering (Other)',
    shortName: 'BM',
    description: 'Integrates engineering principles with medical sciences for healthcare diagnostic and therapeutic devices.',
    iconName: 'HeartPulse'
  }
];

// Generate authentic subjects for IT & CE
const SPECIFIC_SUBJECTS: Subject[] = [
  // Semester 1 (Common)
  { id: '4300001', code: '4300001', name: 'Basic Mathematics', departmentId: 'all', semester: 1, credits: 4 },
  { id: '4300002', code: '4300002', name: 'Communication Skills in English', departmentId: 'all', semester: 1, credits: 3 },
  { id: '4300007', code: '4300007', name: 'Basic Engineering Drawing', departmentId: 'all', semester: 1, credits: 3 },
  
  // Semester 2 (Common/Basic)
  { id: '4300003', code: '4300003', name: 'Applied Physics (Group-1)', departmentId: 'all', semester: 2, credits: 4 },
  { id: '4300006', code: '4300006', name: 'Applied Chemistry', departmentId: 'all', semester: 2, credits: 4 },
  { id: '4300012', code: '4300012', name: 'Environment Conservation & Hazard Management', departmentId: 'all', semester: 2, credits: 3 },

  // IT Semester 3
  { id: '4331601', code: '4331601', name: 'Computer Programming', departmentId: 'it', semester: 3, credits: 4 },
  { id: '4330701', code: '4330701', name: 'Database Management Systems', departmentId: 'it', semester: 3, credits: 5 },
  { id: '4330702', code: '4330702', name: 'Data Structures', departmentId: 'it', semester: 3, credits: 5 },
  // IT Semester 4
  { id: '4340701', code: '4340701', name: 'Java Programming', departmentId: 'it', semester: 4, credits: 5 },
  { id: '4341601', code: '4341601', name: 'Web Development Technologies', departmentId: 'it', semester: 4, credits: 4 },
  { id: '4340702', code: '4340702', name: 'Computer Networks', departmentId: 'it', semester: 4, credits: 4 },
  // IT Semester 5
  { id: '4351601', code: '4351601', name: 'Dynamic Web Page Development', departmentId: 'it', semester: 5, credits: 5 },
  { id: '4351602', code: '4351602', name: 'Information Security', departmentId: 'it', semester: 5, credits: 4 },
  { id: '4350701', code: '4350701', name: 'Software Engineering', departmentId: 'it', semester: 5, credits: 4 },
  // IT Semester 6
  { id: '4361603', code: '4361603', name: 'Python Programming', departmentId: 'it', semester: 6, credits: 5 },
  { id: '4360701', code: '4360701', name: 'Android Application Development', departmentId: 'it', semester: 6, credits: 5 },

  // CE Semester 3
  { id: '4330703', code: '4330703', name: 'Operating Systems', departmentId: 'ce', semester: 3, credits: 4 },
  { id: '4330704', code: '4330704', name: 'Object Oriented Programming using C++', departmentId: 'ce', semester: 3, credits: 4 },
  { id: '4330701c', code: '4330701', name: 'Database Management Systems', departmentId: 'ce', semester: 3, credits: 5 },
  // CE Semester 4
  { id: '4340701c', code: '4340701', name: 'Java Programming', departmentId: 'ce', semester: 4, credits: 5 },
  { id: '4340702c', code: '4340702', name: 'Computer Networks', departmentId: 'ce', semester: 4, credits: 4 },
  { id: '4340703', code: '4340703', name: 'Computer Organization & Architecture', departmentId: 'ce', semester: 4, credits: 4 },
  // CE Semester 5
  { id: '4350701c', code: '4350701', name: 'Software Engineering', departmentId: 'ce', semester: 5, credits: 4 },
  { id: '4350702', code: '4350702', name: 'Web Programming', departmentId: 'ce', semester: 5, credits: 5 },
  { id: '4350703', code: '4350703', name: 'Advanced Java Programming', departmentId: 'ce', semester: 5, credits: 5 },
  // CE Semester 6
  { id: '4360701c', code: '4360701', name: 'Android Application Development', departmentId: 'ce', semester: 6, credits: 5 },
  { id: '4360702', code: '4360702', name: 'Cloud Computing & Cyber Security', departmentId: 'ce', semester: 6, credits: 4 }
];

// Helper to programmatically populate standard subjects for ALL departments so we satisfy the "Every department must contain Semester 1 to 6" rule.
export const getSubjects = (): Subject[] => {
  const allSubjects: Subject[] = [];
  
  // Add common subjects to every department for Sem 1 and Sem 2
  DEPARTMENTS.forEach(dept => {
    // Semester 1
    allSubjects.push({ id: `${dept.id}-sem1-sub1`, code: '4300001', name: 'Basic Mathematics', departmentId: dept.id, semester: 1, credits: 4 });
    allSubjects.push({ id: `${dept.id}-sem1-sub2`, code: '4300002', name: 'Communication Skills in English', departmentId: dept.id, semester: 1, credits: 3 });
    allSubjects.push({ id: `${dept.id}-sem1-sub3`, code: '4300007', name: 'Basic Engineering Drawing', departmentId: dept.id, semester: 1, credits: 3 });

    // Semester 2
    allSubjects.push({ id: `${dept.id}-sem2-sub1`, code: '4300003', name: 'Applied Physics (Group-1)', departmentId: dept.id, semester: 2, credits: 4 });
    allSubjects.push({ id: `${dept.id}-sem2-sub2`, code: '4300006', name: 'Applied Chemistry', departmentId: dept.id, semester: 2, credits: 4 });
    allSubjects.push({ id: `${dept.id}-sem2-sub3`, code: '4300012', name: 'Environment Conservation & Hazard Management', departmentId: dept.id, semester: 2, credits: 3 });
  });

  // Now add branch specific subjects for Semesters 3, 4, 5, 6
  DEPARTMENTS.forEach(dept => {
    // Skip IT and CE as we have more detailed subjects or we can map specific ones
    if (dept.id === 'it' || dept.id === 'ce') {
      SPECIFIC_SUBJECTS.forEach(sub => {
        if (sub.departmentId === dept.id) {
          allSubjects.push(sub);
        }
      });
      return;
    }

    // Dynamic generation rules for other branches
    const deptPrefixes: Record<string, { code: string; terms: string[][] }> = {
      mechanical: {
        code: '19',
        terms: [
          ['Strength of Materials', 'Thermodynamics', 'Mechanical Drafting'], // Sem 3
          ['Fluid Mechanics', 'Theory of Machines', 'Manufacturing Technology-I'], // Sem 4
          ['Thermal Engineering', 'Computer Aided Design', 'Tool Engineering'], // Sem 5
          ['Design of Machine Elements', 'Industrial Engineering', 'Power Plant Engineering'] // Sem 6
        ]
      },
      civil: {
        code: '06',
        terms: [
          ['Concrete Technology', 'Hydraulics', 'Surveying'], // Sem 3
          ['Advanced Surveying', 'Soil Mechanics', 'Structural Mechanics'], // Sem 4
          ['Water Resources Engineering', 'Design of Steel Structures', 'Construction Technology'], // Sem 5
          ['Highway Engineering', 'Estimating, Costing & Valuation', 'Public Health Engineering'] // Sem 6
        ]
      },
      electrical: {
        code: '09',
        terms: [
          ['DC Machines', 'Electrical Circuits', 'Electrical Materials'], // Sem 3
          ['AC Machines', 'Transmission & Distribution', 'Electrical Instrumentation'], // Sem 4
          ['Power Electronics', 'Switchgear & Protection', 'Energy Conservation'], // Sem 5
          ['Industrial Drives', 'Utilization of Electrical Energy', 'Microcontroller Applications'] // Sem 6
        ]
      },
      ec: {
        code: '11',
        terms: [
          ['Electronic Devices', 'Digital Electronics', 'Network Analysis'], // Sem 3
          ['Analog Circuits', 'Principles of Communication', 'Microprocessors'], // Sem 4
          ['Power Electronics', 'VLSI Design', 'Embedded Systems'], // Sem 5
          ['Mobile Communication', 'Optical Communication', 'Microwave Engineering'] // Sem 6
        ]
      },
      automobile: {
        code: '02',
        terms: [
          ['Automobile Engines', 'Automobile Materials', 'Chassis Body'], // Sem 3
          ['Fuel & Lubrication', 'Vehicle Transmission', 'Auto Electrical Systems'], // Sem 4
          ['Vehicle Dynamics', 'Garage Practice', 'Emission Control'], // Sem 5
          ['Hybrid Vehicles', 'Vehicle Maintenance', 'Transport Management'] // Sem 6
        ]
      },
      chemical: {
        code: '05',
        terms: [
          ['Organic Chemistry', 'Chemical Process Technology', 'Fluid Flow Operations'], // Sem 3
          ['Reaction Engineering', 'Heat Transfer Operations', 'Chemical Instrumentation'], // Sem 4
          ['Mass Transfer', 'Pollution Control', 'Plant Design'], // Sem 5
          ['Petrochemicals', 'Process Safety', 'Industrial Management'] // Sem 6
        ]
      },
      textile: {
        code: '29',
        terms: [
          ['Yarn Manufacture-I', 'Fabric Manufacture-I', 'Textile Chemistry-I'], // Sem 3
          ['Yarn Manufacture-II', 'Fabric Manufacture-II', 'Textile Fibres'], // Sem 4
          ['Yarn Manufacture-III', 'Fabric Manufacture-III', 'Testing & Quality Control'], // Sem 5
          ['Modern Spinning', 'Modern Weaving', 'Textile Management'] // Sem 6
        ]
      },
      plastic: {
        code: '23',
        terms: [
          ['Polymer Chemistry', 'Introduction to Plastics', 'Plastics Materials-I'], // Sem 3
          ['Plastics Processing-I', 'Mold Design-I', 'Plastics Testing-I'], // Sem 4
          ['Plastics Processing-II', 'Mold Design-II', 'Polymer Blends'], // Sem 5
          ['Plastics Processing-III', 'Mold Manufacturing', 'Plastics Recycling'] // Sem 6
        ]
      },
      environmental: {
        code: '13',
        terms: [
          ['Ecology & Environment', 'Water Treatment', 'Environmental Chemistry'], // Sem 3
          ['Air Pollution Control', 'Wastewater Engineering', 'Solid Waste Management'], // Sem 4
          ['Hazardous Waste', 'Environmental Monitoring', 'Industrial Safety'], // Sem 5
          ['Environmental Impact Assessment', 'GIS & Remote Sensing', 'Green Technology'] // Sem 6
        ]
      },
      mining: {
        code: '22',
        terms: [
          ['Geology', 'Mine Surveying-I', 'Elements of Mining'], // Sem 3
          ['Rock Mechanics', 'Mine Surveying-II', 'Surface Mining'], // Sem 4
          ['Underground Coal Mining', 'Mine Ventilation', 'Mining Machinery'], // Sem 5
          ['Underground Metal Mining', 'Mine Environmental Engineering', 'Mine Management'] // Sem 6
        ]
      },
      metallurgy: {
        code: '21',
        terms: [
          ['Introduction to Metallurgy', 'Mineral Beneficiation', 'Physical Metallurgy'], // Sem 3
          ['Iron Making', 'Mechanical Metallurgy', 'Non-ferrous Extraction'], // Sem 4
          ['Steel Making', 'Heat Treatment', 'Powder Metallurgy'], // Sem 5
          ['Corrosion & Protection', 'Metal Joining & Casting', 'Failure Analysis'] // Sem 6
        ]
      },
      biomedical: {
        code: '03',
        terms: [
          ['Anatomy & Physiology', 'Biomedical Transducers', 'Electronic Circuits'], // Sem 3
          ['Medical Instruments-I', 'Analytical Instruments', 'Digital Electronics'], // Sem 4
          ['Medical Instruments-II', 'Biomaterials', 'Microprocessor Applications'], // Sem 5
          ['Medical Imaging Systems', 'Biotelemetry', 'Hospital Management'] // Sem 6
        ]
      }
    };

    const config = deptPrefixes[dept.id] || {
      code: '99',
      terms: [
        ['Core Subject A', 'Core Subject B', 'Core Lab Work'],
        ['Intermediate Subject A', 'Intermediate Subject B', 'Intermediate Design'],
        ['Advanced Engineering A', 'Advanced Engineering B', 'Systems Engineering'],
        ['Industrial Practice', 'Capstone Seminar', 'Special Topic']
      ]
    };

    // Populate semesters 3 to 6
    for (let sem = 3; sem <= 6; sem++) {
      const termIndex = sem - 3;
      const subjectsForSem = config.terms[termIndex];
      subjectsForSem.forEach((name, idx) => {
        const subCode = `43${sem}${config.code}0${idx + 1}`;
        allSubjects.push({
          id: `${dept.id}-sem${sem}-sub${idx + 1}`,
          code: subCode,
          name: name,
          departmentId: dept.id,
          semester: sem,
          credits: 4
        });
      });
    }
  });

  return allSubjects;
};

// Seed authentic GTU study materials
export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-it-dbms-notes-1',
    title: 'Unit 1: ER-Diagrams and Relational Model',
    type: 'Notes',
    subjectCode: '4330701',
    subjectName: 'Database Management Systems',
    semester: 3,
    departmentId: 'it',
    fileSize: '3.4 MB',
    uploadDate: '2026-01-15',
    downloadCount: 345,
    description: 'Comprehensive hand-written notes covering Entity-Relationship mapping rules, weak entities, self-referencing relationships, and conversion of ERDs to Relational tables.',
    previewContent: `DATABASE MANAGEMENT SYSTEMS (4330701)\nUNIT 1: E-R MODEL & RELATIONAL MODEL\n\n1. Introduction to ER Diagrams:\n- Entity: An object in the real world with independent existence.\n- Attributes: Properties of entities (Simple, Composite, Multi-valued, Derived).\n- Key Attribute: Uniquely identifies an entity (Underlined).\n\n2. Weak Entity Sets:\n- Does not have a primary key of its own.\n- Depends on an identifying/strong entity set via a matching relationship.\n- Depicted with a double rectangle.\n\n3. Relational Database Rules (Codd's Rules):\n- Relational model represents data as tables (Relations).\n- Attributes = Columns, Tuples = Rows.\n- Primary Key: Unique, non-null attribute.\n- Foreign Key: References primary key of another table to maintain integrity.`,
    isOfficial: true
  },
  {
    id: 'mat-it-dbms-imp',
    title: 'DBMS GTU IMP Questions Compilation (New Syllabus)',
    type: 'IMP Questions',
    subjectCode: '4330701',
    subjectName: 'Database Management Systems',
    semester: 3,
    departmentId: 'it',
    fileSize: '1.2 MB',
    uploadDate: '2026-05-10',
    downloadCount: 890,
    description: 'High-yield questions curated based on the last 5 years of GTU paper trends. Essential for scoring high in the GTU theory exam.',
    previewContent: `GTU IMP QUESTIONS - DATABASE MANAGEMENT SYSTEMS (4330701)\n\n--- 3 MARKS QUESTIONS ---\n1. Differentiate between file-processing system and DBMS.\n2. Define Data Independence and its types.\n3. List and explain Codd's Rules (Any 4).\n4. Explain Super Key, Candidate Key, and Primary Key with examples.\n\n--- 4 MARKS QUESTIONS ---\n1. Explain Three-Schema Architecture of DBMS with a clean diagram.\n2. Draw an ER diagram for a Hospital Management System showing key constraints.\n3. What are multi-valued attributes? Explain how they are normalized.\n\n--- 7 MARKS QUESTIONS ---\n1. Explain 1NF, 2NF, and 3NF with appropriate table structures.\n2. State SQL syntax for INNER JOIN, LEFT OUTER JOIN, and RIGHT OUTER JOIN with practical examples.\n3. Write short notes on: Concurrency Control Problems and ACID properties.`,
    isOfficial: false
  },
  {
    id: 'mat-ce-ds-qbank',
    title: 'Data Structures Question Bank with Model Answers',
    type: 'Question Bank',
    subjectCode: '4330702',
    subjectName: 'Data Structures',
    semester: 3,
    departmentId: 'ce',
    fileSize: '4.8 MB',
    uploadDate: '2025-11-20',
    downloadCount: 567,
    description: 'Complete question bank covering Arrays, Stacks, Queues, Linked Lists, Trees, and Graphs, with full code implementations in C/C++.',
    previewContent: `DATA STRUCTURES QUESTION BANK\nGTU CODE: 4330702\n\nQ1. Implement STACK using Arrays. Write functions for Push(), Pop(), and Display().\n\nCode Blueprint:\n#define SIZE 5\nint stack[SIZE], top = -1;\n\nvoid push(int val) {\n  if(top == SIZE - 1) printf("Stack Overflow\\n");\n  else {\n    top++;\n    stack[top] = val;\n  }\n}\n\nQ2. Differentiate between Linear Queue and Circular Queue.\nCircular queue solves the limitation of Linear Queue where empty spaces in front cannot be reused once rear reaches maximum size. Formula for Circular increment: rear = (rear + 1) % SIZE.`,
    isOfficial: true
  },
  {
    id: 'mat-all-maths-formula',
    title: 'Basic Mathematics Formula Cheat-Sheet',
    type: 'Notes',
    subjectCode: '4300001',
    subjectName: 'Basic Mathematics',
    semester: 1,
    departmentId: 'all',
    fileSize: '850 KB',
    uploadDate: '2025-08-01',
    downloadCount: 1250,
    description: 'A concise formula sheet covering Determinants, Matrices, Trigonometry, Vectors, and Coordinate Geometry. Excellent for quick revision before entering the exam hall.',
    previewContent: `BASIC MATHEMATICS (4300001) - FORMULA CHEAT-SHEET\n\n1. MATRICES & DETERMINANTS:\n- Determinant of 2x2 Matrix |A| = ad - bc\n- Inverse of A = (1/|A|) * Adj(A)\n- Cramer's Rule for System of Equations: x = Dx/D, y = Dy/D\n\n2. TRIGONOMETRY:\n- sin²θ + cos²θ = 1\n- sin(A+B) = sinA cosB + cosA sinB\n- cos(A+B) = cosA cosB - sinA sinB\n- tan(A+B) = (tanA + tanB) / (1 - tanA tanB)\n\n3. CO-ORDINATE GEOMETRY:\n- Distance between two points: d = √((x2-x1)² + (y2-y1)²)\n- Slope of line: m = (y2-y1)/(x2-x1)\n- Equation of line: y - y1 = m(x - x1)`,
    isOfficial: true
  }
];

// Seed authentic GTU papers (Winters / Summers / Mids) in English/Gujarati
export const INITIAL_EXAM_PAPERS: ExamPaper[] = [
  {
    id: 'paper-it-dbms-w25',
    year: 2025,
    type: 'Winter Papers',
    subjectCode: '4330701',
    subjectName: 'Database Management Systems',
    semester: 3,
    departmentId: 'it',
    language: 'English',
    fileSize: '1.5 MB',
    uploadDate: '2026-01-20',
    isOfficial: true,
    questions: [
      {
        section: 'Question 1 (A)',
        marks: 3,
        text: 'Define Database Management System. List out major advantages of database systems over traditional file systems.'
      },
      {
        section: 'Question 1 (B)',
        marks: 4,
        text: 'Explain three-schema architecture with a clean and labeled schematic diagram.'
      },
      {
        section: 'Question 1 (C)',
        marks: 7,
        text: 'What is data independence? Differentiate between logical and physical data independence with illustrative examples.'
      },
      {
        section: 'Question 2 (A)',
        marks: 3,
        text: 'Define primary key, unique key, and foreign key constraints in SQL.'
      },
      {
        section: 'Question 2 (B)',
        marks: 4,
        text: 'Describe weak entity sets. How are they represented in Entity-Relationship Diagrams?'
      },
      {
        section: 'Question 2 (C)',
        marks: 7,
        text: 'A company has multiple departments. Each department has multiple employees. Employees can work on multiple projects. Draw a complete Entity-Relationship diagram illustrating key and mapping constraints.'
      }
    ]
  },
  {
    id: 'paper-it-dbms-w25-guj',
    year: 2025,
    type: 'Winter Papers',
    subjectCode: '4330701',
    subjectName: 'Database Management Systems',
    semester: 3,
    departmentId: 'it',
    language: 'Gujarati',
    fileSize: '1.6 MB',
    uploadDate: '2026-01-21',
    isOfficial: true,
    questions: [
      {
        section: 'પ્રશ્ન ૧ (અ)',
        marks: 3,
        text: 'ડેટાબેઝ મેનેજમેન્ટ સિસ્ટમ (DBMS) ની વ્યાખ્યા આપો. ફાઇલ પ્રોસેસિંગ સિસ્ટમ કરતાં તેના મુખ્ય ફાયદાઓ જણાવો.',
        textGuj: 'ડેટાબેઝ મેનેજમેન્ટ સિસ્ટમ (DBMS) ની વ્યાખ્યા આપો. ફાઇલ પ્રોસેસિંગ સિસ્ટમ કરતાં તેના મુખ્ય ફાયદાઓ જણાવો.'
      },
      {
        section: 'પ્રશ્ન ૧ (બ)',
        marks: 4,
        text: 'થ્રી-સ્કીમા આર્કિટેક્ચર (Three-Schema Architecture) સ્વચ્છ આકૃતિ સહ સમજાવો.',
        textGuj: 'થ્રી-સ્કીમા આર્કિટેક્ચર (Three-Schema Architecture) સ્વચ્છ આકૃતિ સહ સમજાવો.'
      },
      {
        section: 'પ્રશ્ન ૧ (ક)',
        marks: 7,
        text: 'ડેટા ઇન્ડિપેન્ડન્સ (Data Independence) એટલે શું? લોજીકલ અને ફિઝીકલ ડેટા ઇન્ડિપેન્ડન્સ વચ્ચેનો તફાવત ઉદાહરણ સાથે સમજાવો.',
        textGuj: 'ડેટા ઇન્ડિપેન્ડન્સ (Data Independence) એટલે શું? લોજીકલ અને ફિઝીકલ ડેટા ઇન્ડિપેન્ડન્સ વચ્ચેનો તફાવત ઉદાહરણ સાથે સમજાવો.'
      }
    ]
  },
  {
    id: 'paper-all-maths-s25',
    year: 2025,
    type: 'Summer Papers',
    subjectCode: '4300001',
    subjectName: 'Basic Mathematics',
    semester: 1,
    departmentId: 'all',
    language: 'English',
    fileSize: '1.1 MB',
    uploadDate: '2025-06-15',
    isOfficial: true,
    questions: [
      {
        section: 'Question 1 (A)',
        marks: 3,
        text: 'If A = [1 2; 3 4] and B = [5 6; 7 8], find the matrix addition (A + B) and matrix multiplication (A * B).'
      },
      {
        section: 'Question 1 (B)',
        marks: 4,
        text: 'Prove that: sin(A+B) * sin(A-B) = sin²A - sin²B.'
      },
      {
        section: 'Question 1 (C)',
        marks: 7,
        text: 'Solve the system of equations using Cramer\'s Rule: 2x - y = 3, x + 3y = 5.'
      }
    ]
  },
  {
    id: 'paper-all-maths-practice',
    year: 2026,
    type: 'Practice Papers',
    subjectCode: '4300001',
    subjectName: 'Basic Mathematics',
    semester: 1,
    departmentId: 'all',
    language: 'English',
    fileSize: '1.0 MB',
    uploadDate: '2026-04-10',
    isOfficial: false, // Clearly marked as practice / model paper
    questions: [
      {
        section: 'Practice Q1',
        marks: 5,
        text: 'Solve the following determinant problem: |x 2; 3 5| = 14. Find the value of x.'
      },
      {
        section: 'Practice Q2',
        marks: 5,
        text: 'Find the unit vector perpendicular to both vectors a = i + j and b = j + k.'
      }
    ]
  }
];

// Seed initial system notices
export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'GTU Diploma Summer 2026 Exam Schedule Declared',
    content: 'Gujarat Technological University has officially released the exam dates and schedules for Semester 2, 4, and 6 diploma students. Examinations are scheduled to commence on July 15, 2026. Hall tickets will be available for download from the GTU student portal on July 5, 2026. Students are advised to double-check their course codes and submit back-log forms promptly.',
    category: 'Exam',
    date: '2026-06-25',
    isImportant: true
  },
  {
    id: 'not-2',
    title: 'New Syllabus Structure for 2026 Batch Appended',
    content: 'The syllabus for Chemical and Textile Diploma branches has been updated under the 2026 academic framework. The new credits model prioritizes project-based practical hours and integrates environmental guidelines directly into laboratory files. Updated syllabi PDFs have been uploaded to the departments page.',
    category: 'Academic',
    date: '2026-06-18',
    isImportant: false
  },
  {
    id: 'not-3',
    title: 'Re-assessment and Photo-copy Results Published',
    content: 'Winter 2025 Semester 1, 3, and 5 re-assessment results are now live. Students who requested transcript photo-copies can download them from the official university server using their 12-digit enrollment credentials. Bookmarks for physical counseling have been cleared.',
    category: 'Results',
    date: '2026-06-10',
    isImportant: true
  }
];
