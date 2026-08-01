import { analyzeActionPattern } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-841
  test('行動パターンデータが1件の場合、その1件の行動を分析対象とする', () => {
    const actionPatternData = [
      {
        id: 'BP001',
        salesPersonId: 'A001',
        actionType: '初回訪問',
        actionDate: '2024-01-15',
        durationMinutes: 45,
        outcomeCode: 'advance',
      },
    ];

    const standardProcessDefinition = {
      standardInitialVisitDurationMinutes: 30,
      standardContractRate: 0.35,
    };

    const result = analyzeActionPattern(
      actionPatternData,
      standardProcessDefinition
    );

    expect(result.dataCount).toBe(1);
    expect(result.analyzedActions).toHaveLength(1);
    expect(result.analyzedActions[0]).toEqual({
      id: 'BP001',
      salesPersonId: 'A001',
      actionType: '初回訪問',
      actionDate: '2024-01-15',
      durationMinutes: 45,
      outcomeCode: 'advance',
    });

    expect(result.deviationDetected).toBe(true);
    expect(result.correlationAnalyzed).toBe(true);

    const deviationRatio = (45 - 30) / 30;
    expect(result.deviationRatio).toBe(0.5);

    expect(result.reportLog).toMatch(/分析対象データ: 1件/);
    expect(result.reportLog).toMatch(/初回訪問時間が標準比150%/);
    expect(result.reportLog).toMatch(/outcomeCode.*advance.*標準成約率比較可能/);

    expect(result.auditTrail).toMatch(/\(45-30\)\/30\s*=\s*0\.5/);
  });
});