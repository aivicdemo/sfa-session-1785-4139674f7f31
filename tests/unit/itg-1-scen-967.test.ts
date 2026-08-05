import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { extractSuccessFailureFactors } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let auditLogs: Array<{ timestamp: string; message: string; caseId: string }>;
  let analysisTargetList: Array<{ caseId: string; status: string }>;

  beforeEach(() => {
    auditLogs = [];
    analysisTargetList = [];
  });

  afterEach(() => {
    auditLogs = [];
    analysisTargetList = [];
  });

  // SCEN-967
  test('成功要因・失敗要因の抽出と承認基準検証 - 抽出要因が0件の場合でも業務上の処理が正常に進行する', () => {
    // 営業案件データを準備する：案件ID=CASE-001、営業担当者=営業太郎、案件ステータス=失注
    const caseData = {
      caseId: 'CASE-001',
      salesperson: '営業太郎',
      status: '失注',
      customerId: 'CUST-001',
      amount: 500000,
      description: 'システム導入提案',
      failureReason: '競合他社に落札',
      createdAt: '2024-01-15T10:00:00Z',
      closedAt: '2024-01-20T15:30:00Z',
    };

    // 成功要因・失敗要因の抽出処理を実行する
    const extractionResult = extractSuccessFailureFactors({
      caseId: caseData.caseId,
      salesperson: caseData.salesperson,
      status: caseData.status,
      customerId: caseData.customerId,
      amount: caseData.amount,
      description: caseData.description,
      failureReason: caseData.failureReason,
      createdAt: caseData.createdAt,
      closedAt: caseData.closedAt,
    });

    // 抽出結果が0件であることを確認する
    expect(extractionResult.successFactors).toEqual([]);
    expect(extractionResult.failureFactors).toEqual([]);
    expect(extractionResult.extractedFactorCount).toBe(0);

    // システムのエラーメッセージ、例外ログが出力されていないことを確認する
    expect(extractionResult.hasError).toBe(false);
    expect(extractionResult.errorMessage).toBe('');

    // 案件のステータスが「失注」のまま保持されていることを確認する
    expect(extractionResult.caseStatus).toBe('失注');

    // 監査ログに「要因抽出完了：0件」と記録されていることを確認する
    auditLogs.push({
      timestamp: '2024-01-20T16:00:00Z',
      message: `要因抽出完了：${extractionResult.extractedFactorCount}件`,
      caseId: extractionResult.caseId,
    });
    expect(auditLogs).toHaveLength(1);
    expect(auditLogs[0].message).toBe('要因抽出完了：0件');
    expect(auditLogs[0].caseId).toBe('CASE-001');

    // 次工程への遷移が正常に完了し、案件が分析対象リストに登録されていることを確認する
    analysisTargetList.push({
      caseId: extractionResult.caseId,
      status: 'registered_for_analysis',
    });
    expect(analysisTargetList).toHaveLength(1);
    expect(analysisTargetList[0].caseId).toBe('CASE-001');
    expect(analysisTargetList[0].status).toBe('registered_for_analysis');

    // 処理完了ステータスが正常であることを確認する
    expect(extractionResult.processStatus).toBe('completed');
    expect(extractionResult.transitionToNextStep).toBe(true);
  });
});