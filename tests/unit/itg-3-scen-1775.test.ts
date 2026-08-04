import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1775: 根拠表示優先度がちょうど0.5のとき根拠表示順序を判定する', () => {
    // Mock AIRecommendationEngine
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // パターンマスタのモックデータ：優先度が0.5の複数パターン
    const patternWithPriority05A = {
      patternId: 'pattern-001',
      customerIndustry: 'manufacturing',
      budgetRange: 'medium',
      dealStage: 'proposal',
      successPattern: 'cross-sell-after-pilot',
      registeredDate: '2024-01-20T10:00:00Z',
      relevanceScore: 0.85,
      priority: 0.5,
    };

    const patternWithPriority05B = {
      patternId: 'pattern-002',
      customerIndustry: 'manufacturing',
      budgetRange: 'medium',
      dealStage: 'proposal',
      successPattern: 'bundle-discount-strategy',
      registeredDate: '2024-01-15T09:30:00Z',
      relevanceScore: 0.82,
      priority: 0.5,
    };

    const patternWithPriority05C = {
      patternId: 'pattern-003',
      customerIndustry: 'manufacturing',
      budgetRange: 'medium',
      dealStage: 'proposal',
      successPattern: 'executive-briefing-first',
      registeredDate: '2024-01-25T11:15:00Z',
      relevanceScore: 0.88,
      priority: 0.5,
    };

    // evaluatePatternRelevanceが複数回呼ばれて各パターンの優先度0.5を返す
    mockRecommendationEngine.evaluatePatternRelevance
      .mockReturnValueOnce(0.5) // patternWithPriority05A
      .mockReturnValueOnce(0.5) // patternWithPriority05B
      .mockReturnValueOnce(0.5); // patternWithPriority05C

    // generateRecommendationが複数の根拠パターンを返す
    mockRecommendationEngine.generateRecommendation.mockReturnValue({
      recommendationId: 'rec-12345',
      dealId: 'deal-999',
      recommendedApproach: 'bundled-proposal-with-timeline',
      confidenceScore: 78,
      rationales: [
        {
          patternId: patternWithPriority05A.patternId,
          priority: 0.5,
          registeredDate: patternWithPriority05A.registeredDate,
          relevanceScore: patternWithPriority05A.relevanceScore,
          successPattern: patternWithPriority05A.successPattern,
        },
        {
          patternId: patternWithPriority05B.patternId,
          priority: 0.5,
          registeredDate: patternWithPriority05B.registeredDate,
          relevanceScore: patternWithPriority05B.relevanceScore,
          successPattern: patternWithPriority05B.successPattern,
        },
        {
          patternId: patternWithPriority05C.patternId,
          priority: 0.5,
          registeredDate: patternWithPriority05C.registeredDate,
          relevanceScore: patternWithPriority05C.relevanceScore,
          successPattern: patternWithPriority05C.successPattern,
        },
      ],
    });

    // テスト入力：商談条件データ
    const dealConditionInput = {
      dealId: 'deal-999',
      customerId: 'cust-555',
      customerIndustry: 'manufacturing',
      budgetRange: 'medium',
      dealStage: 'proposal',
      expectedCloseDate: '2024-03-31',
      historicalBehaviorPattern: 'conservative-buyer',
    };

    // generateRecommendationメソッドを呼び出す
    const recommendationResult = generateRecommendation(
      dealConditionInput,
      mockRecommendationEngine
    );

    // 推奨内容が生成されたことを確認
    expect(recommendationResult).toBeDefined();
    expect(recommendationResult.recommendationId).toBe('rec-12345');
    expect(recommendationResult.confidenceScore).toBe(78);

    // 根拠パターンが複数存在することを確認
    expect(recommendationResult.rationales).toHaveLength(3);

    // 優先度が0.5のパターンが複数存在することを確認
    const priority05Rationales = recommendationResult.rationales.filter(
      (r) => r.priority === 0.5
    );
    expect(priority05Rationales).toHaveLength(3);

    // 根拠表示順序が二次ソート条件（登録日時の降順）で並び替えられていることを確認
    // 期待される順序：2024-01-25 → 2024-01-20 → 2024-01-15
    const sortedByRegistrationDateDesc = [
      patternWithPriority05C,
      patternWithPriority05A,
      patternWithPriority05B,
    ];

    for (let i = 0; i < priority05Rationales.length; i++) {
      expect(priority05Rationales[i].patternId).toBe(
        sortedByRegistrationDateDesc[i].patternId
      );
      expect(priority05Rationales[i].registeredDate).toBe(
        sortedByRegistrationDateDesc[i].registeredDate
      );
    }

    // 関連性スコアでの副次ソート確認：同一優先度内での関連性スコア
    // patternWithPriority05C: 0.88 > patternWithPriority05A: 0.85 > patternWithPriority05B: 0.82
    const relevanceScoresInDisplayOrder = priority05Rationales.map(
      (r) => r.relevanceScore
    );
    expect(relevanceScoresInDisplayOrder).toEqual([0.88, 0.85, 0.82]);

    // mockの呼び出し履歴を検証（evaluatePatternRelevanceが複数回呼ばれたか）
    expect(mockRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(
      mockRecommendationEngine.evaluatePatternRelevance.mock.calls.length
    ).toBeGreaterThanOrEqual(3);

    // generateRecommendationが1回呼ばれたことを確認
    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.any(Object)
    );

    // 根拠表示順序が恣意的でなく、システムで定義されたルール（登録日時降順→関連性スコア降順）に従っていることを確認
    expect(priority05Rationales[0].registeredDate).toBeGreaterThanOrEqual(
      priority05Rationales[1].registeredDate
    );
    expect(priority05Rationales[1].registeredDate).toBeGreaterThanOrEqual(
      priority05Rationales[2].registeredDate
    );

    // 登録日時が同じ場合は関連性スコアで降順ソートされていることを確認するため
    // 同一日時のパターンが存在しないため、このテストでは登録日時の降順が優先されることを確認
    expect(recommendationResult.rationales[0].successPattern).toBe(
      'executive-briefing-first'
    );
    expect(recommendationResult.rationales[1].successPattern).toBe(
      'cross-sell-after-pilot'
    );
    expect(recommendationResult.rationales[2].successPattern).toBe(
      'bundle-discount-strategy'
    );
  });
});