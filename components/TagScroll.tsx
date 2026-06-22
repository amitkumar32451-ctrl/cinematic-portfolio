'use client';

export default function TagScroll() {
  const tags = [
    'AI Creator', 'AI Tools', 'Prompt Engineering', 'AI News',
    'Generative AI', 'Google Gemini', 'ChatGPT', 'Veo 3',
    'AI Workflows', 'Automation', 'AI Agents', 'Productivity',
    'Content Creation', 'Future of Work', 'Learning In Public',
    'Tech Simplified', 'No Hype', 'Real Use Cases',
  ];

  const renderTags = (keyPrefix: string) =>
    tags.map((tag, i) => (
      <span
        key={`${keyPrefix}-${i}`}
        className="inline-block whitespace-nowrap rounded-full border border-white/20 px-6 py-2 text-sm text-white"
      >
        {tag}
      </span>
    ));

  return (
    <section className="overflow-hidden bg-[#111111] py-24 md:py-32">
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div
        className="mb-6 flex gap-4"
        style={{ animation: 'scroll-left 30s linear infinite', width: 'max-content' }}
      >
        {renderTags('a')}
        {renderTags('b')}
      </div>
      <div
        className="flex gap-4"
        style={{ animation: 'scroll-right 30s linear infinite', width: 'max-content' }}
      >
        {renderTags('c')}
        {renderTags('d')}
      </div>
    </section>
  );
}
