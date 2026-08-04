import { validateDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('データ品質検証機能 - スコア合格ライン直下の保留判定', () => {
  // SCEN-132
  test('スコア79.9で検証が保留され、詳細な判定情報を返す', () => {
    const passThreshold = 80.0;
    const qualityScore = 79.9;
    const inputData = {
      customerId: 'CUST-20240815-001',
      customerName: 'テスト顧客',
      industry: 'IT',
      scale: 'large',
      dealAmount: 5000000,
      dealDate: '2024-08-15T09:30:00Z',
    };

    const result = validateDataQuality(inputData, passThreshold);

    expect(result.validationStatus).toBe('PENDING');
    expect(result.qualityScore).toBe(79.9);
    expect(result.judgmentReason).toBe(
      '品質スコアが合格ライン(80.0)より 0.1 ポイント下回っています。詳細な再検査が必要です'
    );
    expect(result.holdingJudgmentBasis).toBe('BELOW_THRESHOLD_EDGE_CASE');
    expect(result.reexaminationRecommendedFlag).toBe(true);
  });
});