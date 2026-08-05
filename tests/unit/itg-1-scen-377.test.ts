import { determineProposalApproachEligibility } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-377: [normal] 成功パターンマッチング・提案アプローチ判定機能 - 顧客業種・業界が成功パターンと一致する場合、提案アプローチの適用可能性が判定される
  test('should determine proposal approach eligibility when customer industry matches success pattern', () => {
    // 初期化：成功パターンマスターに登録されているレコード
    const successPatternId = 'pattern-001';
    const industry = '製造業';
    const businessSector = '自動車部品';
    const recommendedApproach = '技術提案型';

    // 顧客情報として業種『製造業』、業界『自動車部品』のデータを入力
    const customerInput = {
      customerId: 'cust-12345',
      industry,
      businessSector,
      successPatterns: [
        {
          patternId: successPatternId,
          industry,
          businessSector,
          recommendedApproach,
          matchConfidenceThreshold: 0.95,
        },
      ],
    };

    // 判定機能の処理を実行
    const result = determineProposalApproachEligibility(customerInput);

    // 期待結果：判定結果オブジェクトに以下の値が含まれることを確認
    expect(result.isMatchPattern).toBe(true);
    expect(result.applicableApproach).toBe('技術提案型');
    expect(result.matchConfidence).toBeGreaterThanOrEqual(0.95);
    expect(result.patternId).toBe(successPatternId);
  });
});