import { Cloud, CloudRain, Sun, Moon, CloudSun } from "lucide-react";

const iconMap = {
  cloud: Cloud,
  "cloud-rain": CloudRain,
  sun: Sun,
  moon: Moon,
  "cloud-sun": CloudSun,
};

export function HourlyForecast({ hourly }) {
  return (
    <div className="mt-8 pt-8 border-t border-[#333333]">
      <div className="w-full overflow-x-auto hourly-scrollbar">
        <div className="flex gap-6 pb-4 whitespace-nowrap">
          {hourly.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Cloud;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 min-w-[80px]"
              >
                <div className="text-[#F5F5F5] text-sm">{item.time}</div>
                <IconComponent className="h-8 w-8 text-[#00A2FF]" />
                <div className="text-[#00A2FF]">{item.temp}°</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
