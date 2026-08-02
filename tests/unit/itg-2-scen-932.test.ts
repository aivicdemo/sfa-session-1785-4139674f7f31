import { describe, test, expect } from '@jest/globals';
import { validateProposal } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-932
  test('提案タイトルが未入力のとき検証エラーが返される', () => {
    const input = {
      proposal_title: '',
      proposal_content: '弊社製品の導入により、業務効率が30%向上します。',
      proposal_amount: 500000,
      proposal_deadline: '2024-12-31',
      customer_id: 'CUST-001',
    };

    expect(() => validateProposal(input)).toThrow(/提案タイトル/);
  });
});