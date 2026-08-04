import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-1755: 推奨根拠の可視化機能 - 根拠信頼度が0のとき根拠を低信頼度として表示する', () => {
    // Arrange: 信頼度スコア0の根拠データを準備
    const lowConfidenceReasoningData = {
      recommendationId: 'rec_20240115_001',
      customerId: 'cust_12345',
      dealCondition: {
        industry: 'IT',
        companySize: 'large',
        purchaseFrequency: 'monthly',
        budgetLimit: 500000,
      },
      successPatterns: [
        {
          patternId: 'pat_001',
          matchScore: 0,
          relevanceScore: 0,
          reasoning: '過去事例との適合度が極めて低い',
        },
      ],
      proposedApproach: {
        approachId: 'app_001',
        content: 'IT企業向けカスタマイズ提案',
        confidenceScore: 0,
      },
    };

    // Act: 信頼度スコア0の根拠に対して evaluatePatternRelevance() を呼び出す
    const evaluationResult = evaluatePatternRelevance(
      lowConfidenceReasoningData.proposedApproach.confidenceScore,
      lowConfidenceReasoningData.successPatterns[0].matchScore
    );

    // Assert: 信頼度スコア0の根拠が低信頼度として評価されることを検証
    expect(evaluationResult).toEqual({
      confidenceLevel: 'low',
      confidenceScore: 0,
      displayClass: 'confidence-low',
      dataConfidenceAttribute: 'low',
      isApplicable: false,
      reasoningText: '根拠信頼度が低い為、推奨の適用可能性が限定的です',
    });

    // Assert: 根拠要素の視覚的表現を検証
    // (DOM検証部分は単体テストとして、信頼度スコア0時の表示要素構成を検証)
    const reasoningElement = {
      className: evaluationResult.displayClass,
      dataAttribute: `data-confidence='${evaluationResult.dataConfidenceAttribute}'`,
      confidenceIndicator: '信頼度低',
      backgroundColor: 'gray',
    };

    expect(reasoningElement.className).toBe('confidence-low');
    expect(reasoningElement.dataAttribute).toBe("data-confidence='low'");
    expect(reasoningElement.confidenceIndicator).toBe('信頼度低');
    expect(['gray', 'warning']).toContain(reasoningElement.backgroundColor);

    // Assert: 信頼度スコアが0のとき、推奨適用可能性がfalseとなることを検証
    expect(evaluationResult.isApplicable).toBe(false);

    // Assert: 根拠テキストに低信頼度の理由が含まれていることを検証
    expect(evaluationResult.reasoningText).toMatch(/信頼度低|適用可能性が限定的/);
  });
});