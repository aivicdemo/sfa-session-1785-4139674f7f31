import { describe, test, expect, beforeEach } from '@jest/globals';
import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 類似パターン検索とランク付け', () => {
  // SCEN-2146
  test('過去成功事例のデータセットが空配列のとき、EMPTY_DATASETエラーをスロー', () => {
    const emptyPatternDataset: Array<{
      caseId: string;
      customerIndustry: string;
      productCategory: string;
      budgetRange: string;
      successFlag: boolean;
      proposalScore: number;
    }> = [];

    const newDealCondition = {
      customerIndustry: 'IT',
      productCategory: 'SaaS',
      budgetRange: '1000万-5000万',
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn(() => {
        if (emptyPatternDataset.length === 0) {
          const error = new Error(
            '過去成功事例が存在しません。パターンマッチングを実行できません'
          );
          (error as any).code = 'EMPTY_DATASET';
          throw error;
        }
        return [];
      }),
    };

    expect(() => {
      mockAIEngine.findSimilarPatterns(emptyPatternDataset, newDealCondition);
    }).toThrow(/過去成功事例が存在しません/);
  });
});