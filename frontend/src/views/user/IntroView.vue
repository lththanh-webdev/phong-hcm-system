<template>
  <div class="intro-page">
    <!-- HERO SECTION: Tiêu đề & Nút tương tác -->
    <div class="hero-section">
      <div class="hero-glow"></div>
      <div class="hero-badge animate-fade-down">CỔNG THÔNG TIN ĐƠN VỊ</div>
      <h2 class="section-title animate-fade-in">GIỚI THIỆU PHÒNG HỒ CHÍ MINH SỐ</h2>
      <p class="section-desc animate-fade-up">
        Không gian văn hóa, tư tưởng &amp; nền tảng chuyển đổi số chính trị Tiểu đoàn Phòng không 16
      </p>
    </div>

    <!-- NỘI DUNG CHÍNH: Lưới 4 Thẻ -->
    <div class="intro-grid">
      <!-- Thẻ 1: Mục đích & Ý nghĩa -->
      <div class="intro-card">
        <div class="card-icon-wrapper">
          <span class="card-icon">🎯</span>
        </div>
        <h3 class="card-title">Mục Đích &amp; Ý Nghĩa</h3>
        <p class="card-text">
          Phòng Hồ Chí Minh số là thiết chế văn hóa hiện đại ứng dụng công nghệ thông tin trong quân đội, nhằm đổi mới mạnh mẽ hình thức giáo dục chính trị, tư tưởng, truyền thống. Tạo môi trường thuận lợi để cán bộ, chiến sĩ học tập, nghiên cứu tư tưởng, đạo đức, phong cách Hồ Chí Minh mọi lúc, mọi nơi trên mạng nội bộ đơn vị.
        </p>
      </div>

      <!-- Thẻ 2: Chức Năng & Nhiệm Vụ -->
      <div class="intro-card">
        <div class="card-icon-wrapper">
          <span class="card-icon">⚡</span>
        </div>
        <h3 class="card-title">Chức Năng &amp; Nhiệm Vụ</h3>
        <ul class="card-list">
          <li>
            <span class="bullet-dot"></span>
            <div><strong>Lưu trữ số:</strong> Cung cấp kho tư liệu, sách báo, văn kiện Đảng và hình ảnh truyền thống trực tuyến.</div>
          </li>
          <li>
            <span class="bullet-dot"></span>
            <div><strong>Giáo dục chính trị:</strong> Tuyên truyền các ngày lễ lớn, gương điển hình tiên tiến, phong trào thi đua quyết thắng.</div>
          </li>
          <li>
            <span class="bullet-dot"></span>
            <div><strong>Sinh hoạt tư tưởng:</strong> Tổ chức các hoạt động trắc nghiệm tìm hiểu kiến thức, nghe ca khúc cách mạng và giao lưu văn hóa lành mạnh.</div>
          </li>
        </ul>
      </div>

      <!-- Thẻ 3: Truyền Thống Đơn Vị -->
      <div class="intro-card featured-card">
        <div class="card-icon-wrapper">
          <span class="card-icon">⭐</span>
        </div>
        <h3 class="card-title">Truyền Thống Tiểu Đoàn PK 16</h3>
        <p class="card-text highlight-slogan">
          "ĐOÀN KẾT HIỆP ĐỒNG, LẬP CÔNG TẬP THỂ"
        </p>
        <p class="card-text">
          Trải qua quá trình xây dựng, chiến đấu và trưởng thành, Tiểu đoàn Phòng không 16 luôn giữ vững và phát huy truyền thống "Trung thành vô hạn, chủ động sáng tạo, đoàn kết hiệp đồng, quyết chiến quyết thắng", hoàn thành xuất sắc mọi nhiệm vụ huấn luyện, sẵn sàng chiến đấu bảo vệ vững chắc bầu trời Tổ quốc.
        </p>
      </div>

      <!-- Thẻ 4: Định Hướng Chuyển Đổi Số -->
      <div class="intro-card">
        <div class="card-icon-wrapper">
          <span class="card-icon">🚀</span>
        </div>
        <h3 class="card-title">Định Hướng Chuyển Đổi Số</h3>
        <p class="card-text">
          Đẩy mạnh ứng dụng công nghệ số trong công tác Đảng, công tác chính trị; xây dựng môi trường văn hóa quân sự phong phú, lành mạnh, đáp ứng yêu cầu xây dựng đơn vị vững mạnh toàn diện "Mẫu mực, tiêu biểu" trong tình hình mới.
        </p>
      </div>
    </div>

    <!-- KHU VỰC 6 MẢNG ẢNH TRƯNG BÀY PHÒNG HỒ CHÍ MINH SỐ -->
    <div class="exhibition-section">
      <div class="section-header-center">
        <span class="sub-badge">KHÔNG GIAN TRƯNG BÀY SỐ</span>
        <h3 class="exhibition-main-title">6 Mảng Ảnh Phòng Hồ Chí Minh</h3>
        <p class="exhibition-sub-desc">Hệ thống tư liệu trực quan giáo dục truyền thống, tư tưởng và đạo đức cách mạng</p>
      </div>

      <div class="exhibition-grid">
        <div 
          v-for="(panel, index) in exhibitionPanels" 
          :key="index" 
          class="exhibition-card"
        >
          <div class="exhibition-card-top">
            <span class="panel-number">0{{ index + 1 }}</span>
            <span class="panel-tag">Tư liệu số</span>
          </div>
          <h4 class="panel-title">{{ panel.title }}</h4>
          <p class="panel-desc">{{ panel.shortDesc }}</p>
          <button class="btn-view-detail" @click="handleViewPanel(panel)">
            <span>Xem nội dung chi tiết</span>
            <span class="arrow-icon">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- HỆ THỐNG MODAL HIỆN ĐẠI CHO CHI TIẾT MẢNG ẢNH -->
    <transition name="modal-modern">
      <div v-if="showAlert" class="modal-overlay" @click.self="closeAlert">
        <div class="modal-container panel-detail-container">
          <div class="alert-glow"></div>
          
          <button class="modal-close-btn" @click="closeAlert">✕</button>

          <!-- Header Modal -->
          <div class="panel-modal-header">
            <span class="panel-modal-badge">TƯ LIỆU PHÒNG HỒ CHÍ MINH SỐ</span>
            <h3 class="panel-modal-title">{{ currentPanel.title }}</h3>
          </div>

          <!-- Nội dung chia đôi thông minh: Ảnh minh họa + Văn bản chi tiết -->
          <div class="panel-modal-body">
            <!-- Cột Trái: Hình ảnh & Chú thích -->
            <div class="panel-media-column">
              <div class="panel-image-wrapper">
                <img :src="currentPanel.image" :alt="currentPanel.title" class="panel-featured-img" />
                <div class="image-caption-overlay">
                  <span class="caption-icon">📷</span>
                  <span>{{ currentPanel.imageCaption }}</span>
                </div>
              </div>
            </div>

            <!-- Cột Phải: Nội dung văn bản chi tiết cuộn mượt mà -->
            <div class="panel-text-column">
              <div class="content-prose" v-html="currentPanel.fullContent"></div>
            </div>
          </div>

          <div class="alert-actions">
            <button class="btn-alert-confirm" @click="closeAlert">Đã nghiên cứu / Đóng</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'IntroView',
  data() {
    return {
      showAlert: false,
      currentPanel: {
        title: '',
        shortDesc: '',
        image: '',
        imageCaption: '',
        fullContent: ''
      },
      exhibitionPanels: [
        {
          title: 'Đảng cộng sản Việt Nam, người tổ chức và lãnh đạo mọi thắng lợi của cách mạng Việt Nam.',
          shortDesc: 'Khẳng định vai trò lãnh đạo tuyệt đối, toàn diện của Đảng trong suốt chiều dài lịch sử đấu tranh và xây dựng đất nước.',
          image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop',
          imageCaption: 'Đại hội Đại biểu toàn quốc của Đảng - Mốc son lịch sử quang vinh',
          fullContent: `
            Thưa toàn thể các đồng chí! 
Những năm cuối thế kỷ XIX, đầu thế kỷ XX thực dân Pháp thực hiện các chính sách thực dân hà khắc, biến nước ta từ một nước phong kiến độc lập thành một nước thuộc địa nửa phong kiến, xã hội Việt Nam tồn tại nhiều mâu thuẫn gay gắt. Hàng loạt phong trào yêu nước theo các khuynh hướng khác nhau liên tiếp nổ ra tiêu biểu là phong trào Cần Vương do vua Hàm Nghi và Tôn Thất Thuyết khởi xướng, phong trào Đông Du của Phan Bội Châu; phong trào cải cách của Phan Chu Trinh; … các cuộc đấu tranh giải phóng dân tộc tuy diễn ra quyết liệt, song cuối cùng đều bị thất bại vì thiếu một đường lối cứu nước đúng đắn, thiếu một tổ chức lãnh đạo có khả năng tập hợp sức mạnh của toàn dân tộc. 
(Chính vì lý do đó nên…)
(Hình ảnh) Đảng Cộng sản Việt Nam ra đời ngày 03/02/1930 tại Cửu Long (Hương Cảng, Trung Quốc), dưới sự chủ trì của đồng chí Nguyễn Ái Quốc, trên cơ sở hợp nhất ba tổ chức cộng sản là: Đông Dương Cộng sản Đảng, An Nam Cộng sản Đảng và Đông Dương Cộng sản Liên đoàn. Sự ra đời của Đảng Cộng sản Việt Nam đánh dấu bước ngoặt lịch sử của cách mạng Việt Nam. Từ đây cách mạng Việt Nam đã có một chính Đảng lãnh đạo, mà tổ chức đó là người đại diện, bảo vệ lợi ích của giai cấp công nhân, nông dân và các tầng lớp nhân dân lao động khác. 
Thưa toàn thể các đồng chí!
* Bên trái của mảng ảnh là lá cờ đỏ sao vàng nằm gọn trong biểu tượng “búa- liềm”, “lưỡi liềm” là đại diện cho giai cấp nông dân, “búa” đại diện cho giai cấp công nhân, thể hiện rõ Đảng Cộng sản Việt Nam là đội tiên phong của giai cấp công nhân, đồng thời cũng là đội tiên phong của nhân dân lao động và của dân tộc Việt Nam. Đây cũng là bức ảnh thể hiện nét văn hóa của dân tộc Việt Nam, đất nước của sự phát triển đi lên từ cây lúa nước, sự trường tồn, anh dũng, trung kiên của dân tộc bằng những thắng lợi vĩ đại dưới sự lãnh đạo của Đảng.
Ngay sau khi thành lập ngày 03/2/1930, Cương lĩnh đầu tiên của Đảng đã chỉ rõ nhiệm vụ chiến lược: “Đánh đổ ách thống trị của đế quốc và tay sai, giành độc lập dân tộc và dân chủ cho nhân dân”. Khẳng định đường lối đúng đắn đó, Cao trào Xô Viết - Nghệ Tĩnh (1930 - 1931), mở đầu bằng cuộc biểu tinh ngày 01/5/1930, đã trở thành mốc son chói lọi. Dù chỉ tồn tại 7 tháng, đây là mô hình Nhà nước công - nông đầu tiên trong lịch sử và là cuộc tổng diễn tập đầu tiên cho Cách mạng tháng Tám.
*Trải qua các cuộc diễn tập chiến lược, chỉ sau 15 năm thành lập, Đảng ta đã chớp thời cơ làm nên cuộc cách mạng long trời lở đất.
Cuộc Tổng khởi nghĩa Tháng Tám năm 1945 thần tốc trong 2 tuần lễ (từ 14/8 đến 28/8/1945) đã giành chính quyền trọn vẹn về tay nhân dân, khẳng định nghệ thuật chỉ đạo tài tình của Đảng. Để rồi vào ngày 02/9/1945, tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc bản “Tuyên ngôn độc lập”, khai sinh nước Việt Nam Dân chủ Cộng hòa, mở ra kỷ nguyên độc lập, tự do cho dân tộc.
*Giữ vững thành quả cách mạng, trước dã tâm xâm lược lần thứ hai của thực dân Pháp, Đảng và Bác Hồ tiếp tục chèo lái con thuyền cách mạng bằng thiên tài quân sự xuất sắc.
Mùa Thu năm 1953, tại bản Tỉn Keo, Việt Bắc, Chủ tịch Hồ Chí Minh đã chỉ đạo chiến lược bẻ gãy Kế hoạch Navarre của địch: “Địch tập trung quân cơ động để tạo thành sức mạnh! Không sợ! Ta buộc chúng phải phân tán thì sức mạnh đó không còn!”. Tư tưởng ấy mở đầu cho Cuộc tiến công chiến lược Đông - Xuân 1953 - 1954, mà đỉnh cao là Chiến thắng lịch sử Điện Biên Phủ ngày 07/5/1954 lừng lẫy năm châu, chấn động địa cầu. Khúc tráng ca “Năm mươi sáu ngày đêm, khoét núi, ngủ hầm, mưa dầm, cơm vắt” đã buộc Pháp phải ký Hiệp định Giơ-ne-vơ, chấm dứt chủ nghĩa thực dân cũ tại Đông Dương.
*Nối tiếp trang sử vàng, cuộc kháng chiến chống Mỹ cứu nước của dân tộc ta đã khắc ghi những mốc son quyết định bằng sức mạnh hiệp đồng tổng lực.
Chiến thắng vang dội của Chiến dịch Tây Nguyên (04/3 - 03/4/1975) đã tạo bước ngoặt chiến lược, mở màn cho Chiến dịch Hồ Chí Minh lịch sử. Từ ngày 26 đến ngày 30/4/1975, các cánh quân giải phóng tiến vào Sài Gòn; đúng 11 giờ 30 phút ngày 30/4/1975, cờ đại thắng tung bay trên nóc Dinh Độc Lập, miền Nam hoàn toàn giải phóng, non sông nối liền một dải
Các đồng chí thân mến!
* Trải qua quá trình 96 năm xây dựng, chiến đấu và trưởng thành Đảng ta đã thể hiện rõ vai trò của người cầm lái, sáng suốt đưa con thuyền cách mạng Việt Nam đi từ thắng lợi này đến thắng lợi khác, được thể hiện đậm nét qua những sự kiện chói lọi trên đây, tiêu biểu là:
- 1930 - 1931 Đảng lãnh đạo cao trào cách mạng Xô Viết Nghệ Tĩnh.
- 19/8/1945 Lãnh đạo toàn dân tổng khởi nghĩa làm Cách Mạng Tháng Tám thành công, lập nên nước Việt Nam Dân Chủ Cộng Hòa, Nhà nước công nông đầu tiên ở Đông Nam Á.
- 5/1954 Chiến thắng Điện Biên Phủ; Kháng chiến chống thực dân Pháp thắng lợi. Miền Bắc được hoàn toàn giải phóng.
- 4/1975 Đảng lãnh đạo cuộc kháng chiến chống Mỹ cứu nước thành công, Đất nước hoàn toàn thống nhất.
- 12/1986 Đại Hội Đại Biểu Lần Thứ VI Của Đảng 
“Hoạch định đường lối đổi mới, khởi xướng công cuộc đổi mới, tạo ra bước ngoặt trong sự nghiệp xây dựng CNXH ở Việt Nam”
* Nhân dịp kỷ niệm 30 năm ngày thành lập Đảng, Chủ tịch Hồ Chí Minh đã khẳng định: “Ngoài lợi ích của nhân dân, Đảng ta không có lợi ích gì khác. Vì vậy mà Đảng ta được dân tin, dân phục, dân yêu, Ngày nay, nhiệm vụ của Đảng ta là lãnh đạo quần chúng đánh thắng tình trạng nghèo nàn và lạc hậu, xây dựng đời sống ấm no sung sướng cho nhân dân. Như thế là xây dựng chủ nghĩa xã hội”, đã trở thành mệnh lệnh cho toàn Đảng, toàn quân và toàn dân ta tiến bước.
* Kính thưa các đồng chí! Sức mạnh của Đảng hôm nay được đúc kết từ trí tuệ và sự hy sinh anh dũng của các thế hệ lãnh đạo tiền bối. Sau đây là chân dung Chủ tịch Hồ Chí Minh vĩ đại và các đồng chí Tổng Bí thư của Đảng qua các thời kỳ:
Chủ tịch Hồ Chí Minh (1890 - 1969): Quê xã Kim Liên, Nam Đàn, Nghệ An. Người sáng lập Đảng; giữ chức Chủ tịch Đảng giai đoạn 1951 - 1956 và 1960 - 1969. Người trực tiếp đảm nhiệm cương vị Tổng Bí thư từ tháng 10/1956 đến tháng 9/1960.
Đồng chí Trần Phú (1904 - 1931): Ông là Tổng Bí thư đầu tiên của Đảng (10/1930 - 4/1931), hy sinh anh dũng ngày 6/9/1931 với lời nhắn nhủ bất hủ: “Hãy giữ vững chí khí chiến đấu”.
Đồng chí Lê Hồng Phong (1902 - 1942):  Ông làm Tổng Bí thư từ tháng 3/1935 đến tháng 10/1936 
Đồng chí Hà Huy Tập (1902 - 1941): Ông làm Tổng Bí thư từ tháng 10/1936 đến tháng 3/1938
Đồng chí Nguyễn Văn Cừ (1912 - 1941):  Ông giữ chức Tổng Bí thư từ tháng 3/1938 đến tháng 1/1940 
Đồng chí Trường Chinh (1907 - 1988): Ông là Tổng Bí thư trong hai giai đoạn (5/1941 - 10/1956 và 7/1986 - 12/1986)
Đồng chí Lê Duẩn (1907 - 1986): Ông giữ cương vị Tổng Bí thư lâu nhất lịch sử Đảng gần 26 năm (9/1960 - 7/1986)
Đồng chí Nguyễn Văn Linh (1915 - 1998): Ông làm Tổng Bí thư từ tháng 12/1986 đến tháng 6/1991
Đồng chí Đỗ Mười (1917 - 2018): Ông giữ chức Tổng Bí thư từ tháng 6/1991 đến tháng 12/1997
Đồng chí Lê Khả Phiêu (1931 - 2020): Ông làm Tổng Bí thư từ tháng 12/1997 đến tháng 4/2001. 
Đồng chí Nông Đức Mạnh (Sinh năm 1940): Ông làm Tổng Bí thư 2 khóa liên tục (4/2001 - 1/2011)
Tổng Bí thư Nguyễn Phú Trọng (1944 - 2024): Ông giữ cương vị Tổng Bí thư từ tháng 1/2011 đến năm 2024
*Thưa toàn thể các đồng chí, tính đến nay, Đảng ta đã tổ chức thành công XIV lần Đại hội, kể từ lần đầu tiên vào tháng 3/1935. Gần nhất là Đại hội đại biểu toàn quốc lần thứ XIV, diễn ra từ ngày 20 đến ngày 23/1/2026 tại Thủ đô Hà Nội. 	*Kế thừa xuất sắc sự nghiệp cách mạng vẻ vang, trong kỷ nguyên vươn mình của dân tộc, toàn Đảng, toàn quân và toàn dân ta đặt trọn niềm tin vào người đứng đầu trong Đại hội Đảng lần thứ XIV
Đồng chí Tổng Bí thư Tô Lâm sinh tại Hưng Yên, là Giáo sư, Tiến sĩ Luật học.
Ngày 3/8/2024, đồng chí được bầu giữ chức Tổng Bí thư khóa XIII.
Ngày 23/1/2026, tại Đại hội XIV, đồng chí tiếp tục được tín nhiệm bầu giữ chức Tổng Bí thư khóa XIV. Tại Kỳ họp thứ Nhất, Quốc hội khóa XVI, với tỷ lệ tán thành tuyệt đối 100%, đồng chí Tô Lâm được bầu giữ chức Chủ tịch nước Cộng hòa xã hội chủ nghĩa Việt Nam nhiệm kỳ 2026 - 2031.
Kính thưa các đồng chí! Bước ra khỏi khói lửa chiến tranh, dưới sự lãnh đạo của Đảng, sự nghiệp Đổi mới đất nước từ năm 1986 đã đem lại những thành tựu có ý nghĩa lịch sử sâu sắc:
Về kinh tế - nông nghiệp: Việt Nam từ một nước thiếu lương thực, công nghiệp thô sơ, nay đã cơ bản cơ giới hóa hiện đại, trở thành quốc gia xuất khẩu gạo đứng thứ 2 thế giới chỉ sau Ấn Độ.
Về năng lượng: Đa dạng hóa mạnh mẽ các nguồn năng lượng sạch. Hệ thống điện gió phát triển vượt bậc với hơn 140 nhà máy điện gió, tổng công suất vận hành thương mại đạt hơn 6000 Megawatt, bảo đảm an ninh năng lượng quốc gia.
Về hạ tầng giao thông: Tuyến đường cao tốc Hà Nội - Lào Cai dài 265 km hiện đại, tạo động lực mạnh mẽ phát triển kinh tế vùng chiến lược Tây Bắc. Cùng với tuyến metro Bến Thành - Suối Tiên vừa được đưa vào hoạt động năm 2025 đã tạo bước chuyển lớn cho hệ thống giao thông thành phố. Góp phần phát triển kinh tế khu vực.
Về chiến lược biển: Ngành Dầu khí Việt Nam chủ động hội nhập kinh tế quốc tế, khẳng định vai trò trụ cột kinh tế gắn liền với bảo vệ chủ quyền, quyền chủ quyền và quyền tài phán trên Biển Đông.
Kính thưa toàn thể các đồng chí!
*Kế thừa những thành tựu của 40 năm đổi mới, Đại hội đại biểu toàn quốc lần thứ XIV của Đảng đã vạch ra mục tiêu chiến lược toàn diện cho chặng đường tiếp theo.
‘‘Giữ vững môi trường hoà bình, ổn định; phát triển nhanh, bền vững đất nước; cải thiện và nâng cao toàn diện đời sống nhân dân; tự chủ chiến lược, tự cường, tự tin, tiến mạnh trong kỷ nguyên mới của dân tộc… Thực hiện thắng lợi mục tiêu đến năm 2030 trở thành nước đang phát triển có công nghiệp hiện đại, thu nhập trung bình cao; hiện thực hoá tầm nhìn đến năm 2045 trở thành nước phát triển, thu nhập cao, là một nước Việt Nam xã hội chủ nghĩa hoà bình, độc lập, dân chủ, giàu mạnh, phồn vinh, văn minh, hạnh phúc…’’
Để đạt được mục tiêu đề ra đòi hỏi sự đồng lòng nhất trí từ đội ngũ chính quyền các cấp và toàn thể nhân dân
Sự đồng lòng, nhất trí ấy được khẳng định sinh động qua sự kiện ngày 15/3/2026, khi gần 76,2 triệu cử tri cả nước hân hoan tham gia bầu cử đại biểu Quốc hội khóa XVI và đại biểu Hội đồng nhân dân các cấp nhiệm kỳ 2026 - 2031
Kính thưa toàn thể các đồng chí!
Cùng với việc thực hiện theo phương châm của Đại Hội Đại Biểu toàn quốc lần thứ XIV và thâm nhuần di chúc của Chủ tịch Hồ Chí Minh, Đảng và Nhà nước ta đã và đang không ngừng nâng cao vị thế quốc gia trên mọi lĩnh vực: 
+ Không ngừng sáng tạo đổi mới, nâng cao chất lượng, HĐH CNH đất nước, áp dụng những thành tựu KHKT tiến bộ trong kỷ nguyên số, thời đại 4.0 và sắp tới là thời đại 5.0.
+ Để đạt được mục tiêu đó, không phải trong thời gian ngắn. Điều đò còn phụ thuộc vào tương lai và thế hệ mai sau. Chính vì lẽ đó, việc chăm lo cho thế hệ trẻ luôn được Đảng và Nhà nước đặt lên quan tâm hàng đầu.
+ Cùng với thế hệ trẻ, xóa đói giảm nghèo, thực hiện tiến bộ và công bằng xã hội đóng vai trò quan trọng không kém, đặc biệt trong công tác dân vận, xây dựng ‘Thế trận lòng dân’ là điều cần thiết trong giai đoạn này vì ‘Dân giàu, nước mạnh’.
+ Tăng cường QP-AN, bảo vệ vững chắc Tổ quốc XHCN là yêu cầu hàng đầu của Quân đội, cải tiến, trang bị VKKT tiên tiến nhằm chủ động trước mọi tình huống và tăng vị thế VN về mặt quân sự.
+ Từ những năm gần đây, vị thế VN trên trường quốc tế ngày càng được nâng cao. Nhiều diễn đàn, hội nghị quốc tế đã diễn ra thành công mà trong đó VN đóng vai trò quan trọng, vừa là cầu nối, vừa có nhiệm vụ chiến lược, qua đó giúp VN ngày càng củng cố vị trí và sánh vai với các cường quốc trên thế giới.
Chuyên đề của tôi đến đây kết thúc, cảm ơn quý thủ trưởng cùng các đồng chí đã theo dõi.

          `
        },
        {
          title: 'Việt Nam, đất nước, con người.',
          shortDesc: 'Giới thiệu truyền thống văn hóa tốt đẹp, cảnh quan thiên nhiên và vẻ đẹp con người Việt Nam qua các thời kỳ.',
          image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800&auto=format&fit=crop',
          imageCaption: 'Non sông gấm vức Việt Nam - Tươi đẹp và giàu truyền thống',
          fullContent: `
            Thưa toàn thể các đồng chí!
* Hình ảnh hoa sen - quốc hoa của dân tộc Việt Nam thể hiện sự tinh khiết, lòng thủy chung son sắc, được tôn vinh trên nền bản đồ Việt Nam hình chữ S trên những nét hoa văn tinh tế của mặt trống Đông Sơn, nhắc chúng ta nhớ đến truyền thống Con Lạc Cháu Hồng qua hơn 4000 năm dựng nước và giữ nước. Chúng ta sẽ cùng tìm hiểu theo dòng chảy lịch sử và văn hóa của dân tộc để thấy rõ hình ảnh Việt Nam, đất nước con người.
* Đây là hình ảnh Bác Hồ đọc bản Tuyên ngôn độc lập: Vào ngày 02/9/1945, tại quảng trường Ba Đình - Hà Nội, Chủ tịch Hồ Chí Minh thay mặt Chính phủ lâm thời đọc bản Tuyên ngôn độc lập tuyên bố với quốc dân và thế giới: Nước Việt Nam Dân chủ Cộng hòa ra đời. Người đã trịnh trọng tuyên ngôn: Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do độc lập. Toàn thể dân tộc Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mạng và của cải để giữ vững quyền tự do, độc lập ấy!
Thưa toàn thể các đồng chí!
Các đồng chí quan sát đây là hình ảnh khái quát những dấu ấn lịch sử và văn hóa Việt Nam: Vào thời kỳ dựng nước: Từ thế kỷ thứ 7 đến thế kỷ thứ 6 trước Công Nguyên, 15 bộ lạc sinh sống tại vùng châu thổ sông Hồng, sông Mã đã thống nhất lập nên nước Văn Lang, Vua nước Văn Lang, tất cả 18 đời, đều xưng là Hùng Vương. 
Đây là hình ảnh khu Di tích lịch sử Đền Hùng thuộc thôn Cổ Tích - xã Hy Cương - TP. Việt Trì, Phú Thọ, là nơi thờ cúng các vua Hùng đã có công dựng nước, tổ tiên của dân tộc Việt Nam. Thường niên vào ngày Mùng 10 tháng 3 âm lịch là ngày giỗ Tổ Hùng Vương.
“Dù ai đi ngược về xuôi
Nhớ ngày giỗ tổ mồng Mười tháng Ba”.
Thế kỷ thứ 2 trước CN, Thục Phán lên làm vua nước Văn Lang xưng là An Dương Vương và đổi tên nước thành Âu Lạc, xây thành ốc ở Cổ Loa làm kinh đô, là công trình mang đậm nét đặc trưng lịch sử văn hóa. Vào đời Hùng Vương thứ 6, có truyền thuyết Thánh Gióng, giúp Vua Hùng phá tan giặc Ân rồi bay về Trời, chẳng màng báo đáp công trạng. 
Năm 179 trước CN, nước Âu Lạc bị nước Nam Việt của Triệu Đà xâm lược, mở đầu cho thời kỳ lịch sử đen tối, đau thương, đầy uất hận dài đằng đẵng hơn 1000 năm của dân tộc Việt. Sau CN, năm 40, Hai Bà Trưng khởi nghĩa ở Mê Linh. Cuộc khởi nghĩa giành thắng lợi. Nhưng chỉ 3 năm sau, đất nước lại bị rơi vào tay nhà Hán. Và nhiều cuộc khởi nghĩa sau đó thất bại. Lịch sử văn hóa đắp đê Sông Hồng xuất hiện trong giai đoạn này.
Năm 542, Lý Bí khởi nghĩa thành công, xưng là Lý Nam Đế, lập ra nước Vạn Xuân. Năm 545, nhà Lương đem quân sang xâm lược nước Vạn Xuân. Cuối cùng năm 550, Triệu Quang Phục mới giành được thắng lợi, khôi phục nước Vạn Xuân, tự xưng là Triệu Việt Vương. Sau đó nước ta lại rơi vào tay nhà Tùy, rồi nhà Đường. Năm 938, quân Nam Hán do thái tử Hoằng Tháo kéo sang nước ta theo đường thủy định phối hợp với Kiều Công Tiễn để đánh bại Ngô Quyền. Nhưng khi quân Nam Hán lọt vào trận địa mai phục ở cửa sông Bạch Đằng thì bị đánh cho tan tác. Năm 939, Ngô Quyền xưng vương, dựng kinh đô tại Cổ Loa. Mở ra thời kỳ độc lập tự chủ hoàn toàn cho nước ta sau hơn 1000 năm bị đô hộ bởi phong kiến phương Bắc. 
Đây là hình ảnh phác thảo chiến thắng Bạch Đằng của Ngô Quyền (chỉ lên ảnh).
Năm 944, Ngô Quyền từ trần. Tình hình đất nước rơi vào cảnh hỗn lọan. Đất nước bị chia cắt thành 12 sứ quân. Năm 967, Đinh Bộ Lĩnh  thống nhất được 12 sứ quân, lên ngôi Hoàng Đế xưng là Đinh Tiên Hoàng, đặt tên nước là Đại Cồ Việt, kinh đô đóng tại Hoa Lư.
Từ năm 979 đến Năm 1009, đất nước trải qua các triều nhà Đinh, Lê, Lý Công Uẩn (Lý Thái Tổ). Năm 1072, Lý Nhân Tông lên ngôi khi mới 6 tuổi. Nhà Tống bên Trung Quốc cho là cơ hội tốt chuẩn bị lương thảo có ý xâm lược nước ta. Vì vua còn nhỏ nên quan phụ quốc Thái úy Lý Thường Kiệt nắm trọn binh quyền. 
Năm 1075, Lý Thường Kiệt chủ trương “đánh phủ đầu” quân Tống để tự vệ. Do bị bất ngờ nên quân Tống thua liên tiếp. Tháng 8 năm 1076, nhà Tống đem 30 vạn quân chia hai đường thủy, xâm lược nước ta. Lý Thường Kiệt chọn nơi quyết chiến tại sông Như Nguyệt, quân Tống hao tổn binh lực do thiếu lương thực vũ khí vì bị quân ta đánh du kích. Cuối cùng quân Tống phải chấp nhận giảng hòa rút quân về. Triều Lý bắt tay xây dựng đất nước và bước vào thời kỳ hưng thịnh.
Đây là hình ảnh đền Thờ Lý Thường Kiệt, một nhà quân sự kiệt xuất, có tài thao lược. Gắn liền với tên tuổi của Lý Thường Kiệt là bài thơ thần: Nam Quốc Sơn Hà.
	





Giai đoạn này xuất hiện các trình kiến trúc mang nét văn hóa độc đáo như: Tháp chàm Po Na Ga; Văn Miếu Quốc Tử Giám; Chùa 01 cột; Thành Nhà Hồ, Tháp Phổ Minh; Đắp đê Sông Hồng phát triển rực rỡ, tạo bước phát triển lớn về trị thủy. Về văn học có: Tác phẩm thơ: Nam Quốc Sơn Hà của Lý Thường Kiệt; Đại Việt Sử ký của Lê Văn Hưu; Bình Ngô đại cáo của Nguyễn Trãi; Bộ luật Hồng Đức thời nhà Lê
Đây là Đền thờ Nguyễn Trãi - nhà văn hóa kiệt xuất, có nhiều cống hiến lớn lao trong việc đề ra đường lối cứu nước, phò tá Lê Lợi hoạch định mưu lược đưa cuộc khởi nghĩa phát triển thành một cuộc chiến tranh giải phóng dân tộc mang tính nhân dân sâu rộng trên quy mô cả nước. Đại cáo bình Ngô được Nguyễn Trãi thảo ra sau khi cuộc khởi nghĩa Lam Sơn giành được thắng lợi hoàn toàn. Đại cáo bình Ngô giá trị như bản Tuyên ngôn độc lập thứ 2 của dân tộc ta. 
“Từ Triệu, Đinh, Lý, Trần, bao đời dựng nền độc lập
Cùng Hán, Đường, Tống, Nguyên mỗi bên hùng cứ một phương
Tuy mạnh yếu từng lúc khác nhau
Song hào kiệt đời nào cũng có”.
Thưa toàn thể các đồng chí!
Đến thời đại Hồ Chí Minh, chúng ta đánh tan hai cuộc chiến tranh xâm lược của thực dân Pháp và đế quốc Mỹ, hai nước thực dân, hai đế quốc hùng mạnh, sừng sỏ bậc nhất thế giới lúc bấy giờ. Có câu nói rằng, muốn biết một cuộc chiến tranh thắng hay bại, hãy nhìn vào ánh mắt người mẹ tiễn con ra trận. Hình ảnh tượng đài Bà Mẹ Việt Nam anh hùng Nguyễn Thị Thứ thượng thọ 106 tuổi tại xã Điện Thắng - Điện Bàn - Quảng Nam (nay là phường An Thắng, Thành phố Đà Nẵng). Biểu tượng của gần 500 ngàn Mẹ Việt Nam Anh hùng trong cả nuớc, là biểu trưng cho tinh thần bất khuất, kiên trung của Phụ nữ Việt Nam (Đây là công trình nghệ thuật tri ân những Bà Mẹ Việt Nam anh hùng và tưởng niệm các Anh hùng liệt sỹ). (Hình ảnh).
Tinh thần yêu nước của dân tộc Việt Nam được Hồ Chủ tịch đúc kết: “Dân ta có một lòng nồng nàn yêu nước, đó là một truyền thống quý báu của ta, từ xưa đến nay, mỗi khi Tổ quốc bị xâm lăng, thì tinh thần ấy lại sôi nổi, nó kết thành một làn sóng vô cùng mạnh mẽ, to lớn, nó lướt qua mọi sự nguy hiểm, khó khăn, nó nhấn chìm tất cả lũ bán nước và lũ cướp nước”. (Hình ảnh).
* Không chỉ là một đất nước anh hùng trong chiến tranh vệ quốc, Việt Nam còn là ngôi nhà chung của 54 dân tộc. Đây là tên gọi, số liệu dân số, địa bàn sinh sống của 54 dân tộc anh em. (Hình ảnh)
* Ở góc trái phía dưới là chùm ảnh về kiến trúc của cả ba miền Bắc Trung Nam. Đó là những giá trị vô giá, những sản phẩm kết tinh từ tinh thần cần cù chăm chỉ, thông minh sáng tạo của dân tộc Việt Nam đồng thời đó là những di sản quý giá để thế hệ mai sau trân trọng tự hào và giữ gìn. Văn miếu Quốc Tử Giám, được xây dựng dưới triều đại nhà Lý 1076, được xem là trường ĐH đầu tiên của nước ta. Văn Miếu là nơi tôn vinh các bậc anh tài. Đồng thời thể hiện rõ Nhà nước Việt Nam luôn quan tâm đến giáo dục. (Hình ảnh)
Vịnh Hạ Long-Kỳ quan thiên nhiên của thế giới; Thửa ruộng bậc thang vùng cao Yên Bái, một phong cảnh tuyện đẹp của vùng cao Tây Bắc, giúp chúng ta biết rõ hơn về phương pháp canh tác, sinh hoạt văn hóa ở mỗi vùng miền. (Hình ảnh)
Di tích Cố đô Huế một công trình kiến trúc được xây dựng từ triều đại Nhà Nguyễn cho đến nay vẫn còn và được tôn tạo giữ gìn, được công nhận là di sản văn hóa thế giới. (Hình ảnh)
Chợ Bến Thành, một biểu tượng của Thành phố Hồ Chí Minh. Và hình ảnh hang Sơn Đòong - Hang động tự nhiên lớn nhất thế giới tại Quảng Bình. (Hình ảnh) cho chúng ta thấy Việt Nam là quốc gia được thiên nhiên trù phú và ban tặng cho những cảnh đẹp và những kỳ quan hùng vỹ
Tiếp theo là các lễ hội truyền thống như Không gian văn hóa Cồng Chiêng Tây Nguyên - di sản văn hóa phi vật thể của nhân loại; Di tích Tháp Bà Po Na Ga ở Nha Trang, tỉnh Khánh Hòa; Lễ hội Đua ghe Ngo của đồng bào miền Tây Nam Bộ. Tất cả đã toát nên nét đẹp văn hóa ở mỗi vùng miền góp phần làm sinh động thêm về quê hương đất nước con người Việt Nam. (Hình ảnh)
Thưa toàn thể các đồng chí!
* Để có được thành quả như ngày hôm nay, đã có một bề dày lịch sử và văn hóa hơn 4000 năm; đồng thời đất nước đã luôn sản sinh ra nhiều nhân tài kiệt xuất ở mọi thời đại, tiêu biểu là chủ tịch Hồ Chí Minh và các thế hệ cán bộ lãnh đạo Đảng và Nhà nước đã và đang tiếp nối con đường mà Đảng, Bác Hồ và nhân dân ta đã lực chọn. 
Đây là hình ảnh các đồng chí lãnh đạo Đảng, Nhà nước, Quốc hội nhiệm kỳ 2021 - 2026: 
1. Đồng chí Tổng Bí thư BCH TW Đảng Cộng sản Việt Nam, Chủ tịch nước CH XHCN Việt Nam -  Tô Lâm;
2. Thủ tướng Chính phủ nước CH XHCN Việt Nam – Lê Minh Hưng;
3. Chủ tịch Quốc hội nước CHXHCN Việt Nam – Trần Thanh Mẫn. 
Thưa toàn thể các đồng chí!
Qua mảng ảnh “Việt Nam - Đất nước, Con người”, chúng ta đã được giới thiệu những nét khái quát nhất về lịch sử, truyền thống, văn hóa của dân tộc ta, thêm tự hào về một quê hương tươi đẹp và anh hùng. Từ đó, mỗi chúng ta trên cương vị chức trách được giao, phát huy truyền thống dân tộc, quân đội, phấn đấu trở thành người quân nhân cách mạng, xứng danh “Bộ đội Cụ Hồ”; xây dựng tinh thần yêu quê hương đất nước, yêu thương giống nòi... góp phần xây dựng và bảovệ Tổ quốc, như Bác Hồ hằng mong ước, như nhà thơ Tố Hữu hằng khát khao:
“Tôi lại mơ bên Thái Bình Dương
Tổ quốc tôi như một thiên đường
Của muôn triệu anh hùng làm nên cuộc sống
Của tự do, hy vọng, tình thương”.
Trân trọng cảm ơn các đồng chí đã chú ý lắng nghe!
          `
        },
        {
          title: 'Chủ tịch Hồ Chí Minh cuộc đời và sự nghiệp.',
          shortDesc: 'Tóm tắt tiểu sử, quá trình hoạt động cách mạng và di sản tư tưởng vô giá của Người để lại cho dân tộc.',
          image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
          imageCaption: 'Chủ tịch Hồ Chí Minh - Vị lãnh tụ thiên tài của dân tộc Việt Nam',
          fullContent: `
           Kính thưa thủ trưởng, thưa toàn thể các đồng chí!
Đây là toàn bộ những hình ảnh về thân thế, sự nghiệp Chủ tịch Hồ Chí Minh. Anh hùng giải phóng dân tộc, danh nhân văn hóa thế giới, người chiến sỹ lỗi lạc của phong trào cộng sản và công nhân quốc tế. Mảng ảnh được chia làm 3 phần:
+ Thứ nhất là chùm ảnh về cuộc đời và sự nghiệp của Hồ Chí Minh.
+ Thứ hai là những nội dung cơ bản của tư tưởng, đạo đức, phong cách Hồ Chí Minh.
+ Thứ ba là những dấu mốc về cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh.
Kính thưa toàn thể các đồng chí!
Chủ tịch Hồ Chí Minh là tấm gương trung với Đảng, trung với nước, hiếu với dân, trọn đời phấn đấu, hy sinh cho sự nghiệp giải phóng dân tộc, giải phóng giai cấp, giải phóng con người và toàn nhân loại. Chủ tịch Hồ Chí Minh tên thời thơ ấu là Nguyễn Sinh Cung, sinh ngày 19/5/1890 tại Hoàng Trù, xã Kim Liên, tỉnh Nghệ An (Hình ảnh ngôi nhà ở quê ngoại Bác Hồ).
Sinh ra và lớn lên trong một gia đình nhà nho yêu nước, Cha là Cụ phó Bảng Nguyễn Sinh Sắc, mẹ là bà Hoàng Thị Loan. Bác là con thứ ba trong gia đình có 4 anh chị em. Chứng kiến bao cảnh lầm than cơ cực của nhân dân lao động dưới sự bóc lột hà khắc của thực dân Pháp và tay sai thời bấy giờ. Người thanh niên Nguyễn Tất Thành đầy lòng yêu nước, thương dân. Ngày 05/6/1911, tại Bến cảng Nhà rồng, Bác đã ra đi tìm đường cứu nước (Hình ảnh Bến cảng Nhà rồng nơi Bác Hồ ra đi tìm đường cứu nước).
Thưa toàn thể các đồng chí!
Sau 10 năm đi qua 3 đại dương, 4 châu lục (Á, Âu, Phi, Mỹ - Latin); năm 1920 người đã đọc Luận cương của Lênin về vấn đề dân tộc và thuộc địa, Người đã tìm ra con đường cứu nước cho dân tộc Việt Nam đó là con đường cách vô sản, Người nói: “Tôi vui mừng đến phát khóc lên, ngồi một mình trong phòng mà tôi nói to như nói trước đồng bào, hỡi đồng bào bị đọa đầy đau khổ, đây là cái cần thiết cho chúng ta, đây là con đường để giải phóng nhân dân ta”.
Tháng 12/1920, tại Đại hội lần thứ 18 Đảng xã hội Pháp, cùng với những người cộng sản Pháp, Người đã bỏ phiếu tán thành Quốc tế thứ III, tham gia thành lập Đảng Cộng sản Pháp, Nguyễn Ái Quốc đã trở thành người cộng sản Việt Nam đầu tiên (Hình ảnh Nguyễn Ái Quốc tại Đại hội Tua năm 1920).
Tại Đại hội Quốc tế cộng sản lần thứ V, Nguyễn Ái Quốc được bầu là thành viên của Quốc tế Cộng Sản. Đây cũng chính là cơ hội lớn hơn để Người tiếp cận và thực hiện nhiệm vụ giải phóng dân tộc mình (Hình ảnh Bác Hồ tại Đại hội Quốc tế Cộng sản lần thứ V - Mát cơ va năm 1924).
Tháng 11/1924 người đến Quảng Châu - Trung Quốc nơi có điều kiện thuận lợi cho phong trào cách mạng Việt Nam.
Ngày 03/02/1930 tại Cửu Long - Hương Cảng - Trung Quốc, Người đã chủ trì hội nghị thành lập Đảng Cộng sản Việt Nam. 
Tháng 8/1932, Hồ Chí Minh bị chính quyền Tưởng Giới Thạch bắt giam vô cớ. Trong suốt 13 tháng ở tù (mùa thu năm 1932 đến mùa thu năm 1933), tuy bị đầy ải vô cùng cực khổ, Người vẫn giữ phong thái ung dung tự tại của một người yêu nước, một người cộng sản trung kiên, thể hiện được ý chí khát vọng mãnh liệt hết lòng vì nước, vì dân (Hình ảnh Tập thơ Ngục Trung Nhật ký – Nhật ký trong tù).
Đường Kách là tác phẩm ghi lại những bài giảng của Nguyễn Ái Quốc cho các lớp đào tạo cán bộ tại Quảng Châu do Bộ tuyên truyền của “Hội Liên hiệp các dân tộc bị áp bức ở Á Đông” phát hành vào đầu năm 1927. Cuốn sách này đánh dấu cho sự truyền bá Chủ nghĩa Marx – Lenin vào Việt Nam những năm 20 của thế kỷ XX. (Hình ảnh tác phẩm Đường Kách Mệnh của Bác Hồ)
Thưa toàn thể các đồng chí!
Vừa mới ra đời, Cách mạng Việt Nam cùng một lúc phải đối phó với thủ trong giặc ngoài. Trong tình thế cách mạng khó khăn “ngàn cân treo sợi tóc”, đêm ngày 19/12/1946 Chủ tịch Hồ Chí Minh ra lời kêu gọi “Toàn quốc kháng chiến”; sau đó Bác Hồ và Trung ương Đảng phải sơ tán lên chiến khu Việt Bắc để làm việc và lãnh đạo nhân dân ta trường kỳ kháng chiến chống thực dân Pháp xâm lược. 
Tháng 6/1950, Đảng, Chính phủ và Bộ Tổng tư lệnh Quyết định mở Chiến dịch Biên giới để khai thông biên giới Việt - Trung, mở rộng đường liên lạc giữa nước ta với các nước XHCN. Chiến dịch Biên giới thắng lợi là sự cụ thể hoá tư tưởng của Hồ Chí Minh là phải biết kết hợp sức mạnh của dân tộc với sức mạnh của thời đại. (Hình ảnh Bác Hồ tại mặt trận Đông Khê - Cao Bằng năm 1950)
Mùa Xuân năm 1941, sau hơn 30 năm bôn ba nước ngoài, đi tìm đường cứu nước. Ngày 28/01/1941, Người về nước trực tiếp lãnh đạo cuộc đấu tranh giải phóng dân tộc. Cách mạng Tháng Tám thành công, ngày 02/9/1945, tại Quảng trường Ba Đình, Bác Hồ đọc “Tuyên ngôn độc lập” khai sinh ra nước Việt Nam Dân chủ Cộng hòa, Nhà nước công nông đầu tiên ở Đông Nam Á. Ngày 02/3/1946 tại kỳ họp thứ nhất của Quốc hội Nước Việt Nam Dân chủ Cộng hòa Người được bầu làm Chủ tịch nước (Hình ảnh Bác Hồ được bầu làm Chủ tịch nước Việt Nam Dân chủ Cộng hòa).
Thưa toàn thể các đồng chí!
Tư tưởng Hồ Chí Minh luôn chứa đựng tất cả lòng quý trọng, yêu mến nhân dân, Người nói: “Trong bầu trời không gì quý bằng nhân dân. Trong thế giới không gì mạnh bằng lực lượng đoàn kết của nhân dân”. Người khẳng định: “Dân khí mạnh thì binh lính nào, súng ống nào cũng không địch nổi”. Chính vì vậy, trong suốt quá trình lãnh đạo cách mạng Người luôn tin tưởng vào sức mạnh của nhân dân, bám trụ vào sự che chở của nhân dân. (Hình ảnh Bác Hồ ở chiến khu Việt Bắc năm 1951) - Tờ Báo Nhân dân mà Bác đang đọc là tờ báo số ra ngày 11/3/1951 (số đầu tiên), in 6 trang, ngay trên trang nhất in trang trọng Tuyên ngôn của Đảng Lao động Việt Nam, bài của Tổng Bí thư Trường Chinh với tiêu đề "Hồ Chủ tịch người sáng lập, rèn luyện và lãnh đạo Đảng ta" và bài "Bàn về cách mạng Việt Nam". Đây là loạt bài có tính tổng hợp, chỉ đạo, vạch rõ đường lối cách mạng khi đất nước có chiến tranh.
Thưa toàn thể các đồng chí!
Đại hội đại biểu toàn quốc lần thứ III của Đảng Lao động Việt Nam, được tiến hành tại Thủ đô Hà Nội từ ngày 05- 10/9/1960); Trong diễn văn khai mạc Đại hội, Chủ tịch Hồ Chí Minh đã chỉ rõ: "Đại hội lần này là Đại hội xây dựng chủ nghĩa xã hội ở miền Bắc và đấu tranh hoà bình thống nhất nước nhà", thể hiện tư tưởng “Không có gì quý hơn độc lập tự do” và “Độc lập dân tộc gắn liền với chủnghĩa xã hội”. Tại đại hội lần này Bác Hồ được bầu làm Chủ tịch Đảng. (Hình ảnh Bác Hồ tại Đại hội Đảng lần thứ III năm 1960).
Bức ảnh “Bác bắt nhịp bài ca kết đoàn” được chụp tối 13/9/1960 tại chương trình văn nghệ quần chúng chào mừng thành công của Đại hội Đảng toàn quốc lần thứ III (tổ chức tại công viên Bách Thảo, Hà Nội). Bác không chỉ là người chỉ huy dàn nhạc giao hưởng năm ấy mà còn là người nhạc trưởng vĩ đại của cả dân tộc Việt Nam.
Thưa toàn thể các đồng chí!
Sinh thời chủ tịch Hồ Chí Minh hết sức yêu thương đồng chí, yêu thương con người. Ước nguyện lớn nhất của Bác khi còn sống đó là thống nhất hai miền Nam - Bắc, Bác dành tặng cho miền Nam những tình cảm hết sức đặc biệt. (Hình ảnh Bác Hồ chăm sóc cây vú sữa do đồng bào Miền Nam tặng năm 1956).
Là Chủ tịch nước, nhưng lại có phong cách sống rất thanh cao giản dị, chỉ muốn làm bạn với cỏ cây hoa lá, thiên nhiên, không ham vật chất xa hoa. Suốt đời hoạt động cách mạng ở chiến khu, cũng như ở Thủ đô lúc nào Bác cũng chỉ muốn ở trong ngôi nhà sàn đơn sơ, vách nứa (Hình ảnh Nhà sàn Bác Hồ ở Phủ Chủ tịch).
Lúc sinh thời, Bác Hồ hết sức quan tâm tới học sinh, sinh viên - thế hệ tương lai của đất nước của nước nhà. Khoảng tháng 9 năm 1945, Chủ tịch Hồ Chí Minh đã viết thư gửi các em học sinh nhân ngày khai trường đầu tiên của nước Việt Nam, Bác đã khẳng định: “Nước nhà trông mong, chờ đợi ở các em rất nhiều. Non sông Việt Nam có thể trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các cháu”. (Hình ảnh Bác Hồ với học sinh Thủ đô 1956).
Trong Di chúc, Chủ tịch Hồ Chí Minh đã căn dặn: “Đảng cần phải có kế hoạch thật tốt để phát triển kinh tế và văn hóa, nhằm không ngừng nâng cao đời sống của nhân dân”; Người đã chỉ rõ: “. nhiệm vụ quan trọng nhất của chúng ta là phải xây dựng nền tảng vật chất và kỹ thuật của chủ nghĩa xã hội,... có công nghiệp và nông nghệp hiện đại, có văn hóa và khoa học tiên tiến”. Trong quá trình cách mạng xã hội chủ nghĩa, chúng ta phải cải tạo nền kinh tế cũ và xây dựng nềnkinh tế mới, mà xây dựng là nhiệm vụ chủ chốt và lâu dài (Hình ảnh Bác Hồ thăm vùng mỏ Quảng Ninh năm 1959).
Đặc biệt, Người dành một sự quan tâm và tình thương yêu đặc biệt đối vớicán bộ, chiến sỹ trong quân đội nói chung và với cán bộ, chiến sỹ và đồng bào miền Nam nói riêng (Hình ảnh Bác Hồ về thăm Đại đội 1 - Trung đoàn cao xạ 234 ngày 19/7/1965, nay là Đại đội 1 - Tiểu đoàn 1 - Lữ đoàn PPK234 - Quân đoàn 34 và Hình ảnh Bác Hồ và các đại biểu dự Đại hội Anh Hùng chiến sỹ các lực lượng lực vũ trang nhân dân giải phóng miền Nam ra thăm miền Bắc ngày 11/11/1965).
Luôn gần gũi, bình dị, quan tâm chăm lo đến đồng bào nhân dân cả nước, Bác là người thích đến với nhân dân, gần dân, thấm đượm tình yêu dân, trọng dân, vì dân (Bác Hồ với bà con nông dân ngoại thành Hà Nội 1961). Mặc dầu rất bận việc nước nhưng Người luôn dành thời gian thăm hỏi động viên quan tâm đến các cụ già (Bác Hồ về thăm lại đồng bào Pác Pó – Cao Bằng năm 1961).
Thưa toàn thể các đồng chí!
Ngày 02/9/1969, sau một cơn đau tim nặng, Chủ tịch Hồ Chí Minh đã trúthơi thở cuối cùng vào lúc 9 giờ 40 phút, thọ 79 tuổi, để về với Các - Mác, Lê - Nin. Bác ra đi là một mất mát to lớn, để lại niềm tiếc thương vô hạn đối với nhân dân Việt Nam và nhân dân yêu chuộng hòa bình trên thế giới.
Cuộc đời và sự nghiệp cách mạng vĩ đại của Chủ tịch Hồ Chí Minh luôn là tấm gương sáng ngời cho chúng ta học tập. Tên tuổi của người đã đi vào lịch sử cách thế giới như là người khởi xướng cuộc đấu tranh giải phóng dân tộc của các nước thuộc địa trong thế kỷ XX.
Một người con ưu tú, kiệt xuất của dân tộc, người chiến sĩ cách mạng lỗi lạc, suốt đời tận tụy cho sự nghiệp đấu tranh giải phóng dân tộc, trong lời Điếu văn của Ban Chấp hành Trung ương Đảng Lao động Việt Nam do đồng chí Lê Duẩn, Bí thư thứ nhất, đọc tại Lễ truy điệu trọng thể Hồ Chủ tịch, ngày 9 tháng 9 năm 1969: “Dân tộc ta, nhân dân ta, non sông đất nước ta đã sinh ra Hồ Chủ tịch người anh hùng dân tộc vĩ đại, và chính Người đã làm rạng rỡ dân tộc ta, nhân dân ta và Non sông đất nước ta.”
Thưa toàn thể các đồng chí!
Chủ tịch Hồ Chí Minh kính yêu của chúng ta đã đi xa nhưng Người để lại cho dân tộc ta là một kho tàng quý báu cho sự nghiệp xây dựng và bảo vệ Tổ quốc trong thời đại mới. Năm 1990, nhân dịp kỷ niệm sinh nhật lần thứ 100 của Chủ tịch Hồ Chí Minh, Tổ chức giáo dục, khoa học và văn hóa của Liên hợp quốc (UNESCO) đã tôn vinh Người là: “Anh hùng giải phóng dân tộc, danh nhân văn hóa thế giới”.
* Những nội dung cơ bản của tư tưởng, đạo đức, phong cách Hồ ChíMinh, đó là: (vừa nói vừa chỉ trực tiếp trên mảng ảnh).
* Khái quát cuộc đời và thân thế sự nghiệp của chủ tịch Hồ Chí Minh qua những dấu mốc về cuộc đời và sự nghiệp cách mạng là minh chứng hùng hồnnhất và rõ nét nhất (chỉ trực tiếp trên mạng ảnh).
Kính thưa các đồng chí!
Trong suốt hơn 4000 năm dựng nước và giữ nước của dân tộc ta, qua nhiều thời kỳ khác nhau, thời kỳ nào cũng có những anh hùng hào kiệt, làm vẻ vang cho non sông, đất nước. Hồ Chí Minh - Người được toàn dân ta gọi bằng cái tên tôn kính: “Bác Hồ”. Người là một trong những vị anh hùng lớn nhất của lịch sử đấu tranh giành độc lập tự do cho dân tộc. Không những thế, Người còn là một nhà tư tưởng lớn của thời đại, một danh nhân văn hoá Việt Nam và thế giới.
Ngày nay, nước ta đang bước vào kỷ nguyên mới- kỷ nguyên vươn mình của dân tộc Việt Nam, các thế lực thù địch đang ra sức chống phá bóp méo hình ảnh cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh... Hơn lúc nào hết, cấp ủy, chỉ huy các cấp và mỗi cán bộ, chiến sĩ chúng ta tiếp tục quán triệt thực hiện tốt Chỉ thị số 01 –CT/BCT về tiếp tục đẩy mạnh thực hiện Chỉ thị số 05-CT/TW ngày 15/5/2016 của Bộ Chính trị; Chỉ thị số 87-CT/QUTW ngày 08/7/2016 của Quân uỷ Trung ương về “Đẩy mạnh học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh” trong đảng bộ quân đội và toàn quân.
Thường xuyên trau dồi phẩm chất đạo đức, rèn luyện kỹ năng sống để trởthành người có ích cho xã hội, trang bị những hành trang cơ bản để phấn đấu xứng danh “Bộ đội Cụ Hồ”, hoàn thành tốt các nhiệm vụ được giao. Thực hiện tốt phong trào “Đoàn kết, kỷ cương, tình thương, trách nhiệm”, bằng những việc làm cụ thể hàng ngày để ngày càng hoàn thiện mình xứng đáng với danh hiệu “Bộ đội cụ Hồ” mà nhân dân trao tặng góp phần xây dựng đơn vị VMTD “Mẫu mực, tiêu biểu”; xây dựng Quân đội nhân dân Việt Nam chính quy, tinh nhuệ, hiện đại./.
Trân trọng cảm ơn các đồng chí đã chú ý lắng nghe!
          `
        },
        {
          title: 'Truyền thống Quân đội nhân dân Việt Nam.',
          shortDesc: 'Tôn vinh lịch sử vẻ vang, tinh thần quyết chiến quyết thắng và những chiến công oanh liệt của QĐND Việt Nam.',
          image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
          imageCaption: 'Quân đội nhân dân Việt Nam - Từ nhân dân mà ra, vì nhân dân mà chiến đấu',
          fullContent: `
           Thưa toàn thể các đồng chí!
Quân đội ta là Quân đội anh hùng của một dân tộc anh hùng, từ nhân dân mà ra, vì nhân dân mà chiến đấu. Từ khi thành lập đến nay lớp lớp cán bộ, chiến sĩ của Quân đội ta luôn chiến đấu anh dũng kiên cường hoàn thành xuất sắc các nhiệm vụ được giao. Hình ảnh lá cờ đỏ sao vàng quyết chiến, quyết thắng lấp lánh những chiến công tung bay cùng hình ảnh các quân, binh chủng của Quân đội biểu trưng cho sức mạnh “Bách chiến, Bách thắng” QĐNDVN hơn 81 năm qua. Xứng đáng với lời dạy của Bác “Quân đội ta trung với Đảng, hiếu với dân, sẵn sàng chiến đấu, hi sinh vì độc lập tự do của Tổ quốc, vì chủ nghĩa xã hội, nhiệm vụ nào cũng hoàn thành, khó khăn nào cũng vượt qua, kẻ thù nào cũng đánh thắng”
Thấm nhuần lời dạy của Bác Hồ trong buổi nói chuyện với cán bộ, chiến sỹ Đại đoàn 308 - Đại đoàn Quân tiên phong tại Đền Hùng - Phú Thọ năm 1954 trước khi về tiếp quản Thủ đô, Bác dạy: “Các Vua Hùng đã có công dụng nước, Bác cháu ta phải cùng nhau giữ lấy nước".
Kế thừa tinh hoa nghệ thuật quân sự độc đáo, độc lập, tự chủ của dân tộc. Quân đội ta đã từng bước được hình thành và khẳng định vai trò nòng cốt trong sự nghiệp đấu tranh giải phóng giai cấp, giải phóng dân tộc.
Từ các “Đội tự vệ đỏ” trong cao trào Xô Viết Nghệ Tĩnh (1930 - 1931) đến các “Đội cứu quốc quân” tại chiến khu Cao - Bắc - Lạng (1941 - 1944), đây chính là những tổ chức tiền thân vững chắc của Quân đội ta. Trước đòi hỏi của lịch sử, ngày 22/12/1944, Đội Việt Nam Tuyên truyền Giải phóng quân chính thức được thành lập tại Nguyên Bình, Cao Bằng dưới sự chỉ đạo của đồng chí Võ Nguyên Giáp. Với 34 chiến sĩ, vũ khí thô sơ cùng "bữa cơm nhạt" ngày thành lập, đội quân ấy đã mưu trí, dũng cảm giành thắng lợi ngay trận đầu tại Phai Khắt, Nà Ngần (25 và 26/12/1944). Chiến thắng này khẳng định lời tiên tri của Bác: “Tuy lúc đầu quy mô của nó còn nhỏ, nhưng tiền đồ của nó rất vẻ vang, nó là khởi điểm của giải phóng quân, nó có thể đi suốt từ Nam chí Bắc, khắp đất nước Việt Nam chúng ta...”.
Từ những đốm lửa đầu tiên, Quân đội ta càng đánh càng mạnh, cùng toàn dân lập nên những kỳ tích rung chuyển thế giới trong thế kỷ XX.
Trong cuộc kháng chiến chống thực dân Pháp, chúng ta lần lượt đánh thắng các chiến dịch Việt Bắc (1947), Biên giới (1950), Đông Xuân (1953 - 1954), và đỉnh cao là Chiến thắng lịch sử Điện Biên Phủ ngày 07/5/1954 với hình ảnh lá cờ đỏ sao vàng tung bay trên nóc hầm Đờ-Cát, kết thúc 9 năm trường kỳ kháng chiến, đưa miền Bắc tiến lên chủ nghĩa xã hội, đúng như vần thơ lịch sử: “Chín năm làm một Điện Biên, nên vành hoa đỏ nên thiên sử vàng”.
Thưa toàn thể các đồng chí!
Sau khi lập lại hòa bình ở miền Bắc, ở miền Nam, đế quốc Mỹ đơn phươngbác bỏ Hiệp định Giơ-ne-vơ, hất cẳng thực dân Pháp, chính thức xâm lược Việt Nam dưới chế độ “thực dân kiểu mới”, dựng lên chính quyền bù nhìn Ngô Đình Diệm, lê máy chém đi khắp chiến trường đàn áp phong trào cách mạng miền Nam.
Thực hiện lời dạy của Chủ tịch Hồ Chí Minh: “Cuộc kháng chiến chống Mỹ có thể còn kéo dài, đồng bào ta có thể hy sinh nhiều của, nhiều người. Dù sao chúng ta cũng phải quyết tâm đánh giặc Mỹ đến thắng lợi hoàn toàn”.
Còn non, còn nước, con người
Thắng giặc Mỹ ta sẽ xây dựng hơn mười ngày nay.
“Dù có phải đốt cháy cả dãy Trường Sơn cũng quyết tâm giành cho được độc lập”, “Không có gì quý hơn độc lập tự do”. Với quyết tâm sắt đá và ước vọng độc lập thống nhất cháy bỏng, hàng triệu người con ưu tú của dân tộc đã “Xẻ dọc Trường Sơn đi cứu nước mà lòng phơi phới dậy tương lai”. Quân đội ta, dưới sự lãnh đạo của Đảng đã lần lượt đánh bại các chiến lược chiến tranh của Mỹ thựchiện từ 1954 - 1975 trên toàn lãnh thổ Việt Nam đó là: “Chiến tranh đơn phương”,"Chiến tranh đặc biệt"; "Chiến tranh cục bộ" và chiến lược Việt Nam hoá chiến tranh”. Chiến thắng Điện Biên Phủ trên không - Hà Nội (12/1972) buộc Mỹ phải ký hiệp định Paris về Việt Nam (27/01/1973), rút hết quân Mỹ về nước.
Thưa toàn thể các đồng chí!
Thời cơ chiến lược xuất hiện, toàn quân bước vào cuộc tổng tiến công và nổi dậy mùa Xuân năm 1975 với tinh thần thần tốc, táo bạo.
Mở đầu bằng chiến dịch Tây Nguyên (04/3/1975) với trận then chốt giải phóng thị xã Buôn Ma Thuột ngày 10/3/1975 đập tan tuyến phòng thủ của địch, tạo thế chẻ tre để Bộ Chính trị mở Chiến dịch Hồ Chí Minh lịch sử. Ngày 30/4/1975, hình ảnh xe tăng húc đổ cổng Dinh Độc Lập đã báo hiệu chiến dịch toàn thắng, miền Nam hoàn toàn giải phóng, non sông thu về một mối.
Tham gia trong Ngày Toàn thắng 30/4/1975 trong đoàn quân oai hùng tiến về Sài gòn có sự góp mặt của Quân đoàn 3 “Binh đoàn Tây Nguyên”, Quân đoàn 4 “Binh đoàn Cửu Long” (nay là Quân đoàn 34) chúng ta. Ngay sau khi được thành lập, Quân đoàn được giao nhiệm vụ tham gia chiến dịch Hồ Chí Minh lịch sử. Đây là niềm vinh dự tự hào lớn lao nhưng cũng là thử thách rất lớn. Thực hiện đúng sự chỉ đạo của trên, với tinh thần “thần tốc”, hơn 3 vạn cán bộ, chiến sĩ cùng với hàng nghìn phương tiện kỹ thuật, Quân đoàn đã vào vị trí tập kết để tham gia Chiến dịch sớm hơn quy định. Trong Chiến dịch, Quân đoàn 3 được giao nhiệm vụ đảm nhiệm hướng tiến công chủ yếu Tây Bắc Sài Gòn, Quân đoàn 4 đảm nhiệm hướng chủ yếu Đông và Đông Nam.
Thực hiện phương châm, tư tưởng chỉ đạo tác chiến: “Mạnh bạo, chắc thắng, đánh mạnh, đánh liên tục, nắm chắc thời cơ thọc sâu phát triển nhanh”, các đơn vị của Quân đoàn đã phối hợp chặt chẽ với lực lượng vũ trang các địa phương và các cánh quân tiến vào Sài Gòn, lần lượt đánh chiếm và làm chủ các mục tiêu tại: Gò Dầu Hạ, Trảng Bàng, Đồng Dù, Hóc Môn, Trung tâm huấn luyện Quang Trung, sân bay Tân Sơn Nhất, Bộ Tổng tham mưu Ngụy...
Vinh dự, tự hào lớn lao về những thành tích vẻ vang hơn 50 năm xây dựng chiến đấu và trưởng thành. Cán bộ, chiến sĩ Quân đoàn 34 tiếp tục phát huy chủ nghĩa anh hùng cách mạng, đoàn kết, thi đua để lập nên nhiều kỳ tích mới trong thực hiện nhiệm vụ chính trị trung tâm là huấn luyện sẵn sàng chiến đấu, nhằm góp phần quan trọng vào công cuộc xây dựng, phát triển Tây Nguyên và vũng Đông Nam bộ và bảo vệ vững chắc Tổ quốc Việt Nam XHCN…
Thưa toàn thể các đồng chí!
Sau ngày đại thắng, chưa một ngày ngơi nghỉ, Quân đội nhân dân Việt Nam lại tiếp tục bước vào cuộc chiến đấu mới để bảo vệ toàn vẹn lãnh thổ và thực hiện nghĩa vụ quốc tế cao cả.
Chúng ta đã kiên cường chiến đấu trong cuộc chiến tranh bảo vệ biên giới Tây Nam và biên giới phía Bắc năm 1979, giữ vững chủ quyền quốc gia. Đồng thời, thấm nhuần lời dạy “Giúp bạn là tự giúp mình”, Quân đội ta đã sang giúp nhân dân Lào và Campuchia đập tan họa diệt chủng Pôn Pốt. Hình ảnh quân tình nguyện Việt Nam hoàn thành nhiệm vụ trở về nước trong sự lưu luyến của nhân dân bạn (Hình ảnh Nhân dân CPC lưu luyến tiễn đưa quân tình nguyện Việt Nam) (trong đoàn quân đó có Quân đoàn 4) đã làm ngời sáng phẩm chất “Bộ đội Cụ Hồ”. Như Tiến sĩ Chay Y Hiệng - Cố vấn Chính phủ Hoàng gia Campuchia đã khẳng định: Việt Nam trong trái tim người dân Campuchia chính là hình ảnh về một “Quân đội nhà Phật” từ cõi thiện xa xôi đến cứu giúp nhân dân qua hoạn nạn.
Một lần nữa bản chất cách mạng của “Bộ đội cụ Hồ” được khẳng định và tỏa sáng. 
Thưa toàn thể các đồng chí!
Phát huy truyền thống vẻ vang trong chiến tranh cách mạng, ngày nay, Quân đội ta bước vào thời kỳ xây dựng tinh, gọn, mạnh theo tinh thần Nghị quyết Đại hội XIV của Đảng.
Chủ trương chiến lược được xác định rõ: ‘‘về xây dựng Quân đội nhân dân cách mạng, chính quy, tinh nhuệ, hiện đại. Đại hội XIII xác định, đến năm 2025, cơ bản xây dựng Quân đội tinh, gọn, mạnh, tạo tiền đề vững chắc, phấn đấu năm 2030 xây dựng Quân đội nhân dân cách mạng, chính quy, tinh nhuệ, hiện đại. Quán triệt, triển khai thực hiện Nghị quyết Đại hội XIV của Đảng về xây dựng Quân đội cách mạng, chính quy, tinh nhuệ, hiện đại; chỉ đạo của đồng chí Tổng Bí thư về "2 kiên định, 2 đẩy mạnh, 2 ngăn ngừa", "phương châm 5 vững" và mục tiêu "quyết tâm nghiên cứu, sản xuất vũ khí trang bị tiên tiến, hiện đại". Hơn 81 năm qua, Quân đội luôn thực hiện tốt 3 chức năng "đội quân chiến đấu, đội quân công tác, đội quân lao động và sản xuất".
Thực hiện tốt chức năng đội quân chiến đấu
Đây là chức năng cơ bản, chủ yếu của Quân đội nhân dân Việt Nam. Toàn quân không ngừng nâng cao chất lượng huấn luyện, sẵn sàng chiến đấu, làm chủ vũ khí, trang bị kỹ thuật, nhất là vũ khí công nghệ cao; đẩy mạnh nghiên cứu khoa học, đổi mới sáng tạo, ứng dụng thành tựu của Cách mạng công nghiệp lần thứ tư nhằm nâng cao sức mạnh chiến đấu, đáp ứng yêu cầu bảo vệ vững chắc Tổ quốc trong tình hình mới. (Hình ảnh: không quân Việt Nam, diễu binh trên biển, tăng thiết giáp, …)
Thực hiện tốt chức năng đội quân công tác
Quân đội luôn gắn bó máu thịt với nhân dân, tích cực tuyên truyền, vận động nhân dân thực hiện chủ trương của Đảng, chính sách, pháp luật của Nhà nước; tham gia xây dựng hệ thống chính trị cơ sở, giúp dân phát triển kinh tế, giảm nghèo, xây dựng nông thôn mới, phòng, chống thiên tai, cứu hộ, cứu nạn. Đồng thời, tích cực thực hiện nhiệm vụ đối ngoại quốc phòng, tham gia lực lượng gìn giữ hòa bình Liên hợp quốc, góp phần xây dựng "thế trận lòng dân" vững chắc và lan tỏa phẩm chất cao đẹp "Bộ đội Cụ Hồ". (Hình ảnh) 
Thực hiện tốt chức năng đội quân lao động sản xuất
Quân đội tích cực tăng gia sản xuất, thực hành tiết kiệm, nâng cao đời sống bộ đội; tham gia phát triển kinh tế gắn với củng cố quốc phòng, an ninh, nhất là ở vùng sâu, vùng xa, biên giới, hải đảo. Qua đó góp phần phát triển kinh tế - xã hội, tăng cường tiềm lực quốc phòng và xây dựng Quân đội ngày càng vững mạnh. (Hình ảnh).
Trải qua hơn 81 năm xây dựng, chiến đấu và trưởng thành đã đúc kết nên những nét tiêu biểu nhất về bản chất cách mạng và truyền thống vẻ vang của QĐND Việt Nam đó là:
NHỮNG NÉT TIÊU BIỂU NHẤT VỀ BẢN CHẤT CÁCH MẠNG VÀ TRUYỀN THỐNG VANG CỦA QUÂN ĐỘI NHÂN DÂN VIỆT NAM
1.	TRUNG THÀNH VÔ HẠN VỚI TỔ QUỐC VIỆT NAM XÃ HỘI CHỦ NGHĨA, VỚI ĐẢNG, NHÀ NƯỚC VÀ NHÂN DÂN.
2.	QUYẾT CHIẾN, QUYẾT THẮNG, BIẾT ĐÁNH, BIẾT THẮNG.
3.	GẮN BÓ MÁU THỊT VỚI NHÂN DÂN, QUÂN DÂN MỘT Ý CHÍ.
4.	NỘI BỘ ĐOÀN KẾT, CÁN BỘ, CHIẾN SĨ BÌNH ĐẲNG THƯƠNG YÊU GIÚP ĐỠ NHAU, TRÊN DƯỚI ĐỒNG LÒNG THỐNG NHẤT Ý CHÍ VÀ HÀNH ĐỘNG.
5.	KỶ LUẬT TỰ GIÁC NGHIÊM MINH.
6.	ĐỘC LẬP TỰ CHỦ, TỰ LỰC TỰ CƯỜNG, CẦN KIỆM XÂY DỰNG QUÂN ĐỘI, XÂY DỰNG ĐẤT NƯỚC, TÔN TRỌNG VÀ BẢO VỆ CỦA CÔNG.
7.	LỐI SỐNG TRỌNG SẠCH, LÀNH MẠNH, CÓ VĂN HÓA, TRUNG THỰC, KHIÊM TỐN, GIẢN DỊ, LẠC QUAN.
8.	TINH THẦN HAM HỌC, CẦU TIẾN BỘ, CÓ Ý CHÍ VƯƠN LÊN.
9.	ĐOÀN KẾT QUỐC TẾ TRỌNG SÁNG, THỦY CHUNG, CHÍ NGHĨA, CHÍ TÌNH.
Sự lớn mạnh của QĐNDVN luôn gắn liền với sự lãnh đạo, chỉ đạo sâu sát của các đồng chí lãnh đạo Bộ Quốc phòng qua các thời kỳ. Hiện nay, lãnh đạo BQP gồm các đồng chí: Đồng chí Đại tướng Phan Văn Giang - Bộ trưởng BQP; Đồng chí Đại tướng Nguyễn Trọng Nghĩa - Chủ nhiệm Tổng cục Chính trị; Đồng chí Đại tướng Nguyễn Tân Cương - Tổng Tham mưu trưởng Quân đội nhân dân Việt Nam. 
Sự thống nhất về ý chí và hành động của toàn quân tiếp tục được khẳng định và nâng tầm thông qua các sự kiện chính trị trọng đại.
Đại hội đại biểu Đảng bộ Quân đội lần thứ XII, nhiệm kỳ 2025 - 2030 đã thành công tốt đẹp. Đại hội đã đánh giá toàn diện kết quả thực hiện nhiệm vụ giai đoạn 2020 - 2025, quyết định phương hướng, mục tiêu lãnh đạo nhiệm vụ quân sự, quốc phòng và xây dựng Đảng bộ Quân đội 5 năm tới, đóng góp vào văn kiện và bầu đoàn đại biểu dự Đại hội đại biểu toàn quốc lần thứ XIV của Đảng.
Kính thưa các đồng chí!
Để bảo đảm cho Quân đội luôn hoàn thành xuất sắc mọi nhiệm vụ trong tình hình mới, các cơ quan, đơn vị và từng cán bộ, chiến sĩ trong toàn quân cần tiếp tục phấn đấu xây dựng bản lĩnh chính trị vững vàng, giữ vững phẩm chất “Bộ đội Cụ Hồ”. Toàn đơn vị gương mẫu thực hiện Chỉ thị 05 và Kết luận 01 của Bộ Chính trị khóa XIII về đẩy mạnh học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh; giữ vững nguyên tắc lãnh đạo tuyệt đối, trực tiếp về mọi mặt của Đảng đối với Quân đội.
Mỗi quân nhân phải thường xuyên quán triệt sâu sắc đường lối, quan điểm của Đảng; xác định rõ đối tác, đối tượng theo Nghị quyết Trung ương 8 (khóa XII, XIII) về “Chiến lược bảo vệ Tổ quốc trong tình hình mới”. Luôn nêu cao tinh thần cảnh giác cách mạng, phối hợp chặt chẽ với các lực lượng, đập tan mọi âm mưu “diễn biến hòa bình”, “phi chính trị hóa quân đội” của các thế lực thù địch, ngăn chặn biểu hiện “tự diễn biến”, “tự chuyển hóa” từ trong nội bộ, quyết tâm bảo vệ vững chắc độc lập, chủ quyền, toàn vẹn lãnh thổ của Tổ quốc.
Chuyên đề thuyết minh của tôi đến đây là kết thúc.
Trân trọng cảm ơn các đồng chí đã chú ý lắng nghe!
          `
        },
        {
          title: 'Tuổi trẻ Quân đội phấn đấu xứng danh “Bộ đội Cụ Hồ” thời kỳ mới.',
          shortDesc: 'Khơi dậy khát vọng cống hiến, xung kích, sáng tạo rèn luyện bản lĩnh của đoàn viên thanh niên trong đơn vị.',
          image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
          imageCaption: 'Thanh niên quân đội xung kích, sáng tạo, quyết thắng',
          fullContent: `
           Thưa toàn thể các đồng chí!
Năm 1946, trong thư gửi học sinh toàn quốc nhân dịp Tết Nguyên Đán, Bác Hồ viết: “Một năm khởi đầu từ mùa xuân. Một đời khởi đầu từ tuổi trẻ. Tuổi trẻ là mùa xuân của xã hội”. Trong tư tưởng của mình, Bác luôn khẳng định: “Thanh niên là người chủ tương lai của nước nhà; thật vậy, trước nhà thịnh hay suy, yếu hay mạnh, một phần lớn phụ thuộc vào thanh niên”.
Đoàn thanh niên cộng sản Hồ Chí Minh ra đời vào ngày 26/3/1931, là đội dự bị tin cậy thường xuyên bổ sung lực lượng trẻ cho Đảng, kế tục sự nghiệp vẻ vang của Đảng và Chủ tịch Hồ Chí Minh; là lực lượng nòng cốt trong phong trào thanh niên; là trường học XHCN và đại diện quyền lợi của thanh niên.
Thanh niên Quân đội là một bộ phận quan trọng của thanh niên nước nhà. Trong các cuộc cách mạng đấu tranh lâu dài, đầy hy sinh gian khổ, nhưng rất vẻ vang của nhân dân ta, các thế hệ thanh niên Việt Nam đã nối tiếp nhau tòng quân, chiến đấu và hy sinh lập nên những chiến công hiển hách, xây đắp nên truyền thống “Quyết chiến, quyết thắng” của QĐND Việt Nam anh hùng. Xứng đáng với lời dạy của Bác:
“Không có việc gì khó,
Chỉ sợ lòng không bền,
Đào núi và lấp biển,
Quyết chí ắt làm nên”
Thưa toàn thể các đồng chí! Chúng ta hãy cùng nhau hướng về phía bảng ảnh, và như các đồng chí có thể thấy:
Đầu tiên là bức tranh cổ động với hình ảnh Chủ tịch Hồ Chí Minh, đang bắt nhịp bài hát Kết đoàn. Khoảnh khắc này diễn ra vào tối ngày 3 tháng 9 năm 1966 tại Nhà hát Lớn Hà Nội. Trong buổi dạ hội mừng Lễ kỷ niệm 21 năm Quốc khánh nước Việt Nam Dân chủ Cộng hòa và ở dưới hình ảnh của Bác đó là hình ảnh đoàn quân duyệt đội ngũ, tượng trưng cho sự thống nhất, gắn bó, đoàn kết, chung một ý chí và hành động. Qua bức ảnh, muốn truyền tải đến người xem thông điệp về thanh niên quân đội đó là nguyện trung thành lý tưởng của Đảng, của Chủ tịch Hồ Chí Minh, gắn bó keo sơn, đoàn kết nội bộ, đoàn kết với nhân dân, xứng đáng với danh xưng Bộ đội Cụ Hồ.
“Bác đang cùng chúng cháu hành quân” tên bài hát của nhạc sĩ Huy Thục đã thấm sâu vào trong trái tim của mỗi cán bộ chiến sỹ QĐND Việt Nam. Đây là hình ảnh thể hiện sự tri ân và tình cảm của lớp lớp thanh niên Quân đội giành cho Bác với những bước chân trên đường ra trận vững vàng, dứt khoát, bước đi trong tư thế tự tin, yêu đời, lạc quan ở vị thế của những người làm chủ, đang thực thi sứ mệnh bảo vệ non sông, Tổ quốc. Trong dấu chân đó, Bác luôn là người dõi theo để cổ vũ, động viên lớp lớp thanh niên hoàn thành nhiệm vụ.
Lời căn dặn của Bác đối với đoàn viên, thanh niên được viết trong bản Di chúc trước lúc người đi xa: “Đoàn viên và thanh niên ta nói chung là tốt, mọi việc đều hăng hái xung phong, không ngại khó khăn, có chí tiến thủ. Đảng cần phải chăm lo giáo dục đạo đức cách mạng cho họ, đào tạo họ thành những người thừa kế xây dựng xã hội chủ nghĩa vừa “Hồng”, vừa “Chuyên”. Bồi dưỡng thế hệ cách mạng cho đời sau là một việc rất quan trọng và rất cần thiết”.
Thưa toàn thể các đồng chí!
Trong lịch sử phát triển và ngày càng trưởng thành của mình, thanh niên Việt Nam đã xây đắp nên những truyền thống tốt đẹp. 
Đó là, truyền thống yêu nước nông nàn, gân bỏ thiết tha, trung thành tuyệt đối với đảng, với nhân dân và chế độ xã hội chủ nghĩa.
Truyền thống của đội quân xung kích cách mạng, dám đón lấy những nhiệm vụ nặng nề, dám đi đến những nơi khó khăn, gian khó, dám suy nghĩ sáng tạo... Để hoàn thành nhiệm vụ được giao.
Truyền thống gắn bó đoàn kết trong lớp người cùng lứa tuổi, trong các tổ chức đoàn và hội; đoàn kết gán bó với nhân dân; thương yêu giúp đỡ lẫn nhau trong hoạn nạn, đặc biệt là vào những thời điểm phải đối mặt với kẻ thù hay thiên tai.
Truyền thống hiếu học, ham hiểu biết để tự mình nâng cao trình độ chính trị, văn hóa, khoa học, kỹ thuật, quản lý và quân sự... Say mê sáng tạo trong hoạt động thực tiến, để công hiến cho sự nghiệp của dân tộc và của đảng.
Truyền thống của thanh niên quân đội
Tuổi trẻ quân đội là bộ phận ưu tú của thanh niên cả nước có truyền thống “ Trung thành, trí tuệ, mẫu mực, quả cảm, xung kích, sáng tạo, quyết tháng, xứng danh "bộ đội cụ hồ"
Trong 2 cuộc kháng chiến trường kỳ của dân tộc, lớp lớp thanh niên Việt Nam đã chiến đấu, đã cống hiến và cũng đã có những hy sinh.
Đó là anh hùng Lý Tự Trọng, là học trò xuất sắc của Chủ tịch Hồ Chí Minh. Ngày 9/2/1931, Anh đã bắn chết tên thanh tra mật thám Lê Grard và anh bị bắt ngay sau đó. Thực dân Pháp đã dùng mọi cực hình tra tấn dã man nhất nhưng anh vẫn giữ vững khí tiết người cộng sản kiên trung.
- Ngày 26/11/1931 Anh bị thực dân Pháp kết án tử hình.
- Lý Tự Trọng - người anh hùng nhỏ tuổi đã nêu cao ý chí cách mạng kiên trung, được anh em đồng đội yêu thương, kẻ thù khiếp sợ gọi anh là Ông nhỏ. Người đoàn viên trẻ tuổi vững chí bền gan với câu nói nổi tiếng “Con đường của thanh niên chỉ có thể là con đường cách mạng”
Đó là chị Võ Thị Sáu - Người con gái đất đỏ Miền Đông hiên ngang, sinh năm 1935 tại ấp Long Mỹ - Phước Long - Long Đất - Bà Rịa - Vũng Tàu (nay là xã Đất Đỏ, thành phố Hồ Chí Minh). Năm 12 tuổi chị đã tham gia cách mạng vào lực lượng Công an xung phong, là lực lượng diệt ác vùng đất đỏ
- Tháng 2/1950 chị bị địch bắt, chúng tra tấn vô cùng dã man nhưng không khai thác được gì ở người con gái nhỏ tuổi và cuối cùng chúng kết án tử hình chị và lưu đầy ra côn đảo (lúc ấy chị mới 17 tuổi).
- Chị bị tử hình tại Côn Đảo ngày 23/1/1952 (tức ngày 27 tháng chạp). Người con gái kiên trung đó đã được Đảng, Nhà nước tuyên dương anh hùng LLVT ngày 2/8/1993.
Đó là anh hùng - liệt sỹ Phan Đình Giót - Người anh hùng trong chiến dịch Điện Biên Phủ, trong trận chiến đấu ác liệt anh đã lao đến lấy thân mình lấp lỗ châu mai, bịt chặt hoả lực của địch, giúp cho đồng đội xông lên tiêu diệt địch, đồng thời giảm bớt sự hy sinh của đồng đội. Góp phần làm nên chiến thắng oanh liệt của Quân đội ta, Anh hy sinh khi tuổi đời còn rất trẻ, thể hiện ý chí kiên cường, bất khuất “Quyết tử cho Tổ quốc quyết sinh”, Anh mãi mãi là tấm gương sáng cho chúng ta học tập và noi theo.
Đó là anh hùng - liệt sỹ Nguyễn Văn Trỗi - sinh năm 1940, quê ở Điện Thắng- Điện bàn - Quảng Nam, khi hy sinh là đoàn viên - chiến sỹ biệt động thành phố Sài Gòn với câu nói bất hủ của người thợ điện trẻ tuổi “Còn giặc Mỹ thì không còn hạnh phúc”.
- Là công nhân thợ điện Sài Gòn, đồng thời là một chiến sỹ gan dạ, người chiến sỹ biệt động đặt mìn mưu sát tên Bộ trưởng Mỹ Mac Na Ma Ra. Việc không thành, anh bị Nguy quyền Sài Gòn bắt giam, tra tấn dã man nhưng vẫn không khuất phục được anh. Ngày 15/10/1964 chúng hèn hạ giết Nguyễn Văn Trỗi. 9 phút cuối cùng ở pháp trường anh đã hiên ngang vạch tội quân bán nước và cướp nước. Nguyễn Văn Trỗi đã hô to 3 lần “Hồ Chí Minh muôn năm”, khi bị trúng đạn ngã xuống, anh cố gượng dậy hô “Việt Nam muôn năm”.
- Ngày 17/10/1964 Nguyễn Văn Trỗi được Nhà nước ta truy tặng huân chương Thành đồng hạng nhất và danh hiệu AHLLVTND.
Đó là anh hùng Nguyễn Viết Xuân, sinh năm 1934, quê ở Ngũ kim – Vĩnh Tường - Vĩnh Phúc, khi hy sinh đồng chí là đảng viên thiếu uý - chính trị viên Đại đội 3 - Tiểu đoàn 14 pháo cao xạ - Trung đoàn 325 - Quân khu IV.
Trưởng thành từ chiến sỹ trinh sát rồi Tiểu đội trưởng, Trung đội trưởng pháo cao xạ, sau làm chính trị viên đại đội, ở bất kỳ cương vị nào Nguyễn Viết Xuân đều hoàn thành xuất sắc nhiệm vụ.
Ngày 18/11/1964 Anh đã chỉ huy đơn vị đánh trả máy bay địch đang bắn phá vùng Chà Lô - Quảng Bình. Bất chấp nguy hiểm Nguyễn Viết Xuân đã lao ra khỏi công sự hô lớn “Nhằm thẳng quân thù mà bắn”, đơn vị anh đã bắn rơi nhiều máy bay địch, Anh bị thương nặng và đã anh dũng hy sinh.
- Ngày 1/1/1967 Nguyễn Viết Xuân được Nhà nước truy tặng Huân chương quân công hạng ba và danh hiệu AHLLVT.
Thưa các đồng chí !
Trên đây là 5 anh hùng, 5 người đoàn viên thanh niên trẻ, đại diện cho hàng trăm ngàn đoàn viên thanh niên thế hệ trẻ Việt Nam, những anh hùng, dũng sỹ thời đại Hồ Chí Minh góp phần làm nên những chiến thắng vĩ đại của dân tộc.
Trong 2 cuộc đấu tranh cách mạng lâu dài, đầy hy sinh nhưng rất vẻ vang của Quân và dân ta, các thế hệ thanh niên Việt Nam đã nối tiếp nhau xây đắp nên Truyền thống của Đoàn Thanh niên Cộng sản Hồ Chí Minh (chỉ bảng) và Truyền thống của Thanh niên Quân đội. (chỉ bảng)
Thưa toàn thể các đồng chí!
Ngày nay khi đất nước được thanh bình, nhân dân chăm lo phát triển kinh tế, xã hội dưới sự lãnh đạo sáng suốt của Đảng Cộng sản Việt Nam; lớp lớp thanh niên Việt Nam tiếp tục phát huy truyền thống cha anh đi trước, quyết tâm học tập, rèn luyện, công tác, vượt qua muôn vàn khó khăn, thử thách, gian khổ để luôn hoàn thành tốt mọi nhiệm vụ được giao; trong đó có tuổi trẻ Quân đội, họ là những tấm gương sáng trên mọi lĩnh vực của đất nước, tiếp tục phát huy truyền thống cha anh đi trước và nguyện phấn đấu xứng danh “Bộ đội Cụ Hồ” trong thời kỳ mới.
Xin mời các đồng chí quan sát trên bảng ảnh đó là những hình ảnh tiêu biểu của tuổi trẻ Quân đội trong giai đoạn hiện nay họ đang miệt mài học tập, rèn luyện, ra sức nghiên cứu làm chủ trên mọi lĩnh vực, để đáp ứng yêu cầu nhiệm vụ xây dựng Quân đội cách mạng, chính quy, tinh nhuệ, hiện đại’
+ Chúng ta có thể thấy hình ảnh người chiến sĩ Hải quân với cột mốc Trường Sa ngày đêm canh giữ biển đảo của Tổ quốc với tư thế nghiêm trang, vững trãi, hình ảnh này làm chúng ta gọi nhớ lại lời thề của Đại tướng Lê Đức Anh: “Chúng ta xin thề trước hương hồn của tổ tiên ta, trước hương hồn của cán bộ, chiến sĩ đã hy sinh vì Tổ quốc, xin hứa trước đồng bào cả nước, xin nhắn nhủ với các thế hệ mai sau: Quyết tâm bảo vệ bằng được Tổ quốc thân yêu, bảo vệ bằng được quần đảo Trường Sa - một phần lãnh thổ và lãnh hải thiêng liêng của Tổ quốc thân yêu của chúng ta”.
- Tiếp theo là các hình ảnh thể hiện các hoạt động đoàn viên thanh niên trong huấn luyện, lao động sản xuất, hội thi, hội thao, đối ngoại Quốc phòng, các hoạt động văn hóa văn nghệ… thể hiện trí tuệ, sự sáng tạo, xung kích của tuổi trẻ Quân đội xứng danh “Bộ đội Cụ Hồ”:
+ Đầu tiên là hình ảnh “Tiếp bước cha anh” về học tập, huấn luyện quân sự thể hiện tinh thần của người chiến sĩ không ngại khó khăn gian khổ với tinh thần “thao trường đổ mồ hôi, chiến trường bớt đỗ máu” những chiến sĩ của chúng ta ngày đêm luyện tập, quyết tâm hoàn thành xuất sắc nhiệm vụ huấn luyện. Sự tiếp bước cha anh đó còn thể hiện qua hình ảnh“tuổi trẻ cả nước phấn khởi lên đường nhập ngũ”, ở đó tuy những người thanh niên không còn đi ra những trận tuyến chống quân thù như lịch sử cha, ông nhưng tinh thần của những người thanh niên ngày nay thì vẫn vẹn nguyên và được tiếp nối với một lòng quyết tâm bảo vệ tổ quốc. 
+ Tiếp theo là những hình ảnh cán bộ, chiến sĩ ra sức thi đua huấn luyện giỏi, kỷ luật nghiêm, sẵn sàng đập tan mọi âm mưu thủ đoạn thâm độc của kẻ thù, bảo vệ vững chắc biên giới, vùng biển, vùng trời, thiêng liêng, bảo vệ vững chắc Tổ quốc Việt Nam XHCN (Sản xuất thành công súng đại liên PKMS ở nhà máy Z111 Tổng cục CNQP; Vượt chông gai; Bộ đội Hải quân huấn luyện SSCĐ; Một buổi huấn luyện thực hành ở Trường Sĩ quan pháo binh; Huấn luyện làm chủ khí tài trang bị VSAT ở Binh chủng TTLL; Tuổi trẻ PK-KQ trong diễn tập cứu hộ cứu nạn; Tuổi trẻ CSB Việt Nam làm nhiệm vụ chấp pháp trên biển; Bộ đội Biên phòng tuần tra bảo vệ biên cương Tổ quốc, Tuổi trẻ tập đoàn viễn thông quân đội Viettel xung kích nghiên cứu khoa học, công nghệ, chuyển đổi số; Tuổi trẻ BTL 86 tổ chức diễn tập trên không gian mạng) qua những hình ảnh cho chúng ta thấy tuổi trẻ Quân đội đang không ngừng cố gắng trong học tập, rèn luyện, làm chủ vũ khí trang bị, nâng cao trình độ năng lực, khả năng chiến đấu, sẵn sàng nhận và hoàn thành tốt các nhiệm vụ khi có tình huống xảy ra, đây cũng là cơ hội để tuổi trẻ phát huy sức mạnh tổng hợp trong xây dựng Quân đội chính quy, tinh nhuệ, hiện đại. 
Kính thưa toàn thể các đồng chí, Đoàn TNCS Hồ Chí Minh là đội dự bị tin cậy của Đảng, sự cố gắng, nỗ lực và trưởng thành của đoàn viên luôn được ghi nhận và hình ảnh một buổi lễ kết nạp Đảng trong lúc dã ngoại cho chúng ta thấy sự trưởng thành của đoàn viên thanh niên khi học tập, công tác trong môi trường Quân đội, đây cũng là hoạt động thường xuyên thể hiện sự chăm lo của Đảng đối với tuổi trẻ Quân đội. Phấn đấu được đứng vào hàng ngũ của Đảng cộng sản Việt Nam luôn là mục tiêu của tất cả cán bộ, chiến sĩ đang công tác và học tập trong môi trường Quân đội.
Xây dựng Quân đội chính quy, tinh nhuệ, hiện đại đòi hỏi có những công trình sáng kiến bảo đảm phù hợp với điều kiện tình hình mới và đó cũng là thể hiện sự sáng tạo của tuổi trẻ trong học tập và công tác, hình ảnh gương mặt tiêu biểu trong tham gia sáng kiến những công trình mới được trao tặng giải thưởng trong cuộc thi Tuổi trẻ sáng tạo trong Quân đội cho thấy phong trào thi đua trong sáng tạo, nghiên cứu khoa học đang được lan tỏa mạnh mẽ ở các đơn vị trong toàn quân, hàng năm đều có những công trình sáng kiến mới phục vụ cho nhiệm vụ huấn luyện, sẵn sàng chiến đấu đạt kết quả cao. (Lễ trao giải thưởng Tuổi trẻ sáng tạo trong quân đội) với những gương mặt trẻ tiêu biểu và gương mặt trẻ triển vọng trong toàn quân năm 2025.
Tiếp theo là những hình ảnh tiêu biểu của tuổi trẻ Quân đội thể hiện sức trẻ, xung kích tham gia các hoạt động (Hưởng ứng Ngày thể thao quân sự thế giới kết hợp chạy Olimpic ở đơn vị Quân đội; Học viên, đoàn viên Học viện Quân y trong ngày hội hiến máu tình nguyện), không chỉ vậy tuổi trẻ Quân đội còn là những chiến sĩ vừa “ Hồng” , vừa “ Chuyên”, nhiều tài năng và năng khiếu (Câu lạc bộ cắt tóc ở đơn vị).
Trong vấn đề ngoại giao quốc phòng, thanh niên quân đội ta đang ngày càng thể hiện được vị trí và vai trò của mình, đó là hình ảnh (Đội tuyển QĐND Việt Nam tham gia Hội thao quân sự Quốc tế Army games) Tại kỳ Hội thao quân sự Quốc tế Army games 2025, Đoàn Quân đội nhân dân (QĐND) Việt Nam đã thi đấu tự tin và đạt được nhiều thành tích xuất sắc, vượt mục tiêu đề ra. Bên cạnh đó thanh niên quân đội còn tích cực hợp tác về thực hiện nhiệm vụ trên biển, hay tham gia biểu diễn trong các cuộc triễn lãm về trang bị, khí tài giữa các quốc gia.
Kính thưa toàn thể các đồng chí phát huy truyền thống của tuổi trẻ Quân đội, cán bộ, đoàn viên chúng ta tự hào là người lính bảo vệ Tổ quốc, không ngừng cố gắng, phấn đấu học tập nâng cao trình độ mọi mặt, xung kích, sáng tạo, quyết tâm hoàn thành tốt mọi nhiệm vụ được giao. (Chương trình nghệ thuật cùng nhau giữ nước……)
          `
        },
        {
          title: 'Đơn vị của chúng tôi.',
          shortDesc: 'Giới thiệu thành tích, kết quả huấn luyện, sẵn sàng chiến đấu và xây dựng chính quy của Tiểu đoàn Phòng không 16.',
          image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop',
          imageCaption: 'Tiểu đoàn Phòng không 16 - Vững mạnh toàn diện, mẫu mực tiêu biểu',
          fullContent: `
           Kính thưa các thủ trưởng, thưa toàn thể các đồng chí!
Trong hành trình xây dựng và phát triển của Quân đội nhân dân Việt Nam anh hùng, dưới sự lãnh đạo trực tiếp, toàn diện của Đảng, đơn vị chúng tôi luôn tự hào là một tập thể vững mạnh, đoàn kết và thống nhất. Để làm nên những thành tích vẻ vang đó, không thể không nhắc đến sự lãnh đạo, chỉ đạo sâu sát, kịp thời của các cấp ủy đảng và sự quan tâm của cấp trên.
Phòng Hồ Chí Minh của đơn vị chúng tôi chính là “trái tim” văn hóa tinh thần, là nơi hội tụ, lưu giữ những trang sử vàng, những cột mốc trưởng thành và các thành tích vẻ vang của tập thể thể bộ, chiến sĩ qua các thời kỳ. Hôm nay, tôi rất vinh dự được đồng hành cùng các đồng chí trong quá trình tham quan và tìm hiểu về truyền thống, nhiệm vụ và các thiết chế văn hóa tại Phòng Hồ Chí Minh của đơn vị.
Trước hết, để hiểu được mạch chỉ huy thống nhất, xuyên suốt và toàn diện – vững chắc cho mọi chiến thắng của đơn vị, tôi xin giới thiệu đến toàn thể các đồng chí về tổ chức chỉ huy, lãnh đạo các cấp của chúng tôi.
Sự phát triển và trưởng thành của đơn vị chúng tôi ngày hôm nay luôn gắn liền với sự quan tâm lãnh đạo, chỉ đạo sâu sát, đáp ứng kịp thời tính chiến lược của Đảng ủy, Bộ Tư lệnh Quân đoàn và hành động quyết liệt của Ban Chỉ huy Sư đoàn. Đây là những đồng chí mẫu mực, giàu năng lực của người chỉ huy trong giai đoạn cách mạng mới.
* Thủ trưởng Bộ Tư lệnh Quân đoàn gồm 07 đồng chí:
1. Trung tướng Đào Tuấn Anh, Tư lệnh Quân đoàn.
2. Trung tướng Lê Minh Quang, Chính ủy Quân đoàn.
3. Thiếu tướng Trần Công Đức, Phó Tư lệnh kiêm TMT Quân đoàn.
4. Thiếu tướng Nguyễn Trần Long, Phó Chính ủy Quân đoàn.
5. Thiếu tướng Lê Văn Cương, Phó Tư lệnh Quân đoàn.
6. Thiếu tướng Dương Văn Quang, Phó Tư lệnh Quân đoàn.
7. Đại tá Hà Viết Liễn, Phó Tư lệnh Quân đoàn.
Dưới sự chỉ đạo mang tầm vĩ mô của Bộ Tư lệnh Quân đoàn, đơn vị chúng tôi trực thuộc sự quản lý, chỉ huy trực tiếp của Ban Chỉ huy Sư đoàn – tập thể luôn bám sát thực tiễn thao trường, sâu sát từng hoạt động của bộ đội để đưa ra những quyết định đúng đắn nhất.
	* Ban Chỉ huy Sư đoàn hiện nay:
1. Đại tá Lê Văn Quyết - Sư đoàn trưởng.
2. Đại tá Phạm Văn Hồng - Chính ủy Sư đoàn.
3. Đại tá Nguyễn Quyết Thắng - Phó Sư đoàn trưởng, TMT.
4. Đại tá Hồ Viết Quảng - Phó Chính ủy. 
5. Đại tá Hoàng Nghĩa Minh - Phó Sư đoàn trưởng
6. Thượng tá Nguyễn Trung Diện – Phó Sư đoàn trưởng
Sự lãnh đạo, chỉ đạo sâu sát của thủ trưởng các cấp chính là kim chỉ nam cho mọi hoạt động của đơn vị. Tiếp nối truyền thống và sự quan tâm đó, Tiểu đoàn chúng tôi luôn đặt mục tiêu xây dựng đơn vị vững mạnh về mọi mặt làm nhiệm vụ trọng tâm hàng đầu.
Thưa toàn thể các đồng chí!
Nhiệm vụ của Tiểu đoàn hiện nay chính là Quán triệt, thực hiện nghiêm nghị quyết, kết luận, chỉ thị, kế hoạch, hướng dẫn của cấp trên, trọng tâm là nghị quyết đại hội Đảng các cấp; chỉ đạo của đồng chí Tổng Bí thư về “2 kiên định, 2 đẩy mạnh, 2 ngăn ngừa’’ và ‘‘5 vững” và nghị quyết lãnh đạo thực hiện nhiệm vụ năm 2026 của cấp ủy các cấp.
Trong bối cảnh tình hình mới, chúng tôi luôn xác định: Chủ động khắc phục khó khăn, tổ chức thực hiện quyết liệt có hiệu quả ba đột phá. Tập trung lãnh đạo nhanh chóng ổn định về tư tưởng, tổ chức, xây dựng Tiểu đoàn vững mạnh về chính trị; thực hiện tốt nhiệm vụ chính trị, xây dựng đơn vị vững mạnh toàn diện “Mẫu mực, tiêu biểu”. Đây không chỉ là khẩu hiệu hành động mà là mệnh lệnh từ trái tim, là ý chí quyết tâm của mỗi cán bộ, chiến sĩ.
Để minh chứng cho tinh thần quyết tâm ấy, ngay sau đây, xin mời các đồng chí cùng nhìn lại những dấu ấn đậm nét qua bảng ảnh hoạt động của đơn vị trong thời gian vừa qua.
Trên đây là toàn bộ phần giới thiệu về bảng ảnh qua các mặt công tác của đơn vị. Qua đó đã cho ta thấy được những hoạt động nổi bật trong thời gian qua của đơn vị, sự cố gắng khắc phục khó khăn gian khổ của toàn thể cán bộ, chiến sĩ trong toàn Tiểu đoàn vì một mục tiêu xây dựng Tiểu đoàn VMTD “Mẫu mực, tiêu biểu”. Những hình ảnh này không chỉ ghi lại thành tích mà còn là minh chứng cho sự đoàn kết, gắn bó keo sơn giữa cán bộ và chiến sĩ, giữa hậu phương và tiền tuyến.
Kính thưa các đồng chí!
Như tôi đã nói; nếu bảng ảnh là thước phim ghi lại hành trình hoạt động, thì Phòng Hồ Chí Minh chính là “trái tim” văn hóa, tinh thần của đơn vị. Đây là nơi hội tụ tri thức, là không gian để cán bộ, chiến sĩ bồi đắp lý tưởng và rèn luyện bản lĩnh chính trị. Mỗi góc nhỏ, mỗi hiện vật tại đây đều mang một thông điệp riêng, nhắc nhở chúng ta về trách nhiệm đối với Tổ quốc và nhân dân.
Phía dưới phòng HCM của Tiểu đoàn là tủ đựng sách giáo dục pháp luật bao gồm: sách truyền thống, sách nghệ thuật quân sự các loại, tài liệu GDCT phục vụ cho cán bộ chiến sỹ trong đơn vị nghiên cứu học tập nâng cao trình độ mọi mặt. Việc đọc sách không chỉ là nhu cầu tự thân mà là yêu cầu cấp thiết để người lính thời đại mới nâng cao kiến thức, vững vàng trước mọi diễn biến phức tạp của tình hình an ninh, chính trị.
Tủ báo, tạp chí được bố trí tại góc phòng dùng để lưu các loại đầu báo theo quy định của Thông tư 138 của Bộ Quốc phòng tại phòng Hồ Chí Minh phục vụ cho cán bộ chiến sỹ đọc báo trong ngày nghỉ, giờ nghỉ. Những tờ báo, tạp chí là nhịp cầu nối đơn vị với hơi thở của thời đại, giúp chúng ta nắm bắt thông tin, cập nhật kiến thức thời sự, từ đó củng cố niềm tin vào sự lãnh đạo của Đảng.
Ngoài ra, trong phòng HCM còn trưng bày báo tường, báo ảnh, sản phẩm sáng tạo trẻ, công trình thanh niên – đây chính là sản phẩm trí tuệ, là nhiệt huyết của đoàn viên, thanh niên đoàn cơ sở. Những mô hình, công trình này khẳng định sức trẻ, sự sáng tạo và khát vọng cống hiến của thế hệ thanh niên Tiểu đoàn.
Từ những tư liệu quý báu và không gian văn hóa này, mỗi chúng ta cần biến nhận thức thành hành động cụ thể, thiết thực trong đời sống quân ngũ.
Thưa các đồng chí! Thông qua nội dung thuyết minh bảng ảnh Phòng Hồ Chí Minh, cá nhân tôi và đơn vị đã đặt ra những yêu cầu cần thiết và cần thực hiện tốt một số nội dung sau:
Một là, Nhận thức đầy đủ giá trị lịch sử truyền thống cao đẹp của dân tộc, của Đảng, của Quân đội, đơn vị, công lao to lớn của các bậc tiền nhân đã có công xây dựng đất nước, từ đó nâng cao lòng tự hào, tự tôn dân tộc.
Hai là, Tin tưởng tuyệt đối vào sự lãnh đạo của Đảng, quản lý của Nhà nước, tích cực xây dựng khối đại đoàn kết toàn dân tộc, tạo nên sức mạnh tổng hợp trong xây dựng nền quốc phòng toàn dân gắn với thế trận an ninh nhân dân vững chắc.
Ba là, Tích cực đấu tranh, phản bác các quan điểm, luận điệu sai trái, làm thất bại âm mưu “Phi chính hóa quân đội” của các thế lực thù địch, kiên quyết bảo vệ nền tảng tư tưởng của Đảng trong Quân đội.
Bốn là, Giữ vững và phát huy truyền thống tốt đẹp của “Bộ đội cụ Hồ”, xây dựng động cơ đúng đắn, tích cực, chủ động khắc phục khó khăn, tham gia huấn luyện, SSCĐ, chiến đấu, công tác, lao động sản xuất, vận động quần chúng và thực hiện các nhiệm vụ khác với chất lượng, hiệu quả cao nhất, tô thắm thêm truyền thống của Tiểu đoàn.
Kính thưa toàn thể các đồng chí!
Phòng Hồ Chí Minh của Tiểu đoàn có vai trò hết sức quan trọng trong việc nâng cao đời sống tinh thần cho cán bộ, chiến sỹ trong đơn vị. Mỗi mảng ảnh, hiện vật trong đó chất chứa rất nhiều những thành tích mà Đảng, Bác Hồ, Quân đội và nhân dân ta phải khó khăn giành lấy và đánh đổi bằng mồ hôi xương máu mới có được. Chúng ta, thế hệ trẻ hôm nay được sống trong hòa bình và tận hưởng ấm no, tự do, hạnh phúc phải luôn nhớ về lớp lớp cha anh đi trước đã phải đổ biết bao máu xương để viết nên bản thiên anh hùng ca của cách mạng Việt Nam.
Từ đó, mỗi cá nhân cần ra sức học tập nâng cao trình độ mọi mặt, thấm nhuần tư tưởng Hồ Chí Minh, sẵn sàng nhận và hoàn thành xuất sắc mọi nhiệm vụ trong mọi tình huống. Hãy biến mỗi ngày làm việc tại đơn vị thành một ngày cống hiến, hãy để truyền thống “Trung với Đảng, hiếu với dân, sẵn sàng chiến đấu hy sinh vì độc lập, tự do của Tổ quốc” mãi là ngọn đuốc soi đường cho chúng ta.
Xin cảm ơn các đồng chí đã chú ý theo dõi và lắng nghe bài thuyết minh của đơn vị!
        `
        }
      ]
    }
  },
  methods: {
    handleViewPanel(panel) {
      this.currentPanel = panel;
      this.showAlert = true;
      document.body.style.overflow = 'hidden';
    },
    
    closeAlert() {
      this.showAlert = false;
      document.body.style.overflow = 'auto';
    }
  }
}
</script>

