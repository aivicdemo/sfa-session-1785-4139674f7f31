import {
  calculateSalesRepImprovementPriority,
} from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-300
  test('開始日と終了日が同日の場合、改善指導優先順位が計算される', () => {
    const startDate = new Date('2024-01-15T00:00:00Z');
    const endDate = new Date('2024-01-15T23:59:59Z');

    const activityData = [
      {
        sales_rep_id: 'rep_001',
        visit_count: 3,
        proposal_count: 2,
        contract_count: 1,
        follow_up_frequency: 5,
        process_adherence_score: 78,
      },
      {
        sales_rep_id: 'rep_002',
        visit_count: 5,
        proposal_count: 4,
        contract_count: 2,
        follow_up_frequency: 8,
        process_adherence_score: 92,
      },
      {
        sales_rep_id: 'rep_003',
        visit_count: 2,
        proposal_count: 1,
        contract_count: 0,
        follow_up_frequency: 2,
        process_adherence_score: 65,
      },
    ];

    const standardProcessData = {
      target_visit_frequency: 4,
      target_proposal_ratio: 0.8,
      target_contract_ratio: 0.5,
      minimum_follow_up_frequency: 6,
      minimum_process_adherence_score: 80,
    };

    const result = calculateSalesRepImprovementPriority(
      startDate,
      endDate,
      activityData,
      standardProcessData
    );

    expect(result).toBeDefined();
    expect(Array.isArray(result.priorityList)).toBe(true);
    expect(result.priorityList.length).toBeGreaterThan(0);

    const highPriorityItems = result.priorityList.filter(
      (item: { priority_level: string }) => item.priority_level === 'high'
    );
    expect(highPriorityItems.length).toBeGreaterThan(0);

    const rep003Priority = result.priorityList.find(
      (item: { sales_rep_id: string }) => item.sales_rep_id === 'rep_003'
    );
    expect(rep003Priority).toBeDefined();
    expect(rep003Priority.priority_level).toBe('high');
    expect(rep003Priority.priority_score).toBeLessThan(50);

    const rep002Priority = result.priorityList.find(
      (item: { sales_rep_id: string }) => item.sales_rep_id === 'rep_002'
    );
    expect(rep002Priority).toBeDefined();
    expect(rep002Priority.priority_level).toBe('low');
    expect(rep002Priority.priority_score).toBeGreaterThan(80);

    const rep001Priority = result.priorityList.find(
      (item: { sales_rep_id: string }) => item.sales_rep_id === 'rep_001'
    );
    expect(rep001Priority).toBeDefined();
    expect(rep001Priority.priority_level).toBe('medium');

    expect(result.analysisDate).toEqual('2024-01-15');
    expect(result.totalAnalyzedReps).toBe(3);
    expect(result.hasErrors).toBe(false);
  });
});