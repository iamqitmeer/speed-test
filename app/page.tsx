"use client"

import { useState, useEffect, useCallback } from "react"
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

const OWM_API_KEY = "055b354669952ef35434839dff99e3f8";
const DEFAULT_CITY_INFO = { name: "Karachi", countryCode: "PK", lat: 24.8607, lon: 67.0011 };

const CACHE_KEYS = {
  IP_INFO: "ipInfo",
  WEATHER_DATA: "weatherData",
};

const CACHE_DURATIONS_MS = {
  IP_INFO: 60 * 60 * 1000, 
  WEATHER_DATA: 30 * 60 * 1000,
};

const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > (CACHE_DURATIONS_MS[key] || CACHE_DURATIONS_MS.WEATHER_DATA)) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
};

const setCachedData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (error) {
    console.error("Error setting cache", error);
  }
};

const mapOwmCondition = (owmMain) => {
  const lowerMain = owmMain.toLowerCase();
  if (lowerMain.includes("clear")) return "Sunny";
  if (lowerMain.includes("clouds")) return "Cloudy";
  if (lowerMain.includes("rain") || lowerMain.includes("drizzle") || lowerMain.includes("thunderstorm")) return "Rain";
  if (lowerMain.includes("snow")) return "Snow";
  if (lowerMain.includes("mist") || lowerMain.includes("fog") || lowerMain.includes("haze")) return "Cloudy";
  return "Cloudy";
};

