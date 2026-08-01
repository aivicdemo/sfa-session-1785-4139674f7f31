import { describe, test, expect, beforeEach } from '@jest/globals';
import { analyzeSellerBehaviorPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-393
  test('提案実行レコードが0件の場合、空配列として処理される', () => {
    const emptyProposalRecords: Array<{
      proposal_id: string;
      seller_id: string;
      customer_id: string;
      proposal_content: string;
      execution_date: string;
      result_status: string;
    }> = [];

    const result = analyzeSellerBehaviorPatterns(emptyProposalRecords);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});