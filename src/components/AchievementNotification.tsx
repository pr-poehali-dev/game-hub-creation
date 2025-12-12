import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Achievement, getRarityColor } from "@/lib/achievements";

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementNotification = ({ achievement, onClose }: AchievementNotificationProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="p-4 bg-primary/10 border-primary/30 shadow-lg min-w-[300px] max-w-md">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Icon name={achievement.icon} size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              🎉 Достижение разблокировано!
            </div>
            <div className="font-bold text-lg mb-1">{achievement.title}</div>
            <div className="text-sm text-muted-foreground mb-2">
              {achievement.description}
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getRarityColor(achievement.rarity)}>
                {achievement.rarity}
              </Badge>
              <div className="text-sm font-medium text-primary">
                +{achievement.points} очков
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AchievementNotification;
