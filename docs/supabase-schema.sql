create table if not exists public.faqs (
  id text primary key,
  question text not null,
  answer text not null,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id text primary key,
  category text not null,
  title text not null,
  published_at date not null,
  summary text not null default '',
  body text not null,
  image_url text not null default '',
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id text primary key,
  name text not null,
  company text not null,
  position text not null,
  phone text not null,
  email text not null default '',
  product_module text not null default '',
  message text not null default '',
  created_at timestamptz not null default now()
);

alter table public.faqs enable row level security;
alter table public.news enable row level security;
alter table public.bookings enable row level security;

insert into public.faqs (id, question, answer, sort_order) values
  ('security', '平台如何保障数据安全？', 'BeeFintech 通过权限分级、加密传输、操作留痕、数据备份与访问审计等机制保障业务数据安全。平台也支持按团队、角色、渠道配置不同的数据可见范围。', 1),
  ('commission', '佣金结算如何保证准确？', '系统可按产品、渠道、团队层级与佣金方案自动计算佣金，并通过对账状态、审批流程和发放记录减少人工核算误差。', 2),
  ('integration', '支持哪些对接方式？', '平台支持标准 API、文件导入、数据同步任务和定制接口对接，可连接保险公司、经纪团队、客户服务和数据分析场景。', 3),
  ('insurers', '系统支持哪些保险公司？', '系统可根据团队业务范围配置保险公司、产品库、计划书模板与保费试算规则，支持持续扩展新的保险公司和产品类型。', 4),
  ('pricing', '费用如何计算？', '费用通常依据团队规模、启用模块、系统对接范围和定制服务内容综合评估。建议预约产品演示后获取更准确的方案报价。', 5)
on conflict (id) do nothing;

insert into public.news (id, category, title, published_at, summary, body, image_url, sort_order) values
  ('trend', '行业洞察', '香港保险业数字化趋势与机遇', '2026-05-20', '香港保险经纪业务正在从线下流程逐步转向线上协同、数据连接和移动展业。', '香港保险经纪业务正在从线下流程逐步转向线上协同、数据连接和移动展业。数字化系统能帮助团队统一客户、保单、签单、佣金和服务数据。

对经纪团队而言，真正的机会不只是把表格搬到线上，而是通过标准流程和实时数据提升客户服务效率。', '', 1),
  ('release', '产品动态', 'BeeFintech 平台 2024 春季更新', '2026-05-15', '本次更新围绕销售工具、签单流程、保单服务和佣金管理进行体验优化。', '本次更新围绕销售工具、签单流程、保单服务和佣金管理进行体验优化。

平台强化了产品对比、计划书生成、数据看板和团队协作能力，让不同角色可以在同一套数据基础上工作。', '', 2),
  ('practice', '最佳实践', '数字化如何提升经纪业务生产力', '2026-05-08', '标准化线索跟进、移动端客户管理和自动化保单提醒能减少重复工作。', '经纪团队可以通过标准化线索跟进、移动端客户管理、自动化保单提醒和佣金对账流程减少重复工作。

当日常流程被系统承接，团队能把更多时间投入到客户沟通、方案设计和业务增长。', '', 3),
  ('policy', '政策观察', '香港保险科技政策与合规观察', '2026-04-28', '保险科技平台需要同时关注效率、数据安全和合规要求。', '保险科技平台需要同时关注效率、数据安全和合规要求。

通过权限配置、操作留痕、数据隔离和审批流，企业可以在提升协作效率的同时保留管理可控性。', '', 4),
  ('roi', '经营分析', '保险经纪数字化 ROI 如何测算', '2026-04-18', 'ROI 测算应纳入人力节省、佣金对账效率、客户转化率和服务响应速度。', 'ROI 测算不应只看软件成本，还要纳入人力节省、佣金对账效率、客户转化率、保单续期管理和服务响应速度。

清晰的业务指标能帮助管理者判断数字化投入是否真正转化为团队增长。', '', 5)
on conflict (id) do nothing;
