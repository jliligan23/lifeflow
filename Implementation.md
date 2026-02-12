System Role: Act as a Senior Full-Stack Developer and Health Informatics Specialist.
Task: Build a responsive Web Application for a MedTech thesis: "Web-Based Blood Donor Registration and Awareness System."
Tech Stack:
Framework: Next.js 14+ (App Router).
Styling: Tailwind CSS (for a clean, medical-grade UI).
Database & Auth: Supabase (PostgreSQL + Row Level Security).
Deployment: Optimized for Vercel or Render.
Core Features to Implement:
Role-Based Access Control (RBAC):
Public: Access to "Blood Awareness" educational content and "Why Donate?" landing page.
User (Donor): Profile management, blood type registry, and a "Privacy Toggle" to hide/show contact info.
Admin (MedTech): A dashboard to view donor stats (O+, A-, etc.), verify donations, and post urgent blood requests.
Blood Finder Engine:
A searchable directory with filters for Blood Type and Location (Baguio City Barangays).
Integration of a "Click to Call/SMS" feature for mobile users to contact donors quickly.
MedTech Thesis Specifics:
Data Privacy: A mandatory Consent Modal (RA 10173 compliance) upon first login.
Eligibility Logic: A "Days until next donation" calculator based on the last donation date in the Supabase donation_history table.
Acceptance Survey: A built-in Likert scale form to collect data for the "User Acceptance" thesis objective.