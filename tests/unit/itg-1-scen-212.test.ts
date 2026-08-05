import { describe, test, expect, beforeEach } from '@jest/globals';
import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  let mockDataSource: Array<{
    date: string;
    processId: string;
    processName: string;
    stage: string;
    criteria: string;
    dataItems: string[];
  }>;

  beforeEach(() => {
    mockDataSource = [
      {
        date: '2024-01-15',
        processId: 'PROC-001',
        processName: '初回接触',
        stage: 'Discovery',
        criteria: '顧客情報の基本確認完了',
        dataItems: ['customer_id', 'contact_date', 'contact_method'],
      },
      {
        date: '2024-01-16',
        processId: 'PROC-002',
        processName: '提案準備',
        stage: 'Proposal',
        criteria: '顧客ニーズの整理完了',
        dataItems: ['customer_needs', 'product_category', 'estimated_value'],
      },
    ];
  });

  // SCEN-212
  test('変換期間の開始日と終了日が同日のとき、1日分のデータで要件仕様が生成される', () => {
    const startDate = '2024-01-15';
    const endDate = '2024-01-15';

    const result = convertProcessStandardToSystemRequirements({
      dataSource: mockDataSource,
      startDate,
      endDate,
    });

    expect(result.requirementSpecifications).toHaveLength(1);

    const specification = result.requirementSpecifications[0];
    expect(specification.requirementId).toBe('REQ-PROC-001-20240115');
    expect(specification.processStandardReference).toBe('PROC-001');
    expect(specification.processName).toBe('初回接触');
    expect(specification.stage).toBe('Discovery');
    expect(specification.systemRequirement).toBe('顧客情報の基本確認完了');
    expect(specification.dataItemsMapping).toEqual([
      'customer_id',
      'contact_date',
      'contact_method',
    ]);
    expect(specification.conversionDate).toBe('2024-01-15');

    expect(result.dateRangeApplied).toEqual({
      startDate: '2024-01-15',
      endDate: '2024-01-15',
      recordsIncluded: 1,
      recordsExcluded: 1,
    });

    const allDates = result.requirementSpecifications.map((spec) => spec.conversionDate);
    expect(allDates.every((date) => date === '2024-01-15')).toBe(true);

    expect(result.requirementSpecifications.some((spec) => spec.conversionDate === '2024-01-16')).toBe(
      false
    );
  });
});