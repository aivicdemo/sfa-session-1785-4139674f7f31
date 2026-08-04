import { extractSimilarSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  test('SCEN-1966: 商談金額が過去事例の金額帯下限未満のときにパターンが除外される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          id: 'pattern_a',
          name: 'パターンA',
          minAmount: 5000000,
          maxAmount: 10000000,
          industry: '製造業',
          successRate: 0.85,
        },
        {
          id: 'pattern_b',
          name: 'パターンB',
          minAmount: 10000000,
          maxAmount: 20000000,
          industry: '製造業',
          successRate: 0.80,
        },
        {
          id: 'pattern_c',
          name: 'パターンC',
          minAmount: 20000000,
          maxAmount: 50000000,
          industry: '製造業',
          successRate: 0.75,
        },
      ]),
    };

    const dealData = {
      customerName: 'テスト顧客001',
      dealAmount: 4500000,
      industry: '製造業',
      processType: 'standard',
    };

    const result = extractSimilarSuccessPatterns(dealData, mockAIEngine);

    expect(result).toEqual([]);
  });
});