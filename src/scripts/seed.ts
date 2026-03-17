/**
 * seed.ts — Populates the Payload CMS "home" page with reference content.
 *
 * Run: npm run seed
 *
 * - Safe to re-run: checks if a "home" page already exists and skips if found.
 * - Uses the Payload local API (no HTTP round-trip, no auth token needed).
 * - All content is sourced from /reference/pergroup-website.html.
 * - Data is stored in the `cms` Supabase schema (Payload-managed tables).
 */
import { getPayload } from 'payload'
import configPromise from '../../payload.config'

async function seed() {
  const payload = await getPayload({ config: configPromise })

  // Guard — skip if the home page already exists
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log('✓ Home page already exists — seed skipped.')
    console.log('  To re-seed, delete the "home" page in /admin first.')
    process.exit(0)
  }

  console.log('Seeding home page...')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      slug: 'home',
      blocks: [
        // ── 1. HERO ─────────────────────────────────────────────────────────
        {
          blockType: 'hero',
          eyebrow: 'Global Tech Innovation Ecosystem · 全球科技创新生态平台',
          headline: 'Make Innovation',
          headlineAccent: 'Open to Anyone,',
          headlineFaint: 'Anywhere.',
          chineseSubtitle: '科技创新 · 商业赋能 · 人文关怀',
          stats: [
            {
              number: '15+',
              label: 'Years Global Experience',
              chineseLabel: '全球产业链 · 创新链',
            },
            {
              number: '1,700+',
              label: 'Projects Worldwide',
              chineseLabel: '全球项目经验',
            },
            {
              number: '53+',
              label: 'Countries',
              chineseLabel: '国家',
            },
            {
              number: '200+',
              label: 'Partners',
              chineseLabel: '创新伙伴',
            },
          ],
          ctaButtons: [
            { label: 'Discover More', href: '#about', variant: 'fill' },
            { label: 'WeConnect Platform →', href: '/platform/spaces', variant: 'ghost' },
          ],
        },

        // ── 2. VALUES ───────────────────────────────────────────────────────
        {
          blockType: 'values',
          sectionLabel: 'Our Philosophy · 我们的哲学',
          headline: 'Core Philosophy',
          chineseHeadline: '四和五一',
          fourHarmoniesItems: [
            { chinese: '心灵的平和', english: 'Awakening Heart' },
            { chinese: '社会的和谐', english: 'Harmonious Society' },
            { chinese: '家庭的和睦', english: 'Amicable Family' },
            { chinese: '世界的和平', english: 'Peaceful World' },
          ],
          fiveUnitiesItems: [
            { chinese: '易', english: 'Changes' },
            { chinese: '医', english: 'Healthy' },
            { chinese: '爱', english: 'Love' },
            { chinese: '艺', english: 'Art' },
            { chinese: '义', english: 'Morality' },
          ],
          mottos: [
            {
              label: 'VALUES · 价值观',
              chinese: '喜乐，和平，公义',
              english: 'Joy · Peace · Justice',
            },
            {
              label: 'VISION · 愿景',
              chinese: '以商载道，共创共生',
              english: 'Business as a vehicle for values',
            },
            {
              label: 'MISSION · 使命',
              chinese: '商业最集中的地方\n也是善意最集中的地方',
              english: 'Where commerce is greatest, so too should be goodwill',
            },
          ],
        },

        // ── 3. ABOUT ────────────────────────────────────────────────────────
        {
          blockType: 'about',
          sectionLabel: 'Who We Are · 我们是谁',
          headline: 'A Network Built on',
          headlineAccent: 'Genuine Trust',
          body: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: 'PER GROUP has spent 15+ years weaving a bicultural network across 53 countries — connecting Chinese enterprises going global with world markets, and international companies entering Asia with local expertise.', version: 1 }],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: '108 co-creation partners serve 1,700+ international company branches, guided by genuine insight, not just connections.', version: 1 }],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          advantages: [
            {
              icon: '🔭',
              title: 'Multi-Dimensional Global View',
              description: '真知 + 多维度全球视野',
            },
            {
              icon: '🌐',
              title: 'Bicultural Service Network',
              description: '华人和当地人一起服务',
            },
            {
              icon: '🛡️',
              title: 'Ethics & Compliance',
              description: '职业操守和合规 · 高透明度',
            },
            {
              icon: '🤝',
              title: 'Full-Journey Support',
              description: '从构想到决策，全程陪伴',
            },
          ],
          globeStat: {
            number: '53+',
            label: 'COUNTRIES',
          },
        },

        // ── 4. SERVICES ─────────────────────────────────────────────────────
        {
          blockType: 'services',
          sectionLabel: 'What We Do · 服务内容',
          headline: 'End-to-End',
          headlineAccent: 'Global Services',
          services: [
            {
              number: '01',
              icon: '🔍',
              title: 'Market Intelligence',
              chineseTitle: '洞悉环境 · 商业设计',
              description: 'Industry analysis, competitor mapping, supply chain intelligence and commercial case development.',
            },
            {
              number: '02',
              icon: '📍',
              title: 'Location & Setup',
              chineseTitle: '选址服务 · 企业落地',
              description: 'Office, lab, and factory location across 53+ countries. Registration, banking, compliance setup.',
            },
            {
              number: '03',
              icon: '⚙️',
              title: 'Operations & HR',
              chineseTitle: '运营实施 · 人力资源',
              description: 'Project management, talent, international trade, finance, tax, supply chain localization.',
            },
            {
              number: '04',
              icon: '🛡️',
              title: 'IP, Standards & Compliance',
              chineseTitle: '知识产权 · 标准合规',
              description: 'CE, FDA, ISO, HSA certifications. Data cross-border and AI governance compliance packages.',
            },
            {
              number: '05',
              icon: '🌱',
              title: 'Green & ESG',
              chineseTitle: '绿色动力 · 双碳平台',
              description: 'Dual Carbon Green Energy Alliance. Energy audits, carbon neutrality solutions, ESG reporting.',
            },
            {
              number: '06',
              icon: '🚀',
              title: 'Innovation & Acceleration',
              chineseTitle: '科技创新 · 全球加速器',
              description: 'AI+Manufacturing, Digital Healthcare, Robotics programs. Incubators paired with global accelerators.',
            },
          ],
        },

        // ── 5. PLATFORM TEASER ──────────────────────────────────────────────
        {
          blockType: 'platformTeaser',
          sectionLabel: 'New Platform · 全新平台',
          headline: 'WeConnect —',
          headlineAccent: 'Global Demand & Supply Platform',
          body: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: 'AI-powered marketplace connecting enterprises with verified global partners across 53+ countries. Find office and lab spaces, secure funding, discover market entry pathways — all in one intelligent platform.', version: 1 }],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          features: [
            {
              title: 'Spaces — Offices, Labs, Factories · 办公室/实验室/厂房',
              description: 'Global space matching: Singapore, SEA, China, EU, Middle East',
              accentColor: 'green',
            },
            {
              title: 'Funding & Investment · 融资对接',
              description: 'VC, CVC, government grants — matched by stage and sector',
              accentColor: 'green',
            },
            {
              title: 'AI Intelligent Matching · AI智能匹配',
              description: 'Describe needs in plain language — AI finds the best partners instantly',
              accentColor: 'amber',
            },
          ],
          launchCtaLabel: 'Launch WeConnect Platform →',
        },

        // ── 6. CLIENTS ──────────────────────────────────────────────────────
        {
          blockType: 'clients',
          sectionLabel: 'Trusted By · 合作客户',
          clients: [
            { name: 'TCL' },
            { name: 'BAIDU 百度' },
            { name: 'MIDEA 美的' },
            { name: 'HUAWEI 华为' },
            { name: 'CATL 宁德时代' },
            { name: 'GENERAL ELECTRIC' },
            { name: 'NEWTOUCH 新致' },
            { name: 'ENLITISA 艾缇亚' },
            { name: 'NANO LABS' },
            { name: 'KANGABIO 康抗' },
            { name: 'ETHEALTHCARE' },
            { name: 'SOULSEMI' },
          ],
        },
      ],
    },
  })

  console.log('✓ Home page seeded successfully.')
  console.log('  Visit http://localhost:3000 to see the site.')
  console.log('  Visit http://localhost:3000/admin to edit content.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
