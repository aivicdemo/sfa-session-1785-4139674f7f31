import { describe, test, expect } from '@jest/globals';
import { validateSalesProposalData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-1033: 同じ提案内容データで2回実行した場合に同じ検証結果が得られる', () => {
    // 共通の提案データ
    const proposalData = {
      proposalId: 'PROP-20240115-001',
      customerName: 'ABC株式会社',
      amount: 1500000,
      proposalDate: '2024-01-15'
    };

    // 第1回目の検証実行
    const firstValidationResult = validateSalesProposalData(proposalData);

    // 第2回目の検証実行
    const secondValidationResult = validateSalesProposalData(proposalData);

    // 第1回目と第2回目のエラーコードが一致することを検証
    expect(firstValidationResult.errorCode).toBe(secondValidationResult.errorCode);

    // 第1回目と第2回目の警告メッセージが一致することを検証
    expect(firstValidationResult.warningMessage).toBe(secondValidationResult.warningMessage);

    // 第1回目と第2回目のチェック項目の合否一覧が完全に一致することを検証
    expect(firstValidationResult.checkItems).toEqual(secondValidationResult.checkItems);

    // 第1回目と第2回目の重大度レベルが一致することを検証
    expect(firstValidationResult.severityLevel).toBe(secondValidationResult.severityLevel);

    // 各チェック項目の詳細検証
    expect(firstValidationResult.checkItems.length).toBe(secondValidationResult.checkItems.length);

    firstValidationResult.checkItems.forEach((item, index) => {
      expect(item.itemName).toBe(secondValidationResult.checkItems[index].itemName);
      expect(item.status).toBe(secondValidationResult.checkItems[index].status);
      expect(item.message).toBe(secondValidationResult.checkItems[index].message);
    });

    // 検証結果全体が完全に一致することを確認
    expect(firstValidationResult).toEqual(secondValidationResult);
  });
});