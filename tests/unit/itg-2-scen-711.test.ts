import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateProposalNeedsCompatibilityScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  let systemLogs: string[];

  beforeEach(() => {
    systemLogs = [];
    const originalLog = console.log;
    (global as any).captureLog = (message: string) => {
      systemLogs.push(message);
    };
  });

  afterEach(() => {
    delete (global as any).captureLog;
  });

  // SCEN-711
  test('提案資料の規模が空のとき、規模適合スコア計算が0を返却し、ログに未入力メッセージが記録される', () => {
    const proposal_data = {
      proposal_id: 'PROP-001',
      proposal_name: 'システム導入提案',
      proposal_scale: '',
      proposal_budget: 5000000,
      proposal_timeline: 6,
    };

    const customer_needs = {
      customer_id: 'CUST-001',
      industry: '製造業',
      required_scale: '中規模',
      required_budget_max: 10000000,
      required_timeline_month: 9,
    };

    const compatibility_score = calculateProposalNeedsCompatibilityScore(
      proposal_data,
      customer_needs,
      (global as any).captureLog
    );

    expect(compatibility_score).toBe(0);
    expect(systemLogs).toContain('規模情報が未入力のため評価不可');
  });
});