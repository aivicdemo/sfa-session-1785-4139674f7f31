import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-971
  test('提案内容配列が 0 件のとき、根拠マッピング処理は進行するが空配列が返される', () => {
    const emptyProposalContent = [];

    const result = explainRecommendationReasoning(emptyProposalContent);

    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});