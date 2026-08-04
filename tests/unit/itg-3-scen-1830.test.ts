import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1830: 推奨根拠情報の統合機能 - 根拠情報に商談IDが正確に記録される', async () => {
    // テストデータ: 商談ID「DEAL-2024-001」を含む新規案件情報
    const dealId = 'DEAL-2024-001';
    const customerName = 'ABC株式会社';
    const industry = '製造業';
    const budget = 5000000; // 500万円

    const dealInput = {
      deal_id: dealId,
      customer_name: customerName,
      industry: industry,
      budget_amount: budget,
    };

    // AIRecommendationEngineのスタブを設定
    // generateRecommendationメソッドが商談ID「DEAL-2024-001」を含む推奨根拠情報を返すよう構成
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        deal_id: dealId,
        recommendation_text: '類似案件（CASE-2023-045）に基づき、段階的な導入アプローチを推奨します',
        confidence_score: 85,
        success_patterns: [
          {
            pattern_id: 'PATTERN-001',
            pattern_name: '段階的導入パターン',
            match_score: 0.87,
          },
        ],
        reasoning_basis: {
          similar_cases: ['CASE-2023-045', 'CASE-2023-067'],
          customer_profile_match: 0.92,
          market_condition_alignment: 0.78,
          risk_factors: ['実装期間の短縮要求'],
        },
      }),
    };

    // 推奨根拠情報の統合機能を実行し、案件情報を入力
    const result = await generateRecommendationWithReasoning(
      dealInput,
      aiEngineStub
    );

    // 推奨根拠情報が正確に保存されたことを検証
    expect(result).toBeDefined();
    expect(result.deal_id).toBe('DEAL-2024-001');
    expect(result.recommendation_text).toBe(
      '類似案件（CASE-2023-045）に基づき、段階的な導入アプローチを推奨します'
    );
    expect(result.confidence_score).toBe(85);

    // 推奨根拠情報の詳細が正確に記録されていることを検証
    expect(result.success_patterns).toHaveLength(1);
    expect(result.success_patterns[0].pattern_id).toBe('PATTERN-001');
    expect(result.success_patterns[0].match_score).toBe(0.87);

    // 根拠データの統合が正確であることを検証
    expect(result.reasoning_basis).toBeDefined();
    expect(result.reasoning_basis.similar_cases).toEqual([
      'CASE-2023-045',
      'CASE-2023-067',
    ]);
    expect(result.reasoning_basis.customer_profile_match).toBe(0.92);
    expect(result.reasoning_basis.market_condition_alignment).toBe(0.78);
    expect(result.reasoning_basis.risk_factors).toContain(
      '実装期間の短縮要求'
    );

    // AIエンジンのgenerateRecommendationが正確な入力パラメータで呼ばれたことを確認
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        deal_id: 'DEAL-2024-001',
        customer_name: 'ABC株式会社',
        industry: '製造業',
        budget_amount: 5000000,
      })
    );
  });
});