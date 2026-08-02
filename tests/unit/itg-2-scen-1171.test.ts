import { detectDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1171
  test('重複候補が1件の場合、1件の判定結果が返される', () => {
    const customerId = 'C001';
    const customerName = '山田太郎';
    const customerEmail = 'yamada@example.com';

    const duplicateCandidate = {
      customerId: 'C002',
      customerName: '山田太郎',
      customerEmail: 'yamada.taro@example.com',
      similarityScore: 0.92,
    };

    const result = detectDuplicates({
      customerId: customerId,
      customerName: customerName,
      customerEmail: customerEmail,
      duplicateCandidates: [duplicateCandidate],
    });

    expect(result.duplicateCount).toBe(1);
    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0]).toEqual({
      customerId: 'C002',
      customerName: '山田太郎',
      similarityScore: 0.92,
    });
    expect(result.status).toBe('PENDING');
    expect(result.createdAt).toBeDefined();
    expect(typeof result.createdAt).toBe('string');
  });
});