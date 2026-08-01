import { validateLearningDataBeforeInference } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-090: AIエージェント推論実行前の学習データ量・品質検証機能 - 成約実績が空の場合、推論実行が保留される', () => {
    // テストデータ: 営業案件レコード（ステータス：進行中、担当者：営業A）
    const dealId = 'DEAL-001';
    const salesPersonId = 'SALES-A';
    const dealStatus = 'IN_PROGRESS';
    const closedDealsCount = 0; // 成約実績が空（0件）

    // AIエージェント推論実行前の学習データ検証処理を呼び出す
    const validationResult = validateLearningDataBeforeInference({
      dealId,
      salesPersonId,
      dealStatus,
      closedDealsCount,
    });

    // 期待結果の検証
    // 1. 推論実行状態が 'PENDING' であること
    expect(validationResult.inferenceStatus).toBe('PENDING');

    // 2. 推論処理がスキップされること（canProceedが false）
    expect(validationResult.canProceed).toBe(false);

    // 3. ユーザーへのメッセージが返却されること
    expect(validationResult.message).toMatch(/学習データ不足/);
    expect(validationResult.message).toMatch(/成約実績/);
    expect(validationResult.message).toMatch(/推論実行を保留/);
  });
});