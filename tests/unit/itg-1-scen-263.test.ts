import { determineSalesPersonImprovementTargets } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-263
  test('should return identical improvement guidance targets and content on repeated execution with same input data', () => {
    const inputData = {
      salespersonId: 'SP-001',
      salespersonName: '営業担当者A',
      salesTargetAchievementRate: 65,
      customerVisitFrequencyPerMonth: 3,
      proposalSuccessRate: 32,
      analysisMonth: '2024-01',
      standardProcessComplianceRate: 75,
    };

    // First execution
    const firstResult = determineSalesPersonImprovementTargets(inputData);

    // Second execution with identical input
    const secondResult = determineSalesPersonImprovementTargets(inputData);

    // Verify improvement targets match
    expect(firstResult.improvementTargets).toEqual(secondResult.improvementTargets);

    // Verify salesperson A is selected as improvement target in both executions
    expect(firstResult.improvementTargets).toContainEqual(
      expect.objectContaining({
        salespersonId: 'SP-001',
        salespersonName: '営業担当者A',
      })
    );
    expect(secondResult.improvementTargets).toContainEqual(
      expect.objectContaining({
        salespersonId: 'SP-001',
        salespersonName: '営業担当者A',
      })
    );

    // Verify guidance content is identical
    const firstGuidanceContent = firstResult.improvementTargets.find(
      (t) => t.salespersonId === 'SP-001'
    );
    const secondGuidanceContent = secondResult.improvementTargets.find(
      (t) => t.salespersonId === 'SP-001'
    );

    expect(firstGuidanceContent).toBeDefined();
    expect(secondGuidanceContent).toBeDefined();

    // Verify guidance category matches (e.g., '訪問頻度改善')
    expect(firstGuidanceContent?.guidanceCategory).toBe(secondGuidanceContent?.guidanceCategory);

    // Verify priority level matches (e.g., '高')
    expect(firstGuidanceContent?.priorityLevel).toBe(secondGuidanceContent?.priorityLevel);

    // Verify recommended guidance items are identical
    expect(firstGuidanceContent?.recommendedGuidanceItems).toEqual(
      secondGuidanceContent?.recommendedGuidanceItems
    );

    // Verify specific guidance content for salesPersonA
    expect(firstGuidanceContent?.guidanceCategory).toBe('訪問頻度改善');
    expect(firstGuidanceContent?.priorityLevel).toBe('高');
    expect(firstGuidanceContent?.recommendedGuidanceItems).toEqual([
      '月間訪問目標を5回に増加',
      '新規顧客開拓研修',
    ]);

    // Verify both results are complete objects
    expect(firstResult).toHaveProperty('improvementTargets');
    expect(firstResult).toHaveProperty('analysisTimestamp');
    expect(secondResult).toHaveProperty('improvementTargets');
    expect(secondResult).toHaveProperty('analysisTimestamp');

    // Verify array length consistency
    expect(firstResult.improvementTargets.length).toBe(secondResult.improvementTargets.length);
  });
});