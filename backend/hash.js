const bcrypt = require('bcrypt');
const pool = require('./config/db');

async function updateAdminPassword() {
    try {
        const username = 'admin';
        const rawPassword = 'admin123';
        const saltRounds = 10;

        // Tiến hành băm mật khẩu chuẩn bcrypt
        const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
        console.log('Mật khẩu đã băm thành công:', hashedPassword);

        // Cập nhật vào cơ sở dữ liệu
        const query = `
            UPDATE users 
            SET password_hash = $1 
            WHERE username = $2
        `;
        
        const result = await pool.query(query, [hashedPassword, username]);
        
        if (result.rowCount > 0) {
            console.log('✅ Đã cập nhật mật khẩu mới cho tài khoản admin thành công!');
        } else {
            console.log('⚠️ Không tìm thấy tài khoản admin trong database để cập nhật.');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Lỗi khi băm hoặc cập nhật mật khẩu:', err.message);
        process.exit(1);
    }
}

updateAdminPassword();