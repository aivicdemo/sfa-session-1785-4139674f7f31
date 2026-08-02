import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateProposalContent } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  let originalDate: typeof Date;

  beforeEach(() => {
    originalDate = Date;
    const fixed_today = new Date('2024-01-15T00:00:00Z');
    global.Date = class extends Date {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(fixed_today.getTime());
        } else {
          super(...args);
        }
      }
      static now() {
        return fixed_today.getTime();
      }
    } as any;
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  // SCEN-943
  test('提案日付が本日のとき検証に成功する', () => {
    const today = '2024-01-15';
    const proposal_content = {
      proposal_date: today,
      customer_id: 'CUST001',
      proposal_amount: 500000,
      proposal_description: 'Standard proposal'
    };

    const result = validateProposalContent(proposal_content);

    expect(result.validation_status).toBe('成功');
    expect(result.error_message).toBe('');
    expect(result.proposal_date_validation).toBe('OK');
  });
});