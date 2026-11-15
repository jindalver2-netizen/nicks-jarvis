import { NextRequest, NextResponse } from 'next/server';

export interface BrainDumpItem {
  id: string;
  original_text: string;
  title: string;
  type: 'task' | 'reminder' | 'idea' | 'project' | 'commitment' | 'expense' | 'journal' | 'question';
  area: 'Personal Life' | 'Health' | 'Wealth' | 'Learning' | 'Passive Income' | 'Pragati Industries' | 'Gayatri Industries' | 'DS Polymers' | 'Factory Operations' | 'Ideas';
  suggested_date?: string;
  suggested_time?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  context_tags: string[];
  actionable_steps?: {
    what: string;
    how: string;
    when: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const { dumpText } = await req.json();

    if (!dumpText || typeof dumpText !== 'string') {
      return NextResponse.json({ error: 'Brain dump text is required' }, { status: 400 });
    }

    const provider = process.env.AI_PROVIDER || 'nvidia';
    const apiKey = provider === 'nvidia' ? process.env.NVIDIA_API_KEY : process.env.OPENAI_API_KEY;
    const model = provider === 'nvidia' 
      ? (process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b')
      : (process.env.OPENAI_MODEL || 'gpt-4o-mini');
    const baseUrl = provider === 'nvidia'
      ? 'https://integrate.api.nvidia.com/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    const systemPrompt = `You are Nick's Jarvis Brain Dump Classifier.
The user will provide a stream-of-consciousness brain dump in English, Hindi, or Hinglish.
Analyze the entire text and split it into distinct, actionable items.

For each item, classify:
- "title": Clean, concise title
- "original_text": The segment from user message
- "type": "task" | "reminder" | "idea" | "project" | "commitment" | "expense" | "journal" | "question"
- "area": "Personal Life" | "Health" | "Wealth" | "Learning" | "Passive Income" | "Pragati Industries" | "Gayatri Industries" | "DS Polymers" | "Factory Operations" | "Ideas"
- "suggested_date": "YYYY-MM-DD" if mentioned or implied, else null
- "suggested_time": "HH:MM" if mentioned, else null
- "priority": "low" | "medium" | "high" | "urgent"
- "context_tags": array of tags like ["free-time", "phone-call", "factory", "5-min"]
- "actionable_steps": { "what": string, "how": string, "when": string } (for tasks)

Output strict JSON:
{
  "summary": "Brief summary of what was parsed",
  "items": [
    ...
  ]
}`;

    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: dumpText }
        ],
        temperature: 0.2,
        max_tokens: 2500
      })
    });

    if (!res.ok) {
      console.error('Brain dump classifier error:', res.statusText);
      return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
    }

    const data = await res.json();
    const content = data.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Assign unique client-side IDs
      const itemsWithIds = (parsed.items || []).map((item: any, idx: number) => ({
        ...item,
        id: `dump_item_${Date.now()}_${idx}`
      }));

      return NextResponse.json({
        summary: parsed.summary || 'Analyzed brain dump successfully.',
        items: itemsWithIds,
        original_dump: dumpText
      });
    }

    return NextResponse.json({ error: 'Could not structure brain dump' }, { status: 500 });
  } catch (err: any) {
    console.error('Brain dump error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
