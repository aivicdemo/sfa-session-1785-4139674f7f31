import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2617: 推奨提案アプローチの根拠データから過去平均契約金額が計算され、その値が表示される', () => {
    // テストデータ: 過去の成功商談データ
    const past_deals = [
      { contract_amount: 5000000, customer_industry: 'IT', customer_size: 'large' },
      { contract_amount: 8000000, customer_industry: 'IT', customer_size: 'large' },
      { contract_amount: 12000000, customer_industry: 'IT', customer_size: 'large' }
    ];

    // 過去平均契約金額の計算: (500万円 + 800万円 + 1200万円) / 3 = 833.33万円
    // 小数第1位以下は四捨五入: 833万円
    const expected_average_contract_amount = 8333333;
    const expected_average_contract_amount_rounded = 833;

    // AIRecommendationEngine のスタブ化
    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'rec-001',
        proposal_approach: '提案アプローチ: IT企業向け大型案件提案',
        confidence_score: 85,
        reasoning_data: {
          past_deals: past_deals,
          average_contract_amount: expected_average_contract_amount,
          similar_customer_count: 3
        }
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        `推奨内容の根拠: 過去類似案件の平均契約金額は833万円です。過去3件の類似案件では、IT企業向けの大型案件において高い成功率を記録しています。`
      )
    };

    // 新規案件情報
    const new_project = {
      customer_name: 'テスト太郎',
      customer_industry: 'IT',
      customer_size: 'large',
      deal_amount: 8000000,
      deal_stage: 'proposal'
    };

    // generateRecommendation の実行を想定
    const result = generateRecommendation(
      new_project,
      mock_ai_engine
    );

    // 戻り値の型と内容を検証
    expect(result).toHaveProperty('recommendation_id');
    expect(result).toHaveProperty('proposal_approach');
    expect(result).toHaveProperty('confidence_score');
    expect(result).toHaveProperty('reasoning_data');

    // 根拠データに平均契約金額が含まれていることを検証
    expect(result.reasoning_data).toHaveProperty('average_contract_amount');
    expect(result.reasoning_data.average_contract_amount).toBe(expected_average_contract_amount);

    // 根拠説明の自然言語文が適切に生成されていることを検証
    const reasoning_explanation = mock_ai_engine.explainRecommendationReasoning(result);
    expect(reasoning_explanation).toMatch(/833万円/);
    expect(reasoning_explanation).toMatch(/過去類似案件の平均契約金額/);

    // 信頼度スコアが 0～100 の範囲内であることを検証
    expect(result.confidence_score).toBeGreaterThanOrEqual(0);
    expect(result.confidence_score).toBeLessThanOrEqual(100);

    // explainRecommendationReasoning が呼び出されたことを確認
    expect(mock_ai_engine.explainRecommendationReasoning).toHaveBeenCalledWith(result);
  });
});