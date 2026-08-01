import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-653
  test('成約実績データが重複している場合、統計値が正確に計算される', () => {
    const salesPersonId = 'tanaka-taro';
    const salesPersonName = '田中太郎';
    const dealId = 'deal-001';
    const contractAmount = 1000000;
    const reportPeriodStart = new Date('2024-01-01T00:00:00Z');
    const reportPeriodEnd = new Date('2024-12-31T23:59:59Z');

    const contractRecords = [
      {
        contract_id: 'contract-duplicate-1',
        deal_id: dealId,
        sales_person_id: salesPersonId,
        contract_date: new Date('2024-06-15T10:00:00Z'),
        contract_amount: contractAmount,
      },
      {
        contract_id: 'contract-duplicate-2',
        deal_id: dealId,
        sales_person_id: salesPersonId,
        contract_date: new Date('2024-06-20T14:00:00Z'),
        contract_amount: contractAmount,
      },
    ];

    const salesPersonMasterData = [
      {
        sales_person_id: salesPersonId,
        sales_person_name: salesPersonName,
        department: 'sales_division_a',
      },
    ];

    const reportGenerationInput = {
      report_period_start: reportPeriodStart,
      report_period_end: reportPeriodEnd,
      contract_records: contractRecords,
      sales_person_master_data: salesPersonMasterData,
    };

    const result = generateSalesPersonBehaviorAnalysisReport(reportGenerationInput);

    expect(result).toBeDefined();
    expect(result.report_data).toBeDefined();
    expect(Array.isArray(result.report_data)).toBe(true);
    expect(result.report_data.length).toBe(1);

    const reportRow = result.report_data[0];
    expect(reportRow.sales_person_id).toBe(salesPersonId);
    expect(reportRow.sales_person_name).toBe(salesPersonName);
    expect(reportRow.contract_count).toBe(1);
    expect(reportRow.total_contract_amount).toBe(1000000);
    expect(reportRow.average_contract_amount).toBe(1000000);
    expect(reportRow.duplicate_record_count).toBe(1);
  });
});