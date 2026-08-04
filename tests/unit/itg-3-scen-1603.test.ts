import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1603
  test('提案内容が空文字列のとき、一致度が0として計算される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn((input: any) => {
        const { proposalContent } = input;
        
        if (proposalContent === '') {
          return {
            similarCustomers: [],
            matchScores: [
              { customerId: 'PAST001', matchScore: 0.0 },
              { customerId: 'PAST002', matchScore: 0.0 },
              { customerId: 'PAST003', matchScore: 0.0 }
            ]
          };
        }
        
        return {
          similarCustomers: [],
          matchScores: []
        };
      })
    };

    const inputData = {
      customerId: 'C001',
      proposalContent: '',
      industry: 'manufacturing',
      companySize: 'large',
      challenges: []
    };

    const result = findSimilarPatterns(inputData, mockAIEngine);

    expect(result.matchScores).toEqual([
      { customerId: 'PAST001', matchScore: 0.0 },
      { customerId: 'PAST002', matchScore: 0.0 },
      { customerId: 'PAST003', matchScore: 0.0 }
    ]);
    
    expect(result.similarCustomers).toEqual([]);
    
    result.matchScores.forEach((score) => {
      expect(score.matchScore).toBe(0.0);
    });
  });
});