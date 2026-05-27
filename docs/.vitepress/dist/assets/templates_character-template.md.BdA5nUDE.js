import{c as s,Q as a,j as n,m as t}from"./chunks/framework.BPKcPtvA.js";const c=JSON.parse('{"title":"Character Template","description":"","frontmatter":{},"headers":[],"relativePath":"templates/character-template.md","filePath":"templates/character-template.md"}'),e={name:"templates/character-template.md"};function l(h,i,p,k,r,o){return a(),n("div",null,[...i[0]||(i[0]=[t(`<h1 id="character-template" tabindex="-1">Character Template <a class="header-anchor" href="#character-template" aria-label="Permalink to &quot;Character Template&quot;">​</a></h1><blockquote><p>Copy the content below into <code>docs/characters/</code> to create a new character page.</p></blockquote><hr><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;"># [Character Name]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;CharacterInfobox</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  name=&quot;[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline;">Name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  :titles=&quot;[&#39;Title 1&#39;, &#39;Title 2&#39;]&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  affiliation=&quot;[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline;">Faction</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  realm=&quot;[Current Realm]&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  weapon=&quot;[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline;">Weapon/Artifact</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;NameBlock chinese=&quot;[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline;">中文名</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]&quot; pinyin=&quot;[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline;">Pinyin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]&quot; english=&quot;[English Name]&quot; /&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## Overview</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[Brief character introduction, 1-2 paragraphs. Mark unconfirmed info as &quot;To be verified&quot;.]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## Cultivation</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;RealmBadge realm=&quot;[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline;">Realm</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]&quot; /&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[Cultivation history and realm breakthroughs.]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## Relationships</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;RelationshipList :items=&quot;[</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  { name: &#39;[Character A]&#39;, relation: &#39;[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline;">Relationship</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]&#39;, link: &#39;/characters/[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline;">slug</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  { name: &#39;[Character B]&#39;, relation: &#39;[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline;">Relationship</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]&quot; /&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## Story</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[Major plot events, in chronological order.]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## Notes</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> To be verified: [Unconfirmed information]</span></span></code></pre></div>`,4)])])}const E=s(e,[["render",l]]);export{c as __pageData,E as default};
