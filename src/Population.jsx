import { useEffect, useState } from "react";
import { formatNumberWithCommas, getChartColor } from "./utils/function";

const filterCountries = (data, countriesToExclude) => {
  return data.filter(
    (item) => !countriesToExclude.includes(item["Country name"])
  );
};

// const displayedYears = [
//   1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010,
//   2015, 2021,
// ];

const Population = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [measuringWidth, setMeasuringWidth] = useState(0);
  const [measuringLeft, setMeasuringLeft] = useState(0);
  const [
    latestYearWithPopulationIncrease,
    setLatestYearWithPopulationIncrease,
  ] = useState(0);
  const [
    measuringLeftWithPopulationIncrease,
    setMeasuringLeftWithPopulationIncrease,
  ] = useState(0);
  const [yearWithPopulationIncrease, setYearWithPopulationIncrease] =
    useState(0);

  useEffect(() => {
    const fetchDataFromAPI = async (page) => {
      try {
        const response = await fetch(
          `https://backend-api-population.vercel.app/api/v1/population?page=${page}`
        );
        const newData = await response.json();
        // console.log("DATA", newData);

        const excludedCountries = [
          "Less developed regions",
          "Less developed regions, excluding least developed countries",
          "Asia (UN)",
          "Less developed regions, excluding China",
          "Lower-middle-income countries",
          "Upper-middle-income countries",
          "More developed regions",
          "High-income countries",
          "Africa (UN)",
          "Europe (UN)",
          "Least developed countries",
          "Latin America and the Caribbean (UN)",
          "Low-income countries",
          "Northern America (UN)",
          "Land-locked developing countries (LLDC)",
          "World",
        ];
        const updatedData = filterCountries(newData.data, excludedCountries);

        setFilteredData((prevData) => {
          updatedData.forEach((newItem) => {
            const existingItemIndex = prevData.findIndex(
              (prevItem) => prevItem["Country name"] === newItem["Country name"]
            );

            if (existingItemIndex !== -1) {
              prevData[existingItemIndex]["Population"] +=
                newItem["Population"];
              prevData[existingItemIndex]["Year"].push(newItem["Year"]);
              const latestYear = Math.max(
                ...prevData[existingItemIndex]["Year"]
              );
              prevData[existingItemIndex]["Year"] = [latestYear];
            } else {
              prevData.push({
                _id: newItem._id,
                "Country name": newItem["Country name"],
                Population: newItem["Population"],
                Year: [newItem["Year"]],
              });
            }
          });

          prevData.sort((a, b) => {
            const latestYearA = Math.max(...a["Year"]);
            const latestYearB = Math.max(...b["Year"]);
            return b.Population - a.Population || latestYearB - latestYearA;
          });

          const slicedData = prevData.slice(0, 12);
          const maxGraphWidth = window.innerWidth;
          const scale =
            maxGraphWidth /
            //totalPopulation;
            Math.max(...slicedData.map((item) => item.Population));

          slicedData.forEach((item) => {
            item.graphWidth = item.Population * scale;
          });

          setTotalPopulation(
            slicedData.reduce((total, item) => total + item.Population, 0)
          );

          const measuringLeft =
            prevData.length > 0 ? prevData[0].graphWidth : 0;

          setMeasuringWidth(maxGraphWidth);
          setMeasuringLeft(measuringLeft);

          const latestYearWithPopulationIncrease = Math.max(
            ...slicedData.flatMap((item) => item["Year"])
          );

          setYearWithPopulationIncrease(latestYearWithPopulationIncrease);

          const measuringLeftWithPopulationIncrease =
            ((latestYearWithPopulationIncrease - 1950) / (2021 - 1950)) * 90 +
            2;

          setLatestYearWithPopulationIncrease(latestYearWithPopulationIncrease);
          setMeasuringLeftWithPopulationIncrease(
            measuringLeftWithPopulationIncrease
          );

          return page === 1 ? slicedData : [...slicedData];
        });

        // console.log(
        //   "measuringLeftWithPopulationIncrease:",
        //   measuringLeftWithPopulationIncrease
        // );
        // console.log("measuringWidth:", measuringWidth);

        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const intervalId = setInterval(() => {
      fetchDataFromAPI(currentPage + 3);
    }, 50);

    return () => clearInterval(intervalId);
  }, [
    currentPage,
    totalPopulation,
    latestYearWithPopulationIncrease,
    measuringLeft,
    measuringLeftWithPopulationIncrease,
    measuringWidth,
  ]);

  return (
    <section className="flex h-screen bg-[#0D1333]">
      <div className="chart-container flex-col text-right border-solid border-black ">
        <h2 className="text-black ml-10 font-bold text-4xl mt-[-70px]">
          Population growth per country 1950 to 2021
        </h2>
        <div className="total-population text-slate-600  ml-10 mb-6  font-bold text-2xl">
          Total Population: {formatNumberWithCommas(totalPopulation)}
        </div>
        {filteredData.map((item, index) => (
          <div key={index} className="flex">
            <p className="country-name text-slate-600 font-semibold text-right align-middle justify-center w-[250px] p-2 ml-0 absolute">
              {item["Country name"]}
            </p>
            <div className="chart w-[100%]">
              <div
                className={`ml-[250px] h-[25px] border align-middle justify-center mt-2 ${getChartColor(
                  item["Country name"]
                )}`}
                style={{
                  width: `${item.graphWidth}px`,
                  maxWidth: "1300px",
                }}
              ></div>
            </div>
            <p className="text-slate-500 text-[15px] mt-[9px] ml-2">
              {formatNumberWithCommas(item.Population)}
            </p>{" "}
          </div>
        ))}
        {/* <div className="total-population text-black w-[98%] font-semibold pr-20 text-2xl text-right">
          Total: {formatNumberWithCommas(totalPopulation)}
        </div> */}
        <div className="x-axis w-[92%] bg-black h-[1px] ml-10 mt-10">
          {/* Render tick marks or labels for the selected years */}
          {Array.from({ length: 75 }, (_, index) => 1950 + index).map(
            (year, index) => (
              <div key={index} style={{ position: "relative", zIndex: 1 }}>
                {" "}
                {year === yearWithPopulationIncrease && (
                  <div className=" mt-[-36px]  relative text-3xl text-black">
                    {year}
                  </div>
                )}
                <div
                  className="year-tick"
                  style={{
                    color: "black",
                    fontSize: "13px",
                    marginLeft: "10px",
                    position: "absolute",
                    left: `${((year - 1950) / (2021 - 1950)) * 90 + 2}%`,
                  }}
                >
                  <div className=" rounded-full w-[1px] h-2 bg-black "></div>{" "}
                  <p className="ml-[-15px]">{index % 5 === 0 ? year : null}</p>
                </div>
                {year === yearWithPopulationIncrease && (
                  <div
                    className="measuring w-[15px] relative z-10 bottom-[10px]"
                    style={{
                      left: `${((year - 1950) / (2021 - 1950)) * 90 + 2}%`,
                      marginBottom: "-15px",
                      zIndex: 2,
                    }}
                  >
                    <img
                      src="https://cdn.discordapp.com/attachments/1144637676016898219/1172439721826328587/down-filled-triangular-arrow.png?ex=65605294&is=654ddd94&hm=73a24f60a6aa4f95414c89ee40e6f4839fabe2e790b81960fa6a5e213043db47&"
                      alt="Arrow"
                    ></img>
                  </div>
                )}
              </div>
            )
          )}
        </div>{" "}
        <div className="flex text-center align-middle justify-center w-full  h-[5%]">
          <a
            href="https://github.com/MYNTCODE"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            <p className="pt-16">MYNTCODE | GitHub</p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Population;
