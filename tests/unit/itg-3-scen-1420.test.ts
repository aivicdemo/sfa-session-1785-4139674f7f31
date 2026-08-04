import { evaluateProposalConstraintAlignment } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('提案内容と顧客制約条件の自動照合機能', () => {
  test('SCEN-1420: 顧客予算制約が0円のとき、提案内容の金額との照合が正しく判定される', () => {
    fetchMock.resetMocks();

    const customerConstraint = {
      customerId: 'CUST-001',
      budgetLimitAmount: 0,
      categoryRestrictions: [],
      frequencyLimitMonths: 0,
    };

    const proposalPatterns = [
      {
        proposalId: 'PROP-001',
        proposalAmount: 0,
        description: '提案金額0円',
      },
      {
        proposalId: 'PROP-002',
        proposalAmount: 100000,
        description: '提案金額100,000円',
      },
      {
        proposalId: 'PROP-003',
        proposalAmount: -50000,
        description: '提案金額-50,000円',
      },
    ];

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    mockAIEngine.evaluatePatternRelevance.mockResolvedValueOnce({
      relevanceScore: 100,
      applicable: true,
    });

    mockAIEngine.evaluatePatternRelevance.mockResolvedValueOnce({
      relevanceScore: 100,
      applicable: true,
    });

    mockAIEngine.evaluatePatternRelevance.mockResolvedValueOnce({
      relevanceScore: 100,
      applicable: true,
    });

    const results = proposalPatterns.map((proposal) =>
      evaluateProposalConstraintAlignment(
        proposal,
        customerConstraint,
        mockAIEngine
      )
    );

    expect(results[0]).toEqual({
      proposalId: 'PROP-001',
      alignmentStatus: 'WITHIN_CONSTRAINT',
      judgmentDetail: '制約内（予算制約0円に対し提案金額0円）',
      budgetConstraint: 0,
      proposalAmount: 0,
      isCompliant: true,
    });

    expect(results[1]).toEqual({
      proposalId: 'PROP-002',
      alignmentStatus: 'EXCEEDS_CONSTRAINT',
      judgmentDetail: '制約超過（予算制約0円に対し提案金額100,000円）',
      budgetConstraint: 0,
      proposalAmount: 100000,
      isCompliant: false,
    });

    expect(results[2]).toEqual({
      proposalId: 'PROP-003',
      alignmentStatus: 'ERROR',
      judgmentDetail: 'エラー：無効な提案金額（負の値）',
      budgetConstraint: 0,
      proposalAmount: -50000,
      isCompliant: false,
      warningMessage: '提案金額が無効です。負の値は許可されていません。',
    });
  });
});