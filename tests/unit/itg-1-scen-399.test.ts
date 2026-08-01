import { calculateBehaviorPatternMatchingScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-399
  test('成功パターンレコードが0件の場合、合致度の計算が適切に処理される', () => {
    const salesRepId = 'rep_001';
    const behaviorPatterns = {
      initialContactFrequency: 5,
      proposalSuccessRate: 0.6,
      followUpIntervalDays: 7,
      customerResponseRate: 0.75,
    };
    const successPatterns: Array<{
      patternId: string;
      initialContactFrequency: number;
      proposalSuccessRate: number;
      followUpIntervalDays: number;
      customerResponseRate: number;
    }> = [];

    const result = calculateBehaviorPatternMatchingScore({
      salesRepId,
      behaviorPatterns,
      successPatterns,
    });

    expect(result.matchingScore).toBe(0);
    expect(result.hasComparisonData).toBe(false);
    expect(result.message).toMatch(/比較対象となる成功パターンがありません/);
    expect(result.analysisCompleted).toBe(true);
    expect(result.errorOccurred).toBe(false);
  });
});