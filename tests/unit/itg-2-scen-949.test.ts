import { describe, test, expect } from '@jest/globals';
import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-949: 提案タイトルが最大文字数ちょうどのとき検証に成功する', () => {
    // 提案タイトルの最大文字数: 255文字
    const maxTitleLength = 255;
    
    // 255文字のテスト文字列を生成
    const exactMaxTitle = 'A'.repeat(maxTitleLength);
    
    // 検証対象の提案内容オブジェクト
    const proposalContent = {
      title: exactMaxTitle,
      description: 'テスト提案の説明文',
      amount: 100000,
      duration: 30
    };
    
    // 検証メソッドを実行
    const result = validateProposalContent(proposalContent);
    
    // 期待結果: 検証成功を示すステータスを返す
    expect(result).toEqual({
      valid: true,
      errors: []
    });
  });
});