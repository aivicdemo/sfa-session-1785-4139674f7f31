import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似パターン検索機能 - 出現順維持', () => {
  // SCEN-1152
  test('同一スコアの重複データが含まれるとき、出現順で維持した状態で返却する', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          dealId: 'DEAL-001',
          score: 0.85,
          customerName: 'A社',
          industry: '小売',
          budget: 5000000,
        },
        {
          dealId: 'DEAL-002',
          score: 0.85,
          customerName: 'B社',
          industry: '小売',
          budget: 4500000,
        },
        {
          dealId: 'DEAL-001',
          score: 0.85,
          customerName: 'A社',
          industry: '小売',
          budget: 5000000,
        },
        {
          dealId: 'DEAL-003',
          score: 0.85,
          customerName: 'C社',
          industry: '小売',
          budget: 5500000,
        },
      ]),
    };

    const newProjectCondition = {
      budget: 5000000,
      industry: '小売',
    };

    const result = findSimilarPatterns(newProjectCondition, mockAIEngine);

    expect(result).toHaveLength(4);
    expect(result[0].dealId).toBe('DEAL-001');
    expect(result[0].customerName).toBe('A社');
    expect(result[0].score).toBe(0.85);
    expect(result[1].dealId).toBe('DEAL-002');
    expect(result[1].customerName).toBe('B社');
    expect(result[1].score).toBe(0.85);
    expect(result[2].dealId).toBe('DEAL-001');
    expect(result[2].customerName).toBe('A社');
    expect(result[2].score).toBe(0.85);
    expect(result[3].dealId).toBe('DEAL-003');
    expect(result[3].customerName).toBe('C社');
    expect(result[3].score).toBe(0.85);
  });
});