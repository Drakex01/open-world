import { Panel } from './Panel';
import { setTrustedHtml, trustedHtml } from '@/utils/dom-utils';

export class NetworkActivityPanel extends Panel {
  private updateInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    super({ id: 'network-activity', title: 'Network Activity & Alerts', className: 'panel-wide', closable: true, collapsible: true });
    this.render();
  }

  private render(): void {
    setTrustedHtml(this.content, trustedHtml(`
      <div style="padding: 12px; font-family: monospace; font-size: 13px; color: #c9d1d9;">
        <div style="margin-bottom: 10px; padding: 8px; border: 1px solid rgba(255,100,100,0.4); background: rgba(255,0,0,0.1); border-radius: 4px;">
          <strong style="color: #ff7b72;">[ALERT] Suspicious IPs Detected</strong>
          <ul style="margin-top: 5px; padding-left: 20px;">
            <li>192.168.1.105 - Port scan detected</li>
            <li>45.33.32.156 - Multiple failed login attempts</li>
            <li>103.45.67.89 - Unusual outgoing traffic</li>
          </ul>
        </div>
        <div>
          <strong style="color: #79c0ff;">Live Network Traffic</strong>
          <div id="network-traffic-log" style="height: 150px; overflow-y: auto; background: rgba(0,0,0,0.5); padding: 8px; border-radius: 4px; margin-top: 5px; border: 1px solid rgba(255,255,255,0.1);">
            Waiting for activity...
          </div>
        </div>
      </div>
    `, "legacy direct innerHTML migration"));

    this.startSimulation();
  }

  private startSimulation(): void {
    const log = this.content.querySelector('#network-traffic-log');
    if (!log) return;
    
    // clear waiting text
    log.innerHTML = '';

    let count = 0;
    this.updateInterval = setInterval(() => {
      count++;
      const div = document.createElement('div');
      const ip = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
      div.textContent = `[${new Date().toISOString()}] Connection from ${ip} - TCP/${Math.floor(Math.random()*1000 + 1024)} ACCEPTED`;
      log.prepend(div);
      if (log.children.length > 20) {
        log.lastChild?.remove();
      }
    }, 1500);
  }

  public destroy(): void {
    super.destroy();
    if (this.updateInterval) clearInterval(this.updateInterval);
  }
}
