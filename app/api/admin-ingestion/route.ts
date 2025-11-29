// app/api/dashboard/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const [
      { data: connectors },
      { data: runs },
      { data: logs },
      { data: uploads },
      { data: indexOps },
      { data: secrets },
      { data: throughput },
      { data: templates }
    ] = await Promise.all([
      supabase.from('data_connectors').select('*'),
      supabase.from('pipeline_runs').select('*'),
      supabase.from('ingestion_logs').select('*'),
      supabase.from('document_uploads').select('*'),
      supabase.from('index_operations').select('*'),
      supabase.from('api_secrets').select('*'),
      supabase.from('throughput_data').select('*'),
      supabase.from('connector_templates').select('*')
    ]);

    return NextResponse.json({
      connectors: connectors || [],
      runs: runs || [],
      logs: logs || [],
      uploads: uploads || [],
      indexOps: indexOps || [],
      secrets: secrets || [],
      throughput: throughput || [],
      templates: templates || []
    });
  } catch (error) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}