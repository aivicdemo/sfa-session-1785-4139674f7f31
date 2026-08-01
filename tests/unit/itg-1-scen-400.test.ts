import { calculateSuccessPatternMatch } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-400
  test('成功パターンレコードが1件の場合、該当の1件との合致度が計算される', () => {
    const successPatterns = [
      {
        id: 'pattern_001',
        visitCount: 5,
        proposalProvided: true,
        customerResponseTime: 24,
        successRate: 0.85,
      },
    ];

    const salesPersonBehavior = {
      visitCount: 5,
      proposalProvided: true,
      customerResponseTime: 24,
    };

    const result = calculateSuccessPatternMatch(
      successPatterns,
      salesPersonBehavior
    );

    expect(result.matchDegree).toBe(85);
    expect(result.report).toContain('合致度: 85%');
    expect(result.matchedPatternCount).toBe(1);
  });
});