<style scoped>
.intro-page {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 16px;
  color: #f1f5f9;
  font-family: 'Inter', system-ui, sans-serif;
  background: radial-gradient(circle at 50% 0%, #1a0f0f 0%, #0c0404 60%, #050101 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

.intro-page *, .intro-page *::before, .intro-page *::after {
  box-sizing: border-box;
}

/* Hero Section */
.hero-section {
  position: relative;
  text-align: center;
  margin-bottom: 30px;
  padding: 36px 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(139, 0, 0, 0.25) 100%);
  border: 1px solid rgba(255, 215, 0, 0.25);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 90px;
  background: #ffd700;
  filter: blur(80px);
  opacity: 0.18;
  pointer-events: none;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 215, 0, 0.12);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.35);
  padding: 5px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
}

.section-title {
  font-size: clamp(1.5rem, 2.2vw, 2.2rem);
  font-weight: 900;
  background: linear-gradient(135deg, #fff 30%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px 0;
}

.section-desc {
  color: #cbd5e1;
  font-size: clamp(0.85rem, 1.2vw, 1rem);
  max-width: 650px;
  margin: 0 auto;
}

/* Lưới 4 thẻ thông minh */
.intro-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.intro-card {
  background: rgba(22, 10, 10, 0.85);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.intro-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 15px 40px rgba(255, 215, 0, 0.15);
}

.featured-card {
  border-color: rgba(255, 215, 0, 0.35);
  background: linear-gradient(145deg, rgba(40, 8, 8, 0.9), rgba(18, 2, 2, 0.95));
}

.card-icon-wrapper {
  margin-bottom: 12px;
}

.card-icon {
  font-size: 1.5rem;
  background: rgba(255, 215, 0, 0.1);
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 215, 0, 0.25);
}

