(function () {
  'use strict';

  // ---------- 主题 ----------
  const THEME_KEY = 'resume-theme';
  const getStoredTheme = () => localStorage.getItem(THEME_KEY);
  const setStoredTheme = (v) => { try { localStorage.setItem(THEME_KEY, v); } catch (e) {} };
  const getSystemTheme = () => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    const next = theme || getStoredTheme() || getSystemTheme();
    document.documentElement.setAttribute('data-theme', next);
    const iconLight = document.querySelector('.theme-icon-light');
    const iconDark = document.querySelector('.theme-icon-dark');
    if (iconLight) iconLight.style.display = next === 'dark' ? 'none' : 'inline-block';
    if (iconDark) iconDark.style.display = next === 'dark' ? 'inline-block' : 'none';
    return next;
  }

  function initTheme() {
    const stored = getStoredTheme();
    const theme = applyTheme(stored);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        setStoredTheme(next);
        applyTheme(next);
      });
    }
    const darkQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (darkQuery && !stored) darkQuery.addEventListener('change', function () { applyTheme(getSystemTheme()); });
  }

  // ---------- 滚动进度条 ----------
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    function update() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = p + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ---------- 导航栏滚动样式 + 锚点高亮 ----------
  const SECTION_IDS = ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'awards', 'contact'];

  function getHeroHalf() {
    const hero = document.getElementById('hero');
    return hero ? hero.offsetHeight * 0.5 : 300;
  }

  function updateHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    if (window.scrollY > getHeroHalf()) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }

  function updateActiveNav() {
    const y = window.scrollY + 120;
    let current = 'hero';
    for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
      const el = document.getElementById(SECTION_IDS[i]);
      if (el && el.offsetTop <= y) {
        current = SECTION_IDS[i];
        break;
      }
    }
    document.querySelectorAll('.nav-link, .nav-sidebar-link').forEach(function (a) {
      const section = a.getAttribute('href');
      if (section && section.startsWith('#')) {
        const id = section.slice(1);
        a.classList.toggle('active', id === current);
        if (a.classList.contains('nav-link')) a.setAttribute('aria-current', id === current ? 'true' : null);
      }
    });
  }

  // ---------- 平滑滚动 ----------
  function smoothScrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function initNavLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const id = href.slice(1);
      if (!id) return;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        smoothScrollTo(id);
        closeSidebar();
      });
    });
  }

  // ---------- 移动端侧边栏 ----------
  const sidebar = document.getElementById('nav-sidebar');
  const overlay = document.getElementById('nav-overlay');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle) navToggle.addEventListener('click', openSidebar);
  if (navClose) navClose.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // ---------- 实习经历移动端展开/收起 ----------
  document.querySelectorAll('.timeline-expand-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.timeline-card');
      var expanded = card && card.classList.toggle('timeline-expanded');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.textContent = expanded ? '收起' : '展开详情';
    });
  });

  // ---------- PDF 下拉 ----------
  const pdfTrigger = document.getElementById('pdf-menu-trigger');
  const pdfDropdown = document.getElementById('pdf-dropdown');
  if (pdfTrigger && pdfDropdown) {
    pdfTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = !pdfDropdown.hidden;
      pdfDropdown.hidden = open;
      if (!open) {
        var close = function () {
          pdfDropdown.hidden = true;
          document.removeEventListener('click', close);
        };
        setTimeout(function () { document.addEventListener('click', close); }, 0);
      }
    });
  }

  // ---------- 入场动画 + 时间轴节点高亮 ----------
  const observerOpts = { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 };
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        var fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          var val = fill.getAttribute('data-value');
          if (val) {
            entry.target.style.setProperty('--skill-value', val + '%');
          }
        }
      }
    });
  }, observerOpts);

  function initObserve() {
    document.querySelectorAll('.observe').forEach(function (el) { observer.observe(el); });
    document.querySelectorAll('.timeline-item').forEach(function (el) { observer.observe(el); });
    document.querySelectorAll('.skill-item').forEach(function (el) { observer.observe(el); });
  }

  // ---------- 项目筛选 ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectData = {
    '五酿公司营销策划全案': {
      name: '五酿公司营销策划全案',
      meta: '2025.09-2025.11 | 核心策划负责人',
      category: '营销策划',
      background: '基于四川五酿藏酒供应链管理有限公司需求，开展营销策划全案项目，精准定位目标客群并输出可落地的营销策略。',
      role: '核心策划负责人，统筹5人项目团队，负责市场分析、目标客群定位、核心营销策略三大章节撰写。',
      work: ['主导项目前期市场调研、竞品分析与用户画像搭建', '通过问卷调研、案头研究与深度访谈，精准定位「奋斗中的中青年商务人士」为产品核心目标客群', '负责策划案中市场分析、目标客群定位、核心营销策略三大核心章节的撰写', '协调内外部资源，保障项目按时高质量交付'],
      results: ['方案成功获得四川五酿藏酒供应链管理有限公司官方采纳并落地执行', '获得客户官方采纳证明', '全案逻辑严谨、数据详实、可落地性强'],
      summary: '通过系统的市场研究与策略撰写能力，输出获客户官方采纳的营销策划全案，体现从调研到落地的完整操盘能力。'
    },
    '国内抖店独立店铺全链路运营': {
      name: '国内抖店独立店铺全链路运营',
      meta: '2024.07-2024.12 | 店铺运营负责人',
      category: '电商运营',
      background: '负责抖音小店日常全链路运营，涵盖商品优化、巨量千川投放与大促活动策划，提升店铺GMV与转化效率。',
      role: '店铺运营负责人，全权负责抖音小店日常运营、付费投放与营销活动策划。',
      work: ['全权负责商品上下架、主图与详情页内容优化、商品标题SEO优化', '熟练运用巨量千川平台进行付费广告投放，通过多组A/B测试持续优化投放素材、人群定向与出价策略', '结合618、双11等大促节点，策划专属店铺营销活动与直播带货配合方案'],
      results: ['投放效率提升20%，用户转化成本降低15%', '店铺日均订单量增长30%，月度销售额提升40%', '商品点击率与下单转化率有效提升'],
      summary: '通过数据驱动的投放优化与活动策划，实现投放ROI与销售额双提升，具备电商全链路运营能力。'
    },
    '跨境电商运营（泰国市场）': {
      name: '跨境电商运营（泰国市场）',
      meta: '2024.01-2024.06 | 选品与运营负责人',
      category: '电商运营',
      background: '基于Shopee泰国站，负责选品、库存与供应链管理、店铺数据运营，提升店铺GMV与利润率。',
      role: '选品与运营负责人，主导店铺选品策略与日常数据运营。',
      work: ['基于Shopee平台泰国站大数据，深度分析东南亚消费趋势与用户偏好', '主导店铺选品策略与商品上架优化，累计完成120+SKU的筛选、优化与上架', '通过ERP系统实现店铺库存动态管理，优化订单履约全流程', '每日监控店铺流量、转化、客单价等核心数据，每周输出数据复盘报告'],
      results: ['完成120+SKU筛选、优化与上架', '有效提升订单响应时效，大幅降低店铺滞销库存比例', '店铺库存健康度与GMV、利润率持续提升'],
      summary: '具备跨境电商选品、供应链与数据运营的完整经验，能独立完成店铺健康度与业绩提升。'
    }
  };

  function initProjectFilters() {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
        projectCards.forEach(function (card) {
          var cat = card.getAttribute('data-category');
          card.classList.toggle('hidden', filter !== 'all' && cat !== filter);
        });
      });
    });
  }

  // ---------- 项目模态框 ----------
  const modal = document.getElementById('project-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  function openModal(data) {
    if (!modal || !modalBody || !data) return;
    modalBody.innerHTML =
      '<h3 id="modal-title" class="project-name">' + escapeHtml(data.name) + '</h3>' +
      '<p class="project-meta">' + escapeHtml(data.meta) + '</p>' +
      '<h4 class="edu-detail-head">项目背景</h4><p>' + escapeHtml(data.background) + '</p>' +
      '<h4 class="edu-detail-head">我的职责</h4><p>' + escapeHtml(data.role) + '</p>' +
      '<h4 class="edu-detail-head">核心工作</h4><ul>' + data.work.map(function (w) { return '<li>' + escapeHtml(w) + '</li>'; }).join('') + '</ul>' +
      '<h4 class="edu-detail-head">成果展示</h4><ul>' + data.results.map(function (r) { return '<li>' + escapeHtml(r) + '</li>'; }).join('') + '</ul>' +
      '<h4 class="edu-detail-head">项目总结</h4><p>' + escapeHtml(data.summary) + '</p>';
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('open'); });
    document.body.style.overflow = 'hidden';
    modalClose && modalClose.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { modal.hidden = true; }, 300);
  }

  function escapeHtml(s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  projectCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var name = card.querySelector('.project-name');
      if (name && projectData[name.textContent.trim()]) openModal(projectData[name.textContent.trim()]);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  // ---------- 技能分类切换 ----------
  const skillsTabs = document.querySelectorAll('.skills-tab');
  const skillsPanels = document.querySelectorAll('.skills-panel');
  skillsTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var t = tab.getAttribute('data-tab');
      skillsTabs.forEach(function (tb) {
        tb.classList.toggle('active', tb === tab);
        tb.setAttribute('aria-selected', tb === tab ? 'true' : 'false');
      });
      skillsPanels.forEach(function (panel) {
        var id = panel.id;
        var show = id === 'panel-' + t;
        panel.classList.toggle('active', show);
        panel.hidden = !show;
      });
    });
  });

  // ---------- 联系表单 ----------
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit');
  const toast = document.getElementById('submit-toast');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(id, msg) {
    var el = document.getElementById(id);
    var input = document.getElementById('form-' + id.replace('error-', ''));
    if (el) el.textContent = msg || '';
    if (input) {
      input.classList.remove('success');
      input.classList.toggle('error', !!msg);
    }
  }

  function validateField(name, value) {
    if (name === 'name') return value.trim().length > 0 ? '' : '请输入姓名';
    if (name === 'email') {
      if (!value.trim()) return '请输入邮箱';
      return emailRe.test(value.trim()) ? '' : '请输入有效的邮箱地址';
    }
    if (name === 'subject') return value ? '' : '请选择留言主题';
    if (name === 'message') return value.trim().length > 0 ? '' : '请输入留言内容';
    return '';
  }

  function validateForm() {
    var name = document.getElementById('form-name');
    var email = document.getElementById('form-email');
    var subject = document.getElementById('form-subject');
    var message = document.getElementById('form-message');
    var ok = true;
    ['name', 'email', 'subject', 'message'].forEach(function (f) {
      var input = document.getElementById('form-' + f);
      var errEl = document.getElementById('error-' + f);
      var val = input ? input.value : '';
      var err = validateField(f, val);
      if (errEl) errEl.textContent = err;
      if (input) {
        input.classList.remove('error', 'success');
        if (err) ok = false;
        else input.classList.add('success');
      }
    });
    if (submitBtn) submitBtn.disabled = !ok;
    return ok;
  }

  if (form) {
    ['name', 'email', 'subject', 'message'].forEach(function (f) {
      var input = document.getElementById('form-' + f);
      if (input) input.addEventListener('input', validateForm);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;
      var name = (document.getElementById('form-name') && document.getElementById('form-name').value) || '';
      var email = (document.getElementById('form-email') && document.getElementById('form-email').value) || '';
      var subject = (document.getElementById('form-subject') && document.getElementById('form-subject').value) || '';
      var message = (document.getElementById('form-message') && document.getElementById('form-message').value) || '';
      if (submitBtn) {
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;
      }
      var mailto = 'mailto:zhaomengxi@stu.scu.edu.cn?subject=' + encodeURIComponent('【简历网站留言】' + subject) +
        '&body=' + encodeURIComponent('姓名：' + name + '\n邮箱：' + email + '\n主题：' + subject + '\n\n留言内容：\n' + message);
      window.location.href = mailto;
      if (submitBtn) {
        submitBtn.textContent = '发送留言';
        submitBtn.disabled = false;
      }
      if (toast) {
        toast.hidden = false;
        setTimeout(function () {
          toast.hidden = true;
          form.reset();
          document.querySelectorAll('.form-error').forEach(function (el) { el.textContent = ''; });
          document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(function (el) {
            el.classList.remove('error', 'success');
          });
        }, 2000);
      }
    });
  }

  // ---------- 滚动监听 ----------
  function onScroll() {
    updateHeaderScroll();
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // ---------- 图片：头像与项目封面（有图则显示，无图或加载失败则保留默认渐变）----------
  var heroImg = document.getElementById('hero-avatar-img');
  if (heroImg) {
    if (heroImg.complete && heroImg.naturalWidth > 0) {
      heroImg.classList.remove('hide');
    } else {
      heroImg.onload = function () { heroImg.classList.remove('hide'); };
      heroImg.onerror = function () { heroImg.classList.add('hide'); };
    }
  }
  document.querySelectorAll('.project-cover-img').forEach(function (img) {
    img.onload = function () { img.classList.add('loaded'); };
    img.onerror = function () { img.classList.add('hide'); };
  });

  // ---------- 初始化 ----------
  initTheme();
  initScrollProgress();
  initNavLinks();
  initObserve();
  initProjectFilters();
  updateHeaderScroll();
  updateActiveNav();
})();
