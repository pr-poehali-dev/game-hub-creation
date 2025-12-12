import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

const Leaderboard = () => {
  const topPlayers = [
    { id: 1, name: "ProGamer2024", score: 15420, rank: 1, level: 89, trend: "up" },
    { id: 2, name: "MasterChief", score: 14890, rank: 2, level: 85, trend: "up" },
    { id: 3, name: "ShadowNinja", score: 14350, rank: 3, level: 82, trend: "same" },
    { id: 4, name: "DragonSlayer", score: 13890, rank: 4, level: 78, trend: "down" },
    { id: 5, name: "PhoenixRise", score: 13420, rank: 5, level: 76, trend: "up" },
    { id: 6, name: "IceQueen", score: 12980, rank: 6, level: 74, trend: "same" },
    { id: 7, name: "ThunderBolt", score: 12450, rank: 7, level: 71, trend: "up" },
    { id: 8, name: "CyberPunk", score: 11920, rank: 8, level: 69, trend: "down" },
    { id: 9, name: "QuantumLeap", score: 11380, rank: 9, level: 66, trend: "same" },
    { id: 10, name: "VoidWalker", score: 10850, rank: 10, level: 64, trend: "up" },
  ];

  const weeklyTop = [
    { id: 1, name: "SpeedRunner", score: 2840, games: 42 },
    { id: 2, name: "FlashStep", score: 2560, games: 38 },
    { id: 3, name: "QuickDraw", score: 2310, games: 35 },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-amber-600";
    return "text-muted-foreground";
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return "Crown";
    return "Award";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Icon name="Trophy" size={40} className="text-primary" />
            Таблица лидеров
          </h1>
          <p className="text-muted-foreground">Лучшие игроки платформы</p>
        </div>

        <Tabs defaultValue="all-time" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="all-time">Всё время</TabsTrigger>
            <TabsTrigger value="weekly">Неделя</TabsTrigger>
          </TabsList>

          <TabsContent value="all-time">
            <Card className="p-6">
              <div className="space-y-3">
                {topPlayers.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-secondary/50 ${
                      player.rank <= 3 ? "bg-primary/5 border border-primary/20" : "bg-secondary/30"
                    }`}
                  >
                    <div className={`text-3xl font-bold ${getRankColor(player.rank)} w-12 text-center`}>
                      {player.rank}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name={getRankIcon(player.rank)} size={24} className={getRankColor(player.rank)} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg">{player.name}</div>
                      <div className="text-sm text-muted-foreground">Уровень {player.level}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{player.score.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">очков</div>
                    </div>
                    <div className="w-8">
                      {player.trend === "up" && (
                        <Icon name="TrendingUp" size={20} className="text-green-500" />
                      )}
                      {player.trend === "down" && (
                        <Icon name="TrendingDown" size={20} className="text-red-500" />
                      )}
                      {player.trend === "same" && (
                        <Icon name="Minus" size={20} className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="weekly">
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Icon name="Calendar" size={20} />
                  Топ недели
                </h3>
                <p className="text-sm text-muted-foreground">Самые активные игроки за последние 7 дней</p>
              </div>
              <div className="space-y-3">
                {weeklyTop.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div className={`text-3xl font-bold ${getRankColor(index + 1)} w-12 text-center`}>
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="Crown" size={24} className={getRankColor(index + 1)} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg">{player.name}</div>
                      <div className="text-sm text-muted-foreground">{player.games} игр сыграно</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{player.score.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">очков за неделю</div>
                    </div>
                    <Badge variant="default" className="ml-2">
                      <Icon name="Flame" size={14} className="mr-1" />
                      Hot
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
