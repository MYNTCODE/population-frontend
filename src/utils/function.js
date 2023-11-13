export function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getChartColor(Population) {
  switch (Population) {
    case "China": //Asia
    case "India":
    case "Japan":
    case "Indonesia":
    case "Pakistan":
    case "Iran":
      return "bg-[#7FADD5] ";

    case "Nigeria": //Africa
    case "Egypt":
    case "Ethiopia":
    case "Democratic Republic of Congo":
      return "bg-[#30AAD3] ";

    case "Mexico": //Americas
    case "United States":
    case "Brazil":
      return "bg-[#3087D3]";

    case "Italy": //Europe
    case "France":
    case "Ukraine":
    case "Russia":
    case "Germany":
    case "Hungary":
    case "Spain":
    case "Poland":
    case "Czechia":
    case "United Kingdom":
      return "bg-[#54A5EC]";
    default:
      return "bg-[#E7EEFF] ";
  }
}

export function filterCountries(data, countriesToExclude) {
  return data.filter(
    (item) => !countriesToExclude.includes(item["Country name"])
  );
}
