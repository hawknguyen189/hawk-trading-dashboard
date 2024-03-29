import React, { createContext, useState, useMemo, useCallback } from "react";

export const LeaderboardContext = createContext();

const LeaderboardContextProvider = ({ children }) => {
  const [currentPosition, setCurrentPosition] = useState({}); //current position of leaderboard user
  const [CMEReport, setCMEReport] = useState("");
  //call check current position of a specific user
  const callCheckPosition = useCallback(async (uid) => {
    // console.log("call check price")
    const endpoint = "checkpositions";
    try {
      let response = await fetch(`/binance/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ uid: uid }), // body data type must match "Content-Type" header
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const jsonResponse = await response.json();
        let positionArr = [];
        positionArr = [...jsonResponse.otherPositionRetList];
        let sum = 0;
        if (Array.isArray(jsonResponse.otherPositionRetList)) {
          jsonResponse.otherPositionRetList.forEach((e) => {
            sum = e.pnl + sum;
          });
        }
        return { positionsArr: [...positionArr], sumPNL: sum };
      }
    } catch (e) {
      console.log("calling check position ", e);
    }
  }, []);
  //call check current position of a specific user
  const checkPosition = useCallback(
    async (uid) => {
      let positionsArr = [];
      let sumPNL = 0;
      const result = await callCheckPosition(uid);
      positionsArr = [...result.positionsArr];
      sumPNL = result.sumPNL;
      setCurrentPosition((prevState) => {
        return {
          ...prevState,
          [uid]: { sumPNL: sumPNL, positions: [...positionsArr] },
        };
      });
    },
    [callCheckPosition]
  );
  const callCMEReport = useCallback(async (uid) => {
    const endpoint = "callcmereport";
    try {
      let response = await fetch(`http://localhost:3001/cmereport/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const jsonResponse = await response.json();
        const lines = jsonResponse.split("\n");
        let date;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes("AS OF")) {
            // date = lines[i].replace(/\D/g, "");
            const dateFormat = /\d{2}\/\d{2}\/\d{2}/;
            const dateString = lines[i].match(dateFormat)[0];
            const unformatedDate = new Date(dateString);
            let options = { year: "numeric", month: "short", day: "numeric" };
            date = unformatedDate.toLocaleDateString("en-US", options);
          }
        }

        const targetLine = lines.find((line) => line.includes("CHANGES FROM"));
        const dataLine = lines[lines.indexOf(targetLine) + 1];

        const elements = dataLine.split(" ").filter(Boolean);
        const long = parseInt(elements[3]);
        const short = parseInt(elements[4]);
        setCMEReport({ date: date, long: long, short: short });
        // const removedChars = jsonResponse.replace(/[-|\n\r,]/g, '');
        // const splitArray = removedChars.split(" ");
        // const foo = splitArray.join(" ")
        // console.log(jsonResponse);
        // console.log(foo);
      }
    } catch (e) {
      console.log("calling binnance error ", e);
    }
  }, []);
  const updateAllPositions = useCallback(
    async (uids) => {
      let updatedPositions = {};
      callCMEReport();
      for (let i = 0; i < uids.length; i++) {
        const callFunc = async () => {
          let positionsArr = [];
          let sumPNL = 0;
          const result = callCheckPosition(uids[i].encryptedUid);
          positionsArr = [...(await result).positionsArr];
          sumPNL = (await result).sumPNL;
          updatedPositions[uids[i].encryptedUid] = {
            sumPNL: sumPNL,
            positions: [...positionsArr],
          };
        };
        await callFunc();
      }
      //   uids.forEach(async (e) => {
      //     let positionsArr = [];
      //     let sumPNL = 0;
      //     const result = callCheckPosition(e.encryptedUid);
      //     positionsArr = [...result.positionsArr];
      //     sumPNL = result.sumPNL;
      //     updatedPositions[e.encryptedUid] = {
      //       sumPNL: sumPNL,
      //       positions: [...positionsArr],
      //     };
      //   });
      setCurrentPosition({ ...updatedPositions });
    },
    [callCMEReport, callCheckPosition]
  );

  // use useMemo to memoise the value and refresh only when one of these values change.
  const contextValues = useMemo(
    () => ({
      currentPosition,
      setCurrentPosition,
      checkPosition,
      updateAllPositions,
      callCMEReport,
      CMEReport,
      setCMEReport,
    }),
    [
      CMEReport,
      callCMEReport,
      checkPosition,
      currentPosition,
      updateAllPositions,
    ]
  );
  return (
    <LeaderboardContext.Provider value={contextValues}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export default LeaderboardContextProvider;
