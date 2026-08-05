import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeProcessDeviationForSalesPerson } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1095: [normal] 営業担当者ごとの行動パターン分析・標準プロセス乖離分析機能 - 標準プロセスステップから外れた営業担当者の行動について、乖離度が正数値として計算される
  test('営業担当者Aが独自ステップを含む行動履歴を持つ場合、乖離度が正の数値として計算される', () => {
    // 標準営業プロセス：5ステップ
    const standardProcessSteps = [
      'proposal_creation',
      'customer_presentation',
      'proposal_modification',
      'approval_request',
      'contract_signing',
    ];

    // 営業担当者Aの実行ステップ：標準プロセス5ステップに独自ステップ1つが挿入
    const salesPersonActualSteps = [
      'proposal_creation',
      'customer_presentation',
      'proposal_cancellation', // 非標準ステップ（独自ステップ）
      'proposal_modification',
      'approval_request',
      'contract_signing',
    ];

    // 営業担当者A
    const salesPersonId = 'sales_person_a_001';

    // 乖離度を計算
    const result = analyzeProcessDeviationForSalesPerson({
      salesPersonId,
      standardProcessSteps,
      actualExecutedSteps: salesPersonActualSteps,
    });

    // 期待値計算：
    // - 標準プロセス5ステップに対して非標準ステップが1つ挿入
    // - 乖離度 = 1 / 5 = 0.2 以上の正数値
    expect(result.deviationScore).toBeGreaterThan(0);
    expect(result.deviationScore).toBeGreaterThanOrEqual(0.2);
    expect(typeof result.deviationScore).toBe('number');
    expect(result.salesPersonId).toBe(salesPersonId);
    expect(result.nonStandardStepsDetected).toContain('proposal_cancellation');
    expect(result.nonStandardStepsDetected.length).toBe(1);
  });
});