import { generateActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1158
  test('複数営業担当者のデータで同一成約実績値を持つレコードが複数存在するとき正確に集計される', () => {
    const testData = {
      salesReps: [
        {
          id: 'sales_rep_a',
          name: '営業担当者A',
        },
        {
          id: 'sales_rep_b',
          name: '営業担当者B',
        },
      ],
      contracts: [
        {
          id: 'contract_1',
          salesRepId: 'sales_rep_a',
          contractAmount: 5000000,
          contractDate: '2024-01-10',
        },
        {
          id: 'contract_2',
          salesRepId: 'sales_rep_a',
          contractAmount: 5000000,
          contractDate: '2024-01-15',
        },
        {
          id: 'contract_3',
          salesRepId: 'sales_rep_b',
          contractAmount: 5000000,
          contractDate: '2024-01-20',
        },
        {
          id: 'contract_4',
          salesRepId: 'sales_rep_b',
          contractAmount: 5000000,
          contractDate: '2024-01-25',
        },
      ],
      actionRecords: [
        {
          id: 'action_1',
          salesRepId: 'sales_rep_a',
          contractId: 'contract_1',
          actionType: 'initial_contact',
          actionDate: '2024-01-05',
        },
        {
          id: 'action_2',
          salesRepId: 'sales_rep_a',
          contractId: 'contract_2',
          actionType: 'proposal',
          actionDate: '2024-01-12',
        },
        {
          id: 'action_3',
          salesRepId: 'sales_rep_b',
          contractId: 'contract_3',
          actionType: 'initial_contact',
          actionDate: '2024-01-18',
        },
        {
          id: 'action_4',
          salesRepId: 'sales_rep_b',
          contractId: 'contract_4',
          actionType: 'follow_up',
          actionDate: '2024-01-22',
        },
      ],
    };

    const reportResult = generateActionPatternAnalysisReport(testData);

    expect(reportResult).toBeDefined();
    expect(reportResult.reportId).toBeDefined();
    expect(reportResult.generatedAt).toBeDefined();

    const salesRepASummary = reportResult.summaryBySalesRep.find(
      (summary) => summary.salesRepId === 'sales_rep_a'
    );
    expect(salesRepASummary).toBeDefined();
    expect(salesRepASummary?.contractCount).toBe(2);
    expect(salesRepASummary?.totalContractAmount).toBe(10000000);
    expect(salesRepASummary?.recordsWithContractAmount5M).toBe(2);

    const salesRepBSummary = reportResult.summaryBySalesRep.find(
      (summary) => summary.salesRepId === 'sales_rep_b'
    );
    expect(salesRepBSummary).toBeDefined();
    expect(salesRepBSummary?.contractCount).toBe(2);
    expect(salesRepBSummary?.totalContractAmount).toBe(10000000);
    expect(salesRepBSummary?.recordsWithContractAmount5M).toBe(2);

    const aggregateResult = reportResult.aggregateByContractAmount.find(
      (agg) => agg.contractAmount === 5000000
    );
    expect(aggregateResult).toBeDefined();
    expect(aggregateResult?.totalRecordCount).toBe(4);
    expect(aggregateResult?.totalAmount).toBe(20000000);
    expect(aggregateResult?.countBySalesRep).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          salesRepId: 'sales_rep_a',
          count: 2,
        }),
        expect.objectContaining({
          salesRepId: 'sales_rep_b',
          count: 2,
        }),
      ])
    );
  });
});