import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ自動推奨', () => {
  test('SCEN-1555: 同一の新規案件条件で2回実行した場合、同一の推奨提案アプローチが返却される', () => {
    // テスト用の新規案件条件データを準備
    const newProjectCondition = {
      customerIndustry: '製造業',
      businessChallenge: '生産効率化',
      budgetScale: 5000000,
      decisionMakerCount: 3,
    };

    // AIRecommendationEngineをモック化
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        proposalApproach: 'プロセス自動化ソリューション提案',
        confidenceScore: 0.92,
        applicabilityScore: 0.88,
        reasoningText: '製造業の生産効率化課題に対し、過去10件の成功事例から抽出したプロセス自動化ソリューション提案が最適と判定されました。',
      }),
    };

    // 1回目のgenerateRecommendation実行
    const firstResult = generateRecommendation(newProjectCondition, mockAIEngine);
    const firstApproach = firstResult.proposalApproach;
    const firstConfidenceScore = firstResult.confidenceScore;
    const firstApplicabilityScore = firstResult.applicabilityScore;
    const firstReasoning = firstResult.reasoningText;

    // 2回目のgenerateRecommendation実行
    const secondResult = generateRecommendation(newProjectCondition, mockAIEngine);
    const secondApproach = secondResult.proposalApproach;
    const secondConfidenceScore = secondResult.confidenceScore;
    const secondApplicabilityScore = secondResult.applicabilityScore;
    const secondReasoning = secondResult.reasoningText;

    // 1回目と2回目の推奨提案アプローチが完全に一致することをアサート
    expect(firstApproach).toBe(secondApproach);
    expect(firstApproach).toBe('プロセス自動化ソリューション提案');

    // 1回目と2回目の信頼度スコアが完全に一致することをアサート
    expect(firstConfidenceScore).toBe(secondConfidenceScore);
    expect(firstConfidenceScore).toBe(0.92);

    // 1回目と2回目の適用可能性スコアが完全に一致することをアサート
    expect(firstApplicabilityScore).toBe(secondApplicabilityScore);
    expect(firstApplicabilityScore).toBe(0.88);

    // 1回目と2回目の根拠説明テキストが完全に一致することをアサート
    expect(firstReasoning).toBe(secondReasoning);
    expect(firstReasoning).toBe('製造業の生産効率化課題に対し、過去10件の成功事例から抽出したプロセス自動化ソリューション提案が最適と判定されました。');

    // AIRecommendationEngineのモックが2回呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(2);
  });
});