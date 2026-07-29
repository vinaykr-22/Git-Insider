import { useMemo } from 'react';
import Icon from './Icon';
import { detectTechStack, LANGUAGE_COLORS } from '../utils/analysis';

const CATEGORY_ICONS = {
  Languages: 'globe',
  Frameworks: 'spark',
  Databases: 'fork',
  'DevOps & Cloud': 'settings',
  'AI & ML': 'star',
  Testing: 'check',
  Tools: 'settings',
};

export default function TechStackSection({ repos }) {
  const techStack = useMemo(() => detectTechStack(repos), [repos]);
  const entries = Object.entries(techStack);

  if (!entries.length) return null;

  return (
    <section className="section tech-section">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">TECH STACK</p>
          <h2>
            Built with <em>these tools.</em>
          </h2>
        </div>
        <p className="section-intro">
          Technologies detected across repository names, descriptions, topics, and
          languages.
        </p>
      </div>
      <div className="tech-grid">
        {entries.map(([category, items], catIdx) => (
          <div className="tech-category" key={category}>
            <div className="tech-category-header">
              <Icon name={CATEGORY_ICONS[category] || 'spark'} />
              <span>{category}</span>
            </div>
            <div className="tech-pills">
              {items.map((item) => (
                <span
                  className="tech-pill"
                  key={item}
                  style={{
                    borderColor: LANGUAGE_COLORS[catIdx % LANGUAGE_COLORS.length],
                    color: LANGUAGE_COLORS[catIdx % LANGUAGE_COLORS.length],
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
