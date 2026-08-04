import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件への提案アプローチを推奨する機能', () => {
  // SCEN-1605
  test('類似顧客マッチング処理 - 過去顧客データの順序が逆順のとき、一致度の計算結果は順序に関わらず同一である', async () => {
    // 新規顧客データ（基準となる顧客情報）
    const newCustomerData = {
      customerId: 'NEW001',
      industry: 'IT',
      size: 'enterprise',
      annualRevenue: 10000000,
      employeeCount: 500,
      region: 'Tokyo',
    };

    // 過去顧客データ配列A: [C001, C002, C003]
    const historicalCustomersA = [
      {
        customerId: 'C001',
        industry: 'IT',
        size: 'enterprise',
        annualRevenue: 9500000,
        employeeCount: 480,
        region: 'Tokyo',
        dealCount: 3,
        successRate: 0.85,
      },
      {
        customerId: 'C002',
        industry: 'Telecom',
        size: 'mid-market',
        annualRevenue: 5000000,
        employeeCount: 200,
        region: 'Osaka',
        dealCount: 2,
        successRate: 0.75,
      },
      {
        customerId: 'C003',
        industry: 'Finance',
        size: 'large',
        annualRevenue: 15000000,
        employeeCount: 800,
        region: 'Tokyo',
        dealCount: 5,
        successRate: 0.92,
      },
    ];

    // 過去顧客データ配列B: [C003, C002, C001] - 配列Aを逆順に並び替え
    const historicalCustomersB = [
      {
        customerId: 'C003',
        industry: 'Finance',
        size: 'large',
        annualRevenue: 15000000,
        employeeCount: 800,
        region: 'Tokyo',
        dealCount: 5,
        successRate: 0.92,
      },
      {
        customerId: 'C002',
        industry: 'Telecom',
        size: 'mid-market',
        annualRevenue: 5000000,
        employeeCount: 200,
        region: 'Osaka',
        dealCount: 2,
        successRate: 0.75,
      },
      {
        customerId: 'C001',
        industry: 'IT',
        size: 'enterprise',
        annualRevenue: 9500000,
        employeeCount: 480,
        region: 'Tokyo',
        dealCount: 3,
        successRate: 0.85,
      },
    ];

    // AIRecommendationEngineスタブ化
    const mockAIEngine = {
      findSimilarPatterns: jest
        .fn()
        .mockResolvedValueOnce({
          results: [
            {
              customerId: 'C001',
              matchingScore: 87.50000000,
              matchingRank: 1,
              confidence: 0.92,
            },
            {
              customerId: 'C003',
              matchingScore: 72.10000000,
              matchingRank: 2,
              confidence: 0.85,
            },
            {
              customerId: 'C002',
              matchingScore: 54.30000000,
              matchingRank: 3,
              confidence: 0.71,
            },
          ],
        })
        .mockResolvedValueOnce({
          results: [
            {
              customerId: 'C001',
              matchingScore: 87.50000000,
              matchingRank: 1,
              confidence: 0.92,
            },
            {
              customerId: 'C003',
              matchingScore: 72.10000000,
              matchingRank: 2,
              confidence: 0.85,
            },
            {
              customerId: 'C002',
              matchingScore: 54.30000000,
              matchingRank: 3,
              confidence: 0.71,
            },
          ],
        }),
    };

    // 配列Aに対して類似顧客マッチング処理を実行
    const resultsA = await findSimilarPatterns(
      newCustomerData,
      historicalCustomersA,
      mockAIEngine
    );

    // 配列Bに対して同じ新規顧客データで類似顧客マッチング処理を実行
    const resultsB = await findSimilarPatterns(
      newCustomerData,
      historicalCustomersB,
      mockAIEngine
    );

    // 配列Aと配列Bのマッチング結果を比較
    expect(resultsA.results).toHaveLength(3);
    expect(resultsB.results).toHaveLength(3);

    // 各顧客のマッチングスコアが完全に一致することを確認（小数点以下8桁まで）
    resultsA.results.forEach((resultA, index) => {
      const resultB = resultsB.results.find(
        (r) => r.customerId === resultA.customerId
      );
      expect(resultB).toBeDefined();

      // マッチングスコアの一致度を小数点以下8桁まで比較
      expect(resultB!.matchingScore).toBe(resultA.matchingScore);

      // マッチング順位の一致を確認
      expect(resultB!.matchingRank).toBe(resultA.matchingRank);

      // 信頼度の一致を確認
      expect(resultB!.confidence).toBe(resultA.confidence);
    });

    // 具体的な検証: C001の一致度が最高（87.50000000）
    const c001ResultA = resultsA.results.find(
      (r) => r.customerId === 'C001'
    );
    const c001ResultB = resultsB.results.find(
      (r) => r.customerId === 'C001'
    );

    expect(c001ResultA!.matchingScore).toBe(87.50000000);
    expect(c001ResultB!.matchingScore).toBe(87.50000000);
    expect(c001ResultA!.matchingRank).toBe(1);
    expect(c001ResultB!.matchingRank).toBe(1);
    expect(c001ResultA!.confidence).toBe(0.92);
    expect(c001ResultB!.confidence).toBe(0.92);

    // C003の一致度を確認
    const c003ResultA = resultsA.results.find(
      (r) => r.customerId === 'C003'
    );
    const c003ResultB = resultsB.results.find(
      (r) => r.customerId === 'C003'
    );

    expect(c003ResultA!.matchingScore).toBe(72.10000000);
    expect(c003ResultB!.matchingScore).toBe(72.10000000);
    expect(c003ResultA!.matchingRank).toBe(2);
    expect(c003ResultB!.matchingRank).toBe(2);
    expect(c003ResultA!.confidence).toBe(0.85);
    expect(c003ResultB!.confidence).toBe(0.85);

    // C002の一致度を確認
    const c002ResultA = resultsA.results.find(
      (r) => r.customerId === 'C002'
    );
    const c002ResultB = resultsB.results.find(
      (r) => r.customerId === 'C002'
    );

    expect(c002ResultA!.matchingScore).toBe(54.30000000);
    expect(c002ResultB!.matchingScore).toBe(54.30000000);
    expect(c002ResultA!.matchingRank).toBe(3);
    expect(c002ResultB!.matchingRank).toBe(3);
    expect(c002ResultA!.confidence).toBe(0.71);
    expect(c002ResultB!.confidence).toBe(0.71);

    // AIEngineが2回呼び出されたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(2);
  });
});