.card-title {
  color: #ffd700;
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0 0 10px 0;
}

.card-text {
  color: #cbd5e1;
  font-size: 0.86rem;
  line-height: 1.55;
  margin: 0;
}

.highlight-slogan {
  color: #ffd700;
  font-weight: 800;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.85rem;
  color: #cbd5e1;
  line-height: 1.5;
}

.bullet-dot {
  width: 5px;
  height: 5px;
  background-color: #ffd700;
  border-radius: 50%;
  margin-top: 7px;
  flex-shrink: 0;
}

.card-list strong {
  color: #f8fafc;
}

/* Exhibition Section (6 Mảng Ảnh) */
.exhibition-section {
  margin-top: 30px;
  margin-bottom: 40px;
  padding: 30px 20px;
  background: linear-gradient(180deg, rgba(20, 6, 6, 0.6) 0%, rgba(10, 2, 2, 0.9) 100%);
  border-radius: 24px;
  border: 1px solid rgba(255, 215, 0, 0.15);
}

.section-header-center {
  text-align: center;
  margin-bottom: 30px;
}

.sub-badge {
  display: inline-block;
  color: #ffd700;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 2px;
  background: rgba(255, 215, 0, 0.08);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  margin-bottom: 8px;
}

.exhibition-main-title {
  font-size: clamp(1.3rem, 1.8vw, 1.6rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 6px 0;
}

.exhibition-sub-desc {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
}

.exhibition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.exhibition-card {
  background: rgba(30, 12, 12, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.exhibition-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 215, 0, 0.5);
  background: rgba(45, 16, 16, 0.85);
}

.exhibition-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.panel-number {
  font-size: 1.1rem;
  font-weight: 900;
  color: #ffd700;
  opacity: 0.8;
}

.panel-tag {
  font-size: 0.68rem;
  font-weight: 600;
  color: #fca5a5;
  background: rgba(225, 29, 72, 0.15);
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid rgba(225, 29, 72, 0.3);
}

.panel-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.45;
  margin: 0 0 8px 0;
}

