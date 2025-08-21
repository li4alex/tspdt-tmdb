import { useState, useEffect } from 'react';

export default function useFetchJso(url, limit) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const response = await fetch(url);                
      const json = await response.json();
      const data = limit ? json.slice(0, limit) : json;
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, [url, limit]);
  return { data, loading };
};