import { analyzeProposalAndCustomerResponsePattern } from '../../src/logic/it-1-br-2-1-1';

describe('提案内容と顧客対応パターンの標準プロセス比較分析', () => {
  test('SCEN-710: 提案実行から顧客対応記録入力までの期間が閾値未満の場合に正常判定される', () => {
    // Arrange
    const proposalExecutionDateTime = new Date('2024-01-01T10:00:00Z');
    const customerResponseRecordDateTime = new Date('2024-01-01T10:29:00Z');
    const thresholdMinutes = 30;
    const currentExecutionDateTime = new Date('2024-01-01T10:29:00Z');

    const mockProposalData = {
      proposalId: 'PROP-001',
      executionDateTime: proposalExecutionDateTime,
      content: 'Standard proposal template',
      salesPersonId: 'SALES-001',
      customerId: 'CUST-001',
    };

    const mockCustomerResponseRecord = {
      recordId: 'REC-001',
      inputDateTime: customerResponseRecordDateTime,
      responseType: 'phone_call',
      responseContent: 'Customer confirmed interest',
      customerId: 'CUST-001',
    };

    const mockSystemConfig = {
      thresholdMinutesForResponseTiming: thresholdMinutes,
      standardProcessSteps: [
        { stepName: 'initial_contact', expectedDurationMinutes: 1440 },
        { stepName: 'proposal_execution', expectedDurationMinutes: 120 },
        { stepName: 'customer_response_check', expectedDurationMinutes: 30 },
        { stepName: 'negotiation', expectedDurationMinutes: 1440 },
        { stepName: 'contract_conclusion', expectedDurationMinutes: 240 },
      ],
    };

    // Act
    const result = analyzeProposalAndCustomerResponsePattern({
      proposalData: mockProposalData,
      customerResponseRecord: mockCustomerResponseRecord,
      systemConfig: mockSystemConfig,
      currentExecutionDateTime: currentExecutionDateTime,
    });

    // Assert
    expect(result.elapsedMinutes).toBe(29);
    expect(result.judgeStatus).toBe('normal');
    expect(result.isWithinThreshold).toBe(true);
    expect(result.thresholdMinutes).toBe(30);
  });
});