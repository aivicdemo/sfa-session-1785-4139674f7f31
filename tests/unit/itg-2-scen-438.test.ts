import { revalidateDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-438
  test('[error] 修正済みデータ品質再検証 - 品質ルール定義がnullである場合、エラーが発生する', () => {
    const corrected_data = {
      customer_id: 'CUST-001',
      customer_name: '株式会社テスト',
      email: 'test@example.com',
      phone: '09012345678',
    };

    const validation_context = {
      validation_timestamp: new Date('2024-01-15T11:00:00Z'),
      validation_scope: 'post_correction',
      target_records_count: 1,
    };

    expect(() => 
      revalidateDataQuality(
        corrected_data,
        null,
        validation_context
      )
    ).toThrow(/品質ルール定義/);
  });
});