.panel-desc {
  font-size: 0.84rem;
  color: #cbd5e1;
  line-height: 1.45;
  margin: 0 0 16px 0;
  flex-grow: 1;
}

.btn-view-detail {
  background: rgba(255, 215, 0, 0.08);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.25s ease;
  width: 100%;
}

.btn-view-detail:hover {
  background: rgba(255, 215, 0, 0.18);
  border-color: #ffd700;
  transform: translateX(2px);
}

.arrow-icon {
  font-size: 0.95rem;
  transition: transform 0.2s ease;
}

.btn-view-detail:hover .arrow-icon {
  transform: translateX(3px);
}

/* ==========================================================
   MODAL CHI TIẾT MẢNG ẢNH BỐ CỤC CHIA ĐÔI THÔNG MINH
   ========================================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(14px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

.panel-detail-container {
  position: relative;
  background: linear-gradient(145deg, #240707, #0d0202);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 24px;
  width: 100%;
  max-width: 950px;
  max-height: 90vh;
  padding: 30px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.95);
  overflow: hidden;
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close-btn:hover {
  background: #e11d48;
  color: #fff;
  border-color: #fff;
}

.panel-modal-header {
  text-align: center;
  margin-bottom: 20px;
  padding-right: 40px;
  padding-left: 40px;
}

.panel-modal-badge {
  display: inline-block;
  color: #ffd700;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  background: rgba(255, 215, 0, 0.1);
  padding: 4px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  margin-bottom: 8px;
}

.panel-modal-title {
  color: #fff;
  font-size: clamp(1.1rem, 1.5vw, 1.35rem);
  font-weight: 800;
  margin: 0;
  line-height: 1.4;
}

/* Thân modal chia 2 cột: Ảnh và nội dung */
.panel-modal-body {
  display: grid;
  grid-template-columns: 42% 58%;
  gap: 24px;
  flex-grow: 1;
  overflow: hidden;
  margin-bottom: 20px;
}

