import { Panel } from './Panel';
import { setTrustedHtml, trustedHtml } from '@/utils/dom-utils';

export class TwitterPanel extends Panel {
  constructor() {
    super({ id: 'twitter-login', title: 'Twitter', className: 'panel-wide', closable: true, collapsible: true });
    this.render();
  }

  private render(): void {
    setTrustedHtml(this.content, trustedHtml(`
      <div style="padding: 16px; height: 100%; display: flex; flex-direction: column; color: #fff;">
        <div id="twitter-setup" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
          <p style="margin: 0; font-size: 13px; color: #8b949e;">
            <strong>Note:</strong> Browsers block logging into X.com inside an iframe for security. Instead, enter your public X handle below to embed your live profile timeline directly.
          </p>
          <div style="display: flex; gap: 8px;">
            <input type="text" id="twitter-handle-input" placeholder="e.g. NASA" style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #30363d; background: #0d1117; color: #fff; font-size: 14px;" />
            <button id="twitter-load-btn" style="background: #1d9bf0; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">Load Handle</button>
          </div>
        </div>
        <div id="twitter-timeline-container" style="flex: 1; overflow-y: auto; background: #15202b; border-radius: 6px;">
        </div>
      </div>
    `, "legacy direct innerHTML migration"));

    const input = this.content.querySelector('#twitter-handle-input') as HTMLInputElement;
    const btn = this.content.querySelector('#twitter-load-btn') as HTMLButtonElement;
    const container = this.content.querySelector('#twitter-timeline-container') as HTMLDivElement;

    const loadTimeline = (handle: string) => {
      const cleanHandle = handle.replace('@', '').trim();
      if (!cleanHandle) return;
      
      container.innerHTML = '';
      const a = document.createElement('a');
      a.className = 'twitter-timeline';
      a.href = `https://twitter.com/${cleanHandle}?ref_src=twsrc%5Etfw`;
      a.dataset.theme = 'dark';
      a.textContent = `Tweets by ${cleanHandle}`;
      container.appendChild(a);

      // Load Twitter widgets.js dynamically
      if (!(window as any).twttr) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        document.body.appendChild(script);
      } else {
        (window as any).twttr.widgets.load(container);
      }
    };

    btn?.addEventListener('click', () => loadTimeline(input.value));
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loadTimeline(input.value);
    });
  }
}
