export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  category: string
  message: string
  data?: any
  stack?: string
}

class Logger {
  private static logs: LogEntry[] = []
  private static maxLogs = 1000

  static log(level: 'info' | 'warn' | 'error' | 'debug', category: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      stack: level === 'error' ? new Error().stack : undefined
    }

    this.logs.unshift(entry)
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Also log to console for development
    const consoleMessage = `[${entry.timestamp}] [${level.toUpperCase()}] [${category}] ${message}`
    if (data) {
      console.log(consoleMessage, data)
    } else {
      console.log(consoleMessage)
    }

    return entry
  }

  static info(category: string, message: string, data?: any) {
    return this.log('info', category, message, data)
  }

  static warn(category: string, message: string, data?: any) {
    return this.log('warn', category, message, data)
  }

  static error(category: string, message: string, data?: any) {
    return this.log('error', category, message, data)
  }

  static debug(category: string, message: string, data?: any) {
    return this.log('debug', category, message, data)
  }

  static getLogs(category?: string, level?: string): LogEntry[] {
    let filtered = this.logs

    if (category) {
      filtered = filtered.filter(log => log.category === category)
    }

    if (level) {
      filtered = filtered.filter(log => log.level === level)
    }

    return filtered
  }

  static getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(0, count)
  }

  static clearLogs() {
    this.logs = []
  }

  static exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  static getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      recentErrors: this.logs.filter(log => log.level === 'error').slice(0, 10)
    }

    this.logs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1
    })

    return stats
  }
}

export default Logger







