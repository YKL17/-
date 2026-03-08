import { GameEvent, GameState } from './types';

// Helper to add log
const addLog = (state: GameState, msg: string) => {
  state.log.unshift(`[Year ${state.year} Month ${state.month}] ${msg}`);
};

export const EVENTS: Record<string, GameEvent> = {
  // --- START ---
  'START_GAME': {
    id: 'START_GAME',
    title: '转生斗罗大陆',
    description: '你缓缓睁开眼睛，发现自己来到了一个陌生的世界。这里没有魔法，没有斗气，没有武术，却有神奇的武魂。这里是斗罗大陆。你出生在...',
    type: 'Story',
    options: [
      {
        text: '圣魂村 (平民开局)',
        action: (state) => {
          state.name = "唐银"; // Default
          state.currentLocation = "圣魂村";
          state.attributes.spiritPower = 1;
          state.flags['background_villager'] = true;
          addLog(state, "你出生在圣魂村，隔壁住着一个叫唐三的小孩。");
        },
        nextEventId: 'AWAKENING_CEREMONY'
      },
      {
        text: '武魂城 (武魂殿开局)',
        action: (state) => {
          state.name = "千羽"; // Default
          state.currentLocation = "武魂城";
          state.attributes.spiritPower = 5;
          state.flags['background_spirit_hall'] = true;
          state.faction = 'SpiritHall';
          addLog(state, "你出生在武魂城，从小接受武魂殿的精英教育。");
        },
        nextEventId: 'AWAKENING_CEREMONY'
      }
    ]
  },

  // --- AWAKENING ---
  'AWAKENING_CEREMONY': {
    id: 'AWAKENING_CEREMONY',
    title: '武魂觉醒仪式',
    description: '六岁那年，武魂殿的执事为你进行武魂觉醒。随着金光闪耀，你的右手掌心浮现出了...',
    type: 'Story',
    options: [
      {
        text: '器武魂：昊天锤 (变异)',
        action: (state) => {
          state.martialSoul = "暗金昊天锤";
          state.attributes.strength += 20;
          state.attributes.spiritPower = 10; // Innate full spirit power
          addLog(state, "你觉醒了变异武魂——暗金昊天锤，先天满魂力！");
        },
        nextEventId: 'ACADEMY_CHOICE'
      },
      {
        text: '兽武魂：蓝电霸王龙',
        action: (state) => {
          state.martialSoul = "蓝电霸王龙";
          state.attributes.strength += 15;
          state.attributes.spiritPower = 9;
          addLog(state, "你觉醒了顶级兽武魂——蓝电霸王龙！");
        },
        nextEventId: 'ACADEMY_CHOICE'
      },
      {
        text: '本体武魂：灵眸',
        action: (state) => {
          state.martialSoul = "灵眸";
          state.attributes.intelligence += 20;
          state.attributes.spiritPower = 8;
          addLog(state, "你觉醒了稀有的本体武魂——灵眸！");
        },
        nextEventId: 'ACADEMY_CHOICE'
      }
    ]
  },

  // --- ACADEMY ---
  'ACADEMY_CHOICE': {
    id: 'ACADEMY_CHOICE',
    title: '初级魂师学院',
    description: '觉醒武魂后，你需要选择一所学院开始你的魂师生涯。',
    type: 'Story',
    options: [
      {
        text: '诺丁学院 (接触唐三/小舞)',
        condition: (state) => state.flags['background_villager'],
        action: (state) => {
          state.currentLocation = "诺丁学院";
          state.relationships['Xiao Wu'] = { name: '小舞', affection: 10, status: 'Acquaintance', faction: 'Shrek', description: '活泼可爱的兔耳少女' };
          state.relationships['Tang San'] = { name: '唐三', affection: 10, status: 'Acquaintance', faction: 'Shrek', description: '沉稳的少年' };
          addLog(state, "你入学诺丁学院，结识了工读生唐三和小舞。");
        },
        nextEventId: 'MAIN_LOOP'
      },
      {
        text: '武魂殿学院 (接触胡列娜)',
        condition: (state) => state.flags['background_spirit_hall'],
        action: (state) => {
          state.currentLocation = "武魂殿学院";
          state.relationships['Hu Liena'] = { name: '胡列娜', affection: 10, status: 'Acquaintance', faction: 'SpiritHall', description: '妖魅的武魂殿圣女' };
          addLog(state, "你入学武魂殿学院，成为了黄金一代的预备役。");
        },
        nextEventId: 'MAIN_LOOP'
      },
      {
        text: '天斗皇家学院',
        action: (state) => {
          state.currentLocation = "天斗城";
          addLog(state, "你前往天斗皇家学院，这里贵族云集。");
        },
        nextEventId: 'MAIN_LOOP'
      }
    ]
  },

  // --- MAIN LOOP PLACEHOLDER ---
  'MAIN_LOOP': {
    id: 'MAIN_LOOP',
    title: '新的开始',
    description: '你的魂师之路正式开始了。每个月你都可以安排自己的行动。',
    type: 'Story',
    options: [
      {
        text: '开始行动',
        action: () => {},
      }
    ]
  },

  // --- CULTIVATION EVENTS ---
  'CULTIVATION_NORMAL': {
    id: 'CULTIVATION_NORMAL',
    title: '冥想修炼',
    description: '你盘膝而坐，运转魂力。',
    type: 'Cultivation',
    options: [
      {
        text: '继续',
        action: (state) => {
          const gain = Math.floor(Math.random() * 2) + 1;
          state.attributes.spiritPower += gain;
          addLog(state, `经过一个月的苦修，你的魂力提升了 ${gain} 点。`);
        }
      }
    ]
  },
  'CULTIVATION_BREAKTHROUGH': {
    id: 'CULTIVATION_BREAKTHROUGH',
    title: '瓶颈突破',
    description: '你的魂力已经达到了瓶颈，必须猎杀魂兽获取魂环才能继续晋升！',
    type: 'Cultivation',
    options: [
      {
        text: '前往猎魂森林',
        action: (state) => {
          state.currentLocation = "猎魂森林";
        },
        nextEventId: 'HUNT_SPIRIT_BEAST'
      }
    ]
  },

  // --- HUNTING ---
  'HUNT_SPIRIT_BEAST': {
    id: 'HUNT_SPIRIT_BEAST',
    title: '猎杀魂兽',
    description: '你在森林中寻找合适的魂兽。突然，一只魂兽窜了出来！',
    type: 'Battle',
    options: [
      {
        text: '曼陀罗蛇 (400年)',
        action: (state) => {
           // Simple battle logic
           if (state.attributes.strength > 10) {
               state.spiritRings.push("曼陀罗蛇 (400年) - 毒素/麻痹");
               state.rank += 1;
               state.attributes.spiritPower += 5;
               addLog(state, "你成功击杀了曼陀罗蛇，吸收了第一魂环！正式成为魂师！");
           } else {
               state.attributes.health -= 30;
               addLog(state, "你未能击败曼陀罗蛇，受了重伤逃跑了。");
           }
        }
      },
      {
        text: '孤竹 (600年)',
        action: (state) => {
            state.spiritRings.push("孤竹 (600年) - 韧性/恢复");
            state.rank += 1;
            state.attributes.spiritPower += 6;
            addLog(state, "你吸收了孤竹魂环，身体变得更加坚韧。");
        }
      }
    ]
  },

  // --- ROMANCE: XIAO WU ---
  'MEET_XIAO_WU': {
    id: 'MEET_XIAO_WU',
    title: '偶遇小舞',
    description: '你在校园里看到小舞正在和人切磋。她灵动的身姿吸引了你的注意。',
    type: 'Romance',
    options: [
      {
        text: '上前搭话',
        action: (state) => {
          if (!state.relationships['Xiao Wu']) {
             state.relationships['Xiao Wu'] = { name: '小舞', affection: 0, status: 'Acquaintance', faction: 'Shrek', description: '活泼可爱的兔耳少女' };
          }
          state.relationships['Xiao Wu'].affection += 5;
          addLog(state, "你和小舞聊了聊胡萝卜的话题，她看起来很开心。");
        }
      },
      {
        text: '提出切磋',
        action: (state) => {
           if (state.attributes.strength > 20) {
               state.relationships['Xiao Wu'].affection += 10;
               addLog(state, "你击败了小舞，她对你的实力表示认可。");
           } else {
               state.relationships['Xiao Wu'].affection += 2;
               addLog(state, "你被小舞摔了个狗吃屎，她嘲笑了你一番。");
           }
        }
      }
    ]
  },

  // --- FACTION: SPIRIT HALL ---
  'JOIN_SPIRIT_HALL': {
    id: 'JOIN_SPIRIT_HALL',
    title: '武魂殿的招揽',
    description: '由于你出色的表现，武魂殿的主教找到了你，邀请你正式加入武魂殿核心。',
    type: 'Story',
    options: [
      {
        text: '加入武魂殿 (目标：统一大陆)',
        action: (state) => {
          state.faction = 'SpiritHall';
          addLog(state, "你宣誓效忠武魂殿。比比东教皇对你寄予厚望。");
        }
      },
      {
        text: '拒绝 (保持中立)',
        action: (state) => {
          state.faction = 'Neutral';
          addLog(state, "你婉拒了武魂殿的邀请，决定走自己的路。");
        }
      }
    ]
  },

  // --- ENDINGS ---
  'ENDING_GOD': {
    id: 'ENDING_GOD',
    title: '结局：成神',
    description: '你突破了百级大关，继承了神位，飞升神界，留下了永恒的传说。',
    type: 'Story',
    options: [{ text: '重新开始', action: () => {}, nextEventId: 'START_GAME' }]
  },
  'ENDING_TITLE_DOULUO': {
    id: 'ENDING_TITLE_DOULUO',
    title: '结局：封号斗罗',
    description: '你成为了一代封号斗罗，威震大陆，虽然没有成神，但也是当世最强者之一。',
    type: 'Story',
    options: [{ text: '重新开始', action: () => {}, nextEventId: 'START_GAME' }]
  },
  'ENDING_ORDINARY': {
    id: 'ENDING_ORDINARY',
    title: '结局：泯然众人',
    description: '你的天赋有限，最终止步于魂圣，在大陆的一角安度晚年。',
    type: 'Story',
    options: [{ text: '重新开始', action: () => {}, nextEventId: 'START_GAME' }]
  }
};
