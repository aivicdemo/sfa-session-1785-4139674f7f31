import { generateRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-798: 推奨根拠データ生成機能 - 成功要因がすべて根拠データに含まれる', () => {
    // Arrange: モックAIRecommendationEngine
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: {
          proposalApproach: '顧客の予算承認済みの状態で、決定権者が営業会議に参加するタイミングで提案を実施',
          recommendedTiming: '2024-02-15T10:00:00Z',
          confidenceScore: 0.92,
        },
        successPatterns: [
          {
            factorName: '顧客の予算承認済み',
            description: '提案時点で顧客の予算承認が完了している状態が成功につながる傾向が観測されている',
            relevanceScore: 0.95,
            applicabilityStatus: '適用可能',
          },
          {
            factorName: '決定権者が営業会議に参加',
            description: '経営層の決定権者が営業会議に参加している場合、意思決定が迅速化され成約率が向上する',
            relevanceScore: 0.88,
            applicabilityStatus: '適用可能',
          },
          {
            factorName: '競合他社なし',
            description: '競合他社の提案がない状態で当社提案を行うことで、顧客の購買判断が明確になり成約につながりやすい',
            relevanceScore: 0.82,
            applicabilityStatus: '条件付き適用可能',
          },
        ],
      }),
    };

    const newDealData = {
      customerId: 'CUST-001',
      dealConditions: {
        industry: '製造業',
        companySize: '従業員500名以上',
        budget: 5000000,
        decision_timeline: '2024-02-28',
      },
      customerNeeds: {
        primaryChallenge: 'IT基盤の現代化',
        secondaryChallenge: '業務プロセスの効率化',
      },
    };

    // Act: 推奨根拠データ生成機能を呼び出し
    const result = generateRecommendationReasoning(newDealData, mockAIEngine);

    // Assert: 根拠リストに成功要因が全て含まれていることを検証
    expect(result).toBeDefined();
    expect(result.reasoningBasis).toBeDefined();
    expect(Array.isArray(result.reasoningBasis)).toBe(true);
    expect(result.reasoningBasis.length).toBe(3);

    // 成功要因A『顧客の予算承認済み』の確認
    const budgetFactor = result.reasoningBasis.find(
      (factor: any) => factor.factorName === '顧客の予算承認済み'
    );
    expect(budgetFactor).toBeDefined();
    expect(typeof budgetFactor.relevanceScore).toBe('number');
    expect(budgetFactor.relevanceScore).toBe(0.95);
    expect(['適用可能', '条件付き適用可能']).toContain(budgetFactor.applicabilityStatus);
    expect(budgetFactor.applicabilityStatus).toBe('適用可能');
    expect(typeof budgetFactor.explanationText).toBe('string');
    expect(budgetFactor.explanationText.length).toBeGreaterThanOrEqual(50);

    // 成功要因B『決定権者が営業会議に参加』の確認
    const decisionMakerFactor = result.reasoningBasis.find(
      (factor: any) => factor.factorName === '決定権者が営業会議に参加'
    );
    expect(decisionMakerFactor).toBeDefined();
    expect(typeof decisionMakerFactor.relevanceScore).toBe('number');
    expect(decisionMakerFactor.relevanceScore).toBe(0.88);
    expect(['適用可能', '条件付き適用可能']).toContain(decisionMakerFactor.applicabilityStatus);
    expect(decisionMakerFactor.applicabilityStatus).toBe('適用可能');
    expect(typeof decisionMakerFactor.explanationText).toBe('string');
    expect(decisionMakerFactor.explanationText.length).toBeGreaterThanOrEqual(50);

    // 成功要因C『競合他社なし』の確認
    const noCompetitionFactor = result.reasoningBasis.find(
      (factor: any) => factor.factorName === '競合他社なし'
    );
    expect(noCompetitionFactor).toBeDefined();
    expect(typeof noCompetitionFactor.relevanceScore).toBe('number');
    expect(noCompetitionFactor.relevanceScore).toBe(0.82);
    expect(['適用可能', '条件付き適用可能']).toContain(noCompetitionFactor.applicabilityStatus);
    expect(noCompetitionFactor.applicabilityStatus).toBe('条件付き適用可能');
    expect(typeof noCompetitionFactor.explanationText).toBe('string');
    expect(noCompetitionFactor.explanationText.length).toBeGreaterThanOrEqual(50);

    // 全ての根拠データに必須フィールドが存在することを検証
    result.reasoningBasis.forEach((factor: any) => {
      expect(factor.factorName).toBeDefined();
      expect(typeof factor.factorName).toBe('string');
      expect(factor.relevanceScore).toBeDefined();
      expect(typeof factor.relevanceScore).toBe('number');
      expect(factor.relevanceScore).toBeGreaterThanOrEqual(0.0);
      expect(factor.relevanceScore).toBeLessThanOrEqual(1.0);
      expect(factor.applicabilityStatus).toBeDefined();
      expect(['適用可能', '条件付き適用可能']).toContain(factor.applicabilityStatus);
      expect(factor.explanationText).toBeDefined();
      expect(typeof factor.explanationText).toBe('string');
      expect(factor.explanationText.length).toBeGreaterThanOrEqual(50);
    });

    // AIEngineが期待通りに呼ばれたことを検証
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newDealData);
  });
});