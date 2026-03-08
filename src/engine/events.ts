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
          state.flags['origin_villager'] = true;
          addLog(state, "你出生在圣魂村，隔壁住着一个叫唐三的小孩。");
        },
        nextEventId: 'AWAKENING_CEREMONY'
      },
      {
        text: '武魂城 (世家开局)',
        action: (state) => {
          state.name = "千羽"; // Default
          state.currentLocation = "武魂城";
          state.attributes.spiritPower = 5;
          state.flags['origin_noble'] = true;
          addLog(state, "你出生在武魂城，从小接受精英教育。");
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
        text: '器武魂：破魂枪 (攻击)',
        condition: (state) => !!state.flags['origin_villager'],
        action: (state) => {
          state.martialSoul = "破魂枪";
          state.attributes.strength += 25;
          state.attributes.spiritPower = 8; 
          addLog(state, "你觉醒了强攻系器武魂——破魂枪，先天魂力8级！");
        },
        nextEventId: 'ACADEMY_CHOICE'
      },
      {
        text: '兽武魂：大力猩猩 (力量)',
        condition: (state) => !!state.flags['origin_villager'],
        action: (state) => {
          state.martialSoul = "大力猩猩";
          state.attributes.strength += 30;
          state.attributes.spiritPower = 7;
          addLog(state, "你觉醒了强力兽武魂——大力猩猩，先天魂力7级！");
        },
        nextEventId: 'ACADEMY_CHOICE'
      },
      {
        text: '神级武魂：六翼天使 (神圣)',
        condition: (state) => !!state.flags['origin_noble'],
        action: (state) => {
          state.martialSoul = "六翼天使";
          state.attributes.intelligence += 20;
          state.attributes.spiritPower = 20; // Innate level 20
          addLog(state, "天降异象！你觉醒了传说中的神级武魂——六翼天使，先天满魂力20级！");
        },
        nextEventId: 'ACADEMY_CHOICE'
      },
      {
        text: '顶级武魂：黄金鳄王 (防御)',
        condition: (state) => !!state.flags['origin_noble'],
        action: (state) => {
          state.martialSoul = "黄金鳄王";
          state.attributes.strength += 25;
          state.attributes.spiritPower = 10;
          addLog(state, "你觉醒了顶级兽武魂——黄金鳄王，先天满魂力10级！");
        },
        nextEventId: 'ACADEMY_CHOICE'
      }
    ]
  },

  // --- ACADEMY ---
  'ACADEMY_CHOICE': {
    id: 'ACADEMY_CHOICE',
    title: '初级魂师学院',
    description: '觉醒武魂后，你需要选择一所学院开始你的魂师生涯。这将决定你初期的朋友圈。',
    type: 'Story',
    options: [
      {
        text: '诺丁学院 (接触唐三/小舞)',
        action: (state) => {
          state.currentLocation = "诺丁学院";
          state.flags['school_notting'] = true;
          state.relationships['Xiao Wu'] = { name: '小舞', affection: 10, status: 'Acquaintance', faction: 'Shrek', description: '活泼可爱的兔耳少女' };
          state.relationships['Tang San'] = { name: '唐三', affection: 10, status: 'Acquaintance', faction: 'Shrek', description: '沉稳的少年' };
          addLog(state, "你入学诺丁学院，结识了工读生唐三和小舞。");
        },
        nextEventId: 'MAIN_LOOP'
      },
      {
        text: '武魂殿学院 (接触胡列娜)',
        action: (state) => {
          state.currentLocation = "武魂殿学院";
          state.flags['school_spirithall'] = true;
          state.relationships['Hu Liena'] = { name: '胡列娜', affection: 10, status: 'Acquaintance', faction: 'SpiritHall', description: '妖魅的武魂殿圣女' };
          state.relationships['Xie Yue'] = { name: '邪月', affection: 5, status: 'Acquaintance', faction: 'SpiritHall', description: '黄金一代领军人物' };
          addLog(state, "你入学武魂殿学院，成为了黄金一代的预备役。");
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
        text: '前往猎魂森林 (初级)',
        condition: (state) => state.attributes.rank < 30,
        action: (state) => {
          state.currentLocation = "猎魂森林";
        },
        nextEventId: 'HUNT_SPIRIT_BEAST_LOW'
      },
      {
        text: '前往星斗大森林 (高级)',
        condition: (state) => state.attributes.rank >= 30,
        action: (state) => {
          state.currentLocation = "星斗大森林";
        },
        nextEventId: 'HUNT_SPIRIT_BEAST_HIGH'
      }
    ]
  },

  // --- HUNTING LOW LEVEL ---
  'HUNT_SPIRIT_BEAST_LOW': {
    id: 'HUNT_SPIRIT_BEAST_LOW',
    title: '猎杀魂兽 (初级)',
    description: '你在猎魂森林中寻找合适的魂兽。突然，一只魂兽窜了出来！',
    type: 'Battle',
    options: [
      {
        text: '曼陀罗蛇 (400年)',
        action: (state) => {
           // Simple battle logic
           if (state.attributes.strength > 10) {
               state.spiritRings.push("曼陀罗蛇 (400年) - 毒素/麻痹");
               state.attributes.rank += 1; // Break through rank
               state.attributes.spiritPower += 1; // Bonus from ring
               addLog(state, "你成功击杀了曼陀罗蛇，吸收了魂环！突破瓶颈！");
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
            state.attributes.rank += 1;
            state.attributes.spiritPower += 1;
            addLog(state, "你吸收了孤竹魂环，身体变得更加坚韧。突破瓶颈！");
        }
      }
    ]
  },

  // --- HUNTING HIGH LEVEL ---
  'HUNT_SPIRIT_BEAST_HIGH': {
    id: 'HUNT_SPIRIT_BEAST_HIGH',
    title: '猎杀魂兽 (高级)',
    description: '星斗大森林危机四伏。你小心翼翼地前行...',
    type: 'Battle',
    options: [
      {
        text: '人面魔蛛 (2000年)',
        action: (state) => {
           if (state.attributes.strength > 50) {
               state.spiritRings.push("人面魔蛛 (2000年) - 蛛网束缚");
               state.attributes.rank += 1;
               state.attributes.spiritPower += 2;
               addLog(state, "你击杀了人面魔蛛，获得了强力控制魂技！");
           } else {
               state.attributes.health -= 50;
               addLog(state, "人面魔蛛太强了，你险些丧命！");
           }
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

  // --- ROMANCE: HU LIENA ---
  'MEET_HU_LIENA': {
    id: 'MEET_HU_LIENA',
    title: '偶遇胡列娜',
    description: '你在武魂殿学院的训练场看到了胡列娜。她正在练习魅惑技能。',
    type: 'Romance',
    options: [
      {
        text: '抵抗魅惑',
        action: (state) => {
          if (!state.relationships['Hu Liena']) {
             state.relationships['Hu Liena'] = { name: '胡列娜', affection: 0, status: 'Acquaintance', faction: 'SpiritHall', description: '妖魅的武魂殿圣女' };
          }
          if (state.attributes.intelligence > 30) {
              state.relationships['Hu Liena'].affection += 8;
              addLog(state, "你成功抵抗了胡列娜的魅惑，她对你产生了兴趣。");
          } else {
              addLog(state, "你被迷得神魂颠倒，出尽了洋相。");
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
  },

  // --- RANDOM: WEALTH ---
  'RANDOM_FIND_GOLD': {
    id: 'RANDOM_FIND_GOLD',
    title: '意外之财',
    description: '你在走路时踢到了一个硬物，低头一看，竟然是一袋金魂币！',
    type: 'Random',
    trigger: () => true,
    options: [
      {
        text: '捡起来',
        action: (state) => {
          const amount = Math.floor(Math.random() * 50) + 10;
          state.attributes.wealth += amount;
          addLog(state, `你捡到了 ${amount} 金魂币。运气真好！`);
        }
      }
    ]
  },
  'RANDOM_MERCHANT': {
    id: 'RANDOM_MERCHANT',
    title: '神秘商人',
    description: '一个穿着黑袍的商人拦住了你，“小家伙，我这里有好东西，要看看吗？”',
    type: 'Random',
    trigger: (state) => state.attributes.wealth >= 100,
    options: [
      {
        text: '购买初级魂力药剂 (100金魂币)',
        action: (state) => {
          state.attributes.wealth -= 100;
          state.attributes.spiritPower += 2;
          addLog(state, "你服用了魂力药剂，魂力提升了！");
        }
      },
      {
        text: '离开',
        action: (state) => {
          addLog(state, "你摇了摇头，转身离开了。");
        }
      }
    ]
  },

  // --- RANDOM: CULTIVATION ---
  'RANDOM_EPIPHANY': {
    id: 'RANDOM_EPIPHANY',
    title: '顿悟',
    description: '看着落叶飘零，你心中突然产生了一丝明悟，对武魂的运用有了新的理解。',
    type: 'Random',
    trigger: (state) => state.attributes.intelligence >= 60,
    options: [
      {
        text: '抓住灵感',
        action: (state) => {
          state.attributes.spiritPower += 5;
          state.attributes.intelligence += 1;
          addLog(state, "你进入了顿悟状态，修为大涨！");
        }
      }
    ]
  },
  'RANDOM_DEVIATION': {
    id: 'RANDOM_DEVIATION',
    title: '走火入魔',
    description: '最近修炼过于急躁，你感觉体内魂力乱窜，经脉剧痛！',
    type: 'Random',
    trigger: (state) => state.attributes.spiritPower > 10,
    options: [
      {
        text: '强行压制',
        action: (state) => {
          if (state.attributes.strength > 40) {
             addLog(state, "你凭借强大的体魄压制了暴动的魂力，有惊无险。");
          } else {
             state.attributes.health -= 30;
             state.attributes.spiritPower = Math.max(0, state.attributes.spiritPower - 1);
             addLog(state, "你受了内伤，魂力倒退。");
          }
        }
      },
      {
        text: '散功保命',
        action: (state) => {
           state.attributes.spiritPower = Math.max(0, state.attributes.spiritPower - 2);
           addLog(state, "你散去部分魂力，保住了经脉。");
        }
      }
    ]
  },

  // --- RANDOM: ACADEMY ---
  'ACADEMY_TRAINING': {
    id: 'ACADEMY_TRAINING',
    title: '学院特训',
    description: '学院组织了一次野外拉练，这是一次锻炼体魄的好机会。',
    type: 'Random',
    trigger: (state) => state.currentLocation.includes('学院'),
    options: [
      {
        text: '全力以赴',
        action: (state) => {
          state.attributes.strength += 2;
          state.attributes.health -= 10;
          addLog(state, "你完成了特训，虽然很累，但身体更强壮了。");
        }
      },
      {
        text: '偷懒',
        action: (state) => {
          addLog(state, "你躲在树荫下睡了一觉。");
        }
      }
    ]
  },
  'ACADEMY_LIBRARY_EVENT': {
    id: 'ACADEMY_LIBRARY_EVENT',
    title: '图书馆偶遇',
    description: '你在图书馆查阅资料时，发现了一本关于武魂理论的笔记。',
    type: 'Random',
    trigger: (state) => state.currentLocation.includes('学院'),
    options: [
      {
        text: '研读笔记',
        action: (state) => {
          state.attributes.intelligence += 3;
          addLog(state, "你阅读了大师的笔记，受益匪浅。");
        }
      }
    ]
  },
  'ACADEMY_SENIOR': {
    id: 'ACADEMY_SENIOR',
    title: '学长的挑衅',
    description: '一个高年级学长挡住了你的去路，“新来的，懂不懂规矩？”',
    type: 'Random',
    trigger: (state) => state.currentLocation.includes('学院'),
    options: [
      {
        text: '反击',
        action: (state) => {
          if (state.attributes.strength > 30 && state.attributes.spiritPower > 15) {
             state.attributes.wealth += 10;
             addLog(state, "你狠狠教训了学长，他丢下10金魂币跑了。");
          } else {
             state.attributes.health -= 20;
             state.attributes.wealth = Math.max(0, state.attributes.wealth - 10);
             addLog(state, "你技不如人，被揍了一顿，还被抢了钱。");
          }
        }
      },
      {
        text: '忍气吞声',
        action: (state) => {
           state.attributes.wealth = Math.max(0, state.attributes.wealth - 5);
           addLog(state, "你交了5金魂币保护费，学长满意地走了。");
        }
      }
    ]
  },

  // --- RANDOM: CITY ---
  'CITY_THEFT': {
    id: 'CITY_THEFT',
    title: '小偷！',
    description: '你在逛街时，一只手悄悄伸向了你的钱袋。',
    type: 'Random',
    trigger: (state) => state.currentLocation.includes('城') || state.currentLocation === '武魂城',
    options: [
      {
        text: '抓住他',
        action: (state) => {
          if (state.attributes.strength > 30 || state.attributes.spiritPower > 15) {
             state.attributes.wealth += 20; // Reward
             addLog(state, "你抓住了小偷，卫兵奖励了你20金魂币。");
          } else {
             state.attributes.wealth = Math.max(0, state.attributes.wealth - 50);
             addLog(state, "小偷身手敏捷，不仅跑了，还顺走了你的钱袋！");
          }
        }
      }
    ]
  },
  'CITY_BEGGAR': {
    id: 'CITY_BEGGAR',
    title: '老乞丐',
    description: '路边一个衣衫褴褛的老乞丐向你乞讨。',
    type: 'Random',
    trigger: (state) => state.currentLocation.includes('城') || state.currentLocation === '武魂城',
    options: [
      {
        text: '施舍10金魂币',
        condition: (state) => state.attributes.wealth >= 10,
        action: (state) => {
          state.attributes.wealth -= 10;
          if (Math.random() < 0.3) {
              state.attributes.intelligence += 5;
              addLog(state, "老乞丐竟然是隐世高人！他指点了几句，你受益匪浅。");
          } else {
              addLog(state, "老乞丐连连道谢。");
          }
        }
      },
      {
        text: '无视',
        action: (state) => {
          addLog(state, "你匆匆走过。");
        }
      }
    ]
  },

  // --- RANDOM: WILD ---
  'WILD_HERB': {
    id: 'WILD_HERB',
    title: '发现灵草',
    description: '你在野外发现了一株散发着淡淡光芒的草药。',
    type: 'Random',
    trigger: (state) => !state.currentLocation.includes('城') && !state.currentLocation.includes('学院'),
    options: [
      {
        text: '采摘服用',
        action: (state) => {
          state.attributes.health = Math.min(state.attributes.health + 50, state.attributes.maxHealth);
          state.attributes.spiritPower += 1;
          addLog(state, "你服用了灵草，感觉浑身充满了力量。");
        }
      }
    ]
  },
  'WILD_BEAST': {
    id: 'WILD_BEAST',
    title: '野兽袭击',
    description: '一只凶猛的野狼挡住了你的去路！',
    type: 'Battle',
    trigger: (state) => !state.currentLocation.includes('城') && !state.currentLocation.includes('学院'),
    options: [
      {
        text: '战斗',
        action: (state) => {
          if (state.attributes.strength > 20) {
             addLog(state, "你轻松击败了野狼。");
          } else {
             state.attributes.health -= 15;
             addLog(state, "你费了一番功夫才赶走野狼，受了点轻伤。");
          }
        }
      },
      {
        text: '逃跑',
        action: (state) => {
           if (Math.random() < 0.5) {
               addLog(state, "你成功逃脱了。");
           } else {
               state.attributes.health -= 10;
               addLog(state, "你在逃跑时摔了一跤。");
           }
        }
      }
    ]
  },

  // --- ROMANCE: NING RONGRONG ---
  'MEET_NING_RONGRONG': {
    id: 'MEET_NING_RONGRONG',
    title: '偶遇宁荣荣',
    description: '你在索托城逛街时，看到一个穿着精致的少女正在和摊贩争执。',
    type: 'Romance',
    trigger: (state) => state.currentLocation === '索托城' || (state.currentLocation === '诺丁学院' && state.year >= 6),
    options: [
      {
        text: '帮她解围',
        action: (state) => {
          if (!state.relationships['Ning Rongrong']) {
             state.relationships['Ning Rongrong'] = { name: '宁荣荣', affection: 0, status: 'Acquaintance', faction: 'Shrek', description: '七宝琉璃宗的小公主' };
          }
          state.attributes.wealth -= 50;
          state.relationships['Ning Rongrong'].affection += 10;
          addLog(state, "你帮宁荣荣付了钱，她高傲地看了你一眼，说了声谢谢。");
        }
      },
      {
        text: '看热闹',
        action: (state) => {
          addLog(state, "你在一旁看了一会儿热闹，直到少女气呼呼地走了。");
        }
      }
    ]
  },
  'DATE_NING_RONGRONG': {
    id: 'DATE_NING_RONGRONG',
    title: '宁荣荣的邀请',
    description: '宁荣荣找到你，“喂，本小姐今天想去逛街，你来帮我拎包。”',
    type: 'Romance',
    trigger: (state) => state.relationships['Ning Rongrong'] && state.relationships['Ning Rongrong'].affection >= 20,
    options: [
      {
        text: '欣然前往',
        action: (state) => {
          state.relationships['Ning Rongrong'].affection += 5;
          state.attributes.wealth -= 20;
          addLog(state, "你陪宁荣荣逛了一整天，虽然累但她看起来很开心。");
        }
      },
      {
        text: '拒绝',
        action: (state) => {
          state.relationships['Ning Rongrong'].affection -= 2;
          addLog(state, "宁荣荣生气地跺了跺脚，“哼，不理你了！”");
        }
      }
    ]
  },

  // --- ROMANCE: ZHU ZHUQING ---
  'MEET_ZHU_ZHUQING': {
    id: 'MEET_ZHU_ZHUQING',
    title: '冰山少女',
    description: '你在树林里修炼时，发现一个黑衣少女正在拼命训练，神情冷漠。',
    type: 'Romance',
    trigger: (state) => state.currentLocation === '索托城' || (state.currentLocation === '诺丁学院' && state.year >= 6),
    options: [
      {
        text: '默默观察',
        action: (state) => {
          if (!state.relationships['Zhu Zhuqing']) {
             state.relationships['Zhu Zhuqing'] = { name: '朱竹清', affection: 0, status: 'Acquaintance', faction: 'Shrek', description: '高冷的幽冥灵猫' };
          }
          addLog(state, "你没有打扰她，只是在远处默默观察。");
        }
      },
      {
        text: '递上一瓶水',
        action: (state) => {
          if (!state.relationships['Zhu Zhuqing']) {
             state.relationships['Zhu Zhuqing'] = { name: '朱竹清', affection: 0, status: 'Acquaintance', faction: 'Shrek', description: '高冷的幽冥灵猫' };
          }
          state.relationships['Zhu Zhuqing'].affection += 5;
          addLog(state, "她接过水，冷冷地说了一声谢谢。");
        }
      }
    ]
  },
  'SPARRING_ZHU_ZHUQING': {
    id: 'SPARRING_ZHU_ZHUQING',
    title: '朱竹清的挑战',
    description: '朱竹清拦住了你，“听说你很强，跟我打一场。”',
    type: 'Romance',
    trigger: (state) => state.relationships['Zhu Zhuqing'] && state.relationships['Zhu Zhuqing'].affection >= 10,
    options: [
      {
        text: '接受挑战',
        action: (state) => {
          if (state.attributes.strength > state.attributes.spiritPower * 2) {
             state.relationships['Zhu Zhuqing'].affection += 10;
             addLog(state, "你展现了强大的实力，朱竹清眼中闪过一丝敬佩。");
          } else {
             state.relationships['Zhu Zhuqing'].affection += 2;
             addLog(state, "你输了，朱竹清摇了摇头，“你还不够强。”");
          }
        }
      }
    ]
  },

  // --- ROMANCE: QIAN RENXUE ---
  'MEET_QIAN_RENXUE': {
    id: 'MEET_QIAN_RENXUE',
    title: '太子雪清河',
    description: '你在天斗城偶遇了太子雪清河（千仞雪伪装）。他温文尔雅，邀请你品茶。',
    type: 'Romance',
    trigger: (state) => state.currentLocation === '天斗城' || state.faction === 'SpiritHall',
    options: [
      {
        text: '接受邀请',
        action: (state) => {
          if (!state.relationships['Qian Renxue']) {
             state.relationships['Qian Renxue'] = { name: '千仞雪', affection: 0, status: 'Acquaintance', faction: 'SpiritHall', description: '伪装成太子的天使' };
          }
          state.attributes.intelligence += 5;
          state.relationships['Qian Renxue'].affection += 5;
          addLog(state, "你与雪清河相谈甚欢，他的见识令你折服。");
        }
      },
      {
        text: '婉拒',
        action: (state) => {
          addLog(state, "你婉拒了太子的邀请。");
        }
      }
    ]
  },
  'REVEAL_QIAN_RENXUE': {
    id: 'REVEAL_QIAN_RENXUE',
    title: '真面目',
    description: '在一个月黑风高的夜晚，你无意中撞破了雪清河的秘密，金色的羽翼在夜空中展开。',
    type: 'Romance',
    trigger: (state) => state.relationships['Qian Renxue'] && state.relationships['Qian Renxue'].affection >= 30,
    options: [
      {
        text: '保守秘密',
        action: (state) => {
          state.relationships['Qian Renxue'].affection += 20;
          addLog(state, "你选择保守秘密。千仞雪看着你，眼神复杂，“你是个聪明人。”");
        }
      },
      {
        text: '揭穿她',
        action: (state) => {
          state.relationships['Qian Renxue'].affection -= 50;
          state.relationships['Qian Renxue'].status = 'Enemy';
          addLog(state, "千仞雪对你动了杀心，“只有死人才能保守秘密。”");
        }
      }
    ]
  },

  // --- STORY: SOUL FIGHTING ARENA ---
  'SOUL_ARENA_REGISTER': {
    id: 'SOUL_ARENA_REGISTER',
    title: '大斗魂场注册',
    description: '为了提升实战经验，你来到了索托大斗魂场。',
    type: 'Story',
    trigger: (state) => state.attributes.rank >= 20 && !state.flags['arena_registered'],
    options: [
      {
        text: '注册铁斗魂',
        action: (state) => {
          state.flags['arena_registered'] = true;
          state.flags['arena_wins'] = 0;
          addLog(state, "你注册成为了大斗魂场的铁斗魂，代号“修罗”。");
        }
      }
    ]
  },
  'SOUL_ARENA_MATCH': {
    id: 'SOUL_ARENA_MATCH',
    title: '斗魂比赛',
    description: '今晚的对手是一个强攻系魂尊。观众席上人声鼎沸。',
    type: 'Battle',
    trigger: (state) => !!state.flags['arena_registered'] && Math.random() < 0.3,
    options: [
      {
        text: '全力以赴',
        action: (state) => {
          const winChance = 0.5 + (state.attributes.spiritPower / 100);
          if (Math.random() < winChance) {
             state.flags['arena_wins'] = (state.flags['arena_wins'] as number) + 1;
             state.attributes.wealth += 10;
             state.attributes.spiritPower += 1;
             addLog(state, "你赢得了比赛！获得了10金魂币和实战经验。");
          } else {
             state.attributes.health -= 20;
             addLog(state, "你惜败于对手，受了点伤。");
          }
        }
      }
    ]
  },

  // --- STORY: ELITE TOURNAMENT ---
  'TOURNAMENT_INVITATION': {
    id: 'TOURNAMENT_INVITATION',
    title: '全大陆高级魂师学院精英大赛',
    description: '五年一度的盛事即将开始。你的学院决定派出战队参赛。',
    type: 'Story',
    trigger: (state) => state.attributes.rank >= 30 && state.year === 10 && !state.flags['tournament_started'],
    options: [
      {
        text: '报名参赛',
        action: (state) => {
          state.flags['tournament_started'] = true;
          state.currentLocation = '天斗城';
          addLog(state, "你随队前往天斗城参加预选赛。");
        },
        nextEventId: 'TOURNAMENT_PRELIMINARY'
      }
    ]
  },
  'TOURNAMENT_PRELIMINARY': {
    id: 'TOURNAMENT_PRELIMINARY',
    title: '预选赛：对战象甲宗',
    description: '第一场的对手是以防御著称的象甲宗。他们体型庞大，宛如肉山。',
    type: 'Battle',
    options: [
      {
        text: '寻找弱点',
        condition: (state) => state.attributes.intelligence > 40,
        action: (state) => {
           addLog(state, "你发现了他们移动缓慢的弱点，指挥队友游斗取胜！");
        },
        nextEventId: 'TOURNAMENT_FINAL'
      },
      {
        text: '正面硬撼',
        action: (state) => {
           if (state.attributes.strength > 60) {
               addLog(state, "你以绝对的力量击溃了象甲宗的防御！");
           } else {
               state.attributes.health -= 30;
               addLog(state, "你撞得头破血流，险胜对手。");
           }
        },
        nextEventId: 'TOURNAMENT_FINAL'
      }
    ]
  },
  'TOURNAMENT_FINAL': {
    id: 'TOURNAMENT_FINAL',
    title: '总决赛：武魂殿战队',
    description: '终于到了决赛。对手是武魂殿的黄金一代，拥有三名魂王！',
    type: 'Battle',
    options: [
      {
        text: '决一死战',
        action: (state) => {
           const power = state.attributes.spiritPower + state.attributes.strength + state.attributes.intelligence;
           if (power > 200) {
               state.flags['champion'] = true;
               state.attributes.wealth += 1000;
               state.attributes.rank += 3;
               addLog(state, "奇迹！你们击败了武魂殿战队，夺得了冠军！奖励三块魂骨！");
           } else {
               addLog(state, "实力悬殊，你们输了。虽然败了，但也虽败犹荣。");
           }
        }
      }
    ]
  },

  // --- FACTION: SHREK ---
  'SHREK_TRAINING_FROM_HELL': {
    id: 'SHREK_TRAINING_FROM_HELL',
    title: '大师的魔鬼训练',
    description: '大师玉小刚为你制定了严酷的训练计划：背着石头跑圈。',
    type: 'Story',
    trigger: (state) => state.faction === 'Shrek' && Math.random() < 0.2,
    options: [
      {
        text: '坚持到底',
        action: (state) => {
          state.attributes.strength += 5;
          state.attributes.health -= 20;
          addLog(state, "你咬牙坚持了下来，身体素质大幅提升。");
        }
      },
      {
        text: '偷懒',
        action: (state) => {
          state.attributes.strength += 1;
          addLog(state, "你跑了一半就累趴下了。");
        }
      }
    ]
  },

  // --- FACTION: SPIRIT HALL ---
  'SPIRIT_HALL_MISSION': {
    id: 'SPIRIT_HALL_MISSION',
    title: '武魂殿任务：剿灭邪魂师',
    description: '教皇殿发布任务，前往边境剿灭一伙作恶多端的邪魂师。',
    type: 'Story',
    trigger: (state) => state.faction === 'SpiritHall' && Math.random() < 0.2,
    options: [
      {
        text: '执行任务',
        action: (state) => {
          if (state.attributes.rank > 30) {
              state.attributes.wealth += 50;
              state.attributes.spiritPower += 2;
              addLog(state, "你成功剿灭了邪魂师，获得了嘉奖。");
          } else {
              state.attributes.health -= 40;
              addLog(state, "邪魂师太强了，你受了重伤才逃回来。");
          }
        }
      }
    ]
  },

  // --- HUNTING EVENTS ---
  'HUNT_SELECTION': {
    id: 'HUNT_SELECTION',
    title: '猎杀魂兽',
    description: '你的魂力已经达到了瓶颈，必须猎杀魂兽获取魂环才能继续突破。你要去哪里猎杀？',
    type: 'Battle',
    options: [
      {
        text: '星斗大森林 (危险度: 高)',
        action: (state) => {
            state.currentLocation = '星斗大森林';
            addLog(state, "你前往了星斗大森林。");
        },
        nextEventId: 'HUNT_FIND_BEAST'
      },
      {
        text: '落日森林 (危险度: 中)',
        action: (state) => {
            state.currentLocation = '落日森林';
            addLog(state, "你前往了落日森林。");
        },
        nextEventId: 'HUNT_FIND_BEAST'
      }
    ]
  },
  'HUNT_FIND_BEAST': {
    id: 'HUNT_FIND_BEAST',
    title: '寻找魂兽',
    description: '你在森林中搜寻适合自己的魂兽...',
    type: 'Battle',
    options: [
      {
        text: '搜寻百年魂兽 (曼陀罗蛇)',
        condition: (state) => state.spiritRings.length === 0,
        nextEventId: 'HUNT_BEAST_SNAKE',
        action: () => {}
      },
      {
        text: '搜寻百年魂兽 (鬼藤)',
        condition: (state) => state.spiritRings.length === 1,
        nextEventId: 'HUNT_BEAST_VINE',
        action: () => {}
      },
      {
        text: '搜寻千年魂兽 (人面魔蛛)',
        condition: (state) => state.spiritRings.length === 2,
        nextEventId: 'HUNT_BEAST_SPIDER',
        action: () => {}
      },
      {
        text: '搜寻千年魂兽 (大地之王)',
        condition: (state) => state.spiritRings.length === 3,
        nextEventId: 'HUNT_BEAST_SCORPION',
        action: () => {}
      },
      {
        text: '搜寻万年魂兽 (麟甲兽)',
        condition: (state) => state.spiritRings.length >= 4,
        nextEventId: 'HUNT_BEAST_ARMOR',
        action: () => {}
      }
    ]
  },
  'HUNT_BEAST_SNAKE': {
    id: 'HUNT_BEAST_SNAKE',
    title: '遭遇曼陀罗蛇',
    description: '一条身长四米的曼陀罗蛇出现在你面前，它吐着信子，毒牙闪烁着寒光。这是400年左右的魂兽。',
    type: 'Battle',
    options: [
      {
        text: '战斗！',
        action: (state) => {
            // Battle logic based on combat power
            // Snake power approx 200
            const beastPower = 200;
            const playerPower = state.attributes.combatPower || (state.attributes.spiritPower * 10);
            
            // Base win chance 50%, +1% per 10 power diff
            let winChance = 0.5 + (playerPower - beastPower) / 200;
            winChance = Math.min(Math.max(winChance, 0.1), 0.95);

            if (Math.random() < winChance) {
                state.spiritRings.push({
                    name: '曼陀罗蛇魂环',
                    age: 420,
                    skill: '缠绕',
                    type: 'Yellow'
                });
                state.attributes.spiritPower += 1; // Breakthrough
                state.attributes.maxHealth += 50;
                addLog(state, `你以 ${playerPower} 战力激战 ${beastPower} 战力的曼陀罗蛇，成功击杀！吸收了它的魂环！获得了第一魂技：缠绕。`);
            } else {
                state.attributes.health -= 30;
                addLog(state, `你以 ${playerPower} 战力不敌 ${beastPower} 战力的曼陀罗蛇，受了伤逃走了。`);
            }
        },
        nextEventId: 'HUNT_RESULT'
      },
      {
        text: '逃跑',
        action: (state) => addLog(state, "你选择了逃跑。")
      }
    ]
  },
  'HUNT_BEAST_VINE': {
    id: 'HUNT_BEAST_VINE',
    title: '遭遇鬼藤',
    description: '你发现了一株鬼藤，它挥舞着带刺的藤蔓，散发着诡异的气息。这是600年左右的魂兽。',
    type: 'Battle',
    options: [
      {
        text: '战斗！',
        action: (state) => {
            const beastPower = 400;
            const playerPower = state.attributes.combatPower || (state.attributes.spiritPower * 10);
            let winChance = 0.5 + (playerPower - beastPower) / 300;
            winChance = Math.min(Math.max(winChance, 0.1), 0.95);

            if (Math.random() < winChance) {
                state.spiritRings.push({
                    name: '鬼藤魂环',
                    age: 600,
                    skill: '寄生',
                    type: 'Yellow'
                });
                state.attributes.spiritPower += 1;
                state.attributes.maxHealth += 80;
                addLog(state, "你成功击杀了鬼藤，吸收了它的魂环！获得了第二魂技：寄生。");
            } else {
                state.attributes.health -= 40;
                addLog(state, "鬼藤太难缠了，你不得不撤退。");
            }
        },
        nextEventId: 'HUNT_RESULT'
      }
    ]
  },
  'HUNT_BEAST_SPIDER': {
    id: 'HUNT_BEAST_SPIDER',
    title: '遭遇人面魔蛛',
    description: '一只巨大的人面魔蛛挡住了你的去路，它的腹部有着狰狞的人脸图案。这是2000年左右的魂兽。',
    type: 'Battle',
    options: [
      {
        text: '殊死一搏',
        action: (state) => {
            const beastPower = 2500;
            const playerPower = state.attributes.combatPower || (state.attributes.spiritPower * 10);
            let winChance = 0.5 + (playerPower - beastPower) / 1000;
            winChance = Math.min(Math.max(winChance, 0.1), 0.95);

            if (Math.random() < winChance) {
                state.spiritRings.push({
                    name: '人面魔蛛魂环',
                    age: 2000,
                    skill: '蛛网束缚',
                    type: 'Purple'
                });
                state.attributes.spiritPower += 1;
                state.attributes.maxHealth += 150;
                state.inventory.push("外附魂骨：八蛛矛"); // Bonus!
                addLog(state, "你艰难地击杀了人面魔蛛，吸收了魂环！获得了第三魂技：蛛网束缚。意外获得了外附魂骨！");
            } else {
                state.attributes.health -= 60;
                addLog(state, `人面魔蛛太强大了(战力${beastPower})，你(战力${playerPower})身受重伤，险些丧命。`);
            }
        },
        nextEventId: 'HUNT_RESULT'
      }
    ]
  },
  'HUNT_BEAST_SCORPION': {
    id: 'HUNT_BEAST_SCORPION',
    title: '遭遇大地之王',
    description: '大地之王是一只巨大的蝎子，擅长火属性攻击。这是5000年左右的魂兽。',
    type: 'Battle',
    options: [
      {
        text: '战斗',
        action: (state) => {
            const beastPower = 6000;
            const playerPower = state.attributes.combatPower || (state.attributes.spiritPower * 10);
            let winChance = 0.5 + (playerPower - beastPower) / 2000;
            winChance = Math.min(Math.max(winChance, 0.1), 0.95);

            if (Math.random() < winChance) {
                state.spiritRings.push({
                    name: '大地之王魂环',
                    age: 5000,
                    skill: '蓝银囚笼', // Assuming Blue Silver Grass path for simplicity
                    type: 'Purple'
                });
                state.attributes.spiritPower += 1;
                state.attributes.maxHealth += 200;
                addLog(state, "你击败了大地之王，吸收了魂环！获得了第四魂技：蓝银囚笼。");
            } else {
                state.attributes.health -= 70;
                addLog(state, `你被大地之王的火焰击退了(战力差距: ${beastPower - playerPower})。`);
            }
        },
        nextEventId: 'HUNT_RESULT'
      }
    ]
  },
  'HUNT_BEAST_ARMOR': {
    id: 'HUNT_BEAST_ARMOR',
    title: '遭遇麟甲兽',
    description: '麟甲兽拥有极强的防御力。这是12000年左右的魂兽。',
    type: 'Battle',
    options: [
      {
        text: '全力以赴',
        action: (state) => {
            const beastPower = 15000;
            const playerPower = state.attributes.combatPower || (state.attributes.spiritPower * 10);
            let winChance = 0.5 + (playerPower - beastPower) / 5000;
            winChance = Math.min(Math.max(winChance, 0.1), 0.95);

            if (Math.random() < winChance) {
                state.spiritRings.push({
                    name: '麟甲兽魂环',
                    age: 12000,
                    skill: '蓝银霸王枪',
                    type: 'Black'
                });
                state.attributes.spiritPower += 1;
                state.attributes.maxHealth += 500;
                addLog(state, "你击破了麟甲兽的防御，吸收了万年魂环！获得了第五魂技：蓝银霸王枪。");
            } else {
                state.attributes.health -= 80;
                addLog(state, `你的攻击无法破防(战力${playerPower} vs ${beastPower})，只能无奈撤退。`);
            }
        },
        nextEventId: 'HUNT_RESULT'
      }
    ]
  },
  'HUNT_RESULT': {
      id: 'HUNT_RESULT',
      title: '猎杀结束',
      description: '战斗结束了，你整理了一下状态。',
      type: 'Battle',
      options: [
          {
              text: '返回',
              action: (state) => {
                  state.currentLocation = '索托城'; // Default back to city
              }
          }
      ]
  },
  'RANDOM_WEATHER_RAIN': {
    id: 'RANDOM_WEATHER_RAIN',
    title: '倾盆大雨',
    description: '今天下起了瓢泼大雨，不适合外出。',
    type: 'Random',
    trigger: () => Math.random() < 0.1, // 10% chance when checked
    options: [
      {
        text: '在室内读书',
        action: (state) => {
          state.attributes.intelligence += 1;
          addLog(state, "听着雨声读书，你的心境格外平和。");
        }
      },
      {
        text: '冒雨修炼',
        action: (state) => {
          if (state.attributes.health > 50) {
              state.attributes.spiritPower += 2;
              state.attributes.health -= 5;
              addLog(state, "你在雨中坚持修炼，精神力得到了磨砺。");
          } else {
              state.attributes.health -= 20;
              addLog(state, "你淋雨感冒了，身体不适。");
          }
        }
      }
    ]
  },
  'RANDOM_SOCIAL_FESTIVAL': {
    id: 'RANDOM_SOCIAL_FESTIVAL',
    title: '节日庆典',
    description: '城里正在举办盛大的节日庆典，热闹非凡。',
    type: 'Random',
    trigger: (state) => state.month === 1 || state.month === 6,
    options: [
      {
        text: '参加庆典',
        action: (state) => {
          state.attributes.wealth -= 10;
          state.attributes.health = Math.min(state.attributes.health + 10, state.attributes.maxHealth);
          addLog(state, "你度过了一个愉快的节日，心情大好。");
        }
      },
      {
        text: '趁机摆摊',
        action: (state) => {
          const profit = Math.floor(Math.random() * 30) + 10;
          state.attributes.wealth += profit;
          addLog(state, `你趁着人多摆摊卖了一些小玩意，赚了 ${profit} 金魂币。`);
        }
      }
    ]
  },
  'RANDOM_ITEM_MAP': {
    id: 'RANDOM_ITEM_MAP',
    title: '古旧地图',
    description: '你在旧书摊发现了一张泛黄的地图，似乎指向某个遗迹。',
    type: 'Random',
    trigger: (state) => state.currentLocation.includes('城'),
    options: [
      {
        text: '买下 (50金魂币)',
        condition: (state) => state.attributes.wealth >= 50,
        action: (state) => {
          state.attributes.wealth -= 50;
          state.inventory.push("古旧地图");
          addLog(state, "你获得了一张古旧地图，也许以后会有用。");
        }
      },
      {
        text: '不感兴趣',
        action: (state) => {
          addLog(state, "你放下了地图。");
        }
      }
    ]
  },
};
