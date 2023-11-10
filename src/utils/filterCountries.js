// สร้างฟังก์ชั่นกรองข้อมูล
const filterCountries = (data, countriesToExclude) => {
  return data.filter(
    (item) => !countriesToExclude.includes(item["Country name"])
  );
};

// นำฟังก์ชั่นไปใช้ในโค้ดหลัก
const countriesToExclude = [
  "Less developed regions",
  "Less developed regions, excluding least developed countries",
  "Asia (UN)",
  "Less developed regions, excluding China ",
  "Lower-middle-income countries ",
  "Upper-middle-income countries ",
  "More developed regions",
  "High-income countries ",
  "Africa (UN) ",
  "Europe (UN) ",
  "Least developed countries ",
  "Latin America and the Caribbean (UN)",
  "Low-income countries ",
  "Northern America (UN)",
  "Land-locked developing countries (LLDC) ",
];

const filteredData = filterCountries(data, countriesToExclude);

// ต่อไปนี้คือการใช้ filteredData เป็นข้อมูลที่จะแสดงในแอปของคุณ
