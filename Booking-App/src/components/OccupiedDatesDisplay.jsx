import React, { useState, useEffect, useContext } from "react";
import "./OccupiedDatesDisplay.css";
import { UserContext } from "./UserContext";
import { getBookings } from "../api/bookingService"; // ✅ use API service

const OccupiedDatesDisplay = () => {
  const [groupedDates, setGroupedDates] = useState({});
  const { user } = useContext(UserContext);

  // fallback for refresh
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser;

  useEffect(() => {
    if (!currentUser) return;

    // ================== FETCH BOOKINGS ==================
    async function fetchDates() {
      try {
        const data = await getBookings(); // ✅ already sends token
        console.log("Bookings:", data);
        return data;
      } catch (error) {
        console.error("Error fetching dates:", error);
        return [];
      }
    }

    // ================== PROCESS DATES ==================
    async function processAndSetDates() {
      const fetchedDates = await fetchDates();

      const processDates = (dates) => {
        const dateStrings = dates.map((entry) => entry.date);
        const sortedDates = dateStrings.sort();

        const ranges = {};
        let currentMonth = "";
        let currentRange = null;

        sortedDates.forEach((dateStr) => {
          const date = new Date(`${dateStr}T00:00:00`);
          if (isNaN(date.getTime())) return;

          const month = date.toLocaleString("default", {
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

      setGroupedDates(processDates(fetchedDates));
    }

    processAndSetDates();
  }, [currentUser]);

  return (
    <div className="occupied-dates-container">
      {Object.keys(groupedDates).length > 0 ? (
        Object.keys(groupedDates).map((month) => (
          <div key={month} className="month-section">
            <h2 className="month-title">{month}</h2>

            <div className="date-cards">
              {groupedDates[month].map((range, index) => (
                <div key={index} className="date-card">
                  <p className="date-range">
                    {new Date(range.startDate).toLocaleDateString()} -{" "}
                    {new Date(range.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default OccupiedDatesDisplay;