import { describe, test, expect } from '@jest/globals';
import { analyzeDeviationCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-804: [normal] 営業担当者行動パターン分析機能 - 乖離が成約率向上と正の相関を持つ場合、その乖離は有効と分類される
  test('乖離スコアと成約率の正の相関を検出し、有効な乖離として分類する', () => {
    const salesRepresentativePatterns = [
      {
        sales_rep_id: 'A',
        deviation_score: 75,
        contract_rate: 65,
      },
      {
        sales_rep_id: 'B',
        deviation_score: 30,
        contract_rate: 40,
      },
    ];

    const result = analyzeDeviationCorrelation(salesRepresentativePatterns);

    expect(result.correlation_coefficient).toBeGreaterThan(0);
    expect(result.deviation_classifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sales_rep_id: 'A',
          deviation_score: 75,
          contract_rate: 65,
          classification: '有効',
          contribution_value: expect.any(Number),
        }),
      ])
    );
    expect(result.deviation_classifications[0].classification).toBe('有効');
    expect(result.deviation_classifications[0].contribution_value).toBeGreaterThan(0);
  });
});