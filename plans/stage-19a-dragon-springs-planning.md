# Stage 19A: Dragon Springs / Longquan Cluster Batch Planning

## 1. Baseline Route Count
*Note: The exact baseline route count will be established by running `npm run editor:qa` in the next step. Based on the current file structure, there are approximately 60-70 markdown files in the `content/` directory.*

## 2. Existing vs Missing Candidate Entries
Upon reviewing the provided candidate entities, **all of them already exist as full, detailed entries** in the content directory:
- `content/characters/ruan-qiong.md` (Exists)
- `content/characters/ruan-xiu.md` (Exists)
- `content/characters/liu-xianyang.md` (Exists)
- `content/factions/dragon-springs-sword-sect.md` (Exists)
- `content/factions/wind-and-snow-temple.md` (Exists)
- `content/world/longquan.md` (Exists)
- `content/world/shenxiu-mountain.md` (Exists)
- `content/artifacts/dragon-slaying-cliff.md` (Exists)

*(Note: `content/world/dragon-spring-county.md` also exists as a stub, but `longquan.md` covers the broader region comprehensively).*

## 3. Ghost-Link Payoff
Since the primary candidates already exist, the highest graph payoff comes from resolving the "ghost links" (empty links or links to non-existent files) that are heavily referenced within these existing entries. 

Key ghost links identified:
- **From Ruan Qiong & Dragon Springs Sword Sect**: Dong Gu, Xu Xiaoqiao, Xie Ling
- **From Liu Xianyang**: She Yue (Yu Qianyue), Yao Laotou, Chen Chun'an
- **From Ruan Xiu**: Li Liu, Pei Qian, Zhou Mili
- **From Wind and Snow Temple**: Wei Jin, Child-like Ancestor, Qin Clan Ancestor
- **From Longquan / Shenxiu Mountain**: Wei Bo, Wu Yuan
- **From Dragon Slaying Cliff**: Tall Woman (Sword Spirit), Mohist School

## 4. Recommended Stage 19A Batch (5-7 Entries)
To maximize the graph payoff for the Dragon Springs / Longquan cluster, the following 7 entries are recommended for the next NotebookLM generation batch:

1. **Dong Gu (董谷)**: First disciple of Ruan Qiong, manages the Dragon Springs Sword Sect.
2. **Wei Bo (魏檗)**: Northern Peak Mountain God of Piyun Mountain, key figure in Longquan's spiritual governance.
3. **Yao Laotou (姚老头)**: Former kiln master, master of Liu Xianyang, deeply tied to Lizhu Grotto-Heaven lore.
4. **Li Liu (李柳)**: Water God, fated rival of Ruan Xiu in the Water-Fire Dispute.
5. **She Yue / Yu Qianyue (赊月 / 余倩月)**: Dao companion of Liu Xianyang.
6. **Wei Jin (魏晋)**: Great Sword Immortal of Wind and Snow Temple, heir of Shenxiantai.
7. **Mohist School (墨家)**: Major faction that collaborated with Great Li and utilized the Dragon Slaying Cliff.

## 5. Target Taxonomy & Output-Contract Warnings

### 1. Dong Gu
- **Target File Path**: `content/characters/dong-gu.md`
- **Expected Section**: `characters`
- **Expected Category**: `Character`
- **Expected Subtype**: `subcategory: Sword Sect Disciple / Mountain Spirit`
- **Warnings**: Ensure relationships link back to `/characters/ruan-qiong` and `/factions/dragon-springs-sword-sect`.

### 2. Wei Bo
- **Target File Path**: `content/characters/wei-bo.md`
- **Expected Section**: `characters`
- **Expected Category**: `Character`
- **Expected Subtype**: `subcategory: Active Deity / Mountain God`
- **Warnings**: Use `category: Character` (not `pantheon`) since he is an active narrative character. Link to `/world/longquan` and `/factions/dali-empire`.

### 3. Yao Laotou
- **Target File Path**: `content/characters/yao-laotou.md`
- **Expected Section**: `characters`
- **Expected Category**: `Character`
- **Expected Subtype**: `subcategory: Kiln Master`
- **Warnings**: Emphasize his connection to `/characters/liu-xianyang` and `/world/lizhu-grotto-heaven`.

### 4. Li Liu
- **Target File Path**: `content/characters/li-liu.md`
- **Expected Section**: `characters`
- **Expected Category**: `Character`
- **Expected Subtype**: `subcategory: Active Deity / Water God`
- **Warnings**: Must include the Water-Fire Dispute relationship with `/characters/ruan-xiu`.

### 5. She Yue (Yu Qianyue)
- **Target File Path**: `content/characters/she-yue.md`
- **Expected Section**: `characters`
- **Expected Category**: `Character`
- **Expected Subtype**: `subcategory: Dao Companion`
- **Warnings**: Link to `/characters/liu-xianyang`.

### 6. Wei Jin
- **Target File Path**: `content/characters/wei-jin.md`
- **Expected Section**: `characters`
- **Expected Category**: `Character`
- **Expected Subtype**: `subcategory: Sword Cultivator`
- **Warnings**: Link to `/factions/wind-and-snow-temple`.

### 7. Mohist School
- **Target File Path**: `content/factions/mohist-school.md`
- **Expected Section**: `factions`
- **Expected Category**: `Sect` (or `Lineage`)
- **Expected Subtype**: `factionType: Philosophical School`
- **Warnings**: Link to `/factions/great-li-dynasty` and `/artifacts/dragon-slaying-cliff`.

## 6. What NotebookLM Markdown is Needed Next
Please provide the NotebookLM-generated Markdown for the 7 recommended entries above (Dong Gu, Wei Bo, Yao Laotou, Li Liu, She Yue, Wei Jin, Mohist School) adhering strictly to the `notebooklm-taxonomy-guideV2.md` schema. Do not create placeholder stubs.
