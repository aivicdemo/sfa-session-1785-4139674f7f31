import { evaluateExtractionApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-713
  test('成功・失敗要因の抽出と承認基準判定機能 - 抽出要因の言語化品質スコアが業務上の最大値のとき、承認基準判定で正しく処理される', () => {
    const executionTime = new Date('2024-01-15T14:30:00Z');
    const extractedFactor = {
      factor_id: 'fac-001',
      description: '顧客の初期接触段階で営業担当者が顧客ニーズを十分にヒアリングし、提案内容を顧客要件に適合させることが成約につながった',
      category: 'success_pattern',
      verbalization_quality_score: 100,
      creation_timestamp: executionTime,
      audit_trail: [],
    };

    const result = evaluateExtractionApprovalCriteria(extractedFactor, executionTime);

    expect(result.approval_status).toBe('approved');
    expect(result.is_approved).toBe(true);
    expect(result.evaluation_score).toBe(100);
    expect(result.audit_log).toBeDefined();
    expect(result.audit_log.length).toBeGreaterThan(0);

    const latestAuditEntry = result.audit_log[result.audit_log.length - 1];
    expect(latestAuditEntry.execution_timestamp).toEqual(executionTime);
    expect(latestAuditEntry.quality_score_recorded).toBe(100);
    expect(latestAuditEntry.action).toBe('approval_evaluation_completed');
  });
});