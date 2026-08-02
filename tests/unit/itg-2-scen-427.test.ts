import { validateModifiedDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  test('SCEN-427: 修正済みデータ品質再検証 - 顧客名長上限超過時に改善必要を明示', () => {
    // 256文字を超える顧客名を含むテストデータ
    const oversized_customer_name = 'A'.repeat(257);
    const modified_data_record = {
      record_id: 'REC-20240115-001',
      customer_name: oversized_customer_name,
      customer_code: 'CUST-001',
      contact_email: 'contact@example.com',
      phone_number: '09012345678',
    };

    const result = validateModifiedDataQuality(modified_data_record);

    // 検証結果の構造確認
    expect(result.is_valid).toBe(false);
    expect(result.status).toBe('改善必要');
    
    // エラー理由に項目長超過メッセージが含まれることを確認
    expect(result.validation_errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field_name: 'customer_name',
          error_reason: '項目長が上限256文字を超過しています',
          current_length: 257,
          max_length: 256,
        }),
      ])
    );

    // 改善必要項目一覧に該当レコードとフィールドが含まれることを確認
    expect(result.improvement_required_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          record_id: 'REC-20240115-001',
          field_name: 'customer_name',
          improvement_status: '改善必要',
        }),
      ])
    );

    // 検証結果レポートに詳細情報が含まれることを確認
    expect(result.quality_report).toEqual(
      expect.objectContaining({
        total_records_checked: 1,
        valid_records: 0,
        invalid_records: 1,
        quality_score: 0,
      })
    );
  });
});