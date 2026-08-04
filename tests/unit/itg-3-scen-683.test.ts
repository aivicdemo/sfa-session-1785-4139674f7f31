import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-683
  test('推奨根拠が0件のとき、デフォルトの説明文を生成する', () => {
    const customerId = 'CUST-001';
    const dealId = 'DEAL-001';
    const recommendationId = 'REC-001';
    const reasoning: any[] = [];

    const result = explainRecommendationReasoning(
      customerId,
      dealId,
      recommendationId,
      reasoning
    );

    const expectedExplanation = 'このAIエージェントは、お客様の商談条件に基づいて推奨を生成しています。詳細な根拠については、過去の成功パターンマスタを参照してください。ご不明な点は営業サポートチームにお問い合わせください。';

    expect(result).toBeDefined();
    expect(result.explanation).toBe(expectedExplanation);
  });
});