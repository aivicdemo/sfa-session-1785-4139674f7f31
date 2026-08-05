import { describe, test, expect, beforeEach } from '@jest/globals';
import { aggregatePracticalApplicationStatus } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の実務適用状況集計機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1007
  test('実務適用報告が1件の場合、該当営業担当者の適用状況が正しく集計される', () => {
    const employee_id = 'EMP001';
    const application_reports = [
      {
        employee_id: 'EMP001',
        application_date: '2024-01-15',
        application_content: '顧客ABC社への新商品提案プロセス適用',
        application_status: '完了',
      },
    ];

    const result = aggregatePracticalApplicationStatus(
      employee_id,
      application_reports
    );

    expect(result.employee_id).toBe('EMP001');
    expect(result.total_reports).toBe(1);
    expect(result.completed_count).toBe(1);
    expect(result.application_rate).toBe(100);
    expect(result.application_contents).toEqual([
      '顧客ABC社への新商品提案プロセス適用',
    ]);
  });
});