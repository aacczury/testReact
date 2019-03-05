const YearFind = (yearData, th) => {
  const yearUids = Object.keys(yearData);
  let year = {};

  yearUids.map(uid => {
      if("th" in yearData[uid] && th === yearData[uid].th) {
        year = yearData[uid];
      }
      return 0;
  });

  return year;
}

export default YearFind;