import { describe, test, expect, beforeEach } from '@jest/globals';
import { evaluateApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-710
  test('成功・失敗要因の抽出と承認基準判定機能 - 重複する成功要因が含まれるとき、全件が個別に承認基準判定の対象となる', () => {
    const input = {
      factors: [
        {
          id: 'factor_001',
          name: '顧客ニーズの早期把握',
          type: 'success',
          caseId: 'case_100',
          timestamp: '2024-01-10T09:00:00Z',
        },
        {
          id: 'factor_002',
          name: '顧客ニーズの早期把握',
          type: 'success',
          caseId: 'case_100',
          timestamp: '2024-01-15T10:30:00Z',
        },
        {
          id: 'factor_003',
          name: '提案タイミングの最適化',
          type: 'success',
          caseId: 'case_101',
          timestamp: '2024-01-12T14:00:00Z',
        },
      ],
      approvalCriteria: {
        minRelevanceScore: 0.8,
        requiredCategoryCount: 2,
      },
    };

    const result = evaluateApprovalCriteria(input);

    expect(result).toEqual({
      evaluations: [
        {
          factorId: 'factor_001',
          factorName: '顧客ニーズの早期把握',
          caseId: 'case_100',
          meetsApprovalCriteria: true,
          relevanceScore: 0.95,
          evaluationTimestamp: '2024-01-10T09:00:00Z',
        },
        {
          factorId: 'factor_002',
          factorName: '顧客ニーズの早期把握',
          caseId: 'case_100',
          meetsApprovalCriteria: true,
          relevanceScore: 0.92,
          evaluationTimestamp: '2024-01-15T10:30:00Z',
        },
        {
          factorId: 'factor_003',
          factorName: '提案タイミングの最適化',
          caseId: 'case_101',
          meetsApprovalCriteria: true,
          relevanceScore: 0.87,
          evaluationTimestamp: '2024-01-12T14:00:00Z',
        },
      ],
      totalProcessedCount: 3,
      approvedCount: 3,
      rejectedCount: 0,
      processingStatus: 'completed',
    });
  });
});