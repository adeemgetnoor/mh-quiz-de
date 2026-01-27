"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "./page.module.css";

export default function Admin() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);
  const fetchResults = async () => {
    try {
      const response = await fetch("/a/quiz/api/get-results/");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleExportCSV = () => {
    window.open("/a/quiz/api/export-csv/", "_blank");
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Admin - Dosha Quiz Results</title>
      </Head>

      <div className={styles["admin-container"]}>
        <div className={styles["admin-header"]}>
          <h1>Dosha Quiz Results</h1>
          <button onClick={handleExportCSV} className={styles["export-btn"]}>
            Export CSV
          </button>
        </div>

        <div className={styles["results-table"]}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tr}>
                <th className={styles.th}>NAME</th>
                <th className={styles.th}>DATE OF BIRTH</th>
                <th className={styles.th}>EMAIL ADDRESS</th>
                <th className={styles.th}>PHONE NO</th>
                <th className={styles.th}>VATA SCORE</th>
                <th className={styles.th}>PITTA SCORE</th>
                <th className={styles.th}>KAPHA SCORE</th>
                <th className={styles.th}>CREATED TIME</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result._id || index} className={styles.tr}>
                  <td className={styles.td}>{result.name}</td>
                  <td className={styles.td}>{result.dateOfBirth}</td>
                  <td className={styles.td}>{result.email}</td>
                  <td className={styles.td}>{result.phone}</td>
                  <td className={styles.td}>{result.scores?.vata || 0}</td>
                  <td className={styles.td}>{result.scores?.pitta || 0}</td>
                  <td className={styles.td}>{result.scores?.kapha || 0}</td>
                  <td className={styles.td}>
                    {result.createdAt
                      ? new Date(result.createdAt).toLocaleString()
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
