import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useCharacters(url, query) {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${url}=${query}`, { signal });
        setCharacters(data.results.slice(0, 5));
      } catch (error) {
        //       //fetch=>error.name === "AbortError"  if (error.name !== "AbortError") {}
        //       // axios =>axios.isCancel()
        if (!axios.isCancel()) {
          setCharacters([]); //if incorrect=> deletes characters
          toast.error(error.response.data.error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    // if (query.length < 3) {
    //   setCharacters([]);
    //   return;
    // }
    fetchData();
    return () => {
      controller.abort();
    };
  }, [query]);
  return { isLoading, characters };
}
