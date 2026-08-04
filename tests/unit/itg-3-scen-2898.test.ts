import { decidePriorityLevel } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2898: [edge] 改善指導の優先度決定 - 改善対象件数が 1 件未満のときに優先度が低と設定される
  test('改善対象件数が0件の場合、優先度が低と設定される', () => {
    const improvementData = {
      improvementTargetCount: 0,
      dealConditions: {
        customerId: 'C001',
        dealId: 'D001',
        dealStage: 'proposal',
        targetRevenue: 1000000,
      },
    };

    const result = decidePriorityLevel(improvementData);

    expect(result.priorityLevel).toBe('LOW');
  });

  // SCEN-2898: [edge] 改善指導の優先度決定 - 改善対象件数が 1 件未満のときに優先度が低と設定される
  test('改善対象件数が負の値（-1件）の場合、優先度が低と設定される', () => {
    const improvementData = {
      improvementTargetCount: -1,
      dealConditions: {
        customerId: 'C002',
        dealId: 'D002',
        dealStage: 'negotiation',
        targetRevenue: 1500000,
      },
    };

    const result = decidePriorityLevel(improvementData);

    expect(result.priorityLevel).toBe('LOW');
  });
});