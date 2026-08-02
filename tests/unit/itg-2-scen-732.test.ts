import { describe, test, expect } from '@jest/globals';
import { calculateProposalCustomerFitScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-732
  test('提案資料と顧客ニーズの適合度スコア化機能 - 顧客ニーズがnullのときエラーが発生する', () => {
    const proposalData = {
      title: 'クラウド基盤の導入',
      category: 'インフラストラクチャ',
      budget: 5000000,
      timeline: '2024-Q2',
      details: 'エンタープライズ向けクラウド基盤構築プロジェクト'
    };

    const customerNeeds = null;

    expect(() => {
      calculateProposalCustomerFitScore(customerNeeds, proposalData);
    }).toThrow(/顧客ニーズ/);
  });
});