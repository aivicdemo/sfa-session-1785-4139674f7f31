import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1054
  test('複数の営業担当者が同一の理解度スコアを持つ場合に重複なく集計される', () => {
    const salesPersonA = {
      id: 'sales_001',
      name: '営業担当者A',
      comprehensionScore: 75,
      successRate: 0.65,
      followUpInterval: 3.2,
      proposalAccuracyRate: 0.72,
    };

    const salesPersonB = {
      id: 'sales_002',
      name: '営業担当者B',
      comprehensionScore: 75,
      successRate: 0.68,
      followUpInterval: 2.9,
      proposalAccuracyRate: 0.74,
    };

    const salesPersonC = {
      id: 'sales_003',
      name: '営業担当者C',
      comprehensionScore: 75,
      successRate: 0.62,
      followUpInterval: 3.5,
      proposalAccuracyRate: 0.70,
    };

    const salesPersonInput = [salesPersonA, salesPersonB, salesPersonC];

    const reportResult = generateSalesPersonBehaviorAnalysisReport({
      salesPersonList: salesPersonInput,
      reportDate: new Date('2024-01-15T11:00:00Z'),
      analysisPeriodMonths: 3,
    });

    expect(reportResult).toBeDefined();
    expect(reportResult.reportData).toBeDefined();
    expect(Array.isArray(reportResult.reportData)).toBe(true);

    const groupedByScore = reportResult.reportData.filter(
      (item: any) => item.comprehensionScore === 75
    );

    expect(groupedByScore.length).toBe(3);

    const uniqueIds = new Set(groupedByScore.map((item: any) => item.id));
    expect(uniqueIds.size).toBe(3);
    expect(uniqueIds.has('sales_001')).toBe(true);
    expect(uniqueIds.has('sales_002')).toBe(true);
    expect(uniqueIds.has('sales_003')).toBe(true);

    const personARecord = groupedByScore.find((item: any) => item.id === 'sales_001');
    expect(personARecord).toBeDefined();
    expect(personARecord.name).toBe('営業担当者A');
    expect(personARecord.successRate).toBe(0.65);
    expect(personARecord.followUpInterval).toBe(3.2);
    expect(personARecord.proposalAccuracyRate).toBe(0.72);

    const personBRecord = groupedByScore.find((item: any) => item.id === 'sales_002');
    expect(personBRecord).toBeDefined();
    expect(personBRecord.name).toBe('営業担当者B');
    expect(personBRecord.successRate).toBe(0.68);
    expect(personBRecord.followUpInterval).toBe(2.9);
    expect(personBRecord.proposalAccuracyRate).toBe(0.74);

    const personCRecord = groupedByScore.find((item: any) => item.id === 'sales_003');
    expect(personCRecord).toBeDefined();
    expect(personCRecord.name).toBe('営業担当者C');
    expect(personCRecord.successRate).toBe(0.62);
    expect(personCRecord.followUpInterval).toBe(3.5);
    expect(personCRecord.proposalAccuracyRate).toBe(0.70);

    expect(reportResult.totalRecordCount).toBe(3);
    expect(reportResult.reportDate).toEqual(new Date('2024-01-15T11:00:00Z'));
    expect(reportResult.analysisPeriodMonths).toBe(3);
  });
});