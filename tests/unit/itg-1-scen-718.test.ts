import { analyzeProposalAndCustomerResponsePattern } from '../../src/logic/it-1-br-2-1-1';

describe('提案内容と顧客対応パターンの標準プロセス比較分析', () => {
  // SCEN-718
  test('同一タイムスタンプを持つ複数対応記録の処理順序と標準プロセス照合が正常に完了する', () => {
    const standardProcessTemplate = {
      processSteps: [
        { stepId: 'step_a', stepName: 'ステップA', order: 1 },
        { stepId: 'step_b', stepName: 'ステップB', order: 2 },
        { stepId: 'step_c', stepName: 'ステップC', order: 3 },
      ],
      processName: '標準営業プロセス',
    };

    const sharedTimestamp = '2024-01-15T10:30:00Z';

    const customerResponseRecord1 = {
      recordId: 'ID1',
      timestamp: sharedTimestamp,
      processStepId: 'step_a',
      responseType: '初回接触',
      content: '顧客と初回接触を実施',
    };

    const customerResponseRecord2 = {
      recordId: 'ID2',
      timestamp: sharedTimestamp,
      processStepId: 'step_b',
      responseType: '提案',
      content: '提案内容を説明',
    };

    const customerResponseRecord3 = {
      recordId: 'ID3',
      timestamp: sharedTimestamp,
      processStepId: 'step_c',
      responseType: '交渉',
      content: '契約条件を協議',
    };

    const proposalContent = {
      proposalId: 'prop_001',
      customerId: 'cust_001',
      proposalText: '営業提案書',
      submittedDate: '2024-01-15T09:00:00Z',
    };

    const analysisResult = analyzeProposalAndCustomerResponsePattern({
      standardProcessTemplate,
      proposalContent,
      customerResponseRecords: [
        customerResponseRecord1,
        customerResponseRecord2,
        customerResponseRecord3,
      ],
    });

    expect(analysisResult.sortedRecords).toHaveLength(3);
    expect(analysisResult.sortedRecords[0].recordId).toBe('ID1');
    expect(analysisResult.sortedRecords[0].processStepId).toBe('step_a');
    expect(analysisResult.sortedRecords[1].recordId).toBe('ID2');
    expect(analysisResult.sortedRecords[1].processStepId).toBe('step_b');
    expect(analysisResult.sortedRecords[2].recordId).toBe('ID3');
    expect(analysisResult.sortedRecords[2].processStepId).toBe('step_c');

    expect(analysisResult.complianceJudgment).toEqual({
      isCompliant: true,
      recordProcessOrder: ['step_a', 'step_b', 'step_c'],
      standardProcessOrder: ['step_a', 'step_b', 'step_c'],
      deviationDetected: false,
    });

    expect(analysisResult.analysisCompletionStatus).toBe('completed');
  });
});