import { validate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1030
  test('提案内容が0件送信された場合に検証エラーとして拒否される', () => {
    const validationRequest = {
      proposalItems: []
    };

    expect(() => validate(validationRequest)).toThrow(/提案内容は1件以上必須です/);
  });
});