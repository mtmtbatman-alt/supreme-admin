document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAdminAuth();
    if (!user) return;

    await loadBanners();
});

// 1. 배너 목록 불러오기
async function loadBanners() {
    const { data, error } = await supabaseClient
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

    const grid = document.getElementById('bannerGrid');
    grid.innerHTML = '';

    if (error || !data || data.length === 0) {
        grid.innerHTML = '<p style="color: #aaa;">등록된 배너가 없습니다.</p>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'banner-card';

        const img = document.createElement('img');
        img.src = item.image_url;
        img.alt = item.title;

        const body = document.createElement('div');
        body.className = 'banner-card-body';

        const h4 = document.createElement('h4');
        h4.textContent = item.title;

        const pLink = document.createElement('p');
        pLink.textContent = item.link_url ? `링크: ${item.link_url}` : '연결 링크 없음';

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-danger-sm';
        btnDelete.textContent = '배너 삭제';
        btnDelete.onclick = () => deleteBanner(item.id, item.image_url);

        body.appendChild(h4);
        body.appendChild(pLink);
        body.appendChild(btnDelete);

        card.appendChild(img);
        card.appendChild(body);

        grid.appendChild(card);
    });
}

// 2. 파일 업로드 및 배너 저장 (한글 파일명 방지 안전 처리)
document.getElementById('addBannerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('bannerTitle').value;
    const linkUrl = document.getElementById('bannerLink').value;
    const fileInput = document.getElementById('bannerFile');
    const file = fileInput.files[0];

    if (!file) {
        alert("이미지 파일을 선택해 주세요.");
        return;
    }

    // [한글 파일명 오류 해결] 확장자만 추출하고 영문/숫자로 파일명 안전 변환
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    // A. Supabase Storage 버킷에 파일 업로드
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('banners')
        .upload(fileName, file);

    if (uploadError) {
        alert("이미지 업로드 실패: " + uploadError.message);
        return;
    }

    // B. 업로드된 파일의 공개 URL 가져오기
    const { data: urlData } = supabaseClient.storage
        .from('banners')
        .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // C. DB의 banners 테이블에 정보 저장
    const { error: dbError } = await supabaseClient
        .from('banners')
        .insert([{
            title: title,
            link_url: linkUrl,
            image_url: imageUrl
        }]);

    if (dbError) {
        alert("DB 저장 실패: " + dbError.message);
        return;
    }

    alert("배너가 성공적으로 등록되었습니다!");
    closeModal();
    document.getElementById('addBannerForm').reset();
    await loadBanners();
});

// 3. 배너 삭제
async function deleteBanner(id, imageUrl) {
    if (!confirm("정말 이 배너를 삭제하시겠습니까?")) return;

    const { error } = await supabaseClient
        .from('banners')
        .delete()
        .eq('id', id);

    if (error) {
        alert("삭제 실패: " + error.message);
        return;
    }

    alert("삭제되었습니다.");
    await loadBanners();
}

function openModal() { document.getElementById('bannerModal').style.display = 'flex'; }
function closeModal() { document.getElementById('bannerModal').style.display = 'none'; }