import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1089: [edge] 行動パターン分析対象指標の自動選定機能 - 営業プロセス標準書に定義された指標と成約実績の相関が逆順で処理されるとき同じ結果が得られる
  test('should return identical selected indicators regardless of input order when correlation coefficients are sorted by descending priority', () => {
    // 標準順序: 相関係数が高い順（降順）
    const indicatorsAscendingRegistration = [
      {
        indicatorId: 'indicator_A',
        indicatorName: '指標A',
        correlationCoefficient: 0.92,
        salesProcessStandardId: 'process_std_001',
        requiredSalesRecordCount: 20,
      },
      {
        indicatorId: 'indicator_B',
        indicatorName: '指標B',
        correlationCoefficient: 0.87,
        salesProcessStandardId: 'process_std_001',
        requiredSalesRecordCount: 20,
      },
      {
        indicatorId: 'indicator_C',
        indicatorName: '指標C',
        correlationCoefficient: 0.75,
        salesProcessStandardId: 'process_std_001',
        requiredSalesRecordCount: 20,
      },
    ];

    const salesAchievementsAscendingOrder = [
      {
        achievementId: 'ach_001',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_002',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_003',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_004',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_005',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_006',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_007',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_008',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-08',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_009',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-09',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_010',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-10',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_011',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-11',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_012',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-12',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_013',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_014',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_015',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_016',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_017',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_018',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_019',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_020',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-08',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_021',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_022',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_023',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_024',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_025',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_026',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_027',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_028',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-08',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_029',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-09',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_030',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-10',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_031',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-11',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_032',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-12',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_033',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_034',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_035',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_036',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_037',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_038',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_039',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_040',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-08',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_041',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_042',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_043',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_044',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_045',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_046',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_047',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_048',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-08',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_049',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-09',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_050',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-10',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_051',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-11',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_052',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-12',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_053',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_054',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_055',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_056',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_057',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_058',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_059',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_060',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-08',
        achievementValue: 1,
      },
    ];

    // パターンX: 昇順での登録と処理
    const pattern_x = selectAnalysisIndicators(
      indicatorsAscendingRegistration,
      salesAchievementsAscendingOrder
    );

    // 逆順での登録: 指標C、指標B、指標A
    const indicatorsDescendingRegistration = [
      {
        indicatorId: 'indicator_C',
        indicatorName: '指標C',
        correlationCoefficient: 0.75,
        salesProcessStandardId: 'process_std_001',
        requiredSalesRecordCount: 20,
      },
      {
        indicatorId: 'indicator_B',
        indicatorName: '指標B',
        correlationCoefficient: 0.87,
        salesProcessStandardId: 'process_std_001',
        requiredSalesRecordCount: 20,
      },
      {
        indicatorId: 'indicator_A',
        indicatorName: '指標A',
        correlationCoefficient: 0.92,
        salesProcessStandardId: 'process_std_001',
        requiredSalesRecordCount: 20,
      },
    ];

    const salesAchievementsDescendingOrder = [
      {
        achievementId: 'ach_041',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_042',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_043',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_044',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_045',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_046',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_047',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_048',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-08',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_049',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-09',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_050',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-10',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_051',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-11',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_052',
        indicatorId: 'indicator_C',
        achievementMonth: '2024-12',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_053',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_054',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_055',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_056',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_057',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_058',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_059',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_060',
        indicatorId: 'indicator_C',
        achievementMonth: '2025-08',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_021',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_022',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_023',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_024',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_025',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_026',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_027',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_028',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-08',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_029',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-09',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_030',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-10',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_031',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-11',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_032',
        indicatorId: 'indicator_B',
        achievementMonth: '2024-12',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_033',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_034',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_035',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_036',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_037',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_038',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_039',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_040',
        indicatorId: 'indicator_B',
        achievementMonth: '2025-08',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_001',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_002',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_003',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_004',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_005',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_006',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_007',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_008',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-08',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_009',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-09',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_010',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-10',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_011',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-11',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_012',
        indicatorId: 'indicator_A',
        achievementMonth: '2024-12',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_013',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-01',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_014',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-02',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_015',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-03',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_016',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-04',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_017',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-05',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_018',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-06',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_019',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-07',
        achievementValue: 1,
      },
      {
        achievementId: 'ach_020',
        indicatorId: 'indicator_A',
        achievementMonth: '2025-08',
        achievementValue: 1,
      },
    ];

    // パターンY: 降順での登録と処理
    const pattern_y = selectAnalysisIndicators(
      indicatorsDescendingRegistration,
      salesAchievementsDescendingOrder
    );

    // パターンXとパターンYが完全に一致することを検証
    expect(pattern_x.selectedIndicators).toHaveLength(3);
    expect(pattern_y.selectedIndicators).toHaveLength(3);

    // 選定された指標の順序が『指標A（相関係数0.92）→ 指標B（相関係数0.87）→ 指標C（相関係数0.75）』で同一であることを検証
    expect(pattern_x.selectedIndicators[0].indicatorId).toBe('indicator_A');
    expect(pattern_x.selectedIndicators[0].correlationCoefficient).toBe(0.92);
    expect(pattern_y.selectedIndicators[0].indicatorId).toBe('indicator_A');
    expect(pattern_y.selectedIndicators[0].correlationCoefficient).toBe(0.92);

    expect(pattern_x.selectedIndicators[1].indicatorId).toBe('indicator_B');
    expect(pattern_x.selectedIndicators[1].correlationCoefficient).toBe(0.87);
    expect(pattern_y.selectedIndicators[1].indicatorId).toBe('indicator_B');
    expect(pattern_y.selectedIndicators[1].correlationCoefficient).toBe(0.87);

    expect(pattern_x.selectedIndicators[2].indicatorId).toBe('indicator_C');
    expect(pattern_x.selectedIndicators[2].correlationCoefficient).toBe(0.75);
    expect(pattern_y.selectedIndicators[2].indicatorId).toBe('indicator_C');
    expect(pattern_y.selectedIndicators[2].correlationCoefficient).toBe(0.75);

    // パターンX と パターンY の全体的な構造が一致することを検証
    expect(pattern_x).toEqual(pattern_y);
  });
});