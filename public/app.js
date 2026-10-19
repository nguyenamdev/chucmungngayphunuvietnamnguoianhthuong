(() => {
  const eyebrow = document.querySelector('.hero .eyebrow');
  if (eyebrow) {
    const portrait = document.createElement('img');
    portrait.className = 'hero-photo';
    portrait.src = 'images/e.jpg';
    portrait.alt = 'Ảnh của em';
    const label = eyebrow.textContent;
    const marker = label.lastIndexOf('em');
    if (marker >= 0) {
      eyebrow.replaceChildren(
        document.createTextNode(label.slice(0, marker)),
        portrait,
        document.createTextNode(label.slice(marker + 2))
      );
    }
  }

  const invitation = [...document.querySelectorAll('.hero > p')].find(p => p.textContent.includes('Anh có một lời mời nhỏ'));
  if (invitation) {
    const preview = document.createElement('section');
    preview.className = 'media-preview';
    preview.setAttribute('aria-label', 'Video xem trước cùng bài hát');
    preview.innerHTML = '<div class="media-frame"><div class="media-placeholder"><span class="media-flower" aria-hidden="true">🌷</span><strong>Khoảnh khắc dành riêng cho em</strong><span>Chọn một đoạn video để xem trước</span></div><video class="media-video" controls playsinline preload="metadata" hidden></video></div><div class="media-controls"><label class="media-button">▣ <span>Chọn video</span><input class="video-picker" type="file" accept="video/*"></label><span class="media-status" role="status">Chọn video từ thiết bị để xem trước.</span></div><div class="media-song"><h2>♫ Bài hát dành cho em</h2><iframe src="https://www.youtube-nocookie.com/embed/281y76Qw1a8?rel=0" title="Bài hát dành cho em trên YouTube" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>';
    invitation.replaceWith(preview);

    const video = preview.querySelector('.media-video');
    const placeholder = preview.querySelector('.media-placeholder');
    const status = preview.querySelector('.media-status');
    let videoUrl;

    preview.querySelector('.video-picker').addEventListener('change', event => {
      const file = event.currentTarget.files[0];
      if (!file) return;
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      videoUrl = URL.createObjectURL(file);
      video.src = videoUrl;
      video.hidden = false;
      placeholder.hidden = true;
      status.textContent = file.name;
    });

  }

  const petals = document.getElementById('petals');
  const flowers = ['🌸','🌷','🌹','🌼','🌺','✿'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('span'); p.className = 'petal';
    p.textContent = flowers[i % flowers.length];
    p.style.left = (Math.random() * 100) + '%';
    p.style.animationDuration = (12 + Math.random() * 18) + 's';
    p.style.animationDelay = (-Math.random() * 25) + 's';
    p.style.fontSize = (16 + Math.random() * 18) + 'px';
    petals.appendChild(p);
  }
  const dateInput = document.querySelector('[name="date"]');
  const localToday = new Date();
  dateInput.min = [localToday.getFullYear(), String(localToday.getMonth()+1).padStart(2,'0'), String(localToday.getDate()).padStart(2,'0')].join('-');
  const planKey = 'hoa20-plan-v1', notesKey = 'hoa20-notes-v1';
  const safe = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  function showPlan(plan) {
    const target = document.getElementById('savedPlan');
    if (!plan) { target.hidden = true; return; }
    target.hidden = false;
    target.innerHTML = '<div style="margin-top:24px;padding:18px;border-radius:16px;background:#fff0f5;text-align:center;line-height:1.8"><strong>💗 Lời hẹn đã lưu trên thiết bị này</strong><br>' + safe(plan.name) + ' · ' + safe(plan.date) + ' · ' + safe(plan.time) + '<br>' + safe(plan.activity) + (plan.note ? '<br><em>' + safe(plan.note) + '</em>' : '') + '<p><button class="btn" id="calendarBtn" type="button">Thêm vào lịch của em ♡</button></p><small>Đây là bản lưu trên trình duyệt này. Hãy gửi anh ảnh chụp hoặc chia sẻ lời hẹn để anh cùng xác nhận nhé.</small></div>';
    document.getElementById('calendarBtn').addEventListener('click', () => {
      const start = new Date(plan.date + 'T' + (/^\d\d:\d\d$/.test(plan.time) ? plan.time : '18:00'));
      if (Number.isNaN(start.getTime())) return;
      const end = new Date(start.getTime() + 2*60*60*1000);
      const stamp = d => d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'T'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'00';
      const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ngan Hoa Danh Cho Em//VI','BEGIN:VEVENT','UID:hoa20-'+Date.now()+'@local','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+('Buổi hẹn của chúng mình').replace(/[,;]/g,' '),'DESCRIPTION:'+('Hoạt động: '+plan.activity+'. '+(plan.note||'')).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/[,;]/g,' '),'END:VEVENT','END:VCALENDAR'].join('\r\n');
      const url = URL.createObjectURL(new Blob([ics], {type:'text/calendar;charset=utf-8'}));
      const a = document.createElement('a'); a.href = url; a.download = 'loi-hen-cua-chung-minh.ics'; a.click(); URL.revokeObjectURL(url);
    });
  }
  const previous = read(planKey); if (previous) showPlan(previous);
  document.getElementById('dateForm').addEventListener('submit', e => {
    e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (data.date < dateInput.min) { document.getElementById('formStatus').textContent = 'Em chọn ngày hôm nay hoặc một ngày sắp tới nhé.'; return; }
    localStorage.setItem(planKey, JSON.stringify(data)); showPlan(data);
    document.getElementById('formStatus').textContent = 'Đã lưu lời hẹn trên thiết bị này 💗 Em có thể thêm vào lịch hoặc gửi anh ảnh chụp lời hẹn nhé.';
  });
  function renderNotes() {
    const notes = read(notesKey) || [];
    document.getElementById('notes').innerHTML = notes.slice().reverse().map(n => '<div class="entry"><div><strong>🌸 '+safe(n.sender)+'</strong><small>'+safe(n.when)+'</small></div><div>'+safe(n.message)+'</div></div>').join('') || '<p class="count">Chưa có lời nhắn nào — em là người đầu tiên nhé 💌</p>';
  }
  document.getElementById('noteForm').addEventListener('submit', e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.currentTarget).entries());
    const notes = read(notesKey) || []; notes.push({...d, when:new Date().toLocaleString('vi-VN')});
    localStorage.setItem(notesKey, JSON.stringify(notes.slice(-30))); renderNotes(); e.currentTarget.reset();
    document.getElementById('noteStatus').textContent = 'Lời nhắn đã được lưu trên thiết bị này 🌷';
  });
  renderNotes();
})();