export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  dates?: string;
  technologies: string[];
  cardTechnologies?: string[];
  category: string;
  image?: string;
  gallery: GalleryImage[];
  liveUrl?: string;
  liveUnavailable?: boolean;
  githubUrl: string;
  videoUrl?: string;
  videoEmbedUrl?: string;
  documentationUrl?: string;
  featured: boolean;
  caseStudy?: string;
  features: string[];
  status: string;
  technical: string[];
  challenges?: { title: string; body: string }[];
  futureImprovements?: { title: string; body: string }[];
}
export const projects: Project[] = [
  {
    id: 'next-chapter',
    cardTechnologies: ['HTML', 'PHP', 'MySQL', 'Google Books API'],
    slug: 'next-chapter',
    title: 'Next Chapter',
    description: 'A new chapter in book discovery.',
    longDescription:
      'Next Chapter is a University of Jordan graduation project that brings book search, reader ratings, reviews, and personal reading lists into one website. Readers can explore titles from Google Books, choose their favorite genres, and discover suggestions from the community.',
    dates: 'Feb 2025 - Jun 2025',
    technologies: ['PHP', 'JavaScript', 'MySQL', 'Google Books API', 'Bootstrap 5', 'HTML', 'CSS'],
    category: 'Full-stack web application',
    image: '/images/next-chapter-wireframe.webp',
    gallery: [
      {
        src: '/images/next-chapter-landing.webp',
        alt: 'Next Chapter landing page from the team project report',
        caption: 'Landing page - documented team interface.',
      },
      {
        src: '/images/next-chapter-genres.webp',
        alt: 'Next Chapter genre preferences from the team project report',
        caption: 'Genre preferences - documented onboarding flow.',
      },
      {
        src: '/images/next-chapter-discovery.webp',
        alt: 'Next Chapter genre discovery from the team project report',
        caption: 'Browse by genre - documented discovery interface.',
      },
      {
        src: '/images/next-chapter-library.webp',
        alt: 'Next Chapter reading library from the team project report',
        caption: 'Reading library - documented team interface.',
      },
      {
        src: '/images/next-chapter-wireframe.webp',
        alt: 'Next Chapter homepage wireframe from the project repository',
        caption:
          'Original low-fidelity homepage wireframe from the project repository - not a production screenshot.',
      },
    ],
    liveUrl: 'https://nextchapter-53bl2.ondigitalocean.app',
    liveUnavailable: true,
    githubUrl: 'https://github.com/qus0i/Graduation-project',
    videoUrl: 'https://lnkd.in/p/evh-tuQV',
    videoEmbedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7346077985780723713',
    documentationUrl:
      'https://omar-hussain-fahmi-portfolio.pages.dev/documents/next-chapter-documentation.docx',
    featured: true,
    caseStudy: '/case-studies/next-chapter',
    features: [
      'Book search and genre exploration',
      'Five reading lists: Favorites, Library, Open Cover, Closed Cover, and Dusty Shelves',
      'Registration, genre preferences, profile photos, and password reset',
      'Community ratings, comments, and random reader recommendations',
      'Google Books API integration',
    ],
    status: 'Graduation project',
    technical: [
      'PHP backend with HTML, CSS, and JavaScript frontend.',
      'MySQL stores account data, genre preferences, reading lists, ratings, and comments; the report describes Railway hosting.',
      'The report documents PHP sessions, account updates, and email-based password reset.',
      'Discovery combines selected genres with random suggestions drawn from books rated and reviewed by readers.',
    ],
  },
  {
    id: 'asp-net-project',
    cardTechnologies: ['C#', 'ASP.NET Core MVC', '.NET 8', 'Razor'],
    slug: 'asp-net-project',
    title: 'ASP.NET Project - Full Dummy Sample',
    description: 'Exploring the layers of an MVC application.',
    longDescription:
      'A learning-oriented ASP.NET Core MVC sample organized into entities, service contracts, services, and repositories. The repository contains person-management functionality, country and product views, custom filters, and exception-handling components.',
    technologies: [
      'C#',
      'ASP.NET Core MVC',
      '.NET 8',
      'Razor',
      'Entity Framework Core',
      'SQL Server',
    ],
    category: 'Backend & MVC sample',
    gallery: [],
    githubUrl: 'https://github.com/omarhussainfahmi/ASP.NET-project-Full-dummy-sample-',
    featured: true,
    features: [
      'Person CRUD components',
      'Razor views and reusable Grid ViewComponent',
      'Service and repository layers',
      'Custom action, authorization, exception, resource, and result filters',
      'JWT-related service and DTO files',
      'CRUDTests project and Rotativa PDF integration',
    ],
    status: 'Learning sample',
    technical: [
      'firstASPnet.csproj targets net8.0.',
      'Program.cs configures Entity Framework with UseSqlServer.',
      'The README documents JWT-related components; end-to-end authentication behavior has not been verified.',
      'The UI uses Razor views with a wwwroot stylesheet.',
      'A test project is present; its passing status and deployed behavior are not asserted.',
    ],
    challenges: [
      {
        title: 'Keeping each layer responsible for one job',
        body: 'An MVC sample becomes harder to follow when controllers validate business rules, query the database, and prepare the response in the same method. The service and repository structure creates a useful design exercise: decide where each rule belongs, then keep that boundary consistent across create, edit, and delete operations. A good result is a controller that explains the request flow without duplicating the underlying business logic.',
      },
      {
        title: 'Handling invalid input without losing the user’s work',
        body: 'CRUD screens need more than a successful save. Missing records, invalid fields, and failed updates should lead to clear feedback while preserving useful form values. The challenge is to make service validation, exceptions, and Razor validation messages agree, so the same problem does not produce different behavior depending on where it is caught.',
      },
      {
        title: 'Understanding the request pipeline',
        body: 'This sample brings several filter types together with exception middleware. That makes execution order and responsibility an important learning challenge: which component can stop a request, which can change its result, and which handles an error? Mapping one request through the pipeline helps avoid duplicated error handling and unexpected responses.',
      },
      {
        title: 'Connecting reusable components to realistic workflows',
        body: 'The grid component and PDF export introduce a consistency problem beyond basic CRUD. A filtered list on screen and an exported report should describe the same records, sorting, and field labels. Sharing a clear response model is a useful way to keep these views aligned without coupling the UI directly to database entities.',
      },
    ],
    futureImprovements: [
      {
        title: '1. Make the sample easy to run and review',
        body: 'Document the database setup, configuration keys, migrations, and a small set of fictional seed records. Add a short walkthrough showing create, edit, validation, and export. A repeatable setup would let another developer evaluate the project without guessing which local settings are required.',
      },
      {
        title: '2. Test complete workflows and failure paths',
        body: 'Build on the existing test project with integration tests that exercise requests through the application and a disposable database. Prioritize invalid submissions, missing IDs, failed updates, access-denied responses, and export consistency. Add a CI check that restores, builds, and runs these tests on each change, with the result visible in the repository.',
      },
      {
        title: '3. Define and verify access rules',
        body: 'Turn authentication-related components into a clearly documented access model: who may view, create, edit, or delete records? Add tests for anonymous requests, expired credentials, and insufficient permissions. Review secret storage and form protection as part of that work. These are proposed verification tasks, not claims that the current sample provides a complete security solution.',
      },
      {
        title: '4. Improve the experience as data grows',
        body: 'Explore server-side pagination, stable sorting, and search filters for larger lists. Measure query time and returned data before deciding whether indexing or query changes are needed. Keep filters when moving between pages and use the same selection rules for exports, so performance improvements do not change the user’s expectations.',
      },
      {
        title: '5. Prepare a maintainable demonstration release',
        body: 'Review overlapping contracts and models, document the purpose of each layer, and remove examples that no longer serve the main workflow. Add structured error logging and a repeatable deployment process. A hosted demo with fictional data, clear reset behavior, and a concise architecture walkthrough would make the sample more useful to both learners and reviewers.',
      },
    ],
  },
];
export const caseSections = [
  [
    'The project',
    'Next Chapter was built by a four-person University of Jordan team as a book discovery and review platform. The idea was to bring the browsing experience of a media catalogue to books, with search, book details, reader feedback, and personal collections in one place.',
  ],
  [
    'My contribution',
    'The project schedule assigns me responsibility for defining the objectives, designing system functionality, and testing the system with users. I also shared interface design with Malek. Development and delivery were team efforts with Qusai, Malek, and Ahmad. These responsibilities are recorded in section 1.8 of the project report.',
  ],
  [
    'The problem and planning',
    'The team wanted to make it easier for readers to choose a book and keep track of their reading. Planning compared Goodreads and LibraryThing and focused on connecting discovery, ratings, reviews, and lists through a consistent interface. The report includes stakeholder interview prompts with sample answers, questionnaires, functional requirements, wireframes, and system diagrams (chapters 2 to 4).',
  ],
  [
    'From sign-up to discovery',
    'New readers create an account, select six genres, and can upload a profile photo or keep a default image. The home page uses these preferences to organize book browsing. Readers can search by title, author, or genre, open a book for more detail, and save it to a personal list. The documented onboarding and user manual show this flow in sections 4.5 and 6.5.',
  ],
  [
    'Reading lists and community feedback',
    'Readers organize books into Favorites, Library, Open Cover, Closed Cover, and Dusty Shelves. Adding or removing a book updates the account records and the visible list state. Each book can show a Google Books rating alongside the community rating. Readers can submit or update their own rating and leave comments; the documented comment flow replaces filtered words with asterisks.',
  ],
  [
    'How recommendations work',
    'Discovery uses the reader’s chosen genres and suggestions from other readers. The random suggestion feature queries books that have community ratings and comments, selects one, and shows its cover, rating, and a highlighted comment. An arrow loads another suggestion. This is a preference-based and community-driven flow; AI recommendations based on interaction history are listed as future work, not an implemented feature.',
  ],
  [
    'Design and implementation',
    'The interface uses HTML, CSS, Bootstrap 5, and JavaScript, with Figma used for design. Blender and After Effects were used for animated page and hero transitions. PHP handles server-side validation, sessions, account functions, and database operations. JavaScript requests book data from Google Books. The team used Git and GitHub for collaboration (sections 3.1.1 and 5.1).',
  ],
  [
    'Data and API flow',
    'Google Books supplies external book metadata. Search returns a list of matching titles with summary information; opening a title retrieves its full details. MySQL, hosted on Railway during the project, holds account information and the user-specific preferences, lists, ratings, and comments. Book and user identifiers connect these interactions. The report includes ER diagrams, sequence diagrams, and database screenshots in chapter 4.',
  ],
  [
    'Account management',
    'The documented account flows cover sign-in, sign-out, profile changes, and email-based password reset. Sign-out clears the session, and password changes update the stored hash. Session-based access control and prepared database statements appear in the requirements. These are the report’s design and implementation descriptions, not an independent security assessment.',
  ],
  [
    'Testing and feedback',
    'The team reports manual unit, integration, system, and end-to-end testing, plus Postman stress testing. Two usability experts reviewed the interface using Nielsen’s ten heuristics. Their findings included inconsistent button styling, missing tooltips, and insufficient guidance. Recommended changes were shared components, clearer validation, and contextual help. Cooperative evaluation covered registration, searching and saving books, and viewing reviews (chapter 6).',
  ],
  [
    'Reported results and limits',
    'The cooperative evaluation records average task times of 30 seconds for registration and login, 2.5 minutes for searching and using the action buttons, and one minute for viewing interactions and reviews. The report does not state the participant count, so these figures describe that evaluation rather than a general benchmark. It reports desktop checks in Chrome, Firefox, and Edge and loading times below two seconds for major functions, without raw timing or load-test data. The original live demo is currently unavailable; the walkthrough, source code, and report preserve the project.',
  ],
  [
    'What comes next',
    'The report identifies dependence on one book source and the absence of native mobile apps and AI recommendations as limitations. Proposed improvements include more Arabic book sources, recommendations based on reading behavior, Android and iOS apps with offline support, dark mode and accessibility settings, and friend profiles with messaging. These are future plans. The usability evaluation also gives a practical starting point: improve consistency, validation messages, and guidance before adding more features.',
  ],
] as const;
export function getCaseSections(slug: string) {
  return slug === 'next-chapter' ? caseSections : [];
}
