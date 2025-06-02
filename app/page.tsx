"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Wifi,
  Download,
  Upload,
  Clock,
  MapPin,
  Server,
  Cloud,
  Sun,
  CloudRain,
  Activity,
  Globe,
  Database,
  Github,
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
} from "lucide-react"

export default function SpeedTestWebsite() {
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [testResults, setTestResults] = useState({
    download: 0,
    upload: 0,
    latency: 0,
    jitter: 0,
  })
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mock weather data
  const weatherData = {
    location: "Karachi, Pakistan",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: "Today", high: 30, low: 24, condition: "Sunny" },
      { day: "Tomorrow", high: 32, low: 26, condition: "Cloudy" },
      { day: "Wednesday", high: 29, low: 23, condition: "Rain" },
      { day: "Thursday", high: 31, low: 25, condition: "Sunny" },
      { day: "Friday", high: 28, low: 22, condition: "Cloudy" },
    ],
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const startSpeedTest = async () => {
    setIsTestRunning(true)
    setTestProgress(0)
    setTestResults({ download: 0, upload: 0, latency: 0, jitter: 0 })

    // Simulate speed test
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setTestProgress(i)

      if (i >= 30 && i <= 60) {
        // Download test
        setTestResults((prev) => ({
          ...prev,
          download: Math.min(31 + Math.random() * 10, 45),
          latency: 5 + Math.random() * 3,
        }))
      } else if (i >= 70) {
        // Upload test
        setTestResults((prev) => ({
          ...prev,
          upload: Math.min(45 + Math.random() * 15, 60),
          jitter: 1 + Math.random() * 2,
        }))
      }
    }

    setIsTestRunning(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wifi className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold">SpeedTest Pro</h1>
          </div>
          <div className="text-sm text-gray-400">{currentTime.toLocaleTimeString()}</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Main Speed Test */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-blue-400">Internet Speed Test</CardTitle>
            <CardDescription className="text-gray-400">
              Test your internet connection speed and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Speed Results */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Download className="w-6 h-6 text-green-500 mr-2" />
                  <span className="text-sm text-gray-400">Download</span>
                </div>
                <div className="text-3xl font-bold text-green-500">{testResults.download.toFixed(1)}</div>
                <div className="text-sm text-gray-400">Mbps</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-400">Upload</span>
                </div>
                <div className="text-3xl font-bold text-blue-500">{testResults.upload.toFixed(1)}</div>
                <div className="text-sm text-gray-400">Mbps</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-400">Latency</span>
                </div>
                <div className="text-3xl font-bold text-yellow-500">{testResults.latency.toFixed(0)}</div>
                <div className="text-sm text-gray-400">ms</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="w-6 h-6 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-400">Jitter</span>
                </div>
                <div className="text-3xl font-bold text-purple-500">{testResults.jitter.toFixed(1)}</div>
                <div className="text-sm text-gray-400">ms</div>
              </div>
            </div>

            {/* Progress Bar */}
            {isTestRunning && (
              <div className="space-y-2">
                <Progress value={testProgress} className="h-3" />
                <p className="text-center text-sm text-gray-400">Testing... {testProgress}%</p>
              </div>
            )}

            {/* Start Test Button */}
            <div className="text-center">
              <Button
                onClick={startSpeedTest}
                disabled={isTestRunning}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                size="lg"
              >
                {isTestRunning ? "Testing..." : "Start Speed Test"}
              </Button>
            </div>

            {/* Connection Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Karachi Nazimabad, PK</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Server className="w-4 h-4" />
                <span>CyberInternet Server</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" />
                <span>IPv6 Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Features */}
        <Tabs defaultValue="weather" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="weather" className="data-[state=active]:bg-blue-600">
              Weather
            </TabsTrigger>
            <TabsTrigger value="forecast" className="data-[state=active]:bg-blue-600">
              Forecast
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-blue-600">
              Network
            </TabsTrigger>
            <TabsTrigger value="ping" className="data-[state=active]:bg-blue-600">
              Ping Test
            </TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-blue-600">
              Data Usage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weather">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-6 h-6 text-blue-400" />
                  Current Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Sun className="w-12 h-12 text-yellow-500" />
                      <div>
                        <div className="text-4xl font-bold">{weatherData.temperature}°C</div>
                        <div className="text-gray-400">{weatherData.condition}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{weatherData.location}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Humidity</span>
                      <span>{weatherData.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wind Speed</span>
                      <span>{weatherData.windSpeed} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Feels Like</span>
                      <span>{weatherData.temperature + 2}°C</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecast">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="w-6 h-6 text-blue-400" />
                  5-Day Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="text-center p-4 bg-gray-700 border border-gray-600">
                      <div className="font-semibold mb-2">{day.day}</div>
                      <div className="mb-2">
                        {day.condition === "Sunny" && <Sun className="w-8 h-8 text-yellow-500 mx-auto" />}
                        {day.condition === "Cloudy" && <Cloud className="w-8 h-8 text-gray-400 mx-auto" />}
                        {day.condition === "Rain" && <CloudRain className="w-8 h-8 text-blue-400 mx-auto" />}
                      </div>
                      <div className="text-sm">
                        <div className="font-bold">{day.high}°</div>
                        <div className="text-gray-400">{day.low}°</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-400" />
                  Network Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Connection Type</span>
                      <Badge variant="secondary">Fiber</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ISP</span>
                      <span className="text-gray-400">CyberInternet</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>IP Address</span>
                      <span className="text-gray-400">2400:adc1:142:1600</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DNS Server</span>
                      <span className="text-gray-400">8.8.8.8</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Packet Loss</span>
                      <span className="text-green-500">0%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>MTU Size</span>
                      <span className="text-gray-400">1500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Connection Quality</span>
                      <Badge className="bg-green-600">Excellent</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Server Distance</span>
                      <span className="text-gray-400">12 km</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ping">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-400" />
                  Ping Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-700 border border-gray-600">
                    <div className="text-2xl font-bold text-green-500">8ms</div>
                    <div className="text-sm text-gray-400">Google DNS</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 border border-gray-600">
                    <div className="text-2xl font-bold text-yellow-500">15ms</div>
                    <div className="text-sm text-gray-400">Cloudflare</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 border border-gray-600">
                    <div className="text-2xl font-bold text-blue-500">12ms</div>
                    <div className="text-sm text-gray-400">Local Server</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-6 h-6 text-blue-400" />
                  Data Usage Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Today's Usage</span>
                        <span className="font-bold">2.4 GB</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <div className="text-xs text-gray-400 mt-1">60% of daily limit</div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Monthly Usage</span>
                        <span className="font-bold">45.2 GB</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <div className="text-xs text-gray-400 mt-1">75% of monthly limit</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-500">1.2 GB</div>
                      <div className="text-xs text-gray-400">Downloaded</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-500">1.2 GB</div>
                      <div className="text-xs text-gray-400">Uploaded</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-500">156</div>
                      <div className="text-xs text-gray-400">Sessions</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-500">8.5h</div>
                      <div className="text-xs text-gray-400">Online Time</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="bg-gray-800 border border-gray-700 p-6 mt-8">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-lg font-semibold">Developed By Qitmeer Raza</div>
              <div className="text-gray-400">Design By Qitmeer Raza</div>
            </div>

            <div className="flex justify-center items-center gap-6 flex-wrap">
              <a
                href="https://github.com/iamqitmeer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://instagram.com/iamqitmeer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
              <a
                href="https://youtube.com/iamqitmeer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
                <span>YouTube</span>
              </a>
              <a
                href="https://facebook.com/iamqitmeer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
              <a
                href="https://linkedin.com/in/iamqitmeer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://fiverr.com/iamqitmeer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>Fiverr</span>
              </a>
            </div>

            <div className="text-sm text-gray-500 pt-4 border-t border-gray-700">
              © 2024 SpeedTest Pro. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
