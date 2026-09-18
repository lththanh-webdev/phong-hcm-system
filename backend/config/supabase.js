const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
// Tự động nhận Service Key hoặc Anon Key tùy theo cấu hình trên Render
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Lỗi: Thiếu biến môi trường SUPABASE_URL hoặc SUPABASE_KEY!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;