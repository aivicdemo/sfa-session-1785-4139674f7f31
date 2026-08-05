import { describe, test, expect, beforeEach } from '@jest/globals';
import { analyzeBehaviorPatterns } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1186
  test('行動パターンデータが空配列のとき処理がエラーになる', () => {
    const empty_behavior_data: typeof import('../../src/logic/it-1-br-2-1-1-1').BehaviorPattern[] = [];

    expect(() => {
      analyzeBehaviorPatterns(empty_behavior_data);
    }).toThrow(/行動パターンデータが空|ERR_EMPTY_BEHAVIOR_DATA/);
  });
});