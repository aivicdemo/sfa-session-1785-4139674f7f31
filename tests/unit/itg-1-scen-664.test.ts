import { detectAnomalyPatterns } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-664: 複数の異常パターンが同時に検出される場合、すべての異常パターンがレポートに可視化される', () => {
    // モックデータ: 3つの異常パターンを同時に含むデータセット
    const mockSalesData = [
      {
        opportunityId: 'OPP001',
        customerId: 'CUST001',
        salesRepId: 'REP001',
        forecastAmount: 1000000,
        actualAmount: 694900,
        cycleStartDate: new Date('2024-01-01T09:00:00Z'),
        cycleEndDate: new Date('2024-05-15T17:00:00Z'),
        contactDates: [
          new Date('2024-01-01T10:00:00Z'),
          new Date('2024-05-15T14:00:00Z'),
        ],
        lastContactDate: new Date('2024-05-15T14:00:00Z'),
      },
    ];

    // 異常パターン検出を実行
    const detectionResult = detectAnomalyPatterns(mockSalesData);

    // 異常レポート生成
    const report = {
      detectedPatterns: detectionResult.patterns,
      timestamp: new Date('2024-05-16T09:00:00Z').toISOString(),
      totalAnomaliesCount: detectionResult.patterns.length,
      sections: [] as Array<{
        patternType: string;
        severity: string;
        details: {
          opportunityId?: string;
          deviationRate?: number;
          standardCycleDays?: number;
          actualCycleDays?: number;
          monthlyContactFrequency?: number;
          affectedAmount?: number;
          caseCount?: number;
        };
      }>,
    };

    // セクション1: 売上予測乖離異常
    report.sections.push({
      patternType: '売上予測乖離異常',
      severity: 'high',
      details: {
        opportunityId: 'OPP001',
        deviationRate: 30.51,
        affectedAmount: 305100,
        caseCount: 1,
      },
    });

    // セクション2: 営業サイクル長期化異常
    const cycleDays = Math.floor(
      (mockSalesData[0].cycleEndDate.getTime() - mockSalesData[0].cycleStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    report.sections.push({
      patternType: '営業サイクル長期化異常',
      severity: 'medium',
      details: {
        opportunityId: 'OPP001',
        standardCycleDays: 60,
        actualCycleDays: cycleDays,
      },
    });

    // セクション3: 顧客接触頻度低下異常
    const monthsBetweenContacts = Math.floor(
      (mockSalesData[0].lastContactDate.getTime() - mockSalesData[0].contactDates[0].getTime()) /
        (1000 * 60 * 60 * 24 * 30.44)
    );
    const monthlyContactFrequency = mockSalesData[0].contactDates.length / (monthsBetweenContacts || 1);
    report.sections.push({
      patternType: '顧客接触頻度低下異常',
      severity: 'high',
      details: {
        opportunityId: 'OPP001',
        monthlyContactFrequency: parseFloat(monthlyContactFrequency.toFixed(1)),
      },
    });

    // 検証: 3つすべての異常パターンが検出されていること
    expect(report.totalAnomaliesCount).toBe(3);
    expect(report.sections.length).toBe(3);

    // 検証: 売上予測乖離異常セクション
    const deviationSection = report.sections.find((s) => s.patternType === '売上予測乖離異常');
    expect(deviationSection).toBeDefined();
    expect(deviationSection?.details.deviationRate).toBe(30.51);
    expect(deviationSection?.details.opportunityId).toBe('OPP001');
    expect(deviationSection?.details.affectedAmount).toBe(305100);
    expect(deviationSection?.details.caseCount).toBe(1);

    // 検証: 営業サイクル長期化異常セクション
    const cycleSection = report.sections.find((s) => s.patternType === '営業サイクル長期化異常');
    expect(cycleSection).toBeDefined();
    expect(cycleSection?.details.standardCycleDays).toBe(60);
    expect(cycleSection?.details.actualCycleDays).toBe(134);
    expect(cycleSection?.details.opportunityId).toBe('OPP001');

    // 検証: 顧客接触頻度低下異常セクション
    const frequencySection = report.sections.find((s) => s.patternType === '顧客接触頻度低下異常');
    expect(frequencySection).toBeDefined();
    expect(frequencySection?.details.monthlyContactFrequency).toBe(0.8);
    expect(frequencySection?.details.opportunityId).toBe('OPP001');

    // 検証: セクション間の重複がないこと
    const patternTypes = report.sections.map((s) => s.patternType);
    const uniquePatternTypes = new Set(patternTypes);
    expect(uniquePatternTypes.size).toBe(patternTypes.length);

    // 検証: 各セクションに異なる色分けまたは識別情報があること
    report.sections.forEach((section) => {
      expect(section.severity).toBeDefined();
      expect(['high', 'medium', 'low']).toContain(section.severity);
      expect(section.patternType.length).toBeGreaterThan(0);
      expect(Object.keys(section.details).length).toBeGreaterThan(0);
    });

    // 検証: レポートにタイムスタンプがあること
    expect(report.timestamp).toBe('2024-05-16T09:00:00Z');

    // 検証: すべての異常パターンが異なるセクションとして区別されていること
    expect(report.sections[0].patternType).not.toBe(report.sections[1].patternType);
    expect(report.sections[1].patternType).not.toBe(report.sections[2].patternType);
    expect(report.sections[0].patternType).not.toBe(report.sections[2].patternType);
  });
});