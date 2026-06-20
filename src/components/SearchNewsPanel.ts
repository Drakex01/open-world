import { Panel } from './Panel';
import { setTrustedHtml, trustedHtml } from '@/utils/dom-utils';
import { fetchWithProxy, rssProxyUrl } from '@/utils';

export class SearchNewsPanel extends Panel {
  constructor() {
    super({ id: 'search-news', title: 'Search News', className: 'panel-wide', closable: true, collapsible: true });
    this.render();
  }

  private render(): void {
    setTrustedHtml(this.content, trustedHtml(`
      <div style="display: flex; flex-direction: column; height: 100%; padding: 16px; background: #0d1117; color: #c9d1d9;">
        <div id="search-news-header" style="display: flex; gap: 8px; margin-bottom: 12px;">
          <input type="text" id="news-search-input" placeholder="Search news (e.g. neet scam)" style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid #30363d; background: #161b22; color: #fff; font-size: 14px;" />
          <button id="news-search-btn" style="background: #238636; color: #fff; border: none; padding: 0 20px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; transition: background 0.2s;">
            Search
          </button>
        </div>

        <div id="news-search-loading" style="display: none; padding: 20px; text-align: center; color: #8b949e;">
          Searching...
        </div>

        <div id="news-search-results" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
          <div style="text-align: center; color: #8b949e; padding: 30px;">
            Search for any topic to read the latest news here without leaving the app.
          </div>
        </div>

        <div id="news-reader-view" style="display: none; flex: 1; flex-direction: column; border-top: 1px solid #30363d; margin-top: -12px; padding-top: 12px; height: 100%;">
          <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <button id="news-back-btn" style="background: #21262d; color: #c9d1d9; border: 1px solid #30363d; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px;">
              &larr; Back to Results
            </button>
            <a id="news-external-link" href="#" target="_blank" style="color: #58a6ff; font-size: 13px; text-decoration: none;">Open in Browser &nearr;</a>
          </div>
          <div id="news-reader-content" style="flex: 1; overflow-y: auto; padding: 10px 0; font-size: 15px; line-height: 1.6; color: #c9d1d9;"></div>
        </div>
      </div>
    `, "legacy direct innerHTML migration"));

    const input = this.content.querySelector('#news-search-input') as HTMLInputElement;
    const btn = this.content.querySelector('#news-search-btn') as HTMLButtonElement;
    const resultsContainer = this.content.querySelector('#news-search-results') as HTMLDivElement;
    const loadingContainer = this.content.querySelector('#news-search-loading') as HTMLDivElement;
    const readerView = this.content.querySelector('#news-reader-view') as HTMLDivElement;
    const readerContent = this.content.querySelector('#news-reader-content') as HTMLDivElement;
    const backBtn = this.content.querySelector('#news-back-btn') as HTMLButtonElement;
    const externalLink = this.content.querySelector('#news-external-link') as HTMLAnchorElement;
    const headerRow = this.content.querySelector('#search-news-header') as HTMLDivElement;

    const performSearch = async () => {
      const query = input.value.trim();
      if (!query) return;

      resultsContainer.style.display = 'none';
      readerView.style.display = 'none';
      loadingContainer.style.display = 'block';

      try {
        const feedUrl = `https://news.search.yahoo.com/rss?p=${encodeURIComponent(query)}`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
        const res = await fetch(proxyUrl);
        const json = await res.json();
        const xml = json.contents;
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'text/xml');
        const items = doc.querySelectorAll('item');

        loadingContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'flex';

        if (items.length === 0) {
          resultsContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: #ff7b72;">No news found for this topic.</div>';
          return;
        }

        Array.from(items).forEach(item => {
          const title = item.querySelector('title')?.textContent || 'No Title';
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          const source = item.querySelector('source')?.textContent || 'News Source';

          const card = document.createElement('div');
          card.style.cssText = 'padding: 12px; background: #161b22; border: 1px solid #30363d; border-radius: 6px; cursor: pointer; transition: background 0.2s;';
          card.onmouseover = () => card.style.background = '#21262d';
          card.onmouseout = () => card.style.background = '#161b22';
          
          card.innerHTML = `
            <div style="font-weight: bold; font-size: 15px; margin-bottom: 6px; line-height: 1.3; color: #58a6ff;">${title}</div>
            <div style="font-size: 12px; color: #8b949e; display: flex; justify-content: space-between;">
              <span>${source}</span>
              <span>${new Date(pubDate).toLocaleDateString()}</span>
            </div>
          `;

          card.addEventListener('click', async () => {
            resultsContainer.style.display = 'none';
            headerRow.style.display = 'none';
            readerView.style.display = 'flex';
            externalLink.href = link;
            readerContent.innerHTML = '<div style="text-align:center; padding: 20px;">Loading article text...</div>';
            
            try {
              const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(link)}`);
              const json = await res.json();
              const html = json.contents;
              const articleDoc = new DOMParser().parseFromString(html, 'text/html');
              
              let contentHtml = '';
              const article = articleDoc.querySelector('article');
              if (article) {
                contentHtml = Array.from(article.querySelectorAll('p, h2, h3, img')).map(el => el.outerHTML).join('');
              } else {
                contentHtml = Array.from(articleDoc.querySelectorAll('p'))
                  .filter(p => p.textContent && p.textContent.trim().length > 30)
                  .map(p => p.outerHTML)
                  .join('');
              }
              
              if (!contentHtml.trim()) {
                readerContent.innerHTML = '<div style="text-align:center; padding: 20px; color: #ff7b72;">Could not extract article text automatically. Please open in browser.</div>';
              } else {
                readerContent.innerHTML = `<h1 style="font-size: 20px; margin-bottom: 15px; color: #fff;">${title}</h1>` + contentHtml;
              }
            } catch (e) {
              readerContent.innerHTML = '<div style="text-align:center; padding: 20px; color: #ff7b72;">Failed to load article text.</div>';
            }
          });

          resultsContainer.appendChild(card);
        });
      } catch (err) {
        loadingContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = '<div style="text-align:center; padding: 20px; color: #ff7b72;">Failed to load news.</div>';
      }
    };

    btn?.addEventListener('click', performSearch);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performSearch();
    });

    backBtn?.addEventListener('click', () => {
      readerContent.innerHTML = '';
      readerView.style.display = 'none';
      resultsContainer.style.display = 'flex';
      headerRow.style.display = 'flex';
    });
  }
}