const getDayName = (dt, index, timezone) => {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return new Date(dt * 1000).toLocaleDateString('en-US', { weekday: 'long', timeZone: timezone });
};


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

  const initialWeatherData = {
    location: "Karachi, Pakistan",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    timezone: "Asia/Karachi",
    forecast: [
      { day: "Today", high: 30, low: 24, condition: "Sunny" },
      { day: "Tomorrow", high: 32, low: 26, condition: "Cloudy" },
      { day: "Wednesday", high: 29, low: 23, condition: "Rain" },
      { day: "Thursday", high: 31, low: 25, condition: "Sunny" },
      { day: "Friday", high: 28, low: 22, condition: "Cloudy" },
    ],
  };
  const [weatherData, setWeatherData] = useState(initialWeatherData);

  const initialNetworkInfo = {
    ipAddress: "...",
    isp: "...",
    connectionType: "Fiber",
    dnsServer: "8.8.8.8",
    packetLoss: "0%",
    mtuSize: "1500",
    connectionQuality: "Excellent",
    serverDistance: "12 km",
    userLocationCity: DEFAULT_CITY_INFO.name,
    userLocationCountryCode: DEFAULT_CITY_INFO.countryCode,
  };
  const [networkInfo, setNetworkInfo] = useState(initialNetworkInfo);

  const [pingTestResults, setPingTestResults] = useState({
    "Google DNS": "...",
    "Cloudflare": "...",
    "Local Server": "...",
  });

  const initialDataUsage = {
    today: { usage: 2.4, limitPercent: 60 },
    monthly: { usage: 45.2, limitPercent: 75 },
    downloaded: 1.2,
    uploaded: 1.2,
    sessions: 156,
    onlineTime: "8.5h",
  };
  const [dataUsageStats, setDataUsageStats] = useState(initialDataUsage);


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchIpAndWeather = useCallback(async () => {
    let cityInfo = DEFAULT_CITY_INFO;
    
    try {
      let ipData = getCachedData(CACHE_KEYS.IP_INFO);
      if (!ipData) {
        const ipResponse = await fetch("https://ip-api.com/json/?fields=status,message,countryCode,city,isp,query,lat,lon,timezone");
        if (!ipResponse.ok) throw new Error("Failed to fetch IP info");
        ipData = await ipResponse.json();
        if (ipData.status !== 'success') throw new Error(ipData.message || "IP API error");
        setCachedData(CACHE_KEYS.IP_INFO, ipData);
      }
      
      setNetworkInfo(prev => ({
        ...prev,
        ipAddress: ipData.query || "N/A",
        isp: ipData.isp || "N/A",
        userLocationCity: ipData.city || DEFAULT_CITY_INFO.name,
        userLocationCountryCode: ipData.countryCode || DEFAULT_CITY_INFO.countryCode,
      }));
      cityInfo = { name: ipData.city, countryCode: ipData.countryCode, lat: ipData.lat, lon: ipData.lon, timezone: ipData.timezone };

    } catch (error) {
      console.error("Error fetching IP info:", error);
      setNetworkInfo(prev => ({
        ...prev,
        ipAddress: "N/A",
        isp: "N/A",
        userLocationCity: DEFAULT_CITY_INFO.name,
        userLocationCountryCode: DEFAULT_CITY_INFO.countryCode,
      }));
    }

    try {
      let cachedWeather = getCachedData(CACHE_KEYS.WEATHER_DATA + `_${cityInfo.name}`);
      if (cachedWeather) {
        setWeatherData(cachedWeather);
        return;
      }

      const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${cityInfo.lat}&lon=${cityInfo.lon}&exclude=minutely,hourly,alerts&appid=${OWM_API_KEY}&units=metric`;
      const weatherResponse = await fetch(weatherApiUrl);
      if (!weatherResponse.ok) throw new Error("Failed to fetch weather data");
      const owmData = await weatherResponse.json();
      
      const current = owmData.current;
      const daily = owmData.daily;

      const newWeatherData = {
        location: `${cityInfo.name}, ${cityInfo.countryCode}`,
        temperature: Math.round(current.temp),
        condition: current.weather[0] ? mapOwmCondition(current.weather[0].main) : "N/A",
        humidity: current.humidity,
        windSpeed: Math.round(current.wind_speed * 3.6), // m/s to km/h
        timezone: owmData.timezone || cityInfo.timezone,
        forecast: daily.slice(0, 5).map((day, index) => ({
          day: getDayName(day.dt, index, owmData.timezone || cityInfo.timezone),
          high: Math.round(day.temp.max),
          low: Math.round(day.temp.min),
          condition: day.weather[0] ? mapOwmCondition(day.weather[0].main) : "N/A",
        })),
      };
      setWeatherData(newWeatherData);
      setCachedData(CACHE_KEYS.WEATHER_DATA + `_${cityInfo.name}`, newWeatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, []);

  useEffect(() => {
    fetchIpAndWeather();
  }, [fetchIpAndWeather]);

  const simulatePingForHosts = useCallback(async () => {
    const ping = async () => 5 + Math.random() * 20; 
    setPingTestResults({
      "Google DNS": `${(await ping()).toFixed(0)}ms`,
      "Cloudflare": `${(await ping()).toFixed(0)}ms`,
      "Local Server": `${(await ping()).toFixed(0)}ms`,
    });
  }, []);

  useEffect(() => {
    simulatePingForHosts();
  }, [simulatePingForHosts]);


  const startSpeedTest = async () => {
    setIsTestRunning(true)
    setTestProgress(0)
    setTestResults({ download: 0, upload: 0, latency: 0, jitter: 0 })

    const totalDuration = 10000; // 10 seconds
    const steps = 100;
    const stepDuration = totalDuration / steps;

    // Phase 1: Latency & Jitter (20% of time, e.g., 2s)
    for (let i = 0; i <= 20; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
      setTestProgress(i);
      if (i === 20) {
        setTestResults((prev) => ({
          ...prev,
          latency: 5 + Math.random() * 15, // 5-20ms
          jitter: 1 + Math.random() * 4,   // 1-5ms
        }));
      }
    }
    
    // Phase 2: Download (40% of time, e.g., 4s)
    const minDownload = 10; // Mbps
    const maxDownload = 150 + Math.random() * 150; // Mbps, random max
    for (let i = 21; i <= 60; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
      setTestProgress(i);
      const currentPhaseProgress = (i - 20) / 40; // 0 to 1 for this phase
      setTestResults((prev) => ({
        ...prev,
        download: minDownload + currentPhaseProgress * (maxDownload - minDownload),
      }));
    }
    setTestResults((prev) => ({ ...prev, download: maxDownload }));


    // Phase 3: Upload (40% of time, e.g., 4s)
    const minUpload = 5; // Mbps
    const maxUpload = 50 + Math.random() * 100; // Mbps, random max
    for (let i = 61; i <= 100; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
      setTestProgress(i);
      const currentPhaseProgress = (i - 60) / 40; // 0 to 1 for this phase
      setTestResults((prev) => ({
        ...prev,
        upload: minUpload + currentPhaseProgress * (maxUpload - minUpload),
      }));
    }
    setTestResults((prev) => ({ ...prev, upload: maxUpload }));

    setIsTestRunning(false)
  }

  const getWeatherIcon = (condition) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("sunny") || lowerCondition.includes("clear")) return <Sun className="w-12 h-12 text-yellow-500" />;
    if (lowerCondition.includes("rain")) return <CloudRain className="w-12 h-12 text-blue-400" />;
    return <Cloud className="w-12 h-12 text-gray-400" />; 
  };

  const getForecastIcon = (condition, className = "w-8 h-8 mx-auto") => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("sunny") || lowerCondition.includes("clear")) return <Sun className={`${className} text-yellow-500`} />;
    if (lowerCondition.includes("rain")) return <CloudRain className={`${className} text-blue-400`} />;
    return <Cloud className={`${className} text-gray-400`} />;
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wifi className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold">SpeedTest Pro</h1>
          </div>
          <div className="text-sm text-gray-400">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-blue-400">Internet Speed Test</CardTitle>
            <CardDescription className="text-gray-400">
              Test your internet connection speed and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {isTestRunning && (
              <div className="space-y-2">
                <Progress value={testProgress} className="h-3" />
                <p className="text-center text-sm text-gray-400">Testing... {testProgress}%</p>
              </div>
            )}

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Karachi Nazimabad, PK</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Server className="w-4 h-4" />
                <span>{networkInfo.isp === "..." ? "CyberInternet Server" : networkInfo.isp}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" />
                <span>{networkInfo.ipAddress.includes(':') ? "IPv6 Connected" : "IPv4 Connected"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  {getForecastIcon(weatherData.condition, "w-6 h-6")}
                  Current Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {getWeatherIcon(weatherData.condition)}
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
                      <span>{Math.round(weatherData.temperature + 2)}°C</span>
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
                    <div key={index} className="text-center p-4 bg-gray-700 border border-gray-600 rounded-md">
                      <div className="font-semibold mb-2">{day.day}</div>
                      <div className="mb-2">
                        {getForecastIcon(day.condition)}
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
                      <Badge variant="secondary">{networkInfo.connectionType}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ISP</span>
                      <span className="text-gray-400">{networkInfo.isp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>IP Address</span>
                      <span className="text-gray-400">{networkInfo.ipAddress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DNS Server</span>
                      <span className="text-gray-400">{networkInfo.dnsServer}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Packet Loss</span>
                      <span className="text-green-500">{networkInfo.packetLoss}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>MTU Size</span>
                      <span className="text-gray-400">{networkInfo.mtuSize}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Connection Quality</span>
                      <Badge className="bg-green-600">{networkInfo.connectionQuality}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Server Distance</span>
                      <span className="text-gray-400">{networkInfo.serverDistance}</span>
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
                  <div className="text-center p-4 bg-gray-700 border border-gray-600 rounded-md">
                    <div className="text-2xl font-bold text-green-500">{pingTestResults["Google DNS"]}</div>
                    <div className="text-sm text-gray-400">Google DNS</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 border border-gray-600 rounded-md">
                    <div className="text-2xl font-bold text-yellow-500">{pingTestResults["Cloudflare"]}</div>
                    <div className="text-sm text-gray-400">Cloudflare</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 border border-gray-600 rounded-md">
                    <div className="text-2xl font-bold text-blue-500">{pingTestResults["Local Server"]}</div>
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
                        <span className="font-bold">{dataUsageStats.today.usage.toFixed(1)} GB</span>
                      </div>
                      <Progress value={dataUsageStats.today.limitPercent} className="h-2" />
                      <div className="text-xs text-gray-400 mt-1">{dataUsageStats.today.limitPercent}% of daily limit</div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Monthly Usage</span>
                        <span className="font-bold">{dataUsageStats.monthly.usage.toFixed(1)} GB</span>
                      </div>
                      <Progress value={dataUsageStats.monthly.limitPercent} className="h-2" />
                      <div className="text-xs text-gray-400 mt-1">{dataUsageStats.monthly.limitPercent}% of monthly limit</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-500">{dataUsageStats.downloaded.toFixed(1)} GB</div>
                      <div className="text-xs text-gray-400">Downloaded</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-500">{dataUsageStats.uploaded.toFixed(1)} GB</div>
                      <div className="text-xs text-gray-400">Uploaded</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-500">{dataUsageStats.sessions}</div>
                      <div className="text-xs text-gray-400">Sessions</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-500">{dataUsageStats.onlineTime}</div>
                      <div className="text-xs text-gray-400">Online Time</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="bg-gray-800 border border-gray-700 p-6 mt-8 rounded-lg">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-lg font-semibold">Developed By Qitmeer Raza</div>
              <div className="text-gray-400">Design By Qitmeer Raza</div>
            </div>

            <div className="flex justify-center items-center gap-6 flex-wrap">
              <a
                href="https://github.com/iamqitmeer"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://instagram.com/iamqitmeer"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
              <a
                href="https://youtube.com/iamqitmeer"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
                <span>YouTube</span>
              </a>
              <a
                href="https://facebook.com/iamqitmeer"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
              <a
                href="https://linkedin.com/in/iamqitmeer"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://fiverr.com/iamqitmeer"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5" /> 
                <span>Fiverr</span>
              </a>
            </div>

            <div className="text-sm text-gray-500 pt-4 border-t border-gray-700">
              © {new Date().getFullYear()} SpeedTest Pro. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
