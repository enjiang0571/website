# BeeFintech Website MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 1-2 day BeeFintech public website MVP with a homepage, demo booking flow, ROI calculator, FAQ search, and insurance technology insights. Admin console work is intentionally deferred to a separate follow-up plan.

**Architecture:** Start from the existing static prototype in `index.html`, then migrate into a small Next.js app with file-backed JSON data for MVP speed. Public visitors never log in, and this phase does not include an admin UI.

**Tech Stack:** Next.js, React, TypeScript, CSS modules or Tailwind, local JSON data, simple API routes, lightweight unit tests for ROI and search logic.

---

## File Structure

- Create: `package.json` for scripts and dependencies.
- Create: `src/app/page.tsx` for the public homepage.
- Create: `src/app/api/bookings/route.ts` for demo booking records.
- Create: `src/components/SiteHeader.tsx` for public navigation.
- Create: `src/components/RoiCalculator.tsx` for ROI UI.
- Create: `src/components/FaqSearch.tsx` for FAQ search.
- Create: `src/components/InsightsList.tsx` for insurance technology insights.
- Create: `src/components/DemoBookingForm.tsx` for public booking.
- Create: `src/lib/roi.ts` for ROI calculations.
- Create: `src/lib/search.ts` for FAQ filtering.
- Create: `src/data/faqs.json`, `src/data/insights.json`, `src/data/bookings.json`.
- Create: `docs/01-requirements.md`, `docs/02-execution-plan.md`, `docs/03-ai-collaboration-log.md`, `docs/04-test-report.md`, `docs/05-retrospective.md`.
- Modify: `DESIGN.md` only if visual rules change.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Create minimal Next.js package**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "vitest": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest"
  }
}
```

- [ ] **Step 2: Add global design tokens**

```css
:root {
  --bg: #FFFFFF;
  --surface: #F8FAFC;
  --fg: #0F172A;
  --muted: #64748B;
  --border: rgba(15, 23, 42, 0.08);
  --accent: #3B82F6;
  --accent-hover: #2563EB;
}
```

- [ ] **Step 3: Run build**

Run: `npm run build`  
Expected: Next.js compiles with no route errors.

- [ ] **Step 4: Commit**

```bash
git add package.json src/app/layout.tsx src/app/globals.css
git commit -m "chore: scaffold beefintech mvp"
```

---

### Task 2: ROI Calculation Logic

**Files:**
- Create: `src/lib/roi.ts`
- Create: `src/lib/roi.test.ts`
- Use in: `src/components/RoiCalculator.tsx`

- [ ] **Step 1: Write failing test**

```ts
import { calculateRoi } from "./roi";

