import { judgeRuleApprovalWithCaseMatching } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-580
  test('修正ルール承認判定機能 - 重複検出ルールの妥当性が確認される', () => {
    const pastApprovalCases = [
      {
        id: 'case_001',
        ruleName: '顧客名_住所正規化ルール',
        targetFields: ['顧客名', '住所'],
        matchingCondition: '編集距離≤2',
        action: '自動統合',
        approvalStatus: '承認済み',
        accuracy: 96.5,
        coverage: 85.0,
        riskLevel: '低',
        appliedDate: '2024-01-10',
        result: '成功'
      },
      {
        id: 'case_002',
        ruleName: '顧客名_電話番号正規化ルール',
        targetFields: ['顧客名', '電話番号'],
        matchingCondition: '完全一致',
        action: '自動統合',
        approvalStatus: '承認済み',
        accuracy: 98.0,
        coverage: 92.0,
        riskLevel: '低',
        appliedDate: '2024-01-05',
        result: '成功'
      },
      {
        id: 'case_003',
        ruleName: '住所_郵便番号正規化ルール',
        targetFields: ['住所', '郵便番号'],
        matchingCondition: '編集距離≤1',
        action: '自動統合',
        approvalStatus: '却下',
        accuracy: 78.0,
        coverage: 65.0,
        riskLevel: '高',
        appliedDate: '2024-01-08',
        result: '失敗'
      },
      {
        id: 'case_004',
        ruleName: '顧客名_業種正規化ルール',
        targetFields: ['顧客名', '業種'],
        matchingCondition: '編集距離≤3',
        action: '自動統合',
        approvalStatus: '却下',
        accuracy: 72.0,
        coverage: 55.0,
        riskLevel: '高',
        appliedDate: '2024-01-06',
        result: '失敗'
      },
      {
        id: 'case_005',
        ruleName: '顧客名_住所_電話番号統合ルール',
        targetFields: ['顧客名', '住所', '電話番号'],
        matchingCondition: '編集距離≤2',
        action: '自動統合',
        approvalStatus: '承認済み',
        accuracy: 94.0,
        coverage: 82.0,
        riskLevel: '中',
        appliedDate: '2024-01-03',
        result: '成功'
      },
      {
        id: 'case_006',
        ruleName: '顧客名_住所カスタム正規化ルール',
        targetFields: ['顧客名', '住所'],
        matchingCondition: '編集距離≤2',
        action: '手動確認',
        approvalStatus: '条件付承認',
        accuracy: 91.0,
        coverage: 78.0,
        riskLevel: '中',
        appliedDate: '2024-01-02',
        result: '成功'
      },
      {
        id: 'case_007',
        ruleName: '住所正規化_厳格版',
        targetFields: ['住所'],
        matchingCondition: '完全一致',
        action: '自動統合',
        approvalStatus: '承認済み',
        accuracy: 99.0,
        coverage: 88.0,
        riskLevel: '低',
        appliedDate: '2023-12-28',
        result: '成功'
      },
      {
        id: 'case_008',
        ruleName: '顧客名正規化_厳格版',
        targetFields: ['顧客名'],
        matchingCondition: '完全一致',
        action: '自動統合',
        approvalStatus: '承認済み',
        accuracy: 97.5,
        coverage: 80.5,
        riskLevel: '低',
        appliedDate: '2023-12-25',
        result: '成功'
      },
      {
        id: 'case_009',
        ruleName: '複合フィールド統合ルール',
        targetFields: ['顧客名', '住所'],
        matchingCondition: '編集距離≤1',
        action: '自動統合',
        approvalStatus: '却下',
        accuracy: 88.0,
        coverage: 71.0,
        riskLevel: '高',
        appliedDate: '2023-12-20',
        result: '失敗'
      },
      {
        id: 'case_010',
        ruleName: '顧客名_住所_レベニュー正規化ルール',
        targetFields: ['顧客名', '住所'],
        matchingCondition: '編集距離≤2',
        action: '手動確認',
        approvalStatus: '条件付承認',
        accuracy: 93.5,
        coverage: 79.0,
        riskLevel: '中',
        appliedDate: '2023-12-18',
        result: '成功'
      }
    ];

    const newRuleProposal = {
      ruleName: '顧客名_住所正規化ルール',
      targetFields: ['顧客名', '住所'],
      matchingCondition: '編集距離≤2',
      action: '自動統合'
    };

    const approvalCriteria = {
      minAccuracy: 95.0,
      minCoverage: 80.0,
      maxRiskLevel: '中'
    };

    const result = judgeRuleApprovalWithCaseMatching(
      newRuleProposal,
      pastApprovalCases,
      approvalCriteria
    );

    expect(result.approvalRecommendation).toBe('承認可');
    expect(result.matchedCaseIds.length).toBeGreaterThanOrEqual(2);
    expect(result.matchedCaseIds).toEqual(expect.arrayContaining(['case_001', 'case_006']));
    expect(result.matchedCases).toHaveLength(2);
    expect(result.matchedCases[0]).toEqual(
      expect.objectContaining({
        id: 'case_001',
        approvalStatus: '承認済み',
        result: '成功'
      })
    );
    expect(result.matchedCases[1]).toEqual(
      expect.objectContaining({
        id: 'case_006',
        approvalStatus: '条件付承認',
        result: '成功'
      })
    );
    expect(result.criteriaComplianceDegree).toBe(92);
    expect(result.needsManualReview).toBe(false);
    expect(result.reasoning).toBeDefined();
    expect(typeof result.reasoning).toBe('string');
    expect(result.reasoning.length).toBeGreaterThan(0);
  });
});