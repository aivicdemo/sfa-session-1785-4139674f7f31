import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateManagerAuthority, analyzeSalesRepresentativePatternAndDecideImprovement } from '../../src/logic/it-1-br-2-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-290: [error] 営業担当者行動パターン分析・改善指導判定機能 - 営業管理職の権限が確認できないとき、処理が中断される
  test('should abort process and return authorization error when manager authority is not confirmed', async () => {
    const sales_rep_id = 'SR-2024-001';
    const analysis_start_date = '2024-01-01';
    const analysis_end_date = '2024-01-31';
    const manager_user_id = 'MGR-2024-001';

    // Mock: 権限チェックエンドポイントが未認可ステータスを返す
    fetchMock.mockResponseOnce(
      JSON.stringify({
        authorized: false,
        user_id: manager_user_id,
        role: null,
        status: 'unauthorized'
      }),
      { status: 403 }
    );

    // 権限チェック処理を実行
    const authority_check_result = await validateManagerAuthority(manager_user_id);

    // 権限チェック結果: 権限なし
    expect(authority_check_result.authorized).toBe(false);
    expect(authority_check_result.status).toBe('unauthorized');

    // 権限チェックで未認可の場合、分析処理は実行されない
    // analyzeSalesRepresentativePatternAndDecideImprovement 実行
    const analysis_result = await analyzeSalesRepresentativePatternAndDecideImprovement(
      sales_rep_id,
      analysis_start_date,
      analysis_end_date,
      manager_user_id,
      authority_check_result
    );

    // エラーコード『権限不足』が返却される
    expect(analysis_result.error_code).toBe('権限不足');

    // エラーメッセージに『営業管理職の権限が必要です』と表示される
    expect(analysis_result.error_message).toMatch(/営業管理職の権限が必要です/);

    // データベースへの分析結果の保存は行われない
    expect(analysis_result.database_save_executed).toBe(false);

    // 分析結果オブジェクトがnullまたはundefinedであることを確認
    expect(analysis_result.analysis_data).toBeNull();
  });
});