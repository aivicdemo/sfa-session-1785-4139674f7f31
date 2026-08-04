import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出ロジック - 過去商談データが0件のエラーハンドリング', () => {
  // SCEN-2647
  test('過去商談データが0件のとき、PatternExtractionErrorが発生する', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
    };

    const newProjectInput = {
      customerId: 'CUST-20240115-001',
      customerName: 'テスト顧客',
      industry: '製造業',
      scale: 'large',
      businessChallenge: '生産効率化',
      historicalDeals: [],
    };

    expect(() => {
      findSimilarPatterns(newProjectInput, mockAIEngine);
    }).toThrow(/過去商談データ/);

    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});