.panel-media-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.panel-image-wrapper {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 10px 25px rgba(0,0,0,0.6);
  background: #000;
  height: 100%;
  max-height: 380px;
  display: flex;
  flex-direction: column;
}

.panel-featured-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.panel-image-wrapper:hover .panel-featured-img {
  transform: scale(1.03);
}

.image-caption-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%);
  padding: 12px 14px;
  font-size: 0.78rem;
  color: #fcd34d;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  text-align: left;
}

.panel-text-column {
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 14px;
  padding: 18px;
  overflow-y: auto;
  max-height: 380px;
  text-align: left;
}

/* Tùy chỉnh thanh cuộn cho phần text */
.panel-text-column::-webkit-scrollbar {
  width: 6px;
}
.panel-text-column::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.3);
  border-radius: 4px;
}

.content-prose h4 {
  color: #ffd700;
  font-size: 0.92rem;
  font-weight: 700;
  margin: 12px 0 6px 0;
}

.content-prose h4:first-child {
  margin-top: 0;
}

.content-prose p {
  color: #cbd5e1;
  font-size: 0.85rem;
  line-height: 1.55;
  margin: 0 0 10px 0;
}

.content-prose ul {
  padding-left: 18px;
  margin: 0 0 10px 0;
}

.content-prose li {
  color: #cbd5e1;
  font-size: 0.84rem;
  line-height: 1.5;
  margin-bottom: 6px;
}

.content-prose strong {
  color: #f8fafc;
}

.alert-actions {
  width: 100%;
}

.btn-alert-confirm {
  background: linear-gradient(135deg, #e11d48, #991b1b);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.5);
  padding: 11px 0;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  width: 100%;
}

.btn-alert-confirm:hover {
  background: linear-gradient(135deg, #f43f5e, #b91c1c);
  border-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

/* Modal Smooth Transitions */
.modal-modern-enter-active,
.modal-modern-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-modern-enter-active .panel-detail-container,
.modal-modern-leave-active .panel-detail-container {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.modal-modern-enter-from,
.modal-modern-leave-to {
  opacity: 0;
}

.modal-modern-enter-from .panel-detail-container,
.modal-modern-leave-to .panel-detail-container {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

@media (max-width: 850px) {
  .panel-modal-body {
    grid-template-columns: 1fr;
    overflow-y: auto;
    max-height: 60vh;
  }
  .panel-detail-container {
    max-height: 95vh;
  }
  .panel-image-wrapper {
    max-height: 220px;
  }
  .panel-text-column {
    max-height: none;
  }
}
</style>