-- Demo Data for Judges
-- This file contains SQL statements to verify or manually insert data if the seeder fails.

-- 1. Users
INSERT INTO "Users" (id, name, email, password, role, "createdAt", "updatedAt") VALUES
('u-registrar-01', 'Registrar Admin', 'registrar@nyaysetu.com', '$2b$10$hashedpassword', 'registrar', NOW(), NOW()),
('u-lawyer-01', 'Advocate Verma', 'lawyer@nyaysetu.com', '$2b$10$hashedpassword', 'lawyer', NOW(), NOW()),
('u-judge-01', 'Hon. Justice Sharma', 'judge@nyaysetu.com', '$2b$10$hashedpassword', 'judge', NOW(), NOW());

-- 2. Sample Case
INSERT INTO "Cases" (id, title, type, filing_date, status, urgency_score, priority_score, "lawyerId", "createdAt", "updatedAt") VALUES
('c-demo-001', 'State vs. Rohan', 'Criminal', '2023-01-15', 'Pending', 8, 85.0, 'u-lawyer-01', NOW(), NOW());

-- 3. Audit Log
INSERT INTO "AuditLogs" (id, action, details, "userId", "createdAt", "updatedAt") VALUES
('log-001', 'CASE_CREATED', '{"caseId": "c-demo-001"}', 'u-registrar-01', NOW(), NOW());
