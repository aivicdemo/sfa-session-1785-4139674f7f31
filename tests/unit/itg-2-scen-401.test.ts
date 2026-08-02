import { judgeCustomerIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-401
  test('統合判定で確度50%ちょうどと判定された顧客ペアが返される', () => {
    const input = {
      customerPairs: [
        {
          customerId1: 'A',
          customerId2: 'B',
          name1: '山田太郎',
          name2: '山田太郎',
          email1: 'yamada.taro@example.com',
          email2: 'yamada.taro.alt@example.com',
          phone1: '090-1234-5678',
          phone2: '090-1234-5678',
        },
        {
          customerId1: 'C',
          customerId2: 'D',
          name1: '佐藤花子',
          name2: '佐藤花子',
          email1: 'sato.hanako@example.com',
          email2: 'sato.hanako@example.com',
          phone1: '080-9876-5432',
          phone2: '080-9876-5433',
        },
      ],
      scoringStrategy: 'weighted_match',
    };

    const result = judgeCustomerIntegration(input);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customerId1: 'A',
          customerId2: 'B',
          confidenceScore: 50.0,
          status: 'THRESHOLD_BOUNDARY',
        }),
      ])
    );

    const thresholdBoundaryPairs = result.filter(
      (pair: { confidenceScore: number; status: string }) =>
        pair.confidenceScore === 50.0 && pair.status === 'THRESHOLD_BOUNDARY'
    );

    expect(thresholdBoundaryPairs.length).toBeGreaterThan(0);
    expect(thresholdBoundaryPairs[0].confidenceScore).toBe(50.0);
  });
});