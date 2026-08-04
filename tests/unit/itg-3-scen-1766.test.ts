import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1766
  test('推奨内容の根拠表示機能 - 根拠説明文が業務上の最大文字数のとき根拠表示内容を正しく返す', async () => {
    const maxCharCount = 4096;
    const samplePrefix = '本推奨は以下の分析に基づいています。顧客属性分析では、提供企業の業種が小売業で、従業員数が500名規模であることから、';
    const sampleMiddle = 'このような条件下での提案成功率は過去事例から73%と高く、特に予算規模500万円から1,000万円の範囲での実装が最適です。';
    const sampleSuffix = 'タイミング分析では、顧客の決算期が3月であり、現在が1月であることから、予算承認のゴールデンタイムと合致しています。リスク要因の分析から、競合提案との比較では当社提案が機能面で優位性を持つ可能性が83%と評価されました。以上の総合判定により、本推奨内容を提示しています。';
    
    let paddingLength = maxCharCount - samplePrefix.length - sampleMiddle.length - sampleSuffix.length;
    const paddingText = 'A'.repeat(paddingLength);
    const mockReasoningText = samplePrefix + sampleMiddle + paddingText + sampleSuffix;

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningText: mockReasoningText,
        confidenceScore: 82,
      }),
    };

    const dealCondition = {
      customerId: 'CUST-12345',
      customerName: 'テスト株式会社',
      industry: '小売業',
      companySize: 500,
      budgetAmount: 750000,
      dealStage: '初期検討',
      proposalType: 'システム導入',
    };

    const result = await explainRecommendationReasoning(dealCondition, mockAIEngine);

    expect(result.reasoningText.length).toBe(maxCharCount);
    expect(result.reasoningText.substring(0, 100)).toBe(samplePrefix.substring(0, 100));
    expect(result.reasoningText.substring(maxCharCount - 100)).toBe(sampleSuffix.substring(sampleSuffix.length - 100));
    expect(result.reasoningText).toMatch(/^本推奨は以下の分析に基づいています/);
    expect(result.reasoningText).toMatch(/以上の総合判定により、本推奨内容を提示しています。$/);
    expect(result.confidenceScore).toBe(82);
    expect(result.isRenderable).toBe(true);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(dealCondition);
  });
});