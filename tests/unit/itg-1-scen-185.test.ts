import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { convertProcessStandardToRequirements } from '../../src/logic/it-1';

describe('営業プロセス標準書の要件仕様変換機能', () => {
  // SCEN-185: [error] 営業プロセス標準書の要件仕様変換機能 - プロセス各段階に対応する判定基準が存在しないとき、データ整合性エラーが発生する
  test('should throw DataIntegrityException when judgment criteria for a process stage is missing', () => {
    const processStandardBookId = 'PSB-2024-001';
    const processStages = [
      {
        stageId: 'STAGE-001',
        stageName: 'リード獲得',
        sequenceNumber: 1,
        description: 'リード情報の取得と初期接触'
      },
      {
        stageId: 'STAGE-002',
        stageName: '商談化',
        sequenceNumber: 2,
        description: '顧客との初回商談実施'
      },
      {
        stageId: 'STAGE-003',
        stageName: '提案',
        sequenceNumber: 3,
        description: '商品・サービスの提案実施'
      },
      {
        stageId: 'STAGE-004',
        stageName: '受注',
        sequenceNumber: 4,
        description: '成約締結'
      }
    ];

    // 判定基準マスタ: 『提案』段階のみ削除
    const judgmentCriteria = [
      {
        criteriaId: 'CRIT-001',
        stageId: 'STAGE-001',
        stageName: 'リード獲得',
        criteriaName: '初期接触完了',
        evaluationRule: 'contact_completed = true',
        threshold: null
      },
      {
        criteriaId: 'CRIT-002',
        stageId: 'STAGE-002',
        stageName: '商談化',
        criteriaName: '初回商談実施',
        evaluationRule: 'first_meeting_completed = true',
        threshold: null
      },
      // STAGE-003 (提案) の判定基準は意図的に削除
      {
        criteriaId: 'CRIT-004',
        stageId: 'STAGE-004',
        stageName: '受注',
        criteriaName: '成約実績登録',
        evaluationRule: 'contract_amount > 0',
        threshold: 0
      }
    ];

    const input = {
      processStandardBookId,
      processStages,
      judgmentCriteria,
      dataItems: [],
      transitionRules: []
    };

    expect(() => convertProcessStandardToRequirements(input)).toThrow(/データ整合性エラー|段階|提案/);
  });
});