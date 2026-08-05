import { analyzeCustomerInteractionPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-721
  test('提案内容と顧客対応パターンの標準プロセス比較分析 - 月初の顧客対応記録から開始する分析期間でのパターン検出を検証', () => {
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');

    const customerInteractionRecords = [
      {
        recordId: 'rec_001',
        interactionDate: new Date('2024-01-01T10:00:00Z'),
        interactionType: 'initial_proposal',
        salesRepId: 'rep_001',
        customerId: 'cust_001',
        status: 'completed',
      },
      {
        recordId: 'rec_002',
        interactionDate: new Date('2024-01-02T10:00:00Z'),
        interactionType: 'follow_up',
        salesRepId: 'rep_001',
        customerId: 'cust_001',
        status: 'completed',
      },
      {
        recordId: 'rec_003',
        interactionDate: new Date('2024-01-03T10:00:00Z'),
        interactionType: 'closure_report',
        salesRepId: 'rep_001',
        customerId: 'cust_001',
        status: 'completed',
      },
      {
        recordId: 'rec_004',
        interactionDate: new Date('2024-01-05T10:00:00Z'),
        interactionType: 'initial_proposal',
        salesRepId: 'rep_001',
        customerId: 'cust_002',
        status: 'completed',
      },
      {
        recordId: 'rec_005',
        interactionDate: new Date('2024-01-06T10:00:00Z'),
        interactionType: 'follow_up',
        salesRepId: 'rep_001',
        customerId: 'cust_002',
        status: 'completed',
      },
      {
        recordId: 'rec_006',
        interactionDate: new Date('2024-01-10T10:00:00Z'),
        interactionType: 'follow_up',
        salesRepId: 'rep_001',
        customerId: 'cust_003',
        status: 'completed',
      },
      {
        recordId: 'rec_007',
        interactionDate: new Date('2024-01-12T10:00:00Z'),
        interactionType: 'follow_up',
        salesRepId: 'rep_001',
        customerId: 'cust_004',
        status: 'completed',
      },
      {
        recordId: 'rec_008',
        interactionDate: new Date('2024-01-15T10:00:00Z'),
        interactionType: 'follow_up',
        salesRepId: 'rep_001',
        customerId: 'cust_005',
        status: 'completed',
      },
      {
        recordId: 'rec_009',
        interactionDate: new Date('2024-01-20T10:00:00Z'),
        interactionType: 'closure_report',
        salesRepId: 'rep_001',
        customerId: 'cust_006',
        status: 'completed',
      },
      {
        recordId: 'rec_010',
        interactionDate: new Date('2024-01-25T10:00:00Z'),
        interactionType: 'initial_proposal',
        salesRepId: 'rep_001',
        customerId: 'cust_007',
        status: 'completed',
      },
    ];

    const standardProcessDefinition = {
      processId: 'proc_std_001',
      processName: 'Standard Sales Process',
      stages: [
        { stageId: 'stage_1', stageName: 'Initial Proposal', expectedInteractionType: 'initial_proposal' },
        { stageId: 'stage_2', stageName: 'Follow-up', expectedInteractionType: 'follow_up' },
        { stageId: 'stage_3', stageName: 'Closure', expectedInteractionType: 'closure_report' },
      ],
    };

    const analysisInput = {
      analysisStartDate,
      analysisEndDate,
      customerInteractionRecords,
      standardProcessDefinition,
      analysisManagerId: 'manager_001',
    };

    const analysisResult = analyzeCustomerInteractionPatterns(analysisInput);

    expect(analysisResult.analysisPeriodStartDate).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(analysisResult.analysisPeriodEndDate).toEqual(new Date('2024-01-31T23:59:59Z'));
    expect(analysisResult.totalRecordsProcessed).toBe(10);
    expect(analysisResult.matchedPatternCount).toBe(2);
    expect(analysisResult.patternMatchingRate).toBe(0.2);
    expect(analysisResult.detectedPatterns).toHaveLength(2);
    expect(analysisResult.detectedPatterns[0]).toMatchObject({
      customerId: expect.any(String),
      matchedSequence: expect.arrayContaining(['initial_proposal', 'follow_up', 'closure_report']),
    });
  });
});