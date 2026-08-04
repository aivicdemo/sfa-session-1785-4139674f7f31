import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2832
  test('推奨根拠の可視化・説明文生成 - 根拠要素が同一の重要度スコアを複数保有するとき、結果の配列内での並び順が入力順を保持する', () => {
    // Arrange: AIRecommendationEngineをスタブ化
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // 根拠要素を同一スコア（0.85）で準備し、入力順を定義
    const reasoningBasis_firstCall = [
      {
        basisId: 'A-001',
        basisType: 'customer_attribute',
        basisDescription: '大企業の金融セクター企業',
        importanceScore: 0.85,
        relatedData: { customerSize: 'large', industry: 'finance' },
      },
      {
        basisId: 'B-002',
        basisType: 'budget_constraint',
        basisDescription: '予算規模1000万円以上',
        importanceScore: 0.85,
        relatedData: { budgetRange: 'over_10m_yen' },
      },
      {
        basisId: 'C-003',
        basisType: 'success_pattern',
        basisDescription: '同業種での成功事例',
        importanceScore: 0.85,
        relatedData: { successPatternId: 'SP-2024-001' },
      },
    ];

    mockAIRecommendationEngine.explainRecommendationReasoning.mockReturnValueOnce(
      reasoningBasis_firstCall
    );

    // 同じ根拠要素を同じ入力順で再度返すようモック設定（2回目呼び出し）
    const reasoningBasis_secondCall = [
      {
        basisId: 'A-001',
        basisType: 'customer_attribute',
        basisDescription: '大企業の金融セクター企業',
        importanceScore: 0.85,
        relatedData: { customerSize: 'large', industry: 'finance' },
      },
      {
        basisId: 'B-002',
        basisType: 'budget_constraint',
        basisDescription: '予算規模1000万円以上',
        importanceScore: 0.85,
        relatedData: { budgetRange: 'over_10m_yen' },
      },
      {
        basisId: 'C-003',
        basisType: 'success_pattern',
        basisDescription: '同業種での成功事例',
        importanceScore: 0.85,
        relatedData: { successPatternId: 'SP-2024-001' },
      },
    ];

    mockAIRecommendationEngine.explainRecommendationReasoning.mockReturnValueOnce(
      reasoningBasis_secondCall
    );

    // テスト入力データ: 顧客規模『大企業』、業種『金融』、予算規模『1000万円以上』
    const dealCondition = {
      customerSize: 'large',
      industry: 'finance',
      budgetRange: 'over_10m_yen',
    };

    // Act: 1回目のexplainRecommendationReasoningメソッド呼び出し
    const result_firstCall = explainRecommendationReasoning(
      dealCondition,
      mockAIRecommendationEngine
    );

    // 1回目の実行結果における根拠要素3件のインデックス順序を記録
    const indexOrder_firstCall = result_firstCall.map((basis) => basis.basisId);

    // Act: 2回目のexplainRecommendationReasoningメソッド呼び出し
    const result_secondCall = explainRecommendationReasoning(
      dealCondition,
      mockAIRecommendationEngine
    );

    // 2回目の実行結果における根拠要素3件のインデックス順序を記録
    const indexOrder_secondCall = result_secondCall.map((basis) => basis.basisId);

    // Assert: 1回目と2回目の配列内での根拠要素の並び順が完全に一致すること
    expect(indexOrder_firstCall).toEqual(['A-001', 'B-002', 'C-003']);
    expect(indexOrder_secondCall).toEqual(['A-001', 'B-002', 'C-003']);
    expect(indexOrder_firstCall).toEqual(indexOrder_secondCall);

    // 同一スコアを持つ複数の根拠要素は常に入力時の順序（安定ソート）を保持していることを確認
    expect(result_firstCall).toHaveLength(3);
    expect(result_secondCall).toHaveLength(3);

    expect(result_firstCall[0]).toEqual({
      basisId: 'A-001',
      basisType: 'customer_attribute',
      basisDescription: '大企業の金融セクター企業',
      importanceScore: 0.85,
      relatedData: { customerSize: 'large', industry: 'finance' },
    });

    expect(result_firstCall[1]).toEqual({
      basisId: 'B-002',
      basisType: 'budget_constraint',
      basisDescription: '予算規模1000万円以上',
      importanceScore: 0.85,
      relatedData: { budgetRange: 'over_10m_yen' },
    });

    expect(result_firstCall[2]).toEqual({
      basisId: 'C-003',
      basisType: 'success_pattern',
      basisDescription: '同業種での成功事例',
      importanceScore: 0.85,
      relatedData: { successPatternId: 'SP-2024-001' },
    });
  });
});