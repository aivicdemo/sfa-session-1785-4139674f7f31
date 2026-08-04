import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-1912: 過去事例の日付が期間終了日ちょうどのときに根拠に含まれる', () => {
    // モック化されたAIRecommendationEngine
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      generateRecommendation: jest.fn(),
    };

    // 過去事例データの準備
    const pastCase = {
      caseId: 'CASE-001',
      successDate: '2025-12-31',
      customerIndustry: '製造業',
      proposalContent: '生産効率化ソリューション',
      applicabilityScore: 0.95,
    };

    // 期間指定パラメータ
    const periodParams = {
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    };

    // findSimilarPatternsのモック実装
    // 期間終了日ちょうど（2025-12-31）の過去事例を検索結果に含める
    mockAIEngine.findSimilarPatterns.mockReturnValue([
      {
        caseId: 'CASE-001',
        successDate: '2025-12-31',
        customerIndustry: '製造業',
        proposalContent: '生産効率化ソリューション',
        applicabilityScore: 0.95,
        similarity: 0.92,
      },
    ]);

    // explainRecommendationReasoningのモック実装
    // CASE-001の根拠説明を返す
    mockAIEngine.explainRecommendationReasoning.mockReturnValue(
      '成功日2025-12-31の製造業案件で同様の提案が適用され、生産効率化を実現した'
    );

    // generateRecommendationのモック実装
    mockAIEngine.generateRecommendation.mockReturnValue({
      recommendationId: 'REC-2025-001',
      proposalApproach: '生産効率化ソリューション',
      recommendedTiming: '2025-12-31',
      reasoningExplanation:
        '過去事例：2025-12-31に製造業での生産効率化ソリューション提案が成功（適用スコア：0.95）',
      similarCases: [
        {
          caseId: 'CASE-001',
          successDate: '2025-12-31',
          customerIndustry: '製造業',
          proposalContent: '生産効率化ソリューション',
          applicabilityScore: 0.95,
        },
      ],
      confidenceScore: 88,
    });

    // 現在の商談条件
    const currentDealCondition = {
      customerIndustry: '製造業',
      dealStage: '初期提案',
      estimatedBudget: 5000000,
    };

    // generateRecommendationメソッドを呼び出し
    const result = generateRecommendation(
      currentDealCondition,
      periodParams,
      mockAIEngine
    );

    // 返却された推奨内容を確認
    expect(result.reasoningExplanation).toBe(
      '過去事例：2025-12-31に製造業での生産効率化ソリューション提案が成功（適用スコア：0.95）'
    );

    // 期間終了日ちょうどの事例CASE-001が根拠に明示的に含まれている
    expect(result.similarCases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          caseId: 'CASE-001',
          successDate: '2025-12-31',
          customerIndustry: '製造業',
          proposalContent: '生産効励化ソリューション',
          applicabilityScore: 0.95,
        }),
      ])
    );

    // 信頼度スコアが期待値（88）であることを確認
    expect(result.confidenceScore).toBe(88);

    // 根拠説明に期間終了日ちょうど（2025-12-31）の日付が含まれていることを確認
    expect(result.reasoningExplanation).toMatch(/2025-12-31/);

    // 根拠説明に適用スコア（0.95）が含まれていることを確認
    expect(result.reasoningExplanation).toMatch(/0\.95/);

    // 期間外の事例（2026-01-01以降）が根拠に含まれていないことを確認
    const outOfPeriodDate = '2026-01-01';
    expect(result.reasoningExplanation).not.toMatch(/2026-01-01/);
  });
});