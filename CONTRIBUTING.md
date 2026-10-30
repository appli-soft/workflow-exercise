# Contributing to this exercise

Direct pushes to the `main` branch are blocked. All code must arrive via Pull Requests.

---

## 1. Branching & Git Protocol

### A. Clone and Sync
Clone the repository and verify your local `main` branch is up to date:

```bash
git clone <REPO_URL>
cd workflow-exercise
git checkout main
git pull origin main
```


### B. Create an Isolated Feature Branch

Never write code directly on `main`. Create a new branch named with the convention:

`feat/<your-name>-<feature-description>`

```bash
# Example
git checkout -b feat/<your-name>-amount-sanitizer
```

---

## 2. AI Usage & Comprehension Policy

Use of AI development tools is encouraged (Claude, ChatGPT, Copilot, Cursor). However, the following standards are non-negotiable:

1. **Total Code Ownership:** You are 100% accountable for every line of code submitted under your name. "The AI wrote it" is not an acceptable response in code reviews.
2. **The Defense Gate:** During PR review and team syncs, you must be ready to walk through your changes line-by-line and explain:
* **What** the implementation does.
* **Why** this specific approach was selected over alternatives.
* **How** runtime edge cases, invalid inputs, and failures are handled.


3. **Clean Code & Meaningful Comments:** AI often produces verbose or hallucinated boilerplate. Refactor it: ensure meaningful variable names, clean helper functions, and clear inline comments explaining non-trivial logic (such as regex or math rounding).

---

## 3. Commit Discipline (Conventional Commits)

Keep commits atomic (focused on a single change) and well-structured. Let's follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```text
<type>(<scope>): <short imperative summary>

```

### Allowed Types:

* `feat`: A new function, module, or core feature
* `test`: Adding or updating test cases
* `fix`: Patching an edge-case bug or parsing error
* `docs`: Updating documentation (`TEAM.md`, `README.md`)
* `refactor`: Restructuring code without changing behavior

### Examples:

* `feat(amount): implement European comma decimal parsing`
* `test(date): add boundary tests for leap years and future dates`
* `docs(team): add contributor details to TEAM.md`

---

## 4. Local Verification Checklist

Before pushing any code, verify your changes locally:

1. **Install dependencies:**
```bash
npm install

```


2. **Run tests:**
```bash
npm test

```


*Your PR will fail CI if any tests throw errors or unhandled exceptions.*
3. **Check for leftover debug logs:** Remove all `console.log` statements before committing.

---

## 5. Submitting Your Pull Request

1. **Push your feature branch:**
```bash
git push origin feat/<your-name>-<feature-description>

```


2. **Open a PR:**
* Head to the GitHub repository.
* Click **Compare & pull request**.
* Ensure the base branch is set to `main` and the compare branch is your feature branch.


3. **Complete the PR Template:**
* Summarize what you implemented.
* Confirm you understand the code and are ready for the live walkthrough.
* Paste the terminal output showing passing `npm test` results.


4. **Assign Reviewer:**
* Request a review from the Tech Lead (`@monish-saxena`).
* If feedback is provided, push new commits to the same branch—the PR updates automatically.

