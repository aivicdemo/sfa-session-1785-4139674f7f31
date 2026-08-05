import { determineExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  // SCEN-084: [normal] 営業プロセスログ抽出範囲確定機能 - 営業部長がデータ蓄積量確認完了時に抽出対象期間が正しく確定される
  test('should determine extraction range with oldest and newest log timestamps when data accumulation confirmation is completed', () => {
    const oldest_log_timestamp = new Date('2024-01-01T08:00:00Z');
    const newest_log_timestamp = new Date('2024-01-31T18:30:00Z');
    const total_log_count = 1250;
    const user_id = 'user-sales-director-001';
    const confirmation_status = 'COMPLETED';

    const result = determineExtractionRange({
      oldest_log_timestamp,
      newest_log_timestamp,
      total_log_count,
      user_id,
      confirmation_status,
    });

    expect(result.extraction_status).toBe('CONFIRMED');
    expect(result.extraction_start_datetime).toEqual(oldest_log_timestamp);
    expect(result.extraction_end_datetime).toEqual(newest_log_timestamp);
    expect(result.total_logs_in_range).toBe(total_log_count);
    expect(result.extraction_range_id).toBeDefined();
    expect(typeof result.extraction_range_id).toBe('string');
    expect(result.extraction_range_id.length).toBeGreaterThan(0);
  });
});