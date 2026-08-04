import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件に適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-205: 適用可能性スコアがちょうど閾値と判定される場合、該当パターンが推奨対象に含まれる', () => {
    // 過去商談データ（成功パターン）を準備
    const pastDealPatterns = [
      {
        id: 'pattern-001',
        industry: 'IT',
        companySize: 'mid-market',
        challengeArea: 'DX推進',
        approachName: 'クラウド移行戦略',
        successRate: 0.82,
      },
      {
        id: 'pattern-002',
        industry: 'Manufacturing',
        companySize: 'enterprise',
        challengeArea: 'Supply Chain',
        approachName: 'サプライチェーン最適化',
        successRate: 0.76,
      },
    ];

    // 新規案件の顧客・商談条件を設定
    const newDealCondition = {
      industry: 'IT',
      companySize: 'mid-market',
      challengeArea: 'DX推進',
      customerName: 'NewTech Inc.',
    };

    // AIRecommendationEngineのスタブを設定
    // 適用可能性スコアが閾値0.75と同じ値を返す
    const thresholdScore = 0.75;
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((pattern, condition) => {
        if (
          pattern.industry === condition.industry &&
          pattern.companySize === condition.companySize &&
          pattern.challengeArea === condition.challengeArea
        ) {
          return thresholdScore;
        }
        return 0.45;
      }),
    };

    // 推奨パターンを生成
    const result = generateRecommendation(
      newDealCondition,
      pastDealPatterns,
      mockAIEngine
    );

    // 検証: 推奨パターンリストに該当パターンが含まれていることを確認
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);

    // pattern-001が推奨対象に含まれていることを確認
    const recommendedPattern = result.recommendations.find(
      (rec) => rec.patternId === 'pattern-001'
    );
    expect(recommendedPattern).toBeDefined();

    // 適用可能性スコアがちょうど閾値0.75で記録されていることを確認
    expect(recommendedPattern?.relevanceScore).toBe(0.75);

    // 推奨内容に該当パターンの情報が含まれていることを確認
    expect(recommendedPattern?.approachName).toBe('クラウド移行戦略');
  });
});