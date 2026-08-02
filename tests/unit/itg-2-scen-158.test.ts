import { calculateDuplicateScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-158
  test('[normal] 顧客データ重複検出・統合判定機能 - 複合条件（顧客名と電話番号）の名寄せ基準でスコア計算が正しく実行される', () => {
    const namingCriteria = {
      fields: [
        { fieldName: 'customerName', weight: 0.5, maxScore: 100 },
        { fieldName: 'phoneNumber', weight: 0.5, maxScore: 100 }
      ]
    };

    const customer1 = {
      customerName: '山田太郎',
      phoneNumber: '09012345678'
    };

    const customer2 = {
      customerName: '山田太郎',
      phoneNumber: '09012345678'
    };

    const result = calculateDuplicateScore(namingCriteria, customer1, customer2);

    expect(result).toBe(100);
  });
});