import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1625: 推奨妥当性スコア算出機能 - 購買履歴1件と提案内容1件から妥当性スコアが0～100で算出される', () => {
    // Arrange
    const purchase_history = {
      customer_id: 'CUST-001',
      purchase_date: '2024-01-15T10:30:00Z',
      product_category: 'Software',
      purchase_amount: 150000,
    };

    const proposal_content = {
      proposal_id: 'PROP-001',
      proposal_date: '2024-01-20T09:00:00Z',
      proposed_product: 'Software Suite',
      proposal_reason: 'Previous category match',
    };

    const mock_engine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(45),
    };

    // Act
    const result = evaluatePatternRelevance(
      purchase_history,
      proposal_content,
      mock_engine
    );

    // Assert
    expect(mock_engine.evaluatePatternRelevance).toHaveBeenCalledWith(
      purchase_history,
      proposal_content
    );
    expect(result).toBe(45);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
    expect(Number.isInteger(result)).toBe(true);
  });
});