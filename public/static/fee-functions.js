// 회비 관리 전용 함수들 (독립 파일)
// 이 파일이 app.js보다 먼저 로드됩니다

console.log('✅ 회비 함수 파일 로드 시작');

// 회비 설정 모달
window.showFeeSettingModal = function() {
  console.log('✅✅✅ 회비 설정 모달 호출됨!');
  const currentYear = new Date().getFullYear();
  const setting = window.app?.data?.feeSetting || {};
  const modalContainer = document.getElementById('modalContainer');
  
  if (!modalContainer) {
    alert('⚠️ modalContainer를 찾을 수 없습니다');
    return;
  }
  
  modalContainer.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="bg-purple-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 class="text-xl font-bold">회비 설정</h2>
          <button onclick="closeModal()" class="text-white hover:text-gray-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">회비 년도</label>
            <input type="number" id="feeSettingYear" value="${setting.year || currentYear}" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">연회비 금액</label>
            <input type="number" id="feeSettingAmount" value="${setting.amount || 50000}" step="10000"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">설명 (선택)</label>
            <textarea id="feeSettingDescription" rows="3" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="예: 2026년 연회비">${setting.description || ''}</textarea>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
          <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">취소</button>
          <button onclick="window.saveFeeSetting()" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">저장</button>
        </div>
      </div>
    </div>
  `;
  modalContainer.style.display = 'flex';
  console.log('✅ 모달 HTML 생성 완료');
};

// 회비 설정 저장
window.saveFeeSetting = async function() {
  console.log('✅ 회비 설정 저장 호출됨');
  const year = parseInt(document.getElementById('feeSettingYear').value);
  const amount = parseInt(document.getElementById('feeSettingAmount').value);
  const description = document.getElementById('feeSettingDescription').value.trim();
  
  if (!year || year < 2020 || year > 2100) {
    alert('올바른 년도를 입력해주세요');
    return;
  }
  if (!amount || amount <= 0) {
    alert('올바른 금액을 입력해주세요');
    return;
  }
  
  try {
    await axios.post('/api/fees/settings', { year, amount, description: description || null });
    alert('✅ 회비 설정이 저장되었습니다');
    closeModal();
    location.reload();
  } catch (error) {
    console.error('❌ 회비 설정 저장 오류:', error);
    alert('회비 설정 저장 실패: ' + (error.response?.data?.error || error.message));
  }
};

// 납부 등록 모달
window.showPayFeeModal = function(memberId = null) {
  console.log('✅✅✅ 납부 등록 모달 호출됨! memberId:', memberId);
  const currentYear = new Date().getFullYear();
  const todayDate = new Date().toISOString().split('T')[0];
  const setting = window.app?.data?.feeSetting || {};
  const members = window.app?.data?.members || [];
  const modalContainer = document.getElementById('modalContainer');
  
  if (!modalContainer) {
    alert('⚠️ modalContainer를 찾을 수 없습니다');
    return;
  }
  
  console.log('회원 수:', members.length);
  
  let memberSelect = '';
  if (!memberId) {
    memberSelect = `
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">회원 선택 <span class="text-red-500">*</span></label>
        <select id="feePaymentMemberId" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
          <option value="">회원을 선택하세요 (${members.length}명)</option>
          ${members.map(m => `<option value="${m.id}">${m.name} (${m.club})</option>`).join('')}
        </select>
      </div>
    `;
  } else {
    const member = members.find(m => m.id === memberId);
    memberSelect = `
      <div class="bg-blue-50 p-3 rounded">
        <p class="text-sm text-gray-600">선택된 회원</p>
        <p class="font-bold">${member ? member.name + ' (' + member.club + ')' : '회원 정보 없음'}</p>
      </div>
      <input type="hidden" id="feePaymentMemberId" value="${memberId}">
    `;
  }
  
  modalContainer.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 class="text-xl font-bold">회비 납부 등록</h2>
          <button onclick="closeModal()" class="text-white hover:text-gray-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="p-6 space-y-4">
          ${memberSelect}
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">년도</label>
              <input type="number" id="feePaymentYear" value="${currentYear}" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">금액</label>
              <input type="number" id="feePaymentAmount" value="${setting.amount || 50000}" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">납부일</label>
            <input type="date" id="feePaymentDate" value="${todayDate}" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">메모 (선택)</label>
            <textarea id="feePaymentNote" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="예: 현금 납부, 계좌이체 등"></textarea>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
          <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">취소</button>
          <button onclick="window.processFeePayment()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">등록</button>
        </div>
      </div>
    </div>
  `;
  modalContainer.style.display = 'flex';
  console.log('✅ 모달 HTML 생성 완료');
};

// 회비 납부 처리
window.processFeePayment = async function() {
  console.log('✅ 회비 납부 처리 호출됨');
  const memberId = document.getElementById('feePaymentMemberId').value;
  const year = parseInt(document.getElementById('feePaymentYear').value);
  const amount = parseInt(document.getElementById('feePaymentAmount').value);
  const paymentDate = document.getElementById('feePaymentDate').value;
  const note = document.getElementById('feePaymentNote').value.trim();
  
  console.log('납부 정보:', { memberId, year, amount, paymentDate, note });
  
  if (!memberId) {
    alert('회원을 선택해주세요');
    return;
  }
  if (!amount || amount <= 0) {
    alert('올바른 금액을 입력해주세요');
    return;
  }
  
  try {
    const response = await axios.post('/api/fees/payments', {
      memberId: parseInt(memberId),
      year,
      amount,
      paymentDate,
      note: note || null
    });
    console.log('✅ 서버 응답:', response.data);
    alert('✅ 회비 납부가 등록되었습니다!');
    closeModal();
    location.reload();
  } catch (error) {
    console.error('❌ 회비 납부 등록 오류:', error);
    alert('회비 납부 등록 실패: ' + (error.response?.data?.error || error.message));
  }
};

// 특정 회원 납부 등록
window.payFeeForMember = function(memberId) {
  console.log('✅ 특정 회원 납부 등록 호출:', memberId);
  window.showPayFeeModal(memberId);
};

// 납부 내역 삭제
window.deleteFeePayment = async function(id) {
  console.log('✅ 납부 내역 삭제 호출:', id);
  if (!confirm('이 납부 내역을 삭제하시겠습니까?')) return;
  
  try {
    await axios.delete('/api/fees/payments/' + id);
    alert('✅ 납부 내역이 삭제되었습니다');
    location.reload();
  } catch (error) {
    console.error('❌ 납부 내역 삭제 오류:', error);
    alert('납부 내역 삭제 실패');
  }
};

// 미납자 문자 발송
window.sendUnpaidSMS = async function() {
  console.log('✅ 미납자 문자 발송 호출됨');
  const unpaidMembers = window.app?.data?.feeStats?.unpaidMembers || [];
  
  if (unpaidMembers.length === 0) {
    alert('미납자가 없습니다');
    return;
  }
  
  alert(`미납자 ${unpaidMembers.length}명에게 문자를 발송합니다 (구현 예정)`);
};

console.log('✅✅✅ 모든 회비 함수가 window 객체에 등록 완료!');
console.log('테스트:', typeof window.showFeeSettingModal, typeof window.showPayFeeModal);

