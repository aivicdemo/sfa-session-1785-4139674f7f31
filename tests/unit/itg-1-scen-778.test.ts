import { selectAnalysisIndicators } from '../../src/logic/it-1-br-target4-1-1-1';

describe('行動パターン分析対象指標の自動選定機能', () => {
  // SCEN-778
  test('営業プロセス標準書の初回接触頻度閾値が分析対象指標の選定に反映される', () => {
    const standardProcessThreshold = 4;
    const salesPersons = [
      {
        salesPersonId: 'SP001',
        initialContactFrequency: 5,
      },
      {
        salesPersonId: 'SP002',
        initialContactFrequency: 3,
      },
      {
        salesPersonId: 'SP003',
        initialContactFrequency: 4,
      },
    ];

    const result = selectAnalysisIndicators({
      standardProcessThreshold,
      salesPersons,
    });

    expect(result.selectedIndicatorThreshold).toBe(4);
    expect(result.selectedSalesPersonIds).toEqual(['SP001', 'SP003']);
    expect(result.analysisTargetCount).toBe(2);
  });
});