import { extractAndApproveSuccessFailureFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-976
  test('ワークショップ参加者リストが空配列のときエラーを発生させる', () => {
    const workshopParticipants: any[] = [];
    const successCaseData = {
      caseId: 'case-001',
      dealAmount: 1000000,
      closedDate: '2024-01-15T11:00:00Z',
      outcome: 'success' as const,
    };
    const failureCaseData = {
      caseId: 'case-002',
      dealAmount: 500000,
      closedDate: '2024-01-10T09:30:00Z',
      outcome: 'failure' as const,
    };

    expect(() =>
      extractAndApproveSuccessFailureFactors({
        workshopParticipants,
        successCases: [successCaseData],
        failureCases: [failureCaseData],
        approvalThreshold: 0.8,
      })
    ).toThrow(/参加者/);
  });
});