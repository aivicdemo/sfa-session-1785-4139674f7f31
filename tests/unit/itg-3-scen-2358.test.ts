import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-2-1-1';

interface RecommendationRecord {
  id: string;
  customer_id: string;
  deal_condition_id: string;
  proposal_approach: string;
  reasoning_id: string;
  evaluation_score: number;
  created_at: string;
}

interface AIRecommendationEngineStub {
  generateRecommendation: jest.Mock;
}

interface HistoryStore {
  records: RecommendationRecord[];
  queryAll: () => RecommendationRecord[];
  add: (record: Omit<RecommendationRecord, 'id' | 'created_at'>, createdAt: string) => void;
}

describe('AIエージェント推奨内容の根拠表示機能', () => {
  let aiEngineStub: AIRecommendationEngineStub;
  let historyStore: HistoryStore;
  let recordIdCounter: number;

  beforeEach(() => {
    recordIdCounter = 1;
    historyStore = {
      records: [],
      queryAll: function() {
        return this.records.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      },
      add: function(record: Omit<RecommendationRecord, 'id' | 'created_at'>, createdAt: string) {
        this.records.push({
          id: `record_${recordIdCounter}`,
          ...record,
          created_at: createdAt
        });
        recordIdCounter += 1;
      }
    };

    aiEngineStub = {
      generateRecommendation: jest.fn()
    };

    const sharedRecommendation = {
      proposal_approach: 'consultation_focused_approach',
      reasoning_id: 'reason_2358_001',
      evaluation_score: 82
    };

    aiEngineStub.generateRecommendation.mockResolvedValue(sharedRecommendation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('SCEN-2358: 同一の推奨内容が複数回記録されるとき各回ごとにレコードが追加される', async () => {
    const customerId = 'customer_A';
    const dealConditionId = 'condition_X';

    const timestamp1 = '2024-02-15T09:00:00Z';
    const timestamp2 = '2024-02-15T09:15:30Z';
    const timestamp3 = '2024-02-15T09:30:45Z';

    const recommendation1 = await aiEngineStub.generateRecommendation({
      customer_id: customerId,
      deal_condition_id: dealConditionId
    });

    recordRecommendationHistory({
      customer_id: customerId,
      deal_condition_id: dealConditionId,
      proposal_approach: recommendation1.proposal_approach,
      reasoning_id: recommendation1.reasoning_id,
      evaluation_score: recommendation1.evaluation_score,
      created_at: timestamp1
    }, historyStore);

    const allRecords1 = historyStore.queryAll();
    expect(allRecords1).toHaveLength(1);
    expect(allRecords1[0].proposal_approach).toBe('consultation_focused_approach');
    expect(allRecords1[0].reasoning_id).toBe('reason_2358_001');
    expect(allRecords1[0].evaluation_score).toBe(82);

    const recommendation2 = await aiEngineStub.generateRecommendation({
      customer_id: customerId,
      deal_condition_id: dealConditionId
    });

    recordRecommendationHistory({
      customer_id: customerId,
      deal_condition_id: dealConditionId,
      proposal_approach: recommendation2.proposal_approach,
      reasoning_id: recommendation2.reasoning_id,
      evaluation_score: recommendation2.evaluation_score,
      created_at: timestamp2
    }, historyStore);

    const allRecords2 = historyStore.queryAll();
    expect(allRecords2).toHaveLength(2);

    expect(allRecords2[0].proposal_approach).toBe(allRecords2[1].proposal_approach);
    expect(allRecords2[0].reasoning_id).toBe(allRecords2[1].reasoning_id);
    expect(allRecords2[0].evaluation_score).toBe(allRecords2[1].evaluation_score);

    expect(allRecords2[0].created_at).toBe(timestamp1);
    expect(allRecords2[1].created_at).toBe(timestamp2);
    expect(new Date(allRecords2[0].created_at).getTime()).toBeLessThan(new Date(allRecords2[1].created_at).getTime());

    const recommendation3 = await aiEngineStub.generateRecommendation({
      customer_id: customerId,
      deal_condition_id: dealConditionId
    });

    recordRecommendationHistory({
      customer_id: customerId,
      deal_condition_id: dealConditionId,
      proposal_approach: recommendation3.proposal_approach,
      reasoning_id: recommendation3.reasoning_id,
      evaluation_score: recommendation3.evaluation_score,
      created_at: timestamp3
    }, historyStore);

    const allRecords3 = historyStore.queryAll();
    expect(allRecords3).toHaveLength(3);

    expect(allRecords3[0].proposal_approach).toBe(allRecords3[1].proposal_approach);
    expect(allRecords3[1].proposal_approach).toBe(allRecords3[2].proposal_approach);
    expect(allRecords3[0].reasoning_id).toBe(allRecords3[1].reasoning_id);
    expect(allRecords3[1].reasoning_id).toBe(allRecords3[2].reasoning_id);
    expect(allRecords3[0].evaluation_score).toBe(allRecords3[1].evaluation_score);
    expect(allRecords3[1].evaluation_score).toBe(allRecords3[2].evaluation_score);

    expect(new Date(allRecords3[0].created_at).getTime()).toBeLessThan(new Date(allRecords3[1].created_at).getTime());
    expect(new Date(allRecords3[1].created_at).getTime()).toBeLessThan(new Date(allRecords3[2].created_at).getTime());

    expect(allRecords3[0].id).not.toBe(allRecords3[1].id);
    expect(allRecords3[1].id).not.toBe(allRecords3[2].id);
  });
});