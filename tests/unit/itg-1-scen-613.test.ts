import { describe, test, expect } from '@jest/globals';
import { analyzeProposalPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-613
  test('提案内容データが空オブジェクトのときエラーになる', () => {
    const emptyProposalData = {};

    expect(() => {
      analyzeProposalPatterns(emptyProposalData);
    }).toThrow(/INVALID_PROPOSAL_DATA/);
  });
});