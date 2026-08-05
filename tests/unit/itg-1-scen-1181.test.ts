import { analyzeProcessDeviationImpact } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書の妥当性検証と改善 - 標準プロセス乖離による影響可視化', () => {
  // SCEN-1181
  test('標準プロセスからの乖離が成約率に与える影響がない場合、その旨が可視化される', () => {
    const dealId = 'DEAL-20240115-001';
    const dealName = '顧客A様 システムA導入案件';
    const deviationPatterns = [
      {
        stepName: '初回接触',
        standardAction: 'メール送付 + 電話確認',
        actualAction: 'メール送付のみ',
        deviationScore: 0.3,
      },
      {
        stepName: '提案',
        standardAction: '対面提案 + 資料提供',
        actualAction: '対面提案のみ',
        deviationScore: 0.25,
      },
    ];
    const contractAmount = 1500000;
    const processStandardId = 'PROC-STD-2024-001';
    const analysisDate = new Date('2024-01-15T10:30:00Z');

    const result = analyzeProcessDeviationImpact({
      dealId,
      dealName,
      deviationPatterns,
      contractAmount,
      processStandardId,
      analysisDate,
    });

    expect(result.impactPercentage).toBe(0);
    expect(result.hasImpact).toBe(false);
    expect(result.message).toMatch(/影響を与えていません/);
    expect(result.deviationScore).toBeGreaterThan(0);
    expect(result.deviationScore).toBeLessThanOrEqual(1);
    expect(result.recommendedActions).toHaveLength(0);
    expect(typeof result.visualizationData).toBe('object');
  });
});