import { detectTimeSeriesSequenceError } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-680
  test('顧客対応日時が提案実行日時より未来日のとき時系列矛盾をエラーとして検出する', () => {
    const proposal_execution_datetime = new Date('2024-01-10T14:00:00Z');
    const customer_contact_datetime = new Date('2024-01-15T10:00:00Z');

    const result = detectTimeSeriesSequenceError({
      proposal_execution_datetime,
      customer_contact_datetime,
    });

    expect(result.error_type).toBe('TimestampSequenceError');
    expect(result.error_message).toMatch(/顧客対応日時\(2024-01-15 10:00\)/);
    expect(result.error_message).toMatch(/提案実行日時\(2024-01-10 14:00\)/);
    expect(result.error_message).toMatch(/時系列が矛盾/);
  });
});