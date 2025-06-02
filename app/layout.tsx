import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
 title: 'Speed Test & Weather Hub | Ultimate Internet & Forecast Tool',
  description: 'Your all-in-one solution for testing internet speed (download, upload, ping, latency) and accessing real-time weather updates, detailed forecasts, and climate insights. Fast, reliable, and user-friendly.',
  generator: 'Next.js',
  applicationName: 'SpeedTestWeatherHub',
  keywords: [
    'speed test', 'internet speed', 'download speed', 'upload speed', 'ping test', 'latency checker',
    'weather forecast', 'live weather', 'climate updates', 'daily forecast', 'weekly forecast',
    'internet performance', 'network diagnostics', 'bandwidth test', 'connection speed',
    'weather app', 'real-time weather', 'temperature updates', 'humidity data', 'wind speed',
    'precipitation forecast', 'storm alerts', 'weather radar', 'local weather', 'global weather',
    'online tools', 'productivity apps', 'internet tools', 'weather tools', 'speed checker',
    'network latency', 'broadband test', 'wifi speed', 'fiber optic test', '5G speed test',
    'weather conditions', 'forecast accuracy', 'meteorology tools', 'climate tracker',
    'internet stability', 'ping latency', 'jitter test', 'network quality', 'speed diagnostics',
    'hourly weather', 'extended forecast', 'weather alerts', 'severe weather warnings',
    'temperature trends', 'humidity levels', 'barometric pressure', 'wind direction',
    'sunrise sunset times', 'UV index', 'air quality index', 'pollen count', 'weather maps',
    'internet speed app', 'weather forecast app', 'combined tools', 'tech utilities',
    'speed test results', 'weather insights', 'daily weather', 'regional weather',
    'internet monitoring', 'network performance', 'speed test history', 'weather history',
    'climate data', 'forecast models', 'weather predictions', 'internet reliability',
    'connection tester', 'bandwidth checker', 'speed test tool', 'weather tracker',
    'real-time updates', 'live diagnostics', 'internet health', 'weather dashboard',
    'speed test widget', 'weather widget', 'online diagnostics', 'digital tools',
    'internet speed insights', 'weather forecast insights', 'tech solutions',
    'performance metrics', 'network tools', 'weather utilities', 'speed test platform',
    'weather platform', 'multi-tool app', 'internet and weather', 'speed test online',
    'weather online', 'fast speed test', 'accurate weather', 'user-friendly tools',
    'Next.js app', 'web tools', 'internet checker', 'forecast checker', 'daily tools',
    'speed test results', 'weather results', 'combined app', 'tech and weather'
  ],
  authors: [{ name: 'Qitmeer Raza', url: 'https://qitmeer.dev' }],
  creator: 'Qitmeer Raza',
  publisher: 'Qitmeer Raza',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
