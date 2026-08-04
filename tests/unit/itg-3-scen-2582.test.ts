import { extractSuccessPatternsFromDeals } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データからの成功パターン抽出機能', () => {
  // SCEN-2582
  test('成功した商談件数が閾値直下のとき、すべてがパターン抽出に含まれる', () => {
    // テストデータ準備: 成功商談99件（閾値100件の直下）
    const successfulDealCount = 99;
    const successfulDeals = Array.from({ length: successfulDealCount }, (_, i) => ({
      dealId: `DEAL-${String(i + 1).padStart(3, '0')}`,
      customerId: `CUST-${String((i % 10) + 1).padStart(2, '0')}`,
      industry: ['IT', 'Manufacturing', 'Finance', 'Retail', 'Healthcare'][i % 5],
      dealAmount: 500000 + i * 10000,
      contractedDays: 20 + (i % 30),
      successStatus: true,
      closedDate: new Date('2024-01-15T11:00:00Z').toISOString(),
    }));

    // AIRecommendationEngineスタブ設定
    const aiEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        patterns: successfulDeals.map((deal, i) => ({
          patternId: `PATTERN-${String(i + 1).padStart(3, '0')}`,
          dealId: deal.dealId,
          customerId: deal.customerId,
          industry: deal.industry,
          dealAmountBand: `${Math.floor(deal.dealAmount / 100000) * 100000}-${(Math.floor(deal.dealAmount / 100000) + 1) * 100000}`,
          contractedPeriodDays: deal.contractedDays,
          successIndicator: true,
        })),
      }),
      evaluatePatternRelevance: jest.fn((pattern) => ({
        patternId: pattern.patternId,
        relevanceScore: 65 + Math.random() * 35, // スコア範囲: 65-100
        applicability: true,
      })),
    };

    // 過去商談データからの成功パターン抽出機能を実行
    const extractionResult = extractSuccessPatternsFromDeals(
      successfulDeals,
      aiEngineStub
    );

    // 抽出されたパターン数が99件であることを確認
    expect(extractionResult.extractedPatterns.length).toBe(99);

    // 各パターンの詳細情報を検証
    extractionResult.extractedPatterns.forEach((pattern, index) => {
      // パターンIDが正しく生成されていることを確認
      expect(pattern.patternId).toBe(`PATTERN-${String(index + 1).padStart(3, '0')}`);

      // 顧客業種が含まれていることを確認
      expect(pattern.industry).toBeDefined();
      expect(['IT', 'Manufacturing', 'Finance', 'Retail', 'Healthcare']).toContain(pattern.industry);

      // 商談金額帯が含まれていることを確認
      expect(pattern.dealAmountBand).toBeDefined();
      expect(typeof pattern.dealAmountBand).toBe('string');

      // 成約期間が含まれていることを確認
      expect(pattern.contractedPeriodDays).toBeDefined();
      expect(typeof pattern.contractedPeriodDays).toBe('number');
      expect(pattern.contractedPeriodDays).toBeGreaterThanOrEqual(20);
      expect(pattern.contractedPeriodDays).toBeLessThan(50);

      // 適用可能スコアが0以上の有効な数値で返却されていることを確認
      expect(pattern.relevanceScore).toBeDefined();
      expect(typeof pattern.relevanceScore).toBe('number');
      expect(pattern.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(pattern.relevanceScore).toBeLessThanOrEqual(100);

      // 適用可能フラグが真であることを確認
      expect(pattern.applicability).toBe(true);
    });

    // 抽出パターン総数がすべての入力データと一致していることを確認
    expect(extractionResult.totalExtractedCount).toBe(99);

    // 欠落・フィルタ除外されたパターンがないことを確認
    expect(extractionResult.excludedPatternCount).toBe(0);

    // AIエンジンスタブのメソッドが正しく呼び出されたことを確認
    expect(aiEngineStub.findSimilarPatterns).toHaveBeenCalledWith(successfulDeals);
    expect(aiEngineStub.evaluatePatternRelevance).toHaveBeenCalledTimes(99);
  });
});