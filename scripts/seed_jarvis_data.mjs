// scripts/seed_jarvis_data.mjs
// Seeds realistic, rich dummy data for Nick's Jarvis Life OS & Factory System

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vxhjeeacqbkrbnrnzsgp.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_nPHLPApWVdNf_XUrpiuYHQ_kOQuJdNQ';
const USER_ID = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

async function seed() {
  console.log('🚀 Starting Nick\'s Jarvis comprehensive database seed for user:', USER_ID);

  // 1. User Preferences Verification / Update
  console.log('⚙️ Ensuring user preferences configured for Nick\'s Jarvis...');
  await supabase.from('user_preferences').upsert({
    user_id: USER_ID,
    theme: 'dark',
    ai_provider: 'nvidia',
    ai_model: 'nvidia/nemotron-3-ultra-550b-a55b',
    voice_transcription_lang: 'auto',
    dashboard_layout: {
      tasks: true,
      reminders: true,
      memories: true,
      briefing: true,
      factory: true,
      finances: true
    },
    settings: {
      assistant_name: "Nick's Jarvis",
      timezone: 'Asia/Kolkata',
      briefing_time: '08:00',
      low_energy_mode: false,
      factory_name: 'Pragati Industries & Gayatri Polymers'
    }
  }, { onConflict: 'user_id' });

  // 2. Clear old test entries if needed or keep existing
  // We insert curated realistic items

  // 3. SEED TASKS (Standard + No-Brainer structured breakdowns)
  console.log('📋 Seeding Tasks with No-Brainer step breakdowns & energy tags...');
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const tasksToSeed = [
    {
      user_id: USER_ID,
      title: 'Call transporter Ramesh for Ahmedabad 12-ton dispatch',
      category: 'Factory Operations',
      priority: 'urgent',
      due_date: todayStr,
      status: 'pending',
      timezone: 'Asia/Kolkata',
      description: `⚡ NO-BRAINER BREAKDOWN:
• WHAT TO DO: Call Ramesh Transporter (+91 98250 12345) and book a 12-ton open truck.
• HOW TO DO IT: Confirm loading time at 4:30 PM at Shed #2, freight rate agreed @ ₹14,500, driver LR copy to be sent on WhatsApp.
• WHEN TO DO IT: Before 3:00 PM today.
• DURATION: 5-min
• CONTEXT: Phone Call | Factory | High Priority
• ENERGY LEVEL: Low Energy`
    },
    {
      user_id: USER_ID,
      title: 'Inspect Extruder Die #2 temperature sensor calibration',
      category: 'Factory Operations',
      priority: 'high',
      due_date: todayStr,
      status: 'pending',
      timezone: 'Asia/Kolkata',
      description: `⚡ NO-BRAINER BREAKDOWN:
• WHAT TO DO: Check PID controller thermocouple reading on Extruder Line 2.
• HOW TO DO IT: Walk to control panel, observe digital readout (target 205°C ± 3°C). If fluctuating, ask maintenance fitter Dinesh to swap thermocouple probe.
• WHEN TO DO IT: Before 4:00 PM second shift start.
• DURATION: 10-min
• CONTEXT: Factory Floor
• ENERGY LEVEL: Medium Energy`
    },
    {
      user_id: USER_ID,
      title: 'Review GST R1 return draft before CA Sharma files',
      category: 'Wealth/Finance',
      priority: 'high',
      due_date: todayStr,
      status: 'pending',
      timezone: 'Asia/Kolkata',
      description: `⚡ NO-BRAINER BREAKDOWN:
• WHAT TO DO: Open Tally export on laptop and compare with CA Sharma's GST summary spreadsheet.
• HOW TO DO IT: Verify total outward taxable turnover (₹38.4 Lakh) and ensure RCM credit on freight is matched.
• WHEN TO DO IT: 7:30 PM evening quiet time.
• DURATION: 15-min
• CONTEXT: Laptop | Home | Finance
• ENERGY LEVEL: Medium Energy`
    },
    {
      user_id: USER_ID,
      title: 'Send WhatsApp PO for 5 MT HDPE Granules to Supreme Polymers',
      category: 'Business',
      priority: 'medium',
      due_date: tomorrowStr,
      status: 'pending',
      timezone: 'Asia/Kolkata',
      description: `⚡ NO-BRAINER BREAKDOWN:
• WHAT TO DO: Send formal Purchase Order to Rajesh Sharma for 5 MT HDPE Raffia Grade 010F18.
• HOW TO DO IT: Check quoted rate @ ₹94.50/kg + GST, delivery at Pragati plant by Thursday.
• WHEN TO DO IT: Tomorrow morning 10:30 AM.
• DURATION: 5-min
• CONTEXT: Phone Call | Travelling | Free Time
• ENERGY LEVEL: Low Energy`
    },
    {
      user_id: USER_ID,
      title: '15-Minute post-lunch brisk walk & hydration reset',
      category: 'Health',
      priority: 'medium',
      due_date: todayStr,
      status: 'completed',
      timezone: 'Asia/Kolkata',
      description: `⚡ NO-BRAINER BREAKDOWN:
• WHAT TO DO: Walk 1,500 steps outside the factory office lawn and drink 500ml water.
• HOW TO DO IT: Put phone on Do Not Disturb, step out, do 3 deep diaphragmatic breaths.
• WHEN TO DO IT: 2:30 PM post lunch.
• DURATION: 15-min
• CONTEXT: Health | Free Time
• ENERGY LEVEL: Low Energy`
    },
    {
      user_id: USER_ID,
      title: 'Study LangGraph Multi-Agent Orchestration Patterns',
      category: 'Learning',
      priority: 'low',
      due_date: tomorrowStr,
      status: 'pending',
      timezone: 'Asia/Kolkata',
      description: `⚡ NO-BRAINER BREAKDOWN:
• WHAT TO DO: Read LangGraph state machine guide on supervisor agent workflows.
• HOW TO DO IT: Open bookmark on tablet, take 3 bullet notes in Jarvis second brain.
• WHEN TO DO IT: Late night 10:00 PM.
• DURATION: 30-min
• CONTEXT: Laptop | Learning
• ENERGY LEVEL: High Energy`
    }
  ];

  for (const t of tasksToSeed) {
    const { data: existing } = await supabase.from('tasks').select('id').eq('user_id', USER_ID).eq('title', t.title).limit(1);
    if (!existing || existing.length === 0) {
      await supabase.from('tasks').insert(t);
    }
  }

  // 4. SEED REMINDERS (Upcoming, Overdue, and Recurring)
  console.log('⏰ Seeding Reminders (Asia/Kolkata time-aware)...');
  const now = new Date();
  
  // Reminder 1: Today in 45 minutes
  const r1Time = new Date(now.getTime() + 45 * 60 * 1000).toISOString();
  // Reminder 2: Today 8:30 PM IST (15:00 UTC)
  const r2Time = new Date();
  r2Time.setHours(20, 30, 0, 0);
  // Reminder 3: Overdue from 2 hours ago
  const overdueTime = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();

  const remindersToSeed = [
    {
      user_id: USER_ID,
      title: 'Evening Production & Machine Output Tally',
      description: 'Check Extrusion Line 1 and Line 2 net production meter before night supervisor handover.',
      remind_at: r1Time,
      timezone: 'Asia/Kolkata',
      priority: 'urgent',
      status: 'pending',
      notification_channel: 'in_app'
    },
    {
      user_id: USER_ID,
      title: 'Daily Cash Expense & Labour Overtime Sign-off',
      description: 'Review factory petty cash balance and verify Dinesh fitter overtime voucher.',
      remind_at: r2Time.toISOString(),
      timezone: 'Asia/Kolkata',
      priority: 'high',
      status: 'pending',
      notification_channel: 'in_app'
    },
    {
      user_id: USER_ID,
      title: 'Verify Gayatri Polymers batch dispatch challan #408',
      description: 'Check weighbridge slip against customer invoice for Surat dealer.',
      remind_at: overdueTime,
      timezone: 'Asia/Kolkata',
      priority: 'urgent',
      status: 'pending', // overdue
      notification_channel: 'in_app'
    }
  ];

  for (const r of remindersToSeed) {
    const { data: existing } = await supabase.from('reminders').select('id').eq('user_id', USER_ID).eq('title', r.title).limit(1);
    if (!existing || existing.length === 0) {
      await supabase.from('reminders').insert(r);
    }
  }

  // 5. SEED MEMORIES (External Brain Knowledge Base)
  console.log('🧠 Seeding Second Brain Memories across business, personal, CRM, finances...');
  const memoriesToSeed = [
    {
      user_id: USER_ID,
      category: 'Business',
      title: 'Pragati Industries — Extrusion Line 1 Specifications & Operating Parameters',
      content: `Plant: Pragati Industries (GIDC Vatva)
Equipment: 90mm Extruder Line 1 (Plastic Tape / Monofilament)
Optimal Operating Zones:
• Zone 1: 195°C | Zone 2: 205°C | Zone 3: 215°C | Die Head: 220°C
• Chilled water bath temp: 8°C - 10°C
• Output capacity: 180 kg/hour at 85% motor load
• Standard raw material ratio: 98% Virgin HDPE (010F18) + 2% UV White Masterbatch.
Emergency Contact for Spares: Dinesh Engineering (+91 94260 77112).`,
      tags: ['pragati-industries', 'extrusion', 'machines', 'sop', 'production'],
      importance: 'high',
      source: 'manual'
    },
    {
      user_id: USER_ID,
      category: 'People',
      title: 'Rajesh Sharma (Supreme Polymers, New Delhi) — Key Supplier Profile',
      content: `Role: Primary Raw Material Supplier (HDPE / LDPE / PP granules)
Location: Nehru Place & Connaught Place, New Delhi
Phone: +91 98110 33445 | Email: rajesh@supremepolymers.in
GSTIN: 07AAACS1234F1Z8
Payment Terms: Net 30 days. Agreed rebate of 1.5% if RTGS paid within 7 days.
Reliability: High quality consistency; always delivers within 48 hours of dispatch from Kandla port warehouse.
Personal Note: Likes Darjeeling black tea, prefers calls between 11 AM - 1 PM.`,
      tags: ['supplier', 'people-crm', 'delhi', 'raw-materials', 'payments'],
      importance: 'high',
      source: 'chat'
    },
    {
      user_id: USER_ID,
      category: 'People',
      title: 'Ankit Verma (Surat Agri Products) — Key Client Profile & Commitments',
      content: `Role: Bulk Distributor for Agro Shading Net & Tarpaulin
Location: Ring Road Textile Market, Surat, Gujarat
Phone: +91 98241 88990
Committed Order: 8 Metric Tons White 120 GSM Tarpaulin rolls by 22nd November.
Current Balance Receivable: ₹4,20,000 against Invoice #PI-2026-118 (Due date: 28th Nov).
Credit Terms: 21 days credit. Excellent payment track record over 3 years.`,
      tags: ['client', 'people-crm', 'surat', 'receivables', 'tarpaulin'],
      importance: 'high',
      source: 'chat'
    },
    {
      user_id: USER_ID,
      category: 'Financial Commitments',
      title: 'HDFC Machinery Term Loan EMI (Pragati Plant)',
      content: `Facility: Term Loan A/C #50200034918201 (HDFC Industrial Finance)
Monthly EMI Amount: ₹84,500
Due Date: 5th of every calendar month
Auto-debit from: Pragati Industries Current Account
Tenure Remaining: 28 months (Maturity: March 2029)
Collateral: Hypothecation of Extruder Line 1 & Line 2.`,
      tags: ['finance', 'emi', 'hdfc', 'loan', 'pragati-industries'],
      importance: 'critical',
      source: 'manual'
    },
    {
      user_id: USER_ID,
      category: 'Financial Commitments',
      title: 'Vendor Petty Cash Expense — Factory Maintenance & Logistics',
      content: `Expense Entry: ₹12,850 recorded for weekly maintenance and transporter advances.
Breakdown:
• Hydraulic Oil ISO VG 68 (20L): ₹4,200
• Labour overtime for late loading: ₹1,800
• Local tempo freight advance: ₹1,500
• Electrical spares & MCB replacements: ₹5,350
Approved by Nick on 15th Nov 2026.`,
      tags: ['factory-expense', 'petty-cash', 'maintenance', 'gst'],
      importance: 'normal',
      source: 'factory_logger'
    },
    {
      user_id: USER_ID,
      category: 'Ideas',
      title: '40kW Rooftop Solar Installation Feasibility for Factory Shed',
      content: `Concept: Install 40kW on-grid solar system on Pragati Shed #1 (Roof area ~4,200 sq ft).
Financials:
• Estimated Capex: ₹18.5 Lakhs (inclusive of net metering and bi-directional meter).
• Average monthly electricity bill currently: ₹95,000 (Torrent Power HT Tariff).
• Expected solar generation: 4,800 kWh/month => Savings: ~₹42,000/month.
• Payback period: 3.6 years.
Next Step: Solicit 3 quotes from Tata Power Solar and Waaree Energies.`,
      tags: ['ideas', 'solar', 'capex', 'cost-cutting', 'factory'],
      importance: 'high',
      source: 'manual'
    },
    {
      user_id: USER_ID,
      category: 'Personal',
      title: 'Experience: Overcoming Procrastination on Complex Financial Reviews',
      content: `SITUATION: Felt acute procrastination and cognitive resistance regarding reviewing the 6-month factory balance sheet and creditor aging report. Felt sluggish and avoided starting for 3 days.
ACTION TAKEN: Switched Jarvis to Low-Energy Mode. Committed to a micro-action of just opening the PDF and reading the top 3 creditor totals with a 5-minute timer.
OUTCOME: The initial resistance disappeared after 2 minutes. Once the context was loaded in memory, momentum took over and the complete creditor reconciliation was completed in 35 minutes, uncovering a ₹65,000 double billing by a packaging vendor.
REALIZATION: The friction is never the work itself—it is the mental anticipation. Lowering the activation energy to 5 minutes always works.`,
      tags: ['experience', 'mood-to-action', 'procrastination', 'mindset', 'productivity'],
      importance: 'high',
      source: 'experience_logger'
    },
    {
      user_id: USER_ID,
      category: 'Preferences',
      title: 'Daily Workflow & Communication Preferences',
      content: `Nick\'s Operating Protocol:
1. Morning briefing must be concise, bulleted, and delivered at 08:00 AM IST.
2. Prioritize factory dispatch and cash flow issues above speculative tasks.
3. Natural language commands in both English and Hinglish (e.g. "Rajesh ko phone karna hai 3 baje", "Petty cash entry karo ₹2500").
4. Never assume or make external network calls outside verified safe boundaries.
5. In low-energy states, present only 5-minute single-step tasks.`,
      tags: ['preferences', 'jarvis-rules', 'habits', 'operating-system'],
      importance: 'critical',
      source: 'system'
    }
  ];

  for (const m of memoriesToSeed) {
    const { data: existing } = await supabase.from('memories').select('id').eq('user_id', USER_ID).eq('title', m.title).limit(1);
    if (!existing || existing.length === 0) {
      await supabase.from('memories').insert(m);
    }
  }

  // 6. SEED NOTIFICATIONS (In-App Notification Center)
  console.log('🔔 Seeding In-App Notifications...');
  const notificationsToSeed = [
    {
      user_id: USER_ID,
      title: 'Jarvis Executive Briefing Ready',
      message: 'Good morning Nick. Today you have 4 urgent factory tasks, 2 supplier follow-ups with Rajesh Sharma, and 1 loan EMI check.',
      type: 'briefing',
      is_read: false
    },
    {
      user_id: USER_ID,
      title: 'Reminder: Extruder Line 2 Inspection',
      message: 'Check Extruder Die #2 temperature sensor calibration before 4:00 PM second shift.',
      type: 'reminder',
      is_read: false
    },
    {
      user_id: USER_ID,
      title: 'System Online: NVIDIA Nemotron 550B',
      message: 'Nick\'s Jarvis neural engine active with persistent zero-data-loss Supabase database.',
      type: 'system',
      is_read: true
    }
  ];

  for (const n of notificationsToSeed) {
    const { data: existing } = await supabase.from('notifications').select('id').eq('user_id', USER_ID).eq('title', n.title).limit(1);
    if (!existing || existing.length === 0) {
      await supabase.from('notifications').insert(n);
    }
  }

  // 7. SEED LISTS (Areas and Project Organization)
  console.log('📁 Seeding Areas & Project Lists...');
  const listsToSeed = [
    {
      user_id: USER_ID,
      name: 'Factory Operations (Pragati & Gayatri)',
      description: 'Extrusion, raw material inventory, dispatch logistics, maintenance logs',
      icon: 'factory',
      color: '#06b6d4'
    },
    {
      user_id: USER_ID,
      name: 'Business & People CRM',
      description: 'Suppliers, dealers, client commitments, freight transporters',
      icon: 'users',
      color: '#3b82f6'
    },
    {
      user_id: USER_ID,
      name: 'Wealth, Finance & GST',
      description: 'Cash flows, term loans, vendor payments, GST R1/3B filings',
      icon: 'dollar-sign',
      color: '#10b981'
    },
    {
      user_id: USER_ID,
      name: 'Personal Life & Health',
      description: 'Workouts, sleep, family commitments, daily habits',
      icon: 'heart',
      color: '#ec4899'
    },
    {
      user_id: USER_ID,
      name: 'AI Engineering & Learning',
      description: 'Agentic workflows, LangGraph, prompt architecture, full-stack tech',
      icon: 'cpu',
      color: '#8b5cf6'
    }
  ];

  for (const l of listsToSeed) {
    const { data: existing } = await supabase.from('lists').select('id').eq('user_id', USER_ID).eq('name', l.name).limit(1);
    if (!existing || existing.length === 0) {
      await supabase.from('lists').insert(l);
    }
  }

  console.log('✅ DATABASE SEED COMPLETE: All areas, tasks, reminders, memories, and notifications populated successfully!');
}

seed().catch((err) => {
  console.error('❌ SEED ERROR:', err);
  process.exit(1);
});
