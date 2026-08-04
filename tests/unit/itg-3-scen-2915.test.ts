import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2915
  test('OpenAI API連携 - explainRecommendationReasoning呼び出しが失敗した場合、簡略版の根拠説明が代替表示される', async () => {
    const recommendationId = 'rec-001';
    const customerId = 'cust-12345';
    const industry = '製造業';
    const dealAmount = 5000000;

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn()
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockRejectedValueOnce(new Error('Timeout')),
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = [
      {
        pattern_id: 'pattern-01',
        success_rate: 0.85,
        description: '過去の類似案件では営業面談前のメール接触を行った事例が80%を占めています',
        frequency: 42,
      },
      {
        pattern_id: 'pattern-02',
        success_rate: 0.72,
        description: '顧客企業規模が1000名以上の場合、複数部門への提案展開が有効です',
        frequency: 28,
      },
      {
        pattern_id: 'pattern-03',
        success_rate: 0.68,
        description: '業界別では製造業向けプロダクトの導入期間は平均6ヶ月です',
        frequency: 18,
      },
    ];

    const newCaseData = {
      customer_name: 'テスト顧客A',
      industry: industry,
      company_size: 1500,
      deal_amount: dealAmount,
      business_challenge: 'デジタル変革',
      sales_rep_experience_years: 3,
    };

    const result = await explainRecommendationReasoning(
      recommendationId,
      newCaseData,
      mockAIEngine,
      mockPatternMaster
    );

    expect(result.status).toBe('degraded');
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.fallback_reasoning.pattern_id).toBe('pattern-01');
    expect(result.fallback_reasoning.description).toBe(
      '過去の類似案件では営業面談前のメール接触を行った事例が80%を占めています'
    );
    expect(result.fallback_reasoning.success_rate).toBe(0.85);
    expect(result.fallback_reasoning.is_simplified).toBe(true);

    expect(result.reasoning_type).toBe('simplified_statistical');
    expect(result.natural_language_explanation).toBeUndefined();

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
  });
});