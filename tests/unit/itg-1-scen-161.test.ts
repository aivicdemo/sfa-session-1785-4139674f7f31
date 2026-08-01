import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-161
  test('同じ入力で2回実行したとき、同じ標準プロセス遵守度スコアと改善指導優先順位が得られる', async () => {
    const employeeId = 'EMP001';
    const startDate = '2024-01-01T00:00:00Z';
    const endDate = '2024-01-31T23:59:59Z';
    const customerSegment = '大規模企業';

    const mockActivityRecords = Array.from({ length: 100 }, (_, i) => ({
      activity_id: `ACT${String(i + 1).padStart(5, '0')}`,
      employee_id: employeeId,
      activity_type: ['initial_contact', 'proposal', 'negotiation', 'contract'][i % 4],
      customer_segment: customerSegment,
      contact_date: new Date(2024, 0, (i % 31) + 1).toISOString(),
      is_successful: i % 3 !== 0,
    }));

    const fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    fetchMock.mockResponseOnce(JSON.stringify({ activities: mockActivityRecords }), {
      status: 200,
    });

    const result1 = await generateBehaviorPatternAnalysisReport({
      employee_id: employeeId,
      analysis_start_date: startDate,
      analysis_end_date: endDate,
      customer_segment: customerSegment,
    });

    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify({ activities: mockActivityRecords }), {
      status: 200,
    });

    const result2 = await generateBehaviorPatternAnalysisReport({
      employee_id: employeeId,
      analysis_start_date: startDate,
      analysis_end_date: endDate,
      customer_segment: customerSegment,
    });

    expect(result1.compliance_score).toBe(result2.compliance_score);
    expect(result1.compliance_score).toBeGreaterThanOrEqual(0);
    expect(result1.compliance_score).toBeLessThanOrEqual(100);

    expect(result1.improvement_priorities).toEqual(result2.improvement_priorities);
    expect(Array.isArray(result1.improvement_priorities)).toBe(true);
    expect(result1.improvement_priorities.length).toBe(result2.improvement_priorities.length);

    result1.improvement_priorities.forEach((priority, index) => {
      expect(priority.item).toBe(result2.improvement_priorities[index].item);
      expect(priority.level).toBe(result2.improvement_priorities[index].level);
      expect(priority.level).toBeGreaterThanOrEqual(1);
      expect(priority.level).toBeLessThanOrEqual(5);
    });

    fetchMock.disableMocks();
  });
});