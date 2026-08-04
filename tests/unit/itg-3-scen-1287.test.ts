import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能', () => {
  test('SCEN-1287: 顧客条件の適合度が閾値直上（75.1%）の成功パターンが対象として含まれる', () => {
    // テスト用のモック AIRecommendationEngine を初期化
    const mockSuccessPatterns = [
      {
        patternId: 'PATTERN_A',
        relevanceScore: 75.1,
        successHistory: {
          caseId: 'CASE_001',
          industry: 'Manufacturing',
          employeeCount: '500-1000',
          budgetRange: '50M-100M',
          adoptionRate: 92
        }
      },
      {
        patternId: 'PATTERN_B',
        relevanceScore: 74.9,
        successHistory: {
          caseId: 'CASE_002',
          industry: 'Manufacturing',
          employeeCount: '500-1000',
          budgetRange: '50M-100M',
          adoptionRate: 88
        }
      },
      {
        patternId: 'PATTERN_C',
        relevanceScore: 76.0,
        successHistory: {
          caseId: 'CASE_003',
          industry: 'Manufacturing',
          employeeCount: '500-1000',
          budgetRange: '50M-100M',
          adoptionRate: 95
        }
      }
    ];

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((pattern, customerCondition) => {
        const found = mockSuccessPatterns.find(p => p.patternId === pattern.patternId);
        return found ? found.relevanceScore : 0;
      }),
      findSimilarPatterns: jest.fn((customerCondition) => {
        const threshold = 75.0;
        return mockSuccessPatterns.filter(p => p.relevanceScore >= threshold);
      })
    };

    // 顧客条件を入力パラメータとして用意
    const customerCondition = {
      industry: 'Manufacturing',
      employeeCount: '500-1000',
      budgetRange: '50M-100M'
    };

    // findSimilarPatterns を呼び出し
    const result = findSimilarPatterns(customerCondition, mockAIEngine);

    // 期待結果を検証
    expect(result).toHaveLength(2);
    expect(result[0].patternId).toBe('PATTERN_A');
    expect(result[0].relevanceScore).toBe(75.1);
    expect(result[0].successHistory.caseId).toBe('CASE_001');
    expect(result[1].patternId).toBe('PATTERN_C');
    expect(result[1].relevanceScore).toBe(76.0);
    expect(result[1].successHistory.caseId).toBe('CASE_003');

    // 適合度74.9%のパターンB が含まれないことを確認
    const patternBExists = result.some(p => p.patternId === 'PATTERN_B');
    expect(patternBExists).toBe(false);

    // 各パターンが正しい形式で返却されることを確認
    result.forEach(pattern => {
      expect(pattern).toHaveProperty('patternId');
      expect(pattern).toHaveProperty('relevanceScore');
      expect(pattern).toHaveProperty('successHistory');
      expect(typeof pattern.patternId).toBe('string');
      expect(typeof pattern.relevanceScore).toBe('number');
      expect(typeof pattern.successHistory).toBe('object');
    });
  });
});