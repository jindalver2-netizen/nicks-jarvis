import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';

    // We store financial expenses in memories under category 'Financial Commitments' or a dedicated tag
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', userId)
      .eq('category', 'Financial Commitments')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Deterministic parsing of recorded amounts
    let totalSpent = 0;
    const categoryTotals: Record<string, number> = {};

    const parsedExpenses = (data || []).map((m) => {
      // Extract amount like ₹4,500 or 4500
      const match = m.content.match(/(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)/i);
      let amount = 0;
      if (match) {
        amount = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(amount)) {
          totalSpent += amount;
          const tag = m.tags[0] || 'General';
          categoryTotals[tag] = (categoryTotals[tag] || 0) + amount;
        }
      }
      return {
        ...m,
        amount
      };
    });

    return NextResponse.json({
      totalSpent,
      categoryTotals,
      expenses: parsedExpenses
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';

    const { amount, category, description, business } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const title = `${business || 'Factory'} Expense: ₹${amount} (${category || 'General'})`;
    const content = `AMOUNT: ₹${amount}\nCATEGORY: ${category || 'Electricity'}\nBUSINESS: ${business || 'Factory Operations'}\nNOTES: ${description || 'Logged via Jarvis'}`;

    const { data, error } = await supabase
      .from('memories')
      .insert({
        user_id: userId,
        category: 'Financial Commitments',
        title,
        content,
        tags: [category || 'Electricity', business || 'Factory Operations', 'expense'],
        importance: 'high',
        source: 'expense_tracker'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Recorded ₹${amount} under ${category || 'Electricity'}.`,
      expense: data
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
