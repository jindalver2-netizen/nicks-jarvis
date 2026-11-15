import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { provider, model, apiKey } = await req.json();
    const effectiveProvider = provider || process.env.AI_PROVIDER || 'nvidia';
    const effectiveModel = model || process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b';
    const effectiveKey = apiKey || (effectiveProvider === 'nvidia' ? process.env.NVIDIA_API_KEY : process.env.OPENAI_API_KEY);

    if (!effectiveKey) {
      return NextResponse.json({
        success: false,
        error: `No API key found for provider '${effectiveProvider}'. Please set key in .env.local`
      }, { status: 400 });
    }

    const startTime = Date.now();
    let res;

    if (effectiveProvider === 'nvidia') {
      res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveKey}`
        },
        body: JSON.stringify({
          model: effectiveModel,
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 10
        })
      });
    } else {
      res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveKey}`
        },
        body: JSON.stringify({
          model: effectiveModel || 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 10
        })
      });
    }

    const latency = Date.now() - startTime;

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json({
        success: false,
        status: res.status,
        error: errData.detail || errData.error?.message || res.statusText,
        latencyMs: latency
      });
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      provider: effectiveProvider,
      model: effectiveModel,
      latencyMs: latency,
      message: 'Connection verified successfully! AI Engine is responsive.'
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Connection test failed'
    }, { status: 500 });
  }
}
