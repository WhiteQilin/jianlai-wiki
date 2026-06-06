<script setup lang="ts">
useSeoMeta({
  title: 'Contribute',
  description: 'Help expand the Jian Lai Wiki by reporting issues, suggesting edits, or adding missing lore.',
  ogTitle: 'Contribute to Jian Lai Wiki',
  ogDescription: 'Help expand the Jian Lai Wiki by reporting issues, suggesting edits, or adding missing lore.',
})

const githubRepoUrl = 'https://github.com/WhiteQilin/jianlai-wiki'
const issuesUrl = `${githubRepoUrl}/issues/new/choose`
</script>

<template>
  <div class="article-page mdc-content animate-fade-in-up">
    <h1>Contribute <span class="zh">贡献</span></h1>
    
    <div class="contribute-content">
      <p class="lead">
        Jian Lai Wiki is a fan-made encyclopedia dedicated to organizing the vast lore of <em>Sword, Come! (剑来)</em>. 
        We rely on the community to help expand the archive, correct mistakes, and improve the reading experience.
      </p>

      <div class="contribution-options">
        <div class="option-card">
          <h3>Report an Issue</h3>
          <p>Found a typo, broken link, or incorrect lore? Let us know so we can fix it.</p>
          <a :href="issuesUrl" target="_blank" rel="noopener noreferrer" class="cta-button">Report Issue</a>
        </div>
        
        <div class="option-card">
          <h3>Suggest an Edit</h3>
          <p>Have more details to add to an entry? Want to provide better citations or missing context?</p>
          <a :href="issuesUrl" target="_blank" rel="noopener noreferrer" class="cta-button">Suggest Edit</a>
        </div>
        
        <div class="option-card">
          <h3>Request a Page</h3>
          <p>Notice a missing character, artifact, or location? Request a new entry to be added.</p>
          <a :href="issuesUrl" target="_blank" rel="noopener noreferrer" class="cta-button">Request Page</a>
        </div>
      </div>

      <div class="guidelines">
        <h2>Contribution Guidelines</h2>
        <ul>
          <li><strong>Preserve Chinese Terms:</strong> Keep original pinyin or characters where useful for context (e.g., Qi Refiner / 练气士).</li>
          <li><strong>Cite Sources:</strong> When suggesting lore additions, please include volume and chapter numbers if possible.</li>
          <li><strong>Avoid Speculation:</strong> Stick to confirmed facts from the novel. Unconfirmed theories should be clearly marked or avoided.</li>
          <li><strong>Match the Style:</strong> Content should follow the existing objective, encyclopedic tone of the wiki.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contribute-content {
  max-width: 800px;
  margin: 0 auto;
}

.lead {
  font-size: 1.1rem;
  color: var(--c-text-2);
  text-align: center;
  margin-bottom: 3rem;
  line-height: 1.8;
}

.zh {
  font-size: 0.6em;
  color: var(--c-text-3);
  margin-left: 0.5rem;
}

.contribution-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.option-card {
  background: var(--c-bg-soft);
  border: 1px solid var(--c-border);
  padding: 2rem;
  border-radius: 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.option-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-family: var(--font-heading);
  color: var(--c-charcoal);
}

.option-card p {
  color: var(--c-text-2);
  font-size: 0.95rem;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.cta-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--c-seal-red);
  color: white;
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background: var(--c-seal-red-dark);
}

.guidelines {
  background: var(--c-mist);
  padding: 2rem 3rem;
  border-left: 4px solid var(--c-seal-red);
}

.guidelines h2 {
  margin-top: 0;
  font-family: var(--font-heading);
  color: var(--c-charcoal);
}

.guidelines ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--c-text-2);
}

.guidelines li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.guidelines li strong {
  color: var(--c-charcoal);
}
</style>
