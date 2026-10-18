export const siteConfig = {
  name: 'Omar Hussain Fahmi',
  title: 'Computer Information Systems Specialist',
  location: 'Jeddah, Saudi Arabia',
  email: 'omarhussainfahmi@hotmail.com',
  phone: '+966 5004 11 051',
  phoneHref: 'tel:+966500411051',
  github: 'https://github.com/omarhussainfahmi',
  linkedin: 'https://www.linkedin.com/in/omar-hussain-fahmi-830b62256',
  cv: 'https://omar-hussain-fahmi-portfolio.pages.dev/OmarHussainCV.pdf?v=20260929',
  available: true,
  recruiterSummary:
    'Computer Information Systems junior with skills in HTML, CSS, JavaScript, PHP, ASP.NET, SQL, and OOP, alongside SAP Fiori, ABAP Cloud, and UI/UX design. I build practical web applications that connect clear interfaces with reliable data handling.',
  summary:
    'Computer Information Systems junior building practical solutions through full-stack development, SAP, and thoughtful user experiences.',
  about:
    'I enjoy turning everyday problems into useful software. My background brings together full-stack web development, SAP, UI/UX, Flutter, and game development. I value clear communication, teamwork, and the focus that comes with working independently. There is always something new to learn - and a better way to build.',
  roles: [
    'Full-Stack Developer',
    'SAP Fiori Developer',
    'ABAP Cloud Developer',
    'Computer Information Systems Specialist',
  ],
  languages: ['Arabic', 'English'],
};
export const nav = [
  ['Home', ''],
  ['About', 'about'],
  ['Skills', 'skills'],
  ['Experience', 'experience'],
  ['Projects', 'projects'],
  ['Case Studies', 'case-studies'],
  ['Certifications', 'certifications'],
  ['GitHub', 'github'],
  ['Blog', 'blog'],
  ['Contact', 'contact'],
] as const;
export const education = {
  degree: 'Bachelor of Computer Information Systems',
  school: 'University of Jordan',
  location: 'Amman, Jordan',
  dates: '2021 - 2025',
};
export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  url?: string;
}
export const testimonials: Testimonial[] = [];
