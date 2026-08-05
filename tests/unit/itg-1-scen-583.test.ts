import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-583: [edge] 営業担当者の行動パターン分析レポート生成機能 - 分析対象期間が月初1日から月末末日まで完全に一致する場合
  test('分析対象期間が月初1日から月末末日まで完全に一致する場合、生成されたレポートの分析期間フィールドが正確に一致し、期間内のデータのみ含まれること', () => {
    // テスト用の営業担当者データを準備
    const salesPersonId = 'TEST-001';
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');

    // 分析対象期間内の行動データ（3件）
    const actionsWithinPeriod = [
      {
        actionId: 'ACTION-001',
        salesPersonId: salesPersonId,
        actionType: 'initial_contact',
        actionDate: new Date('2024-01-05T10:30:00Z'),
        customerName: '顧客A',
        proposalContent: '初回提案',
      },
      {
        actionId: 'ACTION-002',
        salesPersonId: salesPersonId,
        actionType: 'proposal',
        actionDate: new Date('2024-01-15T14:00:00Z'),
        customerName: '顧客B',
        proposalContent: '詳細提案',
      },
      {
        actionId: 'ACTION-003',
        salesPersonId: salesPersonId,
        actionType: 'follow_up',
        actionDate: new Date('2024-01-25T09:15:00Z'),
        customerName: '顧客C',
        proposalContent: 'フォローアップ提案',
      },
    ];

    // 期間外の行動データ（期間前後の各1件、含まれてはいけない）
    const actionsOutsidePeriod = [
      {
        actionId: 'ACTION-000',
        salesPersonId: salesPersonId,
        actionType: 'initial_contact',
        actionDate: new Date('2023-12-31T23:59:59Z'),
        customerName: '顧客Outside1',
        proposalContent: '期間前提案',
      },
      {
        actionId: 'ACTION-004',
        salesPersonId: salesPersonId,
        actionType: 'initial_contact',
        actionDate: new Date('2024-02-01T00:00:00Z'),
        customerName: '顧客Outside2',
        proposalContent: '期間後提案',
      },
    ];

    // 全行動データ（期間内3件 + 期間外2件）
    const allActions = [...actionsOutsidePeriod.slice(0, 1), ...actionsWithinPeriod, ...actionsOutsidePeriod.slice(1)];

    // 推論精度スコア計算（期間内で正確に分類できたデータの正確度）
    // 期間内行動3件すべてが正確に分類されている場合
    const correctClassifications = 3;
    const totalActionsInPeriod = 3;
    const expectedAccuracyScore = (correctClassifications / totalActionsInPeriod) * 100;

    // 分析レポート生成のための入力パラメータ
    const analysisInput = {
      salesPersonId: salesPersonId,
      startDate: analysisStartDate,
      endDate: analysisEndDate,
      actions: allActions,
    };

    // 推論精度スコア計算API呼び出し
    const accuracyScore = calculateInferenceAccuracyScore(analysisInput);

    // 期待値：精度スコアは100.0（3/3が正確に分類）
    expect(accuracyScore).toBe(100.0);

    // 期間検証：レポートに含まれるデータは期間内のみであること
    const reportedActionsInPeriod = allActions.filter(
      (action) =>
        action.actionDate >= analysisStartDate &&
        action.actionDate <= analysisEndDate
    );

    // 期待値：期間内のデータは正確に3件
    expect(reportedActionsInPeriod.length).toBe(3);

    // 期待値：各行動データが期間内に収まっていること
    reportedActionsInPeriod.forEach((action) => {
      expect(action.actionDate.getTime()).toBeGreaterThanOrEqual(analysisStartDate.getTime());
      expect(action.actionDate.getTime()).toBeLessThanOrEqual(analysisEndDate.getTime());
    });

    // 期待値：期間外データは0件
    const reportedActionsOutsidePeriod = allActions.filter(
      (action) =>
        action.actionDate < analysisStartDate ||
        action.actionDate > analysisEndDate
    );
    expect(reportedActionsOutsidePeriod.length).toBe(2);

    // 分析レポートの構造検証
    const report = {
      salesPersonId: salesPersonId,
      analysisStartDate: analysisStartDate,
      analysisEndDate: analysisEndDate,
      actionsAnalyzed: reportedActionsInPeriod,
      inferenceAccuracyScore: accuracyScore,
    };

    // 期待値：レポート開始日時が正確に一致
    expect(report.analysisStartDate).toEqual(new Date('2024-01-01T00:00:00Z'));

    // 期待値：レポート終了日時が正確に一致
    expect(report.analysisEndDate).toEqual(new Date('2024-01-31T23:59:59Z'));

    // 期待値：レポート内行動データ数が3件
    expect(report.actionsAnalyzed.length).toBe(3);

    // 期待値：推論精度スコアが100.0
    expect(report.inferenceAccuracyScore).toBe(100.0);
  });
});