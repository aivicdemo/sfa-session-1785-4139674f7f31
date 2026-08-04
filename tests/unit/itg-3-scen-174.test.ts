import { DataValidationService } from '../../src/logic/it-1-br-3-3-2-1';
import { InferenceExecutor } from '../../src/logic/it-1-br-3-3-2-1';
import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-3-2-1';

describe('Learning Data Validation and Inference Execution Permission', () => {
  // SCEN-174
  test('should permit inference execution when data volume equals minimum requirement and quality score equals passing threshold', () => {
    const MIN_DATA_VOLUME = 1000;
    const QUALITY_PASSING_THRESHOLD = 0.70;
    const EXACT_DATA_VOLUME = 1000;
    const EXACT_QUALITY_SCORE = 0.70;

    const learning_data_set = Array.from({ length: EXACT_DATA_VOLUME }, (_, i) => ({
      transaction_id: `txn_${i + 1}`,
      customer_id: `cust_${Math.floor(i / 10) + 1}`,
      deal_stage: ['initial', 'proposal', 'negotiation', 'closing'][i % 4],
      deal_result: i % 2 === 0 ? 'won' : 'lost',
      created_at: new Date('2024-01-15T10:00:00Z').toISOString(),
    }));

    const quality_check_result = {
      data_volume_valid: true,
      quality_score: EXACT_QUALITY_SCORE,
      quality_score_valid: true,
    };

    const validation_service = new DataValidationService();
    const validation_result = validation_service.validateLearningData(
      learning_data_set,
      MIN_DATA_VOLUME,
      QUALITY_PASSING_THRESHOLD
    );

    expect(validation_result.data_volume_check).toBe(true);
    expect(validation_result.quality_score_check).toBe(true);
    expect(validation_result.quality_score).toBe(0.70);

    const inference_executor = new InferenceExecutor();
    const ai_engine = new AIRecommendationEngine();

    const can_execute = inference_executor.canExecuteInference(validation_result);

    expect(can_execute).toBe(true);

    const recommended_approach = ai_engine.generateRecommendation({
      customer_id: 'cust_001',
      customer_industry: 'manufacturing',
      customer_size: 'large',
      deal_value: 500000,
      deal_stage: 'proposal',
    });

    expect(recommended_approach).toBeDefined();
    expect(recommended_approach.approach_type).toBeDefined();
    expect(recommended_approach.confidence_score).toBeGreaterThanOrEqual(0);
    expect(recommended_approach.confidence_score).toBeLessThanOrEqual(100);

    const execution_log = inference_executor.getExecutionLog();
    expect(execution_log).toMatch(/学習データ検証完了/);
    expect(execution_log).toMatch(/データ量=1000件/);
    expect(execution_log).toMatch(/最小要件=1000件/);
    expect(execution_log).toMatch(/品質スコア=0.70\/1.0/);
    expect(execution_log).toMatch(/合格ライン=0.70/);
    expect(execution_log).toMatch(/推論実行条件を満たすため/);
    expect(execution_log).toMatch(/推論を許可します/);
  });
});