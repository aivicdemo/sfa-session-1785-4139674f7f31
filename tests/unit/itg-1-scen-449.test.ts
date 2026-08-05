import { describe, test, expect, beforeEach } from '@jest/globals';
import { addCustomerReactionDataToLearningDatastore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント学習データ蓄積機能 - 最大レコード件数超過時の動作', () => {
  // SCEN-449
  test('should reject customer reaction data exceeding maximum record count and return 409 Conflict', () => {
    // Setup: 最大レコード件数の定義
    const max_record_count = 10000;
    const current_stored_records = 10000;
    const incoming_records_count = 500;
    const total_incoming = 10500;

    // Input: 最大値を超える件数の顧客反応データを準備
    const customer_reaction_data_batch = Array.from(
      { length: incoming_records_count },
      (_, idx) => ({
        reaction_id: `reaction_${current_stored_records + idx + 1}`,
        customer_id: `cust_${idx % 100}`,
        response_type: idx % 3 === 0 ? 'email_reply' : idx % 3 === 1 ? 'phone_call' : 'proposal_accepted',
        recorded_at: new Date('2024-01-15T10:00:00Z').toISOString(),
        sentiment_score: 0.7 + (idx % 30) * 0.01,
      })
    );

    // Execute: 蓄積機能を実行
    const result = addCustomerReactionDataToLearningDatastore(
      current_stored_records,
      max_record_count,
      customer_reaction_data_batch
    );

    // Assert: 409 Conflict ステータスと拒否メッセージを検証
    expect(result.status_code).toBe(409);
    expect(result.error_message).toMatch(/学習データ蓄積の最大レコード件数超過/);

    // Assert: 既存レコード件数が変更されないことを検証
    expect(result.current_stored_count).toBe(current_stored_records);

    // Assert: 追加されたレコード件数がゼロであることを検証
    expect(result.records_added_count).toBe(0);

    // Assert: 拒否されたレコード件数が正確に500であることを検証
    expect(result.records_rejected_count).toBe(incoming_records_count);

    // Assert: エラーログに正確なメッセージが記録されたことを検証
    expect(result.error_log).toMatch(/最大レコード件数: 10000/);
    expect(result.error_log).toMatch(/リクエスト件数: 500/);
    expect(result.error_log).toMatch(/超過件数: 500/);

    // Assert: タイムスタンプが記録されたことを検証（ISO 8601 形式）
    expect(result.logged_at).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);

    // Assert: トランザクション状態が ROLLED_BACK であることを検証
    expect(result.transaction_status).toBe('ROLLED_BACK');

    // Assert: 既存データのハッシュ値が変更されていないことを検証
    expect(result.existing_data_hash_before).toBe(result.existing_data_hash_after);
  });
});