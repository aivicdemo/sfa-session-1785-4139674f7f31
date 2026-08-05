import { analyzeCareerPatternAndContractResult } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-643: 分析対象期間の開始日と終了日が同日のとき、当日の営業活動のみを対象に分析が実行される', () => {
    // テスト用のデータを準備
    const salesPersonId = 'SP001';
    const targetDate = new Date('2024-01-15T00:00:00Z');
    const beforeDate = new Date('2024-01-14T00:00:00Z');
    const afterDate = new Date('2024-01-16T00:00:00Z');

    // 分析対象期間：2024年1月15日～2024年1月15日（同日）
    const analysisStartDate = new Date('2024-01-15T00:00:00Z');
    const analysisEndDate = new Date('2024-01-15T23:59:59Z');

    // 営業活動データ: 対象日（2024年1月15日）の活動
    const activitiesOnTargetDate = [
      {
        id: 'ACT001',
        salesPersonId,
        activityType: 'meeting',
        executedAt: new Date('2024-01-15T09:00:00Z'),
        customerId: 'CUST001'
      },
      {
        id: 'ACT002',
        salesPersonId,
        activityType: 'meeting',
        executedAt: new Date('2024-01-15T11:30:00Z'),
        customerId: 'CUST002'
      },
      {
        id: 'ACT003',
        salesPersonId,
        activityType: 'meeting',
        executedAt: new Date('2024-01-15T14:00:00Z'),
        customerId: 'CUST003'
      },
      {
        id: 'ACT004',
        salesPersonId,
        activityType: 'proposal_sent',
        executedAt: new Date('2024-01-15T16:00:00Z'),
        customerId: 'CUST001'
      },
      {
        id: 'ACT005',
        salesPersonId,
        activityType: 'contract',
        executedAt: new Date('2024-01-15T17:00:00Z'),
        customerId: 'CUST001',
        contractAmount: 500000
      }
    ];

    // 営業活動データ: 前日（2024年1月14日）の活動
    const activitiesBeforeDate = [
      {
        id: 'ACT006',
        salesPersonId,
        activityType: 'meeting',
        executedAt: new Date('2024-01-14T10:00:00Z'),
        customerId: 'CUST004'
      },
      {
        id: 'ACT007',
        salesPersonId,
        activityType: 'email',
        executedAt: new Date('2024-01-14T15:00:00Z'),
        customerId: 'CUST005'
      }
    ];

    // 営業活動データ: 翌日（2024年1月16日）の活動
    const activitiesAfterDate = [
      {
        id: 'ACT008',
        salesPersonId,
        activityType: 'meeting',
        executedAt: new Date('2024-01-16T09:00:00Z'),
        customerId: 'CUST006'
      },
      {
        id: 'ACT009',
        salesPersonId,
        activityType: 'proposal_sent',
        executedAt: new Date('2024-01-16T14:00:00Z'),
        customerId: 'CUST006'
      }
    ];

    // すべての営業活動を統合
    const allActivities = [
      ...activitiesBeforeDate,
      ...activitiesOnTargetDate,
      ...activitiesAfterDate
    ];

    // 分析実行
    const analysisResult = analyzeCareerPatternAndContractResult({
      salesPersonId,
      startDate: analysisStartDate,
      endDate: analysisEndDate,
      activities: allActivities
    });

    // 期待値の計算
    // 対象日のみの集計
    const expectedMeetingCount = 3;
    const expectedProposalSentCount = 1;
    const expectedContractCount = 1;
    const expectedTotalActivityCount = 5;
    const expectedContractAmount = 500000;
    const expectedAnalysisPeriodDays = 1;

    // 検証: 営業活動が対象日のみに絞り込まれていること
    expect(analysisResult.activityCounts.meeting).toBe(expectedMeetingCount);
    expect(analysisResult.activityCounts.proposal_sent).toBe(
      expectedProposalSentCount
    );
    expect(analysisResult.activityCounts.contract).toBe(
      expectedContractCount
    );
    expect(analysisResult.activityCounts.total).toBe(
      expectedTotalActivityCount
    );

    // 検証: 成約実績が対象日のみに集計されていること
    expect(analysisResult.contractResult.count).toBe(expectedContractCount);
    expect(analysisResult.contractResult.totalAmount).toBe(
      expectedContractAmount
    );

    // 検証: 分析期間が正確に記録されていること
    expect(analysisResult.analysisPeriod.startDate).toEqual(analysisStartDate);
    expect(analysisResult.analysisPeriod.endDate).toEqual(analysisEndDate);
    expect(analysisResult.analysisPeriod.durationDays).toBe(
      expectedAnalysisPeriodDays
    );

    // 検証: 前日と翌日のデータが除外されていること
    expect(analysisResult.excludedActivityCounts.beforePeriod).toBe(2);
    expect(analysisResult.excludedActivityCounts.afterPeriod).toBe(2);

    // 検証: レポートの集計期間表示が正確であること
    expect(analysisResult.reportPeriodDisplay).toBe(
      '2024年1月15日～2024年1月15日（1日間）'
    );
  });
});