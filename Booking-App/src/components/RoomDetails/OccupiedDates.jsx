import React, { useState, useEffect, useContext } from "react";
import "./OccupiedDatesDisplay.css";
import { UserContext } from "./UserContext";

const OccupiedDatesDisplay = () => {
  const [groupedDates, setGroupedDates] = useState({});
  const { user } = useContext(UserContext);

  const BASE_URL = "https://booking-app-backend-4vb9.onrender.com/api";

  useEffect(() => {
    if (!user?.token) return;

    const fetchDates = async () => {
      try {
        const response = await fetch(`${BASE_URL}/occupied-dates/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${user.token}`,
          },
        });

        if (!response.ok) throw new Error("Fetch failed");

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching dates:", error);
        return [];
      }
    };

    const processDates = (dates) => {
      const sortedDates = dates
        .map((d) => d.date)
        .sort();

      const ranges = {};
      let currentMonth = "";
      let currentRange = null;

      sortedDates.forEach((dateStr) => {
        const date = new Date(`${dateStr}T00:00:00`);

        if (isNaN(date)) return;

        const month = date.toLocaleString("en-IN", {
          month: "long",
          year: "numeric",
        });

        if (month !== currentMonth) {
          if (currentRange) {
            if (!ranges[currentMonth]) ranges[currentMonth] = [];
            ranges[currentMonth].push(currentRange);
          }

          currentMonth = month;
          currentRange = { startDate: dateStr, endDate: dateStr };
        } else {
          const prevDate = new Date(`${currentRange.endDate}T00:00:00`);
          prevDate.setDate(prevDate.getDate() + 1);

          if (
            date.toISOString().split("T")[0] ===
            prevDate.toISOString().split("T")[0]
          ) {
            currentRange.endDate = dateStr;
          } else {
            if (!ranges[currentMonth]) ranges[currentMonth] = [];
            ranges[currentMonth].push(currentRange);
            currentRange = { startDate: dateStr, endDate: dateStr };
          }
        }
      });

      if (currentRange) {
        if (!ranges[currentMonth]) ranges[currentMonth] = [];
        ranges[currentMonth].push(currentRange);
      }

      return ranges;
    };

    const loadData = async () => {
      const data = await fetchDates();
      setGroupedDates(processDates(data));
    };

    loadData();
  }, [user]);

  return (
    <div className="occupied-dates-container">
      {Object.keys(groupedDates).length === 0 ? (
        <p>No bookings found</p>
      ) : (
        Object.keys(groupedDates).map((month) => (
          <div key={month} className="month-section">
            <h2 className="month-title">{month}</h2>

            <div className="date-cards">
              {groupedDates[month].map((range, index) => (
                <div key={index} className="date-card">
                  <p className="date-range">
                    {new Date(range.startDate).toLocaleDateString("en-IN")} -{" "}
                    {new Date(range.endDate).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OccupiedDatesDisplay;