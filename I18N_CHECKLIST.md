# Schema Architect Internationalization (i18n) Maintenance Protocol

**Version: 1.0**
**Date: 2025-07-18**

## 1. Introduction

This document is the **mandatory checklist** for any developer making changes to the Schema Architect application. The application exists in two synchronized versions: Arabic (`ar`, RTL) and English (`en`, LTR). Failure to follow this protocol will break the synchronization, introduce bugs, and create technical debt.

**The Golden Rule:** A change is not complete until it has been correctly implemented and tested in **BOTH** language versions.

---

## 2. Protocol for JavaScript Changes (`.js` files)

Our JavaScript files are paired (e.g., `projects.js` and `projects-en.js`).

#### A. Logic & Functional Changes

If you change how the code **works** (e.g., modify an algorithm, change an event listener, alter the schema generation logic):

1.  **Implement the change** in the primary `.js` file (e.g., `schema-architect.js`).
2.  **IMMEDIATELY replicate the exact same logic change** in the corresponding `-en.js` file (e.g., `schema-architect-en.js`).
3.  Do not commit until the logic is identical in both files.

#### B. User-Facing String Changes

If you add, remove, or modify any user-facing text (e.g., toast messages, error text, prompts, labels):

1.  **Locate the string** in both the primary `.js` file and its `-en.js` counterpart.
2.  **Add/Modify the Arabic string** in the primary file (e.g., `toast-utility.js`).
3.  **Add/Modify the English translation** in the English file (e.g., `toast-utility-en.js`).
4.  **CRITICAL:** If it's a new string, add a unique, descriptive key comment directly above the string in **BOTH** files.
    *   **Format:** `// i18n-key: keyName`
    *   **Example (in `projects.js`):**
        ```javascript
        // i18n-key: toastProjectNotFound
        showToast('لم يتم العثور على المشروع المحدد.', 'danger');
        ```
    *   **Example (in `projects-en.js`):**
        ```javascript
        // i18n-key: toastProjectNotFound
        showToast('The selected project was not found.', 'danger');
        ```

---

## 3. Protocol for HTML Changes (`index.html`, `index-en.html`)

#### A. Structural & Attribute Changes

If you add, remove, or modify any HTML element, `id`, `class`, or data-attribute:

1.  **Make the change** in `index.html`.
2.  **IMMEDIATELY replicate the exact same structural change** in `index-en.html`.

#### B. Text & Content Changes

If you change any visible text (headings, labels, placeholders, titles, aria-labels):

1.  **Modify the Arabic text** in `index.html`.
2.  **IMMEDIATELY modify the corresponding English text** in `index-en.html`.
3.  **Pay special attention to icon margins:**
    *   In `index.html` (RTL), use Bootstrap's margin-start classes (e.g., `<i class="bi bi-robot ms-2"></i>`).
    *   In `index-en.html` (LTR), use Bootstrap's margin-end classes (e.g., `<i class="bi bi-robot me-2"></i>`).

---

## 4. Protocol for CSS Changes (`.css` files)

Our CSS is split into a base file and an RTL-override file. Choosing the correct file is essential.

#### A. Global, Direction-Agnostic Styles

*   For changes that apply everywhere regardless of direction (`color`, `font-family`, `background-color`, `border-radius`, etc.).
*   **ACTION:** Modify **ONLY** `styles.css`.

#### B. LTR-Specific or Default Styles

*   For styles related to left-to-right flow (`float: left`, `padding-left`, `border-left`, `text-align: left`, etc.).
*   **ACTION:** Modify **ONLY** `styles.css`.

#### C. RTL-Specific Override Styles

*   For styles that **only** apply in the right-to-left context (`float: right`, `padding-right`, `border-right`, `text-align: right`, etc.).
*   **ACTION:** Modify **ONLY** `rtl-styles.css`. **DO NOT** add RTL rules to the main `styles.css` file.

---

## 5. Final Pre-Commit Checklist

Before you run `git commit`, ask yourself:

- [ ] **JS Logic:** Did I apply my logic changes to **both** the base `.js` file and its `-en.js` counterpart?
- [ ] **JS Strings:** For any new/modified strings, did I update **both** language files and add/verify the `i18n-key` in **both**?
- [ ] **HTML:** Did I mirror all structural, attribute, and content changes between `index.html` and `index-en.html`?
- [ ] **CSS:** Did I place my style rules in the correct file (`styles.css` for base/LTR, `rtl-styles.css` for RTL overrides)?
- [ ] **Testing:** Have I loaded both `index.html` and `index-en.html` locally and confirmed that my changes work and display correctly in both languages?

If you can check all these boxes, your change is ready to be committed.