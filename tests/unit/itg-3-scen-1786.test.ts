import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1786: [normal] 推奨根拠の可視化機能 - 推奨数量の根拠として過去購買量が説明される
  test('推奨根拠の可視化画面に過去購買量が説明文とともに正確に表示される', async () => {
    // テストデータ: 過去12ヶ月の月別購買量を含む顧客情報
    const customerData = {
      customer_id: 'CUST-001',
      company_name: 'テスト会社',
      purchase_history: [
        { month: '2024-01', quantity: 48 },
        { month: '2024-02', quantity: 52 },
        { month: '2024-03', quantity: 49 },
        { month: '2024-04', quantity: 51 },
        { month: '2024-05', quantity: 50 },
        { month: '2024-06', quantity: 53 },
        { month: '2024-07', quantity: 54 },
        { month: '2024-08', quantity: 55 },
        { month: '2024-09', quantity: 57 },
        { month: '2024-10', quantity: 58 },
        { month: '2024-11', quantity: 59 },
        { month: '2024-12', quantity: 60 },
      ],
    };

    const proposalData = {
      product_id: 'PROD-001',
      current_proposal_quantity: 60,
    };

    // AIRecommendationEngine.generateRecommendation() をスタブ化
    // 推奨数量60単位と、根拠説明を含む推奨オブジェクトを返す
    const mockRecommendation = {
      recommended_quantity: 60,
      confidence_score: 85,
      reasoning_basis: [
        {
          basis_type: 'past_purchase_volume',
          label: '過去購買量',
          description:
            '過去3ヶ月の平均購買量は50単位、前年同期比120%の成長トレンドを踏まえ、今月の推奨数量を60単位と算出',
        },
      ],
    };

    // AIRecommendationEngine.explainRecommendationReasoning() をスタブ化
    // reasoningText フィールドに詳細説明を返す
    const mockExplanation = {
      reasoning_text:
        '過去購買データから、貴社は毎月平均50単位を購入しており、直近3ヶ月は増加傾向にあります。この傾向を基に、安定供給と成長対応を兼ねて60単位を推奨します',
      supporting_data: {
        past_3_month_average: 50,
        growth_rate_percent: 120,
        recommended_amount: 60,
      },
    };

    // 実装側で外部エンジンをスタブとして注入できるようにする想定
    const mockAIEngine = {
      generateRecommendation: jest
        .fn()
        .mockResolvedValue(mockRecommendation),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(mockExplanation),
    };

    // 推奨根拠の可視化ロジックを呼び出す
    const result = await generateRecommendation(customerData, proposalData, mockAIEngine);

    // 推奨数量が正確に60単位であることを検証
    expect(result.recommended_quantity).toBe(60);

    // 推奨根拠に『過去購買量』というラベルが含まれていることを検証
    expect(result.reasoning_basis).toHaveLength(1);
    expect(result.reasoning_basis[0].basis_type).toBe('past_purchase_volume');
    expect(result.reasoning_basis[0].label).toBe('過去購買量');

    // 根拠説明テキストを取得
    const explanation = await explainRecommendationReasoning(
      result,
      mockAIEngine
    );

    // reasoningText が正確に設定した説明文と一致していることを検証
    expect(explanation.reasoning_text).toBe(
      '過去購買データから、貴社は毎月平均50単位を購入しており、直近3ヶ月は増加傾向にあります。この傾向を基に、安定供給と成長対応を兼ねて60単位を推奨します'
    );

    // サポートデータの値が根拠説明と整合していることを検証
    expect(explanation.supporting_data.past_3_month_average).toBe(50);
    expect(explanation.supporting_data.growth_rate_percent).toBe(120);
    expect(explanation.supporting_data.recommended_amount).toBe(60);

    // 根拠説明内に『過去3ヶ月の平均購買量は50単位』が含まれていることを検証
    expect(explanation.reasoning_text).toMatch(/過去3ヶ月.*50単位/);

    // 根拠説明内に『60単位と算出』が含まれていることを検証
    expect(explanation.reasoning_text).toMatch(/60単位/);

    // 推奨根拠の詳細説明が根拠説明テキストと整合していることを検証
    expect(result.reasoning_basis[0].description).toMatch(/50単位/);
    expect(result.reasoning_basis[0].description).toMatch(/60単位/);
  });
});