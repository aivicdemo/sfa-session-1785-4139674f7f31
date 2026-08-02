import { describe, test, expect } from '@jest/globals';
import { assembleCustomerAttributesFromMaster } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-652
  test('推奨内容根拠の可視化機能 - 顧客マスタから抽出した顧客データが1件のとき、その顧客属性が正しく組み立てられる', () => {
    const input_customer_master = {
      customer_id: 'C001',
      customer_name: 'テスト太郎',
      industry: '製造業',
      sales_scale: '1000万円以上',
      region: '東京都',
    };

    const result = assembleCustomerAttributesFromMaster(input_customer_master);

    expect(result).toEqual({
      customerId: 'C001',
      customerName: 'テスト太郎',
      industry: '製造業',
      salesScale: '1000万円以上',
      region: '東京都',
      industryEvidenceFlag: true,
      salesScaleEvidenceFlag: true,
      regionEvidenceFlag: true,
    });
  });
});