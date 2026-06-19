/**
 * Server-Sent Events (SSE) state broadcaster for pushing real-time multi-agent thinking streams,
 * simulation outputs, and financial tickers to active client dashboards securely.
 */
export class SSERuntimeStreamGateway {
  private activeConnections: Set<any> = new Set();

  /**
   * Registers a client response context to receive live SSE feeds
   */
  public registerClientConnection(res: any): void {
    this.activeConnections.add(res);
    console.log(`[SSEGateway] Live client stream established. Active pipelines: ${this.activeConnections.size}`);
  }

  /**
   * Evicts disconnected response channels to prevent reference memory leaks
   */
  public dropClientConnection(res: any): void {
    this.activeConnections.delete(res);
    console.log(`[SSEGateway] Client stream dropped. Active pipelines: ${this.activeConnections.size}`);
  }

  /**
   * Broadcasts a live step cognitive stream trace event to all listening interfaces
   */
  public broadcastActionChunk(eventTopic: string, payloadData: any): void {
    const formattedData = `event: ${eventTopic}\ndata: ${JSON.stringify(payloadData)}\n\n`;
    
    this.activeConnections.forEach(res => {
      try {
        res.write(formattedData);
      } catch (err) {
        console.warn("[SSEGateway] Failed writing write-buffer to remote channel, dropping connection reference.", err);
        this.activeConnections.delete(res);
      }
    });
  }

  /**
   * Get active connection count
   */
  public getConnectionsCount(): number {
    return this.activeConnections.size;
  }
}
