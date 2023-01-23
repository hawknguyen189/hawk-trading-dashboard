import React, { createContext, useState, useMemo, useCallback } from "react";

export const LeaderboardContext = createContext();

const LeaderboardContextProvider = ({ children }) => {
  const [currentPosition, setCurrentPosition] = useState({}); //current position of leaderboard user
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
        const positionArr = [...jsonResponse.otherPositionRetList];
        let sum = 0;
        if (jsonResponse.otherPositionRetList) {
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
      const result = callCheckPosition(uid);
      positionsArr = [...(await result).positionsArr];
      sumPNL = (await result).sumPNL;
      setCurrentPosition((prevState) => {
        return {
          ...prevState,
          [uid]: { sumPNL: sumPNL, positions: [...positionsArr] },
        };
      });
    },
    [callCheckPosition]
  );
  const updateAllPositions = useCallback(
    async (uids) => {
      let updatedPositions = {};
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
    [callCheckPosition]
  );
  // use useMemo to memoise the value and refresh only when one of these values change.
  const contextValues = useMemo(
    () => ({
      currentPosition,
      setCurrentPosition,
      checkPosition,
      updateAllPositions,
    }),
    [checkPosition, currentPosition, updateAllPositions]
  );
  return (
    <LeaderboardContext.Provider value={contextValues}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export default LeaderboardContextProvider;
