import { calculateProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2117
  test('提案内容と標準プロセスの乖離度算出 - 標準プロセスの構造が期待スキーマに不適合のとき、エラーが発生する', () => {
    const proposalData = {
      proposalId: 'PROP-001',
      customerId: 'CUST-001',
      proposalContent: 'Proposal content',
      proposalApproach: 'Approach A',
      customerInteractionPattern: 'Pattern 1',
      createdAt: '2024-01-15T11:00:00Z',
    };

    const invalidStandardProcess1 = {
      processId: 'PROC-001',
      processName: 'Standard Sales Process',
      steps: 'invalid-string-instead-of-array',
      expectedOutcome: 'Successful contract',
    };

    const invalidStandardProcess2 = {
      processName: 'Standard Sales Process',
      steps: [
        {
          stepId: 'STEP-001',
          stepName: 'Initial Contact',
          expectedDuration: 3,
        },
      ],
      expectedOutcome: 'Successful contract',
    };

    const invalidStandardProcess3 = {
      processId: 'PROC-003',
      processName: 'Standard Sales Process',
      steps: [
        {
          stepId: 'STEP-001',
          stepName: 'Initial Contact',
        },
      ],
      expectedOutcome: 'Successful contract',
    };

    expect(() =>
      calculateProcessDeviation(proposalData, invalidStandardProcess1 as any)
    ).toThrow(/標準プロセススキーマ/);

    expect(() =>
      calculateProcessDeviation(proposalData, invalidStandardProcess2 as any)
    ).toThrow(/processId/);

    expect(() =>
      calculateProcessDeviation(proposalData, invalidStandardProcess3 as any)
    ).toThrow(/expectedDuration/);
  });
});