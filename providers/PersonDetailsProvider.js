import axios from "axios";
import React, { useState, useEffect } from "react";

export const PersonDetailsContext = React.createContext();

export const PersonDetailsProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const [error, setError] = useState(false);
  const [controller, setController] = useState(new AbortController());

  useEffect(() => {
    if (!id) {
      setTasks([]);
      setError(false);
      if (loading) {
        controller.abort();
        setController(new AbortController());
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchTasks(id)
      .catch((err) => {
        if (err.name !== "CanceledError") {
          setError(true);
        } else {
          console.log("Was cancelled");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const fetchTasks = async (id) => {
    const personResponse = await axios.get(
      `https://api.lagtinget.ax/api/persons/${id}.json`,
      {
        signal: controller.signal,
      }
    );

    const fetchedTasks = await Promise.all(
      personResponse.data.bindings.map(async ({ organization, role }) => {
        const organizationResponse = await axios.get(
          `https://api.lagtinget.ax/api/organizations/${organization}.json`,
          {
            signal: controller.signal,
          }
        );

        const roleResponse = await axios.get(
          `https://api.lagtinget.ax/api/roles/${role}.json`,
          {
            signal: controller.signal,
          }
        );

        return Promise.resolve({
          organization: organizationResponse.data.title,
          role: roleResponse.data.title,
        });
      })
    );
    setTasks(fetchedTasks);
  };

  return (
    <PersonDetailsContext.Provider value={{ tasks, loading, error, setId }}>
      {children}
    </PersonDetailsContext.Provider>
  );
};
