---
name: "📌 Backlog: Lucky Playwright Refactoring & Improvements"
about: "Centralized list of refactoring and improvement tasks for the project"
title: "Backlog: Refactoring & Improvements"
labels: ["backlog", "enhancement"]
assignees: []
---

# 📌 Backlog: Lucky Playwright Refactoring & Improvements

## 1. Code Quality & Readability
- [ ] Add explicit return types to all functions  
- [ ] Translate all comments to English  
- [ ] Add error handling wrappers for UI actions and business commands  
- [ ] Introduce a logging utility (`utils/logger.ts`)  

## 2. Duplication Removal
- [ ] Centralize locators in `locators/` or `utils/locators.ts`  
- [ ] Create test data factories instead of static objects  
- [ ] Extract reusable assertions into `utils/assertions.ts`  

## 3. Architecture & Structure
- [ ] Standardize folder naming (plural: `factories/`, `commands/`, `pages/`)  
- [ ] Split large files (e.g., `main-content.component.ts`) into smaller modules  
- [ ] Introduce interfaces for page objects and business commands  

## 4. Testing Coverage
- [ ] Add edge-case tests (`edge-cases.spec.ts`)  
- [ ] Centralize fixtures (`fixtures/common-fixtures.ts`)  
- [ ] Create descriptive custom matchers (`utils/custom-matchers.ts`)  

## 5. Security & Validation
- [ ] Add input validation in business commands (`utils/validator.ts`)  
- [ ] Ensure security test suite (`security-tests.spec.ts`) runs in CI  
- [ ] Enable secret scanning (`git-secrets` or GitHub built-in)  

## 6. Dependencies & Performance
- [ ] Update dependencies (`npm outdated` → upgrade)  
- [ ] Audit async/await usage across Playwright actions  
- [ ] Implement test sharding in CI for faster runs  

---

## ✅ Acceptance Criteria
- No duplicated code or locators remain.  
- Tests pass reliably in CI with logging + validation.  
- Repo has updated dependencies and security scanning enabled.  
- All code and comments are in English.  
- Architecture follows DRY and single-responsibility principles.  
