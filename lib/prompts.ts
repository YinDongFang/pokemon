export const buildMonsterDataPrompt = (
  count: number
) => `你是一个游戏设计师。请生成共${count}个独特的怪物/宝可梦物种数据，返回JSON格式。

要求：
1. 生成一个有趣且独特的怪物名字（英文）
2. 写一段简短的描述（10-100字），描述怪物的特点、能力、背景故事等。
3. 设置属性值（每个属性范围1-255）：
   - hp: 生命值
   - attack: 攻击力
   - defense: 防御力
   - sp_attack: 特殊攻击力
   - sp_defense: 特殊防御力
   - speed: 速度
4. 设置EV收益值（每个属性范围0-3，总和不超过10）
5. 设置出现概率possibility（1-255，数字越小出现概率越低，数字越大出现概率越高）
6. 设置种族类型主类型和副类型（用数字表示：1=火，2=水，3=草，4=电，5=冰，6=格斗，7=毒，8=地面，9=飞行，10=超能力，11=虫，12=岩石，13=幽灵，14=龙，15=恶，16=钢，17=妖精，18=普通）

返回格式必须是纯JSON，不要任何其他文字：
[{
  "name": "怪物名字",
  "description": "怪物描述",
  "primaryType": 1,
  "secondaryType": 0,
  "possibility": 1,
  "baseStats": {
    "hp": 80,
    "attack": 85,
    "defense": 75,
    "sp_attack": 90,
    "sp_defense": 80,
    "speed": 70
  },
  "evYield": {
    "hp": 0,
    "attack": 2,
    "defense": 0,
    "sp_attack": 1,
    "sp_defense": 0,
    "speed": 0
  }
}]`;

export const MONSTER_IMAGE_PROMPT_PREFIX = `Create a professional Pokemon-style trading card illustration for a monster creature. The card should feature:

- A dynamic, vibrant character design in the center
- Rich, colorful background that matches the creature's type
- High-quality anime/manga art style
- Detailed creature features and expressions
- Professional trading card layout with space for text overlays
- Bright, eye-catching colors
- Clean, polished artwork suitable for a trading card game

The monster is: `;
