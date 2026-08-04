import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2471: OpenAI APIが正常応答し、推奨内容と根拠が生成される', async () => {
    // Arrange: OpenAI APIのスタブ設定
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-20240115-001',
        proposalApproach: '顧客の課題はコスト削減であり、類似5件の成功事例では契約前段階での複数提案が効果的',
        successProbability: 0.82,
        recommendedStrategy: '提案複数パターン提示により顧客の選択肢を増加させ、意思決定を促進'
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        recommendationId: 'rec-20240115-001',
        reasoning: '過去の同業種・同規模顧客3件が同様の課題で提案内容Aを選択し、全件1ヶ月以内の成約。提案複数パターン提示により顧客の選択肢が増え、意思決定が促進された',
        similarCases: [
          { caseId: 'case-001', industry: '製造業', scale: '中堅企業', outcome: 'contracted' },
          { caseId: 'case-002', industry: '製造業', scale: '中堅企業', outcome: 'contracted' },
          { caseId: 'case-003', industry: '製造業', scale: '中堅企業', outcome: 'contracted' }
        ]
      })
    };

    // テスト用の新規案件データ
    const newDealData = {
      customerId: 'cust-12345',
      customerName: 'テスト株式会社',
      industry: '製造業',
      scale: 'medium',
      businessChallenge: 'コスト削減',
      budget: 5000000,
      dealStage: 'initial_proposal',
      timelineMonths: 3
    };

    // 処理実行時間の開始計測
    const startTime = Date.now();

    // Act: 推奨内容の生成
    const result = await generateRecommendationWithReasoning(
      newDealData,
      mockAIRecommendationEngine
    );

    // 処理実行時間の終了計測
    const endTime = Date.now();
    const elapsedTimeSeconds = (endTime - startTime) / 1000;

    // Assert: 推奨内容の検証
    expect(result.recommendation).toBeDefined();
    expect(result.recommendation.recommendationId).toBe('rec-20240115-001');
    expect(result.recommendation.proposalApproach).toBe('顧客の課題はコスト削減であり、類似5件の成功事例では契約前段階での複数提案が効果的');
    expect(result.recommendation.successProbability).toBe(0.82);
    expect(result.recommendation.recommendedStrategy).toBe('提案複数パターン提示により顧客の選択肢を増加させ、意思決定を促進');

    // 根拠説明の検証
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.recommendationId).toBe('rec-20240115-001');
    expect(result.reasoning.reasoning).toBe('過去の同業種・同規模顧客3件が同様の課題で提案内容Aを選択し、全件1ヶ月以内の成約。提案複数パターン提示により顧客の選択肢が増え、意思決定が促進された');
    expect(result.reasoning.similarCases).toHaveLength(3);
    expect(result.reasoning.similarCases[0].caseId).toBe('case-001');
    expect(result.reasoning.similarCases[0].outcome).toBe('contracted');

    // 推奨IDで紐付けられていることを確認
    expect(result.recommendation.recommendationId).toBe(result.reasoning.recommendationId);

    // レスポンスタイムが30秒以内であることを確認
    expect(elapsedTimeSeconds).toBeLessThan(30);

    // API呼び出しの検証
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(newDealData);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: 'rec-20240115-001'
      })
    );
  });
});