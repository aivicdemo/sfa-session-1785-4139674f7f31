import { validateRecommendationRecord } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨内容検証判定機能', () => {
  // SCEN-2890
  test('推奨履歴レコードの成約実績値が負の値のとき、エラーを返す', () => {
    const recommendationRecord = {
      id: 'REC-20240115-001',
      contractValue: -50000,
      createdAt: new Date('2024-01-15T11:00:00Z'),
      customerId: 'CUST-12345',
      recommendedApproach: 'sample_approach',
      executionStatus: 'PENDING'
    };

    expect(() => {
      validateRecommendationRecord(recommendationRecord);
    }).toThrow(/INVALID_CONTRACT_VALUE/);

    try {
      validateRecommendationRecord(recommendationRecord);
    } catch (error: any) {
      expect(error.code).toBe('INVALID_CONTRACT_VALUE');
      expect(error.message).toBe(
        '推奨履歴レコードの成約実績値は 0 以上である必要があります。入力値: -50000'
      );
    }
  });
});