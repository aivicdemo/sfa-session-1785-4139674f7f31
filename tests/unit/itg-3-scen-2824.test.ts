import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック - 月間集計値の正確性', () => {
  test('SCEN-2824: 月初から月末までちょうど1ヶ月分の商談データから期間集計値が正確に計算される', () => {
    // ========== データセット準備 ==========
    const startDate = new Date('2024-01-01T00:00:00Z');
    const endDate = new Date('2024-01-31T23:59:59Z');

    const pastDealData = [
      {
        dealId: 'DEAL001',
        customerId: 'CUST001',
        dealDate: new Date('2024-01-05T10:00:00Z'),
        dealAmount: 500000,
        dealDurationDays: 15,
        customerIndustry: 'manufacturing',
        isSuccess: true,
      },
      {
        dealId: 'DEAL002',
        customerId: 'CUST002',
        dealDate: new Date('2024-01-08T14:30:00Z'),
        dealAmount: 1200000,
        dealDurationDays: 20,
        customerIndustry: 'retail',
        isSuccess: true,
      },
      {
        dealId: 'DEAL003',
        customerId: 'CUST003',
        dealDate: new Date('2024-01-12T09:15:00Z'),
        dealAmount: 300000,
        dealDurationDays: 10,
        customerIndustry: 'manufacturing',
        isSuccess: false,
      },
      {
        dealId: 'DEAL004',
        customerId: 'CUST004',
        dealDate: new Date('2024-01-15T11:45:00Z'),
        dealAmount: 800000,
        dealDurationDays: 18,
        customerIndustry: 'it_services',
        isSuccess: true,
      },
      {
        dealId: 'DEAL005',
        customerId: 'CUST005',
        dealDate: new Date('2024-01-18T16:20:00Z'),
        dealAmount: 450000,
        dealDurationDays: 12,
        customerIndustry: 'finance',
        isSuccess: false,
      },
      {
        dealId: 'DEAL006',
        customerId: 'CUST006',
        dealDate: new Date('2024-01-22T13:00:00Z'),
        dealAmount: 950000,
        dealDurationDays: 22,
        customerIndustry: 'manufacturing',
        isSuccess: true,
      },
      {
        dealId: 'DEAL007',
        customerId: 'CUST007',
        dealDate: new Date('2024-01-24T10:30:00Z'),
        dealAmount: 600000,
        dealDurationDays: 14,
        customerIndustry: 'retail',
        isSuccess: true,
      },
      {
        dealId: 'DEAL008',
        customerId: 'CUST008',
        dealDate: new Date('2024-01-26T15:15:00Z'),
        dealAmount: 1100000,
        dealDurationDays: 21,
        customerIndustry: 'it_services',
        isSuccess: false,
      },
      {
        dealId: 'DEAL009',
        customerId: 'CUST009',
        dealDate: new Date('2024-01-28T12:45:00Z'),
        dealAmount: 700000,
        dealDurationDays: 16,
        customerIndustry: 'finance',
        isSuccess: true,
      },
      {
        dealId: 'DEAL010',
        customerId: 'CUST010',
        dealDate: new Date('2024-01-30T09:00:00Z'),
        dealAmount: 1050000,
        dealDurationDays: 19,
        customerIndustry: 'manufacturing',
        isSuccess: true,
      },
    ];

    // ========== 期待値の計算 ==========
    const totalDealCount = 10;
    const successDealCount = 7; // DEAL001, DEAL002, DEAL004, DEAL006, DEAL007, DEAL009, DEAL010
    const successRate = 7 / 10; // 0.7
    const totalRevenue = 500000 + 1200000 + 300000 + 800000 + 450000 + 950000 + 600000 + 1100000 + 700000 + 1050000; // 7650000
    const averageRevenue = 7650000 / 10; // 765000

    // パターン別の重み付けスコア計算
    // manufacturing: 4件中3件成功 (DEAL001, DEAL006, DEAL010) → 成功率0.75, 売上(500k + 950k + 1050k = 2500k)
    // retail: 2件中2件成功 (DEAL002, DEAL007) → 成功率1.0, 売上(1200k + 600k = 1800k)
    // it_services: 2件中1件成功 (DEAL004) → 成功率0.5, 売上(800k + 1100k = 1900k)
    // finance: 2件中1件成功 (DEAL009) → 成功率0.5, 売上(450k + 700k = 1150k)

    const manufacturingSuccessRate = 3 / 4; // 0.75
    const retailSuccessRate = 2 / 2; // 1.0
    const itSuccessRate = 1 / 2; // 0.5
    const financeSuccessRate = 1 / 2; // 0.5

    const manufacturingRevenue = 2500000;
    const retailRevenue = 1800000;
    const itRevenue = 1900000;
    const financeRevenue = 1150000;

    // 正規化スコア（成功率 * (業種別売上 / 総売上)）
    const manufacturingWeight = manufacturingSuccessRate * (manufacturingRevenue / totalRevenue);
    const retailWeight = retailSuccessRate * (retailRevenue / totalRevenue);
    const itWeight = itSuccessRate * (itRevenue / totalRevenue);
    const financeWeight = financeSuccessRate * (financeRevenue / totalRevenue);

    // ========== AIRecommendationEngineのスタブ化 ==========
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { patternId: 'PAT001', similarity: 0.92 },
        { patternId: 'PAT002', similarity: 0.88 },
        { patternId: 'PAT003', similarity: 0.85 },
        { patternId: 'PAT004', similarity: 0.82 },
        { patternId: 'PAT005', similarity: 0.80 },
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // ========== 主処理を実行 ==========
    const result = extractSuccessPatterns(
      {
        dealData: pastDealData,
        periodStart: startDate,
        periodEnd: endDate,
        aggregationUnit: 'month',
      },
      mockAIEngine
    );

    // ========== 期間集計値の検証 ==========
    // (1) 集計件数が10件である
    expect(result.aggregationMetrics.totalDealCount).toBe(10);

    // (2) 成功率が正確に計算されている
    expect(result.aggregationMetrics.successRate).toBeCloseTo(0.7, 5);

    // (3) 平均売上金額が正確に計算されている
    expect(result.aggregationMetrics.averageRevenue).toBeCloseTo(765000, 2);

    // (4) パターン別の重み付けスコアが正規化スコアとして計算されている
    expect(result.patternWeights).toHaveProperty('manufacturing');
    expect(result.patternWeights).toHaveProperty('retail');
    expect(result.patternWeights).toHaveProperty('it_services');
    expect(result.patternWeights).toHaveProperty('finance');

    expect(result.patternWeights.manufacturing).toBeCloseTo(manufacturingWeight, 5);
    expect(result.patternWeights.retail).toBeCloseTo(retailWeight, 5);
    expect(result.patternWeights.it_services).toBeCloseTo(itWeight, 5);
    expect(result.patternWeights.finance).toBeCloseTo(financeWeight, 5);

    // (5) 集計期間が月初から月末までのちょうど1ヶ月間として記録されている
    expect(result.aggregationPeriod.startDate).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(result.aggregationPeriod.endDate).toEqual(new Date('2024-01-31T23:59:59Z'));
    expect(result.aggregationPeriod.unit).toBe('month');

    // (6) 外部AIエンジン呼び出しはスタブ経由でのみ行われ、実際のOpenAI APIへの通信が発生していない
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        dealData: expect.any(Array),
        periodStart: startDate,
        periodEnd: endDate,
      })
    );

    // スタブが返した類似パターン5件がすべて結果に含まれている
    expect(result.similarPatterns).toHaveLength(5);
    expect(result.similarPatterns[0].similarity).toBe(0.92);
    expect(result.similarPatterns[4].similarity).toBe(0.80);
  });
});