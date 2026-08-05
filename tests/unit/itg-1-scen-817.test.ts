import { extractProblemDetectionReasoning } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-817: 対応必要性が高い問題の根拠情報が正確に抽出される', () => {
    // Setup: テスト用の問題検出結果データを準備
    const problemDetectionId = 'PROBLEM_DET_001';
    const ruleId = 'RULE_20240115_001';
    const violationContent = '営業段階の移行前に必須項目「顧客決裁者確認」が未記入';
    const processStage = '提案段階';
    const proposalDateTime = '2024-01-15 10:30:00';
    const customerName = 'ABC株式会社';

    // 根拠情報スタブデータの構築
    const reasoningData = {
      problemDetectionId: problemDetectionId,
      severity: '高',
      actionRequired: '必須',
      ruleId: ruleId,
      violationContent: violationContent,
      relatedProcessStage: processStage,
      violationDetails: {
        proposalDateTime: proposalDateTime,
        customerName: customerName,
      },
    };

    // Execute: 根拠情報抽出機能を実行
    const result = extractProblemDetectionReasoning({
      problemDetectionId: problemDetectionId,
      reasoningData: reasoningData,
    });

    // Assert: 抽出された根拠情報が期待値と一致することを検証
    expect(result).toEqual({
      problemDetectionId: problemDetectionId,
      severity: '高',
      actionRequired: '必須',
      ruleId: ruleId,
      violationContent: violationContent,
      relatedProcessStage: processStage,
      violationDetails: {
        proposalDateTime: proposalDateTime,
        customerName: customerName,
      },
    });

    // Assert: 抽出された根拠情報の各要素が正確に含まれていることを確認
    expect(result.ruleId).toBe(ruleId);
    expect(result.violationContent).toBe(violationContent);
    expect(result.relatedProcessStage).toBe(processStage);
    expect(result.violationDetails.proposalDateTime).toBe(proposalDateTime);
    expect(result.violationDetails.customerName).toBe(customerName);
  });
});