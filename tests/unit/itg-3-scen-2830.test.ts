import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2830
  test('推奨根拠の説明文が500文字を超えるとき、省略フラグが立ち短縮版が生成される', async () => {
    const longReasoningText = '顧客のIT予算が過去3年間で年平均15%増加している傾向から、高額ソリューション提案の成功事例が80件以上マッチしました。業界別では金融機関での導入率が92%と最も高く、同じ業界の競合他社との差別化要因として、システム統合による業務効率化が月平均25時間削減できることが実績として記録されています。顧客のIT予算が過去3年間で年平均15%増加している傾向から、高額ソリューション提案の成功事例が80件以上マッチしました。業界別では金融機関での導入率が92%と最も高く、同じ業界の競合他社との差別化要因として、システム統合による業務効率化が月平均25時間削減できることが実績として記録されています。';

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: longReasoningText,
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealId = 'deal-12345';
    const customerId = 'customer-67890';
    const recommendationId = 'rec-11111';

    const result = await explainRecommendationReasoning(
      dealId,
      customerId,
      recommendationId,
      mockAIEngine
    );

    expect(result.reasoningText).toBe(longReasoningText);
    expect(result.characterCount).toBe(520);
    expect(result.isAbbreviated).toBe(true);
    expect(result.abbreviatedText).toBeDefined();
    expect(result.abbreviatedText.length).toBeGreaterThanOrEqual(180);
    expect(result.abbreviatedText.length).toBeLessThanOrEqual(200);
    expect(result.abbreviatedText).toMatch(/^.+\.\.\./);
  });
});