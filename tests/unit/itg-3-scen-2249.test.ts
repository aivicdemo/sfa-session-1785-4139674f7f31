import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチマッチング機能 - 過去成功パターンからの推奨生成', () => {
  test('SCEN-2249: 新規案件の顧客・商談条件が過去成功パターンの条件と全て合致する場合、完全マッチの推奨結果を返却', async () => {
    // Arrange: テスト用の過去成功パターンマスタ
    const pastSuccessPatterns = [
      {
        pattern_id: 'PATTERN_001',
        industry: '製造業',
        company_size: '従業員1000名以上',
        budget_range: '5000万円以上',
        implementation_challenge: '生産効率化',
        proposed_approach: '段階的導入アプローチ',
        additional_approach: '経営層・現場層の二層ヒアリング',
      },
    ];

    // Arrange: AIRecommendationEngineのスタブ化
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // findSimilarPatternsが完全合致パターンを返却
    aiRecommendationEngineStub.findSimilarPatterns.mockResolvedValue([
      {
        pattern_id: 'PATTERN_001',
        industry: '製造業',
        company_size: '従業員1000名以上',
        budget_range: '5000万円以上',
        implementation_challenge: '生産効率化',
        proposed_approach: '段階的導入アプローチ',
        additional_approach: '経営層・現場層の二層ヒアリング',
        relevance_score: 1.0,
      },
    ]);

    // explainRecommendationReasoningが説明文を返却
    aiRecommendationEngineStub.explainRecommendationReasoning.mockResolvedValue(
      '顧客条件が過去成功事例の条件と全て合致しているため、同一アプローチを推奨します'
    );

    // evaluatePatternRelevanceが適用可能性スコアを返却
    aiRecommendationEngineStub.evaluatePatternRelevance.mockResolvedValue(0.98);

    // generateRecommendationが統合結果を返却
    aiRecommendationEngineStub.generateRecommendation.mockResolvedValue({
      proposed_approach: '段階的導入アプローチ',
      additional_approach: '経営層・現場層の二層ヒアリング',
      matching_basis: {
        relevance_score: 1.0,
        matched_criteria: [
          'industry: 製造業',
          'company_size: 従業員1000名以上',
          'budget_range: 5000万円以上',
          'implementation_challenge: 生産効ula化',
        ],
      },
      explanation: '顧客条件が過去成功事例の条件と全て合致しているため、同一アプローチを推奨します',
      applicability_score: 0.98,
    });

    // Arrange: 新規案件の顧客・商談条件
    const newDealInput = {
      industry: '製造業',
      company_size: '従業員1000名以上',
      budget_range: '5000万円以上',
      implementation_challenge: '生産効率化',
    };

    // Act: 提案アプローチ推奨処理を実行
    const result = await generateRecommendation(newDealInput, aiRecommendationEngineStub);

    // Assert: 返却された推奨結果を検証
    // (1) 提案アプローチが過去成功パターンに基づいた具体的な内容
    expect(result.proposed_approach).toBe('段階的導入アプローチ');
    expect(result.additional_approach).toBe('経営層・現場層の二層ヒアリング');

    // (2) マッチング根拠がrelevanceScore: 1.0（完全合致）を示すスコアで返却
    expect(result.matching_basis.relevance_score).toBe(1.0);
    expect(result.matching_basis.matched_criteria).toEqual([
      'industry: 製造業',
      'company_size: 従業員1000名以上',
      'budget_range: 5000万円以上',
      'implementation_challenge: 生産効率化',
    ]);

    // (3) 説明文が『顧客条件が過去成功事例の条件と全て合致しているため、同一アプローチを推奨します』という旨
    expect(result.explanation).toBe(
      '顧客条件が過去成功事例の条件と全て合致しているため、同一アプローチを推奨します'
    );

    // (4) 適用可能性スコアが0.95以上
    expect(result.applicability_score).toBeGreaterThanOrEqual(0.95);
    expect(result.applicability_score).toBe(0.98);

    // 呼び出しの検証
    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenCalledWith(newDealInput);
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).toHaveBeenCalled();
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalled();
  });
});