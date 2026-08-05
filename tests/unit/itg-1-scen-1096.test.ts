import { describe, test, expect } from '@jest/globals';
import { analyzeProcessAdherenceCorrelation } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1096: [normal] 営業担当者ごとの行動パターン分析・標準プロセス乖離分析機能 - 標準プロセス乖離が成約実績に与える影響度が相関係数として数値化される
  test('プロセス乖離度と成約実績の相関係数が-0.85～+0.95の範囲内の具体的な数値で返却されること', () => {
    // テストデータ: 営業担当者Aの過去12ヶ月間のデータ
    const salesRepId = 'A001';
    const months = [
      {
        month: '2024-01',
        processAdherenceScore: 95, // 0～100、100が標準準拠
        contractAmount: 1200000, // 月次成約金額（円）
      },
      {
        month: '2024-02',
        processAdherenceScore: 88,
        contractAmount: 950000,
      },
      {
        month: '2024-03',
        processAdherenceScore: 92,
        contractAmount: 1100000,
      },
      {
        month: '2024-04',
        processAdherenceScore: 75,
        contractAmount: 650000,
      },
      {
        month: '2024-05',
        processAdherenceScore: 82,
        contractAmount: 800000,
      },
      {
        month: '2024-06',
        processAdherenceScore: 90,
        contractAmount: 1050000,
      },
      {
        month: '2024-07',
        processAdherenceScore: 78,
        contractAmount: 700000,
      },
      {
        month: '2024-08',
        processAdherenceScore: 85,
        contractAmount: 900000,
      },
      {
        month: '2024-09',
        processAdherenceScore: 93,
        contractAmount: 1180000,
      },
      {
        month: '2024-10',
        processAdherenceScore: 80,
        contractAmount: 750000,
      },
      {
        month: '2024-11',
        processAdherenceScore: 87,
        contractAmount: 920000,
      },
      {
        month: '2024-12',
        processAdherenceScore: 91,
        contractAmount: 1080000,
      },
    ];

    // 分析機能を実行
    const result = analyzeProcessAdherenceCorrelation({
      salesRepId,
      monthlyData: months,
    });

    // 期待結果の検証
    expect(result).toHaveProperty('salesRepId');
    expect(result.salesRepId).toBe('A001');

    expect(result).toHaveProperty('correlationCoefficient');
    // 相関係数が-0.85～+0.95の範囲内であること
    expect(result.correlationCoefficient).toBeGreaterThanOrEqual(-0.85);
    expect(result.correlationCoefficient).toBeLessThanOrEqual(0.95);
    // 小数第2位までの精度で返却されること
    expect(result.correlationCoefficient).toBe(
      Math.round(result.correlationCoefficient * 100) / 100
    );

    expect(result).toHaveProperty('correlationStrength');
    // 相関強度の判定が正しいカテゴリであること
    const validStrengths = [
      '強正相関',
      '弱正相関',
      '無相関',
      '弱負相関',
      '強負相関',
    ];
    expect(validStrengths).toContain(result.correlationStrength);

    expect(result).toHaveProperty('pValue');
    // p値が0～1の範囲内であること
    expect(result.pValue).toBeGreaterThanOrEqual(0);
    expect(result.pValue).toBeLessThanOrEqual(1);

    // 相関係数が正であれば、相関強度は「正相関」系であること
    if (result.correlationCoefficient > 0.3) {
      expect(['強正相関', '弱正相関']).toContain(result.correlationStrength);
    }

    // p値が0.05未満なら統計的に有意であること
    if (result.pValue < 0.05) {
      expect(['強正相関', '強負相関']).toContain(result.correlationStrength);
    }

    // 返却されたデータ構造が完全であること
    expect(result).toHaveProperty('dataPoints');
    expect(result.dataPoints).toBe(12);
    expect(result.dataPoints).toBeGreaterThan(0);

    // メタデータが含まれていること
    expect(result).toHaveProperty('analysisDate');
    expect(typeof result.analysisDate).toBe('string');

    // 相関係数の解釈が正確であること（正相関の場合の例）
    if (result.correlationCoefficient > 0.7) {
      // 強正相関の場合、プロセス準拠度が高いほど成約実績が高い
      expect(result.correlationStrength).toBe('強正相関');
    }
  });
});