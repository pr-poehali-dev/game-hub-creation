import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

const Profile = () => {
  const userStats = {
    name: "Игрок #1337",
    level: 42,
    experience: 75,
    gamesPlayed: 156,
    achievements: 38,
    rank: "Мастер",
  };

  const recentAchievements = [
    { id: 1, title: "Первая победа", icon: "Trophy", rarity: "common" },
    { id: 2, title: "Марафонец", icon: "Zap", rarity: "rare" },
    { id: 3, title: "Перфекционист", icon: "Star", rarity: "epic" },
    { id: 4, title: "Легенда", icon: "Crown", rarity: "legendary" },
  ];

  const rewards = [
    { id: 1, name: "100 монет", earned: true },
    { id: 2, name: "Редкий скин", earned: true },
    { id: 3, name: "VIP статус", earned: false },
    { id: 4, name: "Эксклюзивный значок", earned: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 md:col-span-1">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="User" size={48} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userStats.name}</h2>
                <Badge variant="secondary" className="mt-2">{userStats.rank}</Badge>
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Уровень {userStats.level}</span>
                  <span>{userStats.experience}%</span>
                </div>
                <Progress value={userStats.experience} className="h-2" />
              </div>
            </div>
          </Card>

          <Card className="p-6 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="BarChart" size={24} />
              Статистика
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary">{userStats.gamesPlayed}</div>
                <div className="text-sm text-muted-foreground">Игр сыграно</div>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary">{userStats.achievements}</div>
                <div className="text-sm text-muted-foreground">Достижений</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Award" size={24} />
              Последние достижения
            </h3>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name={achievement.icon} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                  </div>
                  <Badge
                    variant={achievement.rarity === "legendary" ? "default" : "secondary"}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Gift" size={24} />
              Призы и награды
            </h3>
            <div className="space-y-3">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    reward.earned
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-secondary/30 opacity-60"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    reward.earned ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <Icon
                      name={reward.earned ? "Check" : "Lock"}
                      size={20}
                      className={reward.earned ? "text-primary" : "text-muted-foreground"}
                    />
                  </div>
                  <div className="flex-1 font-medium">{reward.name}</div>
                  {reward.earned && (
                    <Badge variant="default">Получено</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
