export function CurrentWeather({ city, temperature, condition }) {
  return (
    <div className="text-center py-8">
      <h1 className="text-[#F5F5F5] mb-6">{city}</h1>
      <div className="text-[#00A2FF] text-[120px] leading-none mb-2">
        {temperature}°
      </div>
      <p className="text-[#F5F5F5] text-[20px]">{condition}</p>
    </div>
  );
}
