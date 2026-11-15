export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ExtractedAction {
  type: 'create_task' | 'create_reminder' | 'save_memory' | 'search_memory' | 'manage_list';
  params: Record<string, any>;
  confirmation_required?: boolean;
  confirmation_message?: string;
}

export interface AIResponse {
  reply: string;
  actions: ExtractedAction[];
  detected_language: 'en' | 'hi' | 'hinglish';
  model_used: string;
}

export class UniversalAIProvider {
  private provider: string;
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor() {
    this.provider = process.env.AI_PROVIDER || 'nvidia';
    
    if (this.provider === 'nvidia') {
      this.apiKey = process.env.NVIDIA_API_KEY || '';
      this.model = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b';
      this.baseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
    } else {
      // Default to OpenAI or OpenAI-compatible (Gemini endpoint)
      this.apiKey = process.env.OPENAI_API_KEY || '';
      this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      this.baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  async parseIntentAndExecute(
    userMessage: string, 
    conversationHistory: AIMessage[] = [],
    contextMemories: string[] = []
  ): Promise<AIResponse> {
    if (!this.isConfigured()) {
      return this.fallbackDeterministicParser(userMessage);
    }

    const systemPrompt = `You are Memorae, an elite Personal AI Second Brain assistant.
You understand English, Hindi, and Hinglish natively.
Current Local Timezone: Asia/Kolkata. Reference current date: ${new Date().toISOString()}.

User Context Memories:
${contextMemories.length > 0 ? contextMemories.join('\n') : 'No existing memories provided.'}

Your task:
1. Analyze the user message. Identify ALL user intents (could be multiple actions in one sentence).
2. Extract actionable tasks, persistent reminders, long-term memory to save, or list items.
3. Formulate a friendly, natural reply in the same language/tone as the user (English, Hindi, or Hinglish).
4. Output strict JSON matching this schema:
{
  "reply": "string (conversational response to the user)",
  "detected_language": "en" | "hi" | "hinglish",
  "actions": [
    {
      "type": "create_task" | "create_reminder" | "save_memory" | "search_memory" | "manage_list",
      "params": { ... }
    }
  ]
}

Action Param Schemas:
- create_task: { "title": string, "due_date"?: "YYYY-MM-DD", "due_time"?: "HH:MM", "priority": "low"|"medium"|"high"|"urgent", "category": string }
- create_reminder: { "title": string, "remind_at": "ISO-8601-String", "priority": "low"|"medium"|"high"|"urgent" }
- save_memory: { "category": "Personal"|"Business"|"People"|"Important Dates"|"Preferences"|"Ideas"|"Notes"|"Documents"|"Financial Commitments"|"Other", "title": string, "content": string, "tags": string[] }
- search_memory: { "query": string, "category"?: string }
- manage_list: { "list_name": string, "action": "add"|"remove"|"complete", "item_text": string }

Never invent missing critical dates. If ambiguous, ask politely in your reply and do not execute an incomplete action.
Return only valid JSON.`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-6),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.2,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        console.error(`AI API Error (${this.provider}): ${response.statusText} (${response.status})`);
        return this.fallbackDeterministicParser(userMessage);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      // Robust JSON extraction (handles raw JSON or markdown-fenced ```json ... ```)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          reply: parsed.reply || 'Understood and processed.',
          actions: parsed.actions || [],
          detected_language: parsed.detected_language || 'en',
          model_used: this.model
        };
      }

      return this.fallbackDeterministicParser(userMessage);
    } catch (err) {
      console.error('Error invoking AI Provider:', err);
      return this.fallbackDeterministicParser(userMessage);
    }
  }

  /**
   * Deterministic Fallback Parser: Works offline or when API keys are pending
   */
  private fallbackDeterministicParser(message: string): AIResponse {
    const lower = message.toLowerCase();
    const actions: ExtractedAction[] = [];
    let detected_language: 'en' | 'hi' | 'hinglish' = 'en';

    if (lower.includes('kal') || lower.includes('karna hai') || lower.includes('yaad')) {
      detected_language = 'hinglish';
    }

    // Check for reminder / call intent
    if (lower.includes('remind') || lower.includes('yaad') || lower.includes('call')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      actions.push({
        type: 'create_reminder',
        params: {
          title: message.replace(/(remind me to|yaad dilana|kal|tomorrow)/gi, '').trim(),
          remind_at: tomorrow.toISOString(),
          priority: 'medium'
        }
      });
    }

    // Check for memory intent
    if (lower.includes('remember') || lower.includes('yaad rakhna')) {
      const content = message.replace(/(remember that|remember|yaad rakhna ki|yaad rakhna)/gi, '').trim();
      actions.push({
        type: 'save_memory',
        params: {
          category: lower.includes('business') ? 'Business' : 'Personal',
          title: content.slice(0, 30) + '...',
          content: content,
          tags: ['captured-note']
        }
      });
    }

    return {
      reply: detected_language === 'hinglish'
        ? 'Aapka request process kar liya gaya hai aur system mein save ho gaya hai.'
        : 'I have processed and saved your request to your Second Brain.',
      actions,
      detected_language,
      model_used: 'deterministic-fallback'
    };
  }
}

export const aiProvider = new UniversalAIProvider();
