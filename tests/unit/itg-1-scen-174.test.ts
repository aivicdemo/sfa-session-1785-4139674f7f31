import { generateSystemRequirement } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-174: [normal] KPI基準の要件仕様化機能 - KPI基準が複数個定義されている場合、全KPI基準がシステム要件仕様に正しく反映される
  test('should reflect all KPI standards correctly in system requirement specification when multiple KPI standards are defined', () => {
    const kpi_input_001 = {
      kpiId: 'KPI_001',
      kpiName: '売上目標KPI',
      targetValue: 10000000,
      targetUnit: '円',
      calculationMethod: '売上達成率',
    };

    const kpi_input_002 = {
      kpiId: 'KPI_002',
      kpiName: '顧客満足度KPI',
      targetValue: 85,
      targetUnit: '点',
      measurementRange: { min: 1, max: 100 },
    };

    const kpi_input_003 = {
      kpiId: 'KPI_003',
      kpiName: '案件化率KPI',
      targetValue: 0.30,
      targetUnit: '%',
      calculationLogic: '営業機会から案件化した件数÷全営業機会',
    };

    const kpi_standards = [kpi_input_001, kpi_input_002, kpi_input_003];

    const result = generateSystemRequirement(kpi_standards);

    expect(result).toBeDefined();
    expect(result.kpiStandards).toBeDefined();
    expect(Array.isArray(result.kpiStandards)).toBe(true);
    expect(result.kpiStandards.length).toBe(3);

    const kpi_spec_001 = result.kpiStandards.find(
      (kpi: { kpiId: string }) => kpi.kpiId === 'KPI_001'
    );
    expect(kpi_spec_001).toBeDefined();
    expect(kpi_spec_001.kpiId).toBe('KPI_001');
    expect(kpi_spec_001.kpiName).toBe('売上目標KPI');
    expect(kpi_spec_001.targetValue).toBe(10000000);
    expect(kpi_spec_001.targetUnit).toBe('円');
    expect(kpi_spec_001.calculationMethod).toBe('売上達成率');

    const kpi_spec_002 = result.kpiStandards.find(
      (kpi: { kpiId: string }) => kpi.kpiId === 'KPI_002'
    );
    expect(kpi_spec_002).toBeDefined();
    expect(kpi_spec_002.kpiId).toBe('KPI_002');
    expect(kpi_spec_002.kpiName).toBe('顧客満足度KPI');
    expect(kpi_spec_002.targetValue).toBe(85);
    expect(kpi_spec_002.targetUnit).toBe('点');
    expect(kpi_spec_002.measurementRange).toEqual({ min: 1, max: 100 });

    const kpi_spec_003 = result.kpiStandards.find(
      (kpi: { kpiId: string }) => kpi.kpiId === 'KPI_003'
    );
    expect(kpi_spec_003).toBeDefined();
    expect(kpi_spec_003.kpiId).toBe('KPI_003');
    expect(kpi_spec_003.kpiName).toBe('案件化率KPI');
    expect(kpi_spec_003.targetValue).toBe(0.30);
    expect(kpi_spec_003.targetUnit).toBe('%');
    expect(kpi_spec_003.calculationLogic).toBe(
      '営業機会から案件化した件数÷全営業機会'
    );

    const kpi_ids = result.kpiStandards.map(
      (kpi: { kpiId: string }) => kpi.kpiId
    );
    const unique_kpi_ids = new Set(kpi_ids);
    expect(unique_kpi_ids.size).toBe(3);
  });
});