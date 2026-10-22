const { createClient } = require('@supabase/supabase-js');

let client = null;

function getSupabase() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('缺少环境变量 SUPABASE_URL 或 SUPABASE_ANON_KEY');
    }
    client = createClient(url, key);
  }
  return client;
}

module.exports = { getSupabase };
