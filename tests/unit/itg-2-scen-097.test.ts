import { detectDuplicateCustomersAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-097
  test('重複候補が複数件の場合、全件に対する統合判定を実行する', () => {
    const targetCustomerId = 'CUST-001';
    const targetCustomer = {
      customerId: targetCustomerId,
      customerName: '山田太郎',
      address: '東京都渋谷区1-1-1',
      phoneNumber: '03-1234-5678',
      transactionCount: 5,
      lastTransactionDate: '2024-01-15',
    };

    const duplicateCandidates = [
      {
        candidateCustomerId: 'CUST-002',
        customerName: '山田太郎',
        address: '東京都渋谷区1-1-1',
        phoneNumber: '03-1234-5678',
        transactionCount: 3,
        lastTransactionDate: '2024-01-10',
        similarityScore: 0.95,
      },
      {
        candidateCustomerId: 'CUST-003',
        customerName: '山田 太郎',
        address: '東京都渋谷区1丁目1-1',
        phoneNumber: '03-1234-5678',
        transactionCount: 2,
        lastTransactionDate: '2023-12-20',
        similarityScore: 0.88,
      },
      {
        candidateCustomerId: 'CUST-004',
        customerName: '太郎山田',
        address: '東京都渋谷区1-1',
        phoneNumber: '03-1234-5679',
        transactionCount: 1,
        lastTransactionDate: '2023-11-05',
        similarityScore: 0.72,
      },
    ];

    const result = detectDuplicateCustomersAndJudgeIntegration(
      targetCustomer,
      duplicateCandidates
    );

    expect(result).toBeDefined();
    expect(result.targetCustomerId).toBe(targetCustomerId);
    expect(result.judgmentResults).toBeDefined();
    expect(result.judgmentResults.length).toBe(3);

    const result0 = result.judgmentResults[0];
    expect(result0.candidateCustomerId).toBe('CUST-002');
    expect(result0.mandatoryFieldMatchScore).toBeGreaterThanOrEqual(0.9);
    expect(['統合可能', '要確認', '統合不可']).toContain(
      result0.integrationJudgment
    );
    expect(result0.transactionHistoryRelevance).toBeDefined();

    const result1 = result.judgmentResults[1];
    expect(result1.candidateCustomerId).toBe('CUST-003');
    expect(result1.mandatoryFieldMatchScore).toBeGreaterThanOrEqual(0.8);
    expect(['統合可能', '要確認', '統合不可']).toContain(
      result1.integrationJudgment
    );

    const result2 = result.judgmentResults[2];
    expect(result2.candidateCustomerId).toBe('CUST-004');
    expect(result2.mandatoryFieldMatchScore).toBeGreaterThanOrEqual(0.6);
    expect(['統合可能', '要確認', '統合不可']).toContain(
      result2.integrationJudgment
    );

    expect(result.processCompletionStatus).toBe('completed');
    expect(result.processingTimeMs).toBeGreaterThan(0);
    expect(result.processingTimeMs).toBeLessThan(5000);
  });
});