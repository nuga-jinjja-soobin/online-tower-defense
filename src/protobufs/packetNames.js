export const packetNames = {
  gameData: {
    Position: 'gameData.Position',
    BaseData: 'gameData.BaseData',
    TowerData: 'gameData.TowerData',
    MonsterData: 'gameData.MonsterData',
    InitialGameState: 'gameData.InitialGameState',
    GameState: 'gameData.GameState',
  },
  auth: {
    C2SRegisterRequest: 'auth.C2SRegisterRequest',
    S2CRegisterResponse: 'auth.S2CRegisterResponse',
    C2SLoginRequest: 'auth.C2SLoginRequest',
    S2CLoginResponse: 'auth.S2CLoginResponse',
  },
  match: {
    C2SMatchRequest: 'match.C2SMatchRequest',
    S2CMatchStartNotification: 'match.S2CMatchStartNotification',
    S2CStateSyncNotification: 'match.S2CStateSyncNotification',
  },
  combat: {
    C2STowerPurchaseRequest: 'combat.C2STowerPurchaseRequest',
    S2CTowerPurchaseResponse: 'combat.S2CTowerPurchaseResponse',
    S2CAddEnemyTowerNotification: 'combat.S2CAddEnemyTowerNotification',
    C2SSpawnMonsterRequest: 'combat.C2SSpawnMonsterRequest',
    S2CSpawnMonsterResponse: 'combat.S2CSpawnMonsterResponse',
    S2CSpawnEnemyMonsterNotification: 'combat.S2CSpawnEnemyMonsterNotification',
    C2STowerAttackRequest: 'combat.C2STowerAttackRequest',
    S2CEnemyTowerAttackNotification: 'combat.S2CEnemyTowerAttackNotification',
    C2SMonsterAttackBaseRequest: 'combat.C2SMonsterAttackBaseRequest',
  },
  gameEvent: {
    S2CUpdateBaseHPNotification: 'gameEvent.S2CUpdateBaseHPNotification',
    S2CGameOverNotification: 'gameEvent.S2CGameOverNotification',
    C2SGameEndRequest: 'gameEvent.C2SGameEndRequest',
    C2SMonsterDeathNotification: 'gameEvent.C2SMonsterDeathNotification',
    S2CEnemyMonsterDeathNotification: 'gameEvent.S2CEnemyMonsterDeathNotification',
  },
  packet: {
    GamePacket: 'packet.GamePacket',
    CommonPacket: 'packet.CommonPacket',
  },
};
