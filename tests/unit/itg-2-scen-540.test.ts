import { detectAndClassifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-540
  test('[normal] 複数の不整合パターンに同時に該当するデータが最も重要度の高いパターンに分類される', () => {
    const testCustomerRecord = {
      customerId: 'CUST-001',
      firstName: '山田',
      lastName: '太郎',
      fullName: '山田太郎',
      address: '東京都渋谷区1-1-1',
      phoneNumber: '09012345678',
      email: 'yamada@example.com'
    };

    const duplicateCandidates = [
      {
        candidateId: 'CAND-001',
        firstName: '山田',
        lastName: '太郎',
        fullName: '山田太郎',
        address: '東京都渋谷区1-1-1',
        phoneNumber: '09012345678',
        email: 'yamada.other@example.com',
        patternType: 'EXACT_MATCH',
        priorityLevel: 1,
        matchScore: 100
      },
      {
        candidateId: 'CAND-002',
        firstName: '山田',
        lastName: '太郎',
        fullName: '山田太郎',
        address: '東京都新宿区2-2-2',
        phoneNumber: '09087654321',
        email: 'yamada2@example.com',
        patternType: 'NAME_MATCH_ONLY',
        priorityLevel: 2,
        matchScore: 60
      },
      {
        candidateId: 'CAND-003',
        firstName: '太郎',
        lastName: '田中',
        fullName: '太郎田中',
        address: '神奈川県横浜市1-1-1',
        phoneNumber: '09012345678',
        email: 'taro@example.com',
        patternType: 'PHONE_MATCH_ONLY',
        priorityLevel: 3,
        matchScore: 40
      }
    ];

    const classificationResult = detectAndClassifyDuplicateCustomers(
      testCustomerRecord,
      duplicateCandidates
    );

    expect(classificationResult.patternType).toBe('EXACT_MATCH');
    expect(classificationResult.priorityLevel).toBe(1);
    expect(classificationResult.selectedCandidateId).toBe('CAND-001');
    expect(classificationResult.matchScore).toBe(100);
    expect(classificationResult.classificationConfidence).toBeGreaterThan(0.95);
  });
});