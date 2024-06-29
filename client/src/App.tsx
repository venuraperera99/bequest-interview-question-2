import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [checksum, setChecksum] = useState<string>("");
  const [versions, setVersions] = useState<any[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, checksum } = await response.json();
    setData(data);
    setChecksum(checksum);
  };

  const getVersions = async () => {
    const response = await fetch(`${API_URL}/versions`);
    const versions = await response.json();
    setVersions(versions);
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
    await getVersions();
  };

  const verifyData = async () => {
    const currentChecksum = await calculateChecksum(data);
    if (currentChecksum === checksum) {
      alert("Data is intact");
    } else {
      alert("Data has been tampered with");
    }
  };

  const calculateChecksum = async (data: string) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const rollbackData = async (version: number) => {
    await fetch(`${API_URL}/rollback`, {
      method: "POST",
      body: JSON.stringify({ version }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
    await getVersions();
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>

      <div>Versions:</div>
      <ul>
        {versions.map((version, index) => (
          <li key={index}>
            {index}: {version.data}
            <button onClick={() => rollbackData(index)}>Rollback</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
