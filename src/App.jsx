import { allCharacters } from "../data/data";
import CharecterDetail from "../components/CharecterDetail";
import CharecterList from "../components/CharecterList";
import Navbar, { SearchField, SearchResult } from "../components/Navbar";
import "./App.css";
import { useEffect, useState } from "react";
import { ErrorIcon, Toaster } from "react-hot-toast";
import { Favourites } from "../components/Navbar";
import Modal from "../components/Modal";
import useCharacters from "./hooks/UseCharacters";
import useLocalStoragr from "./hooks/useLocalStorage";
import useLocalStorage from "./hooks/useLocalStorage";

//dependency array=>role :when to run effect function
//1.useEffect(()=>{})=> runs effect function on every render!!!!(DO NOT USE THAT)
//2.useEffect(()=>{},[]) => runs effect function on mount
//3.useEffect(()=>{},[states,props]) =>runs effect function when states or props are being changed
//: useEffect(()=>{if(query)...},[query])
//! when a state changes=>1.component re-renders and is painted on browser 2.useEffect runs

function App() {
  // const [characters, setCharacters] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);
  const { isLoading, characters } = useCharacters(
    "https://rickandmortyapi.com/api/character/?name",
    query
  );
  const [selectedId, setSelectedId] = useState(null);
  const [favourites, setFavourites] = useLocalStorage("FAVOURITES", []);
  // const [favourites, setFavourites] = useState(
  //   () => JSON.parse(localStorage.getItem("FAVOURITES")) || []
  // );
  // useEffect(() => {
  //   localStorage.setItem("FAVOURITES", JSON.stringify(favourites));
  // }, [favourites]);

  const handleSelectCharacter = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };
  const handleAddFavourite = (character) => {
    setFavourites((prevFav) => [...prevFav, character]);
  };
  const isAddedToFavourite = favourites
    .map((fav) => fav.id)
    .includes(selectedId);

  const handleDeleteFavourite = (id) => {
    //console.log(id);
    setFavourites((prevFav) => prevFav.filter((fav) => fav.id !== id));
  };

  // clean up function:
  useEffect(() => {
    const interval = setInterval(() => setCount((c) => c + 1), 1000);
    return () => {
      clearInterval(interval);
    };
    //or return function(){};
  }, [count]);

  return (
    <div className="app">
      <div style={{ color: "#fff" }}>{count}</div>
      <Toaster />
      <Navbar>
        <SearchField query={query} setQuery={setQuery} />
        <SearchResult numOfSearchResult={characters.length} />
        <Favourites
          favourites={favourites}
          onDeleteFavourite={handleDeleteFavourite}
        />
      </Navbar>
      <Main>
        <CharecterList
          selectedId={selectedId}
          characters={characters}
          isLoading={isLoading}
          onSelectCharacter={handleSelectCharacter}
        />
        <CharecterDetail
          onAddFavourite={handleAddFavourite}
          selectedId={selectedId}
          isAddedToFavourite={isAddedToFavourite}
        />
      </Main>
    </div>
  );
}
export default App;

function Main({ children }) {
  return <div className="main">{children}</div>;
}

//!Do not fetch data like this:(Don't setState in render logic!!!!)=>Do it in 1.eventhandlers 2.useEffect
// fetch("https://rickandmortyapi.com/api/character")
//   .then((res) => res.json())
//   .then((data) => console.log(data));
//.then((data) => setCharacters(data.results));
//!1.useEffect(with then catch):
// useEffect(() => {
//setIsLoading(true);
//   fetch("https://rickandmortyapi.com/api/character")
//     .then((res) => res.json())
//     .then((data) => {
//setCharacters(data.results.slice(0, 5)));
// setIsLoading(false);
//});
// }, []); //loads data at first
//error handling
// useEffect(() => {
//   setIsLoading(true);
//   fetch("https://rickandmortyapi.com/api/characterss")
//     .then((res) => {
//       if (!res.ok) throw new Error("someyhing went wrong!");
//       return res.json();
//     })
//     .then((data) => {
//       setCharacters(data.results.slice(0, 5));
//       //setIsLoading(false);
//     })
//     .catch((error) => {
//       //setIsLoading(false);
//       toast.error(error.message); //! in real projects :toast.error(error.response.data.message)
//     })
//     .finally(() => {
//       setIsLoading(false);
//     });
// }, []);
//axios
// useEffect(() => {
//   setIsLoading(true);
//   axios
//     .get("https://rickandmortyapi.com/api/character")
//     .then((res) => {
//       setCharacters(res.data.results.slice(0, 5));
//       //or .then(({data}) => {
//       //setCharacters(data.results.slice(0, 5));
//       //setIsLoading(false);
//     })
//     .catch((error) => {
//       //setIsLoading(false);
//       //console.log(error);
//       toast.error(error.response.data.error);
//     })
//     .finally(() => {
//       setIsLoading(false);
//     });
// }, []);
//!useEffect(with async await):
//useEffect(() => {
//async function fetchData() {
//setIsLoading(true);
//const res = await fetch("https://rickandmortyapi.com/api/character");
//const data = await res.json();
//setCharacters(data.results.slice(0, 2));
//setIsLoading(false);
// console.log(data.results); agar console.log(characters)=> [] array khali mide!!!!
//}
//fetchData();
//}, []); //loads data at first

//axios
// useEffect(() => {
//   async function fetchData() {
//     try {
//       setIsLoading(true);
//       const { data } = await axios.get(
//         "https://rickandmortyapi.com/api/character"
//       );
//       //console.log(res.data);
//       setCharacters(data.results.slice(0, 2));
//       // setIsLoading(false);
//     } catch (error) {
//       //setIsLoading(false);
//       //console.log(error.message);
//       toast.error(error.message); //! in real projects :toast.error(error.response.data.message)
//     } finally {
//       setIsLoading(false);
//     }
//   }
//   fetchData();
// }, []);

//error handling
// useEffect(() => {
//   async function fetchData() {
//     try {
//       setIsLoading(true);
//       const res = await fetch("https://rickandmortyapi.com/api/characterss");
//       //console.log(res);
//       if (!res.ok) throw new Error("Something went wrong!");
//       const data = await res.json();
//       setCharacters(data.results.slice(0, 2));
//       // setIsLoading(false);
//     } catch (error) {
//       //setIsLoading(false);
//       //console.log(error.message);
//       toast.error(error.message); //! in real projects :toast.error(error.response.data.message)
//     } finally {
//       setIsLoading(false);
//     }
//   }
//   fetchData();
// }, []);

// useEffect(() => {
//   console.log("call effect on every render");
// });
// useEffect(() => {
//   console.log("call effect on first mount");
// }, []);
// useEffect(() => {
//   console.log("call effect when query changes");
// }, [query]);
//console.log("rendering component");

//!2.event handlers
// const loadCharacter = () => {
//   fetch("https://rickandmortyapi.com/api/character")
//     .then((res) => res.json())
//     .then((data) => setCharacters(data.results.slice(0, 3)));
// }; // loads data just when clicked!
