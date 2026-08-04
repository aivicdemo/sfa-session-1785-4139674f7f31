import { RecommendationReasoningClassifier } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1748
  test('根拠ウェイトが1のとき根拠を最高優先度で分類する', () => {
    const mockReasons = [
      {
        reasonId: 'reason_001',
        description: '過去成功案件との類似度が高い',
        weightValue: 0.3,
        dataSource: 'historical_patterns',
      },
      {
        reasonId: 'reason_002',
        description: '顧客の購買周期が最適タイミング',
        weightValue: 0.7,
        dataSource: 'customer_signals',
      },
      {
        reasonId: 'reason_003',
        description: '成功パターンと完全一致',
        weightValue: 1.0,
        dataSource: 'success_template',
      },
    ];

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn((reason) => {
        return `根拠: ${reason.description}`;
      }),
    };

    const classifier = new RecommendationReasoningClassifier(mockAIEngine);
    const classifiedReasons = classifier.classifyByWeight(mockReasons);

    expect(classifiedReasons).toHaveLength(3);

    expect(classifiedReasons[0]).toEqual(
      expect.objectContaining({
        reasonId: 'reason_003',
        weightValue: 1.0,
        priority: 'HIGHEST',
      })
    );

    expect(classifiedReasons[1]).toEqual(
      expect.objectContaining({
        reasonId: 'reason_002',
        weightValue: 0.7,
        priority: 'HIGH',
      })
    );

    expect(classifiedReasons[2]).toEqual(
      expect.objectContaining({
        reasonId: 'reason_001',
        weightValue: 0.3,
        priority: 'MEDIUM',
      })
    );

    const priorityOrder = classifiedReasons.map((r) => r.priority);
    expect(priorityOrder).toEqual(['HIGHEST', 'HIGH', 'MEDIUM']);
  });
});