test("calculates annual saving and payback months", () => {
  const result = calculateRoi({
    monthlyCost: 180000,
    automationRate: 0.3,
    systemCost: 240000
  });

  expect(result.annualSaving).toBe(648000);
  expect(result.paybackMonths).toBeCloseTo(4.4, 1);
  expect(result.efficiencyLift).toBe(30);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/lib/roi.test.ts`  
Expected: FAIL because `calculateRoi` is not implemented.

- [ ] **Step 3: Implement ROI function**

```ts
export type RoiInput = {
  monthlyCost: number;
  automationRate: number;
  systemCost: number;
};

export function calculateRoi(input: RoiInput) {
  const annualSaving = input.monthlyCost * input.automationRate * 12;
  const monthlySaving = annualSaving / 12;

  return {
    annualSaving,
    paybackMonths: monthlySaving > 0 ? input.systemCost / monthlySaving : 0,
    efficiencyLift: Math.round(input.automationRate * 100)
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/lib/roi.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/roi.ts src/lib/roi.test.ts
git commit -m "feat: add roi calculation logic"
```

---

### Task 3: Public Homepage

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/SiteHeader.tsx`
- Create: `src/components/RoiCalculator.tsx`
- Create: `src/components/FaqSearch.tsx`
- Create: `src/components/InsightsList.tsx`
- Create: `src/components/DemoBookingForm.tsx`

- [ ] **Step 1: Port the prototype sections**

Use the existing section order from `index.html`:

```text
Hero -> Product capabilities -> ROI calculator -> FAQ -> Insights -> Demo booking -> CTA
```

- [ ] **Step 2: Keep public visitors logged out**

Do not add login UI to the public header. The only admin entry is a small `/admin` link in the footer or nav.

- [ ] **Step 3: Add homepage copy**

Use this headline:

```text
香港保险经纪业务数字化服务平台
```

Use this subhead:

```text
BeeFintech 帮助保险经纪团队管理获客、签单、保单服务、佣金核算与渠道协同，让官网从品牌展示升级为客户服务入口。
```

- [ ] **Step 4: Run build**

Run: `npm run build`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components
git commit -m "feat: build public website homepage"
```

---

### Task 4: FAQ And Insights Data

**Files:**
- Create: `src/data/faqs.json`
- Create: `src/data/insights.json`
- Create: `src/lib/search.ts`
- Create: `src/lib/search.test.ts`

- [ ] **Step 1: Write search test**

```ts
import { filterFaqs } from "./search";

const faqs = [
  { category: "佣金", q: "是否支持佣金核算？", a: "支持按团队、渠道和产品配置。" },
  { category: "部署", q: "上线周期多久？", a: "MVP 可先从核心流程上线。" }
];

test("filters FAQ by question and answer", () => {
  expect(filterFaqs(faqs, "佣金")).toHaveLength(1);
  expect(filterFaqs(faqs, "核心流程")).toHaveLength(1);
});
```

- [ ] **Step 2: Implement search**

```ts
type Faq = { category: string; q: string; a: string };

export function filterFaqs(faqs: Faq[], query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return faqs;

  return faqs.filter((faq) =>
    `${faq.category} ${faq.q} ${faq.a}`.toLowerCase().includes(value)
  );
}
```

- [ ] **Step 3: Add initial data**

Use FAQ categories:

```text
部署、佣金、安全、接入
```

Use insight categories:

```text
政策、行业、AI
```

- [ ] **Step 4: Run tests**

Run: `npm run test -- src/lib/search.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/faqs.json src/data/insights.json src/lib/search.ts src/lib/search.test.ts
git commit -m "feat: add faq and insights data"
```

---

### Task 5: Demo Booking API

**Files:**
- Create: `src/app/api/bookings/route.ts`
- Modify: `src/components/DemoBookingForm.tsx`
- Modify: `src/data/bookings.json`

- [ ] **Step 1: Define booking payload**

```ts
type BookingPayload = {
  name: string;
  company: string;
  contact: string;
  role?: string;
  need: string;
  message?: string;
};
```

- [ ] **Step 2: Implement validation**

Reject requests when `name`, `company`, `contact`, or `need` is missing.

- [ ] **Step 3: Return booking number**

Use this ID format:

```text
BF-YYYYMMDD-001
```

- [ ] **Step 4: Connect form**

On success, show:

```text
预约已提交，编号：BF-YYYYMMDD-001
```

- [ ] **Step 5: Run manual API test**

Run: `npm run dev`  
Then submit the homepage form.  
Expected: success message appears and admin booking count increments.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/bookings/route.ts src/components/DemoBookingForm.tsx src/data/bookings.json
git commit -m "feat: add demo booking api"
```

---

### Task 6: Website Polish And Conversion Flow

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/DemoBookingForm.tsx`
- Modify: `src/components/RoiCalculator.tsx`

- [ ] **Step 1: Add service journey section**

Use this section order:

```text
理解业务价值 -> 测算投入回报 -> 自助解决疑问 -> 提交演示预约
```

- [ ] **Step 2: Improve ROI result**

Add a recommendation message below the ROI values:

```text
建议优先数字化签单、保单服务和佣金核算流程，以最快释放运营效率。
```

- [ ] **Step 3: Improve booking success feedback**

After form submission, show:

```text
预约已提交，编号：BF-YYYYMMDD-001。BeeFintech 团队将在 1 个工作日内联系你。
```

- [ ] **Step 4: Remove admin entry points**

Confirm the public website has no admin navigation, no admin password form, and no admin table UI.

- [ ] **Step 5: Run build**

Run: `npm run build`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/DemoBookingForm.tsx src/components/RoiCalculator.tsx
git commit -m "feat: polish public website conversion flow"
```

---

### Task 7: Required Competition Documents

**Files:**
- Create: `docs/01-requirements.md`
- Create: `docs/02-execution-plan.md`
- Create: `docs/03-ai-collaboration-log.md`
- Create: `docs/04-test-report.md`
- Create: `docs/05-retrospective.md`

- [ ] **Step 1: Requirements document**

Include:

```text
比赛背景、目标用户、核心痛点、功能范围、非目标范围、验收标准
```

- [ ] **Step 2: Execution plan**

Include:

```text
技术栈、页面结构、接口设计、数据结构、时间安排、风险控制
```

- [ ] **Step 3: AI collaboration log**

Include:

```text
需求澄清、设计参考、代码生成、测试补充、Bug 排查、文案优化
```

- [ ] **Step 4: Test report**

Include:

```text
ROI 计算、FAQ 搜索、预约提交、后台登录、响应式检查、已知限制
```

- [ ] **Step 5: Retrospective**

Include:

```text
完成内容、AI 帮助最大的位置、返工点、可沉淀方法、下一步优化
```

- [ ] **Step 6: Commit**

```bash
git add docs
git commit -m "docs: add competition delivery documents"
```

---

### Task 8: Final Verification

**Files:**
- Modify only files required by verification findings.

- [ ] **Step 1: Run automated checks**

Run:

```bash
npm run test
npm run build
```

Expected: both pass.

- [ ] **Step 2: Manual website check**

Check:

```text
Homepage loads
ROI calculator updates result
FAQ search filters records
Insights render
Booking form returns booking number
Mobile layout has no horizontal scroll
```

- [ ] **Step 3: GitHub delivery check**

Check:

```text
All code committed
Each teammate has at least one commit
Five required documents exist
README explains how to run the project
```

- [ ] **Step 4: Commit final fixes**

```bash
git add .
git commit -m "chore: finalize competition mvp"
```
