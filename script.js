// Register Service Worker for offline asset caching and superfast page load speeds
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      console.log('ServiceWorker registered with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {

  // ---- Hamburger Menu Toggle ----
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (navMenu.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7.5px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // ---- Mobile dropdown toggles ----
  const hasDropdowns = document.querySelectorAll('.has-dropdown');
  if (window.innerWidth <= 768) {
    hasDropdowns.forEach(item => {
      const link = item.querySelector('a');
      const dropdown = item.querySelector('.dropdown');
      if (link && dropdown) {
        dropdown.style.display = 'none';
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const isOpen = dropdown.style.display === 'block';
          // Close all
          document.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
          dropdown.style.display = isOpen ? 'none' : 'block';
        });
      }
    });
  }

  // ---- Scroll to Top ----
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Sticky header shadow on scroll ----
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        siteHeader.style.boxShadow = '0 4px 20px rgba(0,0,0,0.14)';
      } else {
        siteHeader.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
      }
    });
  }

  // ---- Active nav highlighting ----
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      link.addEventListener('click', function () {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    }
  });

  // ---- Live Search Engine & Dropdown ----
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const headerSearch = document.getElementById('header-search');

  // Khai báo cơ sở dữ liệu bài viết tĩnh cho công cụ tìm kiếm
  const articlesDatabase = [
    { title: "Top 8 Khách Sạn Gần Biển Quy Nhơn Đẹp Nhất 2026", url: "khach-san-quy-nhon.html", category: "khachsan", desc: "View biển, giá hợp lý, resort sang trọng 5 sao, khách sạn trung tâm..." },
    { title: "Top 10 Bãi Biển Đẹp Nhất Quy Nhơn 2026 – Thiên Đường Biển Việt Nam", url: "bai-bien-quy-nhon.html", category: "dulich", desc: "Kỳ Co, Eo Gió, Bãi Hoàng Hậu, Hòn Khô ngắm san hô..." },
    { title: "Đặc Sản Quy Nhơn – 15 Món Ăn Nhất Định Phải Thử Xứ Nẫu", url: "dac-san-quy-nhon.html", category: "amthuc", desc: "Bánh hỏi cháo lòng, bánh xèo tôm nhảy, tré rơm, nem chợ Huyện..." },
    { title: "Eo Gió Quy Nhơn – Cẩm Nang Du Lịch Check-in Tự Túc A-Z", url: "eo-gio.html", category: "dulich", desc: "Review đường đi Nhơn Lý, giá vé cổng, hoàng hôn bình minh cực đẹp..." },
    { title: "Ghềnh Ráng Tiên Sa – Điểm Đến Thơ Mộng Lãng Mạn Nhất", url: "ghenh-rang.html", category: "dulich", desc: "Viếng mộ nhà thơ Hàn Mặc Tử, check-in Bãi Trứng tròn mịn độc lạ..." },
    { title: "Tháp Đôi Quy Nhơn – Di Tích Lịch Sử Chăm Pa Cổ Đại Huyền Bí", url: "thap-doi.html", category: "dulich", desc: "Kiến trúc tháp Chăm cổ kính độc đáo ngay trung tâm thành phố..." },
    { title: "Review Top Các Quán Ăn Ngon Nổi Tiếng Nhất Quy Nhơn 2026", url: "quan-an-quy-nhon.html", category: "amthuc", desc: "Hải sản Cine, bánh xèo Gia Vỹ, bún cá Ngọc Liên ngon rẻ..." },
    { title: "Dịch Vụ Thuê Xe Ô Tô & Gọi Xe Quy Nhơn – Bảng Giá Tự Lái & Có Tài 2026", url: "thue-xe-quy-nhon.html", category: "dichvu", desc: "Gọi xe, đặt xe, thuê xe du lịch 4 chỗ, 7 chỗ, 16 chỗ đời mới giá rẻ..." },
    { title: "Tour Du Lịch Quy Nhơn Trọn Gói 2026 – Review 5 Tour Tốt Nhất", url: "tour-quy-nhon.html", category: "dulich", desc: "Đặt tour Kỳ Co Eo Gió, Phú Yên, Tây Sơn chèo đò Hầm Hô..." },
    { title: "Thợ Sửa Điện Nước Quy Nhơn – 5 Dịch Vụ Uy Tín Phản Hồi Trong 1 Giờ", url: "sua-dien-nuoc-quy-nhon.html", category: "dichvu", desc: "Thợ sửa chập điện gia đình, rò rỉ ống nước bồn cầu lavabo 24/7..." },
    { title: "Trang Trí Gia Tiên Quy Nhơn – 8 Đơn Vị Cưới Hỏi Chuyên Nghiệp", url: "trang-tri-gia-tien.html", category: "dichvu", desc: "Trang trí tiệc cưới, gia tiên, cổng hoa, rạp cưới trọn gói..." },
    { title: "Kinh Nghiệm Mua Sắm Tại Quy Nhơn – Địa Điểm Mua Quà Đặc Sản", url: "mua-sam-quy-nhon.html", category: "amthuc", desc: "Chợ Lớn Quy Nhơn, chợ đêm Xuân Diệu, siêu thị đặc sản..." },
    { title: "Review Nhà Hàng Hải Sản Cine Quy Nhơn – Sang Trọng, View Biển", url: "hai-san-cine-quy-nhon.html", category: "amthuc", desc: "Cá ngừ đại dương nướng, tôm hùm hấp dừa ngon ngọt..." },
    { title: "Quà Tặng Đặc Sản Quy Nhơn Bình Định – Top 10 Địa Chỉ Uy Tín", url: "qua-tang-quy-nhon.html", category: "amthuc", desc: "Mua bánh ít lá gai, nem chả tré, rượu bàu đá làm quà biếu..." },
    { title: "Du Lịch Gia Lai – Cẩm Nang Khám Phá Cao Nguyên Tự Túc", url: "du-lich-gia-lai.html", category: "dulich", desc: "Hồ T'nưng Biển Hồ, núi lửa Chư Đăng Ya, ẩm thực Tây Nguyên..." },
    { title: "Thuê Homestay Quy Nhơn – Top Homestay Đẹp Giá Rẻ Sát Biển", url: "thue-homestay-quy-nhon.html", category: "khachsan", desc: "Homestay mộc mạc phong cách boho sát biển cho giới trẻ..." },
    { title: "Top 5 Chợ Nổi Tiếng Quy Nhơn – Hải Sản & Đặc Sản Giá Gốc", url: "cho-noi-tieng-quy-nhon.html", category: "dulich", desc: "Chợ Đầm Quy Nhơn, chợ Đêm, chợ Lớn, chợ làng chài Nhơn Lý..." },
    { title: "Cho Thuê Xe Máy Quy Nhơn – Top 10 Địa Chỉ Uy Tín Giá Rẻ 80k", url: "thue-xe-may-quy-nhon.html", category: "dichvu", desc: "Thuê xe máy Wave, Sirius, tay ga Vision giao nhận tận nơi..." },
    { title: "Xe Khách Limousine Quy Nhơn Gia Lai – Các Hãng Xe Tốt Nhất", url: "xe-khach-quy-nhon.html", category: "dichvu", desc: "Đặt xe giường nằm phòng VIP đi Gia Lai Pleiku, Sài Gòn..." },
    { title: "Dịch Vụ Xe Đưa Đón Sân Bay Phù Cát Quy Nhơn Trọn Gói Giá Rẻ", url: "dua-don-san-bay-quy-nhon.html", category: "dichvu", desc: "Taxi sân bay Phù Cát đi Quy Nhơn 4 chỗ 7 chỗ 16 chỗ đón đúng giờ..." },
    { title: "Tổ Chức Team Building Quy Nhơn – Kịch Bản & Địa Điểm Cực Chất", url: "team-building-quy-nhon.html", category: "dichvu", desc: "Beach game Kỳ Co, chèo SUP Hòn Khô, trekking dã ngoại..." },
    { title: "Bệnh Viện & Phòng Khám Y Tế Quy Nhơn Gia Lai Uy Tín Nhất", url: "y-te-quy-nhon.html", category: "dichvu", desc: "Cấp cứu 115, bệnh viện tỉnh Bình Định, phòng khám đa khoa Hòa Mỹ..." },
    { title: "Những Lưu Ý Quan Trọng Khi Đến Quy Nhơn & Điểm Phạt Nguội", url: "luu-y-quy-nhon.html", category: "dulich", desc: "Kinh nghiệm tắm biển an toàn, vị trí camera giao thông AI..." },
    { title: "Bảo Tàng Quang Trung Tây Sơn Bình Định – Hướng Dẫn Chi Tiết 2026", url: "bao-tang-quang-trung.html", category: "dulich", desc: "Xem nhạc võ Tây Sơn, viếng điện thờ Tam Kiệt, cây me giếng nước cổ..." },
    { title: "Đàn Tế Trời Đất Tây Sơn Bình Định – Cẩm Nang Hành Hương 2026", url: "dan-te-troi.html", category: "dulich", desc: "Lịch sử ấn sơn linh thiêng, lễ tế trời đất xin ban bảo kiếm vương triều..." },
    { title: "Tháp Dương Long Bình Định – Cụm Tháp Gạch Cao Nhất Đông Nam Á", url: "thap-duong-long.html", category: "dulich", desc: "Di tích kiến trúc Champa đỉnh cao, ba ngọn tháp gạch chạm đá sa thạch..." },
    { title: "Khu Du Lịch Sinh Thái Hầm Hô Tây Sơn – Vịnh Hạ Long Thu Nhỏ Bình Định", url: "ham-ho.html", category: "dulich", desc: "Đi thuyền chèo ngắm suối Kút, vách đá hoa granite lấp lánh, cá mương cuốn bánh tráng..." }
  ];

  // Tạo khung kết quả hiển thị dropdown
  let searchDropdown = document.createElement('div');
  searchDropdown.style.position = 'absolute';
  searchDropdown.style.top = '100%';
  searchDropdown.style.left = '0';
  searchDropdown.style.right = '0';
  searchDropdown.style.background = 'white';
  searchDropdown.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
  searchDropdown.style.borderRadius = '8px';
  searchDropdown.style.marginTop = '8px';
  searchDropdown.style.maxHeight = '300px';
  searchDropdown.style.overflowY = 'auto';
  searchDropdown.style.zIndex = '9999';
  searchDropdown.style.display = 'none';
  searchDropdown.style.border = '1px solid #eaeaea';
  
  if (headerSearch) {
    headerSearch.style.position = 'relative';
    headerSearch.appendChild(searchDropdown);
  }

  function performSearch(query) {
    query = query.toLowerCase().trim();
    if (!query) {
      searchDropdown.style.display = 'none';
      return;
    }

    const matches = articlesDatabase.filter(art => 
      art.title.toLowerCase().includes(query) || 
      art.desc.toLowerCase().includes(query)
    );

    if (matches.length > 0) {
      searchDropdown.innerHTML = matches.map(art => `
        <div style="padding: 10px 14px; border-bottom: 1px solid #f5f5f5; transition: background 0.2s; cursor: pointer;" 
             onclick="window.location.href='${art.url}'"
             onmouseover="this.style.background='#f9f9f9'"
             onmouseout="this.style.background='transparent'">
          <div style="font-weight: 700; font-size: 13px; color: #333;">${art.title}</div>
          <div style="font-size: 11px; color: #777; margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${art.desc}</div>
        </div>
      `).join('');
      searchDropdown.style.display = 'block';
    } else {
      searchDropdown.innerHTML = `<div style="padding: 14px; text-align: center; font-size: 13px; color: #999;">Không tìm thấy bài viết phù hợp</div>`;
      searchDropdown.style.display = 'block';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      performSearch(searchInput.value);
    });

    searchInput.addEventListener('focus', function() {
      if (searchInput.value.trim()) {
        performSearch(searchInput.value);
      }
    });

    // Nhấp ra ngoài đóng dropdown tìm kiếm
    document.addEventListener('click', function(e) {
      if (headerSearch && !headerSearch.contains(e.target)) {
        searchDropdown.style.display = 'none';
      }
    });
  }

  if (searchBtn && searchInput) {
    function executeSearch() {
      const q = searchInput.value.trim();
      if (!q) return;

      const qLower = q.toLowerCase();
      const matches = articlesDatabase.filter(art => 
        art.title.toLowerCase().includes(qLower) || 
        art.desc.toLowerCase().includes(qLower)
      );

      if (matches.length > 0) {
        // Mở trực tiếp bài viết phù hợp nhất ngay lập tức
        window.location.href = matches[0].url;
      } else {
        // Nếu ở trang khác, về trang chủ kèm tham số từ khóa
        if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('top10quynhon/')) {
          window.location.href = 'index.html?search=' + encodeURIComponent(q);
        } else {
          filterBySearchKeyword(q);
        }
      }
    }

    searchBtn.addEventListener('click', function() {
      executeSearch();
    });

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        executeSearch();
      }
    });
  }

  // Tự động kiểm tra tham số tìm kiếm từ URL (?search=...) khi tải trang chủ
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  if (searchParam && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('top10quynhon/'))) {
    if (searchInput) {
      searchInput.value = searchParam;
      setTimeout(() => { filterBySearchKeyword(searchParam); }, 200);
    }
  }

  function filterBySearchKeyword(keyword) {
    keyword = keyword.toLowerCase().trim();
    if (!keyword) return;

    // Chọn tất cả các thẻ nội dung trên trang chủ
    const cards = document.querySelectorAll('.transport-card, .food-main-card, .food-side-item, .utility-item, .category-card, .event-item, .place-card, .card');
    let count = 0;
    
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(keyword)) {
        card.style.display = '';
        card.style.opacity = '1';
        count++;
      } else {
        card.style.display = 'none';
      }
    });

    if (searchDropdown) searchDropdown.style.display = 'none';
    
    // Nếu không tìm thấy thẻ nào khớp từ khóa ngẫu nhiên, tự động khôi phục giao diện và hiển thị thông báo
    if (count === 0 && cards.length > 0) {
      alert('Không tìm thấy bài viết phù hợp với từ khóa "' + keyword + '". Hệ thống sẽ hiển thị toàn bộ cẩm nang du lịch cho bạn!');
      cards.forEach(card => { card.style.display = ''; card.style.opacity = '1'; });
    }
  }

  // ---- Category Tabs Filter (index.html) ----
  const tabButtons = document.querySelectorAll('.tab-btn, .tab-pill-btn');
  if (tabButtons.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Đổi active class cho tất cả các nút tab
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        const cards = document.querySelectorAll('.filter-card, .transport-card, .food-main-card, .food-side-item, .utility-item, .category-card, .event-item, .place-card');

        cards.forEach(card => {
          const cat = card.getAttribute('data-cat') || '';
          const html = card.innerHTML.toLowerCase();
          const href = (card.getAttribute('href') || '').toLowerCase();
          

          if (filterValue === 'all' || cardCat === filterValue) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Topbar marquee effect ----
  const topbarText = document.querySelector('.topbar-text');
  if (topbarText) {
    topbarText.style.overflow = 'hidden';
  }

  // ---- Card click ripple ----
  // Removed e.preventDefault() to allow real page navigation on card banners

  console.log('Top 10 Quy Nhơn website loaded successfully ✅');
});
