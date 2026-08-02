import { generateSignalDetectionRationale } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-762
  test('信号検出根拠生成機能 - 最終接触日のみが存在するとき、根拠に最終接触日だけが記載される', () => {
    const customer = {
      customerId: 'CUST-001',
      customerName: 'テスト顧客A',
      lastContactDate: '2024-01-15',
      firstContactDate: null,
      emailSentDate: null,
      phonContactDate: null,
      visitDate: null,
    };

    const rationale = generateSignalDetectionRationale(customer);

    expect(rationale).toEqual({
      lastContactDate: '2024-01-15',
    });
    expect(rationale.firstContactDate).toBeUndefined();
    expect(rationale.emailSentDate).toBeUndefined();
    expect(rationale.phonContactDate).toBeUndefined();
    expect(rationale.visitDate).toBeUndefined();
  });
});