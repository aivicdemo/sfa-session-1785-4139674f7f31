import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2781
  test('課題パターンが欠けている商談レコードが含まれるとき、エラーを返す', () => {
    const dealRecordsWithMissingIssuePattern = [
      {
        dealId: 'DEAL001',
        customerId: 'CUST001',
        customerIndustry: '製造業',
        customerSize: '大企業',
        issuePattern: '生産効率化',
        dealStage: '提案',
        dealResult: '成約',
      },
      {
        dealId: 'DEAL002',
        customerId: 'CUST002',
        customerIndustry: '流通業',
        customerSize: '中企業',
        issuePattern: null,
        dealStage: '提案',
        dealResult: '成約',
      },
      {
        dealId: 'DEAL003',
        customerId: 'CUST003',
        customerIndustry: 'IT業',
        customerSize: '小企業',
        issuePattern: undefined,
        dealStage: '商談',
        dealResult: '失注',
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      extractSuccessPatterns(dealRecordsWithMissingIssuePattern, mockAIEngine)
    ).toThrow(/課題パターン/);
  });
});