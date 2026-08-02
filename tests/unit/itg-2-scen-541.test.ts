import { detectAndClassifyCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-541
  test('正規化ルール0件のとき、不整合データの分類結果に正規化なしを記録する', () => {
    const normalizationRules = [];
    const inconsistencyData = [
      {
        customerId: 'CUST001',
        customerName: '株式会社テスト',
        addressVariation: '東京都渋谷区1-2-3 / 東京都渋谷区1丁目2番3号',
        phoneNumberVariation: '03-1234-5678 / 0312345678',
        inconstencyType: 'address_format_variation',
      },
      {
        customerId: 'CUST002',
        customerName: 'サンプル社',
        addressVariation: '大阪府大阪市北区4-5-6 / 大阪府大阪市北区4丁目5番6号',
        phoneNumberVariation: '06-9876-5432 / 0698765432',
        inconstencyType: 'phone_hyphen_variation',
      },
    ];

    const classificationResult = detectAndClassifyCustomerDuplicates(
      normalizationRules,
      inconsistencyData
    );

    expect(classificationResult).toEqual({
      classified: true,
      normalizationApplied: false,
      normalizationMethod: 'NONE',
      inconsistencyCount: 2,
      inconstencies: [
        {
          customerId: 'CUST001',
          inconstencyType: 'address_format_variation',
          normalized: false,
          normalizationMethod: 'NONE',
        },
        {
          customerId: 'CUST002',
          inconstencyType: 'phone_hyphen_variation',
          normalized: false,
          normalizationMethod: 'NONE',
        },
      ],
    });
  });
});