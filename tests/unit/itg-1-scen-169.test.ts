import { analyzeActionPatternAndDecideCoachingTarget } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-169: 営業担当者行動パターン分析・改善指導対象判定機能 - 1件の分析結果から改善指導判定を実行', () => {
    const actionPatternAnalysisData = {
      salesPersonId: 'SP001',
      visitFrequency: 8,
      visitFrequencyAverage: 12,
      proposalContentScore: 65,
      proposalContentScoreAverage: 75,
      contractRate: 22,
      contractRateAverage: 30,
      analysisResultCount: 1,
    };

    const result = analyzeActionPatternAndDecideCoachingTarget(
      actionPatternAnalysisData
    );

    expect(result).toEqual({
      salesPersonId: 'SP001',
      requiresCoaching: true,
      coachingReasons: [
        {
          dimension: 'visitFrequency',
          variance: -33.33,
          message: '改善指導対象：訪問頻度が平均値より33%低い',
        },
        {
          dimension: 'proposalContentScore',
          variance: -13.33,
          message: '改善指導対象：提案内容スコアが平均値より13%低い',
        },
        {
          dimension: 'contractRate',
          variance: -26.67,
          message: '改善指導対象：成約率が平均値より27%低い',
        },
      ],
      overallAssessment: '複数項目で基準値以下のため改善指導対象',
      executionCount: 1,
    });
  });
});