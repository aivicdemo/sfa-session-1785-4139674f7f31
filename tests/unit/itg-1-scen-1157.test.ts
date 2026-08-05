import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1157
  test('複数営業担当者のデータに重複レコードが含まれるとき重複を除外して分析される', () => {
    // テストデータ: 営業担当者A、B、Cの行動データ
    const salesPersonAActivities = [
      {
        activityId: 'ACT_A_001',
        salesPersonId: 'SP_A',
        customerId: 'CUST_001',
        activityType: 'visit',
        activityDate: '2024-01-15T09:00:00Z',
      },
      // 営業担当者Aのデータに同一の顧客訪問レコード（日時、顧客ID、訪問種別が完全に一致）を2件含める
      {
        activityId: 'ACT_A_002',
        salesPersonId: 'SP_A',
        customerId: 'CUST_001',
        activityType: 'visit',
        activityDate: '2024-01-15T09:00:00Z',
      },
      {
        activityId: 'ACT_A_003',
        salesPersonId: 'SP_A',
        customerId: 'CUST_002',
        activityType: 'call',
        activityDate: '2024-01-16T10:30:00Z',
      },
    ];

    const salesPersonBActivities = [
      {
        activityId: 'ACT_B_001',
        salesPersonId: 'SP_B',
        opportunityId: 'OPP_001',
        activityType: 'proposal',
        activityDate: '2024-01-17T14:00:00Z',
        proposalContent: 'Enterprise solution package',
      },
      // 営業担当者Bのデータに同一の提案作成レコード（日時、案件ID、提案内容が完全に一致）を3件含める
      {
        activityId: 'ACT_B_002',
        salesPersonId: 'SP_B',
        opportunityId: 'OPP_001',
        activityType: 'proposal',
        activityDate: '2024-01-17T14:00:00Z',
        proposalContent: 'Enterprise solution package',
      },
      {
        activityId: 'ACT_B_003',
        salesPersonId: 'SP_B',
        opportunityId: 'OPP_001',
        activityType: 'proposal',
        activityDate: '2024-01-17T14:00:00Z',
        proposalContent: 'Enterprise solution package',
      },
      {
        activityId: 'ACT_B_004',
        salesPersonId: 'SP_B',
        opportunityId: 'OPP_002',
        activityType: 'email',
        activityDate: '2024-01-18T11:15:00Z',
      },
    ];

    // 営業担当者Cのデータには重複レコードを含めない
    const salesPersonCActivities = [
      {
        activityId: 'ACT_C_001',
        salesPersonId: 'SP_C',
        customerId: 'CUST_003',
        activityType: 'visit',
        activityDate: '2024-01-19T13:45:00Z',
      },
      {
        activityId: 'ACT_C_002',
        salesPersonId: 'SP_C',
        opportunityId: 'OPP_003',
        activityType: 'proposal',
        activityDate: '2024-01-20T10:00:00Z',
        proposalContent: 'Standard package',
      },
    ];

    // 複数営業担当者の行動データを統合
    const allActivities = [
      ...salesPersonAActivities,
      ...salesPersonBActivities,
      ...salesPersonCActivities,
    ];

    // 行動パターン分析レポート生成機能を実行
    const report = generateSalesActivityPatternReport({
      activities: allActivities,
      analysisStartDate: '2024-01-15T00:00:00Z',
      analysisEndDate: '2024-01-20T23:59:59Z',
    });

    // 生成されたレポートを確認
    // 営業担当者Aの訪問実績: 重複を除外して1件
    const salesPersonAVisitCount = report.activityPatterns.find(
      (pattern) =>
        pattern.salesPersonId === 'SP_A' && pattern.activityType === 'visit'
    )?.count;
    expect(salesPersonAVisitCount).toBe(1);

    // 営業担当者Aの通話実績: 1件
    const salesPersonACallCount = report.activityPatterns.find(
      (pattern) =>
        pattern.salesPersonId === 'SP_A' && pattern.activityType === 'call'
    )?.count;
    expect(salesPersonACallCount).toBe(1);

    // 営業担当者Bの提案実績: 重複を除外して1件
    const salesPersonBProposalCount = report.activityPatterns.find(
      (pattern) =>
        pattern.salesPersonId === 'SP_B' && pattern.activityType === 'proposal'
    )?.count;
    expect(salesPersonBProposalCount).toBe(1);

    // 営業担当者Bのメール実績: 1件
    const salesPersonBEmailCount = report.activityPatterns.find(
      (pattern) =>
        pattern.salesPersonId === 'SP_B' && pattern.activityType === 'email'
    )?.count;
    expect(salesPersonBEmailCount).toBe(1);

    // 営業担当者Cの訪問実績: 1件
    const salesPersonCVisitCount = report.activityPatterns.find(
      (pattern) =>
        pattern.salesPersonId === 'SP_C' && pattern.activityType === 'visit'
    )?.count;
    expect(salesPersonCVisitCount).toBe(1);

    // 営業担当者Cの提案実績: 1件
    const salesPersonCProposalCount = report.activityPatterns.find(
      (pattern) =>
        pattern.salesPersonId === 'SP_C' && pattern.activityType === 'proposal'
    )?.count;
    expect(salesPersonCProposalCount).toBe(1);

    // 全体の集計行動数は重複を排除した値となる
    // 期待される行動数: SP_A: visit 1 + call 1 = 2
    //                 SP_B: proposal 1 + email 1 = 2
    //                 SP_C: visit 1 + proposal 1 = 2
    //                 合計: 6件
    const totalActivityCount = report.activityPatterns.reduce(
      (sum, pattern) => sum + pattern.count,
      0
    );
    expect(totalActivityCount).toBe(6);

    // レポートに含まれる営業担当者は3名
    const uniqueSalesPersonIds = new Set(
      report.activityPatterns.map((pattern) => pattern.salesPersonId)
    );
    expect(uniqueSalesPersonIds.size).toBe(3);
    expect(uniqueSalesPersonIds.has('SP_A')).toBe(true);
    expect(uniqueSalesPersonIds.has('SP_B')).toBe(true);
    expect(uniqueSalesPersonIds.has('SP_C')).toBe(true);
  });
});