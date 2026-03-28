import { createClient } from '@supabase/supabase-js';

// 1. 这里的 URL 必须和你后台显示的 API URL 完全一致！
const SUPABASE_URL = "https://pmynaqnqqzkgayonuykl.supabase.co"; 

// 2. 这里的 KEY 也必须复制你后台显示的 anon public key
const SUPABASE_ANON_KEY = "sb_publishable_QpWo8rzQ787kfIcAikF8IA_oXZyajSR";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);