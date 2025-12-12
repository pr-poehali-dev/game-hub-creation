import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [activeNav, setActiveNav] = useState("home");

  const games = [
    {
      id: 1,
      title: "Крестики-нолики",
      difficulty: "easy",
      players: 1240,
      rating: 4.5,
      category: "Логика",
    },
    {
      id: 2,
      title: "Шахматы",
      difficulty: "hard",
      players: 3890,
      rating: 4.8,
      category: "Стратегия",
    },
    {
      id: 3,
      title: "Судоку",
      difficulty: "medium",
      players: 2150,
      rating: 4.6,
      category: "Головоломка",
    },
    {
      id: 4,
      title: "2048",
      difficulty: "medium",
      players: 5670,
      rating: 4.7,
      category: "Головоломка",
    },
    {
      id: 5,
      title: "Пазлы",
      difficulty: "easy",
      players: 980,
      rating: 4.3,
      category: "Казуальная",
    },
    {
      id: 6,
      title: "Го",
      difficulty: "expert",
      players: 1560,
      rating: 4.9,
      category: "Стратегия",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "expert":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Легко";
      case "medium":
        return "Средне";
      case "hard":
        return "Сложно";
      case "expert":
        return "Эксперт";
      default:
        return difficulty;
    }
  };

  const filteredGames = (difficulty: string) => {
    if (difficulty === "all") return games;
    return games.filter((game) => game.difficulty === difficulty);
  };

  const renderContent = () => {
    switch (activeNav) {
      case "profile":
        return (
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 md:col-span-1">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="User" size={48} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Игрок #1337</h2>
                    <Badge variant="secondary" className="mt-2">Мастер</Badge>
                  </div>
                </div>
              </Card>
              <Card className="p-6 md:col-span-2">
                <h3 className="text-xl font-bold mb-4">Достижения</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-primary">156</div>
                    <div className="text-sm text-muted-foreground">Игр сыграно</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-primary">38</div>
                    <div className="text-sm text-muted-foreground">Достижений</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      case "leaderboard":
        return (
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-4xl font-bold mb-6 flex items-center gap-3">
              <Icon name="Trophy" size={40} className="text-primary" />
              Таблица лидеров
            </h1>
            <Card className="p-6">
              {[1, 2, 3, 4, 5].map((rank) => (
                <div
                  key={rank}
                  className={`flex items-center gap-4 p-4 mb-3 rounded-lg ${
                    rank <= 3 ? "bg-primary/5 border border-primary/20" : "bg-secondary/30"
                  }`}
                >
                  <div className={`text-3xl font-bold w-12 text-center ${
                    rank === 1 ? "text-yellow-400" : rank === 2 ? "text-gray-300" : rank === 3 ? "text-amber-600" : "text-muted-foreground"
                  }`}>
                    {rank}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">Игрок #{rank}</div>
                  </div>
                  <div className="text-2xl font-bold text-primary">{(20000 - rank * 1000).toLocaleString()}</div>
                </div>
              ))}
            </Card>
          </div>
        );
      default:
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-5xl font-bold mb-4">Игровой портал</h1>
                <p className="text-xl text-muted-foreground">
                  От самых лёгких до самых сложных игр
                </p>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-8">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="easy">Легко</TabsTrigger>
                  <TabsTrigger value="medium">Средне</TabsTrigger>
                  <TabsTrigger value="hard">Сложно</TabsTrigger>
                  <TabsTrigger value="expert">Эксперт</TabsTrigger>
                </TabsList>

                {["all", "easy", "medium", "hard", "expert"].map((difficulty) => (
                  <TabsContent key={difficulty} value={difficulty}>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredGames(difficulty).map((game) => (
                        <Card
                          key={game.id}
                          className="p-6 hover:border-primary/50 transition-all cursor-pointer group"
                        >
                          <div className="mb-4">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                                {game.title}
                              </h3>
                              <Badge className={getDifficultyColor(game.difficulty)}>
                                {getDifficultyLabel(game.difficulty)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{game.category}</p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Icon name="Users" size={16} className="text-muted-foreground" />
                                <span>{game.players.toLocaleString()} игроков</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Icon name="Star" size={16} className="text-yellow-400" />
                                <span className="font-medium">{game.rating}</span>
                              </div>
                            </div>
                            <Button className="w-full" variant="default">
                              <Icon name="Play" size={16} className="mr-2" />
                              Играть
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Icon name="Gamepad2" size={32} className="text-primary" />
              <span className="text-2xl font-bold">GameHub</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant={activeNav === "home" ? "default" : "ghost"}
                onClick={() => setActiveNav("home")}
                className="gap-2"
              >
                <Icon name="Home" size={18} />
                Главная
              </Button>
              <Button
                variant={activeNav === "profile" ? "default" : "ghost"}
                onClick={() => setActiveNav("profile")}
                className="gap-2"
              >
                <Icon name="User" size={18} />
                Профиль
              </Button>
              <Button
                variant={activeNav === "leaderboard" ? "default" : "ghost"}
                onClick={() => setActiveNav("leaderboard")}
                className="gap-2"
              >
                <Icon name="Trophy" size={18} />
                Рейтинг
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {renderContent()}
    </div>
  );
};

export default Index;
