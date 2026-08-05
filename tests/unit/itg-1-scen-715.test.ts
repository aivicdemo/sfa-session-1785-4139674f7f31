import { analyzeProposalAndCustomerInteractionPattern } from '../../src/logic/it-1-br-2-1-1';

describe('提案内容と顧客対応パターンの標準プロセス比較分析', () => {
  // SCEN-715
  test('顧客対応記録の件数がちょうど最小要件件数と一致する場合に分析可能判定される', () => {
    const minRequiredRecords = 3;
    const customerId = 'CUST-001';
    const proposalContent = {
      productId: 'PROD-A01',
      proposalAmount: 500000,
      proposedDate: '2024-01-15',
      proposalType: 'initial',
    };

    const customerInteractionRecords = [
      {
        recordId: 'INT-001',
        customerId: customerId,
        contactType: 'phone_call',
        contactDate: '2024-01-10',
        duration: 15,
        outcome: 'positive_response',
      },
      {
        recordId: 'INT-002',
        customerId: customerId,
        contactType: 'email',
        contactDate: '2024-01-12',
        duration: 0,
        outcome: 'document_sent',
      },
      {
        recordId: 'INT-003',
        customerId: customerId,
        contactType: 'visit',
        contactDate: '2024-01-14',
        duration: 45,
        outcome: 'presentation_completed',
      },
    ];

    const standardProcessDefinition = {
      stageSequence: ['initial_contact', 'needs_discovery', 'proposal', 'negotiation', 'closure'],
      minimumRecordsRequired: 3,
      expectedInteractionTypesPerStage: {
        initial_contact: ['phone_call', 'email'],
        needs_discovery: ['visit', 'phone_call'],
        proposal: ['email', 'visit'],
        negotiation: ['phone_call', 'visit'],
        closure: ['phone_call', 'email'],
      },
    };

    const analysisResult = analyzeProposalAndCustomerInteractionPattern(
      customerId,
      proposalContent,
      customerInteractionRecords,
      standardProcessDefinition,
      minRequiredRecords
    );

    expect(analysisResult.analysisStatus).toBe('analysisAvailable');
    expect(analysisResult.recordCountValidation).toBe(true);
    expect(analysisResult.recordCount).toBe(3);
    expect(analysisResult.minimumRequiredCount).toBe(3);
    expect(analysisResult.canProceedWithAnalysis).toBe(true);
  });
});