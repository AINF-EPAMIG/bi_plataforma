import { NextResponse } from 'next/server';
import { testDatabase } from '@/lib/test-db';

export async function GET() {
  try {
    await testDatabase();
    return NextResponse.json({ success: true, message: 'Teste executado - verifique o console' });
  } catch (error) {
    console.error('Erro no teste:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}